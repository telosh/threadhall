import { createClient, type Client } from "@libsql/client";
import { createClient as createTursoServerless } from "@tursodatabase/serverless/compat";

declare global {
  var __threadhallDb: Client | undefined;
}

/**
 * `THREADHALL_USE_SERVERLESS_SDK=1` のとき Turso 公式サーバレス（libSQL 互換 API）を使う。
 * Edge など `@libsql/client` が向かない場合の逃げ道。@see https://docs.turso.tech/sdk/ts/quickstart
 */
function createConfiguredClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. Copy .env.example to .env.local and start libsql (docker compose up sqld).",
    );
  }

  const authToken = process.env.TURSO_AUTH_TOKEN;
  const useServerless = process.env.THREADHALL_USE_SERVERLESS_SDK === "1";

  if (useServerless) {
    return (
      authToken
        ? createTursoServerless({ url, authToken })
        : createTursoServerless({ url })
    ) as Client;
  }

  return authToken ? createClient({ url, authToken }) : createClient({ url });
}

/**
 * libSQL / Turso へのクライアント（サーバー専用）。
 * Route Handlers・Server Components・Server Actions から呼び出す。
 */
function getDb(): Client {
  if (process.env.NODE_ENV === "production") {
    return createConfiguredClient();
  }

  if (!globalThis.__threadhallDb) {
    globalThis.__threadhallDb = createConfiguredClient();
  }

  return globalThis.__threadhallDb;
}

export function getDbOrNull(): Client | null {
  try {
    return getDb();
  } catch {
    return null;
  }
}
