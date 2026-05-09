"use client";

/**
 * クライアント境界のルートプロバイダー。
 *
 * 現状はクライアント側のグローバル状態を持たないので素通し。
 * TanStack Query / テーマ切替などを入れる段階でラッパーを追加する。
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
