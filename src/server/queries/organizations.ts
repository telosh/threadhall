import type { Client } from "@libsql/client";
import type { OrganizationRow } from "@/types/db/primary";

function rowToOrganization(row: Record<string, unknown>): OrganizationRow {
  return {
    id: String(row.id),
    slug: String(row.slug),
    display_name: String(row.display_name),
    created_at: String(row.created_at),
  };
}

/** 組織一覧（プライマリ DB）。認可は呼び出し側で行う。 */
export async function listOrganizations(db: Client): Promise<OrganizationRow[]> {
  const result = await db.execute(
    "SELECT id, slug, display_name, created_at FROM organizations ORDER BY created_at ASC",
  );
  return result.rows.map((r) => rowToOrganization(r as Record<string, unknown>));
}
