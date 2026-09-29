# V16.3 local verification

Captured on 2026-09-30 in `C:\Users\Charles\Documents\Codex\2026-09-30\temporary-shower-rental-v163` after the final mobile-grid correction.

## Passing checks

- `npm test`: PASS, 11 test files and 66 tests.
- `npm run typecheck`: PASS.
- `npm run build`: PASS, Vite production build plus static HTML for 754 pages and the 404 page.
- Official plan validation: PASS with 0 errors and 0 warnings.
- `npm run check:families`: PASS. Controlled plan 233/297 shower (78.45%); released cohort 21/25 shower (84%); homepage module allocation 9/11 shower (81.82%); strict alignment and all family gates true.
- `npm run check:links`: PASS, 754 pages, no capitalization issues and no missing targets.
- `npm run check:headlines`: PASS, 548 location pages and 548 unique headlines.
- `npm run check:seo`: PASS, 755 HTML pages, 100,296 local links, 13,188 local images, 755 unique titles and descriptions, and no reported problems.
- `npm run check:release`: PASS for the approved 25-URL indexing scope.
- `npm run check:secrets`: PASS, 1,148 source/built-text files scanned with no pattern findings.
- Browser at 1280 x 800: one H1, no horizontal overflow, no failed images, and 82.37% shower visual area.
- Browser at 390 x 844: one H1, no horizontal overflow, no failed images, one-column fleet cards, and 79.54% shower visual area.

## Existing project-wide boundaries

- `npm run check:cities`: FAIL because the unchanged map exposes zero links for five previously reviewed Washington city pages. The V16.3 implementation did not change the map sources or those city pages.
- `npm run check:security`: FAIL because the existing security-evidence ledger contains out-of-directory evidence paths and blocked AUTHZ, CORS_HEADERS, APP_CHECK, INTEGRATIONS, SECRETS, DEPLOY, OBSERVE, and RECOVERY items. The V16.3 family-allocation change does not alter those systems or claim to resolve that separate project-wide ledger.
- The contact form was inspected locally without entering or transmitting customer data. Production persistence and notification delivery remain to be verified after deployment without sending a test inquiry.

These failures are retained as explicit project boundaries; they were not suppressed or reclassified as passing V16.3 checks.
