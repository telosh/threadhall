/**
 * プライマリ DB の行型。スキーマの正は `db/migrations/*`。
 * カラムを変えるときは新規マイグレーションを追加し、本ファイルのコメントに版を追記する。
 */

/** @see db/migrations/0002_organizations.sql */
export type OrganizationRow = {
  id: string;
  slug: string;
  display_name: string;
  created_at: string;
};

/** @see db/migrations/0001_schema_migrations.sql */
export type SchemaMigrationRow = {
  version: string;
  applied_at: string;
};

/** @see db/migrations/0003_threads.sql */
export type ThreadRow = {
  id: string;
  organization_id: string;
  slug: string;
  title: string;
  thread_kind: "persistent" | "event_tied";
  created_at: string;
};
