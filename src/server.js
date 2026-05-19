require("dotenv").config();

const crypto = require("crypto");
const path = require("path");
const express = require("express");
const session = require("express-session");
const rateLimit = require("express-rate-limit");

const { initDb } = require("./db/database");
const articleController = require("./controllers/articleController");
const tagController = require("./controllers/tagController");
const integrationController = require("./controllers/integrationController");
const { requireAuth, buildAuthRouter } = require("./middleware/auth");

const PORT = Number(process.env.PORT || 8787);
const APP_PASSWORD = process.env.APP_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";

if (!APP_PASSWORD) {
  console.error("缺少环境变量 APP_PASSWORD，请参考 .env.example 配置后重试。");
  process.exit(1);
}

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "2mb" }));
app.use(
  session({
    name: "air.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: COOKIE_SECURE,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  })
);

app.use((req, res, next) => {
  if (/\.(html|js|css)$/.test(req.path)) {
    res.set("Cache-Control", "no-store");
  }
  next();
});

app.get("/healthz", (_req, res) => {
  res.json({ success: true, data: { status: "ok", now: new Date().toISOString() } });
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "登录尝试过于频繁，请稍后再试" },
});

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", buildAuthRouter(APP_PASSWORD));

app.use("/api", requireAuth);
app.use("/api/articles", articleController);
app.use("/api/tags", tagController);
app.use("/api/integrations", integrationController);

app.use(
  express.static(path.join(__dirname, "../public"), {
    setHeaders: (res, filePath) => {
      if (/\.(html|js|css)$/.test(filePath)) {
        res.set("Cache-Control", "no-store");
      }
    },
  })
);

app.get("*", (req, res) => {
  res.set("Cache-Control", "no-store");
  const target = req.session && req.session.authed ? "index.html" : "login.html";
  res.sendFile(path.join(__dirname, "../public", target));
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`AI Reader running at http://127.0.0.1:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB init failed:", error);
    process.exit(1);
  });
