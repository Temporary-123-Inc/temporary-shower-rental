import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { load } from "cheerio";
import { stateGuides } from "../src/stateGuides.ts";
import { statePath } from "../src/statePaths.ts";
import { regionPages } from "../src/regionGuides.tsx";

const pathInDist = (route) =>
  join("dist", ...route.split("/").filter(Boolean), "index.html");
const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
const issues = [];
const intros = new Set();
const focuses = new Set();
const descriptions = new Set();
const serviceAreas = load(await readFile(pathInDist("/service-areas/"), "utf8"));
const cards = load(serviceAreas("#map-state-guides").html() || "");

for (const [state, guide] of Object.entries(stateGuides)) {
  const page = load(await readFile(pathInDist(statePath(state)), "utf8"));
  const intro = normalize(page("main [data-h1-intro]").first().text());
  const description = normalize(page('meta[name="description"]').attr("content"));
  const card = cards("[data-state-guide]").filter(
    (_, node) => cards(node).attr("data-state-guide") === state,
  );
  if (intro !== guide.intro) issues.push(`${state}: state hero differs from its editorial source`);
  if (normalize(card.find("[data-guide-intro]").text()) !== guide.intro)
    issues.push(`${state}: service-area card differs from its state hero`);
  if (normalize(card.find("[data-guide-focus]").text()) !== guide.focus)
    issues.push(`${state}: service-area focus differs from its editorial source`);
  if (!description.includes(state) || !description.toLowerCase().includes("shower"))
    issues.push(`${state}: metadata lacks the state or shower topic`);
  if (/\b(?:kitchen|dishwashing|refrigeration|sleeper|laundry)\b/i.test(intro))
    issues.push(`${state}: off-topic state hero`);
  intros.add(intro);
  focuses.add(guide.focus);
  descriptions.add(description);
}

for (const guide of regionPages) {
  const page = load(await readFile(pathInDist(guide.path), "utf8"));
  const intro = normalize(page("main [data-h1-intro]").first().text());
  if (!intro.startsWith(guide.intro) || !intro.includes(guide.cities[0]))
    issues.push(`${guide.path}: regional hero lacks its own guide and city context`);
}

if (intros.size !== 50) issues.push(`Only ${intros.size} distinct state hero descriptions`);
if (focuses.size !== 50) issues.push(`Only ${focuses.size} distinct state planning focuses`);
if (descriptions.size !== 50)
  issues.push(`Only ${descriptions.size} distinct state meta descriptions`);
console.log(JSON.stringify({ states: 50, regions: regionPages.length, distinctIntros: intros.size, distinctFocuses: focuses.size, distinctMetaDescriptions: descriptions.size, issues: issues.slice(0, 30) }));
if (issues.length) process.exitCode = 1;
