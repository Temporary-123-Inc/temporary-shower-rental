import site from "../site.json" with { type: "json" };

// Keller service-area copy and local phone retain their confirmed scope.
// The owner requested removal of the Keller street address from this site.
export const kellerLocation = {
  path: "/service-areas/texas/north-texas/keller/",
  regionPath: "/service-areas/texas/north-texas/",
  name: "Mobile Shower Trailer Rental",
  phoneDisplay: "(972) 544-6598",
  phoneE164: "+19725446598",
  hours: "Open 24 hours",
  reviewUrl: "https://g.page/r/CVWLHyBkolhOECE/review",
  socialProfiles: [
    { name: "Facebook", url: "https://www.facebook.com/mobileshowertrailerrental" },
    { name: "YouTube", url: "https://www.youtube.com/@temporaryshowerrental123" },
  ],
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
