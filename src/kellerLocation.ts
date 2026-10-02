import site from "../site.json" with { type: "json" };

// NAP and hours checked against the exact Google listing on 2026-10-01.
// Missing email/social profiles and delivery times are deliberately omitted.
export const kellerLocation = {
  path: "/service-areas/texas/north-texas/keller/",
  regionPath: "/service-areas/texas/north-texas/",
  name: "Mobile Shower Trailer Rental",
  streetAddress: "1710 Keller Pkwy #4114",
  address: "1710 Keller Pkwy #4114, Keller, TX 76248",
  phoneDisplay: "(972) 544-6598",
  phoneE164: "+19725446598",
  hours: "Open 24 hours",
  mapUrl: "https://maps.google.com/?cid=5645440683828284245",
  reviewUrl: "https://g.page/r/CVWLHyBkolhOECE/review",
  // Copied from this profile's Share > Embed a map, not a city search.
  embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.676731310437!2d-97.2121073!3d32.93313820000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864dd770afc0e903%3A0x4e58a264201f8b55!2sMobile%20Shower%20Trailer%20Rental!5e0!3m2!1sen!2sph!4v1790869259748!5m2!1sen!2sph",
  title: "Shower Trailer Rental in Keller, TX | Mobile Shower Trailer Rental",
  description: "Shower trailers delivered from Keller, TX to job sites across Texas and nationwide. GPS-tracked delivery nationwide. Call (972) 544-6598.",
  headline: "Shower Trailer Rental in Keller, TX",
  intro: "Mobile Shower Trailer Rental delivers shower trailers from our Keller, TX yard to construction sites, events, renovations and emergency response operations across Texas and nationwide. GPS-tracked delivery nationwide. Call (972) 544-6598 for sizing and delivery times.",
  cities: ["Keller", "Fort Worth", "Dallas", "Arlington", "Southlake", "Grapevine", "Denton", "Irving", "Plano", "Frisco"],
} as const;

export function contactForPath(path: string) {
  return path.replace(/\/?$/, "/") === kellerLocation.path ? kellerLocation : site;
}

export const kellerFaqs = [
  { question: "What is a shower trailer?", answer: "A towable trailer with private shower stalls, hot water, lighting and ventilation, delivered to sites that have no permanent showers." },
  { question: "How do shower trailers work?", answer: "The trailer connects to water, power and a drain (or holding tanks) on site, and water is heated on board. We deliver and place the unit." },
  { question: "What does a shower trailer look like?", answer: "See photos of our units below." },
  { question: "Do you deliver shower trailers anywhere in Texas?", answer: "Yes. We deliver from Keller across Dallas–Fort Worth, statewide including Houston, San Antonio and Austin, and nationwide, with GPS-tracked delivery." },
  { question: "How much does it cost to rent a mobile shower trailer?", answer: "It depends on unit size, rental length and delivery distance. Call (972) 544-6598 for a quote." },
] as const;

export const kellerEquipment = [
  // Owner confirmed the 22 ft / 10-stall inventory on 2026-10-01.
  ["22 ft 10-stall shower trailer", "/services/shower-trailers/22ft-10-stall/"],
  ["20 ft 5-stall shower container", "/services/shower-containers/20ft-5-stall/"],
  ["13 ft 3-stall shower/restroom combo", "/services/shower-restroom-combination-trailers/13ft-3-stall/"],
  ["22 ft 6-stall shower/restroom combo", "/services/shower-restroom-combination-trailers/22ft-6-stall/"],
  ["30 ft 8-stall shower/restroom combo", "/services/shower-restroom-combination-trailers/30ft-8-stall/"],
  ["3-stall + 1 ADA combination unit", "/services/shower-restroom-combination-trailers/3-stall-1-ada/"],
  ["8-stall + 1 ADA combination unit", "/services/shower-restroom-combination-trailers/8-stall-1-ada/"],
] as const;
