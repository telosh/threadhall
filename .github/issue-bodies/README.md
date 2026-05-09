# Issue 本文テンプレ（再作成用）

リポジトリで Open な Issue と内容を揃える。**新規作成**するときは次のように実行する。

```bash
gh issue create --title "…" --label "mvp" --body-file .github/issue-bodies/NN-slug.md
```

番号はファイル名の並びと一致しない（GitHub が採番する）。本文の更新は **GitHub 上の Issue を正**とし、ここは再発行・オンボーディング用のコピーとして保守する。

> 旧 `10-stitch-ui-preview-mocks.md`（`src/app/preview/**` でのモック骨格）は撤回した。本番ルートに直接 Stitch / AI Studio mock を反映する方針に変更したため、対応する GitHub Issue は作らない。経緯は `docs/DESIGN.md` §14.3.1 と `docs/system/components.md` を参照。
