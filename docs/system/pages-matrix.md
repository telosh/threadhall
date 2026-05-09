# 整合性マトリクス（ページ × FR × ロール × データ）

[`docs/pages/`](../pages/) の各ページが、`features-mvp.md` の FR と `capabilities-by-role.md` のロール、`docs/data/CONTRACTS.md` のデータレイヤーと矛盾していないかを 1 枚で確認する表。

> **更新ルール**: ページを追加・改訂したら、本表を **同 PR 内で**書き換える。ズレが出たら本表が「正」。

---

## 1. ページ × FR

| ページ | FR-01<br>組織 | FR-02<br>長命スレッド | FR-03<br>イベント lifecycle | FR-04<br>サテライト provision | FR-05<br>サテライトログ | FR-06<br>参加トークン | FR-07<br>archived 拒否 | FR-08<br>Auth |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `/dashboard` | 表示（My Orgs） | 表示（Active Threads） | 表示（Schedule） | — | — | — | — | 認可ゲート |
| `/orgs/[slug]` | **主担** | 表示（Threads 列） | 表示（Events 列） | — | — | — | — | 認可ゲート |
| `/threads/[threadId]` | 表示（breadcrumb） | **主担** | — | — | — | — | **disabled UI** | 認可ゲート |
| `/events/[eventId]` | 表示（breadcrumb） | — | **主担**（phase 表示） | エラー枠 | **タイムライン** | `?token=` 受領 | **disabled UI** | 任意（公開 archived） |
| `/system/components` | — | — | — | — | — | — | — | — |
| `/` | — | — | — | — | — | — | — | リダイレクト |
| `/dev` | 開発用 | 開発用 | 開発用 | — | — | — | — | 開発用 |

> 「**主担**」= その FR の機能の主たる UI。「表示」= 派生する一覧やリンクの表示。

---

## 2. ページ × ロール（読み・書き）

凡例: `R` 読み取り可 / `W` 書込可 / `R*` 公開設定に依存 / `—` 不可

| ページ | owner | admin | moderator | member | token_guest | unauthenticated |
|---|---|---|---|---|---|---|
| `/dashboard` | R | R | R | R | — | — |
| `/orgs/[slug]` | R+W | R+W | R+W | R+W | — | R\* |
| `/threads/[threadId]` | R+W | R+W | R+W | R+W | — | R\* |
| `/events/[eventId]` (`draft`) | R+W | R+W | — | — | — | — |
| `/events/[eventId]` (`live`) | R+W | R+W | R+W | R+W | **R+W** | R\* |
| `/events/[eventId]` (`archived`) | R | R | R | R | R | R\* |
| `/system/components` | R | R | R | R | R | R |

**整合性のルール**:

- 「W」が立っている行は **必ずサーバ側 Action / Handler でも同じガード**を持つ。UI 表示だけで弾いてはいけない。
- `archived` の行はすべて **R のみ**。書込 UI は disabled 表示（FR-07）。
- `token_guest` は `/events/[id]` のみで存在する主体。他ページには遷移させない（[`docs/system/screens-and-ui.md`](screens-and-ui.md) 参照）。

---

## 3. ページ × データソース

| ページ | プライマリ DB（読） | プライマリ DB（書） | サテライト DB（読） | サテライト DB（書） | mock 経由（現状） |
|---|---|---|---|---|---|
| `/dashboard` | organizations / threads / events | — | — | — | ✓（全部 mock） |
| `/orgs/[slug]` | organizations / threads / events | — | — | — | ✓ |
| `/threads/[threadId]` | threads / posts(未) / organizations | posts(未) | — | — | ✓ |
| `/events/[eventId]` | events / organizations | events.phase 遷移 | event_log_entries(未) | event_log_entries(未) | ✓ |
| `/system/components` | — | — | — | — | — |
| `/` | — | — | — | — | — |
| `/dev` | organizations / threads / events | organizations | — | — | — |

**未マイグレ**:

- `posts` テーブル（FR-02 完了に必須） → 予約: `db/migrations/0005_posts.sql`
- `event_log_entries` テーブル（サテライト側、FR-05 に必須） → 予約: サテライト用 DDL は別 directory（`db/satellite-migrations/0001_event_log_entries.sql` 等）の運用方針が `docs/data/CONTRACTS.md` に未記載。今後追記。
- `events` 拡張（`starts_at` / `ends_at` / `timezone` / `published_scope`） → 予約: `db/migrations/0006_events_extend.sql`
- `organizations` 拡張（`description` / `members_count` / `tags`） → 予約: `db/migrations/0007_organizations_extend.sql`

---

## 4. ページ × 必要コンポーネント

| ページ | 共通 | ドメイン |
|---|---|---|
| `/dashboard` | TopBar / Sidebar / MobileBottomNav | ThreadCard(compact) / EventCard(schedule) / SectionHeading |
| `/orgs/[slug]` | TopBar / Sidebar / MobileBottomNav | ThreadCard(detailed/resolved) / EventCard(calendar) / SectionHeading |
| `/threads/[threadId]` | TopBar / Sidebar / MobileBottomNav | ThreadComposer |
| `/events/[eventId]` | TopBar / Sidebar / MobileBottomNav | PhaseBadge / EventLogComposer |
| `/system/components` | TopBar / Sidebar / MobileBottomNav | PhaseBadge |

**共通の追加候補**（[`docs/system/components.md`](components.md) の TODO 5 / 6 にも記載）:

- Avatar コンポーネント（rounded-full / イニシャル / トークンゲスト）
- BannerError / BannerInfo（archived や token 警告で頻出）
- DataField（Thread Details / Event Details の `<dt><dd>` 系）

---

## 5. 既知のギャップと PR 計画

| ギャップ | 影響 | 対応 |
|---|---|---|
| `posts` 未定義 | `/threads/[threadId]` の本番接続不可 | Issue #4（FR-02）配下で `0005_posts.sql` |
| サテライト DDL 運用未確定 | `/events/[eventId]` のログ書込不可 | Issue #6（FR-04）/ Issue #7（FR-05〜07）と同期 |
| `events.starts_at` 系未定義 | カウントダウン実時間化不可 | Issue #5（FR-03）と同 PR で `0006_events_extend.sql` |
| `organizations.description/tags/members_count` 未定義 | Hero の固定値 | Issue #3（FR-01）と同 PR で `0007_organizations_extend.sql` |
| `published_scope` 未定義 | 未ログイン閲覧の可否分岐不可 | Issue #5（FR-03）と同期。MVP では「メンバー限定」固定でも可 |
| 参加トークン処理経路未確定 | `/events/[id]?token=` の検証なし | Issue #7（FR-05〜07） |
| `dev` ページの本番無効化 | URL 漏洩リスク低だが見えうる | `proxy.ts` で env ガード（Issue 別途） |

---

## 6. 更新時のチェックリスト

ページを追加・改訂する PR で必ず確認:

- [ ] 該当ページの `docs/pages/<route>.md` を更新（フロントマターの `last_synced` も更新）
- [ ] 本表（`pages-matrix.md`）の **§1〜§4 の該当行**を更新
- [ ] 新規 FR を満たすなら `docs/system/features-mvp.md` に行追加
- [ ] ロールの可否を変えたなら `docs/system/capabilities-by-role.md` に反映
- [ ] スキーマを触ったなら `docs/data/CHANGELOG.md` + `db/migrations/NNNN_*.sql`
- [ ] PR 説明に「どのページのどの節を変えたか」を 1 文
