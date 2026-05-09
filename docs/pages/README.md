# ページ別ドキュメント（IA・状態・ロール）

各 App Router ルートの仕様を **1 ページ = 1 Markdown** で固定する。実装と整合が取れていない場合は **本ドキュメントが正**として PR を分ける（コードと doc は同 PR で同期させること）。

## ファイル構成

| ファイル | ルート | 一次ソース UI | 関連 FR |
|---|---|---|---|
| [`dashboard.md`](dashboard.md) | `/dashboard` | `docs/stich/aistudio/src/components/DashboardView.tsx` | FR-01, FR-02, FR-03 |
| [`orgs-slug.md`](orgs-slug.md) | `/orgs/[slug]` | `OrganizationView.tsx` + `docs/stich/community.tsx` | FR-01, FR-02, FR-03 |
| [`threads-id.md`](threads-id.md) | `/threads/[threadId]` | `ThreadView.tsx` + `docs/stich/threadshousai.tsx` | FR-02, FR-07 |
| [`events-id.md`](events-id.md) | `/events/[eventId]` | `EventLogView.tsx` + `docs/stich/eventlog.tsx` | FR-03, FR-04, FR-05, FR-06, FR-07 |
| [`system-components.md`](system-components.md) | `/system/components` | `ComponentsView.tsx` | （内部用ドキュメント） |
| [`root.md`](root.md) | `/` `/dev` | — | FR-08（最終的に LP / dashboard 振り分け） |

## 各ファイルのフロントマター（最低限）

```yaml
---
route: /dashboard               # 実装ルート
stitch_source:                  # AI Studio mock or Stitch HTML 由来のファイル
  - docs/stich/aistudio/src/components/DashboardView.tsx
fr: [FR-01, FR-02, FR-03]       # 関連する features-mvp.md の ID
data_source: mock               # mock | primary | satellite | composed
auth_required: true             # 未ログインで開けるか
roles_visible:                  # 表示できるロール（capabilities-by-role.md）
  - owner
  - admin
  - moderator
  - member
roles_writable:                 # 書込操作ができるロール
  - owner
  - admin
status: implemented-with-mock   # planned | implemented-with-mock | wired-to-db
last_synced: 2026-05-10
---
```

## 各ファイルの章立て

1. **概要** — 目的（1 文）
2. **ルートと URL パラメータ** — `params` / `searchParams` の定義
3. **画面構造** — Stitch 画面との対応スクショ・主要セクションの順番
4. **ロール別の見え方** — owner / admin / moderator / member / token / unauthenticated
5. **データソース** — どの query / mock を使い、どの DB を引くか
6. **状態と遷移** — Empty / Loading / Error / archived / not_found などの分岐
7. **書込ゲート** — capabilities-by-role.md と整合するアクション
8. **コンポーネント依存** — `src/components/{layout,domain}` の使用一覧
9. **整合性チェック** — features-mvp.md / data/CONTRACTS.md とクロス
10. **TODO / 未決** — 別 Issue 化したい項目
