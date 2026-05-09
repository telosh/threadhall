import Link from "next/link";
import { getDbOrNull } from "@/lib/db";
import { listOrganizations } from "@/server/queries/organizations";
import { listThreadsForOrganization } from "@/server/queries/threads";
import { createOrganizationFormAction } from "@/server/actions/organization-actions";
import type { OrganizationRow } from "@/types/db/primary";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function Home({ searchParams }: PageProps) {
  const sp = searchParams ? await searchParams : {};
  const created = sp.created === "1" || sp.created === "true";
  const errorKey =
    typeof sp.error === "string"
      ? sp.error
      : Array.isArray(sp.error)
        ? sp.error[0]
        : undefined;

  const db = getDbOrNull();
  let dbPing: "ok" | "error" | "unset" = "unset";
  let dbDetail: string | null = null;
  let orgCount: number | "n/a" = "n/a";
  let organizations: OrganizationRow[] = [];

  if (db) {
    try {
      await db.execute("SELECT 1");
      dbPing = "ok";
      try {
        organizations = await listOrganizations(db);
        orgCount = organizations.length;
      } catch {
        orgCount = "n/a";
        organizations = [];
      }
    } catch (e) {
      dbPing = "error";
      dbDetail = e instanceof Error ? e.message : String(e);
    }
  }

  const errorMessage =
    errorKey === "slug_taken"
      ? "その slug は既に使われています（別の値にしてください）。"
      : errorKey === "dev_form_disabled"
        ? "開発用フォームは無効です。`.env.local` に THREADHALL_ALLOW_DEV_ORG_FORM=1 を設定してください。"
        : errorKey === "no_db"
        ? "DB が未設定です（.env.local）。"
        : errorKey === "validation"
          ? "入力が不正です（slug は小文字・数字・ハイフンのみ）。"
          : errorKey
            ? `エラー: ${errorKey}`
            : null;

  const orgThreadPairs =
    db && dbPing === "ok" && orgCount !== "n/a" && organizations.length > 0
      ? await Promise.all(
          organizations.map(async (org) => ({
            org,
            threads: await listThreadsForOrganization(db, org.id),
          })),
        )
      : [];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-400">
          Threadhall
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          開発用スキャフォールド
        </h1>
        <p className="text-zinc-400">
          Next.js App Router · Turso / libSQL · SQL マイグレーション · Zod ·
          Zustand · Docker（sqld）
        </p>
      </header>

      {created ? (
        <p className="rounded-lg border border-emerald-800/80 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">
          組織を作成しました。
        </p>
      ) : null}
      {errorMessage ? (
        <p className="rounded-lg border border-red-900/80 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="text-sm font-medium text-zinc-300">データベース接続</h2>
        <dl className="mt-3 space-y-2 text-sm text-zinc-400">
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-zinc-500">状態</dt>
            <dd className="font-mono text-zinc-200">
              {dbPing === "unset" && "未設定（.env.local を確認）"}
              {dbPing === "ok" && "接続OK（SELECT 1）"}
              {dbPing === "error" && "接続エラー"}
            </dd>
          </div>
          {dbDetail ? (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-zinc-500">詳細</dt>
              <dd className="break-all text-red-300/90">{dbDetail}</dd>
            </div>
          ) : null}
          {dbPing === "ok" ? (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-zinc-500">organizations</dt>
              <dd className="font-mono text-zinc-200">
                {orgCount === "n/a"
                  ? "未適用（npm run db:migrate）"
                  : `${orgCount} 件`}
              </dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-4 text-xs text-zinc-500">
          JSON で確認:{" "}
          <Link
            href="/api/health/db"
            className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
          >
            /api/health/db
          </Link>
          {" · "}
          <Link
            href="/api/organizations"
            className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
          >
            /api/organizations
          </Link>
          {" · "}
          <span className="text-zinc-600">/api/threads?organization_id=…</span>
        </p>
      </section>

      {dbPing === "ok" && orgCount !== "n/a" ? (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-medium text-zinc-300">
            試用: 組織を1件作成（認可なし・開発用）
          </h2>
          <p className="mt-2 text-xs text-zinc-500">
            `.env.local` に{" "}
            <code className="rounded bg-zinc-950 px-1 text-zinc-300">
              THREADHALL_ALLOW_DEV_ORG_FORM=1
            </code>{" "}
            が必要です。本番では FR-08 後に無効のままです。
          </p>
          <form
            action={createOrganizationFormAction}
            className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
          >
            <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-xs text-zinc-500">
              表示名
              <input
                name="display_name"
                required
                maxLength={200}
                placeholder="サンプル研究室"
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600"
              />
            </label>
            <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-xs text-zinc-500">
              slug（URL用・英小文字とハイフン）
              <input
                name="slug"
                required
                maxLength={64}
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                placeholder="sample-lab"
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              作成
            </button>
          </form>
        </section>
      ) : null}

      {orgThreadPairs.length > 0 ? (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-medium text-zinc-300">
            長命スレッド（FR-02・閲覧）
          </h2>
          <p className="mt-2 text-xs text-zinc-500">
            作成は{" "}
            <code className="rounded bg-zinc-950 px-1 font-mono text-zinc-300">
              POST /api/threads
            </code>{" "}
            （body: organization_id, slug, title）。一覧は各組織の query リンクから。
          </p>
          <ul className="mt-4 space-y-6">
            {orgThreadPairs.map(({ org, threads }) => (
              <li key={org.id}>
                <h3 className="text-xs font-medium text-zinc-400">
                  {org.display_name}{" "}
                  <span className="font-mono text-zinc-500">({org.slug})</span>
                </h3>
                <p className="mt-1 text-xs">
                  <Link
                    href={`/api/threads?organization_id=${encodeURIComponent(org.id)}`}
                    className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
                  >
                    /api/threads?organization_id=…
                  </Link>
                </p>
                {threads.length === 0 ? (
                  <p className="mt-2 text-sm text-zinc-500">スレッドはまだありません</p>
                ) : (
                  <ul className="mt-2 space-y-1 text-sm text-zinc-300">
                    {threads.map((t) => (
                      <li key={t.id} className="font-mono text-xs">
                        {t.slug}{" "}
                        <span className="text-zinc-500">: {t.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="text-xs text-zinc-600">
        <code className="rounded bg-zinc-900 px-1.5 py-0.5">
          docker compose up -d sqld
        </code>{" "}
        と{" "}
        <code className="rounded bg-zinc-900 px-1.5 py-0.5">
          npm run db:migrate
        </code>{" "}
        後、
        <code className="rounded bg-zinc-900 px-1.5 py-0.5">
          cp .env.example .env.local
        </code>{" "}
        を整えて起動。
      </footer>
    </main>
  );
}
