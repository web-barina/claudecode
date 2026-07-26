---
name: persona
description: ペルソナ設計サブスキル。marketing-researchスキルのSTEP6として呼び出される。3C・ニーズ分析をもとにペルソナを設計する。
---

# STEP 6：ペルソナ設計

## 入力

- `/tmp/research_{業界名}/03_3c.json`（3C分析結果）
- `/tmp/research_{業界名}/05_needs.json`（ニーズ分析結果）

## 目的

調査データをもとに、リアルで具体的なペルソナを1〜2名設計する。
PDFテンプレートの「ペルソナシート」に対応する。

## 出力構造

```json
{
  "personas": [
    {
      "persona_id": 1,
      "name": "架空の名前（例：田中 美咲）",
      "image_description": "どんな見た目・雰囲気か一言",
      "age": "年齢（例：38歳）",
      "gender": "性別",
      "family_structure": "家族構成（例：夫・子供2人の4人家族）",
      "residence": "居住地（例：東京都世田谷区）",
      "occupation": "職業・役職",
      "annual_income": "年収目安",
      "lifestyle": {
        "work_style": "働き方（例：週5日フルタイム・リモート混合）",
        "daily_routine": "生活習慣の特徴",
        "interests": ["趣味・関心（3〜5項目）"],
        "values": "大切にしている価値観"
      },
      "problems": [
        "抱えている課題・悩み（3〜4項目）"
      ],
      "search_situation": "どんな状況でこのサービスを検索するか（具体的シーン）",
      "decision_process": "問い合わせ〜購入までの意思決定プロセス",
      "keywords_used": ["実際に使いそうな検索ワード（3〜5個）"],
      "what_convinces": "何があれば依頼・購入を決めるか",
      "web_design_implication": "このペルソナ向けにサイトで重視すべきこと"
    }
  ]
}
```

## ペルソナ数の目安

- BtoCの場合：2名（メイン1名・サブ1名）
- BtoBの場合：2名（決裁者1名・担当者1名）
- BtoB/BtoC混在の場合：各1名ずつ

## 保存先

```
/tmp/research_{業界名}/06_persona.json
```

## 注意事項

- 統計データ・市場調査結果から導出した「リアルな人物」として設計する
- 名前・年齢・家族構成などは架空だが、行動パターン・悩みは調査結果に基づく
- 「web_design_implication」は必ず書く（サイト設計への直接的示唆を持たせる）