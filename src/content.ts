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
  "/": "Temporary Shower Trailer Rental Nationwide",
  "/home/": "Temporary Shower Trailer Rental Nationwide",
  "/services/": "Temporary Shower and Restroom Trailer Solutions",
  "/equipment-rental/": "Temporary Shower Trailer Rental Inventory",
  "/industries/": "Industries We Serve",
  "/service-areas/": "USA Temporary Facilities Rental Service Areas",
  "/seo-dashboard/": "SEO Migration Dashboard",
  "/planning/": "Plan Your Temporary Shower Rental",
  "/about-us/": "About Temporary Shower Rental 123",
  "/about-temporary-shower-rental/": "About Temporary Shower Rental 123",
  "/contact-us/": "Contact Our Team",
  "/privacy/": "Privacy",
};
const descriptions: Record<string, string> = {
  "/": "Rent clean, dependable temporary shower, restroom and combination trailers nationwide for construction, events, renovations, government and emergency response.",
  "/home/": "Rent clean, dependable temporary shower, restroom and combination trailers nationwide for construction, events, renovations, government and emergency response.",
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
    "Learn how Temporary Shower Rental 123 coordinates clean, dependable shower and restroom facilities nationwide.",
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
