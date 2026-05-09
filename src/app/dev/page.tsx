import Link from "next/link";
import { headers } from "next/headers";
import {
  BetterAuthGoogleSignIn,
  BetterAuthSignOut,
} from "@/components/auth/better-auth-buttons";

export const metadata = {
  title: "Dev Scaffold",
};

import { emulateGoogleSeed } from "@/config/emulate-google-seed";
import { auth, authGoogleEnabled } from "@/lib/auth";
import { getDbOrNull } from "@/lib/db";
import { listOrganizations } from "@/server/queries/organizations";
import { listEventsForOrganization } from "@/server/queries/events";
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

  const orgBlocks =
    db && dbPing === "ok" && orgCount !== "n/a" && organizations.length > 0
      ? await Promise.all(
          organizations.map(async (org) => ({
            org,
            threads: await listThreadsForOrganization(db, org.id),
            events: await listEventsForOrganization(db, org.id),
          })),
        )
      : [];

  let session: Awaited<ReturnType<typeof auth.api.getSession>> = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    session = null;
  }
  const emulateGoogle = process.env.THREADHALL_USE_EMULATE_GOOGLE === "1";

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-8 px-6 py-12 sm:px-8 sm:py-16">
      <header className="space-y-3">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.02em] text-text-dim">
          Threadhall
        </p>
        <h1 className="font-heading text-[1.75rem] font-semibold leading-[1.2] tracking-tight text-on-surface sm:text-[2.25rem]">
          開発用スキャフォールド
        </h1>
        <p className="text-[0.9375rem] leading-relaxed text-text-dim">
          Next.js App Router · Turso / libSQL · SQL マイグレーション · Zod ·
          Zustand · Docker（sqld）
        </p>
      </header>

      {created ? (
        <p className="rounded-lg border border-secondary/30 bg-secondary/[0.06] px-4 py-3 text-sm text-on-surface">
          組織を作成しました。
        </p>
      ) : null}
      {errorMessage ? (
        <p className="rounded-lg border border-error/30 bg-error/[0.06] px-4 py-3 text-sm text-error">
          {errorMessage}
        </p>
      ) : null}

      {authGoogleEnabled ? (
        <section className="rounded-xl border border-border-low bg-white p-5 shadow-sm shadow-black/[0.04]">
          <h2 className="font-heading text-sm font-semibold text-on-surface">
            サインイン{emulateGoogle ? "（Google · ローカル emulate）" : ""}
          </h2>
          {emulateGoogle ? (
            <p className="mt-2 text-xs text-text-dim">
              GCP の OAuth クライアントなしで開発できます。下のボタンから
              <code className="mx-1 rounded bg-surface-container px-1 font-mono text-thread-stable">
                /emulate/google
              </code>
              のアカウント選択 UI に進み、シード済みの仮ユーザーを選んでください。ユーザーを増やすときは{" "}
              <code className="rounded bg-surface-container px-1 font-mono text-thread-stable">
                src/config/emulate-google-seed.ts
              </code>{" "}
              を編集します。
            </p>
          ) : (
            <p className="mt-2 text-xs text-text-dim">
              本番用の Google OAuth クレデンシャルでサインインします。
            </p>
          )}
          {emulateGoogle ? (
            <ul className="mt-3 space-y-1 border-t border-border-low pt-3 font-mono text-xs text-text-dim">
              {emulateGoogleSeed.users.map((u) => (
                <li key={u.email}>
                  {u.email}{" "}
                  <span className="text-text-dim">（{u.name}）</span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            {session?.user ? (
              <>
                <span className="text-on-surface">
                  <span className="text-text-dim">ログイン中</span>{" "}
                  {session.user.name ?? session.user.email ?? "（名無し）"}
                  {session.user.email ? (
                    <span className="font-mono text-xs text-text-dim">
                      {" "}
                      ({session.user.email})
                    </span>
                  ) : null}
                </span>
                <BetterAuthSignOut />
              </>
            ) : (
              <BetterAuthGoogleSignIn
                mode={emulateGoogle ? "emulate" : "google"}
              />
            )}
          </p>
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-outline-variant bg-surface-muted p-5">
          <h2 className="font-heading text-sm font-semibold text-on-surface">サインイン</h2>
          <p className="mt-2 text-xs text-text-dim">
            未設定です。`.env.local` に{" "}
            <code className="rounded bg-surface-container px-1 font-mono text-thread-stable">
              BETTER_AUTH_SECRET
            </code>{" "}
            （32 文字以上）・{" "}
            <code className="rounded bg-surface-container px-1 font-mono text-thread-stable">
              BETTER_AUTH_URL
            </code>
            ・プライマリと同一の{" "}
            <code className="rounded bg-surface-container px-1 font-mono text-thread-stable">
              TURSO_DATABASE_URL
            </code>{" "}
            を入れ、emulate 利用時は{" "}
            <code className="rounded bg-surface-container px-1 font-mono text-thread-stable">
              THREADHALL_USE_EMULATE_GOOGLE=1
            </code>
            、本番 Google のみのときは{" "}
            <code className="rounded bg-surface-container px-1 font-mono text-thread-stable">
              GOOGLE_CLIENT_ID
            </code>{" "}
            /{" "}
            <code className="rounded bg-surface-container px-1 font-mono text-thread-stable">
              GOOGLE_CLIENT_SECRET
            </code>{" "}
            を追加してください（詳細は{" "}
            <code className="font-mono text-thread-stable">.env.example</code>）。
          </p>
        </section>
      )}

      <section className="rounded-xl border border-border-low bg-white p-5 shadow-sm shadow-black/[0.04]">
        <h2 className="font-heading text-sm font-semibold text-on-surface">データベース接続</h2>
        <dl className="mt-3 space-y-2 text-sm text-text-dim">
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-text-dim">状態</dt>
            <dd className="font-mono text-on-surface">
              {dbPing === "unset" && "未設定（.env.local を確認）"}
              {dbPing === "ok" && "接続OK（SELECT 1）"}
              {dbPing === "error" && "接続エラー"}
            </dd>
          </div>
          {dbDetail ? (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-text-dim">詳細</dt>
              <dd className="break-all text-error">{dbDetail}</dd>
            </div>
          ) : null}
          {dbPing === "ok" ? (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-text-dim">organizations</dt>
              <dd className="font-mono text-on-surface">
                {orgCount === "n/a"
                  ? "未適用（npm run db:migrate）"
                  : `${orgCount} 件`}
              </dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-4 text-xs text-text-dim">
          JSON で確認:{" "}
          <Link
            href="/api/health/db"
            className="text-secondary underline decoration-secondary/40 underline-offset-2 hover:text-secondary-container"
          >
            /api/health/db
          </Link>
          {" · "}
          <Link
            href="/api/organizations"
            className="text-secondary underline decoration-secondary/40 underline-offset-2 hover:text-secondary-container"
          >
            /api/organizations
          </Link>
          {" · "}
          <span className="text-text-dim">
            /api/threads?organization_id=… /api/events?organization_id=…
          </span>
        </p>
      </section>

      {dbPing === "ok" && orgCount !== "n/a" ? (
        <section className="rounded-xl border border-border-low bg-white p-5 shadow-sm shadow-black/[0.04]">
          <h2 className="font-heading text-sm font-semibold text-on-surface">
            試用: 組織を1件作成（認可なし・開発用）
          </h2>
          <p className="mt-2 text-xs text-text-dim">
            `.env.local` に{" "}
            <code className="rounded bg-surface-container px-1 text-on-surface">
              THREADHALL_ALLOW_DEV_ORG_FORM=1
            </code>{" "}
            が必要です。本番では FR-08 後に無効のままです。
          </p>
          <form
            action={createOrganizationFormAction}
            className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
          >
            <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-xs text-text-dim">
              表示名
              <input
                name="display_name"
                required
                maxLength={200}
                placeholder="サンプル研究室"
                className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface placeholder:text-text-dim"
              />
            </label>
            <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-xs text-text-dim">
              slug（URL用・英小文字とハイフン）
              <input
                name="slug"
                required
                maxLength={64}
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                placeholder="sample-lab"
                className="rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-sm text-on-surface placeholder:text-text-dim"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90"
            >
              作成
            </button>
          </form>
        </section>
      ) : null}

      {orgBlocks.length > 0 ? (
        <section className="rounded-xl border border-border-low bg-white p-5 shadow-sm shadow-black/[0.04]">
          <h2 className="font-heading text-sm font-semibold text-on-surface">
            組織別一覧（FR-02 スレッド / FR-03 イベント）
          </h2>
          <p className="mt-2 text-xs text-text-dim">
            スレッド:{" "}
            <code className="rounded bg-surface-container px-1 font-mono text-thread-stable">
              POST /api/threads
            </code>
            イベント:{" "}
            <code className="rounded bg-surface-container px-1 font-mono text-thread-stable">
              POST /api/events
            </code>
            （phase 昇格は{" "}
            <code className="rounded bg-surface-container px-1 font-mono text-thread-stable">
              PATCH /api/events/[id]
            </code>
            、body の{" "}
            <code className="font-mono text-thread-stable">phase</code> は{" "}
            <code className="font-mono text-thread-stable">live</code> または{" "}
            <code className="font-mono text-thread-stable">archived</code>
            ）
          </p>
          <ul className="mt-4 space-y-6">
            {orgBlocks.map(({ org, threads, events }) => (
              <li key={org.id}>
                <h3 className="text-sm font-semibold text-on-surface">
                  {org.display_name}{" "}
                  <span className="font-mono text-xs font-normal text-text-dim">
                    ({org.slug})
                  </span>
                </h3>
                <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <Link
                    href={`/api/threads?organization_id=${encodeURIComponent(org.id)}`}
                    className="text-secondary underline decoration-secondary/40 underline-offset-2 hover:text-secondary-container"
                  >
                    threads JSON
                  </Link>
                  <Link
                    href={`/api/events?organization_id=${encodeURIComponent(org.id)}`}
                    className="text-secondary underline decoration-secondary/40 underline-offset-2 hover:text-secondary-container"
                  >
                    events JSON
                  </Link>
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="font-mono text-[12px] font-medium uppercase tracking-wide text-text-dim">
                      スレッド
                    </p>
                    {threads.length === 0 ? (
                      <p className="mt-1 text-sm text-text-dim">
                        まだありません
                      </p>
                    ) : (
                      <ul className="mt-1 space-y-1 text-sm text-on-surface">
                        {threads.map((t) => (
                          <li key={t.id} className="font-mono text-xs">
                            {t.slug}{" "}
                            <span className="text-text-dim">: {t.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-[12px] font-medium uppercase tracking-wide text-text-dim">
                      イベント
                    </p>
                    {events.length === 0 ? (
                      <p className="mt-1 text-sm text-text-dim">
                        まだありません
                      </p>
                    ) : (
                      <ul className="mt-1 space-y-1 text-sm text-on-surface">
                        {events.map((ev) => (
                          <li key={ev.id} className="font-mono text-xs">
                            {ev.slug}{" "}
                            <span className="text-text-dim">
                              : {ev.title}{" "}
                              <span className="text-text-dim">
                                [{ev.phase}]
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="text-xs text-text-dim">
        <code className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-thread-stable">
          docker compose up -d sqld
        </code>{" "}
        と{" "}
        <code className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-thread-stable">
          npm run db:migrate
        </code>{" "}
        後、
        <code className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-thread-stable">
          cp .env.example .env.local
        </code>{" "}
        を整えて起動。
      </footer>
    </main>
  );
}
