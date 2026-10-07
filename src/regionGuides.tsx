import { alignedLocationIntro, locationRentalPlanningAnswer } from "./alignedIntroductions";
import { statePath } from "./statePaths";
import site from "../site.json" with { type: "json" };
import { stateGuides } from "./stateGuides";
import { regionCities } from "./regionCities";
import { citiesForRegion, hasCityGuide } from "./cityDirectory";
import {
  buildRegionSeasonalDemand,
  type SeasonalDemand,
} from "./seasonalDemand";
import { regionLocationLabel, regionRentalHeadline } from "./rentalHeadlines";
import { capitalizeLinkLabel } from "./linkLabels";
import { kellerLocation } from "./kellerLocation";
import { LocationImageCarousel } from "./LocationImageCarousel";

export const regionSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const regionPath = (state: string, region: string) =>
  `/service-areas/${regionSlug(state)}/${regionSlug(region)}/`;

type ContextualLink = {
  href: string;
  label: string;
  context: string;
};

const priorityServices = [
  {
    href: "/equipment-rental/shower-trailer/",
    labels: [
      "shower trailer rentals",
      "temporary shower trailers for rent",
      "mobile shower trailer leasing",
    ],
  },
  {
    href: "/services/shower-containers/20ft-5-stall/",
    labels: [
      "20 ft shower container rentals",
      "5-stall shower containers for rent",
      "temporary shower containers for lease",
    ],
  },
  {
    href: "/services/shower-trailers/22ft-10-stall/",
    labels: [
      "22 ft 10-stall shower trailer rentals",
      "10-stall shower trailers for rent",
      "temporary 22 ft shower facilities",
    ],
  },
] as const;

const cityContexts = [
  "support construction and renovation crews.",
  "fit planned facility interruptions.",
  "support emergency base camp planning.",
  "serve remote and phased projects.",
  "follow local access and utility needs.",
  "support seasonal site operations.",
  "serve industrial and public projects.",
  "adapt to changing crew schedules.",
] as const;

const commercialIntentTemplates = [
  "Compare shower trailers and shower containers for short-term rentals or longer leases. Confirm availability and the actual site layout with the rental team.",
  "Plan temporary shower rental around peak use, hot water, drainage and the delivery route for the exact site.",
] as const;

const buildCityLinks = (
  state: string,
  cities: string[],
  globalIndex: number,
  path: string,
): ContextualLink[] =>
  cities.map((city, cityIndex) => {
    const service = priorityServices[(globalIndex + cityIndex) % priorityServices.length];
    const label =
      service.labels[(globalIndex + cityIndex * 2) % service.labels.length];
    const cityGuide = citiesForRegion(path).find(
      (entry) => entry.name.toLowerCase() === city.toLowerCase(),
    );
    return {
      href:
        cityGuide && hasCityGuide(cityGuide)
          ? cityGuide.path
          : `${service.href}?location=${encodeURIComponent(`${city}, ${state}`)}`,
      label:
        cityGuide && hasCityGuide(cityGuide)
          ? `${city}, ${state} rental guide`
          : capitalizeLinkLabel(`${label} in ${city}`),
      context:
        cityContexts[(globalIndex * 3 + cityIndex) % cityContexts.length],
    };
  });

const buildServiceLinks = (globalIndex: number): ContextualLink[] =>
  priorityServices.map((service, serviceIndex) => ({
    href: service.href,
    label: capitalizeLinkLabel(
      service.labels[(globalIndex + serviceIndex) % service.labels.length],
    ),
    context: [
      "for private shower access.",
      "for container-based shower capacity.",
      "for dedicated 10-stall shower capacity.",
    ][serviceIndex],
  }));

const introTemplates = [
  (state: string, region: string) =>
    `Teams planning work in ${region}, ${state} can arrange temporary shower trailers or shower containers around the site's access, users and schedule. Confirm hot water, drainage and servicing before choosing a unit.`,
  (state: string, region: string) =>
    `A ${region} project in ${state} may need private shower access during construction, renovation or a facility shutdown. Compare trailer and container layouts, then confirm delivery access and utility requirements for the exact site.`,
  (state: string, region: string) =>
    `For work across ${region}, ${state}, Temporary123 helps project teams plan temporary showers before mobilization. Discuss the available stall count, expected peak use and servicing for short or extended assignments.`,
  (state: string, region: string) =>
    `Project managers in ${region}, ${state} can use shower rentals to support crews during construction, renovation or remote work. Review the site route, equipment footprint and servicing plan before choosing a rent or lease arrangement.`,
  (state: string, region: string) =>
    `When a site is located in ${region}, ${state}, temporary showers can help bridge a renovation or provide crew washing capacity. Discuss trailer or container placement, water supply and the delivery sequence with our team.`,
  (state: string, region: string) =>
    `A clear shower rental brief for ${region}, ${state} should name the work area, crew size and operating dates. Temporary123 can help compare shower trailer and shower container options for a short-term rent or a longer lease.`,
] as const;

const formatCityList = (cities: string[]) => {
  if (cities.length < 2) return cities[0] || "the surrounding area";
  if (cities.length === 2) return `${cities[0]} and ${cities[1]}`;
  return `${cities.slice(0, -1).join(", ")}, and ${cities.at(-1)}`;
};

const detailTemplates = [
  (state: string, region: string) =>
    `In ${region}, the local access plan is the starting point. Share the nearest approach, turning space and water and drainage connections so a shower rental can be positioned safely in ${state}.`,
  (state: string, region: string) =>
    `For ${region} sites, match shower stall capacity to the people who use it each day. A rent or lease plan should account for peak shifts, privacy, hot water and the servicing route in ${state}.`,
  (state: string, region: string) =>
    `The ${region} work pattern may change between setup and peak operations. Confirm the dates, users and utility plan before reserving a shower rental in ${state}.`,
  (state: string, region: string) =>
    `A practical ${region} brief should show where deliveries arrive and where the shower unit will sit. That detail helps our team review a short-term rent or longer lease for the ${state} project.`,
  (state: string, region: string) =>
    `For a ${region} deployment, keep the shower access and servicing route clear. We can discuss a shower trailer or container that fits the working footprint and project timeline in ${state}.`,
  (state: string, region: string) =>
    `Before a shower unit moves to ${region}, confirm the receiving contact, ground conditions and return route. These details support a transparent rent or lease conversation in ${state}.`,
] as const;

const factTemplates = [
  (state: string, region: string, fact: string) =>
    `${fact} This regional guide helps teams connect that state context with a ${region} rental plan.`,
  (state: string, region: string, fact: string) =>
    `${fact} Use the ${region} location name when requesting a temporary shower rent or lease in ${state}.`,
  (state: string, region: string, fact: string) =>
    `${fact} The regional context is useful when arranging delivery for a ${region} shower rental.`,
  (state: string, region: string, fact: string) =>
    `${fact} Include ${region} in the project brief so the right rental and servicing discussion can begin.`,
] as const;

const regionStateEntries = Object.entries(stateGuides);

const buildRegionVisuals = (
  index: number,
  state: string,
  region: string,
  cities: string[],
) => [
  { image: "/images/service-heroes/20ft-shower-trailer-sink/01-960.webp", imageAlt: "Private shower stall inside a 20 ft shower trailer", caption: "20 ft shower trailer reference" },
  { image: "/images/service-heroes/20ft-shower-container/01-960.webp", imageAlt: "Shower facilities inside a 20 ft shower container", caption: "20 ft shower container reference" },
  { image: "/images/service-heroes/20ft-shower-trailer-sink/02-960.webp", imageAlt: "Three sinks on the exterior service side of a 20 ft shower trailer", caption: "20 ft shower trailer sink reference" },
];

export type RegionGuide = {
  state: string;
  region: string;
  path: string;
  index: number;
  layout: number;
  image: string;
  imageAlt: string;
  gallery: { image: string; imageAlt: string; caption: string }[];
  intro: string;
  detail: string;
  fact: string;
  cities: string[];
  cityLinks: ContextualLink[];
  serviceLinks: ContextualLink[];
  commercialSummary: string;
  seasonal: SeasonalDemand;
};

export const regionPages: RegionGuide[] = regionStateEntries.flatMap(
  ([state, guide], stateIndex) => {
    const stateOffset = regionStateEntries
      .slice(0, stateIndex)
      .reduce((total, [, item]) => total + item.regions.length, 0);
    return guide.regions.map((region, regionIndex) => {
      const index = regionIndex;
      const path = regionPath(state, region);
      const cities = regionCities(state, regionIndex);
      const visuals = buildRegionVisuals(
        stateOffset + regionIndex,
        state,
        region,
        cities,
      );
      const globalIndex = stateOffset + regionIndex;
      return {
        state,
        region,
        path,
        index,
        layout: (Object.keys(stateGuides).indexOf(state) + index) % 6,
        image: visuals[0].image,
        imageAlt: visuals[0].imageAlt,
        gallery: visuals.slice(1, 3),
        intro: `Rent or lease temporary shower equipment in ${region}, ${state}. ${introTemplates[index % introTemplates.length](state, region)}`,
        detail: detailTemplates[index % detailTemplates.length](state, region),
        fact: factTemplates[index % factTemplates.length](
          state,
          region,
          guide.fact,
        ),
        cities,
        cityLinks: buildCityLinks(state, cities, globalIndex, path),
        serviceLinks: buildServiceLinks(globalIndex),
        commercialSummary:
          commercialIntentTemplates[
            globalIndex % commercialIntentTemplates.length
          ],
        seasonal: buildRegionSeasonalDemand(state, region, regionIndex, cities),
      };
    });
  },
);

export const regionPageByPath = Object.fromEntries(
  regionPages.map((page) => [page.path, page]),
) as Record<string, RegionGuide | undefined>;

const crossBorderRegionPaths: Record<string, string> = {
  "/service-areas/arizona/northern-arizona/":
    "/service-areas/utah/southwestern-utah/",
  "/service-areas/arizona/phoenix-area/":
    "/service-areas/nevada/las-vegas-valley/",
  "/service-areas/arizona/southern-arizona/":
    "/service-areas/new-mexico/southwest-new-mexico/",
  "/service-areas/delaware/northern-delaware/":
    "/service-areas/pennsylvania/philadelphia-and-southeast/",
  "/service-areas/delaware/central-delaware/":
    "/service-areas/maryland/eastern-shore/",
  "/service-areas/delaware/delaware-beaches/":
    "/service-areas/maryland/eastern-shore/",
  "/service-areas/indiana/northern-indiana/":
    "/service-areas/illinois/chicago-area/",
  "/service-areas/indiana/central-indiana/":
    "/service-areas/ohio/southwest-ohio/",
  "/service-areas/indiana/southern-indiana/":
    "/service-areas/kentucky/south-central-kentucky/",
};

export const relatedRegionPages = (guide: RegionGuide): RegionGuide[] => {
  const allStatePages = regionPages.filter(
    (page) => page.state === guide.state,
  );
  const position = allStatePages.findIndex((page) => page.path === guide.path);
  const orderedStatePages = [1, -1, 2]
    .map(
      (offset) =>
        allStatePages[
          (position + offset + allStatePages.length) % allStatePages.length
        ],
    )
    .filter((page): page is RegionGuide => page.path !== guide.path);
  const unique = [
    ...new Map(orderedStatePages.map((page) => [page.path, page])).values(),
  ];
  const crossBorder = regionPageByPath[crossBorderRegionPaths[guide.path]];
  if (unique.length < 3 && crossBorder) unique.push(crossBorder);
  for (const page of allStatePages) {
    if (unique.length >= 3) break;
    if (
      page.path !== guide.path &&
      !unique.some((candidate) => candidate.path === page.path)
    )
      unique.push(page);
  }
  return unique.slice(0, 3);
};

export function RegionDetail({ guide }: { guide: RegionGuide }) {
  const nearby = relatedRegionPages(guide);
  const headline = regionRentalHeadline(guide.region, guide.state, guide.index);
  const location = regionLocationLabel(guide.region, guide.state);
  const query = encodeURIComponent(
    `${guide.cities[0]}, ${guide.state}, United States`,
  );
  return (
    <article className={`region-page region-layout-${guide.layout}`}>
      <section className="region-hero">
        <div className="wrap section region-hero-grid">
          <div className="region-hero-copy">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/service-areas/">Service Areas</a>
              <span>/</span>
              <a href={statePath(guide.state)}>{guide.state}</a>
              <span>/</span>
              <span aria-current="page">{guide.region}</span>
            </nav>
            <p className="eyebrow">REGIONAL RENTAL GUIDE</p>
            <h1>{headline}</h1>
            <p className="region-intro" data-h1-intro>{alignedLocationIntro(headline, location, guide.cities)}</p>
            <p className="region-emergency">24/7 live agent support</p>
            <a className="button" href={`tel:${site.phoneE164}`}>
              Call now {site.phoneDisplay}
            </a>
          </div>
          <div className="region-hero-visual region-hero-carousel">
            <LocationImageCarousel headline={headline} />
          </div>
        </div>
      </section>
      <section className="region-answer" aria-labelledby="region-faq-title">
        <div className="wrap section region-answer-card">
          <div className="region-answer-heading">
            <span className="eyebrow">QUICK ANSWER</span>
            <h2 id="region-faq-title">What shower equipment can you rent in {guide.region}?</h2>
            <p data-rental-planning>
              {locationRentalPlanningAnswer(headline) ||
                "Rent or lease shower trailers and shower containers for construction, renovations and temporary crew sites. Confirm stall capacity, hot water, drainage and access with our rental team."}
            </p>
          </div>
          <div className="region-answer-body">
            {locationRentalPlanningAnswer(headline) && <p>Related rental options:</p>}
            <ul className="region-service-links">
              {guide.serviceLinks.map((service) => (
                <li key={service.href}>
                  <a href={service.href}>{service.label}</a>
                </li>
              ))}
            </ul>
            <p className="supporting-rentals">The available shower layout and delivery method depend on the exact site and rental dates.</p>
          </div>
        </div>
      </section>
      <section
        className="wrap section region-city-links"
        aria-labelledby="region-cities-title"
      >
        <div className="region-section-heading">
          <div>
            <span className="eyebrow">CITIES WE SERVE</span>
            <h2 id="region-cities-title">Rental locations in {guide.region}</h2>
          </div>
          <p className="region-parent-state">
            Explore all rental regions in{" "}
            <a href={statePath(guide.state)}>{guide.state}</a>.
          </p>
        </div>
        <div className="region-city-link-grid">
          {guide.path === kellerLocation.regionPath && <p><a href={kellerLocation.path}>Shower trailer rental in Keller, TX</a></p>}
          {guide.cityLinks.map((city) => (
            <p key={city.href}>
              <a href={city.href}>{city.label}</a>
            </p>
          ))}
        </div>
        <a className="region-city-directory-link" href={`${guide.path}cities/`}>
          Browse all {citiesForRegion(guide.path).length} {guide.region} rental
          locations ↗
        </a>
      </section>
      <section
        className="wrap section region-seasonal"
        aria-labelledby="region-seasonal-title"
      >
        <div className="region-seasonal-heading">
          <span className="eyebrow">LOCAL AND SEASONAL INFORMATION</span>
          <h2 id="region-seasonal-title">Rental Planning Conditions</h2>
        </div>
        <div className="region-seasonal-copy">
          <p>{stateGuides[guide.state].seasonal.summary[0]}</p>
          <p>{guide.seasonal.summary[1]}</p>
          <p>
            Plan temporary showers for construction seasons, cleanup,
            facility outages and renovations. Confirm water supply, drainage,
            ground conditions and servicing while the unit is on site.
          </p>
        </div>
        <aside className="region-demand-card">
          <span>Estimated seasonal facility demand</span>
          <strong>
            Code {guide.seasonal.code} · {guide.seasonal.label}
          </strong>
          <p>
            Applies to the {guide.region} regional district, based on normal
            seasonal work and regional weather risks. This is a planning
            estimate, not an official government risk rating.
          </p>
        </aside>
        <nav
          className="region-seasonal-sources"
          aria-label="Planning information sources"
        >
          <span>Planning references:</span>
          {guide.seasonal.sources.map((source) => (
            <a
              href={source.href}
              key={source.href}
              target="_blank"
              rel="external noreferrer"
            >
              {source.label}
            </a>
          ))}
        </nav>
      </section>
      <nav
        className="wrap section region-nearby"
        aria-label="Related travel regions"
      >
        <h2>Explore nearby rental regions</h2>
        <div className="region-nearby-links">
          {nearby.map((page) => (
            <p key={page.path}>
              <a href={page.path}>
                {page.region}, {page.state}
              </a>
            </p>
          ))}
        </div>
      </nav>
      <section className="region-map-strip" aria-labelledby="region-map-title">
        <div className="wrap region-map-grid">
          <div className="region-map-copy">
            <span className="eyebrow">REGIONAL COVERAGE</span>
            <h2 id="region-map-title">{guide.region} travel area</h2>
            <p>Review the route to your site with the rental team.</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${query}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </div>
          <figure className="region-map-visual">
            <iframe
              src={`https://www.google.com/maps/?q=${query}&output=embed&z=7`}
              title={`Google Map near ${guide.cities[0]}, ${guide.state}`}
              width="960"
              height="280"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </figure>
        </div>
      </section>
    </article>
  );
}
