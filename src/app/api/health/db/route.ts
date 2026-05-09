import { getDbOrNull } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const db = getDbOrNull();
  if (!db) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Database client not configured (set TURSO_DATABASE_URL). See .env.example",
      },
      { status: 503 },
    );
  }

  try {
    const result = await db.execute("SELECT 1 AS ok");
    return NextResponse.json({ ok: true, rows: result.rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
