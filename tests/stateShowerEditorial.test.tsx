import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { StateDetail } from "../src/StateDetail";
import { StateGuideCards } from "../src/StateGuideCards";
import { regionPages, RegionDetail } from "../src/regionGuides";
import { stateGuides } from "../src/stateGuides";
import { stateShowerEditorial } from "../src/stateShowerEditorial";

const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
const otherFamilies = /\b(?:kitchen|dishwashing|refrigeration|sleeper|bunkbed|laundry)\b/i;

describe("state-specific shower editorial", () => {
  it("gives all 50 states distinct shower leads and planning angles", () => {
    const states = Object.keys(stateGuides);
    expect(states).toHaveLength(50);
    expect(Object.keys(stateShowerEditorial).sort()).toEqual([...states].sort());
    expect(new Set(states.map((state) => stateGuides[state].intro)).size).toBe(50);
    expect(new Set(states.map((state) => stateGuides[state].focus)).size).toBe(50);

    const cards = load(renderToStaticMarkup(createElement(StateGuideCards)));
    for (const state of states) {
      const guide = stateGuides[state];
      const page = load(renderToStaticMarkup(createElement(StateDetail, { name: state })));
      const card = cards(`[data-state-guide="${state}"]`);
      expect(normalize(page("[data-h1-intro]").text()), state).toBe(guide.intro);
      expect(normalize(card.find("[data-guide-intro]").text()), state).toBe(guide.intro);
      expect(normalize(card.find("[data-guide-focus]").text()), state).toBe(guide.focus);
      expect(guide.intro, state).toContain(state);
      expect(guide.intro.split(/\. /)[0], state).toMatch(/shower/i);
      expect(guide.intro.split(/\. /)[0], state).toMatch(/rent/i);
      expect(guide.intro, state).not.toMatch(otherFamilies);
      expect(guide.focus, state).toMatch(/shower/i);
      expect(guide.serviceSummary, state).toMatch(/shower trailer.*shower container/i);
      expect(guide.serviceSummary, state).toMatch(/shower and restroom combination/i);
      expect(guide.serviceSummary, state).not.toMatch(otherFamilies);
      expect(page('a[href="/services/shower-restroom-combination-trailers/"]').length, state).toBe(1);
    }
  });

  it("uses the regional guide context in every regional hero", () => {
    expect(regionPages).toHaveLength(246);
    const leads = regionPages.map((guide) => {
      const page = load(renderToStaticMarkup(createElement(RegionDetail, { guide })));
      const lead = normalize(page("[data-h1-intro]").text());
      expect(lead, guide.path).toContain(guide.intro);
      expect(lead, guide.path).toContain(guide.cities[0]);
      expect(lead, guide.path).toMatch(/shower/i);
      expect(lead, guide.path).toMatch(/rent/i);
      expect(lead, guide.path).not.toMatch(otherFamilies);
      return lead;
    });
    expect(new Set(leads).size).toBe(246);
  });
});
