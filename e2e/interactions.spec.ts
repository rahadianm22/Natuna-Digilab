import { expect, test } from "@playwright/test";

test("every main nav link opens its page", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" }).first();
  for (const [label, heading] of [
    ["Docs", "Introduction"],
    ["Foundation", "Foundation"],
    ["Components", "Components"],
    ["Themes", "Themes"],
  ]) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
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
  await usage.getByRole("button", { name: "Clicked 0" }).click();
  await expect(usage.getByRole("button", { name: "Clicked 1" })).toBeVisible();
  await usage.getByRole("button", { name: "Reset" }).click();
  await expect(usage.getByRole("button", { name: "Clicked 0" })).toBeVisible();
  await usage.getByRole("button", { name: "Delete" }).click();
  await expect(usage.getByRole("button", { name: "Deleting" })).toBeDisabled();

  const ts = usage.getByRole("tab", { name: "TS" });
  await expect(ts).toHaveAttribute("aria-selected", "true");
  await expect(usage.getByText("useState<number>(0)")).toBeVisible();
  await ts.press("ArrowRight");
  await expect(usage.getByRole("tab", { name: "JS" })).toHaveAttribute("aria-selected", "true");
  await expect(usage.getByText("useState<number>")).toHaveCount(0);

  await usage.getByRole("button", { name: "Expand code" }).click();
  await expect(usage.getByRole("button", { name: "Collapse code" })).toHaveAttribute("aria-expanded", "true");
  await usage.getByRole("button", { name: "Copy" }).click();
  await expect(usage.getByRole("button", { name: "Copied" })).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("useState(0)");
  expect(copied).not.toContain("useState<number>");
});

test("home transfer demo validates and reviews", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const amount = page.getByLabel("Amount");
  await amount.fill("30000000");
  await expect(amount).toHaveValue("30.000.000");
  await expect(page.getByText("The limit per transfer is Rp 25.000.000.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Review transfer" })).toBeDisabled();
  await amount.fill("150000");
  await page.getByRole("button", { name: "Pick a date" }).click();
  await expect(page.getByRole("button", { name: "Review transfer" })).toBeDisabled();
  await page.getByLabel("Transfer date").fill("2026-10-20");
  await page.getByRole("button", { name: "Review transfer" }).click();
  await expect(page.getByText("Ready to send")).toBeVisible();
  await expect(page.getByText("Rp 150.000")).toBeVisible();
  await page.getByRole("button", { name: "Edit transfer" }).click();
  await expect(page.getByLabel("Amount")).toHaveValue("150.000");
});

test("design-only component has no code tab", async ({ page }) => {
  await page.goto("/components/tabs");
  await expect(page.getByRole("tab", { name: "code" })).toHaveCount(0);
  await expect(page.getByText("The React component is not built yet")).toBeVisible();
});

test("sidebar categories open and close", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/components/button");
  const aside = page.locator("aside");
  const form = aside.getByRole("button", { name: /^Form/ });
  await expect(form).toHaveAttribute("aria-expanded", "false");
  await form.click();
  await expect(form).toHaveAttribute("aria-expanded", "true");
  await expect(aside.getByRole("link", { name: "Checkbox" })).toBeVisible();
  await form.click();
  await expect(aside.getByRole("link", { name: "Checkbox" })).toBeHidden();
});

test("command search: Ctrl+K, type, Enter, Escape", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const box = page.getByRole("combobox", { name: "Search components and pages" });
  await expect(box).toBeFocused();
  await box.fill("input");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/components\/input$/);

  await page.keyboard.press("Control+k");
  await expect(box).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(box).toBeHidden();

  await page.keyboard.press("Control+k");
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
    await page.locator("#mobile-nav").getByRole("link", { name: "Docs" }).click();
    await expect(page).toHaveURL(/\/docs$/);
  });

  test("component list is reachable", async ({ page }) => {
    await page.goto("/components/button");
    await page.getByRole("button", { name: /All components/ }).click();
    await page.locator("#mobile-components").getByRole("button", { name: /^Form/ }).click();
    await page.locator("#mobile-components").getByRole("link", { name: "Input", exact: true }).click();
    await expect(page).toHaveURL(/\/components\/input$/);
  });
});
