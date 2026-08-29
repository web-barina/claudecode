---
name: marketing-research-sources-per-sheet
description: marketing-research スキルは全シート末尾に「出典・根拠」を必ず入れる
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 82bbce4d-21b4-420c-9440-6927b584ecb2
  modified: 2026-08-29T13:09:28.477Z
---

marketing-research スキルの成果物（Excel／HTML）は、**全セクション・全シートの末尾に「出典・根拠」を必ず記載**すること。市場・競合だけでなく、SWOT・ニーズ①②・ペルソナ・ポジショニングも含む。

**Why:** ユーザー（西川社長の制作会社）がクライアント提出資料として使うため、どのページの情報がどこ由来かを追えないと信頼性が担保できない。テスト運用時に「調べたページの出典も各ページに書いて」と明確に指示があった。

**How to apply:**
- `scripts/build_excel.py` の `_source_footer()` が全シートに1行足す。各STEPで対応キー（`market.sources` / `competitors.sources` / `needs_sources` / `needs_qa[].source` など）を埋める。
- 合成ステップ（SWOT・ペルソナ・ポジショニング）は「市場・競合・3Cの分析結果に基づく（新規調査なし）」と明記する既定文でよい。
- URLは実際にアクセスしたものだけ。推測URLは書かない。
- 詳細は [[marketing-research-skill-overhaul]] の SKILL.md「出典の記載（必須）」節。
