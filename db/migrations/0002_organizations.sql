-- FR-01 前提の最小スキーマ。カラム追加は新規マイグレーションで行う（本ファイルは編集しない）
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime ('now'))
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations (slug);
