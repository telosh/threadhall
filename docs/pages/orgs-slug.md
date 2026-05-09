---
route: /orgs/[slug]
stitch_source:
  - docs/stich/aistudio/src/components/OrganizationView.tsx
  - docs/stich/community.tsx
fr: [FR-01, FR-02, FR-03]
data_source: mock
auth_required: true
roles_visible: [owner, admin, moderator, member]
roles_writable: [owner, admin, moderator, member]
status: implemented-with-mock
last_synced: 2026-05-10
---

# /orgs/[slug] — 組織トップ

## 1. 概要

組織（Stitch 上の「コミュニティ」）のホーム。Hero（組織概要 + Contribute CTA）と「Active Threads / Upcoming Events」の 2 カラムを置く。

## 2. ルートと URL パラメータ

- パス: `/orgs/[slug]`
- `params`: `{ slug: string }`（`organizations.slug` と一致）
- `searchParams`: なし
- 不明な slug は `notFound()` → `not-found.tsx`（未実装）に到達

## 3. 画面構造

| ブロック | コンポーネント |
|---|---|
| ヘッダ | `<TopBar breadcrumb={`Organizations / ${org.display_name}`} />` |
| Hero（lg:col-span-2） | 組織名 / description / Members 数 / Tags |
| Hero（lg:col-span-1） | Contribute カード（New Thread / Log Event ボタン） |
| Active Threads（xl:col-span-1） | `<ThreadCard variant="detailed" />` × 2 + `variant="resolved"` × 1 |
| Upcoming Events（xl:col-span-1） | `<EventCard variant="calendar" />` × 2 |

レイアウト: `p-margin-page max-w-container-max mx-auto`、Hero は `lg:grid-cols-3`、メイン下部は `xl:grid-cols-2`。

## 4. ロール別の見え方

| ロール | Hero | Threads | Events |
|---|---|---|---|
| **owner** | 全表示 + 「組織設定」エントリ（未実装） | 一覧 + ピン操作 | 一覧 + draft 含む |
| **admin** | 全表示 | 一覧 + ピン操作 | 一覧 + draft 含む |
| **moderator** | 全表示 | 一覧 + ピン操作 + モデレーション | 一覧（draft 除外） |
| **member** | 全表示 | 一覧（モデレーション不可） | 一覧（draft 除外） |
| **未ログイン** | 公開組織のみ Hero まで（CTA は disabled） | 公開スレッドのみ閲覧 | 公開イベントのみ閲覧 |

> 公開ポリシーは [`docs/system/capabilities-by-role.md`](../system/capabilities-by-role.md) の「組織の公開既定」を参照。MVP 時点では「全組織のメンバー限定」をデフォルトとする方針が固まっていない（[`features-mvp.md`](../system/features-mvp.md) FR-01）。

## 5. データソース

| セクション | 現状 | 本番接続後 |
|---|---|---|
| 組織情報 | `findOrganizationBySlug(slug)` | `getOrganizationBySlug(db, slug)` + `countMembers(db, orgId)` |
| Active Threads | `listThreadsByOrg(orgId).filter(!resolved)` | `listThreadsForOrganization(db, orgId, { resolved: false })` |
| Resolved Threads | `listThreadsByOrg(orgId).filter(resolved)` | `listThreadsForOrganization(db, orgId, { resolved: true, limit: 1 })` |
| Upcoming Events | `listEventsByOrg(orgId)` | `listEventsForOrganization(db, orgId, { phase: ["draft","live"] })` |

実装場所: `src/server/queries/organizations.ts`、`src/server/queries/threads.ts`、`src/server/queries/events.ts`。

## 6. 状態と遷移

| 状態 | 表示 |
|---|---|
| Not found | `notFound()` → `not-found.tsx` |
| Empty (Threads) | 「まだスレッドがありません」プレースホルダ + New Thread CTA |
| Empty (Events) | 「予定のイベントはありません」プレースホルダ + Log Event CTA |
| Resolved スレッドのみ | resolved 1 件だけは表示。複数あればアコーディオンに（別 Issue） |

## 7. 書込ゲート

| アクション | 主体 | 飛び先 |
|---|---|---|
| New Thread | member 以上 | `/orgs/[slug]/threads/new`（未実装） |
| Log Event | owner / admin | `/orgs/[slug]/events/new`（未実装） |
| ピン留め | moderator 以上 | スレッド詳細から（FR-02 拡張） |

archived 組織は無い（組織自体に archived 概念は無い）。

## 8. コンポーネント依存

- `src/components/layout/top-bar`
- `src/components/domain/{thread-card,event-card,section-heading}`
- アイコン: `lucide-react`（`Users` / `PlusCircle` / `MessageSquare` / `Calendar`）

## 9. 整合性チェック

- FR-01: `members` 数表示 / Tags は MVP で **必須属性**。データ契約に未定義なので追加候補（`docs/data/CHANGELOG.md` に追記すること）。
- FR-02: スレッドカードの `views` フィールドは現状 mock 専用（DB 未定義）。差し替え時に `views_count` を `threads` に追加するか、別テーブル `thread_metrics` に切り出すか要決定（[`docs/system/open-questions-and-spikes.md`](../system/open-questions-and-spikes.md) に追記推奨）。
- FR-03: phase バッジは `EventCard` 内で出している。draft 表示の有無は §4 のロール別表に従う。

## 10. TODO / 未決

- [ ] members / tags のスキーマ（`organizations` テーブル拡張 or 別テーブル）
- [ ] 組織の公開ポリシー（メンバー限定 / 公開閲覧可 / 完全非公開）の確定
- [ ] Empty 状態 UI
- [ ] resolved スレッドの一覧化（アコーディオン）
- [ ] `/orgs/new`（組織作成）と `/orgs/[slug]/settings` の実装
