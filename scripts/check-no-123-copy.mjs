import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { load } from "cheerio";

const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name === "index.html") files.push(path);
  }
}
await walk("dist");

const findings = [];
for (const file of files) {
  const route = "/" + relative("dist", file).split(sep).slice(0, -1).join("/") + "/";
  const $ = load(await readFile(file, "utf8"));
  for (const [kind, selector] of [
    ["eyebrow", ".eyebrow, .shower-kicker"],
    ["description", "meta[name='description']"],
    ["paragraph", "main p"],
  ]) {
    $(selector).each((_, element) => {
      const value = (kind === "description" ? $(element).attr("content") : $(element).text())?.replace(/\s+/g, " ").trim() ?? "";
      const unwanted = kind === "paragraph"
        ? route !== "/seo-dashboard/" && /\b(?:Temporary(?: Shower Rental)?|Temp)\s*123\b/i.test(value)
        : /123/.test(value);
      if (unwanted) findings.push({ route, kind, value });
    });
  }
}
const byKind = Object.fromEntries(["eyebrow", "description", "paragraph"].map((kind) => [kind, findings.filter((row) => row.kind === kind).length]));
console.log(JSON.stringify({ pages: files.length, byKind, examples: findings.slice(0, 60), total: findings.length }, null, 2));
if (findings.length) process.exitCode = 1;
