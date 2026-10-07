import { alignedPageIntro } from "./alignedIntroductions";

const countWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

/** Keep a camp search phrase tied to its remote operating context. */
export function remoteCampHeadline(headline: string): string {
  const normalized = headline
    .replace(/\b(?:Remote )?(?:(?:Emergency|Industrial) )?Base[ -]?Camp\b/gi, (match) =>
      `Remote ${match.replace(/^Remote /i, "").replace(/Base[ -]?Camp/i, "Base Camp")}`,
    )
    .replace(/\b(?:Remote )?(?:Man[ -]?Camp|Workforce Camp|Crew[ -]?Camp)\b/gi, (match) =>
      `Remote ${match.replace(/^Remote /i, "").replace(/Man[ -]?Camp/i, "Man Camp")}`,
    );
  return /\bcamps?\b|basecamps?/i.test(normalized) && !/\bremote\b/i.test(normalized)
    ? `Remote ${normalized}`
    : normalized;
}

const familyDetail = (headline: string) => {
  if (/kitchen|dishwash|refrigerat|cooler|freezer|cold storage|food service/i.test(headline))
    return "Discuss cooking, warewashing, refrigeration, cold storage, and the site connections that each selected unit requires.";
  if (/camp|shower|restroom|laundry|sleep|bunk|workforce|berthing/i.test(headline))
    return "Match washing, toilet, laundry, sleeping, and occupancy needs to the facilities actually required on site.";
  return "Match the available unit and support facilities to the way people will use the site each day.";
};

/** Visible introduction for family, category, and service pages; location copy stays separate. */
export function serviceFamilyIntro(path: string, headline: string, fallback = ""): string {
  const original = alignedPageIntro(path, headline, fallback).trim();
  const sentences = original.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((part) => part.trim()) ?? [];
  let lead = "";
  for (const sentence of sentences) {
    if (countWords(`${lead} ${sentence}`) > 62) break;
    lead = `${lead} ${sentence}`.trim();
  }
  if (!lead) {
    lead = original
      ? `${original.split(/\s+/).slice(0, 56).join(" ").replace(/[,:;\s]+$/, "")}.`
      : `Explore ${remoteCampHeadline(headline).replace(/\s+rental$/i, "").toLowerCase()} rental options for your operating site.`;
  }
  lead = remoteCampHeadline(lead);

  const closing = "Request availability or a project quote.";
  const coordination = "For planned projects or emergency operations, discuss short-term and long-term rentals with commercial, institutional, government, and remote workforce teams. Share your delivery address, dates, site access, expected users, and available utilities so equipment selection and transport can be coordinated.";
  let paragraph = `${lead} ${coordination} ${closing}`;
  if (countWords(paragraph) < 70)
    paragraph = `${lead} ${familyDetail(headline)} ${coordination} ${closing}`;
  return paragraph;
}

export const kitchenFamilyServices = [
  "Mobile kitchen rentals",
  "Dishwashing trailers",
  "Commercial refrigeration trailers",
  "Walk-in coolers",
  "Freezers",
  "Refrigerated containers",
] as const;

export const remoteManCampFamilyServices = [
  "Shower trailers",
  "Shower and restroom combinations",
  "Laundry trailers",
  "Bunk bed sleeper trailers",
  "Remote man camp services",
] as const;
