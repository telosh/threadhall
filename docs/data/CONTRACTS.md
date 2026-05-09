# データ契約（ORM なし）

Threadhall の永続層は **SQL マイグレーションが単一の真実の源泉（SSOT）** である。ORM は使わない。

## レイヤー分担

| 層 | 役割 | 編集ルール |
|----|------|------------|
| `db/migrations/*.sql` | テーブル・インデックスの定義 | **マージ後に書き換えない**。変更は **新規ファイル `NNNN_description.sql`** |
| `src/types/db/*.ts` | `SELECT` 結果などの行型 | マイグレーションと同期。PR では「どの SQL 版に対応か」をコメントで明示 |
| `src/schemas/*.ts`（Zod） | HTTP / Server Action の入力 | DB 型と二重管理になり得るため、**境界にだけ**置く |
| `src/server/queries/*` | 読み取り SQL | 集約クエリはここに集約し、コンポーネントから生 SQL を書かない |

## 破壊的変更の扱い

1. **既存カラムの意味変更・削除・リネーム**は、可能なら **段階的**（新カラム追加→バックフィル→読み替え→旧カラム削除を別マイグレーション）にする。
2. どうしても即時破壊になる場合は [`CHANGELOG.md`](CHANGELOG.md) に **影響範囲・移行手順**を必ず書く。
3. API の契約変更は `src/schemas` と Route Handler のステータスコードをセットで更新する。

## TanStack Query と Next.js の役割（重複しない）

- **Server Components / `fetch` / Server Actions**: Next.js 側のサーバーデータ取得・再検証。ここに **TanStack Query のサーバーキャッシュは存在しない**。
- **TanStack Query**（将来再導入時）: **ブラウザから** Route Handler や Server Action の結果をキャッシュ・再取得・楽観更新したいときだけ使う。**RSC だけで完結する画面では導入しない**。

現状のリポジトリではクライアント fetch がまだないため **依存は外してある**。イベントログのインタラクティブ投稿（[`docs/system/features-mvp.md`](../system/features-mvp.md) FR-05 等）で必要になったら `package.json` に戻す。判断の一次情報は [`../DESIGN.md`](../DESIGN.md) のデータ取得節。

## 関連

- 適用手順: [`MIGRATIONS.md`](MIGRATIONS.md)
- 変更履歴テンプレ: [`CHANGELOG.md`](CHANGELOG.md)
