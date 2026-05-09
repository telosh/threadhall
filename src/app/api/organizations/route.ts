import {
  type OrganizationCreate,
  organizationCreateSchema,
} from "@/schemas/organization";
import { getDbOrNull } from "@/lib/db";
import { listOrganizations } from "@/server/queries/organizations";
import { NextResponse } from "next/server";

/** 組織の参照（FR-01 土台）。作成は後続で Server Action 等に寄せる。 */
export async function GET() {
  const db = getDbOrNull();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }
  const organizations = await listOrganizations(db);
  return NextResponse.json({ organizations });
}

/** 境界用 Zod の接続確認（本体実装前は 501） */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = organizationCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const body: OrganizationCreate = parsed.data;
  return NextResponse.json(
    { message: "Organization create not implemented yet", received: body },
    { status: 501 },
  );
}
