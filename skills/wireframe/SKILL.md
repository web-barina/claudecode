---
name: wireframe
description: WebサイトのワイヤーフレームをHTMLファイルで作成する。ページ構成・レイアウト・UIの設計を依頼されたときに使う。
---

# ワイヤーフレーム作成スキル

WebサイトのワイヤーフレームをHTMLファイルで出力する。

## 出力ルール

### ファイル形式
- HTMLファイル（単一ファイル）で作成
- CSSはすべて `<style>` タグ内に記述
- JavaScriptは原則不要（必要な場合のみ `<script>` タグ内に記述）

### カラールール
- 背景：白 `#FFFFFF`
- テキスト：黒 `#000000` または `#333333`
- 画像・写真プレースホルダー：グレー `#CCCCCC`
- ボーダー・区切り線：`#DDDDDD`
- ボタン背景：`#888888`
- ボタンテキスト：`#FFFFFF`

### 図形ルール
- **写真・画像**：四角（`border-radius: 0`）＋グレー背景＋中央に「IMAGE」または用途を示すテキスト
- **アイコン**：丸（`border-radius: 50%`）＋グレー背景

### フォントルール
- フォントファミリー：`'Noto Sans JP', sans-serif`
- Google Fontsから読み込む：
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  ```
- フォントサイズ：
  - SP（768px以下）：最小 **12px**
  - PC（769px以上）：最小 **16px**

### レスポンシブ
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` を必ず含める
- メディアクエリで SP / PC を切り替える
- SP基準で先にスタイルを書き、PCを `@media (min-width: 769px)` で上書き（モバイルファースト）

## 出力形式

1. HTMLファイルを作成して保存する
2. ファイルパスをユーザーに伝える
3. 構成の簡単な説明を添える（箇条書き不要、1〜2文で）

## 受け取る指示

ユーザーからの指示は `$ARGUMENTS` として渡される。ページ種別・セクション構成・SP/PC対応の有無などを読み取って作成する。
