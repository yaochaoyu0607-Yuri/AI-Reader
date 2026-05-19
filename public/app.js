const state = {
  allArticles: [],
  articles: [],
  tags: [],
  selectedTagId: "",
  selectedSource: "",
  searchKeyword: "",
  searchType: "title",
  showUnreadOnly: false,
  showStarOnly: false,
  manageTagKeyword: "",
  stats: null,
  currentArticle: null,
  pendingDeleteTagId: null,
  reflectionAutoSaveTimer: null,
  reflectionLastSaved: "",
  openDayGroups: new Set(),
  authPollingTimer: null,
  authAfterScanAction: null,
  authQrRetryCount: 0,
  authBusy: false,
  aiPresets: [],
  aiProfiles: [],
  aiCurrentProfileId: "",
  tagSuggestItems: [],
  tagSuggestActiveIdx: -1,
};

const todoState = {
  items: [],
};

const el = {
  stats: document.getElementById("stats"),
  feed: document.getElementById("feed"),
  tagStrip: document.getElementById("tagStrip"),
  articleSourceFilter: document.getElementById("articleSourceFilter"),
  articleSearchType: document.getElementById("articleSearchType"),
  articleSearchInput: document.getElementById("articleSearchInput"),
  articleSearchBtn: document.getElementById("articleSearchBtn"),
  articleSearchClearBtn: document.getElementById("articleSearchClearBtn"),
  articleSearchStatus: document.getElementById("articleSearchStatus"),
  todoStatsText: document.getElementById("todoStatsText"),
  todoInput: document.getElementById("todoInput"),
  todoAddBtn: document.getElementById("todoAddBtn"),
  todoList: document.getElementById("todoList"),
  todoClearDoneBtn: document.getElementById("todoClearDoneBtn"),
  todoClearAllBtn: document.getElementById("todoClearAllBtn"),
  aiSettingsBtn: document.getElementById("aiSettingsBtn"),
  tagManageBtn: document.getElementById("tagManageBtn"),
  notesCenterBtn: document.getElementById("notesCenterBtn"),
  reflectionsCenterBtn: document.getElementById("reflectionsCenterBtn"),
  knowledgeChatBtn: document.getElementById("knowledgeChatBtn"),
  readingPriorityBtn: document.getElementById("readingPriorityBtn"),
  weeklyInsightBtn: document.getElementById("weeklyInsightBtn"),
  unreadOnlyToggle: document.getElementById("unreadOnlyToggle"),
  starOnlyToggle: document.getElementById("starOnlyToggle"),
  syncBaseUrl: document.getElementById("syncBaseUrl"),
  syncUsername: document.getElementById("syncUsername"),
  syncPassword: document.getElementById("syncPassword"),
  syncLimit: document.getElementById("syncLimit"),
  syncFeedIds: document.getElementById("syncFeedIds"),
  syncBtn: document.getElementById("syncBtn"),
  quickSyncBtn: document.getElementById("quickSyncBtn"),
  checkAuthBtn: document.getElementById("checkAuthBtn"),
  showAuthQrBtn: document.getElementById("showAuthQrBtn"),
  authStatusText: document.getElementById("authStatusText"),
  cleanupDupBtn: document.getElementById("cleanupDupBtn"),
  reconcileDeleteBtn: document.getElementById("reconcileDeleteBtn"),
  syncLog: document.getElementById("syncLog"),
  lastSyncText: document.getElementById("lastSyncText"),
  jsonInput: document.getElementById("jsonInput"),
  importBtn: document.getElementById("importBtn"),
  detailDialog: document.getElementById("detailDialog"),
  detailTitle: document.getElementById("detailTitle"),
  detailUrl: document.getElementById("detailUrl"),
  detailMeta: document.getElementById("detailMeta"),
  detailNotes: document.getElementById("detailNotes"),
  newNoteContent: document.getElementById("newNoteContent"),
  addNoteBtn: document.getElementById("addNoteBtn"),
  tagList: document.getElementById("tagList"),
  tagAddPanel: document.getElementById("tagAddPanel"),
  tagInput: document.getElementById("tagInput"),
  tagAddBtn: document.getElementById("tagAddBtn"),
  tagSuggestList: document.getElementById("tagSuggestList"),
  loadTagSuggestionsBtn: document.getElementById("loadTagSuggestionsBtn"),
  applyAllSuggestedTagsBtn: document.getElementById("applyAllSuggestedTagsBtn"),
  tagSuggestionsBox: document.getElementById("tagSuggestionsBox"),
  reflectionInput: document.getElementById("reflectionInput"),
  loadAiSummaryBtn: document.getElementById("loadAiSummaryBtn"),
  loadRelatedKnowledgeBtn: document.getElementById("loadRelatedKnowledgeBtn"),
  askFromArticleBtn: document.getElementById("askFromArticleBtn"),
  aiSummaryBox: document.getElementById("aiSummaryBox"),
  relatedKnowledgeBox: document.getElementById("relatedKnowledgeBox"),
  closeDialogBtn: document.getElementById("closeDialogBtn"),
  tagManageDialog: document.getElementById("tagManageDialog"),
  manageNewTagName: document.getElementById("manageNewTagName"),
  manageCreateTagBtn: document.getElementById("manageCreateTagBtn"),
  manageTagSearchInput: document.getElementById("manageTagSearchInput"),
  manageTagSearchClearBtn: document.getElementById("manageTagSearchClearBtn"),
  manageTagList: document.getElementById("manageTagList"),
  closeTagManageBtn: document.getElementById("closeTagManageBtn"),
  notesCenterDialog: document.getElementById("notesCenterDialog"),
  notesKeywordInput: document.getElementById("notesKeywordInput"),
  notesTagFilter: document.getElementById("notesTagFilter"),
  notesSearchBtn: document.getElementById("notesSearchBtn"),
  notesCenterList: document.getElementById("notesCenterList"),
  closeNotesCenterBtn: document.getElementById("closeNotesCenterBtn"),
  reflectionsCenterDialog: document.getElementById("reflectionsCenterDialog"),
  reflectionsKeywordInput: document.getElementById("reflectionsKeywordInput"),
  reflectionsTagFilter: document.getElementById("reflectionsTagFilter"),
  reflectionsSearchBtn: document.getElementById("reflectionsSearchBtn"),
  reflectionsCenterList: document.getElementById("reflectionsCenterList"),
  closeReflectionsCenterBtn: document.getElementById("closeReflectionsCenterBtn"),
  authQrDialog: document.getElementById("authQrDialog"),
  authQrHint: document.getElementById("authQrHint"),
  authQrImage: document.getElementById("authQrImage"),
  authQrStatus: document.getElementById("authQrStatus"),
  closeAuthQrBtn: document.getElementById("closeAuthQrBtn"),
  knowledgeChatDialog: document.getElementById("knowledgeChatDialog"),
  knowledgeChatInput: document.getElementById("knowledgeChatInput"),
  knowledgeChatSendBtn: document.getElementById("knowledgeChatSendBtn"),
  knowledgeChatAnswer: document.getElementById("knowledgeChatAnswer"),
  closeKnowledgeChatBtn: document.getElementById("closeKnowledgeChatBtn"),
  readingPriorityDialog: document.getElementById("readingPriorityDialog"),
  readingPriorityList: document.getElementById("readingPriorityList"),
  closeReadingPriorityBtn: document.getElementById("closeReadingPriorityBtn"),
  weeklyInsightDialog: document.getElementById("weeklyInsightDialog"),
  weeklyStartInput: document.getElementById("weeklyStartInput"),
  weeklyEndInput: document.getElementById("weeklyEndInput"),
  weeklyGenerateBtn: document.getElementById("weeklyGenerateBtn"),
  weeklyInsightBox: document.getElementById("weeklyInsightBox"),
  closeWeeklyInsightBtn: document.getElementById("closeWeeklyInsightBtn"),
  aiSettingsDialog: document.getElementById("aiSettingsDialog"),
  aiProviderSelect: document.getElementById("aiProviderSelect"),
  aiProviderHint: document.getElementById("aiProviderHint"),
  aiProfileSelect: document.getElementById("aiProfileSelect"),
  aiApplyProfileBtn: document.getElementById("aiApplyProfileBtn"),
  aiDeleteProfileBtn: document.getElementById("aiDeleteProfileBtn"),
  aiProfileNameInput: document.getElementById("aiProfileNameInput"),
  aiSaveProfileBtn: document.getElementById("aiSaveProfileBtn"),
  aiBaseUrlInput: document.getElementById("aiBaseUrlInput"),
  aiApiKeyInput: document.getElementById("aiApiKeyInput"),
  aiApiKeyHint: document.getElementById("aiApiKeyHint"),
  aiChatModelInput: document.getElementById("aiChatModelInput"),
  aiEmbeddingModelInput: document.getElementById("aiEmbeddingModelInput"),
  aiUseLocalEmbeddingInput: document.getElementById("aiUseLocalEmbeddingInput"),
  aiSettingsStatusBox: document.getElementById("aiSettingsStatusBox"),
  aiSaveSettingsBtn: document.getElementById("aiSaveSettingsBtn"),
  aiTestSettingsBtn: document.getElementById("aiTestSettingsBtn"),
  closeAiSettingsBtn: document.getElementById("closeAiSettingsBtn"),
};

function loadTodos() {
  try {
    const raw = localStorage.getItem("todoItems");
    const arr = raw ? JSON.parse(raw) : [];
    todoState.items = Array.isArray(arr) ? arr : [];
  } catch (_error) {
    todoState.items = [];
  }
}

function saveTodos() {
  localStorage.setItem("todoItems", JSON.stringify(todoState.items));
}

function renderTodos() {
  if (!el.todoList || !el.todoStatsText) return;
  const total = todoState.items.length;
  const done = todoState.items.filter((item) => item.done).length;
  el.todoStatsText.textContent = `${total} 项（已完成 ${done}）`;
  if (!total) {
    el.todoList.textContent = "暂无任务";
    return;
  }
  el.todoList.innerHTML = todoState.items
    .map(
      (item) => `<div class="todo-item ${item.done ? "done" : ""}" data-id="${item.id}">
        <input type="checkbox" ${item.done ? "checked" : ""} data-action="toggle" />
        <div class="todo-text">${escapeHtml(item.text)}</div>
        <button class="alt danger" type="button" data-action="delete">删</button>
      </div>`
    )
    .join("");
}

function addTodo(text) {
  const clean = String(text || "").trim();
  if (!clean) return false;
  todoState.items.unshift({
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    text: clean,
    done: false,
    created_at: new Date().toISOString(),
  });
  saveTodos();
  renderTodos();
  return true;
}

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const rawText = await res.text();
  let data = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch (_error) {
    const text = rawText.replace(/\s+/g, " ");
    const isHtml = /<!doctype html>|<html/i.test(text);
    if (isHtml) {
      throw new Error(`接口 ${url} 返回了 HTML 页面而不是 JSON，请重启服务后重试。`);
    }
    throw new Error(`接口 ${url} 返回非 JSON（${res.status} ${res.statusText}）`);
  }
  if (!data || typeof data !== "object") {
    throw new Error(`接口响应格式错误（${res.status} ${res.statusText}）`);
  }
  if (!res.ok || !data.success) {
    throw new Error(data.error || "请求失败");
  }
  return data.data;
}

async function markArticleRead(articleId) {
  await request(`/api/articles/${articleId}/read`, {
    method: "PATCH",
    body: JSON.stringify({ is_read: true }),
  });
}

async function ensureReflectionForRead(articleId) {
  const reflection = await request(`/api/articles/${articleId}/reflection`);
  return Boolean(String(reflection?.content || "").trim());
}

function renderStats(stats) {
  el.stats.textContent = `今日未读 ${stats.unread_today} ｜ 已读 ${stats.read_articles} ｜ 总文章 ${stats.total_articles} ｜ 完成率 ${stats.completion_rate}%`;
}

function getArticleSearchTypeLabel(type = state.searchType) {
  const map = {
    title: "标题",
    tag: "标签",
    reflection: "感想",
    note: "笔记",
  };
  return map[type] || "标题";
}

function getArticleSearchPlaceholder(type = state.searchType) {
  const map = {
    title: "输入标题关键词检索文章",
    tag: "输入标签关键词检索文章",
    reflection: "输入感想关键词检索文章",
    note: "输入笔记关键词检索文章",
  };
  return map[type] || map.title;
}

function getAvailableSources() {
  return [...new Set((state.allArticles || []).map((item) => String(item.source || "").trim()).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "zh-CN")
  );
}

function syncArticleSearchControls() {
  if (el.articleSourceFilter) {
    const sources = getAvailableSources();
    el.articleSourceFilter.innerHTML =
      '<option value="">全部来源</option>' +
      sources
        .map(
          (source) =>
            `<option value="${escapeHtml(source)}" ${
              source === state.selectedSource ? "selected" : ""
            }>${escapeHtml(source)}</option>`
        )
        .join("");
    el.articleSourceFilter.value = state.selectedSource;
  }
  if (el.articleSearchType) {
    el.articleSearchType.value = state.searchType;
  }
  if (el.articleSearchInput) {
    el.articleSearchInput.placeholder = getArticleSearchPlaceholder();
    el.articleSearchInput.value = state.searchKeyword;
  }
}

function hasActiveFeedFilters() {
  return Boolean(
    String(state.searchKeyword || "").trim() ||
      String(state.selectedSource || "").trim() ||
      String(state.selectedTagId || "").trim() ||
      state.showUnreadOnly ||
      state.showStarOnly
  );
}

function includesKeyword(text, keyword) {
  const normalizedKeyword = String(keyword || "").trim().toLowerCase();
  if (!normalizedKeyword) return true;
  return String(text || "").toLowerCase().includes(normalizedKeyword);
}

async function applySearchFilterToArticles(list, keyword) {
  const normalizedKeyword = String(keyword || "").trim();
  if (!normalizedKeyword) return list;

  if (state.searchType === "tag") {
    return list.filter((article) =>
      Array.isArray(article.tags) && article.tags.some((tag) => includesKeyword(tag.name, normalizedKeyword))
    );
  }

  if (state.searchType === "reflection") {
    return list.filter((article) => includesKeyword(article.reflection_content, normalizedKeyword));
  }

  if (state.searchType === "note") {
    const params = new URLSearchParams();
    params.set("keyword", normalizedKeyword);
    if (state.selectedTagId) {
      params.set("tag_id", state.selectedTagId);
    }
    const notes = await request(`/api/articles/notes/search?${params.toString()}`);
    const matchedIds = new Set(notes.map((item) => Number(item.article_id)).filter(Boolean));
    return list.filter((article) => matchedIds.has(Number(article.id)));
  }

  return list.filter((article) => includesKeyword(article.title, normalizedKeyword));
}

function renderArticleSearchStatus() {
  if (!el.articleSearchStatus) return;
  const parts = [];
  const keyword = String(state.searchKeyword || "").trim();
  const selectedTag = state.tags.find((tag) => String(tag.id) === String(state.selectedTagId || ""));

  if (keyword) {
    parts.push(`检索类型：${getArticleSearchTypeLabel()}`);
    parts.push(`关键词：${keyword}`);
  }
  if (state.selectedSource) {
    parts.push(`来源：${state.selectedSource}`);
  }
  if (selectedTag) {
    parts.push(`标签：${selectedTag.name}`);
  }
  if (state.showUnreadOnly) {
    parts.push("只看未读");
  }
  if (state.showStarOnly) {
    parts.push("只看星标");
  }

  if (!parts.length) {
    el.articleSearchStatus.textContent = "统一检索：全部文章";
    return;
  }
  el.articleSearchStatus.textContent = `统一检索：${parts.join(" ｜ ")}（命中 ${buildFilteredList().length} 篇）`;
}

function renderLastSync(ts) {
  if (!ts) {
    el.lastSyncText.textContent = "最近同步：尚未同步";
    return;
  }
  const d = new Date(ts);
  const text = Number.isNaN(d.getTime()) ? ts : d.toLocaleString();
  el.lastSyncText.textContent = `最近同步：${text}`;
}

function getAuthConfig() {
  return {
    base_url: el.syncBaseUrl.value.trim() || "http://127.0.0.1:8001",
    username: el.syncUsername.value.trim() || "admin",
    password: el.syncPassword.value || "admin@123",
  };
}

function persistAuthConfig() {
  localStorage.setItem("weMpRssAuthConfig", JSON.stringify(getAuthConfig()));
}

function renderAuthStatus(text, tone = "normal") {
  el.authStatusText.textContent = text;
  el.authStatusText.dataset.tone = tone;
}

function setButtonBusy(button, busy, busyText) {
  if (!button) return;
  if (!button.dataset.defaultText) {
    button.dataset.defaultText = button.textContent;
  }
  button.disabled = busy;
  button.textContent = busy ? busyText : button.dataset.defaultText;
}

function setAuthBusy(busy, trigger = "manual") {
  state.authBusy = busy;
  setButtonBusy(el.showAuthQrBtn, busy, "正在生成二维码...");
  if (trigger === "quick-sync") {
    setButtonBusy(el.quickSyncBtn, busy, "正在检查授权...");
  }
  if (trigger === "advanced-sync") {
    setButtonBusy(el.syncBtn, busy, "正在检查授权...");
  }
}

function showAuthQrPending(hint = "正在连接 we-mp-rss 并生成二维码，通常需要 5-15 秒，请稍候...") {
  el.authQrHint.textContent = hint;
  el.authQrStatus.textContent = "正在生成二维码...";
  el.authQrStatus.dataset.tone = "warn";
  el.authQrImage.removeAttribute("src");
  el.authQrImage.style.display = "none";
  if (!el.authQrDialog.open) {
    el.authQrDialog.showModal();
  }
}

function stopAuthPolling() {
  if (state.authPollingTimer) {
    clearInterval(state.authPollingTimer);
    state.authPollingTimer = null;
  }
}

async function fetchWeMpRssAuthStatus() {
  return request("/api/integrations/we-mp-rss/auth/status", {
    method: "POST",
    body: JSON.stringify(getAuthConfig()),
  });
}

async function fetchWeMpRssQrCode() {
  return request("/api/integrations/we-mp-rss/auth/qr", {
    method: "POST",
    body: JSON.stringify(getAuthConfig()),
  });
}

async function openAuthQrFlow({ afterScanAction = null, trigger = "manual" } = {}) {
  persistAuthConfig();
  state.authAfterScanAction = afterScanAction;
  showAuthQrPending(
    afterScanAction
      ? "正在准备扫码授权，授权成功后会自动继续更新文章，请稍候..."
      : "正在连接 we-mp-rss 并生成二维码，通常需要 5-15 秒，请稍候..."
  );
  renderAuthStatus("正在请求二维码...", "warn");
  setAuthBusy(true, trigger);
  try {
    const qr = await fetchWeMpRssQrCode();
    renderAuthQrDialog(qr);
    renderAuthStatus(qr.authorized ? "已授权" : "待扫码授权", qr.authorized ? "ok" : "warn");
    if (qr.authorized) {
      stopAuthPolling();
      state.authAfterScanAction = null;
      if (el.authQrDialog.open) {
        el.authQrDialog.close();
      }
      if (afterScanAction) {
        const result = await afterScanAction();
        return { ...qr, sync_result: result };
      }
      return qr;
    }
    startAuthPolling();
    return qr;
  } finally {
    setAuthBusy(false, trigger);
  }
}

function renderAuthQrDialog(data) {
  const qrUrl = data?.qr_data_url || data?.qr_url || "";
  el.authQrHint.textContent = data?.authorized
    ? "当前已经授权，可直接更新文章。"
    : "请使用微信扫码完成授权，授权成功后会自动继续更新文章。";
  el.authQrStatus.textContent = data?.authorized ? "授权已生效" : "等待扫码";
  el.authQrStatus.dataset.tone = data?.authorized ? "ok" : "normal";
  if (qrUrl) {
    state.authQrRetryCount = 0;
    el.authQrImage.src = qrUrl.startsWith("data:")
      ? qrUrl
      : `${qrUrl}${qrUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
    el.authQrImage.style.display = "block";
  } else {
    el.authQrImage.removeAttribute("src");
    el.authQrImage.style.display = "none";
  }
}

el.authQrImage.addEventListener("error", () => {
  const currentSrc = el.authQrImage.getAttribute("src") || "";
  if (!currentSrc) return;
  if (currentSrc.startsWith("data:")) {
    el.authQrStatus.textContent = "二维码加载失败，请重新点击“打开扫码授权”";
    el.authQrStatus.dataset.tone = "warn";
    return;
  }
  if (state.authQrRetryCount >= 6) {
    el.authQrStatus.textContent = "二维码生成较慢，请稍候后再次点击“打开扫码授权”";
    el.authQrStatus.dataset.tone = "warn";
    return;
  }
  state.authQrRetryCount += 1;
  el.authQrStatus.textContent = `二维码生成中，正在重试（${state.authQrRetryCount}/6）...`;
  el.authQrStatus.dataset.tone = "warn";
  setTimeout(() => {
    const baseSrc = currentSrc.split("&t=")[0];
    el.authQrImage.src = `${baseSrc}${baseSrc.includes("?") ? "&" : "?"}t=${Date.now()}`;
  }, 1200);
});

el.authQrImage.addEventListener("load", () => {
  if (!el.authQrDialog.open) return;
  el.authQrStatus.textContent = "二维码已生成，等待扫码";
  el.authQrStatus.dataset.tone = "warn";
});

function startAuthPolling() {
  stopAuthPolling();
  state.authPollingTimer = setInterval(async () => {
    try {
      const status = await fetchWeMpRssAuthStatus();
      if (status.authorized) {
        stopAuthPolling();
        renderAuthStatus("已授权", "ok");
        el.authQrStatus.textContent = "扫码成功，正在继续更新...";
        el.authQrStatus.dataset.tone = "ok";
        const action = state.authAfterScanAction;
        state.authAfterScanAction = null;
        if (el.authQrDialog.open) {
          el.authQrDialog.close();
        }
        if (action) {
          try {
            await action();
          } catch (error) {
            alert(error.message || "更新失败");
          }
        }
      } else {
        renderAuthStatus("待扫码授权", "warn");
        el.authQrStatus.textContent = "二维码已生成，等待扫码";
        el.authQrStatus.dataset.tone = "warn";
      }
    } catch (_error) {
      renderAuthStatus("授权检查失败", "warn");
    }
  }, 3000);
}

function renderSyncLog(result) {
  if (!result) {
    el.syncLog.textContent = "同步日志：暂无";
    return;
  }

  const lines = [
    result.refresh_remote ? "更新完成（已先刷新 we-mp-rss）" : "同步完成",
    `新增 ${result.inserted || 0} 条`,
    `重复 ${result.ignored || 0} 条（已忽略）`,
    `错误 ${result.errors || 0} 条`,
  ];
  if (result.refresh_remote) {
    lines.splice(1, 0, `刷新公众号 ${result.refreshed_feeds || 0} 个`);
  }
  if (Array.isArray(result.error_items) && result.error_items.length > 0) {
    lines.push("错误详情：");
    result.error_items.slice(0, 10).forEach((e, idx) => {
      lines.push(`${idx + 1}. ${e.reason} | ${e.title || "(无标题)"} | ${e.url || "(无URL)"}`);
    });
    if (result.error_items.length > 10) {
      lines.push(`... 还有 ${result.error_items.length - 10} 条错误`);
    }
  }
  el.syncLog.textContent = lines.join("\n");
}

function renderAiSummary(summary) {
  if (!summary || summary.status === "queued") {
    el.aiSummaryBox.textContent = "AI Summary 正在生成，请稍后再试。";
    return;
  }
  const lines = [
    summary.summary || "暂无总结",
    "",
    `核心观点：${(summary.core_arguments || []).join("；") || "暂无"}`,
    `关键概念：${(summary.key_concepts || []).join(" / ") || "暂无"}`,
    `可执行启发：${(summary.actionable_insights || []).join("；") || "暂无"}`,
  ];
  el.aiSummaryBox.textContent = lines.join("\n");
}

function renderRelatedKnowledgeBox(data) {
  if (!data) {
    el.relatedKnowledgeBox.textContent = "暂无关联知识";
    return;
  }
  const lines = [];
  lines.push(`相关文章：${(data.related_articles || []).map((x) => x.title).join("；") || "暂无"}`);
  lines.push(`相关笔记：${(data.related_notes || []).map((x) => x.article_title).join("；") || "暂无"}`);
  lines.push(`支持性观点：${(data.supporting_views || []).map((x) => x.article_title).join("；") || "暂无"}`);
  lines.push(`冲突性观点：${(data.conflicting_views || []).map((x) => x.article_title).join("；") || "暂无"}`);
  el.relatedKnowledgeBox.textContent = lines.join("\n");
}

function renderKnowledgeChatAnswer(data) {
  if (!data) {
    el.knowledgeChatAnswer.textContent = "暂无回答";
    return;
  }
  const sources = (data.sources || [])
    .map((s) => `${s.title || s.type}(${s.article_id || s.note_id || s.thought_id || s.id || ""})`)
    .join("；");
  el.knowledgeChatAnswer.textContent = `${data.answer || "暂无回答"}\n\n来源：${sources || "暂无"}`;
}

function renderReadingPriority(data) {
  if (!Array.isArray(data) || data.length === 0) {
    el.readingPriorityList.innerHTML = "暂无结果";
    return;
  }
  el.readingPriorityList.innerHTML = data
    .map(
      (item) => `
      <article class="note-center-item">
        <h4>${escapeHtml(item.title || `文章 #${item.article_id}`)}</h4>
        <div class="article-meta">${escapeHtml(item.source || "")} ｜ ${escapeHtml(item.publish_date || "")} ｜ 优先级分数：${item.priority_score}</div>
        <div class="note-center-content">${escapeHtml(item.reason || "")}</div>
      </article>
    `
    )
    .join("");
}

function renderWeeklyInsight(data) {
  if (!data) {
    el.weeklyInsightBox.textContent = "暂无周报";
    return;
  }
  const lines = [
    `主题：${(data.themes || []).join(" / ") || "暂无"}`,
    `新想法：${(data.new_ideas || []).join("；") || "暂无"}`,
    `观点变化：${(data.changing_opinions || []).join("；") || "暂无"}`,
    `推荐继续阅读：${(data.recommended_topics || []).join(" / ") || "暂无"}`,
  ];
  el.weeklyInsightBox.textContent = lines.join("\n\n");
}

function renderTagSuggestions(data) {
  const suggestions = data?.suggestions || [];
  if (!suggestions.length) {
    el.tagSuggestionsBox.textContent = "暂无建议，说明当前标签已经比较完整。";
    return;
  }
  el.tagSuggestionsBox.innerHTML = suggestions
    .map(
      (item) => `
      <div class="suggested-tag-item">
        <button class="tag-chip alt suggested-tag-chip" data-suggested-tag="${escapeHtml(item.name)}">${escapeHtml(
          item.name
        )}</button>
        <span class="tag-suggestion-reason">${escapeHtml(item.reason || "")}</span>
      </div>
    `
    )
    .join("");
}

function renderAiSettingsStatus(text) {
  el.aiSettingsStatusBox.textContent = text;
}

function getAiPreset(provider) {
  return state.aiPresets.find((item) => item.provider === provider) || null;
}

function renderAiProviderOptions(presets = []) {
  const list = Array.isArray(presets) && presets.length ? presets : [];
  el.aiProviderSelect.innerHTML = list
    .map((item) => `<option value="${item.provider}">${escapeHtml(item.label)}</option>`)
    .join("");
}

function renderAiProfileOptions(profiles = [], currentProfileId = "") {
  el.aiProfileSelect.innerHTML =
    '<option value="">未选择已保存方案</option>' +
    profiles
      .map(
        (item) =>
          `<option value="${item.id}" ${item.id === currentProfileId ? "selected" : ""}>${escapeHtml(
            item.name
          )} ｜ ${escapeHtml(item.label || item.provider || "")}</option>`
      )
      .join("");
}

function updateAiProviderHint(provider) {
  const preset = getAiPreset(provider);
  if (!preset) {
    el.aiProviderHint.textContent = "选择后会自动带出推荐配置";
    return;
  }
  const embeddingText = preset.use_local_embedding ? "本地 embedding" : preset.embedding_model || "未预设";
  el.aiProviderHint.textContent =
    `${preset.label}：${preset.description || "已自动带出推荐配置"} 推荐聊天模型 ${
      preset.chat_model || "请自行填写"
    }，embedding ${embeddingText}`;
}

function getPresetDefaults(provider) {
  return (
    getAiPreset(provider) ||
    getAiPreset("compatible") || {
      base_url: "https://api.openai.com/v1",
      chat_model: "",
      embedding_model: "",
      use_local_embedding: false,
    }
  );
}

function applyAiProviderPreset(provider, { preserveApiKey = true } = {}) {
  const preset = getPresetDefaults(provider);
  el.aiProviderSelect.value = provider;
  el.aiBaseUrlInput.value = preset.base_url;
  el.aiChatModelInput.value = preset.chat_model;
  el.aiEmbeddingModelInput.value = preset.embedding_model;
  el.aiUseLocalEmbeddingInput.checked = preset.use_local_embedding;
  if (!preserveApiKey) {
    el.aiApiKeyInput.value = "";
  }
  updateAiProviderHint(provider);
}

async function loadAiSettings() {
  const data = await request("/api/ai/settings");
  state.aiPresets = Array.isArray(data.presets) ? data.presets : [];
  state.aiProfiles = Array.isArray(data.profiles) ? data.profiles : [];
  state.aiCurrentProfileId = data.current_profile_id || "";
  renderAiProviderOptions(state.aiPresets);
  renderAiProfileOptions(state.aiProfiles, state.aiCurrentProfileId);
  applyAiProviderPreset(data.provider || "openai");
  el.aiBaseUrlInput.value = data.base_url || "";
  el.aiChatModelInput.value = data.chat_model || "";
  el.aiEmbeddingModelInput.value = data.embedding_model || "";
  el.aiUseLocalEmbeddingInput.checked = Boolean(data.use_local_embedding);
  el.aiApiKeyInput.value = "";
  el.aiProfileNameInput.value = "";
  el.aiApiKeyHint.textContent = data.has_api_key
    ? `已保存 Key：${data.api_key_masked || ""}；留空表示保持不变`
    : "当前未保存 API Key";
  renderAiSettingsStatus(
    `当前配置：${getAiPreset(data.provider)?.label || data.provider} ｜ 聊天模型：${
      data.chat_model || "未设置"
    } ｜ embedding：${
      data.use_local_embedding ? "本地" : data.embedding_model || "未设置"
    }${data.current_profile_id ? " ｜ 已关联已保存方案" : ""}`
  );
  return data;
}

function buildAiSettingsPayload() {
  return {
    provider: el.aiProviderSelect.value,
    base_url: el.aiBaseUrlInput.value.trim(),
    api_key: el.aiApiKeyInput.value.trim(),
    chat_model: el.aiChatModelInput.value.trim(),
    embedding_model: el.aiEmbeddingModelInput.value.trim(),
    use_local_embedding: el.aiUseLocalEmbeddingInput.checked,
    keep_existing_key: true,
    current_profile_id: state.aiCurrentProfileId,
  };
}

function buildAiProfilePayload() {
  return {
    ...buildAiSettingsPayload(),
    name: el.aiProfileNameInput.value.trim(),
    profile_id: el.aiProfileSelect.value || "",
  };
}

function getTagSuggestions(keyword) {
  const q = String(keyword || "").trim().toLowerCase();
  if (!q) return [];
  return (Array.isArray(state.tags) ? state.tags : [])
    .map((tag) => {
      const name = String(tag.name || "");
      const normalized = name.toLowerCase();
      const idx = normalized.indexOf(q);
      if (idx === -1) return null;
      const starts = idx === 0 ? 1 : 0;
      const count = Number(tag.article_count || 0);
      return {
        id: tag.id,
        name,
        article_count: count,
        score: starts * 100000 + (1000 - idx) + count,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function renderTagSuggestList() {
  if (!el.tagSuggestList) return;
  const keyword = String(el.tagInput?.value || "").trim();
  state.tagSuggestActiveIdx = -1;
  state.tagSuggestItems = [];
  if (!keyword) {
    el.tagSuggestList.textContent = "输入后显示建议";
    return;
  }

  const suggestions = getTagSuggestions(keyword);
  state.tagSuggestItems = suggestions;
  if (!suggestions.length) {
    el.tagSuggestList.innerHTML = `<span class="tag-suggest-empty">无匹配标签，添加后将新建：${escapeHtml(
      keyword
    )}</span>`;
    return;
  }

  state.tagSuggestActiveIdx = 0;
  el.tagSuggestList.innerHTML = suggestions
    .map(
      (item, idx) =>
        `<button class="tag-suggest-item ${idx === 0 ? "active" : ""}" type="button" data-suggest-tag-id="${
          item.id
        }" data-suggest-idx="${idx}">${escapeHtml(item.name)} <span class="tag-suggest-meta">(${Number(
          item.article_count || 0
        )})</span></button>`
    )
    .join("");
}

function setActiveSuggestIndex(nextIdx) {
  if (!el.tagSuggestList) return;
  const total = Array.isArray(state.tagSuggestItems) ? state.tagSuggestItems.length : 0;
  if (!total) {
    state.tagSuggestActiveIdx = -1;
    return;
  }
  let idx = Number(nextIdx);
  if (Number.isNaN(idx)) idx = 0;
  if (idx < 0) idx = total - 1;
  if (idx >= total) idx = 0;
  state.tagSuggestActiveIdx = idx;
  Array.from(el.tagSuggestList.querySelectorAll(".tag-suggest-item")).forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.suggestIdx || -1) === idx);
  });
  const activeBtn = el.tagSuggestList.querySelector(`.tag-suggest-item[data-suggest-idx="${idx}"]`);
  if (activeBtn) activeBtn.scrollIntoView({ block: "nearest", inline: "nearest" });
}

async function addTagToCurrentArticleByNameOrId({ name = "", tagId = 0 } = {}) {
  if (!state.currentArticle) return;
  const cleanName = String(name || "").trim();
  const payload = tagId ? { tag_id: Number(tagId) } : { name: cleanName };
  if (!payload.tag_id && !payload.name) return;

  await request(`/api/articles/${state.currentArticle.id}/tags`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (el.tagInput) el.tagInput.value = "";
  renderTagSuggestList();
  await Promise.all([loadAll(), openDetail(state.currentArticle.id)]);
}

function renderTagStrip() {
  const orderedTags = [...state.tags].sort((a, b) => {
    const aPriority = a.name === "待体验" ? 0 : 1;
    const bPriority = b.name === "待体验" ? 0 : 1;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return 0;
  });
  const visibleTags = orderedTags.slice(0, 10);

  const chips = ['<button class="tag-button" data-tag-id="">全部</button>']
    .concat(
      visibleTags.map(
        (t) =>
          `<button class="tag-button ${t.name === "待体验" ? "priority-tag" : ""}" data-tag-id="${t.id}">
            ${t.name} (${t.article_count})
          </button>`
      )
    )
    .join("");
  el.tagStrip.innerHTML = chips;

  Array.from(el.tagStrip.querySelectorAll(".tag-button")).forEach((btn) => {
    if (String(btn.dataset.tagId || "") === String(state.selectedTagId || "")) {
      btn.classList.add("active");
    }
  });

  el.notesTagFilter.innerHTML =
    '<option value="">全部标签</option>' +
    state.tags.map((t) => `<option value="${t.id}">${t.name}</option>`).join("");

  el.reflectionsTagFilter.innerHTML =
    '<option value="">全部标签</option>' +
    state.tags.map((t) => `<option value="${t.id}">${t.name}</option>`).join("");
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHttpUrl(url) {
  try {
    const u = new URL(String(url || "").trim());
    if (!["http:", "https:"].includes(u.protocol)) return null;
    return u.toString();
  } catch (_error) {
    return null;
  }
}

function linkifyText(text) {
  const input = String(text || "");
  const parts = input.split(/(https?:\/\/[^\s<>"']+)/g);
  return parts
    .map((part, idx) => {
      if (idx % 2 === 1) {
        const safeUrl = sanitizeHttpUrl(part);
        if (!safeUrl) return escapeHtml(part);
        return `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noreferrer">${escapeHtml(
          part
        )}</a>`;
      }
      return escapeHtml(part);
    })
    .join("")
    .replace(/\n/g, "<br>");
}

function articleCard(item) {
  const tags = (item.tags || [])
    .map((t) => `<span class="tag-chip">${t.name}</span>`)
    .join("");
  const readClass = item.is_read ? "read" : "";
  const starClass = item.is_starred ? "on" : "";
  const reflection = String(item.reflection_content || "").trim();
  const reflectionHover = reflection
    ? `<span class="reflection-info">
        <button class="info-dot" type="button" aria-label="查看感想">i</button>
        <span class="hover-reflection">${escapeHtml(reflection)}</span>
      </span>`
    : "";

  return `
    <article class="article-card ${readClass}">
      <div class="article-top">
        <span class="star-icon ${starClass}">${item.is_starred ? "★" : "☆"}</span>
        <a class="article-title" target="_blank" rel="noreferrer" href="${item.url}">${item.title}</a>
        ${reflectionHover}
      </div>
      <div class="article-meta">来源：${item.source} ｜ 发布：${item.publish_date}</div>
      <div class="article-meta">${tags || "无标签"}</div>
      <div class="article-actions">
        <button class="toggle-pill ${item.is_read ? "read" : ""}" data-action="toggle-read" data-id="${item.id}">
          ${item.is_read ? "已读" : "未读"}
        </button>
        <button class="text-action" data-action="toggle-star" data-id="${item.id}">
          ${item.is_starred ? "取消星标" : "设为星标"}
        </button>
        <button class="text-action" data-action="detail" data-id="${item.id}">详情</button>
      </div>
    </article>
  `;
}

function buildFilteredList() {
  let list = [...state.articles];
  if (state.selectedSource) {
    list = list.filter((a) => String(a.source || "") === state.selectedSource);
  }
  if (state.showUnreadOnly) {
    list = list.filter((a) => !a.is_read);
  }
  if (state.showStarOnly) {
    list = list.filter((a) => a.is_starred);
  }
  return list;
}

function groupByDate(list) {
  return list.reduce((acc, item) => {
    if (!acc[item.publish_date]) acc[item.publish_date] = [];
    acc[item.publish_date].push(item);
    return acc;
  }, {});
}

function snapshotOpenDayGroups() {
  const groups = Array.from(el.feed.querySelectorAll("details.day-group[data-date]"));
  if (!groups.length) return;
  state.openDayGroups = new Set(
    groups
      .filter((g) => g.open)
      .map((g) => g.dataset.date)
      .filter(Boolean)
  );
}

function renderFeed() {
  snapshotOpenDayGroups();
  const filtered = buildFilteredList();
  renderArticleSearchStatus();
  const grouped = groupByDate(filtered);
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  if (!dates.length) {
    if (hasActiveFeedFilters()) {
      const keyword = String(state.searchKeyword || "").trim();
      if (keyword) {
        el.feed.innerHTML = `<div class="empty-state">没有匹配${escapeHtml(
          getArticleSearchTypeLabel()
        )}关键词“${escapeHtml(keyword)}”的文章。</div>`;
      } else {
        el.feed.innerHTML = '<div class="empty-state">当前筛选条件下没有匹配文章。</div>';
      }
      return;
    }
    if (state.stats?.total_articles > 0 && state.stats?.read_articles === state.stats?.total_articles) {
      el.feed.innerHTML = '<div class="empty-state">全部文章已读，做得不错。</div>';
    } else {
      el.feed.innerHTML = '<div class="empty-state">今天还没有同步文章。</div>';
    }
    return;
  }

  el.feed.innerHTML = dates
    .map((d, idx) => {
      const items = grouped[d] || [];
      const unread = items.filter((a) => !a.is_read).length;
      const read = items.length - unread;
      const rate = items.length === 0 ? 0 : Math.round(((items.length - unread) / items.length) * 100);
      const shouldOpen = state.openDayGroups.size
        ? state.openDayGroups.has(d)
        : idx === 0;
      return `
      <details class="day-group" data-date="${d}" ${shouldOpen ? "open" : ""}>
        <summary class="day-title">
          <span>${d}</span>
          <span class="day-progress-wrap">
            <span class="day-progress-text">${read}/${items.length}</span>
            <span class="day-progress-bar"><span style="width:${rate}%"></span></span>
          </span>
        </summary>
        <div class="day-articles">
          ${items.map(articleCard).join("")}
        </div>
      </details>
    `;
    })
    .join("");
}

async function loadAll() {
  const params = new URLSearchParams();
  if (state.selectedTagId) {
    params.set("tag_id", state.selectedTagId);
  }
  const articleUrl = params.toString() ? `/api/articles?${params.toString()}` : "/api/articles";
  const [stats, tags, feed] = await Promise.all([
    request("/api/tags/stats"),
    request("/api/tags"),
    request(articleUrl),
  ]);
  state.stats = stats;
  state.tags = tags;
  state.allArticles = Array.isArray(feed.list) ? feed.list : [];
  if (state.selectedSource && !getAvailableSources().includes(state.selectedSource)) {
    state.selectedSource = "";
  }
  state.articles = await applySearchFilterToArticles(state.allArticles, state.searchKeyword);

  syncArticleSearchControls();
  renderStats(stats);
  renderTagStrip();
  renderFeed();
}

function buildSyncPayload({ quick = false } = {}) {
  persistAuthConfig();
  if (quick) {
    return {
      base_url: el.syncBaseUrl.value.trim() || "http://127.0.0.1:8001",
      username: el.syncUsername.value.trim() || "admin",
      password: el.syncPassword.value || "admin@123",
      limit: 30,
      feed_ids: [],
      refresh_remote: true,
    };
  }
  const rawFeedIds = el.syncFeedIds.value.trim();
  const feedIds = rawFeedIds
    ? rawFeedIds
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return {
    base_url: el.syncBaseUrl.value.trim() || "http://127.0.0.1:8001",
    username: el.syncUsername.value.trim() || "admin",
    password: el.syncPassword.value || "admin@123",
    limit: Number(el.syncLimit.value || 30),
    feed_ids: feedIds,
    refresh_remote: true,
  };
}

async function runSync({ quick = false } = {}) {
  const payload = buildSyncPayload({ quick });
  const result = await request("/api/integrations/we-mp-rss/sync", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  localStorage.setItem("lastSyncAt", result.synced_at || new Date().toISOString());
  renderLastSync(result.synced_at);
  renderSyncLog(result);
  return result;
}

async function loadAiSummary(articleId) {
  const data = await request(`/api/ai/articles/${articleId}/summary`);
  renderAiSummary(data);
  if (data?.status === "queued") {
    setTimeout(() => {
      loadAiSummary(articleId).catch(() => {});
    }, 2500);
  }
  return data;
}

async function loadRelatedKnowledge(articleId) {
  const data = await request(`/api/ai/related-knowledge?articleId=${articleId}`);
  renderRelatedKnowledgeBox(data);
  return data;
}

async function runKnowledgeChat(query) {
  const data = await request("/api/ai/knowledge-chat", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
  renderKnowledgeChatAnswer(data);
  return data;
}

async function loadReadingPriority() {
  const data = await request("/api/ai/reading-priority");
  renderReadingPriority(data);
  return data;
}

async function generateWeeklyInsight() {
  const data = await request("/api/ai/weekly-report", {
    method: "POST",
    body: JSON.stringify({
      dateRange: {
        start: el.weeklyStartInput.value.trim(),
        end: el.weeklyEndInput.value.trim(),
      },
    }),
  });
  renderWeeklyInsight(data);
  return data;
}

async function loadTagSuggestions(articleId) {
  const data = await request(`/api/ai/articles/${articleId}/tag-suggestions`);
  renderTagSuggestions(data);
  return data;
}

async function applySuggestedTags(articleId, tags) {
  const data = await request(`/api/ai/articles/${articleId}/apply-tag-suggestions`, {
    method: "POST",
    body: JSON.stringify({ tags }),
  });
  return data;
}

async function performSyncFlow({ quick = false } = {}) {
  persistAuthConfig();
  const executeSync = async () => {
    const result = await runSync({ quick });
    alert(`更新完成：新增 ${result.inserted} / 重复 ${result.ignored} / 错误 ${result.errors}`);
    await loadAll();
    return result;
  };

  const status = await fetchWeMpRssAuthStatus();
  if (status.authorized) {
    renderAuthStatus("已授权", "ok");
    return executeSync();
  }

  renderAuthStatus("待扫码授权", "warn");
  const qr = await openAuthQrFlow({
    afterScanAction: executeSync,
    trigger: quick ? "quick-sync" : "advanced-sync",
  });

  if (qr.authorized) {
    renderAuthStatus("已授权", "ok");
    return qr.sync_result || qr;
  }
  return null;
}

async function openDetail(articleId) {
  const detail = await request(`/api/articles/${articleId}`);
  state.currentArticle = detail;

  el.detailTitle.textContent = detail.title;
  el.detailUrl.href = detail.url;
  el.detailUrl.textContent = detail.url;
  el.detailMeta.textContent = `${detail.source} ｜ ${detail.publish_date}`;

  el.tagList.innerHTML =
    (detail.tags || [])
      .map(
        (t) =>
          `<span class="tag-chip">${t.name} <button data-remove-tag="${t.id}" class="alt">x</button></span>`
      )
      .join("") || "无标签";

  const reflection = await request(`/api/articles/${articleId}/reflection`);
  el.reflectionInput.value = reflection?.content || "";
  state.reflectionLastSaved = (reflection?.content || "").trim();
  if (el.tagInput) el.tagInput.value = "";
  renderTagSuggestList();

  const notes = await request(`/api/articles/${articleId}/notes`);
  renderDetailNotes(notes);
  renderAiSummary(null);
  renderRelatedKnowledgeBox(null);
  el.tagSuggestionsBox.textContent = "暂无 AI 标签建议";
  if (!el.detailDialog.open) {
    el.detailDialog.showModal();
  }
  loadAiSummary(articleId).catch(() => {
    el.aiSummaryBox.textContent = "AI Summary 生成失败，请稍后重试。";
  });
}

function renderDetailNotes(notes) {
  if (!Array.isArray(notes) || notes.length === 0) {
    el.detailNotes.innerHTML = "暂无笔记";
    return;
  }
  el.detailNotes.innerHTML = notes
    .map(
      (n) => `
      <div class="note-row">
        <div class="note-content">${linkifyText(n.content)}</div>
        <button class="alt" data-note-id="${n.id}">删除</button>
      </div>
    `
    )
    .join("");
}

function bindDialogBackdropClose(dialog) {
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      dialog.close();
    }
  });
}

async function saveReflectionForCurrentArticle({ silent = true } = {}) {
  if (!state.currentArticle) return false;
  const content = el.reflectionInput.value.trim();
  if (!content) return false;
  if (content === state.reflectionLastSaved) return true;
  try {
    await request(`/api/articles/${state.currentArticle.id}/reflection`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
    state.reflectionLastSaved = content;
    return true;
  } catch (error) {
    if (!silent) alert(error.message);
    return false;
  }
}

function scheduleReflectionAutoSave() {
  if (state.reflectionAutoSaveTimer) {
    clearTimeout(state.reflectionAutoSaveTimer);
  }
  state.reflectionAutoSaveTimer = setTimeout(() => {
    saveReflectionForCurrentArticle({ silent: true }).catch(() => {});
    state.reflectionAutoSaveTimer = null;
  }, 700);
}

async function closeDetailDialog() {
  if (state.reflectionAutoSaveTimer) {
    clearTimeout(state.reflectionAutoSaveTimer);
    state.reflectionAutoSaveTimer = null;
  }
  await saveReflectionForCurrentArticle({ silent: true });
  el.detailDialog.close();
  try {
    await loadAll();
  } catch (_error) {
    // Ignore refresh errors when closing dialog to avoid blocking UX.
  }
}

function renderManageTagList(tags) {
  const keyword = String(state.manageTagKeyword || "").trim().toLowerCase();
  const filtered = (Array.isArray(tags) ? tags : []).filter((tag) => {
    if (!keyword) return true;
    return String(tag.name || "").toLowerCase().includes(keyword);
  });

  if (!filtered.length) {
    el.manageTagList.innerHTML = keyword ? "没有匹配的标签" : "暂无标签";
    return;
  }

  el.manageTagList.innerHTML = filtered
    .map(
      (t) => `
      <div class="manage-tag-row" data-tag-id="${t.id}">
        <input value="${escapeHtml(t.name)}" data-role="name" />
        <span class="tag-usage">${Number(t.article_count || 0)} 篇</span>
        <button class="alt" data-action="save">保存</button>
        <button class="alt danger" data-action="delete">删除</button>
      </div>
    `
    )
    .join("");
}

async function applyHomeTagFilter(tagId) {
  state.selectedTagId = String(tagId || "");
  await loadAll();
}

async function applyArticleKeywordFilter(keyword) {
  state.searchKeyword = String(keyword || "").trim();
  syncArticleSearchControls();
  await loadAll();
}

async function loadTagManagement() {
  const tags = await request("/api/tags");
  if (el.manageTagSearchInput) {
    el.manageTagSearchInput.value = state.manageTagKeyword;
  }
  renderManageTagList(tags);
}

function renderNotesCenterList(items) {
  if (!Array.isArray(items) || items.length === 0) {
    el.notesCenterList.innerHTML = "暂无匹配笔记";
    return;
  }
  el.notesCenterList.innerHTML = items
    .map(
      (n) => `
      <article class="note-center-item">
        <h4>${escapeHtml(n.article_title)}</h4>
        <div class="article-meta">${escapeHtml(n.source)} ｜ ${escapeHtml(n.publish_date)} ｜ ${
        n.tags?.length ? escapeHtml(n.tags.join(" / ")) : "无标签"
      }</div>
        <div class="note-center-content">${linkifyText(n.content)}</div>
      </article>
    `
    )
    .join("");
}

async function searchNotesCenter() {
  const keyword = el.notesKeywordInput.value.trim();
  const tagId = el.notesTagFilter.value;
  const params = new URLSearchParams();
  if (keyword) params.set("keyword", keyword);
  if (tagId) params.set("tag_id", tagId);
  const query = params.toString();
  const url = query ? `/api/articles/notes/search?${query}` : "/api/articles/notes/search";
  const notes = await request(url);
  renderNotesCenterList(notes);
}

function renderReflectionsCenterList(items) {
  if (!Array.isArray(items) || items.length === 0) {
    el.reflectionsCenterList.innerHTML = "暂无匹配感想";
    return;
  }
  el.reflectionsCenterList.innerHTML = items
    .map(
      (n) => `
      <article class="note-center-item">
        <h4>${escapeHtml(n.article_title)}</h4>
        <div class="article-meta">${escapeHtml(n.source)} ｜ ${escapeHtml(n.publish_date)} ｜ ${
        n.tags?.length ? escapeHtml(n.tags.join(" / ")) : "无标签"
      }</div>
        <div class="note-center-content">${linkifyText(n.content)}</div>
      </article>
    `
    )
    .join("");
}

async function searchReflectionsCenter() {
  const keyword = el.reflectionsKeywordInput.value.trim();
  const tagId = el.reflectionsTagFilter.value;
  const params = new URLSearchParams();
  if (keyword) params.set("keyword", keyword);
  if (tagId) params.set("tag_id", tagId);
  const query = params.toString();
  const url = query
    ? `/api/articles/reflections/search?${query}`
    : "/api/articles/reflections/search";
  const items = await request(url);
  renderReflectionsCenterList(items);
}

el.tagStrip.addEventListener("click", async (e) => {
  const btn = e.target.closest(".tag-button");
  if (!btn) return;
  await applyHomeTagFilter(btn.dataset.tagId || "");
});

if (el.articleSearchBtn) {
  el.articleSearchBtn.addEventListener("click", async () => {
    try {
      await applyArticleKeywordFilter(el.articleSearchInput?.value || "");
    } catch (error) {
      alert(error.message);
    }
  });
}

if (el.articleSearchType) {
  el.articleSearchType.addEventListener("change", async () => {
    state.searchType = el.articleSearchType.value || "title";
    syncArticleSearchControls();
    if (!String(state.searchKeyword || "").trim()) return;
    try {
      await loadAll();
    } catch (error) {
      alert(error.message);
    }
  });
}

if (el.articleSourceFilter) {
  el.articleSourceFilter.addEventListener("change", () => {
    state.selectedSource = el.articleSourceFilter.value || "";
    renderFeed();
  });
}

if (el.articleSearchInput) {
  el.articleSearchInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    try {
      await applyArticleKeywordFilter(el.articleSearchInput.value);
    } catch (error) {
      alert(error.message);
    }
  });
}

if (el.articleSearchClearBtn) {
  el.articleSearchClearBtn.addEventListener("click", async () => {
    try {
      await applyArticleKeywordFilter("");
      if (el.articleSearchInput) {
        el.articleSearchInput.focus();
      }
    } catch (error) {
      alert(error.message);
    }
  });
}

if (el.todoAddBtn && el.todoInput) {
  el.todoAddBtn.addEventListener("click", () => {
    const ok = addTodo(el.todoInput.value);
    if (ok) el.todoInput.value = "";
  });
  el.todoInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const ok = addTodo(el.todoInput.value);
    if (ok) el.todoInput.value = "";
  });
}

if (el.todoList) {
  el.todoList.addEventListener("click", (e) => {
    const row = e.target.closest(".todo-item[data-id]");
    if (!row) return;
    const id = row.dataset.id;
    const action = e.target.getAttribute("data-action");
    if (action !== "delete") return;
    todoState.items = todoState.items.filter((item) => item.id !== id);
    saveTodos();
    renderTodos();
  });
  el.todoList.addEventListener("change", (e) => {
    const row = e.target.closest(".todo-item[data-id]");
    if (!row) return;
    const id = row.dataset.id;
    const action = e.target.getAttribute("data-action");
    if (action !== "toggle") return;
    todoState.items = todoState.items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    saveTodos();
    renderTodos();
  });
}

if (el.todoClearDoneBtn) {
  el.todoClearDoneBtn.addEventListener("click", () => {
    todoState.items = todoState.items.filter((item) => !item.done);
    saveTodos();
    renderTodos();
  });
}

if (el.todoClearAllBtn) {
  el.todoClearAllBtn.addEventListener("click", () => {
    todoState.items = [];
    saveTodos();
    renderTodos();
  });
}

el.unreadOnlyToggle.addEventListener("change", (e) => {
  state.showUnreadOnly = e.target.checked;
  renderFeed();
});

el.starOnlyToggle.addEventListener("change", (e) => {
  state.showStarOnly = e.target.checked;
  renderFeed();
});

el.importBtn.addEventListener("click", async () => {
  try {
    const payload = JSON.parse(el.jsonInput.value || "[]");
    const result = await request("/api/articles/import", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    alert(`导入完成：新增 ${result.inserted}，忽略重复 ${result.ignored}`);
    await loadAll();
  } catch (error) {
    alert(error.message);
  }
});

el.quickSyncBtn.addEventListener("click", async () => {
  try {
    await performSyncFlow({ quick: true });
  } catch (error) {
    alert(error.message);
  }
});

el.syncBtn.addEventListener("click", async () => {
  try {
    await performSyncFlow({ quick: false });
  } catch (error) {
    alert(error.message);
  }
});

el.loadAiSummaryBtn.addEventListener("click", async () => {
  if (!state.currentArticle) return;
  try {
    await loadAiSummary(state.currentArticle.id);
  } catch (error) {
    alert(error.message);
  }
});

el.loadTagSuggestionsBtn.addEventListener("click", async () => {
  if (!state.currentArticle) return;
  try {
    el.tagSuggestionsBox.textContent = "AI 正在分析标签建议...";
    await loadTagSuggestions(state.currentArticle.id);
  } catch (error) {
    alert(error.message);
  }
});

el.applyAllSuggestedTagsBtn.addEventListener("click", async () => {
  if (!state.currentArticle) return;
  const nodes = Array.from(el.tagSuggestionsBox.querySelectorAll("[data-suggested-tag]"));
  const tags = nodes.map((node) => node.getAttribute("data-suggested-tag")).filter(Boolean);
  if (!tags.length) {
    alert("当前没有可应用的建议标签");
    return;
  }
  try {
    await applySuggestedTags(state.currentArticle.id, tags);
    await loadAll();
    await openDetail(state.currentArticle.id);
    alert(`已应用 ${tags.length} 个建议标签`);
  } catch (error) {
    alert(error.message);
  }
});

el.loadRelatedKnowledgeBtn.addEventListener("click", async () => {
  if (!state.currentArticle) return;
  try {
    await loadRelatedKnowledge(state.currentArticle.id);
  } catch (error) {
    alert(error.message);
  }
});

el.askFromArticleBtn.addEventListener("click", async () => {
  if (!state.currentArticle) return;
  el.knowledgeChatInput.value = `围绕《${state.currentArticle.title}》，结合我已有笔记和感想，帮我理解它和我近期关注主题的联系。`;
  renderKnowledgeChatAnswer(null);
  if (!el.knowledgeChatDialog.open) {
    el.knowledgeChatDialog.showModal();
  }
});

el.checkAuthBtn.addEventListener("click", async () => {
  try {
    persistAuthConfig();
    renderAuthStatus("正在检查授权...", "warn");
    const status = await fetchWeMpRssAuthStatus();
    renderAuthStatus(status.authorized ? "已授权" : "待扫码授权", status.authorized ? "ok" : "warn");
    alert(status.authorized ? "当前 we-mp-rss 已授权" : "当前 we-mp-rss 需要重新扫码授权");
  } catch (error) {
    alert(error.message);
  }
});

el.showAuthQrBtn.addEventListener("click", async () => {
  try {
    await openAuthQrFlow({ trigger: "manual" });
  } catch (error) {
    setAuthBusy(false, "manual");
    el.authQrStatus.textContent = "获取二维码失败，请稍后重试";
    el.authQrStatus.dataset.tone = "warn";
    alert(error.message);
  }
});

el.aiSettingsBtn.addEventListener("click", async () => {
  try {
    renderAiSettingsStatus("正在加载 AI 配置...");
    await loadAiSettings();
    if (!el.aiSettingsDialog.open) {
      el.aiSettingsDialog.showModal();
    }
  } catch (error) {
    alert(error.message);
  }
});

el.aiProviderSelect.addEventListener("change", () => {
  applyAiProviderPreset(el.aiProviderSelect.value, { preserveApiKey: true });
  renderAiSettingsStatus("已应用预设，请确认后保存。");
});

el.aiProfileSelect.addEventListener("change", () => {
  const profile = state.aiProfiles.find((item) => item.id === el.aiProfileSelect.value);
  el.aiProfileNameInput.value = profile?.name || "";
  if (profile) {
    renderAiSettingsStatus(`已选中方案：${profile.name}，点击“使用该方案”即可切换。`);
  }
});

el.aiApplyProfileBtn.addEventListener("click", async () => {
  const profileId = el.aiProfileSelect.value;
  if (!profileId) {
    alert("请先选择一个已保存方案");
    return;
  }
  try {
    renderAiSettingsStatus("正在应用已保存方案...");
    const data = await request("/api/ai/settings/apply-profile", {
      method: "POST",
      body: JSON.stringify({ profile_id: profileId }),
    });
    state.aiCurrentProfileId = data.current_profile_id || "";
    await loadAiSettings();
    renderAiSettingsStatus("已切换到已保存方案。");
  } catch (error) {
    alert(error.message);
    renderAiSettingsStatus(`切换失败：${error.message}`);
  }
});

el.aiDeleteProfileBtn.addEventListener("click", async () => {
  const profileId = el.aiProfileSelect.value;
  if (!profileId) {
    alert("请先选择要删除的方案");
    return;
  }
  if (!window.confirm("确认删除这个已保存方案吗？")) return;
  try {
    renderAiSettingsStatus("正在删除已保存方案...");
    const data = await request(`/api/ai/settings/profiles/${encodeURIComponent(profileId)}`, {
      method: "DELETE",
    });
    state.aiCurrentProfileId = data.current_profile_id || "";
    await loadAiSettings();
    renderAiSettingsStatus("已删除已保存方案。");
  } catch (error) {
    alert(error.message);
    renderAiSettingsStatus(`删除失败：${error.message}`);
  }
});

el.aiSaveProfileBtn.addEventListener("click", async () => {
  if (!el.aiProfileNameInput.value.trim()) {
    alert("请先填写方案名称");
    return;
  }
  try {
    renderAiSettingsStatus("正在保存为可复用方案...");
    const data = await request("/api/ai/settings/profiles", {
      method: "POST",
      body: JSON.stringify(buildAiProfilePayload()),
    });
    state.aiCurrentProfileId = data.current_profile_id || "";
    await loadAiSettings();
    renderAiSettingsStatus("已保存为可复用方案，下次可直接选择。");
  } catch (error) {
    alert(error.message);
    renderAiSettingsStatus(`保存方案失败：${error.message}`);
  }
});

el.aiSaveSettingsBtn.addEventListener("click", async () => {
  try {
    renderAiSettingsStatus("正在保存配置...");
    const data = await request("/api/ai/settings", {
      method: "PUT",
      body: JSON.stringify(buildAiSettingsPayload()),
    });
    state.aiCurrentProfileId = data.current_profile_id || "";
    el.aiApiKeyInput.value = "";
    el.aiApiKeyHint.textContent = data.has_api_key
      ? `已保存 Key：${data.api_key_masked || ""}；留空表示保持不变`
      : "当前未保存 API Key";
    renderAiSettingsStatus(
      `保存成功：${getAiPreset(data.provider)?.label || data.provider} ｜ 聊天模型：${
        data.chat_model || "未设置"
      } ｜ embedding：${data.use_local_embedding ? "本地" : data.embedding_model || "未设置"}`
    );
    renderAiProfileOptions(data.profiles || [], state.aiCurrentProfileId);
  } catch (error) {
    alert(error.message);
  }
});

el.aiTestSettingsBtn.addEventListener("click", async () => {
  try {
    renderAiSettingsStatus("正在测试连接...");
    const data = await request("/api/ai/settings/test", {
      method: "POST",
      body: JSON.stringify(buildAiSettingsPayload()),
    });
    renderAiSettingsStatus(`测试成功：${data.message}`);
  } catch (error) {
    alert(error.message);
    renderAiSettingsStatus(`测试失败：${error.message}`);
  }
});

el.knowledgeChatBtn.addEventListener("click", () => {
  renderKnowledgeChatAnswer(null);
  if (!el.knowledgeChatDialog.open) {
    el.knowledgeChatDialog.showModal();
  }
});

el.knowledgeChatSendBtn.addEventListener("click", async () => {
  const query = el.knowledgeChatInput.value.trim();
  if (!query) {
    alert("请输入问题");
    return;
  }
  try {
    el.knowledgeChatAnswer.textContent = "AI 正在整理答案...";
    await runKnowledgeChat(query);
  } catch (error) {
    alert(error.message);
  }
});

el.readingPriorityBtn.addEventListener("click", async () => {
  try {
    el.readingPriorityList.innerHTML = "AI 正在计算优先级...";
    await loadReadingPriority();
    if (!el.readingPriorityDialog.open) {
      el.readingPriorityDialog.showModal();
    }
  } catch (error) {
    alert(error.message);
  }
});

el.weeklyInsightBtn.addEventListener("click", () => {
  const today = new Date();
  const end = today.toISOString().slice(0, 10);
  const start = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  if (!el.weeklyStartInput.value) el.weeklyStartInput.value = start;
  if (!el.weeklyEndInput.value) el.weeklyEndInput.value = end;
  renderWeeklyInsight(null);
  if (!el.weeklyInsightDialog.open) {
    el.weeklyInsightDialog.showModal();
  }
});

el.weeklyGenerateBtn.addEventListener("click", async () => {
  try {
    el.weeklyInsightBox.textContent = "AI 正在生成周报...";
    await generateWeeklyInsight();
  } catch (error) {
    alert(error.message);
  }
});

el.cleanupDupBtn.addEventListener("click", async () => {
  try {
    const result = await request("/api/integrations/cleanup-duplicates", {
      method: "POST",
    });
    alert(`清理完成：删除 ${result.deleted} 条（候选 ${result.duplicate_candidates}）`);
    await loadAll();
  } catch (error) {
    alert(error.message);
  }
});

el.reconcileDeleteBtn.addEventListener("click", async () => {
  try {
    const rawFeedIds = el.syncFeedIds.value.trim();
    const feedIds = rawFeedIds
      ? rawFeedIds
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const result = await request("/api/integrations/we-mp-rss/reconcile-delete", {
      method: "POST",
      body: JSON.stringify({
        base_url: el.syncBaseUrl.value.trim() || "http://127.0.0.1:8001",
        feed_ids: feedIds,
      }),
    });
    el.syncLog.textContent = `对账完成\n删除 ${result.deleted} 条\n校验公众号 ${result.feed_count} 个`;
    alert(`对账删除完成：删除 ${result.deleted} 条`);
    await loadAll();
  } catch (error) {
    alert(error.message);
  }
});

el.feed.addEventListener("click", async (e) => {
  const titleLink = e.target.closest("a.article-title");
  if (titleLink) {
    const card = titleLink.closest(".article-card");
    const readBtn = card?.querySelector("[data-action='toggle-read']");
    const id = Number(readBtn?.dataset.id || 0);
    const item = state.articles.find((a) => a.id === id);
    if (item && !item.is_read) {
      ensureReflectionForRead(id)
        .then((okReflect) => {
          if (!okReflect) {
            alert("请先填写感想，再标记为已读");
            return openDetail(id);
          }
          return markArticleRead(id).then(() => Promise.all([loadAll(), openDetail(id)]));
        })
        .catch((error) => {
          alert(error.message || "操作失败");
        });
    } else if (id) {
      openDetail(id).catch(() => {});
    }
    return;
  }

  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);
  const item = state.articles.find((a) => a.id === id);
  if (!item) return;

  try {
    if (action === "toggle-read") {
      const targetRead = !item.is_read;
      if (targetRead) {
        const okReflect = await ensureReflectionForRead(id);
        if (!okReflect) {
          alert("请先填写感想，再标记为已读");
          await openDetail(id);
          return;
        }
      }
      await request(`/api/articles/${id}/read`, {
        method: "PATCH",
        body: JSON.stringify({ is_read: targetRead }),
      });
      await loadAll();
      if (targetRead) {
        await openDetail(id);
      }
    } else if (action === "toggle-star") {
      await request(`/api/articles/${id}/star`, {
        method: "PATCH",
        body: JSON.stringify({ is_starred: !item.is_starred }),
      });
      await loadAll();
    } else if (action === "detail") {
      await openDetail(id);
    }
  } catch (error) {
    alert(error.message);
  }
});

el.feed.addEventListener("toggle", (e) => {
  const group = e.target;
  if (!(group instanceof HTMLDetailsElement) || !group.classList.contains("day-group")) return;
  const dateKey = group.dataset.date;
  if (!dateKey) return;
  if (group.open) {
    state.openDayGroups.add(dateKey);
  } else {
    state.openDayGroups.delete(dateKey);
  }
});

el.addNoteBtn.addEventListener("click", async () => {
  if (!state.currentArticle) return;
  const content = el.newNoteContent.value.trim();
  if (!content) {
    alert("请先填写笔记内容");
    return;
  }
  try {
    const notes = await request(`/api/articles/${state.currentArticle.id}/notes`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
    el.newNoteContent.value = "";
    renderDetailNotes(notes);
  } catch (error) {
    alert(error.message);
  }
});

el.detailNotes.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-note-id]");
  if (!btn || !state.currentArticle) return;
  const noteId = Number(btn.dataset.noteId);
  try {
    const notes = await request(`/api/articles/${state.currentArticle.id}/notes/${noteId}`, {
      method: "DELETE",
    });
    renderDetailNotes(notes);
  } catch (error) {
    alert(error.message);
  }
});

el.detailUrl.addEventListener("click", () => {
  if (!state.currentArticle || state.currentArticle.is_read) return;
  ensureReflectionForRead(state.currentArticle.id)
    .then((okReflect) => {
      if (!okReflect) {
        alert("请先填写感想，再标记为已读");
        return;
      }
      return markArticleRead(state.currentArticle.id).then(() => loadAll());
    })
    .catch(() => {});
});

el.tagList.addEventListener("click", async (e) => {
  const id = e.target.getAttribute("data-remove-tag");
  if (!id || !state.currentArticle) return;

  try {
    const detail = await request(
      `/api/articles/${state.currentArticle.id}/tags/${id}`,
      { method: "DELETE" }
    );
    state.currentArticle = detail;
    await openDetail(state.currentArticle.id);
    await loadAll();
  } catch (error) {
    alert(error.message);
  }
});

el.tagSuggestionsBox.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-suggested-tag]");
  if (!btn || !state.currentArticle) return;
  const tagName = btn.getAttribute("data-suggested-tag");
  if (!tagName) return;
  try {
    await applySuggestedTags(state.currentArticle.id, [tagName]);
    await loadAll();
    await openDetail(state.currentArticle.id);
  } catch (error) {
    alert(error.message);
  }
});

if (el.tagInput) {
  el.tagInput.addEventListener("input", () => {
    renderTagSuggestList();
  });
  el.tagInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestIndex(state.tagSuggestActiveIdx + 1);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestIndex(state.tagSuggestActiveIdx - 1);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const items = Array.isArray(state.tagSuggestItems) ? state.tagSuggestItems : [];
      const active = items[Number(state.tagSuggestActiveIdx)];
      if (active?.id) {
        addTagToCurrentArticleByNameOrId({ tagId: active.id }).catch((error) => alert(error.message));
        return;
      }
      addTagToCurrentArticleByNameOrId({ name: el.tagInput.value }).catch((error) => alert(error.message));
    }
  });
}

if (el.tagAddBtn) {
  el.tagAddBtn.addEventListener("click", () => {
    addTagToCurrentArticleByNameOrId({ name: el.tagInput?.value || "" }).catch((error) =>
      alert(error.message)
    );
  });
}

if (el.tagSuggestList) {
  el.tagSuggestList.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-suggest-tag-id]");
    if (!btn) return;
    const tagId = Number(btn.dataset.suggestTagId || 0);
    if (!tagId) return;
    if (btn.dataset.suggestIdx !== undefined) {
      state.tagSuggestActiveIdx = Number(btn.dataset.suggestIdx || -1);
    }
    addTagToCurrentArticleByNameOrId({ tagId }).catch((error) => alert(error.message));
  });
}
el.closeDialogBtn.addEventListener("click", () => {
  closeDetailDialog().catch(() => {});
});
el.reflectionInput.addEventListener("input", () => {
  scheduleReflectionAutoSave();
});
el.reflectionInput.addEventListener("blur", () => {
  saveReflectionForCurrentArticle({ silent: true }).catch(() => {});
});
el.closeTagManageBtn.addEventListener("click", () => el.tagManageDialog.close());
el.closeNotesCenterBtn.addEventListener("click", () => el.notesCenterDialog.close());
el.closeReflectionsCenterBtn.addEventListener("click", () => el.reflectionsCenterDialog.close());
el.closeKnowledgeChatBtn.addEventListener("click", () => el.knowledgeChatDialog.close());
el.closeReadingPriorityBtn.addEventListener("click", () => el.readingPriorityDialog.close());
el.closeWeeklyInsightBtn.addEventListener("click", () => el.weeklyInsightDialog.close());
el.closeAiSettingsBtn.addEventListener("click", () => el.aiSettingsDialog.close());
el.closeAuthQrBtn.addEventListener("click", () => {
  stopAuthPolling();
  state.authAfterScanAction = null;
  el.authQrDialog.close();
});

el.tagManageBtn.addEventListener("click", async () => {
  try {
    await loadTagManagement();
    if (!el.tagManageDialog.open) el.tagManageDialog.showModal();
  } catch (error) {
    alert(error.message);
  }
});

el.manageCreateTagBtn.addEventListener("click", async () => {
  const name = el.manageNewTagName.value.trim();
  if (!name) {
    alert("请先输入标签名");
    return;
  }
  try {
    await request("/api/tags", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    el.manageNewTagName.value = "";
    await Promise.all([loadAll(), loadTagManagement()]);
  } catch (error) {
    alert(error.message);
  }
});

if (el.manageTagSearchInput) {
  el.manageTagSearchInput.addEventListener("input", async (e) => {
    state.manageTagKeyword = e.target.value.trim();
    try {
      await loadTagManagement();
    } catch (error) {
      alert(error.message);
    }
  });
}

if (el.manageTagSearchClearBtn) {
  el.manageTagSearchClearBtn.addEventListener("click", async () => {
    state.manageTagKeyword = "";
    if (el.manageTagSearchInput) {
      el.manageTagSearchInput.value = "";
      el.manageTagSearchInput.focus();
    }
    try {
      await loadTagManagement();
    } catch (error) {
      alert(error.message);
    }
  });
}

el.manageTagList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const row = btn.closest(".manage-tag-row");
  if (!row) return;
  const tagId = Number(row.dataset.tagId);
  const nameInput = row.querySelector("input[data-role='name']");
  const name = nameInput?.value?.trim() || "";

  try {
    if (btn.dataset.action === "save") {
      if (!name) {
        alert("标签名不能为空");
        return;
      }
      await request(`/api/tags/${tagId}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      await Promise.all([loadAll(), loadTagManagement()]);
      if (state.currentArticle && el.detailDialog.open) {
        await openDetail(state.currentArticle.id);
      }
    }

    if (btn.dataset.action === "delete") {
      if (state.pendingDeleteTagId !== tagId) {
        state.pendingDeleteTagId = tagId;
        btn.textContent = "确认删除";
        setTimeout(() => {
          if (state.pendingDeleteTagId === tagId) {
            state.pendingDeleteTagId = null;
            const latestBtn = row.querySelector("button[data-action='delete']");
            if (latestBtn) latestBtn.textContent = "删除";
          }
        }, 3000);
        return;
      }
      state.pendingDeleteTagId = null;
      await request(`/api/tags/${tagId}`, { method: "DELETE" });
      await Promise.all([loadAll(), loadTagManagement()]);
      if (state.currentArticle && el.detailDialog.open) {
        await openDetail(state.currentArticle.id);
      }
    }
  } catch (error) {
    alert(error.message);
  }
});

el.notesCenterBtn.addEventListener("click", async () => {
  try {
    await searchNotesCenter();
    if (!el.notesCenterDialog.open) el.notesCenterDialog.showModal();
  } catch (error) {
    alert(error.message);
  }
});

el.notesSearchBtn.addEventListener("click", async () => {
  try {
    await searchNotesCenter();
  } catch (error) {
    alert(error.message);
  }
});

el.reflectionsCenterBtn.addEventListener("click", async () => {
  try {
    await searchReflectionsCenter();
    if (!el.reflectionsCenterDialog.open) el.reflectionsCenterDialog.showModal();
  } catch (error) {
    alert(error.message);
  }
});

el.reflectionsSearchBtn.addEventListener("click", async () => {
  try {
    await searchReflectionsCenter();
  } catch (error) {
    alert(error.message);
  }
});

el.detailDialog.addEventListener("click", (e) => {
  if (e.target === el.detailDialog) {
    closeDetailDialog().catch(() => {});
  }
});
el.detailDialog.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeDetailDialog().catch(() => {});
});
bindDialogBackdropClose(el.tagManageDialog);
bindDialogBackdropClose(el.notesCenterDialog);
bindDialogBackdropClose(el.reflectionsCenterDialog);
bindDialogBackdropClose(el.knowledgeChatDialog);
bindDialogBackdropClose(el.readingPriorityDialog);
bindDialogBackdropClose(el.weeklyInsightDialog);
bindDialogBackdropClose(el.aiSettingsDialog);
bindDialogBackdropClose(el.authQrDialog);
el.authQrDialog.addEventListener("close", () => {
  stopAuthPolling();
  state.authAfterScanAction = null;
});
el.authQrDialog.addEventListener("cancel", () => {
  stopAuthPolling();
  state.authAfterScanAction = null;
});

const storedAuthConfig = JSON.parse(localStorage.getItem("weMpRssAuthConfig") || "{}");
if (storedAuthConfig.base_url) el.syncBaseUrl.value = storedAuthConfig.base_url;
if (storedAuthConfig.username) el.syncUsername.value = storedAuthConfig.username;
if (storedAuthConfig.password) el.syncPassword.value = storedAuthConfig.password;

renderLastSync(localStorage.getItem("lastSyncAt"));
renderSyncLog(null);
renderAuthStatus("待检查", "normal");
renderAiSettingsStatus("打开 AI 设置后即可配置外部模型。");
loadTodos();
renderTodos();
loadAll().catch((error) => alert(error.message));
fetchWeMpRssAuthStatus()
  .then((status) => {
    renderAuthStatus(status.authorized ? "已授权" : "待扫码授权", status.authorized ? "ok" : "warn");
  })
  .catch(() => {
    renderAuthStatus("授权检查失败", "warn");
  });
loadAiSettings().catch(() => {});
