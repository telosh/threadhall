import type { Client } from "@libsql/client";
import type { OrganizationCreate } from "@/schemas/organization";
import type { OrganizationRow } from "@/types/db/primary";
import { randomUUID } from "node:crypto";

export class OrganizationSlugConflictError extends Error {
  readonly slug: string;
  constructor(slug: string) {
    super(`Organization slug already exists: ${slug}`);
    this.name = "OrganizationSlugConflictError";
    this.slug = slug;
  }
}

function rowToOrganization(row: Record<string, unknown>): OrganizationRow {
  return {
    id: String(row.id),
    slug: String(row.slug),
    display_name: String(row.display_name),
    created_at: String(row.created_at),
  };
}

export async function insertOrganization(
  db: Client,
  input: OrganizationCreate,
): Promise<OrganizationRow> {
  const id = randomUUID();
  try {
    await db.execute({
      sql: `INSERT INTO organizations (id, slug, display_name) VALUES (?, ?, ?)`,
      args: [id, input.slug, input.display_name],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (
      /unique|UNIQUE constraint|SQLITE_CONSTRAINT_UNIQUE/i.test(msg)
    ) {
      throw new OrganizationSlugConflictError(input.slug);
    }
    throw e;
  }

  const result = await db.execute({
    sql: `SELECT id, slug, display_name, created_at FROM organizations WHERE id = ? LIMIT 1`,
    args: [id],
  });
  const first = result.rows[0] as Record<string, unknown> | undefined;
  if (!first) {
    throw new Error("insertOrganization: row missing after insert");
  }
  return rowToOrganization(first);
}
