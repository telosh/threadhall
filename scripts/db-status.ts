/**
 * プライマリ DB のマイグレ適用状況と主要テーブルの行数を表示する。
 *
 * Turso CLI（https://docs.turso.tech/cli/installation）が使えない環境でも、
 * アプリと同じ @libsql/client（`src/lib/turso.ts`）で接続して検査できる。
 *
 * Usage: npm run db:status
 * （`.env.local` の TURSO_DATABASE_URL。Turso Cloud なら TURSO_AUTH_TOKEN も）
 */
import type { Client } from "@libsql/client";
import { config as loadEnv } from "dotenv";
import { join } from "path";

import { createTursoClient } from "../src/lib/turso";

loadEnv({ path: join(process.cwd(), ".env.local"), override: false });
loadEnv({ path: join(process.cwd(), ".env"), override: false });

async function tableExists(db: Client, name: string): Promise<boolean> {
  const r = await db.execute({
    sql: "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1",
    args: [name],
  });
  return r.rows.length > 0;
}

async function safeCount(db: Client, table: string): Promise<number | null> {
  if (!(await tableExists(db, table))) return null;
  const r = await db.execute({
    sql: `SELECT COUNT(*) AS n FROM "${table}"`,
  });
  const row = r.rows[0] as unknown as Record<string, number | bigint> | undefined;
  if (!row || !("n" in row)) return 0;
  const n = row["n"];
  return typeof n === "bigint" ? Number(n) : Number(n);
}

function maskUrl(raw: string): string {
  const u = raw.trim();
  if (!u) return "(empty)";
  if (u.startsWith("libsql://")) {
    try {
      const host = u.replace(/^libsql:\/\//, "").split("/")[0];
      return host ? `libsql://${host}/…` : "libsql://…";
    } catch {
      return "libsql://…";
    }
  }
  return u;
}

async function main() {
  let db: Client;
  try {
    db = createTursoClient();
  } catch {
    console.error(
      "TURSO_DATABASE_URL が未設定です。.env.local を参照するか、環境変数を直接指定してください。",
    );
    process.exit(1);
  }

  const url = process.env.TURSO_DATABASE_URL?.trim() ?? "";
  console.log(`接続先: ${maskUrl(url)}`);

  try {
    if (!(await tableExists(db, "schema_migrations"))) {
      console.log(
        "\nschema_migrations がありません。`npm run db:migrate` を先に実行してください。",
      );
      return;
    }

    const versions = await db.execute(
      "SELECT version FROM schema_migrations ORDER BY version",
    );
    console.log("\n適用済みマイグレーション:");
    for (const row of versions.rows) {
      const rec = row as unknown as Record<string, string>;
      const v = rec["version"];
      if (typeof v === "string") console.log(`  ${v}`);
    }

    const counts: [string, string][] = [
      ["organizations", "organizations"],
      ["threads", "threads"],
      ["events", "events"],
      ["user", "user (Better Auth)"],
      ["session", "session"],
      ["account", "account"],
    ];

    console.log("\n行数（テーブル無しの場合は —）:");
    for (const [table, label] of counts) {
      const n = await safeCount(db, table);
      console.log(`  ${label}: ${n === null ? "—" : n}`);
    }

    console.log("\nOK（読み取りのみ）");
  } finally {
    db.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
