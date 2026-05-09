# 非機能・運用

| 観点 | 方針 |
|------|------|
| **可用性** | MVP は Cloud Run と Turso の SLO に準拠。致命経路は認証とプライマリ DB |
| **コスト** | Run スケール to zero。サテライト DB 数はイベント数に比例するため**ライフサイクル監視**が必要 |
| **可観測性** | Cloud Logging、エラー率、プロビジョニング失敗アラート |
| **法務・同意** | 参加ログの保存目的、トークンの有効期限、アーカイブ後の変更不可を **UI と利用規約**で明示 |

関連: [`screens-and-ui.md`](screens-and-ui.md)、[`gcp-architecture.md`](gcp-architecture.md)。
