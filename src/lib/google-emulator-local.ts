/**
 * Google OAuth emulator（`/emulate/google`）はローカル開発だけで有効にする。
 * Cloud Run は `NODE_ENV` が開発向きでも動くので、フラグ単体では不十分（K_SERVICE 等で抑止）。
 *
 * `NODE_ENV` は Next の既定の `development` に加え、運用で `dev` を使う場合も許可する。
 * `prod` / `production` はここでは許可しない。
 */
const EMULATOR_ALLOWED_NODE_ENVS = new Set(["development", "dev"]);

export function isGoogleEmulatorRuntimeAllowed(): boolean {
  if (process.env.THREADHALL_USE_EMULATE_GOOGLE !== "1") return false;
  const nodeEnv = process.env.NODE_ENV;
  if (!nodeEnv || !EMULATOR_ALLOWED_NODE_ENVS.has(nodeEnv)) return false;
  if (process.env.K_SERVICE) return false;
  if (process.env.VERCEL) return false;
  return true;
}
