import { createClient } from "@tursodatabase/serverless/compat";

/**
 * Turso 公式サーバレス SDK（libSQL 互換 API）。
 * Vercel Edge 等ではこちらを優先することがある。
 *
 * @see https://docs.turso.tech/sdk/ts/quickstart
 */
export function createTursoServerlessClient() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set");
  }

  const authToken = process.env.TURSO_AUTH_TOKEN;
  return authToken ? createClient({ url, authToken }) : createClient({ url });
}
