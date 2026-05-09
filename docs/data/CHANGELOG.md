# スキーマ・データ契約の変更ログ

最新を上に追記する。

## フォーマット

```
## [YYYY-MM-DD] 000N_short-title
### Added | Changed | Deprecated | Removed
- 箇条書き（影響・移行手順があれば併記）
```

---

## [未リリース] アプリケーション（FR-01 一部）

### Added

- `POST /api/organizations` で組織 INSERT（409: slug 重複）
- `insertOrganization`（`src/server/mutations/organizations.ts`）
- トップページの開発用フォーム（Server Action → リダイレクトフラッシュ）

## [未リリース] 0002_organizations

### Added

- `organizations` テーブル（FR-01 向け最小）

## [未リリース] 0001_schema_migrations

### Added

- `schema_migrations` テーブル（適用履歴）
