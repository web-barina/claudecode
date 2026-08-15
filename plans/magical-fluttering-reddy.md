# barina-code ポートフォリオサイト最適化

## Context

`index.html` が最新デザイン（Jostフォント／ネイビー×ゴールド×水色の配色／375px幅のカード型シェル）にリニューアルされたが、全面インラインstyleと `{{ }}` テンプレート変数（`site-data.js` 経由）で組まれており、以下の問題がある。

- CSSがBEM化されておらず、パーツ単位で管理できない
- テキストが `{{ w.title }}` のような変数経由になっていて直接編集できない
- `icons/` フォルダが削除され `images/` に移動済みだが、`index.html` 内の画像パスが `icons/...` のまま参照切れになっている
- `index.html` に `style.css` の読み込みがなく、canonical/OGP/構造化データなどSEOタグも未設置（他ページには既にある）
- `privacy.html` / `404.html` は旧デザイン（Archivoフォント／紺×オレンジ）のまま新デザインと不揃い

ユーザー確認済み：**privacy.html と 404.html は新デザインに合わせる。pianist.html と horror.html は今回対象外**（ユーザーが別途独自デザインで作成予定）。

`style.css` を見ると、実は `.hero` `.about__grid` `.work-card` `.next__item` `.contact-section` `.form__*` `.site-footer__*` `.menu__*` `.flow-diagram` `.step-flow` `.chip-row` `.wave-divider` など、新index.htmlの構造にほぼ対応するBEMクラス一式が**既に用意されている**（配色・フォントは旧デザインのまま未更新、pianist/horror/privacy/404では未使用＝浮いている状態）。これを土台に、配色・フォントだけ新デザインに更新し、プロパティ値は現在の `index.html` のインラインstyleから転記して視覚的に完全一致させる。

## 変更方針

### 1. `style.css`
- カラー/フォントトークンを新デザインに更新：Jost（Archivoの代替）、`#10485F`（本文濃色）/`#2E7793`（本文）/`#4E9DBC`（ラベル）/`#FFC72C`・`#FFD86B`・`#B57E00`（ゴールドアクセント）/`#4FC3E8`・`#7FCBE4`・`#8FD3EA`・`#A6DDEF`（水色）/`#0E4257`・`#0A3243`（濃紺パネル）/`#EAF6FB`系グラデーション背景
- 既存の `.hero` `.hero-nav` `.menu` `.about` `.work-card` `.next` `.contact-section` `.form` `.site-footer` などのブロックを再利用し、プロパティ値を現index.htmlのインラインstyleから転記（レイアウトは375px単一カラム・`cqw`単位ベースに合わせて書き直す。旧CSSの `auto-fit` 複数カラムグリッドは新デザインでは使わないので置き換え）
- 新規追加が必要なブロック：スクロール進行レール（`.flow-rail`）、タイムライン背景の曲線SVG（`.spine`）、フローティングアイコンバッジ（`.float-badge` 等）、装飾ブロブ（`.deco-blob`）、`data-reveal` のフェードイン用ユーティリティ
- `style-hover` / `style-focus` カスタム属性（現index.htmlの送信ボタン・input等で使用）は廃止し、`.form__submit:hover` `.form__input:focus` のような既存スタイルシート内の実 `:hover`/`:focus` 疑似クラスに置き換える
- メニュー開閉・フォーム送信後(thanks)表示・その他ジャンル入力欄の表示切替は、JSで巨大なstyle文字列を組み立てる現方式をやめ、状態クラス（例: `is-open` `is-sent` `is-other`）をトグルするだけにして、実際の見た目（transform/opacity/visibility等）はCSS側の修飾クラスに寄せる
- `body.page-privacy` と `body.page-portfolio`（404用）は新配色にスコープを分離して上書きする。現状 `body.page-pianist, body.page-privacy { ... }` のように結合セレクタになっている箇所は分割し、`.shell` `.page-header` `.page-footer` など共有クラスは**書き換えず**、`body.page-privacy .shell { ... }` のようなスコープ付き上書きルールを追加する形にする（pianist.html / horror.html の見た目に影響を一切与えないため）

### 2. `index.html`
- `<link rel="stylesheet" href="style.css">` を追加、`support.js` の `<script>` に `defer` を付与（他ページと統一）
- `<script src="./site-data.js">` の読み込みを削除
- 本文の全インラインstyleをBEMクラスに置き換え
- `{{ w.title }}` 等のテンプレート変数を廃止し、`site-data.js` の内容（works 3件、SNSリンク、pianist/horror/privacyへのURL、Googleフォームのaction/entry ID）を直接HTMLに書き込む。`sc-for` によるworksループは3件の静的 `<article>` に展開する
- 画像パスを `icons/icon-*.svg` → `images/icon-*.svg` に修正、workサムネイルは `images/work-site.webp` / `images/work-lp.webp` を直接指定（テンプレート変数解決待ちの `data-src` ワークアラウンドは不要になるため削除、対応するJSも削除）
- DCLogicコンポーネントは残す（メニュー開閉・フォーム送信後表示・その他ジャンル欄・スクロール進行レール・パララックス・reveal演出・接続曲線描画はJS挙動として必要）が、`renderVals()` は状態クラスの返却のみに簡素化し、テキスト/URL/works関連の返却値は削除
- SEO対策を追加：`canonical`、OGP（`og:title/description/url/image/locale`）、`twitter:card`、構造化データ（TOPページなので `WebSite` ＋本人ページとして `ProfilePage`+`Person`）を他ページ同様のパターンで追加
- 画像は `loading="lazy"`（ファーストビュー以外）、workサムネイルのaltは固有名称を含む具体的な文言に変更

### 3. `privacy.html` / `404.html`
- Google Fontsの `<link>` を `Archivo` → `Jost`（+Zen Kaku Gothic New）に変更（index.htmlと同じURL）
- 構造・クラス名はそのまま。`style.css` 側のスコープ付き上書きにより配色が自動的に新デザインに揃う

### 4. `pianist.html` / `horror.html`
- 変更しない（ユーザーが別デザインで作成予定）

### 5. `site-data.js`
- 削除（値はすべて index.html に直接記載するため不要になる）

### 6. `sitemap.xml`
- 変更したページ（index / privacy / 404 ※404はnoindexなのでsitemap対象外のまま）の `lastmod` を更新

## 検証

1. site-checkスキルのチェックシート（`skills/site-check/SKILL.md`）に沿って、index.html / privacy.html / 404.html をローカルファイルとして自己チェック（meta/OGP/構造化データ/画像alt/loading lazy/リンクhoverなど）
2. Chrome (`claude-in-chrome`) で `index.html` を幅375px/360pxで開き、崩れ・画像表示切れ・メニュー開閉・スクロール進行レール・フォームのその他欄トグル・送信後サンクス表示の動作を確認
3. `privacy.html` `404.html` も同様に開いて配色・フォントが新デザインに揃っているか、pianist.html / horror.html が変更前と見た目が変わっていないかを確認
