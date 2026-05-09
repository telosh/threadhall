import type { Client } from "@libsql/client";
import type { SchemaMigrationRow } from "@/types/db/primary";

export async function listAppliedMigrations(
  db: Client,
): Promise<SchemaMigrationRow[]> {
  const r = await db.execute(
    "SELECT version, applied_at FROM schema_migrations ORDER BY version ASC",
  );
  return r.rows.map((row) => ({
    version: String((row as Record<string, unknown>).version),
    applied_at: String((row as Record<string, unknown>).applied_at),
  }));
}
