# Threadhall システムドキュメント（`docs/system`）

製品・データ・インフラの**前提を固定する**ためのドキュメント群。リポジトリ内の実装レイアウトや開発時のフォルダ責務は [`../DESIGN.md`](../DESIGN.md) を参照（アプリ本体のスキャフォールド向け）。**SQL・型・境界検証の契約**は [`../data/CONTRACTS.md`](../data/CONTRACTS.md)。

| 項目 | 内容 |
|------|------|
| 目的 | 対話で確定した要件と、変更コストの高い方針を追跡可能な形で残す |
| 想定読者 | 実装担当、レビュア、将来のメンテナ |
| ステータス | ドラフト（スパイクでテーブル・API が固まったら各章を更新） |

## 読み方（推奨順）

0. [`../data/CONTRACTS.md`](../data/CONTRACTS.md) … ORM なし・マイグレ・TanStack/RSC の分担（実装の正）

1. [`overview.md`](overview.md) … 価値・スコープ・非目標
2. [`frozen-decisions.md`](frozen-decisions.md) … 変更時は影響範囲を必ず明記する層
3. [`capabilities-by-role.md`](capabilities-by-role.md) … **誰が何をできるか**（権限の正）
4. [`screens-and-ui.md`](screens-and-ui.md) … **画面・UI と機能の対応**
5. [`features-mvp.md`](features-mvp.md) … MVP 機能要件 ID
6. [`domain-model.md`](domain-model.md) … 論理エンティティ
7. [`data-and-lifecycle.md`](data-and-lifecycle.md) … 二層 Turso・イベント状態・書込ゲート
8. [`security-and-auth.md`](security-and-auth.md) … 認証・認可・秘密情報
9. [`gcp-architecture.md`](gcp-architecture.md) … GCP × Turso 論理構成
10. [`nfr-and-operations.md`](nfr-and-operations.md) … 非機能・運用
11. [`open-questions-and-spikes.md`](open-questions-and-spikes.md) … 未決・スパイク・タスク追跡
12. [`future-backlog.md`](future-backlog.md) … 将来拡張（参考）
13. [`glossary.md`](glossary.md) … 用語
14. [`turso-event-scope.md`](turso-event-scope.md) … イベント×Turso スコープの入り口
15. [`components.md`](components.md) … UI トークン・コンポーネント設計（実装の正）
16. [`pages-matrix.md`](pages-matrix.md) … ページ × FR × ロール × データの整合性表
17. [`../pages/`](../pages/) … 本番ルートごとの仕様（フロントマター付き）

## 技術スタック（確定方針）

- **DB**: Turso（libSQL）— プライマリ＋イベント単位サテライト
- **認証**: Better Auth / Google OAuth（GCP Console クライアント）
- **クラウド**: Google Cloud（例: Cloud Run、LB、Secret Manager、Build→Artifact→Deploy）

## メタ情報（YAML 由来の追跡用）

オリジナル設計メモの追跡 ID と対応は [`open-questions-and-spikes.md`](open-questions-and-spikes.md) の「設計メモの追跡項目」を参照。

## 作業管理（Issue / gh）

実装タスクは **GitHub Issues** で追跡する。ローカルからは **`gh issue list`** / **`gh issue view`**。エージェント・人間ともに運用ルールは **`.cursor/rules/github-issue-workflow.mdc`**。本文テンプレのコピーは **`.github/issue-bodies/`**。
