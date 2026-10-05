# Review 006: performance, SEO and code quality

Branch `redesign-docs-site` at commit `9941562`. Next.js 16.2.12 (Turbopack), React 19.2.4.

## How this was measured

- `npm run build` succeeded: 70 static pages, including 56 SSG component pages. `tsc --noEmit` and `eslint src` are clean.
- The live chunk hashes on https://natunadigilab.vercel.app/ match the local `.next/static/chunks` build, so local chunk contents map to what production serves.
- Playwright drove Edge against production. Desktop ran at 1440x900. Mobile ran at 412x915 with 4x CPU throttling. LCP and CLS come from `PerformanceObserver`. Byte counts come from CDP `encodedDataLength` (brotli, on the wire).

| Page (desktop, warm cache) | LCP | CLS | JS (br) | Scripts | Requests | Fonts |
|---|---|---|---|---|---|---|
| `/` | 0.9-2.9 s (2.9 s on a cold `PRERENDER` hit) | 0 | 245 KB | 15 | 48 | 57.6 KB / 4 |
| `/components` | 0.89 s | 0 | 259 KB | 16 | 104 | 57.6 KB / 4 |
| `/components/button` | 0.85 s | 0 | 259 KB | 16 | 138 | 57.6 KB / 4 |
| `/components/date-picker` | 0.86 s | 0 | 259 KB | 16 | 132 | 57.6 KB / 4 |
| `/foundation` | 0.93 s | 0 | 243 KB | 14 | 41 | 57.6 KB / 4 |

The site is fast already. CLS is 0 on every page, and TBT is 0-53 ms on mobile at 4x CPU. The findings below are about bytes the site sends but does not need, plus SEO gaps and maintainability.

---

## 1. HIGH: IBM Plex Mono is downloaded on every page and never used

**Where:** `src/app/layout.tsx:2`, `:14-18`, `:39`; `src/app/globals.css:306-310`

**Evidence:**
- Every page's `<head>` preloads 4 fonts. Three of them are Plex Mono latin at weights 400, 500 and 600 (`99e609270109b47d…`, `effe91970fc4db64…`, `23b7a97ae3b5c134…`), about 10 KB each.
- On the live site that is 30.2 KB of the 57.6 KB font transfer, on every page.
- `document.fonts` lists only Urbanist as loaded on `/`, `/components/button` and `/foundation`.
- Nothing reads `--font-code`. Commit `b107df0` changed `.font-mono-code` to `var(--font-urbanist)`, and `--font-mono` in `@theme` points at Urbanist too.
- Chrome logs "preloaded but not used" for these files.

The comment at `layout.tsx:12-13` is now wrong too: it still says Plex is used for code. In the working tree, the CSS comment at `globals.css:306` already says Urbanist.

**Fix:** pick one of these.
- **Urbanist everywhere (current intent):** delete the `IBM_Plex_Mono` import, the `plexMono` const and `${plexMono.variable}`, and correct the layout comment. In `src/lib/dom-to-svg.ts:48` and `:163`, drop the `MONO` branch.
- **Plex for code (the original intent):** set `.font-mono-code { font-family: var(--font-code), ui-monospace, monospace; }`. Pass `preload: false` to `IBM_Plex_Mono` so it stops competing with the LCP text font on pages that show no code.

---

## 2. HIGH: every page ships the full component catalogue, prose included, to the browser, twice over

**Where:**
- `src/components/Header.tsx:1,8`: the header is `"use client"` and imports `CommandSearch`.
- `src/components/CommandSearch.tsx:6-7,73-83`: imports `components` and `palettes`.
- `src/components/ComponentSidebar.tsx:7`
- `src/lib/components-data.ts` (32 KB source)

**Evidence:**
- One client module of 50.6 KB raw, 13.4 KB br, holds `components-data`, `natuna-tracker`, `natuna-palette` and `CommandSearch`. It sits in chunk `0nu-7oh6d-v16.js` (26.7 KB br), which 61 prerendered pages reference.
- The bundle includes each component's `usage`, `do` and `dont` prose: 16.8 KB of string data, plus 3.5 KB of `summary`. For example, "Reserve primary for the single most important action…" is in the client chunk. Search only uses `slug`, `name`, `tags`, group and status.
- Turbopack emits the same 18 modules a second time as `117adj1__10uv.js` (26.7 KB br) for `/foundation`, `/naming`, `/privacy` and `/themes`.
- On the live home page both chunks download, because link prefetch pulls the second one. That is 53 KB br of duplicated code and data.

**Fix:**
- Build a small search index on the server, for example `src/lib/search-index.ts` exporting `{ href, title, group, note, keywords }[]`. Pass it to `CommandSearch` as a prop instead of importing `components-data` in a client file.
- Make `Header` a Server Component. Keep only the mobile-menu toggle, `ThemeToggle` and `CommandSearch` as small client islands. The `"use client"` boundary then stops pulling data modules into the bundle.
- Do the same for `ComponentSidebar`: pass `{ slug, name, tags, group, status }[]` as a prop.
- Optionally load the dialog body with `next/dynamic` on the first Ctrl K or click.

---

## 3. MEDIUM: `/components` hydrates all 56 static previews

**Where:** `src/components/ComponentOverview.tsx:1,6,88`

**Evidence:**
- `ComponentOverview` is a client component because of the search field and status filter.
- It imports `ComponentPreview` (650 lines of static JSX), which brings all 56 previews and 22 Phosphor icons into chunk `2dbla0rwtfcib.js`: 75 KB raw, 17.4 KB br, only on `/components`.
- The same previews are already server-rendered on each `[slug]` page through `@phosphor-icons/react/ssr`.

**Fix:**
- Render the cards in `src/app/components/page.tsx`, which is a Server Component, and pass them to the client filter as `children`, or as `Record<slug, ReactNode>`.
- The client part then only shows or hides cards by `data-status` and `data-name`. The previews stay as server HTML and their code leaves the bundle.

---

## 4. MEDIUM: no canonical URL and no `og:url` on any page

**Where:**
- `src/app/layout.tsx:21-30`
- every `export const metadata` in `src/app/*/page.tsx`
- `src/app/components/[slug]/page.tsx:27-32`

**Evidence:** fetched the live HTML of `/`, `/components/button`, `/foundation`, `/naming` and `/templates`. None has `<link rel="canonical">` or `og:url`. `metadataBase` is set, so relative paths would resolve to the right host.

**Fix:**
- Add `alternates: { canonical: "/foundation" }` to each page's metadata, and so on per page. In `generateMetadata` for components, return `alternates: { canonical: \`/components/${slug}\` }`.
- Next 16 merges metadata **shallowly** (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`, "Merging"). A page that adds `openGraph: { url }` replaces the layout's `siteName` and `type`.
- To avoid that, export a shared `baseOpenGraph` from `src/lib/site.ts` and spread it: `openGraph: { ...baseOpenGraph, url: "/foundation" }`.

---

## 5. MEDIUM: component status is defined in three places, and the hand-written status is overwritten at import

**Where:**
- `src/lib/components-data.ts:662-672`: the `trackerStatus` map plus a `for` loop that mutates `c.status`.
- `src/lib/components-data.ts:674-689`: `statusText` and `statusTone`.
- `src/lib/natuna-tracker.ts:19-41`: `statusLabel` and `statusStyle`.
- `src/app/page.tsx:17`: `groupOf`.

**Evidence:**
- All 56 entries in `components-data.ts` carry a literal `status: "…"`. The loop at `:669` replaces every one at module load, so those 56 values never take effect. They mislead anyone who edits them.
- `statusLabel` and `statusStyle` repeat `statusText` and `statusTone` string for string for the four tracked states.
- `ComponentOverview.tsx:7-12` and `[slug]/page.tsx:16` import both pairs and mix them; `ComponentOverview.tsx:50-51` and `:65-66` are examples.
- The home page builds a third mapping from tracker status to ready, progress and planned.

**Fix:**
- Remove `status` from the `ComponentMeta` literal type and the data.
- Export one `statusOf(slug): ComponentStatus` built from `trackerStatus`.
- Define `statusLabel` and `statusStyle` once, keyed by `ComponentStatus`, and look tracker rows up through `trackerStatus[row.status]`.
- On the home page, derive `groupOf` from the same function.
- Avoid module-level mutation of exported arrays. Compute `components` with `.map()` instead.

---

## 6. MEDIUM: the Copy to Figma SVG has duplicate `id`s in every export

**Where:** `src/lib/dom-to-svg.ts:86-109` (`numberIds`), `:122-127` (`id`), `:353-355` (clip ids)

**Evidence:** clicked Copy to Figma on 10 live component pages and parsed the clipboard with `DOMParser`. The XML parses, but ids repeat in 9 of 10 exports:

| Page | Duplicate ids |
|---|---|
| `transaction-list-item` | 7 |
| `button` | 5 |
| `navigation-bar` | 4 |
| `table` | 3 |
| `accordion` | 2 |

This is by design: layer names live in `id`, and numbering restarts in each group. Figma tolerates it. The **Download SVG** file, however, is not valid SVG, because `id` must be unique. Clip paths also use `id="clip-N"` in the same namespace as layer names. A layer whose text is "clip-1" would make `url(#clip-1)` resolve to the wrong element.

Two smaller fragile spots in the same file:
- `:223` reads `parseFloat(cs.rotate)`, which returns 0 for the axis form (`"0 0 1 90deg"`) and misreads `turn` units.
- `:225` only matches `matrix(`, so `matrix3d(` transforms are ignored.

**Fix:**
- Keep the readable name in `data-name` and give each `id` a unique suffix in `numberIds`, for example a global counter. Figma reads `id` as the layer name, so check that Figma's import accepts `data-name`, or `<title>` per group, before switching.
- At minimum, make ids unique in the downloaded file and prefix clip ids with a character that `id()` strips, such as `__clip-1`, so they cannot collide with a layer name.
- For rotation, take the last token of `cs.rotate` and convert units, or use `new DOMMatrix(cs.transform)`, which handles both `matrix` and `matrix3d`.

---

## 7. LOW: the SVG converter loads up front although it only runs on click

**Where:**
- `src/components/home/FigmaPanel.tsx:5,17-26`
- `src/components/FigmaFrame.tsx:5,32-50`

**Evidence:**
- `dom-to-svg` is a 9.4 KB raw, 3.8 KB br module in the home chunk `16kf2opkxg90d.js`. The component-page chunk `2_4_teonx0-wz.js` also contains it (`natuna-icon-id` marker).
- It is parsed on every visit but only runs when someone clicks Copy to Figma.
- `FigmaPanel` copies `FigmaFrame`'s copy-and-status logic, without its `clearTimeout`, so repeated clicks make the label flicker. `HeroBento.tsx:47-53` also leaves its 900 ms timer running on unmount.

**Fix:**
- In the click handler, use `const { domToSvg } = await import("@/lib/dom-to-svg")`. To keep the clipboard call inside the user-activation window, warm the import on `pointerenter` or `focus`.
- Reuse one `useFigmaExport(ref, name)` hook in both components.
- Clear timers in an effect cleanup.

---

## 8. LOW: no structured data

**Where:** `src/app/layout.tsx`, `src/app/components/[slug]/page.tsx:71-83`

**Evidence:** the live HTML of all 5 sampled pages has no `application/ld+json`. Component pages already render a visual breadcrumb (Components / Atoms).

**Fix:**
- Following `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`, render `<script type="application/ld+json">` with `JSON.stringify(data).replace(/</g, "\\u003c")`.
- Use `WebSite` plus `Organization` (name, url, logo, `sameAs: [REPO_URL, FIGMA_COMMUNITY_URL]`) in the root layout.
- Use `BreadcrumbList` on each `/components/[slug]` page, matching the visible breadcrumb.

---

## 9. LOW: the sitemap has no `lastModified`, and all 63 pages share one share image

**Where:** `src/app/sitemap.ts:5-10`, `src/app/opengraph-image.tsx`

**Evidence:**
- The live `/sitemap.xml` has 63 `<loc>` entries and no `<lastmod>`.
- Every sampled page, including `/components/button`, points `og:image` at the same `/opengraph-image?1a1017e2c3003898`, with alt text "Natuna Digilab, the design system for digital products".
- The host is correct in production (`https://natunadigilab.vercel.app`).

**Fix:**
- Add `lastModified`. Use the tracker snapshot date for component pages (export it as an ISO string beside `TRACKER_SNAPSHOT`) and the build date elsewhere.
- Add `src/app/components/[slug]/opengraph-image.tsx` that renders the component name and status, using `generateStaticParams` so the 56 images are built once.

---

## 10. LOW: component pages fire 99 prefetch requests after load

**Where:** `src/components/ComponentSidebar.tsx:83`, `src/app/components/[slug]/page.tsx:220`

**Evidence:**
- On live `/components/button` at desktop width there are 99 RSC prefetch requests (162 KB) for 25 routes.
- 19 of those routes are sidebar links that are visible inside the scrolling `aside`.
- Next 16 segment prefetch sends about 4 requests per route (`_tree`, `_head`, layout, `__PAGE__`).
- The page itself needs only 39 requests. LCP is not affected, but on a metered phone connection this is waste.

**Fix:** set `prefetch={false}` on sidebar and "Related" links. Per `node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md:339`, the App Router still prefetches those links on hover, so navigation stays instant for links people point at. Keep default prefetch on the top nav.

---

## 11. LOW: dead exports, leftover starter assets and an import after a statement

**Where and evidence:**
- `src/lib/components-data.ts:19` (`categories`) and `:711` (`componentsByCategory`) have no references in `src/` or `e2e/`.
- `src/components/demos.tsx:100` exports `demos`, but only the same file uses it.
- `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg` and `window.svg` are create-next-app leftovers from the initial commit `0a52768`. Nothing references them, yet they are served at the site root.
- `src/app/components/[slug]/page.tsx:18-19` declares `const LAST_BUILD_DAY` between two `import` lines.

**Fix:**
- Delete the two dead exports.
- Make `demos` module-private.
- Remove the five SVGs.
- Move line 18 below the imports.

---

## Not raised

These were checked and are fine:
- Phosphor icons tree-shake correctly; each client chunk carries only the icons it uses.
- `robots.txt` and the sitemap point at the production host.
- `/templates` is `noindex, follow`.
- Unknown routes return 404.
- Layout shift is 0 on every page.
- TBT stays under 55 ms at 4x CPU.
