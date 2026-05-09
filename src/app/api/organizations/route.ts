import {
  type OrganizationCreate,
  organizationCreateSchema,
} from "@/schemas/organization";
import { getDbOrNull } from "@/lib/db";
import {
  OrganizationSlugConflictError,
  insertOrganization,
} from "@/server/mutations/organizations";
import { listOrganizations } from "@/server/queries/organizations";
import { NextResponse } from "next/server";

/** 組織の参照（FR-01）。 */
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

/** 組織の作成（FR-01）。認可・メンバーは後続。 */
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
  const db = getDbOrNull();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }
  try {
    const organization = await insertOrganization(db, body);
    return NextResponse.json({ organization }, { status: 201 });
  } catch (e) {
    if (e instanceof OrganizationSlugConflictError) {
      return NextResponse.json(
        { error: "Slug already exists", slug: e.slug },
        { status: 409 },
      );
    }
    throw e;
  }
}
