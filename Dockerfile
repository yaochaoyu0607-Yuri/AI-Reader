FROM node:20-alpine AS builder
WORKDIR /app
RUN sed -i 's#dl-cdn.alpinelinux.org#mirrors.tencent.com#g' /etc/apk/repositories \
 && apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npmmirror.com \
 && npm config set sqlite3_binary_host_mirror https://npmmirror.com/mirrors/sqlite3 \
 && npm ci --omit=dev

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY src ./src
COPY public ./public
RUN mkdir -p /app/data && chown -R node:node /app
USER node
EXPOSE 8787
CMD ["node", "src/server.js"]
