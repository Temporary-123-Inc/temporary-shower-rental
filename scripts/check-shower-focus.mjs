import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { load } from "cheerio";
import { stateGuides } from "../src/stateGuides.ts";
import { statePath } from "../src/statePaths.ts";
import { regionPages } from "../src/regionGuides.tsx";
import { reviewedCityPages } from "../src/cityDirectory.ts";

const paths = new Set(["/", "/service-areas/"]);
for (const state of Object.keys(stateGuides)) paths.add(statePath(state));
for (const region of regionPages) {
  paths.add(region.path);
  paths.add(`${region.path}cities/`);
}
for (const city of reviewedCityPages) paths.add(city.path);

const issues = [];
const offTopic = /\b(?:kitchens?|dishwashing|refrigeration|sleepers?|bunkbeds?|laundry)\b/i;
for (const path of paths) {
  const html = await readFile(
    join("dist", ...path.split("/").filter(Boolean), "index.html"),
    "utf8",
  );
  const $ = load(html);
  const main = $("main");
  const h1 = main.find("h1").first().text().replace(/\s+/g, " ").trim();
  const text = main.text().replace(/\s+/g, " ").trim();
  if (!/shower/i.test(h1)) issues.push(`${path}: H1 lacks shower focus: ${h1}`);
  const mention = text.match(offTopic)?.[0];
  if (mention) issues.push(`${path}: main content mentions ${mention}`);
  const offTopicLink = main.find("a[href]").toArray().find((link) =>
    /\b(?:kitchen|dishwashing|refrigeration|sleeper|laundry)\b/i.test(
      $(link).text(),
    ),
  );
  if (offTopicLink)
    issues.push(`${path}: off-topic link ${$(offTopicLink).attr("href")}`);
}

console.log(JSON.stringify({ pages: paths.size, issues: issues.slice(0, 40) }));
if (issues.length) process.exitCode = 1;
