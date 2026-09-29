import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { Home } from "../src/Home";
import { regionPages } from "../src/regionGuides";
import {
  isPrimaryLocationOption,
  locationHeadlineRotation,
  regionRentalHeadline,
  stateRentalHeadline,
} from "../src/rentalHeadlines";
import { stateGuides } from "../src/stateGuides";

const inBand = (primary: number, total: number) => {
  const percent = (primary / total) * 100;
  return percent >= 75 && percent <= 85;
};

describe("V16.3 primary-family allocation", () => {
  it("keeps the deterministic location rotation at 80/20", () => {
    const primary = locationHeadlineRotation.filter(isPrimaryLocationOption);
    expect(primary).toHaveLength(8);
    expect(locationHeadlineRotation).toHaveLength(10);
  });

  it("keeps the complete state and regional landing-page plan in band", () => {
    const headlines = [
      ...Object.keys(stateGuides).map(stateRentalHeadline),
      ...regionPages.map((guide) =>
        regionRentalHeadline(guide.region, guide.state, guide.index),
      ),
    ];
    const primary = headlines.filter(
      (headline) =>
        headline.includes("Shower Trailer") &&
        !headline.includes("Shower and Restroom"),
    ).length;
    expect(headlines).toHaveLength(296);
    expect(primary).toBe(232);
    expect(inBand(primary, headlines.length)).toBe(true);
  });

  it("allocates homepage content and visuals independently at 81.82/18.18", () => {
    const $ = load(renderToStaticMarkup(createElement(Home)));
    for (const selector of ["[data-family-content]", "[data-family-visual]"]) {
      const modules = $(`main ${selector}, .shower-home ${selector}`);
      const primary = modules.filter('[data-family-role="primary"]').length;
      const supporting = modules.filter('[data-family-role="supporting"]').length;
      expect(modules).toHaveLength(11);
      expect(primary).toBe(9);
      expect(supporting).toBe(2);
      expect(inBand(primary, modules.length)).toBe(true);
    }
  });

  it("keeps every represented homepage family phrase and image aligned", () => {
    const $ = load(renderToStaticMarkup(createElement(Home)));
    expect($("h1").text()).toBe("Temporary Shower Trailer Rental");
    expect($('[data-family="shower"] h1, [data-family="shower"] h3').length).toBe(9);
    expect($(".shower-home").text()).toContain("Shower and restroom combination trailer rental.");
    expect($(".shower-home").text()).toContain("Mobile commercial kitchen trailer rental.");

    $('[data-family-visual=""], [data-family-visual]').each((_, node) => {
      const family = $(node).attr("data-family");
      const evidence = `${$(node).find("img").attr("alt")} ${$(node).find("figcaption").text()}`.toLowerCase();
      if (family === "shower")
        expect(evidence).toMatch(/shower (trailer|container) (rental|leasing)/);
      if (family === "shower-restroom-combination")
        expect(evidence).toContain("shower and restroom combination trailer rental");
      if (family === "mobile-commercial-kitchen")
        expect(evidence).toContain("mobile commercial kitchen trailer rental");
    });
  });
});
