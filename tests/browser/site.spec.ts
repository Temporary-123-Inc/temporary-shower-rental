import { test, expect } from "@playwright/test";

test("emergency dispatch waits for activity, dismisses for 24 hours, and remains manually available", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  const dispatch = page.locator("[data-emergency-dispatch]");
  const panel = dispatch.locator("[data-emergency-panel]");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await page.clock.fastForward(20000);
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await page.evaluate(() => document.dispatchEvent(new Event("scroll")));
  await page.clock.fastForward(14000);
  expect(await panel.getAttribute("aria-hidden")).toBe("true");
  await page.clock.fastForward(1000);
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(panel).toContainText("Need equipment urgently?");
  await expect(dispatch.locator("[data-emergency-open]")).toBeHidden();
  await dispatch.locator("[data-emergency-close]").click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  const dismissedUntil = await page.evaluate(() =>
    Number(localStorage.getItem("temporary123:emergency-dismissed-until-v1")),
  );
  expect(dismissedUntil - Date.now()).toBeGreaterThanOrEqual(24 * 60 * 60 * 1000);
  expect(dismissedUntil - Date.now()).toBeLessThanOrEqual(
    24 * 60 * 60 * 1000 + 60_000,
  );
  await page.reload();
  await page.evaluate(() => document.dispatchEvent(new Event("scroll")));
  await page.clock.fastForward(16000);
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await dispatch.locator("[data-emergency-open]").click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(panel.getByRole("link", { name: /Call/ })).toHaveAttribute(
    "href",
    "tel:+18883855513",
  );
});

test("project desk and emergency controls are mutually exclusive and restore focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const deskTrigger = page.locator(".contact-rail");
  const drawer = page.getByRole("dialog", { name: "Request availability" });
  const emergencyTrigger = page.locator("[data-emergency-open]");
  const emergencyPanel = page.locator("[data-emergency-panel]");

  await deskTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(drawer).toBeVisible();
  await expect(deskTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(
    drawer.getByRole("button", { name: "Close contact form" }),
  ).toBeFocused();
  await expect(emergencyPanel).toHaveAttribute("aria-hidden", "true");
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(deskTrigger).toBeFocused();

  await emergencyTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(emergencyPanel).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("[data-emergency-close]")).toBeFocused();
  await emergencyPanel
    .getByRole("link", { name: "Check urgent availability" })
    .click();
  await expect(drawer).toBeVisible();
  await expect(emergencyPanel).toHaveAttribute("aria-hidden", "true");
  await page.keyboard.press("Escape");

  await emergencyTrigger.click();
  await page.keyboard.press("Escape");
  await expect(emergencyPanel).toHaveAttribute("aria-hidden", "true");
  await expect(emergencyTrigger).toBeFocused();
});

test("sticky project controls respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.locator("[data-emergency-panel]").evaluate((element) =>
      getComputedStyle(element)
        .transitionDuration.split(",")
        .every((duration) => parseFloat(duration) <= 0.00001),
    ),
  ).toBe(true);
  await expect(page.locator(".contact-rail")).toHaveCSS(
    "animation-name",
    "none",
  );
});

const homepageServiceNames = [
  "Private showers, ready for the job site.",
  "Containerized showers for extended projects.",
  "Shower and restroom in one plan.",
  "Practical housing for working crews.",
  "Commercial kitchens for active sites.",
  "Cold storage that keeps pace.",
  "High-volume warewashing support.",
  "Comfortable restroom facilities.",
];

for (const width of [320, 390, 768, 1024, 1280, 1440])
  test(`homepage layout and photos at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(
      "Temporary Shower Trailer Rentals Nationwide",
    );
    await expect(
      page.getByRole("link", { name: "Request a Quote", exact: true }).first(),
    ).toHaveAttribute("href", "/contact-us/");
    await expect(
      page.getByRole("link", { name: "View Rental Equipment", exact: true }),
    ).toHaveAttribute("href", "/equipment-rental/");
    await expect(page).toHaveTitle(/Temporary Shower Rental 123/);
    await expect(page.locator(".brand")).toContainText("Temporary Shower Rental 123");
    await expect(page.locator(".visual-note, .equipment-jumps")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Prepare for your project" }),
    ).toHaveCount(0);
    const brandMark = page.locator(".brand img");
    const brandText = page.locator(".brand > span");
    expect(
      await brandMark.evaluate(
        (mark, text) => {
          const image = mark as HTMLImageElement;
          const word = text as HTMLElement;
          const visibleMarkHeight =
            image.clientWidth / (image.naturalWidth / image.naturalHeight);
          return (
            visibleMarkHeight / parseFloat(getComputedStyle(word).fontSize)
          );
        },
        await brandText.elementHandle(),
      ),
    ).toBeGreaterThanOrEqual(0.85);
    await expect(page.locator(".utility")).toHaveCount(0);
    const emergency = page.locator("[data-emergency-dispatch]");
    await expect(emergency).toBeVisible();
    await expect(emergency.locator("[data-emergency-panel]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(emergency.locator("[data-emergency-open]")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(emergency.locator(".emergency-dispatch-call")).toHaveAttribute(
      "href",
      "tel:+18883855513",
    );
    const contactRail = page.locator(".contact-rail");
    await expect(contactRail).toBeVisible();
    await expect(contactRail).toHaveAttribute("href", "/contact-us/");
    await expect(contactRail).toContainText("Need a rental?Contact now");
    await expect(contactRail).toHaveCSS("animation-name", "none");
    const railBounds = await contactRail.boundingBox();
    expect(railBounds).not.toBeNull();
    expect(railBounds!.width).toBeLessThanOrEqual(
      width <= 900 ? width * 0.54 : 72,
    );
    if (width > 900) expect(railBounds!.x).toBe(0);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const phone = page.locator(
      width < 1024 ? ".mobile-call" : ".header-contact",
    );
    if (width <= 900) {
      await expect(phone).not.toBeVisible();
      await expect(emergency.locator("[data-emergency-open]")).toBeInViewport({
        ratio: 1,
      });
    } else {
      await expect(phone).toHaveAttribute("href", "tel:+18883855513");
      await expect(phone.locator("strong")).toHaveCSS(
        "color",
        "rgb(255, 255, 255)",
      );
      await expect(phone).toHaveCSS("background-color", "rgb(25, 143, 189)");
      await expect(phone.locator(":scope > span")).toHaveText(
        "Call our team, 24/7",
      );
      await expect(phone.locator(":scope > span")).toBeVisible();
      await expect(phone.locator("svg")).toBeVisible();
      if (width >= 1024) {
        await expect(phone).toHaveCSS("border-radius", "12px");
        expect(
          await phone.evaluate(
            (element) => getComputedStyle(element, "::after").animationName,
          ),
        ).toBe("header-call-edge-flicker");
      }
      await expect(phone.locator("strong")).toHaveText("+1 (888) 385-5513");
      await expect(phone).toBeInViewport({ ratio: 1 });
    }
    const displayedPhoneNumbers = await page
      .locator('a[href="tel:+18883855513"]')
      .allTextContents();
    for (const text of displayedPhoneNumbers)
      expect(text.replace(/\s+/g, " ")).toContain("+1 (888) 385-5513");
    await page.locator(".shower-faq").scrollIntoViewIfNeeded();
    if (width > 900) await expect(phone).toBeInViewport({ ratio: 1 });
    for (const photo of await page.locator(".shower-unit-grid img").all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect(photo).toHaveJSProperty("complete", true);
      expect(
        await photo.evaluate((i: HTMLImageElement) => i.naturalWidth),
      ).toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    expect(
      await page
        .locator(".shower-hero-image img")
        .evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/temporary-shower-rental-${width}.png`,
      fullPage: true,
    });
  });
test("mobile menu supports keyboard and Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".mobile-nav > summary").focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await expect(page.locator(".contact-rail")).not.toBeVisible();
  await expect(page.locator(".mobile-call")).not.toBeVisible();
  await page.locator(".mobile-services > summary").click();
  const kitchenCategory = page.locator(".mobile-service-category").first();
  await kitchenCategory.locator("> summary").click();
  await expect(
    kitchenCategory.getByRole("link", { name: "24ft Mobile Kitchen Trailer" }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/services-menu-mobile.png" });
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).not.toBeVisible();
  await expect(page.locator(".contact-rail")).toBeVisible();
  await expect(page.locator(".mobile-call")).not.toBeVisible();
});

test("desktop inventory menu exposes clear rental categories", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const trigger = page.locator(".services-trigger");
  await expect(trigger).toContainText("Inventory");
  await trigger.click();
  const menu = page.getByRole("group", { name: "Equipment rental inventory menu" });
  await expect(menu).toBeVisible();
  await expect(menu.locator(".service-category")).toHaveCount(10);
  await expect(
    menu.getByRole("button", { name: "Shower and Restroom Combination Trailers", exact: true }),
  ).toBeVisible();
  await menu.getByRole("button", { name: "Shower and Restroom Combination Trailers", exact: true }).click();
  await expect(
    menu.getByRole("link", {
      name: "30 ft Luxury Combination Trailer, 8 Stalls",
    }),
  ).toBeVisible();
  await expect(
    menu.getByRole("button", {
      name: "Sleeper",
      exact: true,
    }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/services-menu-desktop.png" });
});

test("every service model in the desktop menu resolves locally", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.locator(".services-trigger").focus();
  const hrefs = await page
    .locator(".service-category-link, .service-submenu-links a")
    .evaluateAll((links) => [
      ...new Set(
        links.map((link) => link.getAttribute("href")).filter(Boolean),
      ),
    ]);
  expect(hrefs.length).toBeGreaterThanOrEqual(29);
  for (const href of hrefs) {
    const response = await request.get(href as string);
    expect(response.status(), href as string).toBe(200);
  }
});

test("service model pages provide unique planning content", async ({
  page,
}) => {
  await page.goto(
    "/services/shower-restroom-combination-trailers/22ft-6-stall/",
  );
  await expect(page.locator("h1")).toHaveText(
    "22 ft 6-Stall Shower and Restroom Combination Trailer Rental",
  );
  await expect(page).toHaveTitle(
    "22 ft 6-Stall Shower and Restroom Combination Trailer Rental | Temporary Shower Rental 123",
  );
  await expect(page.getByText("PLAN BEFORE DELIVERY")).toBeVisible();
});

for (const width of [390, 1440])
  test(`location hero presents nationwide coverage at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/service-areas/");
    await expect(page.locator(".location-hero h1")).toContainText(
      "USA Temporary Facilities Rental Service Areas",
    );
    await expect(page.locator("#project-location")).toBeVisible();
    await expect(
      page.locator(".coverage-map-stage .map-land path"),
    ).toHaveCount(50);
    await expect(page.locator("#coverage-map-title")).toHaveText(
      "Find your state",
    );
    await expect(page.locator(".coverage-map-topline strong")).toHaveText(
      "50 states",
    );
    await expect(
      page.getByLabel("Choose your state", { exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.locator("#service-area-map").screenshot({
      path: `test-results/location-coverage-${width}.png`,
    });
  });

test("desktop navigation follows the requested order", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(
    page.locator(
      ".header > nav > a, .header > nav > .services-nav > .services-trigger",
    ),
  ).toHaveText([
    "Home",
    "Inventory ⌄",
    "Service Areas",
    "Rental Calculator",
    "About Us",
    "Contact Us",
  ]);
});

test("Contact Us opens an in-page project drawer", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const trigger = page.locator('.header > nav a[href="/contact-us/"]');
  await trigger.click();
  await expect(page).toHaveURL(/\/$/);
  const drawer = page.getByRole("dialog", { name: "Request availability" });
  await expect(drawer).toBeVisible();
  await expect(drawer.locator('input[name="name"]')).toBeVisible();
  await expect(drawer.locator('input[name="startDate"]')).toBeVisible();
  await expect(drawer.locator('select[name="service"]')).toBeVisible();
  await page.waitForTimeout(350);
  await page.screenshot({ path: "test-results/contact-drawer-desktop.png" });
  await drawer.getByRole("button", { name: "Close contact form" }).click();
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("mobile Contact Us tab opens the drawer without navigating", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/equipment-rental/");
  await page.locator(".contact-rail").click();
  await expect(page).toHaveURL(/\/equipment-rental\/$/);
  const drawer = page.getByRole("dialog", { name: "Request availability" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link", { name: /Call now/ })).toContainText(
    "+1 (888) 385-5513",
  );
  expect(
    await drawer.evaluate(
      (element) => element.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page.waitForTimeout(350);
  await page.screenshot({ path: "test-results/contact-drawer-mobile.png" });
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
});

test("homepage FAQ is keyboard operable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const firstQuestion = page.locator(".shower-faq-list details").first();
  const summary = firstQuestion.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(firstQuestion).toHaveAttribute("open", "");
  await expect(firstQuestion.locator("p")).toBeVisible();
  await expect(firstQuestion.locator("p")).toContainText(
    "project-specific quote",
  );
});

test("homepage shows eight rental options with distinct, described photos", async ({
  page,
}) => {
  await page.goto("/");
  const cards = page.locator(".shower-unit-card");
  await expect(cards).toHaveCount(8);
  await expect(cards.locator("h3")).toHaveText(homepageServiceNames);
  await expect(page.locator(".shower-intro + .shower-units")).toHaveCount(1);
  await expect(page.locator(".shower-hero-panel > p")).toContainText(
    "mobile shower trailers, shower and restroom combination trailers, mobile kitchens, man camp and workforce housing units, refrigeration and freezer trailers, and temporary dishwashing facilities",
  );
  const familyLabels = await cards.locator(".shower-kicker").allTextContents();
  expect(familyLabels.slice(0, 2)).toEqual(["SHOWER TRAILERS", "SHOWER CONTAINERS"]);
  expect(familyLabels.filter((label) => label.startsWith("SHOWER "))).toHaveLength(2);
  expect(2 / familyLabels.length).toBe(0.25);
  await expect(cards.locator(".text-link")).toHaveCount(8);
  for (const rentalLink of await cards.locator(".text-link").all()) {
    await expect(rentalLink).toContainText("Explore this option");
    await expect(rentalLink).not.toHaveAttribute("href", /^tel:/);
  }
  const photos = page.locator(".shower-home img");
  await expect(photos).toHaveCount(9);
  const sources = await photos.evaluateAll((images) =>
    images.map((image) => image.getAttribute("src")),
  );
  expect(sources.every(Boolean)).toBe(true);
  expect(new Set(sources).size).toBe(8);
  expect(sources[0]).toBe(sources[1]);
  for (const photo of await photos.all())
    await expect(photo).toHaveAttribute("alt", /\S/);
});

for (const width of [390, 1440])
  test(`homepage rental links resolve and remain usable at ${width}px`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const links = page.locator(".shower-unit-card .text-link");
    await expect(links).toHaveCount(8);
    for (const href of await links.evaluateAll((anchors) =>
      anchors.map((anchor) => anchor.getAttribute("href")),
    )) {
      expect(href).toBeTruthy();
      const response = await request.get(href!);
      expect(response.status(), href!).toBe(200);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });

test("FAQ and equipment navigation work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4173";
  await page.goto(`${baseUrl}/`);
  await expect(page.locator(".shower-unit-card:visible")).toHaveCount(8);
  await page.locator(".shower-faq-list summary").first().click();
  await expect(page.locator(".shower-faq-list p").first()).toBeVisible();
  await page.locator(".shower-unit-card .text-link").first().click();
  await expect(page).toHaveURL(/equipment-rental\/shower-trailer/);
  await context.close();
});

for (const width of [320, 768, 1024, 1440]) {
  test(`shared templates stay within viewport at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/contact-us/",
      "/equipment-rental/",
      "/equipment-rental/mobile-kitchen-trailers/",
      "/service-areas/",
      "/planning/",
      "/about-us/",
      "/blog/",
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path,
      ).toBe(true);
      await expect(page.locator("h1")).toHaveCount(1);
    }
  });
}
test("reduced motion removes entry animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".shower-hero-panel")).toHaveCSS(
    "animation-name",
    "none",
  );
  expect(
    await page
      .locator(".header-contact")
      .evaluate(
        (element) => getComputedStyle(element, "::after").animationName,
      ),
  ).toBe("none");
});
test("location planner carries the selected place into the kitchen inquiry", async ({
  page,
}) => {
  await page.goto("/service-areas/");
  await page
    .getByLabel("Project city and state", { exact: true })
    .fill("Akiak, Alaska");
  await page.getByRole("button", { name: "Explore mobile kitchens" }).click();
  await expect(page.locator("h1")).toHaveText(/Akiak, Alaska/);
  await expect(page.locator("h1")).toHaveText(/(Rental|Lease|Facilities)/);
  await expect(page.locator("[data-project-location]")).toHaveText(
    "Akiak, Alaska",
  );
  await page
    .getByRole("link", { name: "Discuss your kitchen project" })
    .click();
  await expect(
    page.locator('#contact-drawer input[name="location"]'),
  ).toHaveValue("Akiak, Alaska");
});
test("About Us and Blog provide dedicated search-focused content", async ({
  page,
}) => {
  await page.goto("/about-us/");
  await expect(page.locator("h1")).toHaveText(
    "Clean facilities built around the work.",
  );
  await expect(page.locator(".about-service-grid article")).toHaveCount(4);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /clean, dependable shower and restroom facilities nationwide/i,
  );
  await page.goto("/blog/");
  await expect(page.locator("h1")).toContainText("Field notes");
  await expect(page.locator(".blog-grid article")).toHaveCount(3);
  await expect(page.locator(".blog-grid")).toContainText(
    "mobile kitchen trailer rental",
  );
});
test("Services keeps recovered service resources organized and reachable", async ({
  page,
}) => {
  await page.goto("/services/");
  const library = page.locator(".service-library");
  await expect(library).toBeVisible();
  await library.locator("summary").click();
  await expect(library.locator(".service-library-links a")).toHaveCount(45);
  await expect(library).toContainText("Base Camps for Rent");
});
test("contact keeps the phone fallback while online intake is disabled", async ({
  page,
}) => {
  await page.goto("/contact-us/");
  await expect(
    page
      .getByRole("link", {
        name: "Call +1 (888) 385-5513",
        exact: false,
      })
      .first(),
  ).toHaveAttribute("href", "tel:+18883855513");
  await expect(page.locator("#contact-drawer form")).toHaveCount(1);
  await expect(
    page.locator('#contact-drawer button[type="submit"]'),
  ).toBeDisabled();
  await expect(page.locator("#contact-drawer")).not.toBeVisible();
});
test("initial HTML and unknown-route status work without JavaScript", async ({
  request,
}) => {
  const home = await request.get("/");
  expect(home.status()).toBe(200);
  const html = await home.text();
  expect(html).toContain('id="shower-hero-title"');
  expect(html).toContain("Temporary Shower Trailer Rentals Nationwide");
  expect(html).toContain("Request a Quote");
  expect(html).toContain("View Rental Equipment");
  expect(html).not.toContain("April");
  const missing = await request.get("/missing-synthetic-test-page/");
  expect(missing.status()).toBe(404);
});
