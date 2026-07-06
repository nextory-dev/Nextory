import { readFile } from "node:fs/promises";

const html = await readFile("about/summary.html", "utf8");
const required = [
  'class="section-2 competitiveness-section"',
  'class="competitiveness-card is-active"',
  '네스토리의 <span class="title-underline">경쟁력</span>',
  "AI 기반 보안 플랫폼",
  "관계 인텔리전스",
  "Relationship Intelligence",
  "통합 보안 역량",
  "AI 자동화",
  "종합 사이버보안 포트폴리오",
  'class="ai-security-company-section"',
  'class="company-overview"',
  'class="company-story-list"',
  'AI-Native로 보안의 <span class="overview-moving-underline">새로운 기준</span>을 만드는 기업,</span><br />주식회사 네스토리',
  'class="story-kicker">Security Shift</span>',
  'class="story-kicker">AI-Native Intelligence</span>',
  'class="story-kicker">Platform Vision</span>',
  '<span class="story-moving-underline">새로운 공격 방식</span>',
  '<span class="story-moving-underline">보안 이벤트의 관계</span>',
  '<span class="story-moving-underline">플랫폼 기업</span>',
  'class="story-title-nowrap"',
  "Behavior Intelligence",
  "AI 기반 행위 분석",
  "차세대 AI-Native 보안 플랫폼",
  'class="business-fields-section"',
  'class="business-fields-grid"',
  '<span class="title-underline">핵심 사업 분야</span>',
  "AI 기반 이상행위 탐지",
  "관계 기반(Relationship Intelligence) 위협 분석",
  "악성 봇 및 매크로 차단",
  "AI Agent 및 LLM 크롤러 대응",
  "보안 취약점 통합 관리",
  "웹·모바일 애플리케이션 모의해킹 취약점 진단 및 관리",
  '<script type="module" src="/src/js/summary.js"></script>',
  "우리의 비전",
  "AI가 보안을 이해하고",
  "AI-Native Security Intelligence",
  "Web & API Security",
  "Vulnerability Management",
  "Security Assessment",
  "AI-Native Security Platform",
  "글로벌 시장",
];

const missing = required.filter((text) => !html.includes(text));
const forbidden = [
  'class="vision-capabilities"',
  'class="positioning-hero"',
  'class="positioning-layout"',
  'class="positioning-aside"',
  'class="section-1"',
  'class="story-meta"',
  "AI Intelligence</em>",
  "AI 기반 분석과 판단으로 보안 운영의 정확도와 대응 속도를 높입니다.",
  "<section>\n            경쟁력\n          </section>",
];
const present = forbidden.filter((text) => html.includes(text));
const cardCount = (html.match(/class="competitiveness-card/g) || []).length;
const businessFieldCount = (html.match(/class="business-field-card/g) || []).length;
const companyStoryCount = (html.match(/class="company-story-item/g) || []).length;
const companySectionIndex = html.indexOf('class="ai-security-company-section"');
const businessFieldsIndex = html.indexOf('class="business-fields-section"');

if (missing.length > 0) {
  throw new Error(`summary vision content is missing: ${missing.join(", ")}`);
}

if (cardCount !== 5) {
  throw new Error(`summary competitiveness section must have 5 cards, found ${cardCount}`);
}

if (businessFieldCount !== 4) {
  throw new Error(`summary business fields section must have 4 cards, found ${businessFieldCount}`);
}

if (companyStoryCount !== 3) {
  throw new Error(`summary company story section must have 3 story items after overview, found ${companyStoryCount}`);
}

if (companySectionIndex === -1 || businessFieldsIndex === -1 || companySectionIndex > businessFieldsIndex) {
  throw new Error("summary company positioning section must appear before business fields section");
}

if (present.length > 0) {
  throw new Error(`summary vision content should not include removed capability list: ${present.join(", ")}`);
}
