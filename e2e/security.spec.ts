import { expect, test } from "@playwright/test";

// The Content-Security-Policy only ships in production builds (development needs eval and a websocket), so those
// checks run in CI and whenever PLAYWRIGHT_BASE_URL points at a built server.
const production = !!process.env.CI || !!process.env.PLAYWRIGHT_BASE_URL;

test("security headers are sent on pages and on 404s", async ({ request }) => {
  for (const path of ["/", "/components/button", "/__not-a-page__"]) {
    const res = await request.get(path);
    const h = res.headers();
    expect(h["x-content-type-options"], path).toBe("nosniff");
    expect(h["x-frame-options"], path).toBe("DENY");
    expect(h["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
    expect(h["cross-origin-opener-policy"], path).toBe("same-origin");
    expect(h["strict-transport-security"], path).toContain("max-age=");
    expect(h["permissions-policy"], path).toContain("camera=()");
    expect(h["permissions-policy"], path).toContain("clipboard-write=(self)");
    expect(h["x-powered-by"], path).toBeUndefined();
  }
});

test.describe("production CSP", () => {
  test.skip(!production, "the CSP is not sent by the dev server");

  test("policy locks scripts, frames, plugins, base and forms to this origin", async ({ request }) => {
    const csp = (await request.get("/")).headers()["content-security-policy"] ?? "";
    for (const d of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", "connect-src 'self'"]) {
      expect(csp).toContain(d);
    }
    expect(csp).not.toMatch(/\*|https?:/);
    expect(csp).not.toContain("unsafe-eval");
  });

  test("no page breaks its own policy, and third-party loads are blocked", async ({ page }) => {
    const violations: string[] = [];
    await page.exposeFunction("report", (v: string) => violations.push(v));
    await page.addInitScript(() => document.addEventListener("securitypolicyviolation", (e) => (window as unknown as { report: (v: string) => void }).report(`${e.effectiveDirective} ${e.blockedURI}`)));
    for (const path of ["/", "/components", "/components/button", "/foundation", "/build-report", "/themes"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect(violations).toEqual([]);

    const blocked = await page.evaluate(async () => {
      const seen: string[] = [];
      document.addEventListener("securitypolicyviolation", (e) => seen.push(e.effectiveDirective));
      const s = document.createElement("script");
      s.src = "https://example.com/x.js";
      document.head.appendChild(s);
      const f = document.createElement("iframe");
      f.src = "https://example.com/";
      document.body.appendChild(f);
      await new Promise((r) => setTimeout(r, 800));
      return seen.sort();
    });
    expect(blocked).toEqual(expect.arrayContaining(["script-src-elem", "frame-src"]));
  });
});
