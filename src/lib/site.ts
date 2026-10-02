export const REPO_URL = "https://github.com/natunadigilab/WebsiteNatunaDigilab";
export const ISSUES_URL = `${REPO_URL}/issues`;
export const FIGMA_COMMUNITY_URL =
  "https://www.figma.com/community/file/1660946308636540525/natuna-digilab-foundation-design-system";

// Date of the Notion tracker snapshot in natuna-tracker.ts.
export const TRACKER_SNAPSHOT = "30 September 2026";

// Public origin for the sitemap and share image. NEXT_PUBLIC_SITE_URL wins; on Vercel the production domain is
// provided automatically; locally it falls back to localhost.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
