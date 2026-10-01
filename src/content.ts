import site from "../site.json" with { type: "json" };
export const services = [
  { slug: "shower-trailers", name: "Shower trailers" },
  { slug: "restroom-trailers", name: "Restroom trailers" },
  { slug: "shower-restroom-combination", name: "Shower & restroom combinations" },
  { slug: "ada-accessible", name: "ADA-accessible units" },
  { slug: "sleeper-trailers", name: "Sleeper trailers" },
  { slug: "workforce-housing", name: "Workforce housing" },
  { slug: "emergency-facilities", name: "Emergency facilities" },
];
export const routes = [
  "/",
  "/home/",
  "/services/",
  "/equipment-rental/",
  "/industries/",
  "/service-areas/",
  "/planning/",
  "/about-us/",
  "/about-temporary-shower-rental/",
  "/contact-us/",
  "/privacy/",
];
const titles: Record<string, string> = {
  "/": "Commercial Shower Trailer Rental Nationwide",
  "/home/": "Commercial Shower Trailer Rental Nationwide",
  "/services/": "Temporary Shower and Restroom Trailer Solutions",
  "/equipment-rental/": "Temporary Shower Trailer Rental Inventory",
  "/industries/": "Industries We Serve",
  "/service-areas/": "USA Temporary Facilities Rental Service Areas",
  "/seo-dashboard/": "SEO Migration Dashboard",
  "/planning/": "Plan Your Temporary Shower Rental",
  "/about-us/": "About Temporary Shower Rental 123 | Our Planning Approach",
  "/about-temporary-shower-rental/": "About Temporary Shower Rental 123 | Nationwide Facility Support",
  "/inventory/": "Temporary Facility Rental Inventory",
  "/existing-mobile-kitchen-layouts/": "Existing Mobile Kitchen Layouts | Temporary Shower Rental 123",
  "/rental-calculator/": "Temporary Facility Rental Calculator | Temporary Shower Rental 123",
  "/blog/": "Temporary Facility Planning Guides | Temporary Shower Rental 123",
  "/404/": "Page Not Found | Temporary Shower Rental 123",
  "/contact-us/": "Contact Our Team",
  "/privacy/": "Privacy",
};
const descriptions: Record<string, string> = {
  "/": "Rent commercial shower, restroom and combination trailers nationwide for construction, events, renovations and government sites. Call for 24/7 live agent support.",
  "/home/": "Rent commercial shower, restroom and combination trailers nationwide for construction, events, renovations and government sites. Call for 24/7 live agent support.",
  "/equipment-rental/":
    "Browse temporary shower trailers, restroom trailers, combination units and workforce-support facilities. Confirm occupancy, access, utilities and rental dates with Temporary Shower Rental 123.",
  "/services/":
    "Plan shower, restroom and hygiene facilities for construction, events, renovations, government and emergency projects.",
  "/industries/":
    "Explore temporary shower and restroom trailer support for construction, government, events, healthcare, schools and industrial projects.",
  "/service-areas/":
    "Find temporary shower and restroom trailer rental service areas across the USA. Availability, delivery and installation require project confirmation.",
  "/seo-dashboard/":
    "Owner-facing Temporary Shower Rental 123 migration dashboard for crawl health, protected target URLs and controlled local review.",
  "/planning/":
    "Prepare your shower or restroom trailer brief with occupancy, site access, utilities and rental dates before you call.",
  "/about-us/":
    "Learn how Temporary Shower Rental 123 coordinates clean, dependable shower and restroom facilities nationwide.",
  "/about-temporary-shower-rental/":
    "Review the planning approach Temporary Shower Rental 123 uses to coordinate shower, restroom and hygiene facilities for active sites.",
  "/inventory/":
    "Browse temporary shower, restroom, combination and supporting facility rentals, then confirm the right configuration for your site.",
  "/existing-mobile-kitchen-layouts/":
    "Review existing mobile-kitchen layouts as planning references for workflow, utilities, access and temporary facility placement.",
  "/rental-calculator/":
    "Estimate the project details to discuss for a temporary facility rental, including location, users, dates, access and utilities.",
  "/blog/":
    "Read practical planning guides for temporary shower, restroom, kitchen and workforce-support facility rentals.",
  "/404/":
    "The requested page could not be found. Browse the temporary facility rental inventory or return to the home page.",
  "/contact-us/":
    "Call Temporary Shower Rental 123 at +1 (888) 385-5513, available 24/7. Discuss your location, occupancy, rental dates, access and utility requirements.",
  "/privacy/":
    "Read how the Temporary Shower Rental 123 website handles visitor information and contact the team with questions about your information.",
};
export function pageInfo(path: string) {
  return {
    title: `${titles[path] || "Page not found"} | ${site.brand}`,
    description:
      descriptions[path] ||
      `Find the right temporary shower or restroom facility for your project. Explore ${site.brand} equipment or call ${site.phoneDisplay} for help.`,
  };
}
