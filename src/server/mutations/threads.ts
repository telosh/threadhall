import type { Client } from "@libsql/client";
import type { ThreadCreate } from "@/schemas/thread";
import type { ThreadRow } from "@/types/db/primary";
import { randomUUID } from "node:crypto";

export class ThreadSlugConflictError extends Error {
  readonly organizationId: string;
  readonly slug: string;
  constructor(organizationId: string, slug: string) {
    super(`Thread slug already exists in org: ${slug}`);
    this.name = "ThreadSlugConflictError";
    this.organizationId = organizationId;
    this.slug = slug;
  }
}

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

export async function insertThread(
  db: Client,
  input: ThreadCreate,
): Promise<ThreadRow> {
  const id = randomUUID();
  try {
    await db.execute({
      sql: `INSERT INTO threads (id, organization_id, slug, title, thread_kind)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        id,
        input.organization_id,
        input.slug,
        input.title,
        input.thread_kind,
      ],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/unique|UNIQUE constraint|SQLITE_CONSTRAINT_UNIQUE/i.test(msg)) {
      throw new ThreadSlugConflictError(input.organization_id, input.slug);
    }
    throw e;
  }

  const result = await db.execute({
    sql: `SELECT id, organization_id, slug, title, thread_kind, created_at
          FROM threads WHERE id = ? LIMIT 1`,
    args: [id],
  });
  const first = result.rows[0] as Record<string, unknown> | undefined;
  if (!first) {
    throw new Error("insertThread: row missing after insert");
  }
  return rowToThread(first);
}
