const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "../../data/app.db");
const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function ensureColumn(tableName, columnName, alterSql) {
  const columns = await all(`PRAGMA table_info(${tableName})`);
  const exists = columns.some((c) => c.name === columnName);
  if (!exists) {
    await run(alterSql);
  }
}

async function initDb() {
  await run("PRAGMA foreign_keys = ON;");

  await run(`
    CREATE TABLE IF NOT EXISTS Article (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      publish_date TEXT NOT NULL,
      source TEXT NOT NULL,
      sync_origin TEXT NOT NULL DEFAULT 'manual',
      is_read INTEGER NOT NULL DEFAULT 0,
      is_starred INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
  await ensureColumn(
    "Article",
    "sync_origin",
    "ALTER TABLE Article ADD COLUMN sync_origin TEXT NOT NULL DEFAULT 'manual';"
  );
  await ensureColumn("Article", "description", "ALTER TABLE Article ADD COLUMN description TEXT;");
  await ensureColumn("Article", "content", "ALTER TABLE Article ADD COLUMN content TEXT;");
  await ensureColumn(
    "Article",
    "content_embedding",
    "ALTER TABLE Article ADD COLUMN content_embedding TEXT;"
  );
  await run(`
    CREATE TABLE IF NOT EXISTS Tag (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      created_at TEXT NOT NULL,
      UNIQUE(name, type)
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS ArticleTag (
      article_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (article_id, tag_id),
      FOREIGN KEY(article_id) REFERENCES Article(id) ON DELETE CASCADE,
      FOREIGN KEY(tag_id) REFERENCES Tag(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS ArticleLink (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      domain TEXT NOT NULL,
      title TEXT,
      is_collected INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      UNIQUE(article_id, url),
      FOREIGN KEY(article_id) REFERENCES Article(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS ArticleNote (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      content_embedding TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(article_id) REFERENCES Article(id) ON DELETE CASCADE
    );
  `);
  await ensureColumn(
    "ArticleNote",
    "content_embedding",
    "ALTER TABLE ArticleNote ADD COLUMN content_embedding TEXT;"
  );

  await run(`
    CREATE TABLE IF NOT EXISTS ArticleReflection (
      article_id INTEGER PRIMARY KEY,
      content TEXT NOT NULL,
      content_embedding TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(article_id) REFERENCES Article(id) ON DELETE CASCADE
    );
  `);
  await ensureColumn(
    "ArticleReflection",
    "content_embedding",
    "ALTER TABLE ArticleReflection ADD COLUMN content_embedding TEXT;"
  );

}

module.exports = {
  db,
  run,
  get,
  all,
  initDb,
};
