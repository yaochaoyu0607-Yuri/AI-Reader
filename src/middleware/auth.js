const crypto = require("crypto");
const express = require("express");

function timingSafeEqualStr(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function requireAuth(req, res, next) {
  if (req.session && req.session.authed) return next();
  return res.status(401).json({ success: false, error: "未登录" });
}

function buildAuthRouter(expectedPassword) {
  const router = express.Router();

  router.get("/me", (req, res) => {
    res.json({ success: true, data: { authed: !!(req.session && req.session.authed) } });
  });

  router.post("/login", (req, res) => {
    const password = (req.body && req.body.password) || "";
    if (!timingSafeEqualStr(password, expectedPassword)) {
      return res.status(401).json({ success: false, error: "密码错误" });
    }
    req.session.authed = true;
    res.json({ success: true });
  });

  router.post("/logout", (req, res) => {
    if (req.session) {
      req.session.destroy(() => res.json({ success: true }));
    } else {
      res.json({ success: true });
    }
  });

  return router;
}

module.exports = { requireAuth, buildAuthRouter };
