import { getDbOrNull } from "@/lib/db";
import { listAppliedMigrations } from "@/server/queries/migrations";
import { NextResponse } from "next/server";

export async function GET() {
  const db = getDbOrNull();
  if (!db) {
    return NextResponse.json({ ok: false, error: "db not configured" }, { status: 503 });
  }
  try {
    const migrations = await listAppliedMigrations(db);
    return NextResponse.json({ ok: true, migrations });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
