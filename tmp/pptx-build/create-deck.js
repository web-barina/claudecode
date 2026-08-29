const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'OpenAI';
pptx.subject = '中国向けアプリ開発 案件資料';
pptx.title = '中国向けアプリ開発 案件資料';
pptx.company = '案件資料';
pptx.lang = 'ja-JP';
pptx.theme = {
  headFontFace: 'Aptos Display',
  bodyFontFace: 'Aptos',
  lang: 'ja-JP'
};
pptx.defineSlideMaster({
  title: 'MASTER',
  background: { color: 'F7FBFB' },
  objects: [
    { rect: { x: 0, y: 7.25, w: 13.333, h: 0.25, fill: { color: '147D79' }, line: { color: '147D79' } } },
    { text: { text: 'PROJECT BRIEF / 2026', options: { x: 0.55, y: 7.08, w: 3, h: 0.16, fontFace: 'Aptos', fontSize: 7, color: '5D6F79', margin: 0, breakLine: false } } }
  ],
  slideNumber: { x: 12.35, y: 7.05, color: '5D6F79', fontFace: 'Aptos', fontSize: 8 }
});

const C = { ink: '173042', muted: '5D6F79', teal: '147D79', pale: 'D9EFEB', blue: '2468A8', line: 'D5E2E5', white: 'FFFFFF', soft: 'EEF6F5', amber: 'D68A2B' };
const W = 13.333;
function addTitle(slide, kicker, title, subtitle) {
  slide.addText(kicker.toUpperCase(), { x: 0.65, y: 0.42, w: 5, h: 0.22, fontSize: 9, bold: true, color: C.teal, charSpacing: 1.2, margin: 0 });
  slide.addText(title, { x: 0.65, y: 0.72, w: 11.8, h: 0.52, fontSize: 25, bold: true, color: C.ink, margin: 0, fit: 'shrink' });
  if (subtitle) slide.addText(subtitle, { x: 0.65, y: 1.34, w: 11.4, h: 0.38, fontSize: 11, color: C.muted, margin: 0, fit: 'shrink' });
}
function addIcon(slide, x, y, symbol, color = C.teal) {
  slide.addShape(pptx.ShapeType.ellipse, { x, y, w: 0.38, h: 0.38, fill: { color }, line: { color } });
  slide.addText(symbol, { x, y: y + 0.035, w: 0.38, h: 0.22, fontSize: 14, bold: true, color: C.white, align: 'center', margin: 0, breakLine: false });
}
function addBox(slide, x, y, w, h, title, body, accent = C.teal) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.05, fill: { color: C.white }, line: { color: C.line, width: 1 } });
  slide.addShape(pptx.ShapeType.rect, { x, y, w: 0.07, h, fill: { color: accent }, line: { color: accent } });
  slide.addText(title, { x: x + 0.24, y: y + 0.19, w: w - 0.4, h: 0.3, fontSize: 14, bold: true, color: C.ink, margin: 0, fit: 'shrink' });
  slide.addText(body, { x: x + 0.24, y: y + 0.58, w: w - 0.4, h: h - 0.72, fontSize: 10.5, color: C.muted, margin: 0, breakLine: false, fit: 'shrink', valign: 'top' });
}
function addBulletList(slide, items, x, y, w, h, fontSize = 14, color = C.ink) {
  slide.addText(items.map(item => ({ text: item, options: { bullet: { indent: fontSize + 3 }, hanging: 3 } })), { x, y, w, h, fontSize, color, breakLine: true, margin: 0.03, paraSpaceAfterPt: 8, fit: 'shrink', valign: 'top' });
}
function addPill(slide, x, y, w, text, fill = C.pale, color = C.teal) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 0.35, rectRadius: 0.05, fill: { color: fill }, line: { color: fill } });
  slide.addText(text, { x, y: y + 0.07, w, h: 0.17, fontSize: 9.5, bold: true, color, align: 'center', margin: 0, fit: 'shrink' });
}

// 1 cover
{
  const s = pptx.addSlide('MASTER');
  s.background = { color: 'E7F3F1' };
  s.addShape(pptx.ShapeType.rect, { x: 8.6, y: 0, w: 4.733, h: 7.25, fill: { color: C.teal, transparency: 4 }, line: { color: C.teal, transparency: 100 } });
  s.addShape(pptx.ShapeType.ellipse, { x: 9.2, y: 1.0, w: 2.7, h: 2.7, fill: { color: C.white, transparency: 82 }, line: { color: C.white, transparency: 100 } });
  s.addText('PROJECT BRIEF / 2026', { x: 0.75, y: 0.7, w: 4, h: 0.25, fontSize: 11, bold: true, color: C.teal, charSpacing: 1.4, margin: 0 });
  s.addText('コインランドリー利用者向けアプリ\n中国向け新規開発', { x: 0.75, y: 1.55, w: 7.6, h: 1.45, fontSize: 29, bold: true, color: C.ink, margin: 0, breakLine: false, fit: 'shrink', valign: 'mid' });
  s.addText('iOS・Androidを前提に、中国国内での利用に適したアプリを新規開発。日本語対応の窓口と、公開後の保守運用まで対応できる開発会社を求めています。', { x: 0.8, y: 3.45, w: 6.8, h: 0.9, fontSize: 14, color: C.muted, margin: 0, fit: 'shrink' });
  addPill(s, 0.8, 5.15, 1.55, '実施確度：高い'); addPill(s, 2.5, 5.15, 1.65, '日本語対応必須'); addPill(s, 4.3, 5.15, 1.35, '保守運用あり');
  s.addText('QR読み取り  /  電子決済  /  完了通知  /  広告配信', { x: 0.8, y: 6.15, w: 6.8, h: 0.3, fontSize: 11, bold: true, color: C.teal, margin: 0 });
}

// 2 key points
{
  const s = pptx.addSlide('MASTER'); addTitle(s, '01 / AT A GLANCE', 'まず押さえたい条件', '面談前に共有したい、案件の判断材料です。');
  const facts = [['開発費', '上限800万円'], ['保守・運用費', '月額100万円まで'], ['対象OS', 'iOS / Android'], ['紹介希望社数', '5～6社']];
  facts.forEach((f, i) => { const x = 0.65 + i * 3.05; s.addShape(pptx.ShapeType.roundRect, { x, y: 2.0, w: 2.75, h: 1.15, rectRadius: 0.04, fill: { color: C.white }, line: { color: C.line } }); s.addText(f[0], { x: x + 0.2, y: 2.18, w: 2.3, h: 0.2, fontSize: 10, color: C.muted, margin: 0 }); s.addText(f[1], { x: x + 0.2, y: 2.5, w: 2.35, h: 0.3, fontSize: 18, bold: true, color: C.teal, margin: 0, fit: 'shrink' }); });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.65, y: 3.65, w: 12.0, h: 1.05, rectRadius: 0.04, fill: { color: C.soft }, line: { color: C.soft } }); addIcon(s, 0.95, 3.98, '✓'); s.addText('面談で重視されること', { x: 1.48, y: 3.86, w: 3, h: 0.25, fontSize: 13, bold: true, color: C.ink, margin: 0 }); s.addText('日本語で対応できる窓口 / 開発後の保守運用 / 既存アプリの広告配信挙動を確認した見積り', { x: 1.48, y: 4.18, w: 10.5, h: 0.22, fontSize: 12, color: C.muted, margin: 0, fit: 'shrink' });
  addBox(s, 0.65, 5.18, 5.8, 1.35, '案件の温度感', '実施確度は高く、進め方・スケジュールは即時判断。提案書・見積書受領後の比較検討は1週間程度。', C.blue); addBox(s, 6.85, 5.18, 5.8, 1.35, '窓口と検討状況', 'お客様担当者が窓口となり社内でヒアリング。他の開発会社への声がけは現時点でなし。', C.teal);
}

// 3 comment guide
{
  const s = pptx.addSlide('MASTER'); addTitle(s, '02 / COMMENT GUIDE', 'クライアントへのコメント欄 4つのヒント', '対応可能な範囲で、案件に合わせた一言を添えると面談につながりやすくなります。');
  const cards = [['↗', '近い実績を提示', '中国向けアプリ、電子決済、プッシュ通知、海外向けアプリなど、近い領域の事例を一つ。'], ['♡', '課題への理解', '中国当局の規制・商習慣の独自性と、日本語対応窓口が絶対条件であることに触れる。'], ['◇', '解決策をチラ見せ', '中国国内ストアへの登録可否や、対応できるOSの範囲を確認・提案できる姿勢を示す。'], ['＋', '伴走の進め方', '面談で仕様を深掘りして見積り精度を上げ、開発後の保守運用まで対応する流れを伝える。']];
  cards.forEach((c, i) => { const x = 0.65 + (i % 2) * 6.15, y = 2.0 + Math.floor(i / 2) * 2.15; addIcon(s, x + 0.28, y + 0.25, c[0]); s.addText(`POINT 0${i + 1}`, { x: x + 0.85, y: y + 0.29, w: 1.3, h: 0.18, fontSize: 9, bold: true, color: C.teal, margin: 0 }); s.addShape(pptx.ShapeType.roundRect, { x, y, w: 5.7, h: 1.75, rectRadius: 0.04, fill: { color: C.white }, line: { color: C.line } }); s.addText(c[1], { x: x + 0.28, y: y + 0.78, w: 4.9, h: 0.28, fontSize: 16, bold: true, color: C.ink, margin: 0 }); s.addText(c[2], { x: x + 0.28, y: y + 1.16, w: 5.05, h: 0.4, fontSize: 10.5, color: C.muted, margin: 0, fit: 'shrink' }); });
}

// 4 reasons
{
  const s = pptx.addSlide('MASTER'); addTitle(s, '03 / WHY THIS MEETING', '面談をおすすめしたい理由', '開発会社にとって、提案の余地と継続性がある案件です。');
  const items = [['予算規模', '開発費の上限800万円、保守運用費は月額100万円。'], ['継続性', '開発後の保守運用も対応できる会社を希望。継続取引が前提。'], ['仕様確認', '国内版アプリを無料でダウンロードし、実際に操作できる。'], ['実績の裏付け', '同種の自社アプリを日本国内で約6年運用。'], ['判断の速さ', '提案書・見積書受領後の比較検討は1週間程度。'], ['自主検討先なし', '現時点で他の開発会社への声がけはなし。']];
  items.forEach((item, i) => { const x = 0.8 + (i % 2) * 6.05, y = 1.95 + Math.floor(i / 2) * 1.4; addIcon(s, x, y + 0.08, '✓', i === 0 ? C.blue : C.teal); s.addText(item[0], { x: x + 0.58, y, w: 2.1, h: 0.24, fontSize: 14, bold: true, color: C.ink, margin: 0 }); s.addText(item[1], { x: x + 0.58, y: y + 0.38, w: 4.95, h: 0.4, fontSize: 11, color: C.muted, margin: 0, fit: 'shrink' }); });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 6.2, w: 11.7, h: 0.45, rectRadius: 0.03, fill: { color: C.pale }, line: { color: C.pale } }); s.addText('日本国内版を参照しながら要件を確認できるため、初回面談で具体的な提案に進みやすい案件です。', { x: 1.1, y: 6.32, w: 11.1, h: 0.17, fontSize: 11, bold: true, color: C.teal, align: 'center', margin: 0 });
}

// 5 summary and functions
{
  const s = pptx.addSlide('MASTER'); addTitle(s, '04 / PROJECT SUMMARY', '提供したいアプリ体験', '国内で約6年運用しているサービスを、中国の出店店舗向けに展開します。');
  addBox(s, 0.65, 1.95, 5.75, 4.65, '利用フロー', 'QRコードを読み取る\n↓\nコースを選ぶ（洗濯 / 乾燥）\n↓\nアプリで電子決済\n↓\n洗濯完了のプッシュ通知\n↓\n来店・回収', C.teal);
  addBox(s, 6.8, 1.95, 5.85, 2.15, '主な機能', 'QRコード読み取り / コース選択 / 電子決済 / プッシュ通知 / アプリ内広告 / SMS会員登録', C.blue);
  addBox(s, 6.8, 4.35, 5.85, 2.25, '中国向けで確認が必要な点', '中国国内ストアへの登録可否、HarmonyOSを含むOS対応、当局規制、商習慣、中国版の決済サービス。', C.amber);
}

// 6 delivery / resources
{
  const s = pptx.addSlide('MASTER'); addTitle(s, '05 / DELIVERY SCOPE', '開発範囲と確認事項', '既存アプリを活かしつつ、中国向けに必要な仕様を面談で整理します。');
  addBox(s, 0.65, 1.95, 5.8, 4.55, '対応OS・ストア', '・iOS / Androidの2OS前提\n・HarmonyOSを含む複数OSが候補\n・中国国内ストアへの登録を可能な限り検討\n・登録・申請の担当は未確認\n・OS、ストア、規制の調査・提案が必要', C.teal);
  addBox(s, 6.85, 1.95, 5.8, 4.55, 'リソースと責任範囲', '・国内版ソースコードはお客様が所有\n・スクラッチ開発、またはコード共有による開発を想定\n・面談で仕様を深掘りして見積りを提示\n・公開後の保守運用まで対応\n・日本語対応窓口は必須', C.blue);
}

// 7 budget schedule
{
  const s = pptx.addSlide('MASTER'); addTitle(s, '06 / CONDITIONS & SCHEDULE', '予算・進行スケジュール', '納期の指定はありませんが、なるべく早い開発を希望されています。');
  s.addShape(pptx.ShapeType.roundRect, { x: 0.65, y: 1.95, w: 3.25, h: 1.45, rectRadius: 0.04, fill: { color: C.teal }, line: { color: C.teal } }); s.addText('制作予算', { x: 0.95, y: 2.18, w: 2.4, h: 0.2, fontSize: 11, color: C.white, margin: 0 }); s.addText('上限800万円', { x: 0.95, y: 2.55, w: 2.4, h: 0.35, fontSize: 22, bold: true, color: C.white, margin: 0 });
  s.addShape(pptx.ShapeType.roundRect, { x: 4.15, y: 1.95, w: 3.25, h: 1.45, rectRadius: 0.04, fill: { color: C.blue }, line: { color: C.blue } }); s.addText('保守・運用予算', { x: 4.45, y: 2.18, w: 2.5, h: 0.2, fontSize: 11, color: C.white, margin: 0 }); s.addText('月額100万円まで', { x: 4.45, y: 2.55, w: 2.6, h: 0.35, fontSize: 20, bold: true, color: C.white, margin: 0, fit: 'shrink' });
  s.addShape(pptx.ShapeType.roundRect, { x: 7.65, y: 1.95, w: 5.0, h: 1.45, rectRadius: 0.04, fill: { color: C.white }, line: { color: C.line } }); s.addText('予算超過時', { x: 7.95, y: 2.18, w: 2.2, h: 0.2, fontSize: 11, color: C.muted, margin: 0 }); s.addText('2OS開発に本来必要な費用を提示して問題なし', { x: 7.95, y: 2.55, w: 4.25, h: 0.4, fontSize: 14, bold: true, color: C.ink, margin: 0, fit: 'shrink' });
  const steps = [['8/24まで', '日程調整'], ['8/25～8/28', 'Web商談'], ['9/30まで', '提案書・見積書受領'], ['10/10まで', '発注先決定'], ['10/17まで', 'キックオフ'], ['10月末まで', '契約締結']];
  steps.forEach((step, i) => { const x = 0.8 + i * 2.02; s.addShape(pptx.ShapeType.ellipse, { x, y: 4.35, w: 0.3, h: 0.3, fill: { color: C.teal }, line: { color: C.teal } }); if (i < steps.length - 1) s.addShape(pptx.ShapeType.line, { x: x + 0.3, y: 4.5, w: 1.72, h: 0, line: { color: C.line, width: 2 } }); s.addText(step[0], { x: x - 0.15, y: 4.88, w: 1.7, h: 0.2, fontSize: 10, bold: true, color: C.blue, margin: 0 }); s.addText(step[1], { x: x - 0.15, y: 5.2, w: 1.7, h: 0.35, fontSize: 10, color: C.muted, margin: 0, fit: 'shrink' }); });
}

// 8 notes / next action
{
  const s = pptx.addSlide('MASTER'); addTitle(s, '07 / NOTES & NEXT ACTION', '面談前に確認すること', '準備を整えてから面談に進むことで、見積りの精度を高められます。');
  addBox(s, 0.65, 1.95, 5.8, 4.65, '面談前チェック', '✓ 既存アプリをダウンロードして操作\n✓ QR読み取りから完了通知まで確認\n✓ アプリ内広告の挙動を確認\n✓ 日本国内版と中国版の差分を整理\n✓ 対応可能なOS・ストアの範囲を確認\n✓ 日本語窓口と保守体制を提示', C.teal);
  addBox(s, 6.85, 1.95, 5.8, 4.65, '面談で深掘りする論点', '・ソースコード共有の可否と開発方式\n・中国版で採用する決済サービス\n・中国国内ストアの申請主体\n・規制、OS、ストアの最新状況\n・広告配信の要件と遅延対策\n・開発期間、保守範囲、費用内訳', C.amber);
  s.addText('連絡はメール希望 / Web面談 / 希望紹介社数：5～6社', { x: 0.8, y: 6.86, w: 11.8, h: 0.2, fontSize: 11, bold: true, color: C.teal, align: 'center', margin: 0 });
}

// 9 Japan-side concerns
{
  const s = pptx.addSlide('MASTER'); addTitle(s, '08 / JAPAN-SIDE VIEW', '日本企業が感じそうな6つの不安', '案件の事実を、お客様の発注時の心理に置き換えて整理します。');
  const concerns = [['①', '日本版をそのまま使えるか', '流用できる部分、変更が必要な部分、新規調査が必要な部分を整理してほしい。'], ['②', '中国事情を把握できるか', 'OS・ストア・規制を開発開始後に知るのではなく、事前に見通したい。'], ['③', '同じ体験を実現できるか', 'QR読み取りから決済、完了通知までの一連の流れを成立させたい。'], ['④', 'コードなしで見積れるか', '既存アプリを確認し、具体的な質問をしたうえで精度を高めてほしい。'], ['⑤', '日本語で相談できるか', '仕様変更、不具合、規制・ストア問題まで日本語で相談したい。'], ['⑥', '開発後も任せられるか', '公開後の保守運用まで継続して伴走してほしい。']];
  concerns.forEach((c, i) => { const x = 0.65 + (i % 2) * 6.15, y = 1.85 + Math.floor(i / 2) * 1.55; addIcon(s, x, y, c[0], i === 1 || i === 2 ? C.blue : C.teal); s.addText(c[1], { x: x + 0.55, y: y + 0.02, w: 4.7, h: 0.25, fontSize: 13, bold: true, color: C.ink, margin: 0, fit: 'shrink' }); s.addText(c[2], { x: x + 0.55, y: y + 0.4, w: 5.1, h: 0.42, fontSize: 10.5, color: C.muted, margin: 0, fit: 'shrink' }); });
}

// 10 proposal approach
{
  const s = pptx.addSlide('MASTER'); addTitle(s, '09 / PROPOSAL APPROACH', '不安に対して、提案時にどう伝えるか', '「できます」と言い切るより、確認の進め方まで示すことが信頼につながります。');
  const steps = [['1', '差分を整理する', '日本版を確認し、流用・変更・新規調査に切り分ける。'], ['2', '開発会社側で調査する', 'OS・ストア・規制・決済事情を確認し、必要な対応を提案する。'], ['3', 'アプリを実際に確認する', '会員登録、QR、決済、通知、広告、画面構成を事前に確認する。'], ['4', '利用者目線で設計する', '店舗利用時に迷わず、完了までスムーズな体験を目指す。']];
  steps.forEach((item, i) => { const x = 0.65 + i * 3.05; s.addShape(pptx.ShapeType.roundRect, { x, y: 2.0, w: 2.72, h: 3.35, rectRadius: 0.04, fill: { color: i % 2 ? C.white : C.soft }, line: { color: C.line } }); s.addText(item[0], { x: x + 0.25, y: 2.25, w: 0.5, h: 0.4, fontSize: 24, bold: true, color: i === 1 ? C.blue : C.teal, margin: 0 }); s.addText(item[1], { x: x + 0.25, y: 2.95, w: 2.2, h: 0.52, fontSize: 16, bold: true, color: C.ink, margin: 0, fit: 'shrink' }); s.addText(item[2], { x: x + 0.25, y: 3.8, w: 2.2, h: 1.0, fontSize: 11, color: C.muted, margin: 0, fit: 'shrink' }); });
  s.addShape(pptx.ShapeType.roundRect, { x: 1.3, y: 5.85, w: 10.7, h: 0.55, rectRadius: 0.03, fill: { color: C.pale }, line: { color: C.pale } }); s.addText('分からないことを分からないままにせず、確認して明確にする姿勢を伝える。', { x: 1.55, y: 6.02, w: 10.2, h: 0.2, fontSize: 13, bold: true, color: C.teal, align: 'center', margin: 0 });
}

// 11 comment examples
{
  const s = pptx.addSlide('MASTER'); addTitle(s, '10 / COMMENT EXAMPLES', '「この会社なら任せられそう」と思ってもらうコメント例', '今回の案件では、お客様に寄り添う姿勢を軸にした表現が適しています。');
  addBox(s, 0.65, 1.85, 12.0, 1.38, '安心感を重視', '日本国内版アプリを事前に確認したうえで、中国向けに必要な機能・決済・OS・ストア・規制面の差分を整理し、仕様を確認しながら最適な開発方法をご提案します。開発後の保守・運用まで、日本語で継続的にサポートできる体制をご提案します。', C.teal);
  addBox(s, 0.65, 3.48, 12.0, 1.38, '専門性を重視', '中国向けアプリでは、OS・ストア・決済・プッシュ通知・規制などを含めた要件整理が重要です。既存アプリを確認し、日本版から流用できる部分と新規対応が必要な部分を切り分け、開発範囲・費用・スケジュールをご提案します。', C.blue);
  addBox(s, 0.65, 5.11, 12.0, 1.38, 'お客様に寄り添う姿勢を重視', '約6年間運用されている国内版の利用フローを確認し、お客様が大切にされている部分を把握したうえで、中国向けに必要な変更を整理します。技術面だけでなく、仕様確認から保守・運用まで日本語で相談できる体制をご提案します。', C.amber);
}

// 12 integration summary
{
  const s = pptx.addSlide('MASTER'); addTitle(s, '11 / INTEGRATION', 'Azuma資料と統合したときの役割分担', '案件情報に、お客様の不安と解消策を重ねることで、提案の筋道が明確になります。');
  const rows = [['案件情報', '案件の事実・条件・技術面の確認事項'], ['日本企業側の視点', 'その事実から、お客様が何を不安に感じるかを言語化'], ['提案の流れ', '理解する → 整理する → 提案する → 開発する → 保守する'], ['打ち出す価値', '中国向けに必要な情報を整理し、日本語で伴走できること']];
  rows.forEach((row, i) => { const y = 1.85 + i * 1.1; s.addShape(pptx.ShapeType.roundRect, { x: 0.95, y, w: 3.0, h: 0.7, rectRadius: 0.03, fill: { color: i % 2 ? C.blue : C.teal }, line: { color: i % 2 ? C.blue : C.teal } }); s.addText(row[0], { x: 1.15, y: y + 0.22, w: 2.6, h: 0.2, fontSize: 13, bold: true, color: C.white, align: 'center', margin: 0 }); s.addText('→', { x: 4.2, y: y + 0.2, w: 0.5, h: 0.25, fontSize: 20, bold: true, color: C.teal, margin: 0, align: 'center' }); s.addShape(pptx.ShapeType.roundRect, { x: 4.9, y, w: 7.35, h: 0.7, rectRadius: 0.03, fill: { color: C.white }, line: { color: C.line } }); s.addText(row[1], { x: 5.2, y: y + 0.22, w: 6.75, h: 0.2, fontSize: 13, color: C.ink, margin: 0, fit: 'shrink' }); });
  s.addShape(pptx.ShapeType.roundRect, { x: 1.5, y: 6.45, w: 10.3, h: 0.42, rectRadius: 0.03, fill: { color: C.pale }, line: { color: C.pale } }); s.addText('一言でまとめると：「自分たちが分からない中国側の事情も含めて、一緒に整理してくれる会社」', { x: 1.7, y: 6.56, w: 9.9, h: 0.16, fontSize: 10.5, bold: true, color: C.teal, align: 'center', margin: 0, fit: 'shrink' });
}

pptx.writeFile({ fileName: '/Users/rina/.claude/china-app-project-brief.pptx' });
