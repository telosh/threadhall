import { createClient, type Client } from "@libsql/client";

declare global {
  var __threadhallDb: Client | undefined;
}

function createConfiguredClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. Copy .env.example to .env.local and start libsql (docker compose up sqld).",
    );
  }

  const authToken = process.env.TURSO_AUTH_TOKEN;
  return authToken ? createClient({ url, authToken }) : createClient({ url });
}

/**
 * libSQL / Turso へのクライアント（サーバー専用）。
 * Route Handlers・Server Components・Server Actions から呼び出す。
 */
export function getDb(): Client {
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
