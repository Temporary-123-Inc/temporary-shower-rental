# Browser verification

Verified on 2026-09-30 against the production build served locally at `http://127.0.0.1:4183/`.

## Desktop

- Viewport: 1280 x 800.
- H1: `Temporary Shower Trailer Rental`.
- No horizontal document overflow.
- No broken image in the visible hero viewport.
- The navigation, call action, quote action, hero image, headline, explanatory copy, and service facts were visibly rendered.
- Homepage content markers: 9 primary shower modules and 2 supporting modules.
- Homepage visual markers: 9 primary shower modules and 2 supporting modules.
- Measured family visual area: 82.37% shower (953,869 primary / 204,135 supporting).

## Mobile

- Viewport: 390 x 844.
- H1: `Temporary Shower Trailer Rental`.
- One H1 was present.
- No horizontal document overflow.
- Homepage content markers: 9 primary shower modules and 2 supporting modules.
- Homepage visual markers: 9 primary shower modules and 2 supporting modules.
- Measured family visual area after the mobile-grid correction: 79.54% shower (762,099 primary / 196,000 supporting).
- The fleet renders one 327 px card per row at this viewport; the final two supporting cards are not compressed into a two-column row.
- All lazy-loaded homepage images resolved after traversing the page; the final broken-image count was zero.
- The collapsed mobile menu, hero image and caption, hero copy, primary call and quote actions, family modules, footer, and urgent-support panel were visibly rendered.

## Quote flow boundary

The mobile contact page was opened without submitting the form. It retained the name, phone, email, start date, location, service, duration, industry, message, honeypot, page, and consent fields. The expected required-field attributes and submit control were present. No customer data was entered and no inquiry was transmitted.

This check proves the local production build's visible layout and rendered DOM behavior. It does not prove the production deployment or downstream message delivery; those require separate live verification.
