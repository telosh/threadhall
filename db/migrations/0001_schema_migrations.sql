-- マイグレーション適用履歴（0001 で作成。このファイルはマージ後に編集しない）
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY NOT NULL,
  applied_at TEXT NOT NULL DEFAULT (datetime ('now'))
);
