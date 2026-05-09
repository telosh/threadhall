## 概要

サテライト上の MVP 縦スライス一式。

- **FR-05**: 死因・層・ビルド系ログの投稿・集計・閲覧
- **FR-06**: 参加トークン発行・検証（書込 API の正）
- **FR-07**: `archived` 後の書込禁止・閲覧継続

## 完了条件

- [ ] サテライト内テーブル（マイグレ or プロビジョニング時 DDL ― 方針を Issue コメントで確定）
- [ ] トークン（短命 JWT / QR 想定）の発行・検証
- [ ] `live` のみ書込、`archived` は変異拒否の E2E 相当手動確認
- [ ] UI-11 / UI-12 / UI-13（`screens-and-ui.md`）のたたき台

## 参照

- `docs/system/features-mvp.md`（FR-05〜07）
- `docs/system/turso-event-scope.md`
- `docs/system/capabilities-by-role.md`

## 作業メモ

巨大になりそうなら **本 Issue を分割**してよい（その際相互リンク）。
