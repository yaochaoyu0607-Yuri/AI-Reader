const articleRepo = require("../repositories/articleRepository");
const tagRepo = require("../repositories/tagRepository");
const articleLinkRepo = require("../repositories/articleLinkRepository");
const articleNoteRepo = require("../repositories/articleNoteRepository");
const reflectionRepo = require("../repositories/articleReflectionRepository");

function ensureArticlesPayload(payload) {
  const arr = Array.isArray(payload) ? payload : payload?.articles;
  if (!Array.isArray(arr)) {
    throw new Error("请传入文章数组，格式为 [] 或 { articles: [] }");
  }

  arr.forEach((a, idx) => {
    if (!a?.title || !a?.url || !a?.publish_date || !a?.source) {
      throw new Error(`第 ${idx + 1} 条数据缺少必要字段(title/url/publish_date/source)`);
    }
  });
  return arr;
}

function groupByDate(articles) {
  return articles.reduce((acc, item) => {
    if (!acc[item.publish_date]) acc[item.publish_date] = [];
    acc[item.publish_date].push(item);
    return acc;
  }, {});
}

async function importArticles(payload) {
  const articles = ensureArticlesPayload(payload);
  const result = await articleRepo.importArticles(articles);
  return result;
}

async function getFeed(filter = {}) {
  const articles = await articleRepo.listArticles(filter);

  const withTags = await Promise.all(
    articles.map(async (article) => {
      const tags = await articleRepo.listTagsForArticle(article.id);
      return { ...article, tags };
    })
  );

  return {
    grouped: groupByDate(withTags),
    list: withTags,
  };
}

async function getArticleDetail(id) {
  const article = await articleRepo.getArticleById(id);
  if (!article) return null;
  const tags = await articleRepo.listTagsForArticle(id);
  return { ...article, tags };
}

async function setReadStatus(id, isRead) {
  if (Boolean(isRead)) {
    const reflection = await reflectionRepo.getReflectionByArticleId(id);
    if (!reflection || !String(reflection.content || "").trim()) {
      throw new Error("请先填写感想后再标记为已读");
    }
  }
  const result = await articleRepo.updateReadStatus(id, Boolean(isRead));
  if (result.changes === 0) return null;
  return getArticleDetail(id);
}

async function setStarStatus(id, isStarred) {
  const result = await articleRepo.updateStarStatus(id, Boolean(isStarred));
  if (result.changes === 0) return null;
  return getArticleDetail(id);
}

async function addTagToArticle(articleId, payload) {
  const article = await articleRepo.getArticleById(articleId);
  if (!article) return null;

  let tag = null;
  if (payload.tag_id) {
    tag = await tagRepo.findTagById(payload.tag_id);
    if (!tag) throw new Error("tag_id 不存在");
  } else {
    if (!payload.name) throw new Error("缺少 tag name");
    tag = await tagRepo.createTag({ name: payload.name, type: payload.type || null });
  }

  await articleRepo.attachTag(articleId, tag.id);
  await articleRepo.updateReadStatus(articleId, true);
  return getArticleDetail(articleId);
}

async function removeTagFromArticle(articleId, tagId) {
  await articleRepo.detachTag(articleId, tagId);
  return getArticleDetail(articleId);
}

async function getStats() {
  return articleRepo.getStats();
}

async function listArticleLinks(articleId) {
  const article = await articleRepo.getArticleById(articleId);
  if (!article) return null;
  const links = await articleLinkRepo.listLinksByArticleId(articleId);
  return links.map((l) => ({ ...l, is_collected: Boolean(l.is_collected) }));
}

async function setLinkCollected(articleId, linkId, isCollected) {
  const article = await articleRepo.getArticleById(articleId);
  if (!article) return null;
  const link = await articleLinkRepo.getLinkById(linkId);
  if (!link || Number(link.article_id) !== Number(articleId)) {
    throw new Error("外链不存在");
  }
  await articleLinkRepo.setCollected(linkId, Boolean(isCollected));
  return listArticleLinks(articleId);
}

async function listCollectedLinks() {
  const links = await articleLinkRepo.listCollectedLinks();
  return links.map((l) => ({ ...l, is_collected: Boolean(l.is_collected) }));
}

function normalizeLink(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const u = new URL(url.trim());
    if (!["http:", "https:"].includes(u.protocol)) return null;
    return u.toString();
  } catch (_error) {
    return null;
  }
}

async function addArticleLink(articleId, payload) {
  const article = await articleRepo.getArticleById(articleId);
  if (!article) return null;
  const normalized = normalizeLink(payload?.url);
  if (!normalized) {
    throw new Error("资源链接格式不正确，需以 http/https 开头");
  }
  const domain = new URL(normalized).hostname.toLowerCase();
  await articleLinkRepo.createArticleLink({
    article_id: articleId,
    url: normalized,
    domain,
    title: payload?.title || "",
  });
  return listArticleLinks(articleId);
}

async function removeArticleLink(articleId, linkId) {
  const article = await articleRepo.getArticleById(articleId);
  if (!article) return null;
  const link = await articleLinkRepo.getLinkById(linkId);
  if (!link || Number(link.article_id) !== Number(articleId)) {
    throw new Error("资源链接不存在");
  }
  await articleLinkRepo.deleteLinkById(linkId);
  return listArticleLinks(articleId);
}

async function listArticleNotes(articleId) {
  const article = await articleRepo.getArticleById(articleId);
  if (!article) return null;
  return articleNoteRepo.listNotesByArticleId(articleId);
}

async function addArticleNote(articleId, payload) {
  const article = await articleRepo.getArticleById(articleId);
  if (!article) return null;
  const content = (payload?.content || "").trim();
  if (!content) throw new Error("备注内容不能为空");
  await articleNoteRepo.createArticleNote(articleId, content);
  const notes = await articleNoteRepo.listNotesByArticleId(articleId);
  await articleRepo.updateReadStatus(articleId, true);
  return notes;
}

async function removeArticleNote(articleId, noteId) {
  const article = await articleRepo.getArticleById(articleId);
  if (!article) return null;
  const note = await articleNoteRepo.getNoteById(noteId);
  if (!note || Number(note.article_id) !== Number(articleId)) {
    throw new Error("备注不存在");
  }
  await articleNoteRepo.deleteNoteById(noteId);
  return listArticleNotes(articleId);
}

async function searchNotesCenter(filter = {}) {
  const rows = await articleNoteRepo.listNotesWithArticle({
    keyword: filter.keyword || "",
    tagId: filter.tagId || null,
  });
  return rows.map((row) => ({
    ...row,
    tags: row.tag_names
      ? row.tag_names
          .split(" | ")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  }));
}

async function getArticleReflection(articleId) {
  const article = await articleRepo.getArticleById(articleId);
  if (!article) return null;
  return reflectionRepo.getReflectionByArticleId(articleId);
}

async function saveArticleReflection(articleId, payload) {
  const article = await articleRepo.getArticleById(articleId);
  if (!article) return null;
  const content = (payload?.content || "").trim();
  if (!content) throw new Error("感想不能为空");
  await reflectionRepo.upsertReflection(articleId, content);
  await articleRepo.updateReadStatus(articleId, true);
  return getArticleReflection(articleId);
}

async function searchReflectionsCenter(filter = {}) {
  const rows = await reflectionRepo.listReflectionsWithArticle({
    keyword: filter.keyword || "",
    tagId: filter.tagId || null,
  });
  return rows.map((row) => ({
    ...row,
    tags: row.tag_names
      ? row.tag_names
          .split(" | ")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  }));
}

module.exports = {
  importArticles,
  getFeed,
  getArticleDetail,
  setReadStatus,
  setStarStatus,
  addTagToArticle,
  removeTagFromArticle,
  getStats,
  listArticleLinks,
  addArticleLink,
  removeArticleLink,
  listArticleNotes,
  addArticleNote,
  removeArticleNote,
  searchNotesCenter,
  searchReflectionsCenter,
  getArticleReflection,
  saveArticleReflection,
  setLinkCollected,
  listCollectedLinks,
};
