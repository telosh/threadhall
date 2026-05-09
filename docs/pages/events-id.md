---
route: /events/[eventId]
stitch_source:
  - docs/stich/aistudio/src/components/EventLogView.tsx
  - docs/stich/eventlog.tsx
fr: [FR-03, FR-04, FR-05, FR-06, FR-07]
data_source: composed
auth_required: false
roles_visible: [owner, admin, moderator, member, token_guest, unauthenticated]
roles_writable: [owner, admin, moderator, member, token_guest]
status: implemented-with-mock
last_synced: 2026-05-10
---

# /events/[eventId] — イベントログ詳細

## 1. 概要

イベント本体（Hero）+ タイムライン形式のログ + sticky compose。**プライマリ DB のメタ + サテライト DB のログ** を合成して表示する複合ページ。MVP の「顔」になる画面（FR-05）。

## 2. ルートと URL パラメータ

- パス: `/events/[eventId]`
- `params`: `{ eventId: string }`（`events.id`）
- `searchParams`: 将来 `?token=<jwt>` を許容（FR-06、参加トークンによるアクセス）
- 不明な ID は `notFound()`

## 3. 画面構造

| ブロック | コンポーネント |
|---|---|
| ヘッダ | `<TopBar breadcrumb={`Organizations / ${org.display_name} / Events`} />` |
| Hero | phase バッジ + location + `<h1>{event.title}</h1>` + description + カウントダウン |
| Timeline | 縦軸 + 各エントリ（時刻 / 種別ドット / カード） |
| Sticky Composer | `<EventLogComposer disabled={phase === "archived"} />` |

レイアウト: full-bleed（`p-margin-page` で main を包まない）。Hero と Timeline は `max-w-container-max` / `max-w-3xl` を内側で使い分け。

## 4. ロール別の見え方

| ロール | Hero | Timeline | Composer |
|---|---|---|---|
| **owner / admin** | 全表示（draft 含む） | 全エントリ | 通常 |
| **moderator** | live / archived のみ表示（draft 不可視） | 全エントリ | 通常 |
| **member** | live / archived のみ | 全エントリ | live のみ書込可 |
| **参加トークン保有者** | live のみ（token のスコープに従う） | 全エントリ | live のみ書込可（**正はトークン**、F-06） |
| **未ログイン** | 公開設定なら閲覧可（archived は全世界読取） | 公開なら閲覧可 | 表示せず「サインイン or トークンが必要」CTA |

> **書込の正は参加トークン**。Geo は補助。詳細は [`docs/system/capabilities-by-role.md`](../system/capabilities-by-role.md) §「Geo・会場モード（補助）」。

## 5. データソース

| セクション | 現状 | 本番接続後 |
|---|---|---|
| Event メタ | `findEventById(id)` | `getEventById(db_primary, id)` |
| Org | `MOCK_ORGANIZATIONS.find(...)` | `getOrganizationById(db_primary, event.organization_id)` |
| Timeline | `listLogEntriesByEvent(id)` | `listLogEntries(db_satellite, { eventId, limit, cursor })` |
| Live counter | mock 固定（02 / 14 / 45） | server time + `event.starts_at` / `event.ends_at` から計算（実 starts_at / ends_at は未マイグレ） |

サテライト DB の解決手順は [`docs/system/turso-event-scope.md`](../system/turso-event-scope.md)。

## 6. 状態と遷移

| 状態 | 表示 |
|---|---|
| Not found | `notFound()` |
| `phase=draft` | Hero の phase バッジ `Draft`、Timeline は運営のみ閲覧、Composer は **owner/admin のみ表示** |
| `phase=live` | Hero の phase バッジ `Live`、Timeline 通常、Composer 通常 |
| `phase=archived` | Hero の phase バッジ `Archived`、Composer **disabled** + バナー（FR-07） |
| サテライト DB プロビジョニング失敗 | Hero の下にエラーバナー「ログ DB が準備できていません」+ 主催者向けに retry リンク（`/orgs/[slug]/admin/events/[id]/satellite`、未実装、FR-04） |
| Empty (ログなし) | 「ログはまだありません。」 |

## 7. 書込ゲート

| アクション | 主体 | サーバ判定 |
|---|---|---|
| ログ投稿 | live 中の有効トークン保有者 / 運営ロール | サテライト DB 直書き。`archived` なら **必ず拒否**（FR-07） |
| ピン留め / 削除 | owner / admin / moderator | プライマリの `event_log_moderations`（未設計）に記録 |
| カウントダウン | （表示のみ） | server time から再計算 |

`<EventLogComposer disabled>` を切替えるロジックは現状「`event.phase === 'archived'`」のみ。本番接続後は **「`!session && !token`」「未公開イベント」** も同じく disabled に追加する。

## 8. コンポーネント依存

- `src/components/layout/top-bar`
- `src/components/domain/{phase-badge,event-log-composer}`
- `lucide-react`（`AlertCircle` / `MapPin` / `Megaphone`）
- `next/image`（添付画像）

## 9. 整合性チェック

- FR-03 (lifecycle): phase の表示順は `draft → live → archived`。`PhaseBadge` の variant がそれに 1:1 対応。
- FR-04 (satellite): プロビジョニング失敗時の表示が必須。本ページの「状態と遷移」のエラー枠で吸収する。
- FR-05 (log): Timeline はサテライト DB 起源。プライマリと混ぜて GROUP BY しない。
- FR-06 (token): クエリパラメータ `?token=` の処理は `proxy.ts` か Server Action 経由で**サーバ側で検証**。クライアント JS には載せない。
- FR-07 (archived): UI の disabled とサーバの `INSERT` 拒否を **両方** 設置（DB 側 trigger 検討）。
- データ契約: `events` テーブルに `starts_at` / `ends_at` / `timezone` / `published_scope` カラムが未定義。`db/migrations/0005_events_extend.sql` 等で追加予定。

## 10. TODO / 未決

- [ ] `events` テーブルに開始/終了/公開範囲カラム追加
- [ ] サテライト DB ヘルスとプロビジョニング状況の表示（FR-04）
- [ ] 参加トークン受領 UI（QR / リンク クレーム） / `?token=` の検証経路
- [ ] 未ログインかつ未トークン時の CTA 表示
- [ ] カウントダウンの実時間計算
- [ ] ログエントリ削除・モデレーション
- [ ] ログ画像のホスト（mock 用 lh3.googleusercontent.com からの離脱）
