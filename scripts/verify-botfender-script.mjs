import { readFile } from "node:fs/promises";

const scriptTag = '<script src="https://api-demo.botfenderai.kr:3021/1dba6f43-e141-4072-9d29-3a531d8bf1dc" defer></script>';
const sourcePages = [
  "index.html",
  "about/summary.html",
  "about/history.html",
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

function count(value, needle) {
  return value.split(needle).length - 1;
}

async function main() {
  const errors = [];
  const partial = await readFile("src/partials/head-scripts.html", "utf8").catch(() => "");

  if (!partial.includes(scriptTag)) {
    errors.push("src/partials/head-scripts.html must contain the Botfender script tag");
  }

  for (const page of sourcePages) {
    const sourceHtml = await readFile(page, "utf8");
    if (!sourceHtml.includes("<!-- partial:head-scripts:start -->") || !sourceHtml.includes("<!-- partial:head-scripts:end -->")) {
      errors.push(`${page} is missing head-scripts partial markers`);
    }
    if (sourceHtml.includes(scriptTag)) {
      errors.push(`${page} should not contain the Botfender script directly`);
    }

    const generatedHtml = await readFile(`.generated/${page}`, "utf8").catch(() => "");
    if (generatedHtml && count(generatedHtml, scriptTag) !== 1) {
      errors.push(`.generated/${page} must contain exactly one Botfender script tag`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Botfender script verification failed:\n${errors.join("\n")}`);
  }
}

await main();
