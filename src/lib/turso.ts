import { createClient, type Client } from "@libsql/client";
import { createClient as createTursoServerless } from "@tursodatabase/serverless/compat";

export type TursoConnectionEnv = {
  url: string;
  authToken: string | undefined;
  useServerlessSdk: boolean;
};

/**
 * Turso Cloud・ローカル sqld 共通の接続パラメータ。
 * - Cloud: `libsql://...` と `TURSO_AUTH_TOKEN`（必須）
 * - ローカル: `http://127.0.0.1:8080`、トークン空で可
 */
export function getTursoConnectionEnv(): TursoConnectionEnv {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. Copy .env.example to .env.local.",
    );
  }
  const rawToken = process.env.TURSO_AUTH_TOKEN?.trim();
  const authToken = rawToken && rawToken.length > 0 ? rawToken : undefined;
  const useServerlessSdk = process.env.THREADHALL_USE_SERVERLESS_SDK === "1";
  return { url, authToken, useServerlessSdk };
}

/**
 * アプリのプライマリ DB・Better Auth（Kysely）・マイグレーションで同じ規則を使う libSQL クライアント。
 * `THREADHALL_USE_SERVERLESS_SDK=1` のときは `@tursodatabase/serverless/compat`（Edge 向け公式経路）。
 */
export function createTursoClient(): Client {
  const { url, authToken, useServerlessSdk } = getTursoConnectionEnv();

  if (useServerlessSdk) {
    return (
      authToken
        ? createTursoServerless({ url, authToken })
        : createTursoServerless({ url })
    ) as Client;
  }

  return authToken ? createClient({ url, authToken }) : createClient({ url });
}
