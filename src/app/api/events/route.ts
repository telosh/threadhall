import { getDbOrNull } from "@/lib/db";
import type { EventCreateInput } from "@/schemas/event";
import { eventCreateSchema } from "@/schemas/event";
import {
  EventSlugConflictError,
  insertEvent,
} from "@/server/mutations/events";
import { listEventsForOrganization } from "@/server/queries/events";
import { NextResponse } from "next/server";

/** FR-03: 組織に紐づくイベント一覧 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const organizationId = url.searchParams.get("organization_id");
  if (!organizationId) {
    return NextResponse.json(
      { error: "organization_id query required" },
      { status: 400 },
    );
  }

  const db = getDbOrNull();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  const events = await listEventsForOrganization(db, organizationId);
  return NextResponse.json({ events });
}

/** FR-03: イベント作成（phase は常に draft） */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = eventCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const body: EventCreateInput = parsed.data;

  const db = getDbOrNull();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  try {
    const event = await insertEvent(db, body);
    return NextResponse.json({ event }, { status: 201 });
  } catch (e) {
    if (e instanceof EventSlugConflictError) {
      return NextResponse.json(
        {
          error: "Event slug already exists in this organization",
          organization_id: e.organizationId,
          slug: e.slug,
        },
        { status: 409 },
      );
    }
    throw e;
  }
}
