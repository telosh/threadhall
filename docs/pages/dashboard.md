---
route: /dashboard
stitch_source:
  - docs/stich/aistudio/src/components/DashboardView.tsx
fr: [FR-01, FR-02, FR-03]
data_source: mock
auth_required: true
roles_visible: [owner, admin, moderator, member]
roles_writable: [owner, admin, member]
status: implemented-with-mock
last_synced: 2026-05-10
---

# /dashboard — Overview

## 1. 概要

ログインユーザーの **直近の活動** を 1 画面で俯瞰させる入口。所属組織のアクティブスレッド・直近イベント・組織タイル切替を提供する。

## 2. ルートと URL パラメータ

- パス: `/dashboard`
- `params`: なし
- `searchParams`: なし（将来 `org=<slug>` でフィルタリング検討）
- `/` は本ルートへの 302 リダイレクト（`src/app/page.tsx`）

## 3. 画面構造

| ブロック | コンポーネント |
|---|---|
| ヘッダ | `<TopBar breadcrumb="Overview" />` |
| ページタイトル + Create New | `<h1>Overview</h1>` + ダミーボタン |
| 左カラム（lg:col-span-8） | `<SectionHeading title="Active Threads" />` + `<ThreadCard variant="compact" />` × n |
| 右カラム（lg:col-span-4） | Schedule（`<EventCard variant="schedule" />` × n）+ My Organizations（タイル × 2） |

レイアウト: `p-margin-page` + `space-y-stack-lg`、メイングリッドは `lg:grid-cols-12`。

## 4. ロール別の見え方

| ロール | 表示 | 操作 |
|---|---|---|
| **owner / admin** | 全所属組織のスレッド・イベントを集約。Create New（モーダル）から組織選択→スレッド/イベント新規 | ダミーボタン全て可（実装は別 Issue） |
| **moderator / member** | 同上だが Create New のメニューは「New Thread」のみ（イベント作成不可） | スレッド新規 |
| **参加トークン保有者** | 本画面には到達しない（FR-06 → 直接 `/events/[id]` に着地） | — |
| **未ログイン** | リダイレクト → `/`（将来は LP / `/auth/sign-in`） | — |

> ロール別の能力は [`docs/system/capabilities-by-role.md`](../system/capabilities-by-role.md) と一致させる。

## 5. データソース

| セクション | 現状 | 本番接続後 |
|---|---|---|
| Active Threads | `MOCK_THREADS.slice(0, 3)` | `listRecentThreadsAcrossOrgsForUser(userId, 3)` |
| Schedule | `MOCK_EVENTS.filter(e => e.id !== "event_summer_festival")` | `listUpcomingEventsForUser(userId, { excludePast: true })` |
| My Organizations | `MOCK_ORGANIZATIONS.slice(...)` | `listMembershipsForUser(userId)` |

実装場所: `src/server/queries/{threads,events,organizations}.ts` を拡張。

## 6. 状態と遷移

| 状態 | 表示 |
|---|---|
| Empty (組織未所属) | 「まずは組織を作成しましょう」CTA → `/orgs/new`（未実装） |
| Empty (スレッドなし) | カード列の代わりに `<ThreadCard variant="resolved">`-like の placeholder |
| Loading | RSC で SSR するため初期ローディングは出さない。streaming 化したら `<Suspense>` + skeleton |
| Error | 親 `<error.tsx>` で吸収（未実装） |

## 7. 書込ゲート

このページ自体は読み取り中心。`Create New` のサブアクションは以下に飛ばす:

- `New Thread` → `/orgs/[slug]/threads/new`（未実装）
- `New Event` → `/orgs/[slug]/events/new`（未実装。owner/admin のみ）
- `New Organization` → `/orgs/new`（未実装。誰でも可）

## 8. コンポーネント依存

- `src/components/layout/{app-shell,sidebar,top-bar,mobile-bottom-nav}`
- `src/components/domain/{thread-card,event-card,section-heading}`

## 9. 整合性チェック

- FR-01（組織）: My Organizations タイルが組織一覧の入口。
- FR-02（スレッド）: Active Threads が **persistent** スレッドの最新一覧。
- FR-03（イベント）: Schedule が `phase=draft|live` の直近イベントだけを出す。`archived` は除外。
- データ契約: `src/types/db/primary.ts` の `OrganizationRow` / `ThreadRow` / `EventRow` を `MockOrganization` / `MockThread` / `MockEvent` の上位互換にしてある。

## 10. TODO / 未決

- [ ] Create New メニュー実装（コンテキストごとの選択肢）
- [ ] LP / 未ログイン振り分けを `proxy.ts` で実装（FR-08）
- [ ] Empty 状態 UI 設計
- [ ] 大量組織所属時のページネーション
