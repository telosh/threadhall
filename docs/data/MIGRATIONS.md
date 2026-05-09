# マイグレーションの実行

## 前提

- `TURSO_DATABASE_URL` が効いていること（例: `.env.local` の `http://127.0.0.1:8080`）
- ローカルなら `docker compose up -d sqld` 済み

## コマンド

```bash
npm run db:migrate
```

`db/migrations/` 内の `NNNN_*.sql` を昇順に適用し、未適用だけを実行する。適用済みは `schema_migrations` テーブルに記録される。

## 新規マイグレーションの追加

1. 次番号のファイルを追加する（例: `0003_add_events.sql`）。
2. **過去の番号のファイルは編集しない**（[`CONTRACTS.md`](CONTRACTS.md)）。
3. 対応する TypeScript 行型・Zod があれば同じ PR で更新する。
4. [`CHANGELOG.md`](CHANGELOG.md) に概要を1行以上追記する。

## トラブルシュート

- `schema_migrations` が無い DB では、0001 が先に作成される。
- 途中失敗時は DB をバックアップのうえ手作業で直すか、開発環境ならボリュームを初期化してから再実行する。
