---
name: export-excel
description: Excel統合出力サブスキル。marketing-researchスキルのSTEP8として呼び出される。全JSONを読み込みExcelファイルに出力する。
---

# STEP 8：Excel統合出力

## 入力

```
/tmp/research_{業界名}/01_market.json
/tmp/research_{業界名}/02_competitor.json
/tmp/research_{業界名}/03_3c.json
/tmp/research_{業界名}/04_swot.json
/tmp/research_{業界名}/05_needs.json
/tmp/research_{業界名}/06_persona.json
/tmp/research_{業界名}/07_positioning.json
```

## 出力ファイル

```
/mnt/user-data/outputs/marketing_research_{業界名}_{YYYYMMDD}.xlsx
```

## シート構成（全8シート）

```
Sheet 1: 市場調査
Sheet 2: 競合調査
Sheet 3: 3C分析
Sheet 4: SWOT分析
Sheet 5: ニーズ分析①（キーワード）
Sheet 6: ニーズ分析②（検索意図）
Sheet 7: ペルソナ
Sheet 8: ポジショニングマップ
```

## デザインルール（全シート共通）

```python
# カラーパレット
HEADER_BG   = "2E4057"  # 濃紺（ヘッダー背景）
HEADER_FG   = "FFFFFF"  # 白（ヘッダー文字）
ACCENT_BG   = "F0F4F8"  # 薄グレー（奇数行背景）
SECTION_BG  = "4A90D9"  # 青（セクションタイトル背景）
SECTION_FG  = "FFFFFF"  # 白（セクションタイトル文字）
BORDER_COLOR = "CCCCCC" # グレー（罫線）

# フォント
FONT_HEADER  = Font(name="Yu Gothic", bold=True, color=HEADER_FG, size=10)
FONT_SECTION = Font(name="Yu Gothic", bold=True, color=SECTION_FG, size=10)
FONT_BODY    = Font(name="Yu Gothic", size=9)
FONT_TITLE   = Font(name="Yu Gothic", bold=True, size=14)
```

## 各シートのレイアウト

### Sheet 1：市場調査
| 行 | 内容 |
|----|------|
| 1 | タイトル「市場調査レポート：{業界名}」 |
| 2 | 分析日 |
| 3 | 空行 |
| 4 | セクション「業界定義」→内容 |
| 〜 | サービス細分化テーブル（カテゴリ・概要・提供形態） |
| 〜 | 業界の慣習（箇条書き） |
| 〜 | 価格帯テーブル（サービス種別・価格・備考） |
| 〜 | 流通方法・販売促進（箇条書き） |
| 〜 | 顧客層・トレンド |

### Sheet 2：競合調査
- 1行目：タイトル
- 3行目〜：競合企業テーブル（縦に企業名、横に調査項目）
  - 調査項目：URL / キャッチコピー / サービス / 価格帯 / ターゲット / 強み / 弱み / デザイン印象 / コンテンツ特徴

### Sheet 3：3C分析
- Customer / Competitor / Company の3セクション
- 各セクションに箇条書き項目

### Sheet 4：SWOT分析
- 2×2のSWOTマトリクス（セル結合で視覚的に表現）
- 各象限：項目リスト + Webサイトへの打ち出し列
- 下部：クロス分析（SO/ST/WO/WT）

### Sheet 5：ニーズ分析①（キーワード）
テーブル形式：
| キーワード | 月間検索ボリューム | 抱えている課題 | サイト活用案 |

### Sheet 6：ニーズ分析②（検索意図）
テーブル形式：
| 検索ワード | 背景にある質問 | 情報ソース | 抱えている課題 | サイト活用案 |

### Sheet 7：ペルソナ
- ペルソナごとにブロック分け
- 項目縦並び（項目名列・内容列）
- 2名の場合は横に並べる

### Sheet 8：ポジショニングマップ
- テキストで軸・各社のポジション・座標を記載するテーブル
- 下部に「マップの読み方・示唆」
- ※ビジュアルマップはチャット上にSVGで別途出力する

## Pythonコード構成

```python
import json
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from datetime import datetime

# 全JSONを読み込み
# 各シートを順番に生成
# 列幅・行高さを調整
# 保存
```

## 実行時の注意

- xlsxスキルのルールに従い、フォーミュラを使う箇所はPythonで計算せずExcel数式を使う
- 保存後は `scripts/recalc.py` を実行してエラーチェック
- 日本語フォントは「Yu Gothic」を使用（環境によっては「メイリオ」にフォールバック）
- セル内改行は `\n` + `wrap_text=True`

## ポジショニングマップのビジュアル出力

Excelとは別に、チャット上にSVGでバブルチャートを描画する：

```
- 縦軸・横軸にラベルを配置
- 各社をバブル（円）で表示
- クライアントは色違い（青系）で強調
- 凡例を右下に配置
```