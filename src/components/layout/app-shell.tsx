import { Sidebar } from "./sidebar";
import { MobileBottomNav } from "./mobile-bottom-nav";

/**
 * 全画面共通シェル。サイドバー（PC）+ ボトムナビ（モバイル）+ メインスロット。
 *
 * - 一次ソース: docs/stich/aistudio/src/App.tsx
 * - 各 page.tsx は <TopBar breadcrumb={...} /> + 本文を children として渡す。
 * - thread / event-log のような full-bleed ページでも同じシェルで OK
 *   （内側の main で overflow を持たせる）。
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-on-background font-body flex min-h-screen">
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden md:ml-64">
        {children}
      </div>

      <MobileBottomNav />
    </div>
  );
}
