"use client";

import {
  Home,
  Landmark,
  MessageSquare,
  Calendar,
  HelpCircle,
  Archive,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * AI Studio mock 準拠のサイドバー。
 *
 * - 一次ソース: docs/stich/aistudio/src/components/Navigation.tsx (Sidebar)
 * - 整合性: docs/system/components.md
 * - 「Create New」は MVP 段階ではダミーボタン。コンテキスト依存の挙動は別 Issue。
 */

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  /** active 判定用の prefix。href と一致しない場合に使う */
  match?: (pathname: string) => boolean;
};

const PRIMARY_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Home",
    icon: Home,
    match: (p) => p === "/" || p === "/dashboard",
  },
  {
    href: "/orgs/local-history-club",
    label: "Organizations",
    icon: Landmark,
    match: (p) => p.startsWith("/orgs"),
  },
  {
    href: "/threads/thread_90s",
    label: "Threads",
    icon: MessageSquare,
    match: (p) => p.startsWith("/threads"),
  },
  {
    href: "/events/event_summer_festival",
    label: "Events",
    icon: Calendar,
    match: (p) => p.startsWith("/events"),
  },
];

const FOOTER_ITEMS: NavItem[] = [
  {
    href: "#",
    label: "Help",
    icon: HelpCircle,
    match: () => false,
  },
  {
    href: "/system/components",
    label: "Components",
    icon: Archive,
    match: (p) => p.startsWith("/system"),
  },
];

function isActive(item: NavItem, pathname: string): boolean {
  return item.match ? item.match(pathname) : pathname === item.href;
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface-container-low border-outline-variant fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col border-r px-stack-md py-stack-lg space-y-stack-sm md:flex">
      <div className="mb-8 px-3">
        <Link href="/dashboard" className="block">
          <h1 className="text-headline-md text-primary font-bold">Threadhall</h1>
          <p className="font-label-sm text-on-surface-variant mt-1 text-[10px]">
            Precision Community
          </p>
        </Link>
      </div>

      <div className="flex-1 space-y-1">
        {PRIMARY_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 transition-all duration-150 ${
                active
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <item.icon
                size={20}
                className={active ? "fill-current" : undefined}
              />
              <span className="font-label-sm text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        className="bg-primary text-on-primary mt-auto mb-4 flex w-full items-center justify-center space-x-2 rounded-DEFAULT py-2 text-label-sm transition-opacity active:opacity-80"
      >
        <Plus size={18} />
        <span>Create New</span>
      </button>

      <div className="border-outline-variant space-y-1 border-t pt-4">
        {FOOTER_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 transition-all duration-150 ${
                active
                  ? "bg-surface-container-high text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <item.icon size={20} />
              <span className="font-label-sm text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
