# Keller website and Google profile fixes — 2026-10-01

Scope: a single Keller location page and alignment to the existing Google Business Profile, as requested by the user. This is a scoped addition to the existing rebuild, not a new full-site rebuild or bulk rollout. Source: user attachment `Pasted text.txt` (44d7c608-2ea6-449f-a3a5-3faf2e67cafb), plus user confirmation to handle both website and profile. The user explicitly confirmed the 22 ft / 10-stall model as inventory, superseding the prior local uncertainty about that model. Its photos are still reference images of a different 20 ft unit.

| ID | Requirement | Implementation / boundary |
| --- | --- | --- |
| U001 | Exact `/service-areas/texas/north-texas/keller/` route; supplied title, meta description, H1 and intro | Dedicated Keller page and prerender integration |
| U002 | Exact profile NAP and 24-hour opening | Verified in public Google Maps on 2026-10-01; scoped phone throughout Keller header, drawer and content |
| U003 | Profile-derived embedded map and review button | Exact Share > Embed a map URL obtained from CID 5645440683828284245; supplied review link |
| U004 | Email, YouTube and social profiles | Missing in brief; not fabricated or published as placeholders |
| U005 | All supplied equipment links including two ADA child pages | Full canonical paths; 22 ft / 10-stall product corrected after direct owner confirmation |
| U006 | Nationwide/DFW/Texas delivery, GPS tracking, utilities and parent links | Supplied claims retained; unknown lead times replaced with quote confirmation |
| U007 | Five supplied FAQs, matching FAQ schema; LocalBusiness schema matching NAP | Shared FAQ data; no made-up email/social/review rating |
| U008 | Real equipment photographs, descriptive filenames/alt | Copies of the two previously archive-verified 13 ft combination interior photos; no claim of Keller installation |
| U009 | Top/bottom phone and quote-form access | Both CTAs open existing accessible drawer with Keller prefill; online submission remains disabled by existing configuration |
| U010 | No unrelated city addresses/phones or copied competitor text | Dedicated content, scoped local phone and schema |
| U011 | After page is live, remove Keller identity from shower-rental.com contact/Keller pages | Conditional external follow-up; not executed before the new page is live |
| U012 | Update Google Business Profile | Current public NAP/hours already correct; signed-in manager has 0 businesses. Owner-account switch requested. Website field must not target the new page until it is live. |
| U013 | 2026-10-02 screenshot follow-up: Keller missing from Texas regions/cities navigation | Include dedicated Keller guide in the shared navigation registry, Texas disclosure, map city links and North Texas alphabetical directory without changing its slug |

Release boundary: existing authority/research/full-site completion evidence is still missing, as recorded in PROJECT_STATUS.md. This task can implement and verify locally but must not claim full rebuild/release completion. Unknown email/social details, lead times and pricing are not invented.
