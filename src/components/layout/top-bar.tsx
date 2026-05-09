import { Bell, Settings } from "lucide-react";
import { MOCK_CURRENT_USER_IMAGE } from "@/lib/mock-data";
import { UserAvatar } from "@/components/ui/user-avatar";

/**
 * AI Studio mock 準拠の TopBar。
 *
 * - 一次ソース: docs/stich/aistudio/src/components/Navigation.tsx (TopBar)
 * - ブレッドクラム表示は決定事項（前チャット）。検索バーは MVP では出さない。
 * - アバターは Google プロフィール URL またはデフォアイコン（`UserAvatar`）。
 */
export function TopBar({
  breadcrumb,
  userImageUrl = MOCK_CURRENT_USER_IMAGE,
}: {
  /** "Organizations / Local History Club" のような区切りで渡す */
  breadcrumb: string;
  /** Google アカウント等の画像 URL。未指定時は mock の `MOCK_CURRENT_USER_IMAGE`、それも null ならデフォアイコン */
  userImageUrl?: string | null;
}) {
  return (
    <header className="bg-surface border-outline-variant sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b px-margin-page">
      <div className="flex items-center md:hidden">
        <h1 className="text-headline-md text-primary font-bold tracking-tight">
          Threadhall
        </h1>
      </div>
      <div className="hidden items-center md:flex">
        <span className="text-body-md text-on-surface-variant">
          {breadcrumb}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          aria-label="Notifications"
          className="text-on-surface-variant hover:bg-surface-container rounded-full p-2 transition-colors duration-200 active:scale-95"
        >
          <Bell size={20} />
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="text-on-surface-variant hover:bg-surface-container rounded-full p-2 transition-colors duration-200 active:scale-95"
        >
          <Settings size={20} />
        </button>
        <UserAvatar src={userImageUrl} alt="プロフィール" size={32} />
      </div>
    </header>
  );
}
