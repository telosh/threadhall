import Link from "next/link";
import { Bookmark, Eye, MessageSquare } from "lucide-react";
import type { MockThread } from "@/lib/mock-data";

/**
 * スレッドカード。
 *
 * - 一次ソース: docs/stich/aistudio/src/components/{DashboardView,OrganizationView}.tsx
 * - variant:
 *   - "compact"  : ダッシュボード用（左にアイコン枠、本文 line-clamp-2）
 *   - "detailed" : 組織ページ用（タイトル大、メトリクス + 参加者ドット）
 *   - "resolved" : 解決済み（破線・低彩度。書込導線無し）
 */

type Variant = "compact" | "detailed" | "resolved";

export function ThreadCard({
  thread,
  variant = "detailed",
}: {
  thread: MockThread;
  variant?: Variant;
}) {
  if (variant === "resolved") {
    return (
      <div className="bg-surface-container-low border-outline-variant rounded-xl border border-dashed p-6 opacity-75">
        <div className="mb-2 flex items-start justify-between">
          <h4 className="text-headline-md text-on-surface-variant font-bold">
            {thread.title}
          </h4>
          <span className="bg-surface-variant text-on-surface-variant font-label-sm rounded px-2 py-0.5 text-[10px] uppercase tracking-wider">
            Resolved
          </span>
        </div>
        <p className="text-body-md text-text-dim italic">{thread.preview}</p>
      </div>
    );
  }

  const href = `/threads/${thread.id}`;

  if (variant === "compact") {
    return (
      <Link href={href} className="group block">
        <article className="bg-surface border-outline-variant hover:bg-surface-container-low flex gap-4 rounded-xl border p-stack-md transition-colors">
          <div className="bg-surface-variant text-text-dim border-border-low flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border">
            <MessageSquare size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-start justify-between">
              <h3 className="text-headline-md text-primary group-hover:text-secondary truncate font-semibold transition-colors">
                {thread.title}
              </h3>
              <span className="text-label-sm font-label-sm text-text-dim ml-4 whitespace-nowrap">
                {thread.timestamp}
              </span>
            </div>
            <p className="text-body-md text-on-surface-variant mb-3 line-clamp-2">
              {thread.preview}
            </p>
            <div className="text-label-sm text-text-dim flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MessageSquare size={14} />
                <span>{thread.replies} Replies</span>
              </div>
              <div className="font-label-sm flex items-center gap-1">
                {thread.author}
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      <article className="bg-surface hover:bg-surface-bright border-outline-variant cursor-pointer rounded-xl border p-6 transition-all duration-200">
        <div className="mb-3 flex items-start justify-between">
          <h4 className="text-headline-md text-primary group-hover:text-secondary font-bold leading-snug transition-colors">
            {thread.title}
          </h4>
          <span className="text-label-sm font-label-sm text-text-dim ml-4 whitespace-nowrap text-[10px]">
            {thread.timestamp}
          </span>
        </div>
        <p className="text-body-md text-on-surface-variant mb-4 line-clamp-2 leading-relaxed">
          {thread.preview}
        </p>
        <div className="text-label-sm text-text-dim flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <MessageSquare size={14} />
              <span>{thread.replies} Replies</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye size={14} />
              <span>{thread.views} Views</span>
            </span>
            {thread.pinned ? (
              <span className="text-secondary flex items-center space-x-1 font-bold uppercase">
                <Bookmark size={14} fill="currentColor" />
                <span>Pinned</span>
              </span>
            ) : null}
          </div>
          <div className="flex -space-x-2">
            <div className="bg-surface-variant border-surface h-6 w-6 rounded-full border-2"></div>
            <div className="bg-surface-dim border-surface h-6 w-6 rounded-full border-2"></div>
            <div className="bg-primary-fixed border-surface h-6 w-6 rounded-full border-2"></div>
          </div>
        </div>
      </article>
    </Link>
  );
}
