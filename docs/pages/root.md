---
route: /
stitch_source: []
fr: [FR-08]
data_source: none
auth_required: false
roles_visible: [owner, admin, moderator, member, unauthenticated]
roles_writable: []
status: redirect
last_synced: 2026-05-10
---

# / — ルートリダイレクト

## 1. 概要

トップ `/` は当面 `/dashboard` への 302 リダイレクト。本格 IA（LP / sign-in / dashboard 振り分け）は FR-08 完了時に切替える。

## 2. 現状の挙動

`src/app/page.tsx` で `redirect("/dashboard")`。

## 3. 将来仕様（FR-08 完了後）

| 状態 | 飛び先 |
|---|---|
| 未ログイン | `/auth/sign-in` または LP（UI-01）。LP の有無は別決定 |
| ログイン済み・組織 1 つ以上 | `/dashboard` |
| ログイン済み・組織 0 | `/orgs/new` または welcome ページ |
| トークン経由のディープリンク | リダイレクト前に `?token=` を保持して `/events/[id]` に直接振り分け |

## 4. 実装メモ

- 振り分けロジックは `src/proxy.ts`（重い処理を避ける） または `src/app/page.tsx` の RSC 内 `redirect()` のどちらか。MVP 段階では **RSC 側に置く**ほうが認可と密結合できて読みやすい。
- 詳細な分岐は [`docs/system/security-and-auth.md`](../system/security-and-auth.md) と [`docs/system/capabilities-by-role.md`](../system/capabilities-by-role.md) を参照。

## 5. 関連: `/dev` （開発スキャフォールド）

`src/app/dev/page.tsx` は **既存**の開発用画面（DB ヘルス、組織作成フォーム、Better Auth サインイン試用）を保持している。本番ナビからは外し、URL 直打ちのみで到達する。`THREADHALL_ALLOW_DEV_ORG_FORM=1` 等の env がある場合のみ機能する。

将来は `proxy.ts` で `/dev` を `process.env.NODE_ENV === "production"` のときに 404 にしても良い（未実装）。

## 6. TODO

- [ ] LP（UI-01）の必要性決定
- [ ] FR-08 完了後にリダイレクト分岐を実装
- [ ] `/dev` を本番無効化するガード
