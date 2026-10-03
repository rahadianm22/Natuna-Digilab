import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const ci = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: true,
  // CI retries once so a slow runner does not fail a good build; a real failure fails twice.
  retries: ci ? 1 : 0,
  reporter: ci ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    // Locally this uses the Edge already installed, so no browser download is needed. CI installs
    // Playwright's Chromium instead, since runners have no Edge.
    channel: ci ? undefined : (process.env.PLAYWRIGHT_CHANNEL ?? "msedge"),
    permissions: ["clipboard-read", "clipboard-write"],
  },
  webServer: {
    // CI tests the production build, which is what ships; locally the dev server is faster to iterate on.
    command: ci ? "npm run start" : "npm run dev",
    url: baseURL,
    reuseExistingServer: !ci,
    timeout: 120_000,
  },
});
