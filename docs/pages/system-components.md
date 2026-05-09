---
route: /system/components
stitch_source:
  - docs/stich/aistudio/src/components/ComponentsView.tsx
fr: []
data_source: none
auth_required: false
roles_visible: [owner, admin, moderator, member, unauthenticated]
roles_writable: []
status: implemented-with-mock
last_synced: 2026-05-10
---

# /system/components — UI Components & Parts

## 1. 概要

実装で使うパーツの**ビジュアルリファレンス**。Storybook の代替として、本番ページと同じ `<AppShell>` の中にレンダリングする。

## 2. ルートと URL パラメータ

- パス: `/system/components`
- `params` / `searchParams`: なし
- 認可なし（`/system/**` は社内ドキュメント用途）

## 3. 画面構造

| ブロック | 内容 |
|---|---|
| ヘッダ | `<TopBar breadcrumb="System / Components" />` |
| Buttons | Primary / Secondary / Ghost |
| Phase Badges (Event) | draft / live / archived |
| Thread State Badges | pinned / resolved |
| Action Menus & Selection | ドロップダウン例（New Thread / New Event / Delete） |
| Input States | Standard / Focus |

## 4. ロール別の見え方

全ロール同一表示。**未ログインでも閲覧可**（社内向けページ）。本番では `proxy.ts` で `?internal=1` cookie 等によるアクセス制御を検討（任意）。

## 5. データソース

なし（純粋に静的）。

## 6. 状態と遷移

なし。ページ自体に状態はない。

## 7. 書込ゲート

なし。

## 8. コンポーネント依存

- `src/components/layout/top-bar`
- `src/components/domain/phase-badge`
- `lucide-react`

## 9. 整合性チェック

- 本ページに掲載されている Badge / Button / Input の見た目が、他ページの実装と **必ず一致**するように維持する。
- 不一致を発見した場合は **本ページを正**として他ページを修正する。

## 10. TODO / 未決

- [ ] アバターのバリエーション（rounded-full / イニシャル / トークンゲスト）
- [ ] TopBar / Sidebar の各 state（active / hover / focus）
- [ ] Card のバリエーション（default / hover / dashed-resolved / border-l-event-active）
- [ ] Composer の disabled 例（archived / locked / no-session）
- [ ] エラー / 成功 / 警告のバナーセット
- [ ] フォーカスリングのトークン化
