---
name: market-research
description: 市場調査サブスキル。marketing-researchスキルのSTEP1として呼び出される。単体でも「市場調査だけして」と言われたときに使う。
---

# STEP 1：市場調査

## 入力

- `業界名` / `サービス名`（オーケストレーターから引き継ぎ）

## 目的

日本国内の指定業界について、市場の全体像を把握する。

## 検索クエリ（最低6回、必要なら10回まで）

```
「{業界名} 市場規模 日本 2024 2025」
「{業界名} 業界 特徴 慣習 商習慣」
「{業界名} 価格帯 相場 料金」
「{業界名} 流通 提供方法 チャネル」
「{業界名} 販売促進 集客 マーケティング」
「{業界名} トレンド 動向 2024 2025」
「{業界名} 顧客層 ターゲット BtoB BtoC」
```

## 出力項目

以下を調査してJSONに保存する：

```json
{
  "industry": "業界名",
  "analyzed_at": "YYYY-MM-DD",
  "industry_definition": "業界の定義・どんなサービス・商品があるか（200文字程度）",
  "service_categories": [
    {
      "category": "カテゴリ名",
      "description": "概要",
      "delivery_form": "提供形態"
    }
  ],
  "industry_norms": [
    "業界の慣習・商習慣を箇条書き（5〜8項目）"
  ],
  "price_ranges": [
    {
      "service_type": "サービス種別",
      "price_range": "¥〇〇〜¥〇〇",
      "notes": "備考"
    }
  ],
  "distribution_methods": [
    "流通・提供方法（3〜5項目）"
  ],
  "promotion_methods": [
    "販売促進方法（4〜6項目）"
  ],
  "customer_segments": {
    "btob_or_btoc": "BtoB / BtoC / 両方",
    "characteristics": "ターゲット層の特徴（150文字程度）"
  },
  "trends": [
    "トレンド・動向（4〜6項目）"
  ],
  "market_size": "市場規模（わかる範囲で）",
  "sources": ["参考URL"]
}
```

## 保存先

```
/tmp/research_{業界名}/01_market.json
```

## 注意事項

- 価格は必ず円単位で具体的な数字を出す（「要問い合わせ」のみは避ける）
- 日本国内の情報に絞る
- 複数ソースで裏取りする