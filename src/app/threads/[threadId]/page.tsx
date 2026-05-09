import Image from "next/image";
import { notFound } from "next/navigation";
import { Info, MoreHorizontal, Reply, ThumbsUp } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { ThreadComposer } from "@/components/domain/thread-composer";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  findThreadById,
  listPostsByThread,
  MOCK_ORGANIZATIONS,
  MOCK_THREADS,
} from "@/lib/mock-data";

/** リスト項目の React key 用（本文が同一でも post 内で一意になるように序数を含む） */
function postParagraphKey(postId: string, body: string, ordinal: number) {
  let h = 0;
  for (let j = 0; j < body.length; j++) {
    h = (Math.imul(31, h) + body.charCodeAt(j)) | 0;
  }
  return `${postId}:${ordinal}:h${(h >>> 0).toString(36)}`;
}

/**
 * スレッド詳細。
 *
 * - 一次ソース UI: docs/stich/aistudio/src/components/ThreadView.tsx
 * - ページ仕様: docs/pages/threads-id.md
 * - スレッドの状態（active / archived など）に応じて Composer を `disabled` に切替
 *   （現状の mock では archived フラグなし。FR-07 接続時に分岐を増やす）
 */

export async function generateStaticParams() {
  return MOCK_THREADS.map((t) => ({ threadId: t.id }));
}

type Props = {
  params: Promise<{ threadId: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { threadId } = await params;
  const thread = findThreadById(threadId);
  return {
    title: thread ? thread.title : "Thread",
  };
}

export default async function ThreadDetailPage({ params }: Props) {
  const { threadId } = await params;
  const thread = findThreadById(threadId);
  if (!thread) notFound();

  const org = MOCK_ORGANIZATIONS.find((o) => o.id === thread.organization_id);
  const posts = listPostsByThread(thread.id);

  return (
    <>
      <TopBar
        breadcrumb={
          org
            ? `Organizations / ${org.display_name} / Threads`
            : "Threads"
        }
      />
      <main className="bg-background flex-1 overflow-hidden">
        <div className="border-outline-variant bg-surface-bright relative mx-auto flex h-full max-w-3xl flex-col border-x shadow-sm">
          <div className="bg-surface-bright/95 border-outline-variant p-gutter sticky top-0 z-10 flex items-start justify-between border-b backdrop-blur-sm">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-surface-variant text-on-surface-variant font-label-sm border-outline-variant rounded border px-2 py-0.5 text-[10px]">
                  Discussion
                </span>
                <span className="text-text-dim font-label-sm flex items-center gap-1 text-[10px]">
                  Active
                </span>
              </div>
              <h1 className="font-headline text-headline-xl text-primary tracking-tight">
                {thread.title}
              </h1>
            </div>
            <button
              type="button"
              aria-label="Thread info"
              className="text-on-surface-variant hover:bg-surface-variant rounded-lg p-2 transition-colors md:hidden"
            >
              <Info size={20} />
            </button>
          </div>

          <div className="p-gutter space-y-stack-lg flex-1 overflow-y-auto pb-40">
            {posts.length === 0 ? (
              <p className="text-text-dim text-body-md">
                まだ投稿はありません。
              </p>
            ) : (
              posts.map((post, idx) => (
                <article key={post.id} className="group flex gap-4">
                  <div className="flex w-10 shrink-0 flex-col items-center">
                    <UserAvatar
                      src={post.avatar}
                      alt={post.author}
                      size={40}
                    />
                    {idx < posts.length - 1 ? (
                      <div className="bg-outline-variant mt-2 h-full w-px"></div>
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-label-sm text-primary text-xs font-bold">
                          {post.author}
                        </span>
                        <span className="font-label-sm text-text-dim text-[10px]">
                          {post.timestamp}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="More"
                        className="text-text-dim hover:text-primary opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                    <div className="prose prose-sm text-body-md text-on-surface max-w-none leading-relaxed">
                      {post.paragraphs.map((p, i) => (
                        <p
                          key={postParagraphKey(post.id, p, i)}
                          className={i > 0 ? "mt-2" : "mb-4"}
                        >
                          {p}
                        </p>
                      ))}
                      {post.imageUrl ? (
                        <div className="border-outline-variant bg-surface mt-4 max-w-lg overflow-hidden rounded-xl border shadow-inner">
                          <Image
                            src={post.imageUrl}
                            alt="attachment"
                            width={640}
                            height={400}
                            className="h-auto w-full object-cover"
                          />
                        </div>
                      ) : null}
                    </div>
                    {typeof post.likes === "number" ? (
                      <div className="border-outline-variant/30 mt-4 flex items-center gap-4 border-t pt-3">
                        <button
                          type="button"
                          className="text-text-dim hover:text-primary font-label-sm flex items-center gap-1 text-[10px] transition-colors"
                        >
                          <ThumbsUp size={14} /> {post.likes}
                        </button>
                        <button
                          type="button"
                          className="text-text-dim hover:text-primary font-label-sm flex items-center gap-1 text-[10px] transition-colors"
                        >
                          <Reply size={14} /> Reply
                        </button>
                      </div>
                    ) : null}
                  </div>
                </article>
              ))
            )}
          </div>

          <ThreadComposer />
        </div>
      </main>
    </>
  );
}
