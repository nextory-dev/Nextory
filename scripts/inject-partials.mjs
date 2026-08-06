import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const outDir = ".generated";

const pages = [
  "index.html",
  "about/summary.html",
  "about/history.html",
  "about/certification.html",
  "business/anomix.html",
  "business/botfender.html",
  "business/gaepan.html",
  "business/v-vms.html",
  "business/pentraflow.html",
  "recruitment/recruitment.html",
  "privacy/privacy.html",
  "contact/contact.html",
  "contact/location.html",
  "contact/partner.html",
];

const partials = {
  "head-scripts": await readFile("src/partials/head-scripts.html", "utf8"),
  header: await readFile("src/partials/header.html", "utf8"),
  footer: await readFile("src/partials/footer.html", "utf8"),
};

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await cp("src", join(outDir, "src"), { recursive: true });

function replaceBlock(html, name, content) {
  const start = `<!-- partial:${name}:start -->`;
  const end = `<!-- partial:${name}:end -->`;
  const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`);

  if (!pattern.test(html)) {
    throw new Error(`Missing ${name} partial markers`);
  }

  return html.replace(pattern, `${start}\n${content.trimEnd()}\n    ${end}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const page of pages) {
  const original = await readFile(page, "utf8");
  const updated = Object.entries(partials).reduce(
    (html, [name, content]) => replaceBlock(html, name, content),
    original,
  );
  const outPath = join(outDir, page);

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, updated);
}
