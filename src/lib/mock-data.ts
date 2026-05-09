/**
 * UI 確認用のモックデータ。
 *
 * - 一次ソース: docs/stich/aistudio/src/constants.ts（AI Studio mock）
 * - 用途: 本番 DB 接続前の UI レビュー（`/dashboard`、`/orgs/[slug]` ほか）
 * - 廃止計画: FR-01 / FR-02 / FR-03 の Issue で `src/server/queries/*` に差し替え
 *
 * 本番 DB の行型（`src/types/db/primary.ts`）に揃えた構造で持つので、
 * RSC 側で query 結果に差し替えるとき差分は表示用の付帯フィールドだけになる。
 */

import type { EventPhase } from "@/types/db/primary";

export type MockOrganization = {
  id: string;
  slug: string;
  display_name: string;
  description: string;
  members: string;
  tags: string[];
};

export type MockThread = {
  id: string;
  organization_id: string;
  slug: string;
  title: string;
  thread_kind: "persistent" | "event_tied";
  /** 表示用: 本文プレビュー */
  preview: string;
  /** 表示用: 投稿者名 */
  author: string;
  /** 表示用: "2h ago" 等の相対表記 */
  timestamp: string;
  /** 表示用: 返信数 */
  replies: number;
  /** 表示用: ビュー数 */
  views: string;
  /** 表示用: タグ */
  tags: string[];
  /** 表示用: ピン留め */
  pinned?: boolean;
  /** 表示用: 解決済み（archived ではないが議論として終了） */
  resolved?: boolean;
};

export type MockEvent = {
  id: string;
  organization_id: string;
  slug: string;
  title: string;
  phase: EventPhase;
  /** 表示用: イベント本文 */
  description?: string;
  /** 表示用: 月（"Oct" など） */
  month: string;
  /** 表示用: 日（"14" など） */
  day: string;
  /** 表示用: "09:00 AM - 02:00 PM" */
  time: string;
  /** 表示用: "Oak Hill Historic Cemetery" */
  location: string;
  /** 表示用: ピル文言（"Happening Tomorrow" 等） */
  status?: string;
  /** 表示用: live で urgent 装飾を出すか */
  isUrgent?: boolean;
};

export type MockThreadPost = {
  id: string;
  thread_id: string;
  author: string;
  /** 表示用: アバター画像 URL or null（null なら initial） */
  avatar: string | null;
  /** 表示用: 表示用日時 */
  timestamp: string;
  /** 表示用: 段落配列 */
  paragraphs: string[];
  /** 表示用: 添付画像 URL */
  imageUrl?: string;
  /** 表示用: いいね数 */
  likes?: number;
};

export type MockEventLogEntry = {
  id: string;
  event_id: string;
  /** 表示用: 時刻ラベル（"14:30 PM" 等） */
  time: string;
  /** ノードの色: タイムライン軸上の dot を変える */
  kind: "info" | "alert" | "neutral";
  /** 表示用: 投稿者名 */
  author: string;
  /** 表示用: イニシャル（avatar 代替） */
  initial: string;
  /** 表示用: 本文 */
  body: string;
  /** 表示用: アラートの場合のラベル（"Capacity Alert"） */
  alertLabel?: string;
  /** 表示用: 添付画像 URL（複数可） */
  images?: string[];
  /** 表示用: バッジ文言 */
  badge?: string;
};

/* ---------- 画像 ---------- */
export const IMAGES = {
  profile:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBj9qzeftfYjJw3SCpOmLcXXXoJA1_XcgMB54SYkgIPWeTt8jtrvwQhLdUqyyY3Rj6b_FcD0Kr4OeEsWBsqsE2GJ82VihwXHPQ4GRAcXyFB2L0FcvchEXRr3cxQmVLmuqBD2yCe8BIW5xRMbyt-V1MDpqj1HKG9NKGaDduDz2m4rpJr8dhpLo9X1CMBsP8gIf9ma7Lj9zKp-ZT3B_L68zwsGKqZvVZZ8UdhTZnFPRJnLNdsCzqxlNJzMBzd-V45mQ9GZ2DWSgLCr3UQ",
  profile2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA6w_W3AqsL3rnlsJozvqc_ltQpUofVdWZmwLXCcogzA_x9N51BN38P7GYWGepizRlNV4RQOAp9fvw63ZJhO_xJ5QlDA0rlIbN7Mzf4BdZXjLdsQvitziPfm6MvblU7ieEpV1FDHUcOhGzqIsjEPWVlZnZ3ZFycifPJ-LxzTBkYOsFddQ7UXqRuoxl_KQ0RucAnlaFR3myLUoerPRbGgBVWMpWK04RpOXubLESnUBOxSdgWVlL-3Wi61_K1LXpnKIknntQfayDBqdz8",
  stage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDFzfuYpy0ZtWnpVzpJwaFzfTnm2008ie-VaSBYbWFkg5wDvWBactsQeDj_VLfc6mwEwC5_qgycy6NJ-ZqGd4sZM9s2LeqiOx2XguDirqWWPVDu_BnFA33uKakkh9dDWqkWzYfmb26qXzCVeMX4z2EUc3NiSqaZHBQ1ixGTfJyfCnuBLaUvyLLKmimsSGZVIJxn7GC12CUj14kCk99wrrLMZOhwBof38pBtEs27JDaLGqH88Join0GQhNGO7yAKzlTXZwBd59NWlPND",
  mixingDesk:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBysU-dNYGJxtWhVMvvXKLDmgtUU70L7bthOdb0E8n_QO3Bx12cMgLIS_88KZWgwKFSCqmBS6veqnWY-J2eFE_ijA9UF28S80H3hHDG4EXi-GQ0A91RFgLJoPrPDIffAWYRraeFEyjUX57WnDxPP_DyoF1sRyqLziZtTjvtE2j7qspjZN2m0EOti76laJusUC7AC7ywg1WjlSZPNjIyQyB1qe8No29UwSWPCyCOvsmyl_IjFZl1s9reMLql0idyfb3RLws88vvoWoOp",
  retroPC:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCicOuQZQtRbBtIgLNJ0vRugvcVCOqRdSfANaZaNoDEGVO2V1KWKG4Fhe_TOJ9d77uAqrDavJfofeiPtm4011hhGMXA2bDgIk7l_Yr6IKX5LDBdKt31i9zSbBxbd9pIv47pAQF-mJVDwNAlu6RILTRpjpZ0pVUf8ih7pCxrTUBYxh9hFOZyD-nmKU1-vXJrOHKxgkuJtbUK6nWO3WFM2xdDTNoL9tt88HQH5tqwty_OyhXH5eH6CPp45rJUi7Z0IkGnSFqUvQ1mVD5C",
} as const;

/**
 * 現在ログインしているユーザーのアバター URL（Better Auth 接続後は `session.user.image` に置換）。
 * `null` のときは UI 上はデフォアイコン。開発で Google 顔写真を試すときは `IMAGES.profile` などを一時設定。
 */
export const MOCK_CURRENT_USER_IMAGE: string | null = null;

/* ---------- 組織 ---------- */
export const MOCK_ORGANIZATIONS: MockOrganization[] = [
  {
    id: "org_local_history",
    slug: "local-history-club",
    display_name: "Local History Club",
    description:
      "Preserving and discussing the rich heritage of our city's industrial past. We document architectural changes, gather oral histories, and organize field trips to historical sites.",
    members: "1,204",
    tags: ["Architecture", "Industrial", "Genealogy"],
  },
  {
    id: "org_acme",
    slug: "acme-corp",
    display_name: "Acme Corp",
    description:
      "Internal engineering and operations workspace for the Acme product team.",
    members: "84",
    tags: ["Engineering", "Operations"],
  },
  {
    id: "org_open_source",
    slug: "open-source",
    display_name: "Open Source",
    description:
      "Volunteer maintainers coordinating releases, RFCs, and contributor onboarding.",
    members: "312",
    tags: ["OSS", "RFC"],
  },
];

/* ---------- スレッド ---------- */
export const MOCK_THREADS: MockThread[] = [
  {
    id: "thread_silk_mill",
    organization_id: "org_local_history",
    slug: "old-silk-mill-demolition",
    title: "The Old Silk Mill Demolition",
    thread_kind: "persistent",
    preview:
      "Does anyone have photos of the interior before they started the teardown last week? I'm trying to map out the original loom placements.",
    author: "SystemArchitect_99",
    timestamp: "2h ago",
    replies: 42,
    views: "1.2k",
    tags: ["Architecture", "Industrial"],
  },
  {
    id: "thread_directories",
    organization_id: "org_local_history",
    slug: "1920s-city-directories",
    title: "1920s City Directories Digitization Project",
    thread_kind: "persistent",
    preview:
      "We've secured the scanner from the central library. Looking for volunteers to help process the D-G volumes this weekend.",
    author: "DataDruid",
    timestamp: "1d ago",
    replies: 15,
    views: "800",
    tags: ["Genealogy", "Project"],
    pinned: true,
  },
  {
    id: "thread_v2_api",
    organization_id: "org_acme",
    slug: "v2-api-deprecation",
    title: "V2 API Deprecation Timeline",
    thread_kind: "persistent",
    preview:
      "We need to finalize the sun-setting schedule for the legacy endpoints. Initial telemetry suggests 15% of active nodes are still pinging v2.auth.",
    author: "SysEng Core",
    timestamp: "2m ago",
    replies: 24,
    views: "3.1k",
    tags: ["Technical"],
  },
  {
    id: "thread_street_corner",
    organization_id: "org_local_history",
    slug: "identify-street-corner-1955",
    title: "Identify this street corner (1955)",
    thread_kind: "persistent",
    preview: "Solved: It's the intersection of Main and Broad, looking North.",
    author: "GeoPing",
    timestamp: "5d ago",
    replies: 8,
    views: "420",
    tags: ["Geo"],
    resolved: true,
  },
  {
    id: "thread_90s",
    organization_id: "org_open_source",
    slug: "reminiscing-about-the-90s",
    title: "Reminiscing about the 90s",
    thread_kind: "persistent",
    preview:
      "Does anyone else miss the distinct sound of a 56k modem connecting?",
    author: "SystemArchitect_99",
    timestamp: "Oct 12, 1999",
    replies: 89,
    views: "14.2k",
    tags: ["Nostalgia", "Tech History", "Culture", "Hardware"],
  },
];

/* ---------- イベント ---------- */
export const MOCK_EVENTS: MockEvent[] = [
  {
    id: "event_cemetery",
    organization_id: "org_local_history",
    slug: "cemetery-restoration-day",
    title: "Cemetery Restoration Day",
    phase: "draft",
    description:
      "Volunteer day for grounds maintenance and headstone documentation.",
    month: "Oct",
    day: "14",
    time: "09:00 AM - 02:00 PM",
    location: "Oak Hill Historic Cemetery",
    status: "Happening Tomorrow",
    isUrgent: true,
  },
  {
    id: "event_speaker",
    organization_id: "org_local_history",
    slug: "guest-speaker-prof-miller",
    title: "Guest Speaker: Prof. Miller",
    phase: "draft",
    month: "Oct",
    day: "22",
    time: "07:00 PM - 08:30 PM",
    location: "Virtual Meeting Room A",
  },
  {
    id: "event_summer_festival",
    organization_id: "org_local_history",
    slug: "summer-festival-2024",
    title: "Summer Festival 2024",
    phase: "live",
    description:
      "Main stage performances, food vendors, and community art installations.",
    month: "LIVE",
    day: "NOW",
    time: "Day 1 of 3",
    location: "Central City Park",
    status: "Live",
    isUrgent: true,
  },
  {
    id: "event_q4_sync",
    organization_id: "org_acme",
    slug: "q4-roadmap-sync",
    title: "Q4 Roadmap Sync",
    phase: "live",
    month: "LIVE",
    day: "NOW",
    time: "Ends in 45m",
    location: "Main Stage",
    isUrgent: true,
  },
];

/* ---------- スレッド投稿 ---------- */
export const MOCK_THREAD_POSTS: Record<string, MockThreadPost[]> = {
  thread_90s: [
    {
      id: "post_90s_1",
      thread_id: "thread_90s",
      author: "SystemArchitect_99",
      avatar: IMAGES.profile,
      timestamp: "Oct 12, 1999 \u00b7 14:02 UTC",
      paragraphs: [
        "Does anyone else miss the distinct sound of a 56k modem connecting? There was something incredibly visceral about knowing you were physically tying up the phone line to connect to this nascent thing called the web.",
        "Also, the sheer patience required to download a single MP3 or a low-res image. It forced a level of intentionality that I think modern, frictionless UX has completely eroded. Discuss.",
      ],
      likes: 42,
    },
    {
      id: "post_90s_2",
      thread_id: "thread_90s",
      author: "DataDruid",
      avatar: IMAGES.profile2,
      timestamp: "Oct 12, 1999 \u00b7 14:15 UTC",
      paragraphs: [
        "Intentionality is the right word. When you had 500 free AOL hours on a CD-ROM, you logged on with a specific mission. You checked email, looked up a specific piece of data, and logged off. Now we just exist in a persistent state of connection.",
      ],
    },
    {
      id: "post_90s_3",
      thread_id: "thread_90s",
      author: "NetscapeNavigator",
      avatar: null,
      timestamp: "Oct 12, 1999 \u00b7 15:30 UTC",
      paragraphs: [
        "Found this gem in my archives. The aesthetic of late 90s computing was peak industrial design.",
      ],
      imageUrl: IMAGES.retroPC,
    },
  ],
};

/* ---------- イベントログエントリ ---------- */
export const MOCK_EVENT_LOG_ENTRIES: Record<string, MockEventLogEntry[]> = {
  event_summer_festival: [
    {
      id: "log_summer_1",
      event_id: "event_summer_festival",
      time: "14:30 PM",
      kind: "info",
      author: "Main Stage Crew",
      initial: "JS",
      body: "Soundcheck complete for the headline act. Acoustics are holding up well despite the wind. We're ready for the 4PM slot.",
      images: [IMAGES.stage, IMAGES.mixingDesk],
    },
    {
      id: "log_summer_2",
      event_id: "event_summer_festival",
      time: "13:15 PM",
      kind: "alert",
      author: "Security",
      initial: "SE",
      body: "West gate entry is currently paused due to bottleneck. Diverting incoming attendees to North gate.",
      alertLabel: "Capacity Alert",
    },
    {
      id: "log_summer_3",
      event_id: "event_summer_festival",
      time: "11:00 AM",
      kind: "neutral",
      author: "Food Coord",
      initial: "FC",
      body: "All 45 food trucks positioned and inspections cleared. Ready for lunch.",
      badge: "Logistics",
    },
  ],
};

/* ---------- ユーティリティ ---------- */
export function findOrganizationBySlug(slug: string): MockOrganization | null {
  return MOCK_ORGANIZATIONS.find((o) => o.slug === slug) ?? null;
}

export function findThreadById(id: string): MockThread | null {
  return MOCK_THREADS.find((t) => t.id === id) ?? null;
}

export function findThreadBySlug(slug: string): MockThread | null {
  return MOCK_THREADS.find((t) => t.slug === slug) ?? null;
}

export function findEventById(id: string): MockEvent | null {
  return MOCK_EVENTS.find((e) => e.id === id) ?? null;
}

export function findEventBySlug(slug: string): MockEvent | null {
  return MOCK_EVENTS.find((e) => e.slug === slug) ?? null;
}

export function listThreadsByOrg(orgId: string): MockThread[] {
  return MOCK_THREADS.filter((t) => t.organization_id === orgId);
}

export function listEventsByOrg(orgId: string): MockEvent[] {
  return MOCK_EVENTS.filter((e) => e.organization_id === orgId);
}

export function listPostsByThread(threadId: string): MockThreadPost[] {
  return MOCK_THREAD_POSTS[threadId] ?? [];
}

export function listLogEntriesByEvent(eventId: string): MockEventLogEntry[] {
  return MOCK_EVENT_LOG_ENTRIES[eventId] ?? [];
}
