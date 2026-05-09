import Image from "next/image";
import { notFound } from "next/navigation";
import { AlertCircle, MapPin, Megaphone } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { EventLogComposer } from "@/components/domain/event-log-composer";
import { PhaseBadge } from "@/components/domain/phase-badge";
import {
  findEventById,
  listLogEntriesByEvent,
  MOCK_EVENTS,
  MOCK_ORGANIZATIONS,
} from "@/lib/mock-data";

/**
 * イベントログ詳細。
 *
 * - 一次ソース UI: docs/stich/aistudio/src/components/EventLogView.tsx
 * - ページ仕様: docs/pages/events-id.md
 * - phase に応じて Composer の disabled / バナー文言を切替（FR-07 で確定）
 */

export async function generateStaticParams() {
  return MOCK_EVENTS.map((e) => ({ eventId: e.id }));
}

type Props = {
  params: Promise<{ eventId: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { eventId } = await params;
  const event = findEventById(eventId);
  return {
    title: event ? event.title : "Event",
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { eventId } = await params;
  const event = findEventById(eventId);
  if (!event) notFound();

  const org = MOCK_ORGANIZATIONS.find((o) => o.id === event.organization_id);
  const entries = listLogEntriesByEvent(event.id);
  const composerDisabled = event.phase === "archived";

  return (
    <>
      <TopBar
        breadcrumb={
          org
            ? `Organizations / ${org.display_name} / Events`
            : "Events"
        }
      />
      <main className="bg-background relative flex flex-1 flex-col overflow-hidden">
        <section className="bg-surface border-outline-variant px-margin-page relative shrink-0 overflow-hidden border-b py-8">
          <div className="bg-event-active absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full opacity-10 blur-3xl"></div>
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="mb-2 flex items-center space-x-2">
                  <PhaseBadge variant={event.phase} />
                  <span className="text-label-sm text-text-dim flex items-center gap-1 text-xs">
                    <MapPin size={12} /> {event.location}
                  </span>
                </div>
                <h1 className="text-headline-xl text-on-background mb-1 font-bold">
                  {event.title}
                </h1>
                {event.description ? (
                  <p className="text-body-lg text-on-surface-variant max-w-2xl">
                    {event.description}
                  </p>
                ) : null}
              </div>
              <div className="bg-surface-container-low border-outline-variant flex items-center space-x-8 rounded-xl border p-4 shadow-sm min-w-fit">
                <div className="text-center">
                  <span className="text-headline-md text-primary block font-bold">
                    02
                  </span>
                  <span className="text-label-sm text-on-surface-variant text-[10px] uppercase">
                    Days
                  </span>
                </div>
                <div className="bg-outline-variant h-8 w-px"></div>
                <div className="text-center">
                  <span className="text-headline-md text-primary block font-bold">
                    14
                  </span>
                  <span className="text-label-sm text-on-surface-variant text-[10px] uppercase">
                    Hours
                  </span>
                </div>
                <div className="bg-outline-variant h-8 w-px"></div>
                <div className="text-center">
                  <span className="text-headline-md text-event-active block animate-pulse font-bold">
                    45
                  </span>
                  <span className="text-label-sm text-on-surface-variant text-[10px] uppercase">
                    Mins
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="px-margin-page relative flex-1 overflow-y-auto py-10">
          <div className="relative mx-auto max-w-3xl pb-40">
            <div className="bg-outline-variant absolute top-0 bottom-0 left-4 w-px md:left-[100px]"></div>

            {entries.length === 0 ? (
              <p className="text-text-dim text-body-md ml-8 md:ml-[120px]">
                ログはまだありません。
              </p>
            ) : (
              entries.map((entry) => {
                const dotClass =
                  entry.kind === "alert"
                    ? "bg-error border-surface"
                    : entry.kind === "info"
                      ? "bg-event-active border-surface"
                      : "bg-surface-variant border-surface";

                return (
                  <article
                    key={entry.id}
                    className="group relative mb-10 flex flex-col gap-6 md:flex-row"
                  >
                    <div className="shrink-0 pt-2 text-left md:w-[80px] md:text-right">
                      <span className="text-label-sm text-text-dim text-xs">
                        {entry.time}
                      </span>
                    </div>
                    <div
                      className={`absolute top-3 left-4 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 md:left-[100px] ${dotClass}`}
                    ></div>
                    {entry.kind === "alert" ? (
                      <div className="bg-error-container/20 border-error/30 ml-8 flex flex-1 items-start space-x-4 rounded-2xl border p-6 md:ml-0">
                        <AlertCircle
                          className="text-error mt-0.5 shrink-0"
                          size={20}
                        />
                        <div>
                          <span className="text-label-sm text-error mb-1 block text-[10px] font-bold uppercase tracking-wider">
                            {entry.alertLabel ?? "Alert"}
                          </span>
                          <p className="text-body-md text-on-surface">
                            {entry.body}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-surface border-outline-variant ml-8 flex-1 rounded-2xl border p-6 transition-shadow hover:shadow-md md:ml-0">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {entry.kind === "info" ? (
                              <div className="bg-secondary text-on-primary font-label-sm flex h-6 w-6 items-center justify-center rounded-full text-[10px]">
                                {entry.initial}
                              </div>
                            ) : (
                              <Megaphone className="text-text-dim" size={18} />
                            )}
                            <span className="text-label-sm text-on-surface text-xs font-bold">
                              {entry.author}
                            </span>
                          </div>
                          {entry.badge ? (
                            <span className="bg-surface-container-high font-label-sm rounded px-2 py-0.5 text-[10px] uppercase">
                              {entry.badge}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-body-md text-on-background mb-4">
                          {entry.body}
                        </p>
                        {entry.images && entry.images.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {entry.images.map((src, i) => (
                              <div
                                key={i}
                                className="border-outline-variant relative h-32 overflow-hidden rounded-xl border shadow-inner"
                              >
                                <Image
                                  src={src}
                                  alt={`${entry.author} attachment ${i + 1}`}
                                  fill
                                  sizes="(min-width: 768px) 320px, 50vw"
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>

        <EventLogComposer disabled={composerDisabled} />
      </main>
    </>
  );
}
