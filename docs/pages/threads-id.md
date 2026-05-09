---
route: /threads/[threadId]
stitch_source:
  - docs/stich/aistudio/src/components/ThreadView.tsx
  - docs/stich/threadshousai.tsx
fr: [FR-02, FR-07]
data_source: mock
auth_required: true
roles_visible: [owner, admin, moderator, member]
roles_writable: [owner, admin, moderator, member]
status: implemented-with-mock
last_synced: 2026-05-10
---

# /threads/[threadId] — スレッド詳細

## 1. 概要

長命スレッド（`threads.thread_kind = "persistent"`）の本文・投稿スレッド・返信エディタ。事実上の「読む」と「書く」の主舞台。

## 2. ルートと URL パラメータ

- パス: `/threads/[threadId]`
- `params`: `{ threadId: string }`（`threads.id`）
- `searchParams`: なし（将来 `?reply_to=<post_id>` でアンカー検討）
- 不明な ID は `notFound()` → `not-found.tsx`

## 3. 画面構造

| ブロック | コンポーネント |
|---|---|
| ヘッダ | `<TopBar breadcrumb={`Organizations / ${org.display_name} / Threads`} />` |
| Sticky スレッドヘッダ | `Discussion` バッジ + Active 表示 + `<h1>{thread.title}</h1>` |
| Posts スクロール領域 | `<article>` × n（avatar / author / timestamp / 本文 / 反応） |
| Sticky Composer | `<ThreadComposer disabled={...} />` |

中央 1 カラム（`max-w-3xl mx-auto`）。Stitch threadshousai では右サイドバー（Thread Details / Tags / Participants / Mute）を持っていたが、**MVP では未実装**（後述 TODO）。

## 4. ロール別の見え方

| ロール | 投稿閲覧 | 投稿作成 | モデレーション | スレッド設定 |
|---|---|---|---|---|
| **owner** | 可 | 可 | 可 | 可 |
| **admin** | 可 | 可 | 可 | 可 |
| **moderator** | 可 | 可 | 可（投稿の hide / lock） | 不可 |
| **member** | 可 | 可（編集・削除は自投稿のみ） | 不可 | 不可 |
| **参加トークン保有者** | スレッド閲覧は不可（`/events/[id]` 専用） | 不可 | — | — |
| **未ログイン** | 公開スレッドは閲覧可 / `composer` は CTA に置換 | 不可 | — | — |

## 5. データソース

| セクション | 現状 | 本番接続後 |
|---|---|---|
| Thread | `findThreadById(id)` | `getThreadById(db, id)` |
| Org | `MOCK_ORGANIZATIONS.find(...)` | `getOrganizationById(db, thread.organization_id)`（join 推奨） |
| Posts | `listPostsByThread(id)` | `listPostsForThread(db, id, { limit: 50, cursor })` |

実装場所: `src/server/queries/threads.ts`、`src/server/queries/posts.ts`（未作成）。

## 6. 状態と遷移

| 状態 | 表示 |
|---|---|
| Not found | `notFound()` |
| Empty (投稿なし) | 「まだ投稿はありません。」 |
| **Archived** | スレッドヘッダに `Archived` バッジ + Composer を **disabled**（FR-07）。バナーで「このスレッドはアーカイブ済みです（読み取りのみ）。」 |
| 自分の投稿が無い | 通常表示。Reply ボタンが無効化されることはない |
| ロック済み | （別 Issue）`<ThreadComposer disabled disabledReason="ロック済み" />` |

## 7. 書込ゲート

- `composer` の表示条件:
  - **未ログイン**: 表示せず「サインインして書き込む」CTA に置換（未実装）
  - **archived**: `disabled` + バナー表示（FR-07 と整合）
  - **ロック**: 同上
- `Reply` ボタン: 投稿内 → 同 composer にフォーカス（未実装）
- `MoreHorizontal` アクションメニュー: 自投稿 = 編集/削除、他人 = 報告（未実装）

## 8. コンポーネント依存

- `src/components/layout/top-bar`
- `src/components/domain/thread-composer`
- `lucide-react`（`Info` / `MoreHorizontal` / `Reply` / `ThumbsUp`）
- `next/image`（avatar / 添付画像）

## 9. 整合性チェック

- FR-02: 投稿の作成・編集・削除はサーバアクションで実装（別 Issue）。`src/server/actions/posts.ts` を新設予定。
- FR-07: archived UI は `<ThreadComposer disabled>` で対応。サーバ側 `INSERT` も同条件で拒否（[`docs/system/capabilities-by-role.md`](../system/capabilities-by-role.md) §「サテライト：死因・層・ビルドログ（FR-05）」と同じガード思想を long-thread 側にも適用）。
- データ契約: `posts` テーブルがまだ無い。マイグレ追加が必要（`db/migrations/0005_posts.sql` を予約）。

## 10. TODO / 未決

- [ ] 右サイドバー（Thread Details / Tags / Participants / Mute）の実装
- [ ] `posts` テーブル & マイグレ作成
- [ ] サーバアクション（投稿・編集・削除）と Composer の接続
- [ ] 投稿のロック / アーカイブ判定（FR-07）
- [ ] 未ログイン時の CTA 差し替え
- [ ] `Reply` クリックで composer にフォーカス
