"use client";

import { useUiStore } from "@/stores/ui-store";

/**
 * Zustand の UI ストアをアプリ直下にぶら下げ、将来のレイアウト（サイドバー等）の土台にする。
 */
export function RootShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      data-sidebar-open={sidebarOpen}
    >
      {children}
    </div>
  );
}
