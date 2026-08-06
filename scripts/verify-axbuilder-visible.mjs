import { readFile } from "node:fs/promises";

const files = {
  header: await readFile("src/partials/header.html", "utf8"),
  index: await readFile("index.html", "utf8"),
  contact: await readFile("contact/contact.html", "utf8"),
};

const expectations = [
  ["desktop header AX Builder menu is visible", !files.header.includes('<li class="submenu-group" hidden>')],
  ["main page AX Builder section is visible", !files.index.includes('business-content container flex-column-reverse row-gap-5 flex-md-row row-gap-md-0" hidden')],
  ["contact AX Builder option is selectable", !files.contact.includes('value="AX Builder" hidden disabled')],
];

const failures = expectations.filter(([, passed]) => !passed);

if (failures.length > 0) {
  console.error("AX Builder visibility verification failed:");
  for (const [message] of failures) {
    console.error(`- ${message}`);
  }
  process.exit(1);
}

console.log("AX Builder visibility verification passed.");
