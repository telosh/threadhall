import Link from "next/link";
import { CalendarDays, Landmark } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { ThreadCard } from "@/components/domain/thread-card";
import { EventCard } from "@/components/domain/event-card";
import { SectionHeading } from "@/components/domain/section-heading";
import {
  MOCK_ORGANIZATIONS,
  MOCK_THREADS,
  MOCK_EVENTS,
} from "@/lib/mock-data";

/**
 * ダッシュボード（Overview）。
 *
 * - 一次ソース UI: docs/stich/aistudio/src/components/DashboardView.tsx
 * - ページ仕様: docs/pages/dashboard.md
 * - ロール別の見え方は dashboard.md を参照（未ログイン時は LP へリダイレクトする想定）
 * - 本番データ接続は別 PR（FR-01/02/03 の Issue 配下）
 */
export const metadata = {
  title: "Overview",
};

export default function DashboardPage() {
  const threads = MOCK_THREADS.slice(0, 3);
  const upcomingEvents = MOCK_EVENTS.filter((e) => e.id !== "event_summer_festival");
  const myOrgs = MOCK_ORGANIZATIONS.filter((o) => o.slug !== "local-history-club").slice(0, 2);

  return (
    <>
      <TopBar breadcrumb="Overview" />
      <main className="bg-background scroll-smooth flex-1 overflow-y-auto">
        <div className="p-margin-page space-y-stack-lg">
          <div className="mb-stack-lg flex items-end justify-between">
            <div>
              <h1 className="text-headline-xl text-primary font-bold tracking-tight">
                Overview
              </h1>
              <p className="text-text-dim text-body-lg mt-1">
                Your active domains and upcoming schedule.
              </p>
            </div>
            <button
              type="button"
              className="bg-primary text-on-primary hover:bg-surface-tint flex items-center gap-2 rounded-lg px-4 py-2 transition-colors"
            >
              <CalendarDays size={18} />
              <span className="font-label-sm">Create New</span>
            </button>
          </div>

          <div className="lg:grid-cols-12 gap-gutter grid grid-cols-1">
            <div className="lg:col-span-8 space-y-stack-md">
              <SectionHeading
                title="Active Threads"
                action={
                  <button className="text-label-sm text-secondary text-sm hover:underline">
                    View All
                  </button>
                }
              />
              <div className="space-y-4">
                {threads.map((thread) => (
                  <ThreadCard
                    key={thread.id}
                    thread={thread}
                    variant="compact"
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-stack-lg">
              <div>
                <SectionHeading
                  title="Schedule"
                  action={
                    <CalendarDays size={18} className="text-text-dim" />
                  }
                />
                <div className="space-y-stack-sm">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      variant="schedule"
                    />
                  ))}
                </div>
              </div>

              <div>
                <SectionHeading
                  title="My Organizations"
                  action={<Landmark size={18} className="text-text-dim" />}
                />
                <div className="grid grid-cols-2 gap-stack-sm">
                  {myOrgs.map((org) => (
                    <Link
                      key={org.id}
                      href={`/orgs/${org.slug}`}
                      className="bg-surface border-outline-variant hover:border-primary flex items-center gap-3 rounded-lg border p-3 transition-colors"
                    >
                      <div className="bg-surface-container-highest text-primary flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold">
                        {org.display_name
                          .split(" ")
                          .map((s) => s[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <span className="text-body-md text-primary truncate font-medium">
                        {org.display_name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
