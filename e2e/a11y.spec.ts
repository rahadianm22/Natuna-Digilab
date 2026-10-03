import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const paths = ["/", "/docs", "/foundation", "/components", "/components/button", "/components/input", "/components/tabs", "/themes", "/templates", "/privacy"];

for (const mode of ["light", "dark"] as const) {
  for (const path of paths) {
    test(`axe: ${path} (${mode})`, async ({ page }) => {
      await page.addInitScript((m) => localStorage.setItem("theme", m), mode);
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      // Let one-off entrance animations settle, so contrast is measured at full opacity.
      await page.waitForFunction(() =>
        document
          .getAnimations()
          .every((a) => a.playState !== "running" || a.effect?.getComputedTiming().endTime === Infinity),
      );
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`);
      expect(summary).toEqual([]);
    });
  }
}
