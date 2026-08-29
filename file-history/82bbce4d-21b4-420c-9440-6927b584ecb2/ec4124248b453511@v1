---
name: marketing-research
description: |
  「○○業界を分析して」「○○のマーケティング調査をして」「○○で競合調査から分析まで全部やって」と言われたら必ずこのスキルを使うこと。
  業界名・サービス名を受け取り、市場調査→競合調査→3C分析→SWOT分析→ニーズ分析→ペルソナ設計→ポジショニングマップの7ステップを自動で順番に実行し、最後にExcelファイルにまとめて出力する。
  競合会社を事前に指定するパターン（「競合はA社・B社・C社で分析して」）にも対応する。
  「LP作るから分析して」「Webサイトリニューアルの前に市場を調べて」なども含め、マーケティングリサーチ全般に対してこのスキルを積極的に使うこと。
---

# マーケティングリサーチ統合スキル

## 概要

業界・サービス名を入力として受け取り、7つの分析を順番に自動実行し、Excelレポートにまとめる。

## ディレクトリ構成
marketing-research/
├── SKILL.md                  ← このファイル（オーケストレーター）
├── 01_market-research/       ← 市場調査
├── 02_competitor-research/   ← 競合調査
├── 03_3c-analysis/           ← 3C分析
├── 04_swot-analysis/         ← SWOT分析
├── 05_needs-analysis/        ← ニーズ分析
├── 06_persona/               ← ペルソナ設計
├── 07_positioning-map/       ← ポジショニングマップ
└── 08_export/                ← Excel統合出力

## 入力パターン

### パターンA：業界名のみ
「○○業界を分析して」
「○○でフルで調査して」
→ 競合企業はWeb検索で自動選定（中小企業中心に6社）

### パターンB：競合会社を事前指定
「○○業界を分析して。競合はA社・B社・C社で」
「競合をX社とY社に絞って○○の分析をして」
→ 指定された会社を競合調査の対象にする（不足分は自動補完）

## 実行フロー
START
↓
[入力解析] 業界名・サービス名・競合指定を抽出
↓
STEP 1: 市場調査       → /tmp/research_{業界名}/01_market.json に保存
↓
STEP 2: 競合調査       → /tmp/research_{業界名}/02_competitor.json に保存
↓
STEP 3: 3C分析        → /tmp/research_{業界名}/03_3c.json に保存
↓
STEP 4: SWOT分析      → /tmp/research_{業界名}/04_swot.json に保存
↓
STEP 5: ニーズ分析     → /tmp/research_{業界名}/05_needs.json に保存
↓
STEP 6: ペルソナ設計   → /tmp/research_{業界名}/06_persona.json に保存
↓
STEP 7: ポジショニング → /tmp/research_{業界名}/07_positioning.json に保存
↓
STEP 8: Excel出力      → ~/Desktop/marketing_research_{業界名}.xlsx
↓
END

## 各ステップの実行方法

各ステップでは対応するサブスキルの SKILL.md を `view` してから実行する。
STEP 1: view ~/.claude/skills/marketing-research/01_market-research/SKILL.md
STEP 2: view ~/.claude/skills/marketing-research/02_competitor-research/SKILL.md
STEP 3: view ~/.claude/skills/marketing-research/03_3c-analysis/SKILL.md
STEP 4: view ~/.claude/skills/marketing-research/04_swot-analysis/SKILL.md
STEP 5: view ~/.claude/skills/marketing-research/05_needs-analysis/SKILL.md
STEP 6: view ~/.claude/skills/marketing-research/06_persona/SKILL.md
STEP 7: view ~/.claude/skills/marketing-research/07_positioning-map/SKILL.md
STEP 8: view ~/.claude/skills/marketing-research/08_export/SKILL.md

## ユーザーへの進捗報告

各ステップ開始時に必ず一言報告する：
🔍 STEP 1/7 市場調査を開始します...
✅ STEP 1/7 市場調査 完了
🔍 STEP 2/7 競合調査を開始します...（競合：A社・B社・C社）
...
📊 全7ステップ完了。Excelファイルを出力中...
✅ 分析完了！ファイルを出力しました。

## 作業ディレクトリ

各ステップのJSON中間ファイルは `/tmp/research_{業界名}/` に保存する。
業界名はスペースをアンダースコアに変換する（例：「Webデザイン」→ `research_Webデザイン`）。

## エラーハンドリング

- Web検索で情報が少ない業界の場合：「情報が少ない業界のため、一部推定が含まれます」と明記して続行
- 競合企業が指定数に満たない場合：自動補完して続行
- 各ステップでエラーが出た場合：エラー内容を報告し、次のステップに進む（スキップして全体を止めない）