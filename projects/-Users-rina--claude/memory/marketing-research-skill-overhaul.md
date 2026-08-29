---
name: marketing-research-skill-overhaul
description: marketing-research スキルは統合版(v2)。SKILL.md 1本＋scripts/build_excel.py で出力
metadata: 
  node_type: memory
  type: project
  originSessionId: 82bbce4d-21b4-420c-9440-6927b584ecb2
  modified: 2026-08-29T13:09:44.058Z
---

`~/.claude/skills/marketing-research/` は 2026-08-29 に統合版へ改修した。

- **旧**: SKILL.md ＋ サブSKILL.md 8個を逐次 view、中間JSON 7ファイル、Web検索40〜70回。
- **新(v2)**: 手順は `SKILL.md` 1本に集約（サブフォルダ削除）。中間ファイルは `/tmp/research_{業界名}/research.json` 1本。Web検索は市場3〜4・競合4〜5・ニーズ3〜4の計12回前後。SWOT・ペルソナ・ポジショニングは追加検索なしで合成。3C分析は内部利用のみ（シート化しない）。

**出力**（`~/Desktop/`）:
- `marketing_research_{業界名}_{YYYYMMDD}.xlsx` … 7シート（市場調査／競合調査／SWOT／ニーズ①②／ペルソナ／ポジショニング）。PDFテンプレ「ディレクション資料」準拠。ヒアリングシート・制作スケジュール・WFはユーザーが後から追記。
- `positioning_map_{業界名}.png`（シートに貼付）＋ `.svg`

**生成方法**: `python3 scripts/build_excel.py --input <research.json> --outdir ~/Desktop`。openpyxl コードをその場で書かない。記入見本は `templates/research.example.json`。

関連: [[marketing-research-sources-per-sheet]]
