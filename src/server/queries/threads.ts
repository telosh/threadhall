import type { Client } from "@libsql/client";
import type { ThreadRow } from "@/types/db/primary";

function rowToThread(row: Record<string, unknown>): ThreadRow {
  const kind = row.thread_kind;
  return {
    id: String(row.id),
    organization_id: String(row.organization_id),
    slug: String(row.slug),
    title: String(row.title),
    thread_kind:
      kind === "event_tied" ? "event_tied" : "persistent",
    created_at: String(row.created_at),
  };
}

export async function listThreadsForOrganization(
  db: Client,
  organizationId: string,
): Promise<ThreadRow[]> {
  const result = await db.execute({
    sql: `SELECT id, organization_id, slug, title, thread_kind, created_at
          FROM threads
          WHERE organization_id = ?
          ORDER BY created_at ASC`,
    args: [organizationId],
  });
  return result.rows.map((r) => rowToThread(r as Record<string, unknown>));
}
