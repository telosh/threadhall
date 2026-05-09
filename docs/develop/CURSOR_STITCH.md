# Cursor と Google Stitch MCP（このリポジトリ）

開発用のメモ。**秘密（API キー）は Issue・ログ・チャットに貼らない。**

---

## 何が問題になりやすいか（整理）

| こと | 事実 |
|------|------|
| `.cursor/mcp.json` が `${env:STITCH_GOOGLE_API_KEY}` を見るとき | Cursor 本体が **起動した瞬間に持っている環境変数**だけが使える。`.env.local` を **自動では読まない**。 |
| `next dev` が `.env.local` を読むこと | アプリ実行用であり、**MCP とは無関係**。 |
| リモート HTTP MCP に `envFile` | Cursor では **stdio 型 MCP だけ**対応。**Stitch は URL 接続なので envFile で `.env.local` は読めない。** |
| 既に Cursor を開いた状態で `.env.local` を編集 | **プロセス環境が変わらない**。MCP 用キーが反映されない。いったん **Cursor を終了**してから、下記のどちらかで起動し直す。 |

---

## うまくいっているときに満たしている条件（チェックリスト）

1. **`.env.local`**（git 無視）に **`STITCH_GOOGLE_API_KEY=...`** が1行ある（末尾にスペースや引用符ミスがない）。
2. **変数名の綴り**は **`STITCH_GOOGLE_API_KEY`**（プロジェクト・`mcp.json`・このドキュメントと一致）。
3. **Git Bash で**、`command -v cursor` が何かパスを返す（または `cursor --version` が動く）。
   - 返らない → Cursor メニューの **Shell Command: Install 'cursor' command in PATH** を実行し、**いったん Git Bash を閉じて開き直す**。
4. **Cursor をすべて終了**したうえで、リポジトリ直下で **`bash scripts/cursor-with-stitch-env.sh`** を実行して **このフォルダを開く Cursor を起動**する（環境ごと読み込ませる）。
5. MCP の確認: Cursor の出力で **「MCP」または「MCP Logs」** を開き、`stitch-google` の初期化エラーがない。**チャット側のツール一覧**に Stitch 関連が出れば接続済みに近い。

---

## 起動コマンド（Git Bash）

リポジトリのルート（`package.json` があるディレクトリ）で:

```bash
bash scripts/cursor-with-stitch-env.sh
```

または:

```bash
npm run cursor:here
```

`npm run cursor:here` は内部で **`bash`** を呼ぶ。**ターミナルが Cmd のみで `bash` が PATH に無いと失敗**する。その場合は **Git Bash を開いて**スクリプトを直接実行する。

スクリプトは **常にリポジトリの絶対パス** を `cursor` に渡す（実行場所が `scripts/` 直下でもフォルダを取り違えない）。

---

## 構成ファイル

| ファイル | 役割 |
|---------|------|
| [`.cursor/mcp.json`](../../.cursor/mcp.json) | Stitch の URL と `X-Goog-Api-Key: ${env:STITCH_GOOGLE_API_KEY}` |
| [`scripts/cursor-with-stitch-env.sh`](../../scripts/cursor-with-stitch-env.sh) | `.env.local` から上記変数だけ読み、その環境で `cursor <repo>` |
| `.env.example` | 変数名の記載のみ（値は書かない） |

---

## 認証エラーになるとき（Google 側）

- **API キーを期待している構成**でも、プロダクト側で **OAuth のみ**等に変わっていると、ヘッダーだけでは弾かれることがあります。その場合は [Stitch MCP ガイド](https://stitch.withgoogle.com/docs/mcp/guide) と **MCP Logs** の文言に合わせて OAuth に切り替えます。
