import { LibsqlDialect } from "@libsql/kysely-libsql";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";

const useEmulateGoogle = process.env.THREADHALL_USE_EMULATE_GOOGLE === "1";
const hasRealGoogle =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

/** emulate オンのときは本番用 Google 環境変数があっても emulate を優先 */
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
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL が未設定です。Better Auth は user / session 用にプライマリ DB と同一 libSQL を参照します。",
    );
  }
  return {
    type: "sqlite" as const,
    dialect: new LibsqlDialect({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN || undefined,
    }),
  };
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
