## 概要

`docs/system/open-questions-and-spikes.md` の **spike-gate**。他機能を広げる前に **サーバ側の正** を固定する。

## 完了条件（チェックリスト）

- [ ] **GET** … 公開読取の方針（全世界／認可要）を 1 ルートで実装・確認。キャッシュは任意で後追い可。
- [ ] **POST** … **参加トークンなし**の書込が 403/401 等で拒否される（トークン検証のダミーでも可）。
- [ ] **archived** … 変異系（INSERT/UPDATE/DELETE）が API 層で一貫拒否（409/403 のどちらか方針をドキュメント化）。

## 参照ドキュメント

- `docs/system/open-questions-and-spikes.md`
- `docs/data/CONTRACTS.md`

## 作業メモ（エージェント / 人間用）

着手・途中・ブロック時は **本 Issue にコメント**で状態を残すこと。
