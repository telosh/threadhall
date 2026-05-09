"use client";

import { RootShell } from "@/components/layout/root-shell";

/**
 * クライアント境界のルートプロバイダー。
 * TanStack Query は「クライアントからの再取得・楽観更新」が必要になった段階で再導入する（現状はバンドル省略）。
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <RootShell>{children}</RootShell>;
}
