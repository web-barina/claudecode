---
name: 3c-analysis
description: 3C分析サブスキル。marketing-researchスキルのSTEP3として呼び出される。01_market.jsonと02_competitor.jsonを読み込んで生成する。
---

# STEP 3：3C分析

## 入力

- `/tmp/research_{業界名}/01_market.json`（市場調査結果）
- `/tmp/research_{業界名}/02_competitor.json`（競合調査結果）

## 追加Web検索（必要に応じて）

STEP1・2で不足している情報があれば補完検索する（最大3回）。

## 出力構造

```json
{
  "customer": {
    "market_overview": "市場・顧客の全体像（200文字）",
    "key_needs": ["顧客の主要ニーズ（4〜6項目）"],
    "buying_triggers": ["購買・問い合わせのきっかけ（3〜5項目）"],
    "decision_factors": ["選定基準・決め手（3〜5項目）"]
  },
  "competitor": {
    "competitive_landscape": "競合状況の総評（150文字）",
    "market_leaders": ["市場をリードする企業名"],
    "common_strengths": ["競合が共通して持つ強み（3〜4項目）"],
    "common_weaknesses": ["業界全体の弱点・課題（2〜3項目）"],
    "white_space": ["競合が手薄なポジション・ニーズ（2〜3項目）"]
  },
  "company": {
    "differentiation_hints": ["自社（クライアント）が取れる差別化の方向性（3〜5項目）"],
    "entry_warnings": ["参入・強化時の注意点（2〜3項目）"],
    "recommended_positioning": "推奨ポジショニングの方向性（100文字）"
  }
}
```

## 保存先

```
/tmp/research_{業界名}/03_3c.json
```

## 注意事項

- STEP1・2の情報を最大限活用し、新たな検索は補完のみ
- 「Company」はクライアント視点で書く（クライアント情報がない場合は「自社の強みを活かせる方向性」として一般的に記述）