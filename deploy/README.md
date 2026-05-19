# 部署到 chovy.online

目标服务器：腾讯云轻量 Ubuntu，公网 IP `82.156.243.226`，域名 `chovy.online` 已解析。

## 一、本机准备（提交代码）

```bash
cd /Users/yaochaoyu1/Desktop/个人/ai知识库/AI-Reader
git add -A
git commit -m "重构: 删除 AI 模块, 加登录鉴权, Docker 化"
git push origin main
```

## 二、服务器初始化

SSH 登录（用密钥 `lhkp-6nxi9edm`）：

```bash
ssh -i ~/path/to/lhkp-6nxi9edm.pem ubuntu@82.156.243.226
```

安装 Docker + Compose（一次性）：

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 git
sudo usermod -aG docker $USER
# 退出重新登录使 docker 组生效
exit
```

重新登录后：

```bash
docker version && docker compose version
```

确认腾讯云控制台 → 轻量服务器 → 防火墙：放行 **80、443**（你说已放行）。

## 三、拉代码 + 配置 .env

```bash
mkdir -p ~/apps && cd ~/apps
git clone https://github.com/yaochaoyu0607-Yuri/AI-Reader.git
cd AI-Reader

cp .env.example .env
# 用 nano 或 vim 编辑 .env：
#   APP_PASSWORD=你的强密码    ← 务必改，建议 12+ 位
#   SESSION_SECRET=$(openssl rand -hex 32)   ← 用命令生成填进去
#   COOKIE_SECURE=true        ← 生产 HTTPS 下必须 true
nano .env
```

生成 SESSION_SECRET 的一行命令：

```bash
echo "SESSION_SECRET=$(openssl rand -hex 32)" >> .env
```

## 四、首次签 HTTPS 证书（bootstrap）

Let's Encrypt 需要 80 端口能访问到才能签证书。先用 bootstrap nginx 配置只起 HTTP：

```bash
# 临时替换 nginx 配置为 bootstrap（只监听 80，不要求证书存在）
mkdir -p deploy/certbot/conf deploy/certbot/www
cp deploy/nginx/app.conf deploy/nginx/app.conf.bak
cp deploy/nginx-bootstrap.conf deploy/nginx/app.conf

# 只起 nginx
docker compose up -d nginx

# 浏览器访问 http://chovy.online 应看到 "bootstrap: waiting for certificate"
# 如果看不到，先排查 DNS 和防火墙再继续

# 签证书（首次用 --staging 测试通过后再去 --staging 跑正式的，避免限流）
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  --email 你的邮箱@xxx.com \
  --agree-tos --no-eff-email \
  --staging \
  -d chovy.online

# staging 成功后，删掉 staging 证书，签正式
sudo rm -rf deploy/certbot/conf/live deploy/certbot/conf/archive deploy/certbot/conf/renewal
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  --email 你的邮箱@xxx.com \
  --agree-tos --no-eff-email \
  -d chovy.online
```

证书会写到 `deploy/certbot/conf/live/chovy.online/`。

## 五、切回正式 nginx 配置 + 启动全部服务

```bash
# 还原带 HTTPS 的配置
cp deploy/nginx/app.conf.bak deploy/nginx/app.conf
rm deploy/nginx/app.conf.bak

# 启动全部服务
docker compose up -d --build

# 检查
docker compose ps
docker compose logs ai-reader --tail 30
curl -k https://chovy.online/healthz
```

浏览器打开 `https://chovy.online`，应该跳到登录页。输入 .env 里的 `APP_PASSWORD` 登录。

## 六、we-mp-rss 首次配置

`we-mp-rss` 是单独的服务，需要单独扫码登录公众号。访问需要走 nginx 反代或直接 SSH 转发：

```bash
# 本地 SSH 端口转发，在浏览器访问 http://127.0.0.1:8001
ssh -i ~/path/to/key.pem -L 8001:127.0.0.1:8001 ubuntu@82.156.243.226
```

然后本地浏览器开 `http://127.0.0.1:8001`，按 we-mp-rss 的指引扫码登录。

（如果你希望把 we-mp-rss 也通过 nginx 反代暴露出来——比如 `https://chovy.online/rss/`——告诉我，我加一段 location。但因为它没有鉴权，更推荐保持内网只走 SSH 隧道。）

## 七、日常运维

```bash
# 更新代码后重新部署
cd ~/apps/AI-Reader
git pull
docker compose up -d --build ai-reader

# 看日志
docker compose logs -f ai-reader

# 备份 SQLite 数据
tar czf ~/airdata-$(date +%F).tgz data/

# 证书自动续期已经在 certbot 容器里 12 小时一次循环 renew，
# 但 nginx 不会自动 reload 拿到新证书 —— 已在 nginx 容器里加了 6h 重载循环。
```

## 八、可选：systemd 让 docker compose 开机自启

Docker daemon 默认开机自启，`restart: unless-stopped` 已让容器在 reboot 后自动起。
**正常情况不需要额外 systemd unit。**

如果偏好显式管理：

```bash
sudo tee /etc/systemd/system/ai-reader.service > /dev/null <<EOF
[Unit]
Description=AI Reader stack
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/apps/AI-Reader
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ai-reader.service
```

## 排错速查

- **`docker compose up` 报 sqlite3 编译失败**：Dockerfile 已用 `python3 make g++` 多阶段构建，正常不会发生。如果发生，看 `docker compose build ai-reader` 完整日志。
- **登录后立刻跳回登录页**：检查 `.env` 里 `COOKIE_SECURE=true` 且确实在用 HTTPS；HTTP 下 Set-Cookie 不会被浏览器接受。
- **502 Bad Gateway**：`docker compose logs ai-reader` 看是否启动失败，多半是 `.env` 里 `APP_PASSWORD` 没设。
- **证书签发失败**：DNS 是否真的解析到这台机器？`dig chovy.online +short` 应得 `82.156.243.226`。
