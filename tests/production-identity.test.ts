import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import site from "../site.json" with { type: "json" };
import vercel from "../vercel.json" with { type: "json" };

describe("production identity and routing", () => {
  it("uses the assigned production origin and current public identity", () => {
    expect(site.origin).toBe("https://temporary-shower-rental.com");
    expect(site.brand).toBe("Temporary Shower Rental 123");
    expect(site.phoneE164).toBe("+18883855513");

    const socialCard = readFileSync("public/social-card.svg", "utf8");
    expect(socialCard).toContain("Temporary Shower Rental");
    expect(socialCard).toContain("temporary-shower-rental.com");
    expect(socialCard).toContain("+1 (888) 385-5513");
    expect(socialCard).not.toContain("temporary123.com");
    expect(socialCard).not.toContain("800) 443");

    const schemaSource = readFileSync("scripts/structured-data.ts", "utf8");
    expect(schemaSource).toContain("/images/shower-rental-logo.webp");
    expect(schemaSource).not.toContain("/images/temporary123-logo.png");
  });

  it("only applies the noindex response header to Vercel hosts", () => {
    const noindexRules = vercel.headers.filter((rule) =>
      rule.headers.some(
        (header) =>
          header.key.toLowerCase() === "x-robots-tag" &&
          header.value.toLowerCase().includes("noindex"),
      ),
    );
    expect(noindexRules).toHaveLength(1);

    const rule = noindexRules[0];
    expect("missing" in rule).toBe(false);
    expect(rule.has).toHaveLength(1);
    expect(rule.has?.[0].type).toBe("host");
    const previewHost = new RegExp(`^${rule.has?.[0].value}$`, "i");
    expect(previewHost.test("temporary-shower-rental.vercel.app")).toBe(true);
    expect(previewHost.test("temporary-shower-rental.com")).toBe(false);
    expect(previewHost.test("www.temporary-shower-rental.com")).toBe(false);
  });

  it("redirects every current www path to the same apex path", () => {
    const redirect = vercel.redirects.find(
      (rule) =>
        rule.source === "/:path*" &&
        "has" in rule &&
        rule.has?.some(
          (condition) =>
            condition.type === "host" &&
            condition.value === "www\\.temporary-shower-rental\\.com",
        ),
    );
    expect(redirect).toMatchObject({
      destination: "https://temporary-shower-rental.com/:path*",
      permanent: true,
    });
  });

  it("keeps the homepage portfolio offer aligned to the approved 25/75 mix", () => {
    const home = readFileSync("src/Home.tsx", "utf8");
    expect(home).toContain("Temporary Shower Trailer Rentals Nationwide");
    expect(home).toContain("View Rental Equipment");
    expect(home).toContain("Request a Quote");
    for (const family of [
      "mobile shower trailers",
      "shower and restroom combination trailers",
      "mobile kitchens",
      "man camp and workforce housing units",
      "refrigeration and freezer trailers",
      "temporary dishwashing facilities",
    ]) {
      expect(home).toContain(family);
    }

    const cardLabels = [...home.matchAll(/eyebrow: "([^"]+)"/g)].map(
      ([, label]) => label,
    );
    expect(cardLabels).toHaveLength(8);
    expect(cardLabels.slice(0, 2)).toEqual(["SHOWER TRAILERS", "SHOWER CONTAINERS"]);
    expect(cardLabels.filter((label) => label.startsWith("SHOWER "))).toHaveLength(2);
    expect(2 / cardLabels.length).toBe(0.25);
  });
});
