"use server";

import { getDbOrNull } from "@/lib/db";
import { organizationCreateSchema } from "@/schemas/organization";
import {
  OrganizationSlugConflictError,
  insertOrganization,
} from "@/server/mutations/organizations";
import { redirect } from "next/navigation";

/**
 * FR-08 までの仮セッション。Better Auth 導入後は公式の `auth()` に差し替える。
 * react-doctor の server-auth-actions パターンに合わせるため関数名を `auth` にしている。
 */
async function auth(): Promise<{ userId: string } | null> {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  if (process.env.THREADHALL_ALLOW_DEV_ORG_FORM !== "1") {
    return null;
  }
  return { userId: "dev-local" };
}

/**
 * トップページの試用フォーム。本番では無効。
 * FR-08 後: 上記 `auth` を Better Auth に差し替え、組織作成はロール付きユーザーのみに限定する。
 */
export async function createOrganizationFormAction(formData: FormData) {
  const session = await auth();
  if (!session) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Development-only form: enable only after FR-08 with proper authorization.",
      );
    }
    redirect("/?error=dev_form_disabled");
  }

  // TODO(FR-08): Better Auth の session から userId を使う

  const parsed = organizationCreateSchema.safeParse({
    slug: formData.get("slug"),
    display_name: formData.get("display_name"),
  });
  if (!parsed.success) {
    redirect(
      `/?error=validation&detail=${encodeURIComponent(JSON.stringify(parsed.error.flatten().fieldErrors))}`,
    );
  }

  const db = getDbOrNull();
  if (!db) {
    redirect("/?error=no_db");
  }

  let slugConflict: string | undefined;
  try {
    await insertOrganization(db, parsed.data);
  } catch (e) {
    if (e instanceof OrganizationSlugConflictError) {
      slugConflict = e.slug;
    } else {
      throw e;
    }
  }

  if (slugConflict !== undefined) {
    redirect(
      `/?error=slug_taken&slug=${encodeURIComponent(slugConflict)}`,
    );
  }

  redirect("/?created=1");
}
