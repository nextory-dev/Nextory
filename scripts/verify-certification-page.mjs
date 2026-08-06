import { access, readFile } from "node:fs/promises";

const html = await readFile("about/certification.html", "utf8");
const scss = await readFile("src/scss/certification.scss", "utf8");

const renderedAssets = [
  "src/assets/img/certification/excellent-tech-certificate-1.png",
  "src/assets/img/certification/excellent-tech-certificate-2.png",
  "src/assets/img/certification/excellent-tech-certificate-3.png",
  "src/assets/img/certification/corporate-research-institute-1.png",
  "src/assets/img/certification/botfender-gs-certificate-1.png",
  "src/assets/img/certification/botfender-patent-certificate-1.png",
  "src/assets/img/certification/copyright-registration-1.png",
];

const assetChecks = await Promise.all(
  renderedAssets.map((path) => access(path).then(() => true, () => false)),
);

const issuedDates = [...html.matchAll(/<td[^>]*>(\d{4}-\d{2}-\d{2})<\/td>/g)].map((match) => match[1]);
const sortedIssuedDatesDesc = [...issuedDates].sort().reverse();

const expectations = [
  ["certification.js is not loaded", !html.includes("/src/js/certification.js")],
  ["preview UI is removed", !html.includes("certificate-preview") && !html.includes("data-certificate-modal") && !html.includes("data-view-button")],
  ["certification table exists", html.includes('class="certification-table"') && html.includes("<table")],
  ["table has requested columns", ["인증명", "제품명/기술명", "등급", "발급일", "인증기관"].every((label) => html.includes(label))],
  ["table includes all certificate rows", (html.match(/<tr>/g) || []).length >= 8],
  ["excellent tech certificates are listed separately", ["Botfender AI V2.0 Manager Server", "Botfender AI V2.0 Service", "Botfender AI V2.0 Web Server"].every((name) => html.includes(name))],
  ["excellent tech certificates use first certification date", (html.match(/<td[^>]*>2026-08-04<\/td>/g) || []).length === 3],
  ["corporate research institute uses first recognition date", /<td[^>]*>2024-08-05<\/td>/.test(html)],
  ["certificates are sorted by issue date descending", issuedDates.length >= 7 && issuedDates.every((date, index) => date === sortedIssuedDatesDesc[index])],
  ["new PDF render assets exist", assetChecks.every(Boolean)],
  ["screen does not render certificate images", !html.includes("<img src=\"/src/assets/img/certification/")],
  ["table styles exist", scss.includes(".certification-table")],
  ["mobile rows expose labels", (html.match(/data-label="인증명"/g) || []).length >= 7 && ["data-label=\"제품명/기술명\"", "data-label=\"등급\"", "data-label=\"발급일\"", "data-label=\"인증기관\""].every((label) => html.includes(label))],
  ["mobile layout stacks table rows", scss.includes("@media (max-width: 768px)") && scss.includes("thead") && scss.includes("display: none") && scss.includes("grid-template-columns: 6rem minmax(0, 1fr)") && scss.includes("content: attr(data-label)")],
  ["mobile font size is readable", scss.includes("font-size: 1.05rem") && scss.includes("font-size: 1rem")],
  ["table uses black and white theme", scss.includes("background: #050505") && scss.includes("background: #151515") && scss.includes("color: #f5f5f5") && !scss.includes("#111a2a")],
];

const failures = expectations.filter(([, passed]) => !passed);

if (failures.length > 0) {
  console.error("Certification page verification failed:");
  for (const [message] of failures) {
    console.error(`- ${message}`);
  }
  process.exit(1);
}

console.log("Certification page verification passed.");
