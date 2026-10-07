import { describe, expect, it } from "vitest";
import {
  kitchenFamilyServices,
  remoteCampHeadline,
  remoteManCampFamilyServices,
  serviceFamilyIntro,
} from "../src/serviceFamilyCopy";

describe("service families", () => {
  it("uses the owner's kitchen and remote man camp service groupings", () => {
    expect(kitchenFamilyServices).toEqual([
      "Mobile kitchen rentals",
      "Dishwashing trailers",
      "Commercial refrigeration trailers",
      "Walk-in coolers",
      "Freezers",
      "Refrigerated containers",
    ]);
    expect(remoteManCampFamilyServices).toEqual([
      "Shower trailers",
      "Shower and restroom combinations",
      "Laundry trailers",
      "Bunk bed sleeper trailers",
      "Remote man camp services",
    ]);
  });

  it("keeps camp headings tied to remote search intent", () => {
    expect(remoteCampHeadline("Construction Trailer Rental & Base Camp Facilities"))
      .toBe("Construction Trailer Rental & Remote Base Camp Facilities");
    expect(remoteCampHeadline("Camp Management and Design"))
      .toBe("Remote Camp Management and Design");
    expect(remoteCampHeadline("Remote Man Camp Rental"))
      .toBe("Remote Man Camp Rental");
  });

  it.each([
    ["/inventory/mobile-kitchen-models/", "Kitchen Trailer Rental"],
    ["/man-camp-rental/", "Remote Man Camp / Workforce Housing Facility Rental"],
  ])("gives %s a complete H1 lead", (path, headline) => {
    const intro = serviceFamilyIntro(path, headline);
    const words = intro.trim().split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(70);
    expect(words).toBeLessThanOrEqual(120);
    expect(intro).toMatch(/planned projects or emergency operations/i);
    expect(intro).toMatch(/short-term and long-term rentals/i);
    expect(intro).toMatch(/delivery address/i);
    expect(intro).toMatch(/Request availability or a project quote\.$/);
  });
});
