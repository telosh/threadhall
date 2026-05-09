# コンポーネント設計と Stitch 整合性

UI 実装の単一参照（SSOT）。**「ある画面でだけ使われた表現」を見つけたら、まずここに統一ルールを書いてからコードを直す。**

- 一次ソース（UI）: `docs/stich/aistudio/src/{index.css,App.tsx,components/*.tsx}`
- 一次ソース（Stitch HTML）: `docs/stich/{community,eventlog,threadshousai}.tsx`
- 実装側: `src/components/{ui,layout,domain}/`、`src/app/globals.css`

---

## 1. デザイントークン（カラー・タイポ・スペーシング）

`src/app/globals.css` の `@theme` ブロックがリポジトリの SSOT。値は Stitch の `designMd` と完全一致させる。**コンポーネント側で `bg-[#xxx]` のような任意色を書くことは禁止**（必ずトークン経由）。

### 1.1 カラー（Material 3 由来の Stitch トークン）

| カテゴリ | トークン | 用途の目安 |
|---|---|---|
| Surface | `surface` (`#f9f9f9`) | アプリ全体背景 |
|  | `surface-bright` | カード hover などの明色面（`surface` と同値） |
|  | `surface-dim` | 控えめなブロック |
|  | `surface-muted` | mock 由来の薄い面（廃止候補） |
|  | `surface-variant` | 1 段強い divider・avatar 背景 |
|  | `surface-tint` | プライマリ hover の代替色（黒 → グレー） |
|  | `surface-container-{lowest,low,(default),high,highest}` | 段差のあるパネル群 |
| On-Surface | `on-surface` / `on-surface-variant` | 主テキスト・補助テキスト |
|  | `inverse-surface` / `inverse-on-surface` | 反転 |
| Primary | `primary` (`#000`) / `on-primary` (`#fff`) | 主ボタン |
|  | `primary-container` / `on-primary-container` | 控え |
|  | `primary-fixed` / `primary-fixed-dim` | アバターカウンタ等 |
| Secondary | `secondary` (`#4648d4`) / `on-secondary` | リンク・強調 |
|  | `secondary-container` / `on-secondary-container` | active ナビ背景 |
|  | `secondary-fixed` / `secondary-fixed-dim` | アバター枠の薄色 |
| Outline | `outline` (`#7e7576`) | 強い境界線 |
|  | `outline-variant` (`#cfc4c5`) | 標準的な境界線（**最頻出**） |
|  | `border-low` (`#e2e8f0`) | divider 専用（薄め） |
| Error | `error` / `on-error` / `error-container` / `on-error-container` | エラー UI 一式 |
| Threadhall 固有 | `event-active` (`#f59e0b`) | live イベント強調 |
|  | `thread-stable` (`#0f172a`) | 長命スレッドの濃色アクセント |
|  | `text-dim` (`#64748b`) | メタ情報（時刻・件数） |

**未使用トークン**（残しているが MVP ではコードから参照しない）: `tertiary*`、`primary-fixed-dim` の単独色など。components ページに掲載するときに役割を確定する。

### 1.2 タイポグラフィ

`next/font` で `Geist` / `Inter` / `JetBrains Mono` を CSS 変数として読み込み、`@theme` の `--font-*` で Tailwind v4 ユーティリティ化する。

| ユーティリティ | font / size / weight |
|---|---|
| `font-headline` | Geist |
| `font-body` / `font-sans` | Inter |
| `font-label-sm` / `font-mono` | JetBrains Mono |
| `text-headline-xl` | 36px / 1.2 / 700 |
| `text-headline-xl-mobile` | 28px / 1.2 / 700 |
| `text-headline-lg` | 24px / 1.3 / 600 |
| `text-headline-md` | 18px / 1.4 / 600 |
| `text-body-lg` | 16px / 1.6 / 400 |
| `text-body-md` | 14px / 1.5 / 400 |
| `text-label-sm` | 12px / 1 / 500 / 0.02em |

`<h1>～<h5>` は `globals.css` の `@layer base` で **自動的に Geist** に切り替わる。`<code>` は JetBrains Mono。

### 1.3 ラディウスとスペーシング

| トークン | 値 |
|---|---|
| `rounded-DEFAULT` | 0.125rem |
| `rounded-lg` | 0.25rem |
| `rounded-xl` | 0.5rem |
| `rounded-2xl` | 1rem |
| `rounded-full` | 9999px |
| `p-stack-sm` / `gap-stack-sm` | 0.5rem |
| `p-stack-md` | 1rem |
| `p-stack-lg` | 2rem |
| `p-margin-page` | 2rem（ページ余白の SSOT） |
| `p-gutter` | 1.5rem（カラム間） |
| `max-w-container-max` | 1200px（コンテンツ最大幅） |

**禁止**: `rounded`（無サフィックス）の単独使用。Stitch HTML には混入しているが、AI Studio mock 側で `rounded-DEFAULT` に正されているのでそちらを正とする。

---

## 2. レイアウト構造

```
<html>
  <body>
    <AppShell>                    // server, src/components/layout/app-shell.tsx
      <Sidebar />                 // client, fixed left, md+
      <slot main column>
        <AppProviders>            // 現状はパススルー
          {page.tsx の中身}
            <TopBar breadcrumb=…/>
            <main>{contents}</main>
        </AppProviders>
      </slot>
      <MobileBottomNav />         // client, fixed bottom, md-
    </AppShell>
  </body>
</html>
```

ページ実装の **強制ルール**:

1. ページの 1 行目で `<TopBar breadcrumb={...} />` を必ず出す（共有レイアウトには含めない）。
2. その下を `<main className="flex-1 overflow-y-auto bg-background">` で包む。
3. ページ余白は `p-margin-page` を **main 直下のラッパー**で 1 度だけ適用する。
4. スレッド／イベントログのような full-bleed ページでは、`p-margin-page` をやめて中で sticky composer を持つ専用構造にする（`docs/pages/threads-id.md`、`docs/pages/events-id.md` 参照）。

---

## 3. コアコンポーネント

| ファイル | 役割 | 主な props |
|---|---|---|
| `src/components/layout/app-shell.tsx` | サイドバー＋メイン枠＋モバイルナビ | `children` |
| `src/components/layout/sidebar.tsx` | デスクトップ用サイドバー | （`usePathname` で active 判定） |
| `src/components/layout/top-bar.tsx` | ヘッダ（ブレッドクラム＋通知＋設定＋アバター） | `breadcrumb: string` |
| `src/components/layout/mobile-bottom-nav.tsx` | モバイル底ナビ | （`usePathname` で active 判定） |
| `src/components/domain/section-heading.tsx` | カラム見出し（icon＋title＋action） | `icon?` `title` `action?` |
| `src/components/domain/thread-card.tsx` | スレッドカード | `thread: MockThread` `variant: "compact" \| "detailed" \| "resolved"` |
| `src/components/domain/event-card.tsx` | イベントカード | `event: MockEvent` `variant: "schedule" \| "calendar"` |
| `src/components/domain/phase-badge.tsx` | phase / 状態バッジ | `variant: "draft"\|"live"\|"archived"\|"resolved"\|"pinned"` |
| `src/components/domain/thread-composer.tsx` | スレッド返信エディタ | `disabled?` `disabledReason?` |
| `src/components/domain/event-log-composer.tsx` | イベントログ書込フォーム | `disabled?` `disabledReason?` |

---

## 4. 統一ルール（**Stitch HTML 3 画面と AI Studio mock の差分を解消した結論**）

ここは「画面ごとに微妙に違っていた表現」を 1 ルールに固めた一覧。実装は **本表に従い**、Stitch HTML 側の不整合は無視する。

| 観点 | 統一ルール | 出典・備考 |
|---|---|---|
| サイドバー上部ブランド | `<h1>Threadhall</h1> + <p>Precision Community</p>`、アイコンなし、`mb-8 px-3` | community / eventlog 採用（threadshousai の `hub` アイコンは破棄） |
| サイドバー active ナビ | 背景 `bg-secondary-container`、文字 `text-on-secondary-container`、`rounded-lg`、icon は `fill-current` | 全画面共通。Stitch threadshousai の `font-bold` は省略（明示性は十分） |
| サイドバー inactive ナビ | `text-on-surface-variant`、hover `bg-surface-container-high`、`rounded-lg` | 角丸を `rounded-lg` に統一（Stitch community の `rounded-DEFAULT` は破棄） |
| 「Create New」ボタン | サイドバー **下部固定**（`mt-auto mb-4`）、`rounded-DEFAULT`、`py-2`、`text-label-sm`、Plus アイコン + テキスト | community / AI Studio mock 採用。eventlog の特大版は破棄 |
| TopBar 中央 | **全ページでブレッドクラム**（検索バーは MVP では出さない） | 前チャットの決定 |
| TopBar アイコンボタン | `rounded-full p-2 active:scale-95` | community / eventlog 採用 |
| TopBar アバター | `rounded-full` 32px | 全画面で円形に統一（決定事項） |
| コンテンツ内アバター（スレッドポスト・参加者） | `rounded-full` | 決定事項（threadshousai の四角は破棄） |
| カードの角丸 | リスト行 = `rounded-xl`、Hero = `rounded-2xl`、バッジ = `rounded-full`、入力 = `rounded-lg` | AI Studio mock の階層を採用 |
| プライマリボタン hover | `hover:bg-surface-tint` | 「色反転」演出は破棄 |
| アイコン | **lucide-react に統一**（Material Symbols Outlined は使わない） | AI Studio mock 採用。Stitch HTML の Material Symbols は移植時に変換 |
| `data-icon` 属性 | 使わない | community HTML だけが付けていた冗長要素 |
| カスタムスクロールバー | `globals.css` でグローバル適用 | threadshousai 由来を全画面共通化 |
| Inter / JetBrains Mono の weight | next/font で `Inter 400/500/600`、`JetBrains Mono 400/500/600` を一括ロード | HTML 側の `<link>` でロードする運用は廃止 |
| `rounded`（無サフィックス）の単独使用 | 禁止 | `rounded-DEFAULT` 等を必ず付ける |
| `<h1>` の使い方 | **ページの主題のみ**（組織名 / スレッドタイトル / イベント名 / Overview の見出し / Components の見出し） | Stitch では `<h1>Threadhall</h1>` がブランドにも付いていたが、本リポジトリでは `<h1>` をブランドにも残す（モバイル時の TopBar / Sidebar で各 1 つだけ）。ページタイトルは別 `<h1>` |

### 4.1 状態バッジの正規ルール（FR と整合）

| 用途 | variant | 文言例 | 視覚 |
|---|---|---|---|
| イベント `draft` | `draft` | `Draft` | `bg-surface-variant` |
| イベント `live` | `live` | `Live` / `Happening Tomorrow` 等 | `bg-event-active text-on-primary` |
| イベント `archived` | `archived` | `Archived` | `bg-error-container` + `border-dashed` |
| スレッド ピン留め | `pinned` | `Pinned` | `bg-secondary-container` |
| スレッド 解決済み | `resolved` | `Resolved` | `bg-surface-container-highest` |

**書込ゲートとの対応**（[`capabilities-by-role.md`](capabilities-by-role.md) §「イベントフェーズ別の一文まとめ」）:

- `draft`: composer 表示するが「運営のみ」アノテーション（実装は別 PR）
- `live`: composer 通常表示。トークン保有者の根拠はサーバ判定。
- `archived`: composer **必ず disabled** + バナー「このイベントはアーカイブ済みです（書込不可・閲覧のみ）。」を上に表示。FR-07。

### 4.2 アクセシビリティ最低ライン

- アイコンのみのボタンには **必ず `aria-label`**。
- active ナビには `aria-current="page"`。
- `<button>` の type は `button` か `submit` を **常に明示**（フォーム外でも）。
- フォーカス可視: `focus-visible` のリングはトークン側に未定義なので、`focus:border-primary focus:ring-1 focus:ring-primary` を input/textarea で揃える。

---

## 5. 既知のずれと残課題

| # | 観点 | 現状 | 解消方針 |
|---|---|---|---|
| 1 | Stitch HTML 内のサイドバー上部ブランドが画面ごとに違う | community/eventlog は同型、threadshousai のみ `hub` アイコン付き | 本リポジトリは AI Studio mock 採用（アイコン無し）に統一済み |
| 2 | Stitch HTML の `border-low` が未使用 | `globals.css` には残しているが domain には出していない | divider の薄色用途として残し、Components ページのレファレンスに掲載 |
| 3 | `surface-bright` と `surface` が同値 | `#f9f9f9` で一致 | コードでは原則 `bg-surface` を使い、threadshousai 系の hover hover-bg にだけ `surface-bright` を残す |
| 4 | mock データの画像 hotlink | `lh3.googleusercontent.com/aida-public/**` に依存 | 本番化時に Vercel Blob か Turso 経由のストレージに置き換え。`next.config.ts` の `remotePatterns` を更新 |
| 5 | Components ページに「アバター」「TopBar」「Card」のバリエーションが未掲載 | AI Studio mock 由来で最小構成 | 別 Issue で拡充。`docs/pages/system-components.md` に TODO 化 |
| 6 | モバイルボトムナビの active アイコンが `fill-current` だけ | active 表示が薄い | 別 Issue で indicator (上線 or 下線) を追加検討 |
