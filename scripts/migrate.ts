/**
 * libSQL / sqld へのマイグレーション適用（ORM なし）。
 * `npm run db:migrate`
 *
 * Node で .env.local を読む（Next.js 外なので手動で dotenv）
 */
import type { Client } from "@libsql/client";
import { config as loadEnv } from "dotenv";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

import { createTursoClient } from "../src/lib/turso";

loadEnv({ path: join(process.cwd(), ".env.local"), override: false });
loadEnv({ path: join(process.cwd(), ".env"), override: false });

const MIGRATIONS_DIR = join(process.cwd(), "db", "migrations");

function listMigrationFiles(): string[] {
  const names = readdirSync(MIGRATIONS_DIR).filter((n) => /^\d{4}_.*\.sql$/.test(n));
  return names.sort();
}

async function isMigrationApplied(
  db: Client,
  version: string,
): Promise<boolean> {
  const meta = await db.execute({
    sql: "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'schema_migrations' LIMIT 1",
  });
  if (meta.rows.length === 0) {
    return false;
  }
  const row = await db.execute({
    sql: "SELECT 1 AS n FROM schema_migrations WHERE version = ? LIMIT 1",
    args: [version],
  });
  return row.rows.length > 0;
}

async function main() {
  let db: Client;
  try {
    db = createTursoClient();
  } catch {
    console.error(
      "TURSO_DATABASE_URL is not set (.env.local 参照)。Turso Cloud の場合は libsql://… と TURSO_AUTH_TOKEN も設定してください。",
    );
    process.exit(1);
  }

  try {
    const files = listMigrationFiles();
    if (files.length === 0) {
      console.log("マイグレーションファイルがありません。");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      if (await isMigrationApplied(db, file)) {
        console.log(`skip ${file}`);
        continue;
      }

      const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
      console.log(`apply ${file} …`);

      await db.executeMultiple(sql);
      await db.execute({
        sql: "INSERT INTO schema_migrations (version) VALUES (?)",
        args: [file],
      });
      console.log(`ok  ${file}`);
    }

    console.log("完了。");
  } finally {
    db.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
