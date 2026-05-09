-- FR-02: 長命スレッド（プライマリ）。event_tied は後続でイベント FK を足すマイグレで拡張可。
CREATE TABLE IF NOT EXISTS threads (
  id TEXT PRIMARY KEY NOT NULL,
  organization_id TEXT NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  thread_kind TEXT NOT NULL DEFAULT 'persistent' CHECK (thread_kind IN ('persistent', 'event_tied')),
  created_at TEXT NOT NULL DEFAULT (datetime ('now')),
  UNIQUE (organization_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_threads_organization_id ON threads (organization_id);
