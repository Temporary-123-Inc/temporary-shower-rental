import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { load } from "cheerio";

const files = (await readdir("dist", { recursive: true })).filter((file) => file.endsWith(".html"));
const kellerFile = "service-areas/texas/north-texas/keller/index.html";
const businessName = "Commercial Emergency Shower Rental International";
let generalFooters = 0;
let kellerFooters = 0;
let organizationSchemas = 0;

for (const file of files) {
  const html = await readFile(join("dist", file), "utf8");
  assert.doesNotMatch(html, /11012 Kadota|1-866-455-7214|\+18664557214/, `${file} retains the replaced contact details`);
  const $ = load(html);
  const footer = $(".site-footer");
  if (footer.length) {
    assert.equal(footer.find("a[href^='tel:']").length, 0, `${file} should use the pre-update footer links`);
    assert.equal(footer.find(".footer-contact-address").length, 0, `${file} should have no footer address`);
    const names = footer.find(".footer-contact-name");
    if (file.replaceAll("\\", "/") === kellerFile) {
      assert.equal(names.length, 0, "Keller footer should omit the general business name");
      kellerFooters += 1;
    } else {
      assert.equal(names.length, 1, `${file} should have one general business name`);
      assert.equal(names.text().trim(), businessName);
      generalFooters += 1;
    }
  }
  const schema = $("script[type='application/ld+json']").first().text();
  if (schema) {
    const graph = JSON.parse(schema)["@graph"] ?? [];
    const organization = graph.find((node) => node["@type"] === "Organization");
    if (organization) {
      assert.equal(organization.telephone, "+18883855513", `${file} has the wrong Organization phone`);
      assert.equal(organization.contactPoint.telephone, "+18883855513", `${file} has the wrong contact point`);
      assert.equal(organization.address, undefined, `${file} should have no Organization address`);
      organizationSchemas += 1;
    }
  }
}

assert.equal(kellerFooters, 1);
assert.ok(generalFooters > 700);
assert.ok(organizationSchemas > 700);
console.log(JSON.stringify({ status: "PASS", htmlPages: files.length, generalFooters, kellerFooters, organizationSchemas }));
