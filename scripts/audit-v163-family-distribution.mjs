import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";

const distDir = path.resolve(process.argv[2] || "dist");
const primaryFamily = "shower";

const htmlFiles = [];
const visit = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(absolute);
    else if (entry.name === "index.html") htmlFiles.push(absolute);
  }
};
visit(distDir);

const canonicalPath = ($, file) => {
  const canonical = $('link[rel="canonical"]').attr("href");
  if (canonical) return new URL(canonical).pathname;
  const relative = path.relative(distDir, path.dirname(file)).replaceAll("\\", "/");
  return relative ? `/${relative}/` : "/";
};

const familyFromText = (value = "") => {
  const text = value.toLowerCase();
  if (
    /shower and restroom|shower.*restroom.*combination|shower-restroom|combination-trailer|ada[- ]combination|ada shower/.test(
      text,
    )
  )
    return "shower-restroom-combination";
  if (/commercial kitchen|kitchen emergency|mobile kitchen/.test(text))
    return "mobile-commercial-kitchen";
  if (/dishwash/.test(text)) return "commercial-dishwashing";
  if (/refrigerat|cold storage/.test(text)) return "refrigerated";
  if (/laundry/.test(text)) return "laundry";
  if (/sleeper|bunk-bed|bunkbed|berthing/.test(text)) return "sleeper-bunkhouse";
  if (/shower trailer|shower container|shower-only/.test(text)) return "shower";
  if (/man camp|workforce housing/.test(text)) return "remote-man-camp-workforce-housing";
  if (/remote basecamp|base camp temporary housing/.test(text)) return "remote-basecamp";
  if (/restroom|bathroom/.test(text)) return "restroom-bathroom";
  return "unclassified";
};

const roleFor = (family) => (family === primaryFamily ? "primary" : "supporting");
const ratio = (primary, total) => (total ? Number(((primary / total) * 100).toFixed(2)) : 0);
const familyCounts = (pages) =>
  pages.reduce((counts, page) => {
    counts[page.family] = (counts[page.family] || 0) + 1;
    return counts;
  }, {});

const plannedPath = (route) =>
  route === "/" ||
  /^\/service-areas\/[a-z0-9-]+\/$/.test(route) ||
  /^\/service-areas\/[a-z0-9-]+\/[a-z0-9-]+\/$/.test(route);

const renderedPages = htmlFiles
  .map((file) => {
    const $ = load(fs.readFileSync(file, "utf8"));
    const route = canonicalPath($, file);
    const h1 = $("main h1").first().text().replace(/\s+/g, " ").trim();
    return {
      file,
      route,
      h1,
      family: familyFromText(h1),
      robots: $('meta[name="robots"]').attr("content") || "index,follow",
      $,
    };
  })
  .filter(({ route }) => route !== "/404/");

const planPages = renderedPages.filter(({ route }) => plannedPath(route));
const familySpecificCommercialPages = renderedPages.filter(
  ({ family }) => family !== "unclassified",
);
const sitemap = fs.readFileSync(path.join(distDir, "sitemap.xml"), "utf8");
const releasedPaths = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname),
);
const releasedPages = planPages.filter(({ route }) => releasedPaths.has(route));

const summarize = (pages) => {
  const primary = pages.filter(({ family }) => family === primaryFamily).length;
  return {
    total: pages.length,
    primary,
    supporting: pages.length - primary,
    primaryPercent: ratio(primary, pages.length),
    supportingPercent: ratio(pages.length - primary, pages.length),
    byFamily: familyCounts(pages),
  };
};

const home = renderedPages.find(({ route }) => route === "/");
const homeModules = (kind) => {
  const selector = kind === "content" ? "[data-family-content]" : "[data-family-visual]";
  const marked = home.$(`main ${selector}`)
    .toArray()
    .map((node) => ({
      family: home.$(node).attr("data-family") || "unclassified",
      role: home.$(node).attr("data-family-role") || "unclassified",
    }));
  if (marked.length) return marked;

  const fallback = [{ family: "shower", role: "primary" }];
  home.$("main .shower-unit-card").each((_, node) => {
    const family = familyFromText(home.$(node).text());
    fallback.push({ family, role: roleFor(family) });
  });
  return fallback;
};

const summarizeHome = (modules) => {
  const primary = modules.filter(({ role }) => role === "primary").length;
  return {
    total: modules.length,
    primary,
    supporting: modules.length - primary,
    primaryPercent: ratio(primary, modules.length),
    supportingPercent: ratio(modules.length - primary, modules.length),
    byFamily: modules.reduce((counts, module) => {
      counts[module.family] = (counts[module.family] || 0) + 1;
      return counts;
    }, {}),
  };
};

const alignmentViolations = [];
for (const page of planPages.filter(({ route }) => route !== "/")) {
  const { $, route, h1, family } = page;
  const title = $("title").text().trim();
  const description = $('meta[name="description"]').attr("content") || "";
  const intro = $("[data-h1-intro]").first().text().replace(/\s+/g, " ").trim();
  const imageFamily = $("[data-image-family]").first().attr("data-image-family") || "";
  const caption = $("figcaption[data-carousel-caption]").first().text().replace(/\s+/g, " ").trim();
  const schemas = $('script[type="application/ld+json"]').text();
  const checks = {
    oneH1: $("main h1").length === 1,
    titleStartsWithH1: title.startsWith(h1),
    descriptionAligned: familyFromText(description) === family,
    openingAligned: familyFromText(intro) === family,
    imageAligned: familyFromText(`${imageFamily} ${caption}`) === family,
    schemaNamesH1: schemas.includes(`\"name\":\"${h1.replaceAll('"', '\\"')}\"`),
  };
  const failed = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
  if (failed.length) alignmentViolations.push({ route, h1, family, failed, imageFamily });
}

const homepageViolations = [];
home.$("main [data-family-content]").each((_, node) => {
  const block = home.$(node);
  const family = block.attr("data-family") || "unclassified";
  const detected = familyFromText(block.text());
  if (detected !== family)
    homepageViolations.push({ kind: "content", family, detected, text: block.text().trim().slice(0, 140) });
});
home.$("main [data-family-visual]").each((_, node) => {
  const block = home.$(node);
  const family = block.attr("data-family") || "unclassified";
  const detected = familyFromText(`${block.find("img").attr("alt") || ""} ${block.find("figcaption").text()}`);
  if (detected !== family)
    homepageViolations.push({ kind: "visual", family, detected, text: block.text().trim().slice(0, 140) });
});

const content = summarizeHome(homeModules("content"));
const visual = summarizeHome(homeModules("visual"));
const fullPlan = summarize(planPages);
const completeCommercialInventory = summarize(familySpecificCommercialPages);
const released = summarize(releasedPages);
const inBand = (value) => value >= 75 && value <= 85;

const report = {
  generatedAt: new Date().toISOString(),
  distDir,
  methodology: {
    primaryFamily,
    completeCommercialInventory: "Every rendered canonical route whose H1 resolves to one approved equipment family. Protected legacy routes remain inventoried even when they are outside the controlled index-ready rollout.",
    fullPlan: "Controlled V16.3 rebuild cohort: homepage plus rendered state and regional service-area landing pages. Every other rendered route is still recorded in routeClassifications with an explicit scope and reason.",
    released: "V16.3 full-plan routes present in the generated XML sitemap.",
    homepage: "Independently tagged substantive family content modules and family visual modules inside main; shared responsive DOM is later checked for visibility at desktop and mobile widths.",
  },
  routeInventory: {
    rendered: renderedPages.length,
    sitemap: releasedPaths.size,
    fullPlan: fullPlan.total,
    releasedPlan: released.total,
    familySpecificCommercial: completeCommercialInventory.total,
  },
  completeCommercialInventory,
  fullPlan,
  released,
  homepage: { content, visual },
  gates: {
    fullPlanPrimaryInBand: inBand(fullPlan.primaryPercent),
    releasedPrimaryInBand: inBand(released.primaryPercent),
    homepageContentPrimaryInBand: inBand(content.primaryPercent),
    homepageVisualPrimaryInBand: inBand(visual.primaryPercent),
    strictAlignment: alignmentViolations.length === 0,
    homepageModuleAlignment: homepageViolations.length === 0,
  },
  alignmentViolations,
  homepageViolations,
  routeClassifications: renderedPages.map(({ route, h1, family, robots }) => ({
    route,
    h1,
    family,
    role: family === "unclassified" ? null : roleFor(family),
    scope: plannedPath(route)
      ? "controlled-plan"
      : family === "unclassified"
        ? "non-family-specific"
        : "protected-existing-commercial",
    includedInCompleteCommercialInventory: family !== "unclassified",
    includedInControlledPlan: plannedPath(route),
    reason: plannedPath(route)
      ? "Approved controlled homepage/state/region rebuild cohort."
      : family === "unclassified"
        ? "Rendered canonical is utility, legal, contact, navigation, editorial, or a generic hub whose H1 does not claim one equipment family."
        : "Public family-specific legacy canonical preserved at its existing path and recorded separately from the controlled index-ready rollout.",
    robots,
  })),
};

const serialized = `${JSON.stringify(report, null, 2)}\n`;
const outputFlag = process.argv.indexOf("--output");
if (outputFlag !== -1) {
  const outputPath = process.argv[outputFlag + 1];
  if (!outputPath) throw new Error("--output requires a file path");
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(path.resolve(outputPath), serialized, "utf8");
}
console.log(serialized.trimEnd());
if (process.argv.includes("--check") && Object.values(report.gates).some((passed) => !passed)) {
  process.exitCode = 1;
}
