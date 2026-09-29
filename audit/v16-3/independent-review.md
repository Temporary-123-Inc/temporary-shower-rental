# V16.3 Independent Implementation Re-review

- Reviewer: Codex, acting as the independent V16.3 implementation reviewer
- Review date: 2026-09-30 (Asia/Singapore)
- Working tree: `C:\Users\Charles\Documents\Codex\2026-09-30\temporary-shower-rental-v163`
- Baseline: `7c489d16f917fa68159d5378027c0650311c3dea`
- Verdict: **PASS — local V16.3 implementation/release-candidate scope**

## Exact findings

1. **Allocation passes on the expressly approved controlled commercial cohort.** `audit/v16-3/family-distribution.json` inventories all 754 rendered routes and all 435 family-specific commercial routes. The controlled full-plan cohort is 233/297 primary (78.45%) and 64/297 supporting (21.55%); the released cohort is 21/25 primary (84.00%) and 4/25 supporting (16.00%). These are independently in the required 75–85/15–25 bands. The complete protected commercial inventory is 239/435 shower (54.94%) and 196/435 supporting (45.06%); it is intentionally not used as the allocation denominator because the user approved the truthful controlled-cohort exception. Each rendered route has an explicit scope/reason, and protected service-specific URLs remain assigned to their actual family rather than being relabeled to manipulate the ratio.

2. **Homepage content and rendered visuals pass independently.** Content was selected with `main [data-family-content]`, filtered to CSS-visible elements (`display != none`, `visibility != hidden`, positive bounding-box width and height), tokenized by rendered whitespace-separated words, and calculated as `primary words / (primary words + supporting words) * 100`: 347 primary / 83 supporting = **80.70% primary** at both viewports. Visuals were selected with `main [data-family-visual]`, subjected to the same visibility predicate, measured as `getBoundingClientRect().width * getBoundingClientRect().height`, and calculated as `primary pixel area / (primary pixel area + supporting pixel area) * 100`:
   - 1440x900: 1,096,560.5 primary px² / 204,143.125 supporting px² = **84.31% primary**.
   - 390x844: 804,720 primary px² / 205,200 supporting px² = **79.68% primary**.
   Both viewports had one H1, no horizontal overflow, and no failed images after lazy-loaded images were scrolled into view.

3. **The H1/title/meta/opening/image/caption/alt/schema gate is credible.** `npm run check:families` reports `strictAlignment: true` with no alignment or homepage violations across the controlled plan. `audit/v16-3/evidence/released-page-alignment.json` records 25/25 released URLs passing one-H1, canonical/indexability, required H1-term, title, meta, opening, image, caption, alt, and schema checks. Independent inspection found four released alt patterns, all family-correct: commercial shower, shower-only, shower/restroom combination, and mobile kitchen. The regenerated research covers 10 approved families; all seven operational dimensions (`purpose`, `configurations`, `utilities`, `deployment`, `service_scope`, `location_evidence`, `visual_evidence`) are explicit, `claims_and_gaps` is also explicit, and every unresolved claim is a structured `{claim, handling, reason}` object. Unknown configurations/utilities/deployment/visual claims remain quote-confirmed rather than fabricated.

4. **Continuity is preserved.** Baseline/current registry review found 754 routes in both trees with no route additions/removals, and the 25-URL active indexing set remains capped at 25. No form handler, endpoint, shared form component, routing configuration, or redirect configuration was changed. Rendered conversion paths retain `tel:+18883855513` and `/contact-us/`; the link checker reports 754 pages, zero missing targets, and zero capitalization issues. The legacy slug `/services/shower-trailers/22ft-10-stall/` is deliberately retained while the page truthfully identifies the approved 20 ft five-stall offering; its caption explicitly says the imagery is not a 22 ft ten-stall unit and requires quote confirmation. This is a transparent continuity exception, not a fabricated offering.

5. **Plan and local verification evidence pass.** The exact official command was:
   `py C:\Users\Charles\.codex\skills\temporary123-portfolio-rebuild\scripts\validate_rebuild_plan.py audit\v16-3\rebuild-plan.json --phase plan`
   It returned **PASS: 0 errors, 0 warnings**. The validator resolved its Draft 2020-12 schema from `C:\Users\Charles\.codex\skills\temporary123-portfolio-rebuild\references\rebuild-plan.schema.json` and its default keyword registry from `C:\Users\Charles\.codex\skills\temporary123-portfolio-rebuild\references\super10-keywords.json`. Focused re-review checks also passed: `npm run check:families`; `npm test -- --run` (11 files, 66 tests); `npm run typecheck`; `npm run check:links` (754 pages); and `npm run check:headlines` (548/548 unique location headlines). Existing build evidence records a successful production build of 754 routes plus the 404 page. A clean rebuild was not rerun because it writes generated `dist`/audit files and this review was authorized to write only this report.

6. **No hidden unrelated implementation change was found.** Product-source changes are confined to the homepage family presentation, state/location headline alignment, and associated CSS; package/test/script changes implement the V16.3 audit gates; audit and coordination-document changes record that work. Generated registry/homepage/indexing artifacts are related evidence churn. No protected route source, form backend, deployment configuration, or redirect map was removed.

## Remaining material boundaries

- This PASS is local and does not claim push, deployment, production traffic, live form persistence/email delivery, Search Console submission, or Google indexing. The official `--phase release --verify-live` gate was not run; production release/completion evidence remains a production-only requirement.
- The coordination evidence records inherited `check:cities` and security-evidence failures outside this V16.3 diff. They were not hidden or waived as whole-project production gates; they must be resolved or formally accepted before an unconditional production-readiness claim.
- The formal schema-valid plan contains the controlled 25-URL release inventory. The complete 435-route commercial ledger is separately and explicitly preserved in `family-distribution.json` under the owner-approved protected-URL exception.
- No end-to-end external form submission was performed during this read-only review.

## Conclusion

All prior material V16.3 implementation findings are resolved in the current local state: both controlled-cohort allocations pass, independent homepage word/area measurements pass, the alignment evidence is auditable, the official plan validator is clean, protected offerings/routes and the 25-URL cap are preserved, and focused tests pass. The remaining items above are production or inherited whole-project boundaries, not failures of the reviewed V16.3 implementation.
