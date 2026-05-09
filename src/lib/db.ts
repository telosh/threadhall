import type { Client } from "@libsql/client";
import { createTursoClient } from "@/lib/turso";

declare global {
  var __threadhallDb: Client | undefined;
}

/**
 * libSQL / Turso へのクライアント（サーバー専用）。
 * Route Handlers・Server Components・Server Actions から呼び出す。
 */
function getDb(): Client {
  if (process.env.NODE_ENV === "production") {
    return createTursoClient();
  }

  if (!globalThis.__threadhallDb) {
    globalThis.__threadhallDb = createTursoClient();
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
