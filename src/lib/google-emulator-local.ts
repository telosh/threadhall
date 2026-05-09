/**
 * Google OAuth emulator（`/emulate/google`）はローカルの `next dev` だけで有効にする。
 * Cloud Run は `NODE_ENV === "development"` でも next dev が動くため、フラグ単体では不十分。
 */
export function isGoogleEmulatorRuntimeAllowed(): boolean {
  if (process.env.THREADHALL_USE_EMULATE_GOOGLE !== "1") return false;
  if (process.env.NODE_ENV !== "development") return false;
  if (process.env.K_SERVICE) return false;
  if (process.env.VERCEL) return false;
  return true;
}
