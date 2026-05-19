const express = require("express");
const weMpRssSyncService = require("../services/weMpRssSyncService");

const router = express.Router();

function ok(res, data) {
  return res.json({ success: true, data });
}

function fail(res, error, code = 400) {
  return res.status(code).json({ success: false, error: error.message || String(error) });
}

router.get("/we-mp-rss/feeds", async (req, res) => {
  try {
    const baseUrl = req.query.base_url || process.env.WE_MP_RSS_URL || "http://127.0.0.1:8001";
    const data = await weMpRssSyncService.listFeeds(baseUrl.replace(/\/+$/, ""));
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.post("/we-mp-rss/sync", async (req, res) => {
  try {
    const data = await weMpRssSyncService.syncFromWeMpRss(req.body || {});
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.post("/we-mp-rss/auth/status", async (req, res) => {
  try {
    const data = await weMpRssSyncService.getWeMpRssAuthStatus(req.body || {});
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.post("/we-mp-rss/auth/qr", async (req, res) => {
  try {
    const data = await weMpRssSyncService.getWeMpRssAuthQrCode(req.body || {});
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.post("/we-mp-rss/reconcile-delete", async (req, res) => {
  try {
    const data = await weMpRssSyncService.reconcileWithWeMpRss(req.body || {});
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.post("/cleanup-duplicates", async (_req, res) => {
  try {
    const { cleanupDuplicateArticlesByTitleDate } = require("../repositories/articleRepository");
    const data = await cleanupDuplicateArticlesByTitleDate();
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.get("/we-mp-rss/mps", async (_req, res) => {
  try {
    const data = await weMpRssSyncService.listSubscribedMps({});
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.get("/we-mp-rss/mps/search", async (req, res) => {
  try {
    const data = await weMpRssSyncService.searchMpCandidates(req.query.q || "", {});
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.post("/we-mp-rss/mps", async (req, res) => {
  try {
    const data = await weMpRssSyncService.addSubscribedMp(req.body || {}, {});
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 400);
  }
});

router.delete("/we-mp-rss/mps/:mpId", async (req, res) => {
  try {
    const data = await weMpRssSyncService.deleteSubscribedMp(req.params.mpId, {});
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 400);
  }
});

router.post("/we-mp-rss/mps/:mpId/crawl-history", async (req, res) => {
  try {
    const pages = Number(req.query.pages || req.body?.pages || 10);
    const data = await weMpRssSyncService.triggerHistoryCrawl(req.params.mpId, pages, {});
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 400);
  }
});

module.exports = router;
