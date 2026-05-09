import { notFound } from "next/navigation";
import { Calendar, MessageSquare, PlusCircle, Users } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { ThreadCard } from "@/components/domain/thread-card";
import { EventCard } from "@/components/domain/event-card";
import { SectionHeading } from "@/components/domain/section-heading";
import {
  findOrganizationBySlug,
  listEventsByOrg,
  listThreadsByOrg,
  MOCK_ORGANIZATIONS,
} from "@/lib/mock-data";

/**
 * 組織ページ。
 *
 * - 一次ソース UI: docs/stich/aistudio/src/components/OrganizationView.tsx
 * - ページ仕様: docs/pages/orgs-slug.md
 * - URL の `slug` で組織を解決。mock データに無い slug は 404。
 */

export async function generateStaticParams() {
  return MOCK_ORGANIZATIONS.map((o) => ({ slug: o.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const org = findOrganizationBySlug(slug);
  return {
    title: org ? org.display_name : "Organizations",
  };
}

export default async function OrganizationPage({ params }: Props) {
  const { slug } = await params;
  const org = findOrganizationBySlug(slug);
  if (!org) notFound();

  const threads = listThreadsByOrg(org.id);
  const events = listEventsByOrg(org.id);

  const activeThreads = threads.filter((t) => !t.resolved).slice(0, 2);
  const resolvedThreads = threads.filter((t) => t.resolved).slice(0, 1);
  const upcomingEvents = events.slice(0, 2);

  return (
    <>
      <TopBar breadcrumb={`Organizations / ${org.display_name}`} />
      <main className="bg-background scroll-smooth flex-1 overflow-y-auto">
        <div className="p-margin-page space-y-stack-lg max-w-container-max mx-auto">
          {/* Hero Bento */}
          <div className="lg:grid-cols-3 gap-gutter grid grid-cols-1">
            <div className="bg-surface border-outline-variant lg:col-span-2 flex flex-col justify-between rounded-2xl border p-8">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-headline-xl text-primary mb-2 font-bold leading-tight">
                      {org.display_name}
                    </h2>
                    <p className="text-body-lg text-on-surface-variant max-w-2xl">
                      {org.description}
                    </p>
                  </div>
                  <div className="bg-surface-container-low border-outline-variant flex items-center space-x-2 rounded-lg border px-3 py-1">
                    <Users size={16} className="text-text-dim" />
                    <span className="font-label-sm text-text-dim text-xs">
                      {org.members} Members
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-surface-variant mt-8 flex items-center space-x-3 border-t pt-6">
                <span className="text-label-sm text-on-surface-variant text-[10px] uppercase tracking-wider">
                  Tags:
                </span>
                {org.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-surface-container text-on-surface font-label-sm border-outline-variant rounded border px-2 py-1 text-[10px] uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-surface border-outline-variant flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
              <div className="bg-secondary-container text-on-secondary-container mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                <PlusCircle size={32} />
              </div>
              <h3 className="text-headline-lg text-primary mb-2 font-bold">
                Contribute
              </h3>
              <p className="text-body-md text-on-surface-variant mb-8">
                Start a new discussion or log an upcoming historical event.
              </p>
              <div className="flex w-full gap-3">
                <button
                  type="button"
                  className="bg-primary text-on-primary font-label-sm hover:bg-surface-tint flex-1 rounded-lg py-2.5 text-xs font-bold transition-colors"
                >
                  New Thread
                </button>
                <button
                  type="button"
                  className="bg-surface text-primary font-label-sm border-outline-variant hover:bg-surface-container flex-1 rounded-lg border py-2.5 text-xs font-bold transition-colors"
                >
                  Log Event
                </button>
              </div>
            </div>
          </div>

          {/* Threads & Events */}
          <div className="xl:grid-cols-2 gap-gutter grid grid-cols-1">
            <section className="space-y-stack-md">
              <SectionHeading
                icon={MessageSquare}
                title="Active Threads"
                action={
                  <button className="text-label-sm text-secondary text-sm font-semibold hover:underline">
                    View All
                  </button>
                }
              />
              <div className="space-y-4">
                {activeThreads.map((thread) => (
                  <ThreadCard
                    key={thread.id}
                    thread={thread}
                    variant="detailed"
                  />
                ))}
                {resolvedThreads.map((thread) => (
                  <ThreadCard
                    key={thread.id}
                    thread={thread}
                    variant="resolved"
                  />
                ))}
              </div>
            </section>

            <section className="space-y-stack-md">
              <SectionHeading
                icon={Calendar}
                title="Upcoming Events"
                action={
                  <button className="text-label-sm text-secondary text-sm font-semibold hover:underline">
                    Full Calendar
                  </button>
                }
              />
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    variant="calendar"
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
