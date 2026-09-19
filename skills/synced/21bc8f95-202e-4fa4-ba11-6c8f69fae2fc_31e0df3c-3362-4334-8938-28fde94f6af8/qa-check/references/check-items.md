# QA チェック項目詳細リファレンス

## SEO チェック：詳細

### タイトルタグ
```python
import re
from html.parser import HTMLParser

def extract_title(html):
    match = re.search(r'<title[^>]*>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
    if not match:
        return None, "❌ titleタグがありません"
    title = match.group(1).strip()
    length = len(title)
    if length < 10:
        return title, f"⚠️ titleが短すぎます（{length}文字 / 推奨: 32〜70文字）"
    if length > 70:
        return title, f"⚠️ titleが長すぎます（{length}文字 / 推奨: 32〜70文字）"
    return title, f"✅ title OK（{length}文字）"
```

### メタディスクリプション
```python
def extract_description(html):
    match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
    if not match:
        # 逆順でも試す
        match = re.search(r'<meta\s+content=["\'](.*?)["\']\s+name=["\']description["\']', html, re.IGNORECASE)
    if not match:
        return None, "❌ meta descriptionがありません"
    desc = match.group(1).strip()
    length = len(desc)
    if length < 50:
        return desc, f"⚠️ descriptionが短すぎます（{length}文字 / 推奨: 70〜120文字）"
    if length > 160:
        return desc, f"⚠️ descriptionが長すぎます（{length}文字 / 推奨: 70〜120文字）"
    return desc, f"✅ description OK（{length}文字）"
```

### OGP タグ
```python
OGP_REQUIRED = ['og:title', 'og:description', 'og:image', 'og:url']
OGP_OPTIONAL = ['og:type', 'og:site_name', 'twitter:card', 'twitter:title']

def check_ogp(html):
    results = {}
    for prop in OGP_REQUIRED + OGP_OPTIONAL:
        pattern = rf'<meta\s+(?:property|name)=["\']({re.escape(prop)})["\'][^>]+content=["\'](.*?)["\']'
        match = re.search(pattern, html, re.IGNORECASE)
        if match:
            results[prop] = ('✅', match.group(2)[:50])
        else:
            # 逆順も試す
            pattern2 = rf'<meta\s+content=["\'](.*?)["\']\s+(?:property|name)=["\']({re.escape(prop)})["\']'
            match2 = re.search(pattern2, html, re.IGNORECASE)
            if match2:
                results[prop] = ('✅', match2.group(1)[:50])
            else:
                if prop in OGP_REQUIRED:
                    results[prop] = ('❌', '未設定')
                else:
                    results[prop] = ('⚠️', '未設定（推奨）')
    return results
```

### 見出し構造
```python
def check_headings(html):
    headings = re.findall(r'<(h[1-6])[^>]*>(.*?)</\1>', html, re.IGNORECASE | re.DOTALL)
    # タグを除去してテキストのみ取得
    cleaned = [(tag, re.sub(r'<[^>]+>', '', text).strip()) for tag, text in headings]
    
    issues = []
    h1_count = sum(1 for tag, _ in cleaned if tag.lower() == 'h1')
    
    if h1_count == 0:
        issues.append("❌ h1タグがありません")
    elif h1_count > 1:
        issues.append(f"⚠️ h1タグが{h1_count}個あります（1ページ1つが推奨）")
    
    # 階層のスキップチェック
    prev_level = 0
    for tag, text in cleaned:
        level = int(tag[1])
        if level > prev_level + 1 and prev_level > 0:
            issues.append(f"⚠️ 見出し階層がスキップされています: h{prev_level} → h{level}（'{text[:20]}'）")
        prev_level = level
    
    return cleaned, issues
```

### robots / canonical
```python
def check_robots_and_canonical(html):
    issues = []
    
    # noindex チェック
    if re.search(r'<meta[^>]*name=["\']robots["\'][^>]*content=["\'][^"\']*noindex', html, re.IGNORECASE):
        issues.append("🔴 robots: noindex が設定されています。本番環境で意図的ですか？")
    
    # canonical チェック
    canonical = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', html, re.IGNORECASE)
    if not canonical:
        issues.append("⚠️ canonical タグがありません（重複コンテンツ対策として推奨）")
    else:
        issues.append(f"✅ canonical: {canonical.group(1)}")
    
    return issues
```

---

## レイアウト・CSS チェック：詳細

### 横スクロール発生リスクパターン
```python
LAYOUT_RISK_PATTERNS = [
    # パターン: (正規表現, 重要度, 説明)
    (r'width\s*:\s*\d{4,}px', 'high', '1000px以上の固定幅が指定されています（画面幅を超える可能性）'),
    (r'width\s*:\s*100vw', 'medium', 'width: 100vw はスクロールバー分だけ横スクロールが発生する場合があります'),
    (r'min-width\s*:\s*\d{4,}px', 'medium', '1000px以上のmin-widthが設定されています'),
    (r'position\s*:\s*absolute', 'low', 'absolute配置の要素があります（はみ出しに注意）'),
    (r'overflow\s*:\s*visible', 'low', 'overflow: visible が明示されています（デフォルトですが意図的か確認）'),
    (r'white-space\s*:\s*nowrap', 'medium', 'white-space: nowrap は長いテキストではみ出す可能性があります'),
    (r'transform\s*:\s*translate', 'low', 'transformを使用しています（配置のズレに注意）'),
    (r'margin-left\s*:\s*-\d+px', 'medium', '負のmarginが使われています（はみ出しリスク）'),
    (r'left\s*:\s*-\d+px', 'medium', '負のleft値が使われています（はみ出しリスク）'),
]

def check_css_layout(css_content):
    issues = []
    lines = css_content.split('\n')
    for i, line in enumerate(lines, 1):
        for pattern, severity, description in LAYOUT_RISK_PATTERNS:
            if re.search(pattern, line, re.IGNORECASE):
                issues.append({
                    'line': i,
                    'severity': severity,
                    'description': description,
                    'code': line.strip()
                })
    return issues

def check_image_responsive(css_content, html_content):
    issues = []
    # img に max-width: 100% が当たっているか
    has_img_maxwidth = bool(re.search(r'img[^{]*\{[^}]*max-width\s*:\s*100%', css_content, re.DOTALL))
    if not has_img_maxwidth:
        # * { box-sizing: border-box } や .img { max-width } など代替も確認
        has_global = bool(re.search(r'(?:\*|img)[^{]*\{[^}]*max-width\s*:\s*100%', css_content, re.DOTALL))
        if not has_global:
            issues.append("⚠️ img に max-width: 100% が設定されていない可能性があります（モバイルではみ出しリスク）")
    
    # viewport meta タグ
    if not re.search(r'<meta[^>]*name=["\']viewport["\']', html_content, re.IGNORECASE):
        issues.append("🔴 viewport meta タグがありません（モバイル表示が崩れます）")
    elif not re.search(r'width=device-width', html_content, re.IGNORECASE):
        issues.append("⚠️ viewport に width=device-width が含まれていません")
    
    return issues
```

---

## アクセシビリティ チェック：詳細

```python
def check_accessibility(html):
    issues = []
    
    # img の alt チェック
    imgs = re.findall(r'<img([^>]*)>', html, re.IGNORECASE)
    missing_alt = []
    for attrs in imgs:
        if 'alt=' not in attrs.lower():
            src = re.search(r'src=["\'](.*?)["\']', attrs)
            missing_alt.append(src.group(1) if src else '(src不明)')
    
    if missing_alt:
        issues.append({
            'severity': 'high',
            'message': f"❌ alt属性がない画像が{len(missing_alt)}枚あります",
            'items': missing_alt[:5]  # 最初の5件のみ表示
        })
    
    # button / a タグにテキストがあるか
    buttons = re.findall(r'<button([^>]*)>(.*?)</button>', html, re.IGNORECASE | re.DOTALL)
    for attrs, content in buttons:
        text = re.sub(r'<[^>]+>', '', content).strip()
        has_aria = 'aria-label=' in attrs.lower()
        if not text and not has_aria:
            issues.append({
                'severity': 'medium',
                'message': f"⚠️ テキストなしのbuttonがあります（aria-labelを追加してください）"
            })
    
    # input に label が紐付いているか（簡易チェック）
    inputs = re.findall(r'<input([^>]*)>', html, re.IGNORECASE)
    for attrs in inputs:
        type_match = re.search(r'type=["\'](.*?)["\']', attrs)
        input_type = type_match.group(1).lower() if type_match else 'text'
        if input_type in ['text', 'email', 'tel', 'password', 'search', 'url']:
            id_match = re.search(r'id=["\'](.*?)["\']', attrs)
            if id_match:
                input_id = id_match.group(1)
                if f'for="{input_id}"' not in html and f"for='{input_id}'" not in html:
                    issues.append({
                        'severity': 'medium',
                        'message': f"⚠️ input#'{input_id}' に対応するlabelが見つかりません"
                    })
    
    return issues
```

---

## パフォーマンス チェック：詳細

```python
def check_performance(html):
    issues = []
    
    # 画像の width/height 属性（CLS防止）
    imgs = re.findall(r'<img([^>]*)>', html, re.IGNORECASE)
    cls_risk = []
    for attrs in imgs:
        has_width = 'width=' in attrs.lower()
        has_height = 'height=' in attrs.lower()
        has_aspect = 'aspect-ratio' in attrs.lower()
        if not (has_width and has_height) and not has_aspect:
            src = re.search(r'src=["\'](.*?)["\']', attrs)
            cls_risk.append(src.group(1) if src else '(src不明)')
    
    if cls_risk:
        issues.append({
            'severity': 'medium',
            'message': f"⚠️ width/height属性がない画像が{len(cls_risk)}枚あります（CLSスコアに影響）",
            'items': cls_risk[:3]
        })
    
    # lazy loading
    non_lazy = [a for a in imgs if 'loading=' not in a.lower()]
    if len(non_lazy) > 3:
        issues.append({
            'severity': 'low',
            'message': f"💡 {len(non_lazy)}枚の画像に loading=\"lazy\" が未設定です（ファーストビュー以外は推奨）"
        })
    
    # render-blocking リソース
    css_links = re.findall(r'<link[^>]*rel=["\']stylesheet["\'][^>]*>', html, re.IGNORECASE)
    scripts_in_head = re.findall(r'<head.*?>(.*?)</head>', html, re.IGNORECASE | re.DOTALL)
    if scripts_in_head:
        sync_scripts = re.findall(r'<script(?![^>]*(async|defer))[^>]*src=', scripts_in_head[0], re.IGNORECASE)
        if sync_scripts:
            issues.append({
                'severity': 'medium',
                'message': f"⚠️ <head>内に同期スクリプトが{len(sync_scripts)}個あります（async/deferを推奨）"
            })
    
    # 外部リソース数
    external_css = [l for l in css_links if 'http' in l]
    if len(external_css) > 3:
        issues.append({
            'severity': 'low',
            'message': f"💡 外部CSSが{len(external_css)}個あります（できれば結合・自己ホスト推奨）"
        })
    
    # Google Fonts の最適化
    if re.search(r'fonts\.googleapis\.com', html):
        if not re.search(r'display=swap', html):
            issues.append({
                'severity': 'medium',
                'message': "⚠️ Google Fontsに &display=swap が設定されていません（FOIT防止のため推奨）"
            })
        if not re.search(r'<link[^>]*rel=["\']preconnect["\'][^>]*fonts\.gstatic\.com', html, re.IGNORECASE):
            issues.append({
                'severity': 'low',
                'message': "💡 fonts.gstatic.com への preconnect が未設定です"
            })
    
    return issues
```

---

## URLからCSSを取得するユーティリティ

```python
import urllib.request
import urllib.parse
import re

def fetch_css_from_html(base_url, html_content):
    """HTMLからCSSのURLを抽出して取得する"""
    css_contents = []
    
    # <link rel="stylesheet"> を全て抽出
    css_hrefs = re.findall(
        r'<link[^>]*rel=["\']stylesheet["\'][^>]*href=["\'](.*?)["\']',
        html_content, re.IGNORECASE
    )
    # 逆順もチェック
    css_hrefs += re.findall(
        r'<link[^>]*href=["\'](.*?)["\'][^>]*rel=["\']stylesheet["\']',
        html_content, re.IGNORECASE
    )
    
    # <style> タグ内のCSSも取得
    inline_styles = re.findall(r'<style[^>]*>(.*?)</style>', html_content, re.DOTALL | re.IGNORECASE)
    for style in inline_styles:
        css_contents.append(('inline', style))
    
    # 外部CSSを取得
    for href in css_hrefs:
        # 相対パスを絶対URLに変換
        if href.startswith('//'):
            url = 'https:' + href
        elif href.startswith('/'):
            parsed = urllib.parse.urlparse(base_url)
            url = f"{parsed.scheme}://{parsed.netloc}{href}"
        elif href.startswith('http'):
            url = href
        else:
            url = urllib.parse.urljoin(base_url, href)
        
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                content = response.read().decode('utf-8', errors='replace')
                css_contents.append((url, content))
        except Exception as e:
            css_contents.append((url, f"/* 取得失敗: {e} */"))
    
    return css_contents
```

---

## レポート生成テンプレート

```python
from datetime import datetime

def generate_report(url, seo_results, layout_results, a11y_results, perf_results):
    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    
    # 問題数カウント
    def count_issues(results, severity='high'):
        return sum(1 for r in results if isinstance(r, dict) and r.get('severity') == severity)
    
    report = f"""# QA チェックレポート

- **対象URL**: {url}
- **チェック日時**: {now}
- **チェック担当**: Claude QA Check スキル

---

## 📊 サマリー

| カテゴリ | 🔴 高 | 🟡 中 | 💡 低 |
|---------|------|------|------|
| SEO | {count_issues(seo_results, 'high')} | {count_issues(seo_results, 'medium')} | {count_issues(seo_results, 'low')} |
| レイアウト | {count_issues(layout_results, 'high')} | {count_issues(layout_results, 'medium')} | {count_issues(layout_results, 'low')} |
| アクセシビリティ | {count_issues(a11y_results, 'high')} | {count_issues(a11y_results, 'medium')} | {count_issues(a11y_results, 'low')} |
| パフォーマンス | {count_issues(perf_results, 'high')} | {count_issues(perf_results, 'medium')} | {count_issues(perf_results, 'low')} |

---

## 詳細結果
（各カテゴリの結果をここに展開）

---

> ⚠️ **注意**: JavaScriptで動的に生成されるコンテンツ（React/Vue等）はHTMLフェッチでは検出できません。
> 動的コンテンツが多いページは、ブラウザでの目視確認も合わせて行ってください。
"""
    return report
```

---

## WordPress サイト向け追加チェック

WordPressサイトの場合、以下も確認する：

1. **テーマCSSの場所**: `wp-content/themes/<theme-name>/style.css`
2. **YoastSEO / RankMath**: プラグインが設定されていればSEOタグは自動生成されるはずなのに未設定の場合、プラグイン設定を確認するよう案内
3. **管理バー**: ログイン中は `#wpadminbar` が追加されて高さが変わるため、非ログイン状態での確認を推奨
4. **プレビューURL**: `?preview=true` パラメータ付きURLはnoindexになることが多いので注意

## LP（ランディングページ）向け追加チェック

1. **CTAボタン**: `<a>` や `<button>` に明確なテキストがあるか
2. **フォーム**: `action` 属性に送信先が設定されているか
3. **プライバシーポリシーリンク**: フォームの近くにリンクがあるか
4. **電話番号**: モバイルで `<a href="tel:...">` になっているか

---

## フォームチェック：詳細

```python
def check_form(html):
    issues = []
    
    # フォームの存在確認
    forms = re.findall(r'<form([^>]*)>(.*?)</form>', html, re.IGNORECASE | re.DOTALL)
    if not forms:
        return issues  # フォームなし
    
    for form_attrs, form_content in forms:
        # tel inputのtype確認
        tel_inputs = re.findall(r'<input([^>]*(?:tel|phone|電話)[^>]*)>', form_content, re.IGNORECASE)
        for attrs in tel_inputs:
            if 'type="tel"' not in attrs.lower() and 'inputmode' not in attrs.lower():
                issues.append({
                    'severity': 'medium',
                    'message': '⚠️ 電話番号入力欄に type="tel" または inputmode="numeric" が未設定（スマホで数字キーボードが出ない）'
                })
        
        # maxlength確認（電話番号13文字制限）
        tel_maxlength = re.search(r'maxlength=["\'](\d+)["\']', ''.join(tel_inputs))
        if tel_inputs and (not tel_maxlength or int(tel_maxlength.group(1)) > 13):
            issues.append({
                'severity': 'medium',
                'message': '⚠️ 電話番号欄のmaxlengthが13以下に設定されていない可能性があります'
            })
        
        # プライバシーポリシーリンクが別タブか
        pp_link = re.search(r'<a[^>]*(?:privacy|プライバシー|個人情報)[^>]*>', form_content, re.IGNORECASE)
        if pp_link and 'target="_blank"' not in pp_link.group(0):
            issues.append({
                'severity': 'medium',
                'message': '⚠️ プライバシーポリシーへのリンクが別タブ（target="_blank"）で開かない設定になっています'
            })
        
        # サンクスページへの遷移設定（action属性やJSで確認）
        action = re.search(r'action=["\'](.*?)["\']', form_attrs)
        if not action:
            issues.append({
                'severity': 'low',
                'message': '💡 フォームのaction属性が未設定です（JS送信の場合は目視確認を）'
            })
    
    return issues
```

---

## 構造化データチェック：詳細

```python
import json

SCHEMA_TYPES = {
    'WebSite': 'TOPページのみ',
    'Organization': 'TOP・会社概要ページ',
    'LocalBusiness': 'TOP・会社概要ページ',
    'AboutPage': '会社概要ページ',
    'ContactPage': 'お問い合わせページ',
    'BreadcrumbList': 'TOPページ以外の全ページ',
    'ProfilePage': '人物情報掲載ページ',
    'Person': '人物情報掲載ページ',
    'Article': '投稿個別記事ページ',
    'FAQPage': 'FAQ掲載ページ',
    'JobPosting': '採用情報ページ',
    'VideoObject': '動画コンテンツ掲載ページ',
    'Event': 'イベント情報掲載ページ',
}

def check_structured_data(html):
    issues = []
    found_types = []
    
    # JSON-LDブロックを全て抽出
    ld_scripts = re.findall(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html, re.IGNORECASE | re.DOTALL
    )
    
    if not ld_scripts:
        issues.append({
            'severity': 'medium',
            'message': '⚠️ 構造化データ（JSON-LD）が見つかりません'
        })
        return issues, found_types
    
    for script in ld_scripts:
        try:
            data = json.loads(script.strip())
            # @graphの場合は展開
            if '@graph' in data:
                items = data['@graph']
            elif isinstance(data, list):
                items = data
            else:
                items = [data]
            
            for item in items:
                schema_type = item.get('@type', '')
                if isinstance(schema_type, list):
                    found_types.extend(schema_type)
                else:
                    found_types.append(schema_type)
        except json.JSONDecodeError as e:
            issues.append({
                'severity': 'high',
                'message': f'🔴 構造化データのJSON形式が不正です: {e}'
            })
    
    # BreadcrumbListは特にチェック
    if 'BreadcrumbList' not in found_types:
        issues.append({
            'severity': 'medium',
            'message': '⚠️ BreadcrumbList（パンくず）の構造化データがありません（TOPページ以外は推奨）'
        })
    
    return issues, found_types
```

---

## CMS・WordPress向けチェック

```python
def check_wordpress_hints(html):
    """WordPressサイトかどうかを判定し、追加チェックのヒントを出す"""
    hints = []
    
    is_wp = bool(re.search(r'wp-content|wp-includes', html))
    if not is_wp:
        return hints
    
    hints.append({'type': 'info', 'message': '📌 WordPressサイトが検出されました'})
    
    # ログインURLのデフォルト使用チェック
    if re.search(r'wp-login\.php', html):
        hints.append({
            'severity': 'low',
            'message': '💡 wp-login.phpへのリンクが検出されました。ログインURLの変更を検討してください（セキュリティ対策）'
        })
    
    # コピーライト年の自動更新チェック（PHPコードはHTMLフェッチでは見えないため案内）
    copyright_match = re.search(r'(?:©|&copy;|copyright)\s*(\d{4})', html, re.IGNORECASE)
    if copyright_match:
        year = copyright_match.group(1)
        from datetime import datetime
        current_year = str(datetime.now().year)
        if year != current_year:
            hints.append({
                'severity': 'medium',
                'message': f'⚠️ コピーライト年が {year} のままです（現在: {current_year}）。PHPで動的に年を出力しているか確認してください'
            })
    
    # アイキャッチの確認案内
    hints.append({
        'severity': 'low',
        'message': '💡 【目視確認】記事一覧でアイキャッチ未設定時のデフォルト画像が設定されているか確認してください'
    })
    
    return hints
```

---

## URLベース URL補完ユーティリティ

```python
import urllib.parse

def resolve_url(base_url, href):
    """相対URLを絶対URLに変換"""
    if not href or href.startswith('data:') or href.startswith('#'):
        return None
    if href.startswith('//'):
        scheme = urllib.parse.urlparse(base_url).scheme
        return f"{scheme}:{href}"
    if href.startswith('http'):
        return href
    return urllib.parse.urljoin(base_url, href)

def extract_all_links(html, base_url):
    """全<a>タグのhrefを収集"""
    hrefs = re.findall(r'<a[^>]*\shref=["\'](.*?)["\']', html, re.IGNORECASE)
    return [resolve_url(base_url, h) for h in hrefs if resolve_url(base_url, h)]

def check_js_only_links(html):
    """JSのみのリンクを検出（SEO的に問題）"""
    issues = []
    # onclick="location.href=..." などのパターン
    js_links = re.findall(r'onclick=["\'][^"\']*(?:location|href|window\.open)[^"\']*["\']', html, re.IGNORECASE)
    # href="javascript:..." のパターン
    js_href = re.findall(r'href=["\']javascript:[^"\']+["\']', html, re.IGNORECASE)
    
    total = len(js_links) + len(js_href)
    if total > 0:
        issues.append({
            'severity': 'high',
            'message': f'🔴 JSのみで実装されたリンクが{total}箇所あります。HTMLの<a href>に変更してください（クローラーが追えません）',
            'items': (js_links + js_href)[:3]
        })
    return issues
```
