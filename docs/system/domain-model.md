# ドメインモデル（論理）

プライマリ DB を権威とする**中心エンティティ**。実装時のテーブル名は異なる場合あり。

## プライマリ（中心）

| エンティティ | 主な属性・備考 |
|--------------|----------------|
| **Organization** | スラッグ、表示名、設定 |
| **OrganizationMember** | `user_id`, `organization_id`, **role**（複数段階を許容） |
| **Thread / Channel** | `organization_id`、`persistent` \| `event_tied`、表示設定 |
| **Event** | `organization_id`、**phase**、timezone、**turso_satellite_ref**（DB 識別子またはメタ）、公開範囲 |
| **EventScope / Policy** | 書込モード（`ticket` 前提、将来 `geo_heuristic` 等） |
| **Ticket / 参加クレーム** | イベント単位の短命トークン、消費／失効ルール |

## サテライト（イベント専用・例）

- **death_log** 行（死因タグ、フロア、ビルド名、タイムスタンプ、任意で参加者識別子）など、高チャーン・高隔離データ

長命スレッドをサテライトに閉じ込めない。**イベント終了後も組織の日常会話はプライマリで継続**する（[`data-and-lifecycle.md`](data-and-lifecycle.md)）。
