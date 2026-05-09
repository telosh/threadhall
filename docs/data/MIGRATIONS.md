# マイグレーションの実行

## 前提

- `TURSO_DATABASE_URL` が効いていること（例: `.env.local` の `http://127.0.0.1:8080`）
- **Turso Cloud** では `libsql://…` と **`TURSO_AUTH_TOKEN`（必須）**。アプリ本体・Better Auth・このマイグレーションは同じ env を参照する（`src/lib/turso.ts`）。
- ローカルなら `docker compose up -d sqld` 済み

## コマンド

```bash
npm run db:migrate
```

`db/migrations/` 内の `NNNN_*.sql` を昇順に適用し、未適用だけを実行する。適用済みは `schema_migrations` テーブルに記録される。

### 状態の確認（マイグレ一覧・行数）

アプリと同じ `@libsql/client` 経由で読み取りのみ検査する（**書き込みなし**）:

```bash
npm run db:status
```

Turso Cloud とローカル sqld のどちらでも、`.env.local` の `TURSO_DATABASE_URL`（と Cloud なら `TURSO_AUTH_TOKEN`）が効いていれば動く。

### Turso 公式 CLI（任意・対話的な検査）

[公式インストール手順](https://docs.turso.tech/cli/installation)（Windows は **WSL** 想定）。ログイン後の例:

```bash
turso auth login
turso db list
turso db show threadhall-dev    # DB 名はコンソールで作成した名前
turso db shell threadhall-dev   # 対話 SQL
```

**命名:** GCP プロジェクトを `threadhall-dev` / `threadhall-prod` に分けるなら、Turso のプライマリ DB 名も同じに揃えると URL・トークンの取り違えが減る（[`docs/deploy/cloud-run.md`](../deploy/cloud-run.md)）。

## 新規マイグレーションの追加

1. 次番号のファイルを追加する（例: `0003_add_events.sql`）。
2. **過去の番号のファイルは編集しない**（[`CONTRACTS.md`](CONTRACTS.md)）。
3. 対応する TypeScript 行型・Zod があれば同じ PR で更新する。
4. [`CHANGELOG.md`](CHANGELOG.md) に概要を1行以上追記する。

## トラブルシュート

- `schema_migrations` が無い DB では、0001 が先に作成される。
- 途中失敗時は DB をバックアップのうえ手作業で直すか、開発環境ならボリュームを初期化してから再実行する。
