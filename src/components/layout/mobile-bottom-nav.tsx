"use client";

import { Home, Landmark, MessageSquare, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * モバイル時のボトムナビ。
 *
 * - 一次ソース: docs/stich/aistudio/src/App.tsx 末尾
 * - md 以上では非表示。
 */

const ITEMS = [
  {
    href: "/dashboard",
    label: "Home",
    icon: Home,
    match: (p: string) => p === "/" || p === "/dashboard",
  },
  {
    href: "/orgs/local-history-club",
    label: "Organizations",
    icon: Landmark,
    match: (p: string) => p.startsWith("/orgs"),
  },
  {
    href: "/threads/thread_90s",
    label: "Threads",
    icon: MessageSquare,
    match: (p: string) => p.startsWith("/threads"),
  },
  {
    href: "/events/event_summer_festival",
    label: "Events",
    icon: Calendar,
    match: (p: string) => p.startsWith("/events"),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bg-surface border-outline-variant fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t md:hidden">
      {ITEMS.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className={`flex h-full w-full flex-col items-center justify-center transition-colors ${
              active ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <item.icon size={22} className={active ? "fill-current" : ""} />
          </Link>
        );
      })}
    </nav>
  );
}
