# Turso イベントスコープ設計（エントリ）

**Threadhall** におけるイベントデータの隔離・ライフサイクル・書込ゲートを定義する設計束。詳細は次を読む。

| 読む順 | ドキュメント |
|--------|----------------|
| 1 | [`frozen-decisions.md`](frozen-decisions.md) … F-04, F-05, F-06, F-09 |
| 2 | [`data-and-lifecycle.md`](data-and-lifecycle.md) … 二層 DB・状態遷移・ゲート優先度 |
| 3 | [`capabilities-by-role.md`](capabilities-by-role.md) … フェーズ×ロール×トークン |
| 4 | [`screens-and-ui.md`](screens-and-ui.md) … UI-06〜UI-13 |
| 5 | [`open-questions-and-spikes.md`](open-questions-and-spikes.md) … スパイクゲート |

**MVP 縦スライス**: サテライト上の **死因・層・ビルド系ログ**（当日→公開、`archived` で読取中心）。

**書込の正**: **参加トークン（QR・短命 JWT）**。Geo・会場モードは補助。
