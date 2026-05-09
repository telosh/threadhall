import type { Client } from "@libsql/client";
import type { EventRow } from "@/types/db/primary";

function rowToEvent(row: Record<string, unknown>): EventRow {
  const phase = row.phase;
  const p =
    phase === "live" || phase === "archived" ? phase : "draft";
  return {
    id: String(row.id),
    organization_id: String(row.organization_id),
    slug: String(row.slug),
    title: String(row.title),
    phase: p,
    satellite_ref:
      row.satellite_ref == null ? null : String(row.satellite_ref),
    created_at: String(row.created_at),
  };
}

export async function listEventsForOrganization(
  db: Client,
  organizationId: string,
): Promise<EventRow[]> {
  const result = await db.execute({
    sql: `SELECT id, organization_id, slug, title, phase, satellite_ref, created_at
          FROM events WHERE organization_id = ? ORDER BY created_at ASC`,
    args: [organizationId],
  });
  return result.rows.map((r) => rowToEvent(r as Record<string, unknown>));
}

export async function getEventById(
  db: Client,
  id: string,
): Promise<EventRow | null> {
  const result = await db.execute({
    sql: `SELECT id, organization_id, slug, title, phase, satellite_ref, created_at
          FROM events WHERE id = ? LIMIT 1`,
    args: [id],
  });
  const first = result.rows[0] as Record<string, unknown> | undefined;
  return first ? rowToEvent(first) : null;
}
