const express = require("express");
const articleService = require("../services/articleService");

const router = express.Router();

function ok(res, data) {
  return res.json({ success: true, data });
}

function fail(res, error, code = 400) {
  return res.status(code).json({ success: false, error: error.message || String(error) });
}

router.post("/import", async (req, res) => {
  try {
    const result = await articleService.importArticles(req.body);
    return ok(res, result);
  } catch (error) {
    return fail(res, error, 400);
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await articleService.getFeed({
      tagId: req.query.tag_id ? Number(req.query.tag_id) : null,
      tagName: req.query.tag_name || null,
      keyword: req.query.keyword || "",
      searchType: req.query.search_type || "title",
    });
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.get("/links/collected", async (_req, res) => {
  try {
    const data = await articleService.listCollectedLinks();
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.get("/notes/search", async (req, res) => {
  try {
    const data = await articleService.searchNotesCenter({
      keyword: req.query.keyword || "",
      tagId: req.query.tag_id ? Number(req.query.tag_id) : null,
    });
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.get("/reflections/search", async (req, res) => {
  try {
    const data = await articleService.searchReflectionsCenter({
      keyword: req.query.keyword || "",
      tagId: req.query.tag_id ? Number(req.query.tag_id) : null,
    });
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.get("/:id/reflection", async (req, res) => {
  try {
    const data = await articleService.getArticleReflection(Number(req.params.id));
    if (data === null) return fail(res, new Error("文章不存在"), 404);
    return ok(res, data || null);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.put("/:id/reflection", async (req, res) => {
  try {
    const data = await articleService.saveArticleReflection(Number(req.params.id), req.body || {});
    if (data === null) return fail(res, new Error("文章不存在"), 404);
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 400);
  }
});

router.get("/:id/links", async (req, res) => {
  try {
    const data = await articleService.listArticleLinks(Number(req.params.id));
    if (!data) return fail(res, new Error("文章不存在"), 404);
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.post("/:id/links", async (req, res) => {
  try {
    const data = await articleService.addArticleLink(Number(req.params.id), req.body || {});
    if (!data) return fail(res, new Error("文章不存在"), 404);
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 400);
  }
});

router.get("/:id/notes", async (req, res) => {
  try {
    const data = await articleService.listArticleNotes(Number(req.params.id));
    if (!data) return fail(res, new Error("文章不存在"), 404);
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.post("/:id/notes", async (req, res) => {
  try {
    const data = await articleService.addArticleNote(Number(req.params.id), req.body || {});
    if (!data) return fail(res, new Error("文章不存在"), 404);
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 400);
  }
});

router.delete("/:id/notes/:noteId", async (req, res) => {
  try {
    const data = await articleService.removeArticleNote(
      Number(req.params.id),
      Number(req.params.noteId)
    );
    if (!data) return fail(res, new Error("文章不存在"), 404);
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 400);
  }
});

router.delete("/:id/links/:linkId", async (req, res) => {
  try {
    const data = await articleService.removeArticleLink(
      Number(req.params.id),
      Number(req.params.linkId)
    );
    if (!data) return fail(res, new Error("文章不存在"), 404);
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 400);
  }
});

router.patch("/:id/links/:linkId/collect", async (req, res) => {
  try {
    const data = await articleService.setLinkCollected(
      Number(req.params.id),
      Number(req.params.linkId),
      req.body.is_collected
    );
    if (!data) return fail(res, new Error("文章不存在"), 404);
    return ok(res, data);
  } catch (error) {
    return fail(res, error, 400);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const detail = await articleService.getArticleDetail(Number(req.params.id));
    if (!detail) return fail(res, new Error("文章不存在"), 404);
    return ok(res, detail);
  } catch (error) {
    return fail(res, error, 500);
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const detail = await articleService.setReadStatus(Number(req.params.id), req.body.is_read);
    if (!detail) return fail(res, new Error("文章不存在"), 404);
    return ok(res, detail);
  } catch (error) {
    return fail(res, error, 400);
  }
});

router.patch("/:id/star", async (req, res) => {
  try {
    const detail = await articleService.setStarStatus(
      Number(req.params.id),
      req.body.is_starred
    );
    if (!detail) return fail(res, new Error("文章不存在"), 404);
    return ok(res, detail);
  } catch (error) {
    return fail(res, error, 400);
  }
});

router.post("/:id/tags", async (req, res) => {
  try {
    const detail = await articleService.addTagToArticle(Number(req.params.id), req.body || {});
    if (!detail) return fail(res, new Error("文章不存在"), 404);
    return ok(res, detail);
  } catch (error) {
    return fail(res, error, 400);
  }
});

router.delete("/:id/tags/:tagId", async (req, res) => {
  try {
    const detail = await articleService.removeTagFromArticle(
      Number(req.params.id),
      Number(req.params.tagId)
    );
    if (!detail) return fail(res, new Error("文章不存在"), 404);
    return ok(res, detail);
  } catch (error) {
    return fail(res, error, 400);
  }
});

module.exports = router;
