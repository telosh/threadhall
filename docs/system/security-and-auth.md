# セキュリティ・認可

## 認証

- **Better Auth**（[better-auth.com](https://better-auth.com/)）がセッション・OAuth コールバックを処理する（ルート: `/api/auth/*`、DB: プライマリ libSQL 上の `user` / `session` / `account` / `verification`。マイグレーション `0005_better_auth.sql`）。
- **Google** は本番 IdP（GCP Console の OAuth 2.0 クライアント）を `socialProviders.google` に渡す。
- ローカルで GCP を持たないときは **`THREADHALL_USE_EMULATE_GOOGLE=1`** と [Vercel Labs emulate](https://github.com/vercel-labs/emulate)（`/emulate/google/...`）を併用し、Better Auth の [**generic OAuth**](https://www.better-auth.com/docs/plugins/generic-oauth) で上記 3 URL を同一オリジンのエミュレータに向ける。クライアントは `signIn.oauth2({ providerId: "google-emulate" })`。仮ユーザーは [`src/config/emulate-google-seed.ts`](../../src/config/emulate-google-seed.ts)。**emulate は本番 IdP の代替にしない**。

## 認可

- 組織ロールとイベントポリシーを**サーバ側**で強制
- Edge／BFF で `POST` / `PATCH` / `DELETE` を集中検証（[`../DESIGN.md`](../DESIGN.md) の `src/proxy.ts` はヘッダ・軽いガード等の土台。重いセッション処理は Route Handler / Server Action 側の設計と役割分担を決める）

## 秘密情報

- Google OAuth クライアントシークレット、Better Auth シークレット（`BETTER_AUTH_SECRET`）、Turso 各 DB トークン等は **Secret Manager**
- ローカルは ADC / `gcloud` 取得寄せ（運用ルールはチームで固定）

## 脅威・プロダクトメモ

- VPN・海外からの参加で「地域」だけでは閉じきれないため、**参加トークンを正**に据える（F-06）
- モデレーション地獄系機能は MVP 外または限定公開で扱う

## 能力の正

「画面から見えるメニュー」と「API で実際に許可される操作」は **サーバが正**。UI と [`capabilities-by-role.md`](capabilities-by-role.md) を常に同期すること。
