const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { XMLParser } = require("fast-xml-parser");
const YAML = require("yaml");
const articleRepo = require("../repositories/articleRepository");

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: false,
  trimValues: true,
});

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function parseFeedList(xmlText) {
  const data = parser.parse(xmlText);
  const channel = data?.rss?.channel || {};
  const items = toArray(channel.item);
  return items
    .map((item) => ({
      id: item.id || item.guid || null,
      name: item.title || "未知公众号",
    }))
    .filter((f) => Boolean(f.id));
}

function toDateOnly(input) {
  if (!input) return null;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function toDateOnlyFromUnixSeconds(input) {
  const seconds = Number(input || 0);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  const beijingMillis = seconds * 1000 + 8 * 60 * 60 * 1000;
  return new Date(beijingMillis).toISOString().slice(0, 10);
}

function mapArticleItem(item, fallbackSource) {
  const title = item.title || "";
  const url = item.link || item.guid || "";
  const publishDate = toDateOnly(item.pubDate);
  const source = fallbackSource || "we-mp-rss";
  const description = item.description || "";
  const content = item["content:encoded"] || item.content?.encoded || item.content || description;
  return {
    title,
    url,
    publish_date: publishDate,
    source,
    description,
    content,
    raw_publish_date: item.pubDate || "",
  };
}

function isValidUrl(input) {
  try {
    const u = new URL(input);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (_error) {
    return false;
  }
}

async function fetchXml(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`请求失败: ${url} (${res.status})`);
  }
  return res.text();
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`请求失败: ${url} (${res.status})`);
  }
  return res.json();
}

async function fetchBinary(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`请求失败: ${url} (${res.status})`);
  }
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  const arrayBuffer = await res.arrayBuffer();
  return {
    contentType,
    buffer: Buffer.from(arrayBuffer),
  };
}

function parseArticleXml(xmlText, sourceName) {
  const data = parser.parse(xmlText);
  const channel = data?.rss?.channel || {};
  const items = toArray(channel.item);
  const source = sourceName || channel.title || "we-mp-rss";
  return items.map((item) => mapArticleItem(item, source));
}

function buildAuthConfig(options = {}) {
  return {
    baseUrl: (options.base_url || process.env.WE_MP_RSS_URL || "http://127.0.0.1:8001").replace(/\/+$/, ""),
    username: String(options.username || "admin").trim() || "admin",
    password: String(options.password || "admin@123"),
  };
}

function resolveWeMpRssWxLicPath() {
  const candidates = [
    process.env.WE_MP_RSS_WX_LIC,
    path.resolve(__dirname, "../../../../02_项目数据/we-mp-rss-data/wx.lic"),
    path.resolve(process.cwd(), "../02_项目数据/we-mp-rss-data/wx.lic"),
  ].filter(Boolean);

  return candidates.find((filePath) => fs.existsSync(filePath)) || "";
}

function resolveWeMpRssDbPath() {
  const wxLicPath = resolveWeMpRssWxLicPath();
  const wxLicDir = wxLicPath ? path.dirname(wxLicPath) : "";
  const candidates = [
    wxLicDir ? path.join(wxLicDir, "db.db") : "",
    path.resolve(__dirname, "../../../../02_项目数据/we-mp-rss-data/db.db"),
    path.resolve(process.cwd(), "../02_项目数据/we-mp-rss-data/db.db"),
  ].filter(Boolean);
  return candidates.find((filePath) => fs.existsSync(filePath)) || "";
}

function readSqliteAll(dbPath, sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (openError) => {
      if (openError) {
        reject(openError);
      }
    });
    db.all(sql, params, (error, rows) => {
      db.close();
      if (error) {
        reject(error);
        return;
      }
      resolve(rows || []);
    });
  });
}

async function listFeedsFromLocalDb() {
  const dbPath = resolveWeMpRssDbPath();
  if (!dbPath) return [];
  const rows = await readSqliteAll(
    dbPath,
    `
      SELECT id, mp_name, status
      FROM feeds
      WHERE status = 1
      ORDER BY updated_at DESC, created_at DESC
    `
  );
  return rows
    .map((row) => ({
      id: row.id || "",
      name: row.mp_name || "未知公众号",
    }))
    .filter((item) => Boolean(item.id));
}

function loadWeMpRssWxAuth() {
  const wxLicPath = resolveWeMpRssWxLicPath();
  if (!wxLicPath) return null;

  try {
    const raw = fs.readFileSync(wxLicPath, "utf8");
    const data = YAML.parse(raw) || {};
    const token = String(data.token || "").trim();
    const cookie = String(data.cookie || "").trim();
    if (!token || !cookie) return null;
    return { token, cookie, wxLicPath };
  } catch (_error) {
    return null;
  }
}

function feedIdToFakeId(feedId) {
  const suffix = String(feedId || "").replace(/^MP_WXS_/, "").trim();
  if (!suffix) return "";
  return Buffer.from(suffix, "utf8").toString("base64");
}

async function fetchWechatPublishPage({ fakeId, token, cookie, begin = 0, count = 5 }) {
  const url = new URL("https://mp.weixin.qq.com/cgi-bin/appmsgpublish");
  url.search = new URLSearchParams({
    sub: "list",
    sub_action: "list_ex",
    begin: String(begin),
    count: String(count),
    fakeid: fakeId,
    token,
    lang: "zh_CN",
    f: "json",
    ajax: "1",
  }).toString();

  const res = await fetch(url, {
    headers: {
      Cookie: cookie,
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json,text/plain,*/*",
    },
  });

  if (!res.ok) {
    throw new Error(`微信后台文章列表请求失败 (${res.status})`);
  }

  const data = await res.json();
  if (Number(data?.base_resp?.ret || 0) !== 0) {
    throw new Error(data?.base_resp?.err_msg || "微信后台文章列表请求失败");
  }

  return JSON.parse(data.publish_page || "{}");
}

function mapWechatPublishPage(pageData, fallbackSource, feedId) {
  const groups = Array.isArray(pageData?.publish_list) ? pageData.publish_list : [];
  const mapped = [];

  groups.forEach((group) => {
    const publishInfo = group?.publish_info ? JSON.parse(group.publish_info) : {};
    const articles = Array.isArray(publishInfo?.appmsgex) ? publishInfo.appmsgex : [];
    articles.forEach((item) => {
      mapped.push({
        title: item.title || "",
        url: item.link || "",
        publish_date: toDateOnlyFromUnixSeconds(item.update_time),
        source: fallbackSource || "we-mp-rss",
        description: item.digest || item.title || "",
        content: "",
        raw_publish_date: String(item.update_time || ""),
        wx_aid: item.aid || "",
        wx_fakeid: feedIdToFakeId(feedId),
      });
    });
  });

  return mapped;
}

async function fetchWechatLatestArticles(feedId, sourceName, limit) {
  const wxAuth = loadWeMpRssWxAuth();
  const fakeId = feedIdToFakeId(feedId);
  if (!wxAuth || !fakeId) return [];

  const maxPages = Math.max(1, Math.ceil(Number(limit || 30) / 10) + 1);
  const seen = new Set();
  const results = [];

  for (let pageIndex = 0; pageIndex < maxPages; pageIndex += 1) {
    const pageData = await fetchWechatPublishPage({
      fakeId,
      token: wxAuth.token,
      cookie: wxAuth.cookie,
      begin: pageIndex * 5,
      count: 5,
    });
    const pageItems = mapWechatPublishPage(pageData, sourceName, feedId);
    if (!pageItems.length) break;

    pageItems.forEach((item) => {
      const key = item.url || `${item.wx_aid}:${item.title}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push(item);
      }
    });

    if (results.length >= limit) break;
  }

  return results.slice(0, limit);
}

async function loginWeMpRss(options = {}) {
  const { baseUrl, username, password } = buildAuthConfig(options);
  const body = new URLSearchParams({
    username,
    password,
  });
  const data = await fetchJson(`${baseUrl}/api/v1/wx/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const accessToken = data?.data?.access_token;
  if (!accessToken) {
    throw new Error("we-mp-rss 登录失败，请检查用户名和密码");
  }
  return { baseUrl, accessToken };
}

async function fetchWeMpRssAuthedJson(path, options = {}) {
  const { baseUrl, accessToken } = await loginWeMpRss(options);
  return fetchJson(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function callWeMpRssAuthed(path, options = {}, fetchOptions = {}) {
  const { baseUrl, accessToken } = await loginWeMpRss(options);
  return fetchJson(`${baseUrl}${path}`, {
    ...fetchOptions,
    headers: {
      ...(fetchOptions.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function listSubscribedMps(options = {}) {
  const data = await fetchWeMpRssAuthedJson("/api/v1/wx/mps?limit=200&offset=0", options);
  const list = data?.data?.list || [];
  return list.map((item) => ({
    id: item.id,
    name: item.mp_name || "",
    cover: item.mp_cover || "",
    intro: item.mp_intro || "",
    status: item.status,
    created_at: item.created_at || "",
  }));
}

async function searchMpCandidates(keyword, options = {}) {
  const trimmed = String(keyword || "").trim();
  if (!trimmed) return [];
  const encoded = encodeURIComponent(trimmed);
  const data = await fetchWeMpRssAuthedJson(`/api/v1/wx/mps/search/${encoded}`, options);
  const list = data?.data?.list || [];
  return list.map((item) => ({
    mp_id: item.fakeid || "",
    name: item.nickname || "",
    alias: item.alias || "",
    cover: item.round_head_img || "",
    signature: item.signature || "",
  }));
}

async function addSubscribedMp(payload, options = {}) {
  if (!payload || !payload.mp_name) {
    throw new Error("缺少 mp_name");
  }
  return callWeMpRssAuthed("/api/v1/wx/mps", options, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mp_name: payload.mp_name,
      mp_cover: payload.mp_cover || "",
      mp_id: payload.mp_id || "",
      avatar: payload.avatar || payload.mp_cover || "",
      mp_intro: payload.mp_intro || "",
    }),
  });
}

async function deleteSubscribedMp(mpId, options = {}) {
  const id = String(mpId || "").trim();
  if (!id) throw new Error("缺少 mp_id");
  return callWeMpRssAuthed(`/api/v1/wx/mps/${encodeURIComponent(id)}`, options, {
    method: "DELETE",
  });
}

async function waitForWeMpRssQrImage(options = {}, maxAttempts = 8) {
  for (let i = 0; i < maxAttempts; i += 1) {
    const image = await fetchWeMpRssAuthedJson("/api/v1/wx/auth/qr/image", options);
    if (image?.data === true) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }
  return false;
}

async function fetchWeMpRssQrDataUrl(baseUrl, qrPath, maxAttempts = 8) {
  if (!qrPath) return "";
  const targetUrl = new URL(qrPath, `${baseUrl}/`).toString();
  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      const file = await fetchBinary(targetUrl);
      return `data:${file.contentType};base64,${file.buffer.toString("base64")}`;
    } catch (_error) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return "";
}

async function getWeMpRssAuthStatus(options = {}) {
  const { baseUrl } = buildAuthConfig(options);
  const data = await fetchWeMpRssAuthedJson("/api/v1/wx/auth/qr/status", options);
  return {
    base_url: baseUrl,
    authorized: Boolean(data?.data?.login_status),
    raw: data?.data || null,
    checked_at: new Date().toISOString(),
  };
}

async function getWeMpRssAuthQrCode(options = {}) {
  const { baseUrl } = buildAuthConfig(options);
  const [qr, status] = await Promise.all([
    fetchWeMpRssAuthedJson("/api/v1/wx/auth/qr/code", options),
    getWeMpRssAuthStatus(options),
  ]);
  if (!status.authorized) {
    await waitForWeMpRssQrImage(options);
  }
  const rawQrPath = String(qr?.data?.code || "").trim();
  const qrPath = rawQrPath
    ? rawQrPath.startsWith("/")
      ? rawQrPath
      : `/${rawQrPath}`
    : "";
  return {
    base_url: baseUrl,
    authorized: status.authorized,
    qr_path: qrPath,
    qr_url: qrPath ? new URL(qrPath, `${baseUrl}/`).toString() : "",
    qr_data_url: status.authorized ? "" : await fetchWeMpRssQrDataUrl(baseUrl, qrPath),
    checked_at: status.checked_at,
  };
}

async function listFeeds(baseUrl) {
  const pageSize = 30; // we-mp-rss /rss endpoint max limit is 30
  let offset = 0;
  const allFeeds = [];

  for (let i = 0; i < 20; i += 1) {
    const xml = await fetchXml(`${baseUrl}/rss?limit=${pageSize}&offset=${offset}`);
    const page = parseFeedList(xml);
    allFeeds.push(...page);
    if (page.length < pageSize) break;
    offset += pageSize;
  }

  const dedup = new Map();
  allFeeds.forEach((f) => {
    if (!dedup.has(f.id)) dedup.set(f.id, f);
  });
  try {
    const localFeeds = await listFeedsFromLocalDb();
    localFeeds.forEach((feed) => {
      if (!dedup.has(feed.id)) {
        dedup.set(feed.id, feed);
      }
    });
  } catch (_error) {
    // Ignore local db fallback errors and keep rss result.
  }
  return Array.from(dedup.values());
}

async function upsertArticle(article) {
  const result = await articleRepo.createArticle({
    title: article.title,
    url: article.url,
    publish_date: article.publish_date,
    source: article.source,
    sync_origin: "we-mp-rss",
  });

  let articleId = null;
  if (result.changes === 1) {
    articleId = result.lastID;
  } else {
    const existing = await articleRepo.getArticleByUrl(article.url);
    articleId = existing?.id || null;
    if (articleId && existing?.sync_origin !== "we-mp-rss") {
      await articleRepo.markArticleSyncOrigin(articleId, "we-mp-rss");
    }
  }

  return { ...result, articleId };
}

async function fetchFeedArticles(
  baseUrl,
  feedId,
  sourceName,
  limit,
  offset = 0,
  options = {}
) {
  const refreshRemote = Boolean(options.refreshRemote);
  if (refreshRemote) {
    try {
      const directArticles = await fetchWechatLatestArticles(feedId, sourceName, limit);
      if (directArticles.length > 0) {
        return directArticles;
      }
    } catch (_error) {
      // Fallback to RSS endpoint when direct WeChat fetch is unavailable.
    }
  }

  const endpoint = refreshRemote
    ? `${baseUrl}/rss/${encodeURIComponent(feedId)}/fresh?limit=${limit}&offset=${offset}`
    : `${baseUrl}/rss/${encodeURIComponent(feedId)}/api?limit=${limit}&offset=${offset}`;

  try {
    const xml = await fetchXml(endpoint);
    return parseArticleXml(xml, sourceName);
  } catch (error) {
    if (refreshRemote) {
      throw new Error(
        `刷新公众号“${sourceName || feedId}”失败，可能需要先在 we-mp-rss 重新扫码授权：${
          error.message || String(error)
        }`
      );
    }
    throw error;
  }
}

async function fetchAllFeedArticles(baseUrl, feedId, sourceName, pageSize, options = {}) {
  const normalizedPageSize = Math.max(1, Math.min(100, Number(pageSize || 100)));
  const seen = new Set();
  const allItems = [];

  const pushItems = (items = []) => {
    items.forEach((item) => {
      const key = item.url || `${item.title}:${item.publish_date}:${item.source}`;
      if (seen.has(key)) return;
      seen.add(key);
      allItems.push(item);
    });
  };

  if (options.refreshRemote) {
    const latestItems = await fetchFeedArticles(baseUrl, feedId, sourceName, normalizedPageSize, 0, {
      refreshRemote: true,
    });
    pushItems(latestItems);
  }

  for (let pageIndex = 0; pageIndex < 500; pageIndex += 1) {
    const offset = pageIndex * normalizedPageSize;
    const pageItems = await fetchFeedArticles(baseUrl, feedId, sourceName, normalizedPageSize, offset, {
      refreshRemote: false,
    });
    if (!pageItems.length) break;
    pushItems(pageItems);
    if (pageItems.length < normalizedPageSize) break;
  }

  return allItems;
}

async function syncOneFeed(baseUrl, feedId, sourceName, limit, options = {}) {
  const mapped = options.syncAll
    ? await fetchAllFeedArticles(baseUrl, feedId, sourceName, limit, options)
    : await fetchFeedArticles(baseUrl, feedId, sourceName, limit, 0, options);

  let inserted = 0;
  let ignored = 0;
  let errors = 0;
  const error_items = [];

  for (const article of mapped) {
    if (!article.title || !article.title.trim()) {
      errors += 1;
      error_items.push({
        reason: "title 为空",
        url: article.url || "",
        title: article.title || "",
      });
      continue;
    }

    if (!isValidUrl(article.url)) {
      errors += 1;
      error_items.push({
        reason: "url 非法",
        url: article.url || "",
        title: article.title,
      });
      continue;
    }

    if (!article.publish_date) {
      errors += 1;
      error_items.push({
        reason: "publish_date 非法",
        url: article.url,
        title: article.title,
        raw_publish_date: article.raw_publish_date,
      });
      continue;
    }

    try {
      const result = await upsertArticle(article);
      if (result.changes === 1) inserted += 1;
      else ignored += 1;
    } catch (error) {
      errors += 1;
      error_items.push({
        reason: error.message || "数据库写入失败",
        url: article.url,
        title: article.title,
      });
    }
  }

  return { inserted, ignored, errors, error_items };
}

async function reconcileDeleteMissing(baseUrl, feed) {
  const pageSize = 100;
  let offset = 0;
  const remoteUrls = new Set();

  for (let i = 0; i < 60; i += 1) {
    const page = await fetchFeedArticles(baseUrl, feed.id, feed.name, pageSize, offset);
    page
      .filter((a) => isValidUrl(a.url))
      .forEach((a) => {
        remoteUrls.add(a.url);
      });
    if (page.length < pageSize) break;
    offset += pageSize;
  }

  const localRows = await articleRepo.listArticleIdsBySourceOrigin(feed.name, "we-mp-rss");
  const toDelete = localRows.filter((row) => !remoteUrls.has(row.url)).map((row) => row.id);
  const deletedResult = await articleRepo.deleteArticlesByIds(toDelete);

  return {
    feed_id: feed.id,
    feed_name: feed.name,
    remote_count: remoteUrls.size,
    local_count: localRows.length,
    deleted: deletedResult.changes || 0,
  };
}

async function syncFromWeMpRss(options = {}) {
  const baseUrl = (options.base_url || process.env.WE_MP_RSS_URL || "http://127.0.0.1:8001").replace(/\/+$/, "");
  const perFeedLimit = Math.max(1, Math.min(100, Number(options.limit || 30)));
  const refreshRemote = Boolean(options.refresh_remote);
  const syncAll = Boolean(options.sync_all);

  let targetFeeds = [];
  if (Array.isArray(options.feed_ids) && options.feed_ids.length > 0) {
    const all = await listFeeds(baseUrl);
    const nameMap = new Map(all.map((f) => [f.id, f.name]));
    targetFeeds = options.feed_ids.map((id) => ({ id, name: nameMap.get(id) || id }));
  } else {
    targetFeeds = await listFeeds(baseUrl);
  }

  let totalInserted = 0;
  let totalIgnored = 0;
  let totalErrors = 0;
  let refreshedFeeds = 0;
  const detail = [];
  const error_items = [];

  for (const feed of targetFeeds) {
    const result = await syncOneFeed(baseUrl, feed.id, feed.name, perFeedLimit, {
      refreshRemote,
      syncAll,
    });
    totalInserted += result.inserted;
    totalIgnored += result.ignored;
    totalErrors += result.errors;
    if (refreshRemote) refreshedFeeds += 1;
    error_items.push(...(result.error_items || []).map((e) => ({ ...e, feed_id: feed.id })));
    detail.push({
      feed_id: feed.id,
      feed_name: feed.name,
      refreshed_remote: refreshRemote,
      sync_all: syncAll,
      inserted: result.inserted,
      ignored: result.ignored,
      errors: result.errors,
    });
  }

  return {
    base_url: baseUrl,
    feed_count: targetFeeds.length,
    refresh_remote: refreshRemote,
    sync_all: syncAll,
    refreshed_feeds: refreshedFeeds,
    inserted: totalInserted,
    ignored: totalIgnored,
    errors: totalErrors,
    detail,
    error_items,
    synced_at: new Date().toISOString(),
  };
}

async function reconcileWithWeMpRss(options = {}) {
  const baseUrl = (options.base_url || process.env.WE_MP_RSS_URL || "http://127.0.0.1:8001").replace(/\/+$/, "");
  let targetFeeds = [];

  if (Array.isArray(options.feed_ids) && options.feed_ids.length > 0) {
    const all = await listFeeds(baseUrl);
    const nameMap = new Map(all.map((f) => [f.id, f.name]));
    targetFeeds = options.feed_ids.map((id) => ({ id, name: nameMap.get(id) || id }));
  } else {
    targetFeeds = await listFeeds(baseUrl);
  }

  const detail = [];
  let totalDeleted = 0;
  for (const feed of targetFeeds) {
    const item = await reconcileDeleteMissing(baseUrl, feed);
    detail.push(item);
    totalDeleted += item.deleted;
  }

  return {
    base_url: baseUrl,
    feed_count: targetFeeds.length,
    deleted: totalDeleted,
    detail,
    reconciled_at: new Date().toISOString(),
  };
}

module.exports = {
  syncFromWeMpRss,
  reconcileWithWeMpRss,
  listFeeds,
  getWeMpRssAuthStatus,
  getWeMpRssAuthQrCode,
  listSubscribedMps,
  searchMpCandidates,
  addSubscribedMp,
  deleteSubscribedMp,
};
