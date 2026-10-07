import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { load } from "cheerio";

const root = "dist";
const htmlFiles = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name === "index.html") htmlFiles.push(path);
  }
}
await walk(root);

const issues = [];
let checked = 0;
let campHeadings = 0;
for (const file of htmlFiles) {
  const path = "/" + relative(root, file).split(sep).slice(0, -1).join("/") + "/";
  const $ = load(await readFile(file, "utf8"));
  const h1 = $("main h1").first();
  const heading = h1.text().replace(/\s+/g, " ").trim();
  if (/\bcamps?\b|basecamps?/i.test(heading)) {
    campHeadings++;
    if (!/\bremote\b/i.test(heading)) issues.push(`${path}: camp H1 lacks Remote: ${heading}`);
  }
  if (path.startsWith("/service-areas/") || ["//", "/home/", "/404/"].includes(path)) continue;
  if (!/^\/(?:services|inventory|equipment-rental|refrigeration)\/|\/services\/$/.test(path) &&
      !/kitchen|dishwash|refrigerat|cooler|freezer|cold storage|camp|shower|restroom|laundry|sleep|bunk|workforce|berthing/i.test(heading)) continue;
  checked++;
  const intro = h1.next("p[data-h1-intro]");
  if (!intro.length) {
    issues.push(`${path}: no paragraph directly after H1: ${heading}`);
    continue;
  }
  const copy = intro.text().replace(/\s+/g, " ").trim();
  const words = copy.split(/\s+/).length;
  if (words < 70 || words > 120) issues.push(`${path}: ${words} words after H1`);
  if (!/Request availability or a project quote\.$/.test(copy))
    issues.push(`${path}: missing final invitation`);
}
const servicePage = load(await readFile(join(root, "services", "index.html"), "utf8"));
for (const name of ["Kitchen Family", "Remote Man Camp Family"])
  if (!servicePage("main").text().includes(name)) issues.push(`/services/: missing ${name}`);

console.log(JSON.stringify({ checked, campHeadings, issues: issues.slice(0, 50), issueCount: issues.length }, null, 2));
if (issues.length) process.exitCode = 1;
