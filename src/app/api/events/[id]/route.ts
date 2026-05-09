import { getDbOrNull } from "@/lib/db";
import { eventPhasePatchSchema } from "@/schemas/event";
import {
  EventNotFoundError,
  EventPhaseTransitionError,
  patchEventPhase,
} from "@/server/mutations/events";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

/** FR-03: phase 更新（draft→live→archived のみ・body は live | archived） */
export async function PATCH(req: Request, context: RouteContext) {
  const { id } = await context.params;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = eventPhasePatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const db = getDbOrNull();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  try {
    const event = await patchEventPhase(db, id, parsed.data);
    return NextResponse.json({ event });
  } catch (e) {
    if (e instanceof EventNotFoundError) {
      return NextResponse.json(
        { error: "Not found", event_id: e.eventId },
        { status: 404 },
      );
    }
    if (e instanceof EventPhaseTransitionError) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
    throw e;
  }
}
