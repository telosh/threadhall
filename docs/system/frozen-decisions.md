# 確定事項（Frozen decisions）

以下は**意図的に変更コストが高い前提**として扱う。変更する場合は**理由**と**影響範囲**（データ移行・API・UI・権限）を本リポジトリの PR または改訂履歴に明示する。

| ID | 区分 | 決定内容 |
|----|------|----------|
| F-01 | 製品名 | **Threadhall** |
| F-02 | 第一ペルソナ | **イベント主催／コミュニティ運営**（作者・一般参加者は副次） |
| F-03 | プロダクト二層 | **(A)** イベント向けスレッド（締切・アーカイブあり）**＋ (B)** **長命の日常スレッド**。同一**組織**配下で束ねる |
| F-04 | データ分離 | **プライマリ Turso**（組織・ID・長命スレッド等）と **イベント単位サテライト Turso**（死因・層・ビルドログ等）。コントロールプレーンで URL・認証・フェーズを紐付け |
| F-05 | MVP 縦スライス | サテライト側の最初の具体用途は **死因・層・ビルド系ログ**（当日集計→公開、`Archived` で閲覧中心） |
| F-06 | 書込の「正」 | **参加トークン（QR・短命 JWT）優先**。GeoIP／手動会場モードは**補助** |
| F-07 | 認証 | **Better Auth** ＋ **Google** ログイン。ユーザー・組織・ロールはアプリ側で**一元管理**（クレームに載せる範囲はスパイク） |
| F-08 | クラウド基盤 | **Google Cloud** を基盤とするアーキテクチャ（Run、LB、Secret Manager、Build→Artifact→Deploy の運用ループを想定） |
| F-09 | イベントライフサイクル | `draft` → `live` → `archived`。`archived` では **INSERT/UPDATE/DELETE をアプリ層で拒否**（読取は全世界想定） |

関連: [`data-and-lifecycle.md`](data-and-lifecycle.md)、[`security-and-auth.md`](security-and-auth.md)、[`gcp-architecture.md`](gcp-architecture.md)。
