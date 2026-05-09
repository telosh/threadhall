-- FR-03: イベントメタ（プライマリ）。サテライト URL は FR-04 で埋める想定の NULL 可。
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY NOT NULL,
  organization_id TEXT NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  phase TEXT NOT NULL DEFAULT 'draft' CHECK (phase IN ('draft', 'live', 'archived')),
  satellite_ref TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime ('now')),
  UNIQUE (organization_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_events_organization_id ON events (organization_id);
CREATE INDEX IF NOT EXISTS idx_events_phase ON events (phase);
