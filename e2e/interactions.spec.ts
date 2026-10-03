import { expect, test } from "@playwright/test";

test("every main nav link opens its page", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" }).first();
  for (const [label, heading] of [
    ["Introduction", "Introduction"],
    ["Foundation", "Foundation"],
    ["Components", "Components"],
    ["Themes", "Themes"],
  ]) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  }
});

test("copy to Figma puts valid, layered SVG on the clipboard", async ({ page }) => {
  for (const slug of ["button", "accordion", "tabs"]) {
    await page.goto(`/components/${slug}`);
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Copy to Figma" }).click();
    await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
    const svg = await page.evaluate(() => navigator.clipboard.readText());
    const result = await page.evaluate((s) => {
      const doc = new DOMParser().parseFromString(s, "image/svg+xml");
      return {
        valid: !doc.querySelector("parsererror"),
        layers: doc.querySelectorAll("[id]").length,
        texts: [...doc.querySelectorAll("text")].map((t) => t.textContent),
      };
    }, svg);
    expect(result.valid).toBe(true);
    expect(result.layers).toBeGreaterThan(2);
    expect(result.texts.length).toBeGreaterThan(0);
    if (slug === "accordion") expect(result.texts).not.toContain("Limits depend on your account type.");
  }
});

test("theme toggle switches and remembers the mode", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const before = await html.evaluate((el) => el.classList.contains("dark"));
  await page.getByRole("button", { name: /Switch to (dark|light) mode/ }).click();
  await expect(html).toHaveClass(before ? /^((?!dark).)*$/ : /dark/);
  await page.reload();
  const after = await html.evaluate((el) => el.classList.contains("dark"));
  expect(after).toBe(!before);
});

test("component page: live demo, JS/TS tabs, copy, expand", async ({ page }) => {
  await page.goto("/components/button");
  await page.waitForLoadState("networkidle");
  const usage = page.locator("section", { has: page.getByRole("heading", { name: "Usage" }) });
  // Loading keeps the label and the width, so neighbours do not move.
  const remove = usage.getByRole("button", { name: "Delete account" });
  const before = await remove.boundingBox();
  await remove.click();
  await expect(remove).toHaveAttribute("aria-busy", "true");
  await expect(remove).toBeDisabled();
  expect((await remove.boundingBox())?.width).toBe(before?.width);
  await expect(remove).not.toHaveAttribute("aria-busy", "true", { timeout: 4000 });
  await expect(usage.getByRole("button", { name: "Unavailable" })).toBeDisabled();

  const ts = usage.getByRole("tab", { name: "TS" }).first();
  await expect(ts).toHaveAttribute("aria-selected", "true");
  await expect(usage.getByText("useState<boolean>(false)").first()).toBeVisible();
  await ts.press("ArrowRight");
  await expect(usage.getByRole("tab", { name: "JS" }).first()).toHaveAttribute("aria-selected", "true");
  await expect(usage.getByText("useState<boolean>")).toHaveCount(0);

  await usage.getByRole("button", { name: "Expand code" }).click();
  await expect(usage.getByRole("button", { name: "Collapse code" })).toHaveAttribute("aria-expanded", "true");
  await usage.getByRole("button", { name: "Copy", exact: true }).click();
  await expect(usage.getByRole("button", { name: "Copied" })).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("useState(false)");
  expect(copied).toContain('from "@/ui"');
  expect(copied).not.toContain("useState<boolean>");
});

test("home hero phone: validation, send flow, and screen mode switch", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const screen = page.locator("div.theme-dark, div.theme-light").first();
  await expect(screen).toHaveClass(/theme-light/);
  await page.getByRole("button", { name: "dark", exact: true }).click();
  await expect(page.locator("div.theme-dark").first()).toBeVisible();

  const amount = page.getByLabel("Amount in rupiah");
  await amount.fill("9999999");
  await expect(amount).toHaveValue("9.999.999");
  await page.getByRole("button", { name: "Send Rp 9.999.999" }).click();
  await expect(page.getByText("That is more than your balance of Rp 2.450.000.")).toBeVisible();

  await page.getByRole("button", { name: "100k" }).click();
  await expect(amount).toHaveValue("100.000");
  await page.getByRole("button", { name: "Send Rp 100.000" }).click();
  await expect(page.getByRole("button", { name: /^Send Rp/ })).toHaveAttribute("aria-busy", "true");
  await expect(page.getByRole("status").filter({ hasText: "sent to Rina Putri" })).toBeVisible();
  await page.getByRole("button", { name: "Send another" }).click();
  await expect(amount).toBeVisible();
});

test("design-only component has no code tab", async ({ page }) => {
  await page.goto("/components/tabs");
  await expect(page.getByRole("tab", { name: "code" })).toHaveCount(0);
  await expect(page.getByText("The React component is not built yet")).toBeVisible();
});

test("sidebar groups open and close", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/components/button");
  const aside = page.locator("aside");
  const form = aside.getByRole("button", { name: /^Molecules/ });
  await expect(form).toHaveAttribute("aria-expanded", "false");
  await form.click();
  await expect(form).toHaveAttribute("aria-expanded", "true");
  await expect(aside.getByRole("link", { name: "Accordion" })).toBeVisible();
  await form.click();
  await expect(aside.getByRole("link", { name: "Accordion" })).toBeHidden();
});

test("command search: Ctrl+K, type, Enter, Escape", async ({ page }) => {
  await page.goto("/");
  // The shortcut listener attaches on hydration; a key pressed before that is lost.
  await page.waitForLoadState("networkidle");
  await page.keyboard.press("Control+k");
  const box = page.getByRole("combobox", { name: "Search components, pages, and tokens" });
  await expect(box).toBeFocused();
  await box.fill("input");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/components\/input$/);

  // The new page mounts its own header, so retry until its shortcut listener is live.
  await expect(async () => {
    await page.keyboard.press("Control+k");
    await expect(box).toBeVisible({ timeout: 500 });
  }).toPass();
  await page.keyboard.press("Escape");
  await expect(box).toBeHidden();

  // Tokens are searchable by hex, and by the old component alias.
  await page.keyboard.press("Control+k");
  await box.fill("#026acc");
  await expect(page.getByRole("option", { name: /Azure Blue 700/ })).toBeVisible();
  await box.fill("autocomplete");
  await expect(page.getByRole("option", { name: /^Combobox/ })).toBeVisible();

  await box.fill("zzzzzz");
  await expect(page.getByText(/Nothing matches/)).toBeVisible();
});

test("overview filter and status chips", async ({ page }) => {
  await page.goto("/components");
  await page.getByRole("searchbox", { name: "Search components" }).fill("zzzz");
  await expect(page.getByText("No components found")).toBeVisible();
  await page.getByRole("searchbox", { name: "Search components" }).fill("");
  await page.getByRole("button", { name: /^Ready/ }).click();
  await expect(page.getByRole("link", { name: /^Button/ }).first()).toBeVisible();
  await expect(page.getByText("Tabs", { exact: true })).toHaveCount(0);
});

test("foundation swatch copies its hex", async ({ page }) => {
  await page.goto("/foundation");
  await page.getByRole("button", { name: /^600, anchor, #0276e3/ }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("#0276e3");
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test("no horizontal overflow on any page", async ({ page }) => {
    for (const path of ["/", "/docs", "/foundation", "/components", "/components/button", "/themes", "/templates", "/privacy"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
    }
  });

  test("header menu opens and navigates", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.locator("#mobile-nav").getByRole("link", { name: "Introduction" }).click();
    await expect(page).toHaveURL(/\/docs$/);
  });

  test("component list is reachable", async ({ page }) => {
    await page.goto("/components/button");
    await page.getByRole("button", { name: /All components/ }).click();
    await page.locator("#mobile-components").getByRole("button", { name: /^Molecules/ }).click();
    await page.locator("#mobile-components").getByRole("link", { name: "Input", exact: true }).click();
    await expect(page).toHaveURL(/\/components\/input$/);
  });
});
