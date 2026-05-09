## 概要

**FR-01**: 組織 CRUD、メンバー招待、**複数ロール**（owner / admin / moderator / member）。現状は土台のみ（`organizations` テーブル・GET/POST 501）。

## 完了条件

- [ ] 組織の作成・更新・削除（権限は `capabilities-by-role.md` に準拠）
- [ ] メンバー・ロールの付与・変更
- [ ] マイグレーションは **新規番号 SQL のみ**。`docs/data/CHANGELOG.md` 更新
- [ ] Zod 境界と `src/types/db` の同期

## 参照

- `docs/system/features-mvp.md`（FR-01）
- `docs/system/capabilities-by-role.md`
- `docs/system/screens-and-ui.md`（UI-04 等）

## 作業メモ

進捗はコメントまたはサブタスク Issue へ。
