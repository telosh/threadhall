import Link from "next/link";
import { Clock, MapPin, Video } from "lucide-react";
import type { MockEvent } from "@/lib/mock-data";
import { PhaseBadge } from "./phase-badge";

/**
 * イベントカード。
 *
 * - 一次ソース: docs/stich/aistudio/src/components/{DashboardView,OrganizationView}.tsx
 * - variant:
 *   - "schedule": ダッシュボード Schedule 列用（コンパクト）
 *   - "calendar": 組織ページ Upcoming Events 用（左に日付ブロック）
 */

type Variant = "schedule" | "calendar";

export function EventCard({
  event,
  variant = "calendar",
}: {
  event: MockEvent;
  variant?: Variant;
}) {
  const href = `/events/${event.id}`;

  if (variant === "schedule") {
    return (
      <Link href={href} className="block">
        <div
          className={`bg-surface border-outline-variant relative overflow-hidden rounded-xl border p-3 transition-colors hover:border-primary ${
            event.isUrgent ? "border-event-active/30 bg-surface-container-low" : ""
          }`}
        >
          {event.isUrgent ? (
            <div className="bg-event-active absolute top-0 left-0 h-full w-1"></div>
          ) : null}
          <div className="flex items-start justify-between pl-2">
            <div>
              <div className="mb-1 flex items-center gap-2">
                {event.isUrgent ? (
                  <PhaseBadge variant="live" label="Live" />
                ) : null}
                <span className="text-label-sm text-text-dim text-[10px]">
                  {event.time}
                </span>
              </div>
              <h4 className="text-body-lg text-primary font-semibold">
                {event.title}
              </h4>
              <p className="text-label-sm text-on-surface-variant mt-1 flex items-center gap-1 text-[10px]">
                <Video size={12} /> {event.location}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="block">
      <div
        className={`bg-surface border-outline-variant rounded-xl border p-6 transition-all hover:shadow-md ${
          event.isUrgent ? "border-l-event-active border-l-4" : ""
        }`}
      >
        <div className="flex items-start space-x-6">
          <div className="bg-surface-container border-outline-variant flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg border">
            <span className="text-label-sm font-label-sm text-text-dim font-bold uppercase text-[10px]">
              {event.month}
            </span>
            <span className="text-headline-lg text-primary leading-none font-bold">
              {event.day}
            </span>
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-start justify-between">
              <h4 className="text-headline-md text-primary font-bold">
                {event.title}
              </h4>
              {event.status ? (
                <PhaseBadge
                  variant={event.phase === "live" ? "live" : event.phase}
                  label={event.status}
                />
              ) : null}
            </div>
            <div className="mb-4 space-y-1">
              <div className="text-label-sm text-text-dim flex items-center space-x-2 text-xs">
                <Clock size={14} />
                <span>{event.time}</span>
              </div>
              <div className="text-label-sm text-text-dim flex items-center space-x-2 text-xs">
                <MapPin size={14} />
                <span>{event.location}</span>
              </div>
            </div>
            <div className="flex -space-x-2">
              <div className="bg-surface-variant border-surface h-7 w-7 rounded-full border-2"></div>
              <div className="bg-surface-dim border-surface h-7 w-7 rounded-full border-2"></div>
              <div className="bg-primary-fixed border-surface text-primary flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-bold">
                +40
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
