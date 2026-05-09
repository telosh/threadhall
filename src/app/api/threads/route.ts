import { getDbOrNull } from "@/lib/db";
import { threadCreateSchema } from "@/schemas/thread";
import type { ThreadCreate } from "@/schemas/thread";
import {
  ThreadSlugConflictError,
  insertThread,
} from "@/server/mutations/threads";
import { listThreadsForOrganization } from "@/server/queries/threads";
import { NextResponse } from "next/server";

/** FR-02: 組織に紐づくスレッド一覧 */
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

  const threads = await listThreadsForOrganization(db, organizationId);
  return NextResponse.json({ threads });
}

/** FR-02: スレッド作成（認可は FR-08 後に厳格化） */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = threadCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const body: ThreadCreate = parsed.data;

  const db = getDbOrNull();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  try {
    const thread = await insertThread(db, body);
    return NextResponse.json({ thread }, { status: 201 });
  } catch (e) {
    if (e instanceof ThreadSlugConflictError) {
      return NextResponse.json(
        {
          error: "Thread slug already exists in this organization",
          organization_id: e.organizationId,
          slug: e.slug,
        },
        { status: 409 },
      );
    }
    throw e;
  }
}
