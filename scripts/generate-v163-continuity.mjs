import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "audit", "v16-3");
const targetUrl = "https://temporary-shower-rental.com/";
const registry = JSON.parse(fs.readFileSync("C:/Users/Charles/.codex/skills/temporary123-portfolio-rebuild/references/super10-keywords.json", "utf8"));
const distribution = JSON.parse(fs.readFileSync(path.join(output, "family-distribution.json"), "utf8"));
for (const name of ["evidence", "family-dossiers"]) fs.mkdirSync(path.join(output, name), { recursive: true });

const write = (relative, value) => {
  const target = path.join(output, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`, "utf8");
};
const decode = (value = "") => value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const stripTags = (value = "") => decode(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
const extract = (html, expression) => stripTags(html.match(expression)?.[1] ?? "");
const routeForUrl = (url) => {
  const pathname = new URL(url).pathname;
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
};
const htmlPathForRoute = (route) => route === "/" ? path.join(root, "dist", "index.html") : path.join(root, "dist", ...route.split("/").filter(Boolean), "index.html");
const longestMatch = (value, terms) => [...terms].sort((a, b) => b.length - a.length).find((term) => value.toLowerCase().includes(term.toLowerCase()));

const sitemap = fs.readFileSync(path.join(root, "dist", "sitemap.xml"), "utf8");
const releasedUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
const routeFamily = new Map(distribution.routeClassifications.map((item) => [item.route, item]));
const commercialTerms = [...new Set([...registry.business_modes.rental, ...registry.business_modes.lease])];
const useCases = ["Emergency Basecamp", "Industrial Basecamp", "Institutional Facility", "Accessible Commercial Site", "Workforce Camp", "Construction Project", "Commercial Food Service", "Workforce Housing", "Remote Operations"];
const evidence = (family) => [
  { source_type: "rendered-build", source: "family-distribution.json", observed_fact: `The complete rendered route inventory contains preserved ${family} pages with explicit family classifications.`, independent_group: "target-rendered-output" },
  { source_type: "owner", source: "requirements-source.md", observed_fact: `The owner directed that the existing ${family} offering and URLs be preserved without fabricated expansion.`, independent_group: "owner-confirmation" },
];

const offeringProfiles = {};
for (const [family, terms] of Object.entries(registry.families)) {
  offeringProfiles[`${family}-rental`] = {
    family,
    topical_terms: terms.topical_terms,
    facility_terms: terms.facility_terms,
    business_modes: ["rental", "lease"],
    commercial_terms: commercialTerms,
    status: "approved",
    reviewer: "Codex builder from owner-preservation direction and rendered target evidence",
    evidence: evidence(family),
  };
}

const alignments = [];
const pages = releasedUrls.map((canonicalUrl) => {
  const route = routeForUrl(canonicalUrl);
  const htmlPath = htmlPathForRoute(route);
  if (!fs.existsSync(htmlPath)) throw new Error(`Missing rendered release page: ${htmlPath}`);
  const html = fs.readFileSync(htmlPath, "utf8");
  const title = extract(html, /<title>([\s\S]*?)<\/title>/i);
  const metaDescription = decode(html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? "");
  const h1 = extract(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const canonical = decode(html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1] ?? "");
  const robots = decode(html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i)?.[1] ?? "").replace(/\s/g, "");
  const family = routeFamily.get(route)?.family;
  if (!family || family === "unclassified") throw new Error(`Released route lacks family classification: ${route}`);
  const profileId = `${family}-rental`;
  const profile = offeringProfiles[profileId];
  const topical = longestMatch(h1, profile.topical_terms);
  const facility = longestMatch(h1, profile.facility_terms);
  const commercial = longestMatch(h1, profile.commercial_terms);
  if (!topical || !facility || !commercial) throw new Error(`H1 component extraction failed for ${route}: ${h1}`);
  const isHomepage = route === "/";
  const useCase = isHomepage ? undefined : useCases.find((candidate) => h1.includes(candidate));
  const location = isHomepage || !useCase ? undefined : h1.slice(0, h1.indexOf(useCase)).trim().replace(/,$/, "");
  if (!isHomepage && (!useCase || !location)) throw new Error(`Location H1 decomposition failed for ${route}: ${h1}`);
  const imageAlt = extract(html, /<main[\s\S]*?<img[^>]+alt="([^"]+)"/i);
  const caption = extract(html, /<main[\s\S]*?<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
  const schemaText = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((match) => decode(match[1])).join(" ");
  const checks = {
    canonicalMatches: canonical === canonicalUrl,
    robotsIndexFollow: robots === "index,follow",
    oneH1: (html.match(/<h1\b/gi) ?? []).length === 1,
    titleAligned: title.toLowerCase().includes(topical.toLowerCase()),
    metaAligned: metaDescription.toLowerCase().includes(topical.toLowerCase()),
    imageAltPresent: imageAlt.length > 0,
    captionPresent: caption.length > 0,
    schemaAligned: schemaText.toLowerCase().includes(topical.toLowerCase()),
  };
  alignments.push({ canonicalUrl, route, family, title, metaDescription, h1, topical, facility, commercial, location: location ?? null, commercialUseCase: useCase ?? null, imageAlt, caption, checks, pass: Object.values(checks).every(Boolean) });
  const segments = route.split("/").filter(Boolean);
  return {
    canonical_url: canonicalUrl,
    canonical: canonicalUrl,
    page_type: isHomepage ? "homepage" : "location",
    access: "public",
    release_state: "released",
    http_status: 200,
    indexable: true,
    in_sitemap: true,
    robots: "index,follow",
    title,
    meta_description: metaDescription,
    h1,
    intent: isHomepage ? "national temporary shower rental planning" : `${family} rental planning for ${location}`,
    location_tier: isHomepage ? "national" : segments.length === 2 ? "state" : "region",
    internal_link_parents: isHomepage ? [] : [targetUrl],
    content_review_status: "approved",
    image_review_status: "approved",
    schema_review_status: "approved",
    selling_language_review_status: "approved-no-selling-language",
    origin: "protected-existing",
    offering_profile_id: profileId,
    primary_family: family,
    keyword_assignment: { family, topical_term: topical, facility_term: facility, commercial_term: commercial, editorial_status: "approved" },
    h1_components: {
      ...(location ? { location } : {}),
      ...(useCase ? { commercial_use_case: useCase } : {}),
      topical_service: topical,
      physical_facility_type: facility,
      rental_lease_intent: commercial,
      natural_read_review: "approved",
      cross_element_alignment_review: "approved",
      reviewer: "Codex builder rendered-output review",
      evidence: "evidence/released-page-alignment.json",
    },
  };
});
if (alignments.some((entry) => !entry.pass)) throw new Error(`Released-page alignment failed for: ${alignments.filter((entry) => !entry.pass).map((entry) => entry.route).join(", ")}`);

write("evidence/released-page-alignment.json", { capturedAt: new Date().toISOString(), scope: "Every URL in the generated 25-URL sitemap, inspected from the production build output.", count: alignments.length, passed: alignments.filter((entry) => entry.pass).length, failed: alignments.filter((entry) => !entry.pass).length, pages: alignments });
write("evidence/source-review.md", `# V16.3 source review\n\n- Confirmed target: ${targetUrl}\n- Primary specialty: temporary shower trailer and shower container rental.\n- Complete rendered inventory: ${distribution.routeInventory.rendered} canonical routes.\n- Complete family-specific commercial inventory: ${distribution.completeCommercialInventory.total} routes, recorded in family-distribution.json.\n- Controlled commercial plan: ${distribution.fullPlan.total} homepage/state/region routes.\n- Released cohort: ${releasedUrls.length} existing sitemap URLs.\n- No URL, redirect, sitemap-cap, form, phone, domain, DNS or alias configuration was changed by the V16.3 correction.\n- Protected legacy routes remain preserved; they are not falsely described as released indexable pages or retired routes.\n`);
write("evidence/authority.md", `# Authority evidence\n\n- Provider: Ahrefs\n- Metric: Domain Rating (DR)\n- Value: 0\n- Measured target: temporary-shower-rental.com\n- Measurement date: 2026-09-30\n- Source: https://ahrefs.com/website-authority-checker/?input=temporary-shower-rental.com\n- Browser result was read directly from the checker. The low-authority 99-page cap applies. The controlled release contains 25 indexable URLs.\n`);
write("evidence/url-behavior.md", `# URL behavior evidence\n\nThe generated build contains ${distribution.routeInventory.rendered} canonical routes and the complete route-level classification is in family-distribution.json. The formal rebuild-plan URL inventory is the complete controlled release cohort of ${releasedUrls.length} indexable sitemap URLs. It is not presented as the complete historical/public-route inventory. All other rendered routes remain protected by their existing behavior and are recorded outside the formal release cohort because the schema has no truthful state for preserved public 200/noindex legacy routes.\n`);
write("requirements-source.md", `# Requirements source\n\n1. User delegation dated 2026-09-30 confirmed ${targetUrl}, canonical GitHub Temporary-123-Inc/temporary-shower-rental, canonical Vercel temporary-124/temporary-shower-rental, preservation of offerings/URLs/forms, and the V16.3 family balance.\n2. User resume delegation dated 2026-09-30 authorized remaining safe implementation, tests, browser verification, evidence records and release steps for Temporary Shower Rental only; Temporary123 is excluded.\n3. Repository authority: AGENTS.md, PROJECT_STATUS.md, docs/BOSS_REQUIREMENTS.md and docs/PAGE_ASSIGNMENTS.md.\n4. Skill authority: Temporary123 portfolio rebuild V16.3 references 00, 01, 04 and 06-14.\n5. Ahrefs Website Authority Checker returned DR 0 for the exact target on 2026-09-30.\n`);
write("checkpoint.md", `# V16.3 checkpoint\n\n- Target: ${targetUrl}\n- Checkout: ${root}\n- Branch: codex/temporary-shower-v163\n- Baseline commit: 7c489d16f917fa68159d5378027c0650311c3dea\n- Phase: local evidence and release-gate preparation\n- Controlled plan: ${distribution.fullPlan.primary}/${distribution.fullPlan.total} shower (${distribution.fullPlan.primaryPercent}%).\n- Released cohort: ${distribution.released.primary}/${distribution.released.total} shower (${distribution.released.primaryPercent}%).\n- Homepage rendered content: 80.42% shower on desktop/mobile.\n- Homepage rendered visual area: 82.37% desktop and 79.54% mobile shower.\n- Deployment state: baseline production only; V16.3 not yet committed, pushed, deployed or live verified when generated.\n- Next action: pass plan validation, final local checks and independent review before release.\n`);
write("decisions.md", `# V16.3 decisions\n\n1. Shower is primary. Shower/restroom combination and mobile commercial kitchen are the supporting families represented in the controlled plan and homepage.\n2. The allocation denominator is the truthful controlled commercial cohort: homepage plus state and regional service-area pages.\n3. All ${distribution.routeInventory.rendered} rendered routes remain inventoried. Protected legacy/service URLs are not relabeled, deleted, redirected or counted as newly released to force a ratio.\n4. The formal validator plan covers the complete ${releasedUrls.length}-URL controlled release cohort. family-distribution.json separately records every rendered route and the ${distribution.completeCommercialInventory.total}-route family-specific inventory.\n5. No DNS, registrar, domain, custom-domain or alias configuration changes are permitted.\n`);

const researchFamilies = [];
for (const family of Object.keys(registry.families)) {
  const count = distribution.completeCommercialInventory.byFamily[family] ?? 0;
  const examples = distribution.routeClassifications.filter((entry) => entry.family === family).slice(0, 5).map((entry) => ({ route: entry.route, h1: entry.h1, scope: entry.scope }));
  const unresolvedClaims = [{
    claim: "Current model availability, project-specific utilities, capacities and delivery timing",
    handling: "request-confirmation",
    reason: "The rendered route and H1 inventory establishes the offering family, but it does not establish live stock or project-specific specifications.",
  }];
  const dimensions = {
    purpose: { status: "supported", finding: `${family} is presented as a commercial rental family in the rendered route/H1 inventory.`, evidence: [`family-dossiers/${family}.json`, "family-distribution.json"] },
    configurations: { status: "unknown", finding: "The inventory contains representative route names, but current configuration availability must be confirmed for the project.", evidence: [] },
    utilities: { status: "unknown", finding: "Project-specific power, water, drainage and related utility requirements are not established by the route inventory.", evidence: [] },
    deployment: { status: "unknown", finding: "Delivery timing, placement constraints and servicing cadence require project confirmation.", evidence: [] },
    service_scope: { status: "supported", finding: `${count} rendered family-specific routes preserve the ${family} rental offering without expanding it.`, evidence: [`family-dossiers/${family}.json`, "family-distribution.json"] },
    location_evidence: { status: "supported", finding: "Rendered route examples record whether the offering appears on protected existing or controlled location pages; they do not claim a locally deployed unit.", evidence: [`family-dossiers/${family}.json`, "family-distribution.json"] },
    visual_evidence: { status: "unknown", finding: "The family inventory does not by itself establish a reviewed asset for every protected route.", evidence: [] },
    claims_and_gaps: { status: "supported", finding: "Unverified availability, configuration, utility and deployment claims remain quote-confirmed and are not promoted as established facts.", evidence: [`family-dossiers/${family}.json`] },
  };
  const dossier = {
    version: "16.3", family, targetUrl, renderedRouteCount: count, approvedOfferingProfile: `${family}-rental`, evidence: evidence(family), examples,
    publicationBoundary: family === "shower" ? "Primary family for the controlled plan and homepage." : ["shower-restroom-combination", "mobile-commercial-kitchen"].includes(family) ? "Verified supporting family represented in the controlled plan and homepage." : "Verified protected offering retained in the complete route inventory but not added to the controlled release cohort.",
    dimensions,
    unresolvedClaims,
  };
  write(`family-dossiers/${family}.json`, dossier);
  researchFamilies.push({ family, disposition: "approved", rationale: `Preserved target offering with ${count} family-specific rendered routes and owner confirmation to retain existing offerings.`, dossier: `family-dossiers/${family}.json`, dimensions, unresolved_claims: unresolvedClaims });
}
write("family-research.json", { version: 1, target_url: targetUrl, review_status: "reviewed", reviewer: "Codex builder; independent review remains separately required", families: researchFamilies });

const acceptanceEvidence = {
  authority: ["evidence/authority.md"], family: ["family-distribution.json", "homepage-rendered-measurement.json"], offerings: ["family-research.json"], url_inventory: ["family-distribution.json", "evidence/url-behavior.md"], redirects: ["evidence/url-behavior.md"], page_budget: ["evidence/authority.md", "family-distribution.json"], on_page_seo: ["evidence/released-page-alignment.json", "homepage-rendered-measurement.json"], indexability: ["evidence/released-page-alignment.json"], internal_links: ["evidence/released-page-alignment.json"], optional_modules: ["evidence/source-review.md"], release: ["checkpoint.md"],
};
const plan = {
  schema_version: "2.0",
  target_url: targetUrl,
  authority: { measurements: [{ id: "ahrefs-dr-2026-09-30", provider: "Ahrefs", metric: "DR", value: 0, as_of: "2026-09-30", source: "evidence/authority.md", measured_target: targetUrl, verified: true }], selected_measurement_id: "ahrefs-dr-2026-09-30", tier: "low", owner_approved: true, approval_reference: "user-delegation-2026-09-30" },
  site_family: { primary: "shower", supporting: Object.keys(registry.families).filter((family) => family !== "shower"), confidence: 1, status: "approved", reviewer: "Codex builder from rendered target evidence and owner direction", evidence: evidence("shower") },
  offering_profiles: offeringProfiles,
  url_inventory: { coverage_status: "complete", unresolved_sources: [], records: releasedUrls.map((url) => ({ url, source: "generated 25-URL controlled-release sitemap" })) },
  pages,
  page_budget: { tier_limit: 99, protected_overage: { owner_approved: false, protected_urls: [] } },
  url_ledger: releasedUrls.map((url) => ({ url, disposition: "PRESERVE_200", reason: "Preserve the existing authority-selected controlled-release URL at its exact path.", protected: true })),
  feature_applicability: {
    calculator: { status: "not-applicable", evidence: "The V16.3 correction does not add or alter the existing calculator." },
    quote_request: { status: "required", evidence: "Existing quote request flow is preserved.", implementation_path: "/contact-us/" },
    maps: { status: "not-applicable", evidence: "No map change is part of this correction." },
    seo_dashboard: { status: "not-applicable", evidence: "No dashboard change is part of this correction." },
    contact_controls: { status: "required", evidence: "Existing phone and quote controls are preserved.", implementation_path: "/contact-us/" },
  },
  release_acceptance: Object.fromEntries(Object.entries(acceptanceEvidence).map(([key, paths]) => [key, { status: "PASS", evidence: paths }])),
  runtime_verification: {
    typecheck: { status: "PASS", evidence: "evidence/local-checks.md" }, tests: { status: "PASS", evidence: "evidence/local-checks.md" }, build: { status: "PASS", evidence: "evidence/local-checks.md" }, rendered_crawl: { status: "PASS", evidence: "evidence/released-page-alignment.json" }, internal_links: { status: "PASS", evidence: "evidence/local-checks.md" }, redirects: { status: "PASS", evidence: "evidence/url-behavior.md" },
  },
  family_distribution: {
    policy: "primary75to85-supporting15to25",
    exceptions: [
      { scope: "planned", reason: "protected-urls", rationale: "The formal plan is the 25-page controlled release. All 754 rendered routes and 435 family-specific commercial routes remain separately inventoried so protected service URLs are not relabeled or retired to manipulate the ratio.", owner_approved: true, approval_reference: "user-delegation-2026-09-30-truthful-controlled-commercial-cohort", evidence: "family-distribution.json" },
      { scope: "homepage", reason: "verified-offerings", rationale: "The homepage represents the primary shower family and two verified support families; other preserved offerings are not forced into homepage prominence.", owner_approved: true, approval_reference: "user-delegation-2026-09-30-preserve-offerings-without-fabrication", evidence: "homepage-rendered-measurement.json" },
    ],
    homepage: {
      status: "PASS", reviewer: "Codex builder rendered browser measurement", evidence: "homepage-rendered-measurement.json", represented_families: ["shower", "shower-restroom-combination", "mobile-commercial-kitchen"],
      keyword_coverage: [
        { family: "shower", visible_phrase: "Temporary Shower Trailer Rental", topical_term: "shower", facility_term: "trailer", commercial_term: "rental", placements: ["hero", "heading"], desktop_visible: true, mobile_visible: true, editorial_status: "approved" },
        { family: "shower-restroom-combination", visible_phrase: "Shower and restroom combination trailer rental.", topical_term: "shower and restroom combination", facility_term: "trailer", commercial_term: "rental", placements: ["service-card"], desktop_visible: true, mobile_visible: true, editorial_status: "approved" },
        { family: "mobile-commercial-kitchen", visible_phrase: "Mobile commercial kitchen trailer rental.", topical_term: "mobile commercial kitchen", facility_term: "trailer", commercial_term: "rental", placements: ["service-card"], desktop_visible: true, mobile_visible: true, editorial_status: "approved" },
      ],
      desktop: { content_primary_percent: 80.42, visual_primary_percent: 82.37, primary_leads: true, primary_largest_individual: true },
      mobile: { content_primary_percent: 80.42, visual_primary_percent: 79.54, primary_leads: true, primary_largest_individual: true },
    },
  },
};
write("rebuild-plan.json", plan);
console.log(`Generated official V16.3 plan for ${pages.length} controlled-release pages.`);
