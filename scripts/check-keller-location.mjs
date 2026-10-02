import assert from "node:assert/strict";
import { readFile, writeFile, access, mkdir, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { load } from "cheerio";

const path = "/service-areas/texas/north-texas/keller/";
const html = await readFile(`dist${path}index.html`, "utf8");
const $ = load(html);
assert.equal($("h1").length, 1);
assert.equal($("h1").text(), "Shower Trailer Rental in Keller, TX");
assert.equal($("title").text(), "Shower Trailer Rental in Keller, TX | Mobile Shower Trailer Rental");
assert.equal($("meta[name=description]").attr("content"), "Shower trailers delivered from Keller, TX to job sites across Texas and nationwide. GPS-tracked delivery nationwide. Call (972) 544-6598.");
assert.equal($("[data-h1-intro]").text(), "Mobile Shower Trailer Rental delivers shower trailers from our Keller, TX yard to construction sites, events, renovations and emergency response operations across Texas and nationwide. GPS-tracked delivery nationwide. Call (972) 544-6598 for sizing and delivery times.");
assert.equal($("link[rel=canonical]").attr("href"), `https://temporary-shower-rental.com${path}`);
assert.ok($("address").text().includes("1710 Keller Pkwy #4114, Keller, TX 76248"));
const phones = $("a[href^='tel:']").map((_, el) => $(el).attr("href")).get();
assert.ok(phones.length >= 7);
assert.deepEqual([...new Set(phones)], ["tel:+19725446598"]);
assert.doesNotMatch(html, /888.{0,8}385|866.{0,8}455|\[TO FILL\]|\[delivery time\]|\[lead time\]/);
assert.ok($("iframe").attr("src").includes("0x864dd770afc0e903%3A0x4e58a264201f8b55"));
assert.equal($("a[href='https://g.page/r/CVWLHyBkolhOECE/review']").length, 1);
assert.equal($(".keller-actions a[href='/contact-us/?location=Keller%2C%20TX']").length, 2);
const graph = JSON.parse($("script[type='application/ld+json']").text())["@graph"];
const business = graph.find(node => node["@type"] === "LocalBusiness");
assert.equal(business.name, "Mobile Shower Trailer Rental");
assert.equal(business.telephone, "+19725446598");
assert.equal(business.address.streetAddress, "1710 Keller Pkwy #4114");
assert.equal(business.openingHours, "Mo-Su 00:00-24:00");
assert.equal(business.hasMap, "https://maps.google.com/?cid=5645440683828284245");
assert.equal(business.url, `https://temporary-shower-rental.com${path}`);
assert.equal(business.email, undefined);
assert.deepEqual(business.sameAs, [
  "https://www.facebook.com/mobileshowertrailerrental",
  "https://www.youtube.com/@temporaryshowerrental123",
]);
assert.equal($(".keller-business a[href='https://www.facebook.com/mobileshowertrailerrental']").text(), "Facebook ↗");
assert.equal($(".keller-business a[href='https://www.youtube.com/@temporaryshowerrental123']").text(), "YouTube ↗");
const faqs = graph.find(node => node["@type"] === "FAQPage").mainEntity;
assert.equal(faqs.length, 5);
$(".keller-faqs details").each((i, detail) => {
  assert.equal($(detail).find("summary").text(), faqs[i].name);
  assert.equal($(detail).find("p").text(), faqs[i].acceptedAnswer.text);
});
const targets = [...new Set($("main a[href^='/']").map((_, el) => $(el).attr("href").split(/[?#]/)[0]).get())];
for (const target of targets) await access(`dist${target}index.html`);
assert.equal($(".keller-equipment a").length, 7);
const parent = await readFile("dist/service-areas/texas/north-texas/index.html", "utf8");
assert.ok(parent.includes(`href="${path}"`));
const directory = load(await readFile("dist/service-areas/index.html", "utf8"));
const texas = directory(".map-location-grid > div").filter((_, el) => directory(el).find("summary").text() === "Regions and cities in Texas");
assert.equal(
  texas
    .find("li")
    .filter((_, el) => directory(el).children("a").text() === "North Texas")
    .find(`ul a[data-directory-city][href='${path}']`)
    .text(),
  "Keller, Texas",
);
assert.equal(
  texas.find(`> ul > li > a[data-directory-city][href='${path}']`).length,
  0,
  "Keller should be nested under North Texas, not listed as a Texas-level sibling",
);
assert.equal(directory(`[data-map-city-state='Texas'] a[href='${path}']`).length, 1);
const cityDirectory = load(await readFile("dist/service-areas/texas/north-texas/cities/index.html", "utf8"));
assert.equal(cityDirectory(`a[data-city-name='keller']`).attr("href"), path);
const photos = $(".keller-photos img").toArray();
assert.equal(photos.length, 6);
assert.equal($("#keller-photos-title").text(), "Shower Trailer and Container Photos");
assert.doesNotMatch($("#keller-photos-title").parent().text(), /verified|archive-matched reference/i);
assert.deepEqual(
  photos.slice(0, 4).map((img) => $(img).attr("src")),
  [
    "/images/keller/20ft-5-stall-shower-container-private-stall.webp",
    "/images/keller/20ft-5-stall-shower-container-stall-row.webp",
    "/images/keller/20ft-5-stall-shower-container-two-stalls.webp",
    "/images/keller/20ft-5-stall-shower-container-three-stalls.webp",
  ],
);
const containerAlt = [
  "Private shower stall inside a 20 ft, 5-stall shower container",
  "Row of private shower stalls inside a 20 ft, 5-stall shower container",
  "Two private shower stalls in a 20 ft, 5-stall shower container",
  "Three shower stalls in a 20 ft, 5-stall shower container",
];
for (const [i, img] of photos.slice(0, 4).entries()) {
  assert.equal($(img).attr("alt"), containerAlt[i]);
  assert.doesNotMatch($(img).attr("alt"), /verified/i);
  const copied = await readFile(`public${$(img).attr("src")}`);
  const source = await readFile(`public/images/service-heroes/20ft-shower-container/0${i + 1}-960.webp`);
  assert.equal(createHash("sha256").update(copied).digest("hex"), createHash("sha256").update(source).digest("hex"));
  await access(`dist${$(img).attr("src")}`);
}
for (const [i, img] of photos.slice(4).entries()) {
  const copied = await readFile(`public${$(img).attr("src")}`);
  const source = await readFile(`public/images/service-heroes/13ft-shower-restroom-combination/0${i + 1}-960.webp`);
  assert.equal(createHash("sha256").update(copied).digest("hex"), createHash("sha256").update(source).digest("hex"));
  assert.equal(
    $(img).attr("alt"),
    [
      "Interior of a 13 ft, 3-stall shower and restroom combination trailer",
      "Restroom inside a 13 ft, 3-stall shower and restroom combination trailer",
    ][i],
  );
}
assert.equal($(".brand-logo").attr("alt"), "Temporary Shower Rental 123 logo");
assert.equal($(".footer-brand img").attr("alt"), "Temporary Shower Rental 123 logo");
assert.equal($(".brand-logo").attr("src"), "/images/temporary-shower-rental-123-logo.webp");
assert.equal($(".footer-brand img").attr("src"), "/images/temporary-shower-rental-123-logo.webp");
await access("public/images/temporary-shower-rental-123-logo.webp");
await access("dist/images/temporary-shower-rental-123-logo.webp");
const containerArchive = await readdir("equipment-archive-review/Equipments/20ft Shower Container (5 Stalls)");
for (const name of [
  "mobile-shower-container-interior.png",
  "portable-shower-container-multiple-stalls.png",
  "shower-container-private-shower-stall.png",
  "shower-container-rental-private-stalls.png",
]) assert.ok(containerArchive.includes(name), `Missing archive-backed shower-container source ${name}`);
const product = load(await readFile("dist/services/shower-trailers/22ft-10-stall/index.html", "utf8"));
assert.equal(product("h1").text(), "22 ft 10-Stall Shower Trailer Rental");
assert.ok(product("body").text().includes("These images do not depict a 22 ft ten-stall trailer"));
const home = load(await readFile("dist/index.html", "utf8"));
assert.ok(home("a[href='tel:+18883855513']").length > 0);
assert.equal(home("a[href='tel:+19725446598']").length, 0);
for (const [url, name] of [
  ["https://www.facebook.com/mobileshowertrailerrental", "Facebook"],
  ["https://www.youtube.com/@temporaryshowerrental123", "YouTube"],
]) {
  assert.equal(home(`.site-footer nav[aria-label='Follow us'] a[href='${url}']`).text().startsWith(name), true);
}
const sitemap = await readFile("dist/sitemap.xml", "utf8");
assert.equal($("meta[name=robots]").attr("content"), "index,follow");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const canonicalUrl = `https://temporary-shower-rental.com${path}`;
assert.equal(sitemapUrls.filter((url) => url === canonicalUrl).length, 1);
assert.equal(sitemapUrls.length, 26);
assert.equal(new Set(sitemapUrls).size, 26);
const robots = await readFile("dist/robots.txt", "utf8");
assert.match(robots, /User-agent: \*\s+Allow: \/\s+Disallow: \/api\//);
assert.ok(robots.includes("Sitemap: https://temporary-shower-rental.com/sitemap.xml"));
await access("public/robots.txt");
const vercelConfig = JSON.parse(await readFile("vercel.json", "utf8"));
const noindexHeader = vercelConfig.headers.find((rule) =>
  rule.headers.some((header) => header.key === "X-Robots-Tag" && /noindex/i.test(header.value)),
);
const noindexHostMatcher = new RegExp(noindexHeader.missing.find((condition) => condition.type === "host").value);
for (const host of ["temporary123.com", "www.temporary123.com", "temporary-shower-rental.com", "www.temporary-shower-rental.com"]) {
  assert.ok(noindexHostMatcher.test(host), `${host} must be exempt from the noindex response header`);
}
for (const host of ["temporary-shower-rental-preview.vercel.app", "preview.example.com"]) {
  assert.ok(!noindexHostMatcher.test(host), `${host} must retain preview/other-host noindex protection`);
}
const result = {
  status: "PASS", path, telLinks: phones.length, linkedTargets: targets.length,
  equipmentLinks: 7, faqSchemaMatches: 5, archiveMatchedPhotos: 6, containerArchiveSources: 4,
  texasMenuAndCityDirectory: "PASS: Keller is nested under North Texas and links to its exact existing route",
  responseHeader: "PASS: canonical hosts exempt; preview and other hosts protected",
  robotsTxt: "PASS: public crawl policy and canonical sitemap reference",
  scope: "Local rendered candidate; no Google edits or deployment claimed",
  indexing: "Owner-approved priority route; index,follow; self-canonical; included in sitemap alongside 25-page batch",
  onlineSubmission: "Disabled by existing site configuration; browser flow checked separately",
};
await mkdir("audit/keller-indexability-2026-10-02", { recursive: true });
await writeFile("audit/keller-indexability-2026-10-02/rendered-check.json", JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result));
