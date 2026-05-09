import Link from "next/link";
import { getDbOrNull } from "@/lib/db";
import { listOrganizations } from "@/server/queries/organizations";

export default async function Home() {
  const db = getDbOrNull();
  let dbPing: "ok" | "error" | "unset" = "unset";
  let dbDetail: string | null = null;
  let orgCount: number | "n/a" = "n/a";

  if (db) {
    try {
      await db.execute("SELECT 1");
      dbPing = "ok";
      try {
        const orgs = await listOrganizations(db);
        orgCount = orgs.length;
      } catch {
        orgCount = "n/a";
      }
    } catch (e) {
      dbPing = "error";
      dbDetail = e instanceof Error ? e.message : String(e);
    }
  }

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
          Next.js App Router · Turso / libSQL · SQL マイグレーション · Zod · Zustand · Docker（sqld）
        </p>
      </header>

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
        </p>
      </section>

      <footer className="text-xs text-zinc-600">
        <code className="rounded bg-zinc-900 px-1.5 py-0.5">docker compose up -d sqld</code> と{" "}
        <code className="rounded bg-zinc-900 px-1.5 py-0.5">npm run db:migrate</code> 後、
        <code className="rounded bg-zinc-900 px-1.5 py-0.5">cp .env.example .env.local</code>{" "}
        を整えて起動。
      </footer>
    </main>
  );
}
