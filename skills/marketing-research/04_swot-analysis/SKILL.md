---
name: swot-analysis
description: SWOT分析サブスキル。marketing-researchスキルのSTEP4として呼び出される。03_3c.jsonを読み込んで生成する。
---

# STEP 4：SWOT分析

## 入力

- `/tmp/research_{業界名}/03_3c.json`（3C分析結果）
- `/tmp/research_{業界名}/02_competitor.json`（競合調査結果・参照用）

## 出力構造

PDFテンプレートの「SWOT × Webサイトへの打ち出し」形式に対応する。

```json
{
  "strengths": [
    {
      "item": "強みの内容",
      "web_application": "Webサイトへの打ち出し方"
    }
  ],
  "weaknesses": [
    {
      "item": "弱みの内容",
      "web_application": "Webサイトでの対処・カバー方法"
    }
  ],
  "opportunities": [
    {
      "item": "機会・追い風となる外部環境",
      "web_application": "Webサイトへの打ち出し方"
    }
  ],
  "threats": [
    {
      "item": "脅威・リスクとなる外部環境",
      "web_application": "Webサイトでの対応策"
    }
  ],
  "cross_analysis": {
    "so_strategy": "強み×機会：最も攻めるべき戦略（100文字）",
    "st_strategy": "強み×脅威：強みで脅威を回避する戦略（100文字）",
    "wo_strategy": "弱み×機会：弱みを補いながら機会を取る戦略（100文字）",
    "wt_strategy": "弱み×脅威：最も避けるべきリスク（100文字）"
  }
}
```

## 各象限の項目数

- 強み：4〜5項目
- 弱み：3〜4項目
- 機会：3〜4項目
- 脅威：3〜4項目

## 保存先

```
/tmp/research_{業界名}/04_swot.json
```

## 注意事項

- 強み・弱みは**内部環境**（自社・業界プレイヤーに関すること）
- 機会・脅威は**外部環境**（市場動向・社会変化・競合動向）
- 「Webサイトへの打ち出し」は具体的なページ施策・コピー方向性まで落とし込む
- クロス分析（SO/ST/WO/WT）は必ず4つ書く