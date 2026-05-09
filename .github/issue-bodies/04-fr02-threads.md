## 概要

**FR-02**: 長命スレッドの作成・投稿・閲覧（**プライマリ DB** のみ）。

## 完了条件

- [ ] スキーマ（マイグレ）＋行型＋`src/server/queries` / actions
- [ ] ルート案: `docs/DESIGN.md` §4 に整合
- [ ] RSC 優先。TanStack Query は不要なら入れない（`docs/data/CONTRACTS.md`）

## 参照

- `docs/system/features-mvp.md`（FR-02）
- `docs/DESIGN.md`

## 作業メモ

チャンネル複数化はスキーマ後方互換で拡張可（system ドキュメント記載）。
