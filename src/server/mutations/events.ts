import type { Client } from "@libsql/client";
import type { EventCreateInput, EventPhasePatchInput } from "@/schemas/event";
import type { EventRow } from "@/types/db/primary";
import { randomUUID } from "node:crypto";
import { getEventById } from "@/server/queries/events";

export class EventSlugConflictError extends Error {
  constructor(
    readonly organizationId: string,
    readonly slug: string,
  ) {
    super("Event slug already exists in organization");
    this.name = "EventSlugConflictError";
  }
}

export class EventNotFoundError extends Error {
  constructor(readonly eventId: string) {
    super("Event not found");
    this.name = "EventNotFoundError";
  }
}

export class EventPhaseTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EventPhaseTransitionError";
  }
}

export async function insertEvent(
  db: Client,
  input: EventCreateInput,
): Promise<EventRow> {
  const id = randomUUID();
  try {
    await db.execute({
      sql: `INSERT INTO events (id, organization_id, slug, title, phase)
            VALUES (?, ?, ?, ?, 'draft')`,
      args: [id, input.organization_id, input.slug, input.title],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/unique|UNIQUE constraint|SQLITE_CONSTRAINT_UNIQUE/i.test(msg)) {
      throw new EventSlugConflictError(input.organization_id, input.slug);
    }
    throw e;
  }
  const row = await getEventById(db, id);
  if (!row) throw new Error("insertEvent: row missing");
  return row;
}

/** draft→live→archived のみ（戻し不可・PATCH 入力は live|archived） */
export async function patchEventPhase(
  db: Client,
  eventId: string,
  patch: EventPhasePatchInput,
): Promise<EventRow> {
  const current = await getEventById(db, eventId);
  if (!current) {
    throw new EventNotFoundError(eventId);
  }

  const requested = patch.phase;
  const valid =
    current.phase === requested ||
    (current.phase === "draft" && requested === "live") ||
    (current.phase === "live" && requested === "archived");

  if (!valid) {
    throw new EventPhaseTransitionError(
      `Invalid transition ${current.phase} → ${requested}`,
    );
  }

  if (current.phase === requested) {
    return current;
  }

  await db.execute({
    sql: `UPDATE events SET phase = ? WHERE id = ?`,
    args: [requested, eventId],
  });

  const row = await getEventById(db, eventId);
  if (!row) throw new Error("patchEventPhase: row missing");
  return row;
}
