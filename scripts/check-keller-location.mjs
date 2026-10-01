import assert from "node:assert/strict";
import { readFile, writeFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { load } from "cheerio";

const path = "/service-areas/texas/north-texas/keller/";
const html = await readFile(`dist${path}index.html`, "utf8");
const $ = load(html);
assert.equal($("h1").length, 1);
assert.equal($("h1").text(), "Shower Trailer Rental in Keller, TX");
assert.equal($("title").text(), "Shower Trailer Rental in Keller, TX | Mobile Shower Trailer Rental");
assert.equal($("meta[name=description]").attr("content"), "Shower trailers delivered from Keller, TX to job sites across Texas and nationwide. GPS-tracked delivery nationwide. Call (972) 544-6598.");
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
assert.equal(business.sameAs, undefined);
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
assert.equal(texas.find(`a[data-directory-city][href='${path}']`).text(), "Keller, Texas");
assert.equal(directory(`[data-map-city-state='Texas'] a[href='${path}']`).length, 1);
const cityDirectory = load(await readFile("dist/service-areas/texas/north-texas/cities/index.html", "utf8"));
assert.equal(cityDirectory(`a[data-city-name='keller']`).attr("href"), path);
const photos = $(".keller-photos img").toArray();
assert.equal(photos.length, 2);
for (const [i, img] of photos.entries()) {
  const copied = await readFile(`public${$(img).attr("src")}`);
  const source = await readFile(`public/images/service-heroes/13ft-shower-restroom-combination/0${i + 1}-960.webp`);
  assert.equal(createHash("sha256").update(copied).digest("hex"), createHash("sha256").update(source).digest("hex"));
  assert.ok($(img).attr("alt").length > 15);
}
const product = load(await readFile("dist/services/shower-trailers/22ft-10-stall/index.html", "utf8"));
assert.equal(product("h1").text(), "22 ft 10-Stall Shower Trailer Rental");
assert.ok(product("body").text().includes("These images do not depict a 22 ft ten-stall trailer"));
const home = load(await readFile("dist/index.html", "utf8"));
assert.ok(home("a[href='tel:+18883855513']").length > 0);
assert.equal(home("a[href='tel:+19725446598']").length, 0);
const sitemap = await readFile("dist/sitemap.xml", "utf8");
assert.equal($("meta[name=robots]").attr("content"), "noindex,follow");
assert.ok(!sitemap.includes(path));
const result = {
  status: "PASS", path, telLinks: phones.length, linkedTargets: targets.length,
  equipmentLinks: 7, faqSchemaMatches: 5, archiveMatchedPhotos: 2,
  texasMenuAndCityDirectory: "PASS: Keller links to its exact existing route",
  scope: "Local rendered candidate; no Google edits or deployment claimed",
  indexing: "Outside existing pilot; noindex,follow; self-canonical; absent from sitemap",
  onlineSubmission: "Disabled by existing site configuration; browser flow checked separately",
};
await writeFile("audit/keller-gbp-2026-10-01/rendered-check.json", JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result));
