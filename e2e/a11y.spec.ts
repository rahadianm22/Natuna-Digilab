import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const paths = ["/", "/docs", "/foundation", "/components", "/components/button", "/components/input", "/components/tabs", "/themes", "/naming", "/privacy", "/ask"];

for (const mode of ["light", "dark"] as const) {
  for (const path of paths) {
    test(`axe: ${path} (${mode})`, async ({ page }) => {
      await page.addInitScript((m) => localStorage.setItem("theme", m), mode);
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      // A cold dev cache can surface Turbopack's error overlay while it compiles the route for the
      // first time. Production builds have no overlay, so reload once and measure the real page.
      if (await page.getByRole("dialog", { name: /error/i }).count()) {
        await page.reload();
        await page.waitForLoadState("networkidle");
      }
      // Let one-off entrance animations settle, so contrast is measured at full opacity.
      await page.waitForFunction(() =>
        document
          .getAnimations()
          // Scroll-linked animations never finish on their own, so only time-based ones are awaited.
          .every(
            (a) =>
              !(a.timeline instanceof DocumentTimeline) ||
              a.playState !== "running" ||
              a.effect?.getComputedTiming().endTime === Infinity,
          ),
      );
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag2aaa"]).analyze();
      const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`);
      expect(summary).toEqual([]);
    });
  }
}
