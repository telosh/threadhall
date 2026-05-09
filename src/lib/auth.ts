import { LibsqlDialect } from "@libsql/kysely-libsql";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";

import { getTursoConnectionEnv, createTursoClient } from "@/lib/turso";
import { isGoogleEmulatorRuntimeAllowed } from "@/lib/google-emulator-local";

const useEmulateGoogle = isGoogleEmulatorRuntimeAllowed();
const hasRealGoogle =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

/** 許可環境でのみ emulate が有効。オン時は本番用 Google の環境変数があっても emulate を優先 */
export const authGoogleEnabled = useEmulateGoogle || hasRealGoogle;

function resolveBaseUrl(): string {
  const explicit = process.env.BETTER_AUTH_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

const baseUrl = resolveBaseUrl();

function libsqlDatabase() {
  try {
    const { url, authToken, useServerlessSdk } = getTursoConnectionEnv();
    // kysely-libsql の型定義が古い @libsql/client に固定されているため、サーバレス SDK 経路だけ never で合わせる（実行時は同一プロトコル）。
    const dialect = useServerlessSdk
      ? new LibsqlDialect({ client: createTursoClient() as never })
      : new LibsqlDialect({ url, authToken });
    return {
      type: "sqlite" as const,
      dialect,
    };
  } catch {
    throw new Error(
      "TURSO_DATABASE_URL が未設定です。Better Auth は user / session 用にプライマリ DB と同一 libSQL（Turso Cloud なら `libsql://` + TURSO_AUTH_TOKEN）を参照します。",
    );
  }
}

const emulateGooglePlugin = useEmulateGoogle
  ? genericOAuth({
      config: [
        {
          providerId: "google-emulate",
          clientId:
            process.env.GOOGLE_CLIENT_ID ??
            "threadhall-emulate.apps.googleusercontent.com",
          clientSecret:
            process.env.GOOGLE_CLIENT_SECRET ?? "GOCSPX-threadhall-emulate",
          authorizationUrl: `${baseUrl}/emulate/google/o/oauth2/v2/auth`,
          tokenUrl: `${baseUrl}/emulate/google/oauth2/token`,
          userInfoUrl: `${baseUrl}/emulate/google/oauth2/v2/userinfo`,
          scopes: ["openid", "email", "profile"],
          pkce: true,
          prompt: "select_account",
        },
      ],
    })
  : null;

export const auth = betterAuth({
  appName: "Threadhall",
  baseURL: baseUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  database: libsqlDatabase(),
  emailAndPassword: { enabled: false },
  socialProviders: {
    ...(!useEmulateGoogle && hasRealGoogle
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: "select_account",
          },
        }
      : {}),
  },
  plugins: [
    ...(emulateGooglePlugin ? [emulateGooglePlugin] : []),
    nextCookies(),
  ],
});
