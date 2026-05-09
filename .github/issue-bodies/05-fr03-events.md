## 概要

**FR-03**: イベントの作成と **`draft` → `live` → `archived`** 遷移（手動またはスケジュール）。

## 完了条件

- [ ] イベントメタをプライマリ DB に保持（`turso_satellite_ref` 等は設計に合わせる）
- [ ] フェーズ遷移 API または Server Action・権限制御
- [ ] `docs/system/data-and-lifecycle.md` の状態図と矛盾しない

## 参照

- `docs/system/features-mvp.md`（FR-03）
- `docs/system/domain-model.md`
- `docs/system/data-and-lifecycle.md`
