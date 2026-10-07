import { describe, expect, it } from "vitest";
import {
  matchesLocationRentalHeadline,
  regionRentalHeadline,
  rentalCategoryHeadline,
  rentalHubHeadline,
  rentalProductHeadline,
  stateRentalHeadline,
} from "../src/rentalHeadlines";
import { cityHeadline } from "../src/CityDetail";
import { reviewedCityPages } from "../src/cityDirectory";

describe("Shower-focused Temporary123 location H1 plan", () => {
  it("keeps location before the commercial use case, equipment, and rental intent", () => {
    expect(stateRentalHeadline("Alabama")).toBe(
      "Alabama Remote Emergency Base Camp Shower Trailer Rental",
    );
    expect(stateRentalHeadline("California")).toBe(
      "California Remote Emergency Base Camp Shower Trailer Rental",
    );
    expect(stateRentalHeadline("Colorado")).toBe(
      "Colorado Remote Emergency Base Camp Shower Trailer Rental",
    );
    expect(stateRentalHeadline("Texas")).toBe(
      "Texas Remote Emergency Base Camp Shower Trailer Rental",
    );
  });

  it("selects region topics deterministically", () => {
    const first = regionRentalHeadline("Olympic Peninsula", "Washington", 0);
    expect(first).toBe(
      regionRentalHeadline("Olympic Peninsula", "Washington", 0),
    );
    expect(
      matchesLocationRentalHeadline(first, "Olympic Peninsula, Washington"),
    ).toBe(true);
  });

  it("rejects missing or out-of-order formula components", () => {
    expect(
      matchesLocationRentalHeadline(
        "Port Angeles, Washington Remote Industrial Base Camp Shower Trailer Rental",
        "Port Angeles, Washington",
      ),
    ).toBe(true);
    expect(
      matchesLocationRentalHeadline(
        "Remote Industrial Base Camp Shower Trailer Rental in Port Angeles, Washington",
        "Port Angeles, Washington",
      ),
    ).toBe(false);
    expect(
      matchesLocationRentalHeadline(
        "Port Angeles, Washington Shower Trailer Rental",
        "Port Angeles, Washington",
      ),
    ).toBe(false);
    expect(
      matchesLocationRentalHeadline(
        "Port Angeles, Washington Remote Industrial Base Camp Rental Shower Trailer",
        "Port Angeles, Washington",
      ),
    ).toBe(false);
  });

  it("keeps every reviewed city focused on shower trailers", () => {
    const byName = Object.fromEntries(
      reviewedCityPages.map((city) => [city.name, city]),
    );
    expect(cityHeadline(byName["Port Angeles"])).toBe(
      "Port Angeles, Washington Remote Emergency Base Camp Shower Trailer Rental",
    );
    expect(cityHeadline(byName.Tacoma)).toBe(
      "Tacoma, Washington Remote Emergency Base Camp Shower Trailer Rental",
    );
    expect(cityHeadline(byName.Olympia)).toBe(
      "Olympia, Washington Remote Emergency Base Camp Shower Trailer Rental",
    );
    expect(cityHeadline(byName.Seattle)).toBe(
      "Seattle, Washington Remote Emergency Base Camp Shower Trailer Rental",
    );
    expect(cityHeadline(byName.Sequim)).toBe(
      "Sequim, Washington Remote Emergency Base Camp Shower Trailer Rental",
    );
  });

  it("normalizes approved category and model headings", () => {
    expect(rentalHubHeadline("/equipment-rental/")).toBe(
      "Nationwide Temporary Facility and Equipment Rental",
    );
    expect(rentalCategoryHeadline("Mobile Kitchens")).toBe(
      "Kitchen Trailer Rental",
    );
    expect(
      rentalCategoryHeadline("Shower and Restroom Combination Trailers"),
    ).toBe("Shower and Restroom Combination Trailer Rental");
    expect(
      rentalProductHeadline(
        "Luxury Shower and Restroom Combination Trailer, 3 Stalls + 1 ADA",
      ),
    ).toBe("3-Stall + 1 ADA Shower and Restroom Combination Trailer Rental");
    expect(
      rentalProductHeadline(
        "22 ft Luxury Shower and Restroom Combination Trailer, 6 Stalls",
      ),
    ).toBe("22 ft 6-Stall Shower and Restroom Combination Trailer Rental");
    expect(rentalProductHeadline("22 ft Shower Trailer, 10 Stalls")).toBe(
      "22 ft 10-Stall Shower Trailer Rental",
    );
  });
});
