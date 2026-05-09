# Threadhall

コミュニティの**長命スレッド**と、**会場・締切で閉じるイベントログ**を想定した Next.js スキャフォールド。データ層は **Turso / libSQL**、ローカルは **Docker の libsql-server（sqld）** のみで開発できます。

設計上の整理（ドメイン・フォルダ責務・`src/proxy.ts` など）は [`docs/DESIGN.md`](docs/DESIGN.md) を参照。**製品確定事項・権限・画面・GCP/Turso** は [`docs/system/README.md`](docs/system/README.md)。**データ契約（SQL・型・TanStack/RSC）** は [`docs/data/CONTRACTS.md`](docs/data/CONTRACTS.md)。**Issue ベースの進め方**は [`.cursor/rules/github-issue-workflow.mdc`](.cursor/rules/github-issue-workflow.mdc)。

## 必要環境

- Node.js **22+**（`.nvmrc`）
- Docker（任意。`sqld` 用）
- npm（このリポジトリは `create-next-app` 既定で npm）

## クイックスタート

```bash
cp .env.example .env.local
docker compose up -d sqld
npm install
npm run db:migrate
npm run dev
```

ブラウザで `http://localhost:3000` 。DB 疎通は `/api/health/db` 。スキーマは `npm run db:migrate` で `db/migrations` から適用。

トップの「試用: 組織作成」フォームを使う場合は `.env.local` に `THREADHALL_ALLOW_DEV_ORG_FORM=1` を追加（`.env.example` 参照）。

### Docker で Web も含めて起動

```bash
docker compose up --build web
```

ホストで編集する場合は `web` サービスのボリュームマウントを利用（`Dockerfile.dev`）。

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | Next.js 開発サーバー（Turbopack） |
| `npm run build` / `start` | 本番ビルド・起動 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | SQL マイグレーションを適用（`.env.local` の URL を参照） |
| `npm run docker:sqld` | libsql-server のみ起動 |
| `npm run docker:dev` | `docker compose up --build web` |

## 技術スタック（初期）

- **Next.js 16**（App Router、RSC 優先）
- **React 19**
- **Tailwind CSS 4**
- **@libsql/client** … ローカル sqld / Turso 両対応（既定）。**ORM は使わず** `db/migrations` + `src/types/db`
- **Zod** … API / Server Action の入力検証（`src/schemas`）
- **@tursodatabase/serverless**（`compat`）… `THREADHALL_USE_SERVERLESS_SDK=1` のとき `src/lib/turso.ts` 経由で**アプリ DB・Better Auth・`npm run db:migrate`**に同じ接続規則が適用される
- **Zustand** … 小さなクライアント UI 状態（例: `src/stores/ui-store.ts`）
- **TanStack Query** … **未導入**（RSC で足りる間はバンドルを増やさない。クライアントからの再取得・楽観更新が必要になったら追加。判断は [`docs/data/CONTRACTS.md`](docs/data/CONTRACTS.md)）

### 状態管理の方針（推奨）

- **サーバー由来のデータ**: 第一は **Server Components** と `src/server/queries/*`。同じデータをクライアントキャッシュに載せない（二重管理防止）
- **クライアントからのミューテーション / ポーリングが必要なとき**: Route Handler または Server Action を用意し、その時点で **TanStack Query を再導入**してもよい
- **URL に置ける状態**: `searchParams`（共有・ブックマークに強い）
- **純 UI**: **Zustand** など極小ストア

## フレームワーク選定メモ（Angular などとの比較）

| | Next.js（本リポジトリ） | Angular | Remix / React Router | SvelteKit |
|---|-------------------------|---------|----------------------|-----------|
| メリット | Vercel・**`vercel dev`**・Routing Middleware・RSC/SSG/SSR の公式導線が揃う。Turso / Drizzle 例が多い | 大規模エンタープライズで型・DI・設計が統一されやすい | Web 標準・フォーム・loader に寄せたデータフロー | 軽量・コンパイラ・書き味 |
| デメリット | RSC と境界の学習コスト | 初回ボイルが重め・小規模では過剰になりがち | Vercel 以外のホスティング慣れが別 | 求人・コンポーネント資産は React より薄めになりがち |

**Vercel Labs / エミュレーション** を活かす前提なら **Next.js** が最も摩擦が少ないです。企業規模で Angular 全体標準がある場合は、API だけ Nest/BFF を分離してフロントは Angular にしてもよいですが、Turso・Edge・デプロイ一体サイクルは Next 優位になりやすいです。

ローカルで Vercel 相当の挙動に近づけるには例えば:

```bash
npx vercel@latest dev
```

（本リポジトリには Vercel CLI を依存に入れていません。必要なら都度 `npx` 推奨。）

## Turso / libSQL

- ローカル: `TURSO_DATABASE_URL=http://127.0.0.1:8080`（`.env.example` 参照）
- 本番: Turso Cloud の `libsql://...` と `TURSO_AUTH_TOKEN`

## Git・リモート

初回:

```bash
git branch -m main
git remote add origin git@github.com:telosh/threadhall.git
git push -u origin main
```

組織名・リポジトリ名は環境に合わせて読み替えてください。

## ライセンス

MIT（`LICENSE`）。
