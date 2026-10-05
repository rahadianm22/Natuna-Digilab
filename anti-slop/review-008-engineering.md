# Review 008: performance, SEO and code quality

Code reviewed at `edd4e67` on `redesign-docs-site`. Next.js 16.2.12 (Turbopack), React 19.2.4. Line numbers refer to `edd4e67`.

## How this was measured

**Which build is live.** Remote `main` is still `8388c35`. Production was not deployed from `main`.
- At the start of the audit, 10 of the 11 home-page chunks on https://natunadigilab.vercel.app/ were byte-identical (md5) to the local `.next` build. The 11th, the Turbopack runtime, differs only by Vercel's injected toolbar loader.
- That local build finished at 15:32:44. That is 30 s before `edd4e67` and before the `a04fb9b` demos change. So for `/components/button`, one 9.5 KB demos chunk differs: `28v0w8g-b2_sl.js` in production, `3ut1brfx3skhi.js` locally. The two have the same 12 modules and differ by 4 bytes.
- Another agent redeployed during the audit, with `2d0f849` or later: the home chunk changed and a "Documentation" group appeared in the search index.
- The shared chunks behind every finding below are identical in both deploys: `3pfedj4chfd95`, `1brgy3g-1ns99`, `2ifmb652v7jmr` and the framework chunks. The byte figures therefore hold for `edd4e67`.

**Tools.**
- Playwright drove Edge (`channel: "msedge"`) against production, with a fresh context for each run, cache disabled and 4x CPU throttling at both 1440x900 and 412x915 (DPR 2.625, touch).
- LCP, CLS and TBT come from `PerformanceObserver`. TBT is the sum of (long task − 50 ms) after FCP.
- Bytes are CDP `encodedDataLength`, which is on the wire (Vercel brotli).
- Prefetch counts come from requests that carry `Next-Router-Prefetch` or `Next-Router-Segment-Prefetch`, collected for 6 s after `load`.
- Payload sizes come from the production HTML and `RSC: 1` responses, plus `.next/server/app/*.segments`.

### Results at 4x CPU, cold cache, 3 runs each

| Route | Viewport | LCP (ms) | CLS | TBT (ms) | JS before load / total (KB br, scripts) | Doc (KB) | Fonts | Prefetch (req / KB / routes) |
|---|---|---|---|---|---|---|---|---|
| `/` | 1440 | 772 / 404 / 464 | 0 | 0 / 38 / 70 | 173.0 / 197.6 (15) | 19.5 | 27.4 KB / 1 | 19 / 74 / 5 |
| `/` | 412 | 1124 / 360 / 332 | 0 | 49 / 38 / 44 | 173.0 / 178.3 (12) | 19.5 | 27.4 KB / 1 | 11 / 47 / 3 |
| `/components/button` | 1440 | 1880* / 376 / 416 | 0 | 42 / 43 / 31 | 175.4 / 213.6 (17) | 23.7 | 27.4 KB / 1 | 24 / 87 / 6 |
| `/components/button` | 412 | 396 / 404 / 448 | 0 | 40 / 44 / 46 | 175.4 / 187.4 (12) | 23.7 | 27.4 KB / 1 | 8 / 38 / 2 |
| `/components` | 1440 | 1276* / 612 / 400 | 0 | 119 / 69 / 33 | 166.5 / 213.6 (17) | 30.3 | 27.4 KB / 1 | **71 / 226 / 18** |
| `/components` | 412 | 512 / 420 / 380 | 0 | 47 / 46 / 70 | 166.5 / 191.8 (13) | 30.3 | 27.4 KB / 1 | 25 / 82 / 6 |
| `/foundation` | 1440 | 1008* / 332 / 408 | 0 | 45 / 0 / 0 | 166.6 / 197.6 (15) | 26.8 | 27.4 KB / 1 | 19 / 74 / 5 |
| `/docs` | 1440 | 760* / 256 / 228 | 0 | 42 / 0 / 56 | 166.2 / 202.0 (16) | 13.3 | 27.4 KB / 1 | 23 / 86 / 6 |

\* The first run hit a cold edge (`x-vercel-cache: PRERENDER`). Every other run was a `HIT`.

Core Web Vitals pass with a wide margin. The findings below are about bytes the site does not need, a 404 that renders blank without JavaScript, SEO gaps that remain open, and code-quality leftovers.

### Before and after, against review 006

| Item | Review 006 | Review 008 | Status |
|---|---|---|---|
| JS on `/` (total, br) | 245 KB / 15 scripts | 197.6 KB (173.0 KB before load) | -47 KB |
| JS on `/components/button` | 259 KB / 16 | 213.6 KB (175.4 KB before load) | -45 KB |
| JS on `/foundation` | 243 KB / 14 | 197.6 KB (166.6 KB before load) | -45 KB |
| Font transfer | 57.6 KB / 4 files (Plex Mono unused) | 27.4 KB / 1 file (Urbanist variable) | **#1 resolved** |
| Catalogue prose in client JS | 13.4 KB br module on every page | 0: no client chunk contains `usage`, `do` or tracker data | **#2 resolved** |
| Duplicated client chunk | 26.7 KB br twice | 12.0 KB br (15.1 KB on the wire) twice | #2 partly resolved, see F4 |
| Search data cost per page | in JS | 24.7 KB raw (2.1-2.4 KB br) in every HTML, plus every prefetched page | new cost, see F2 |
| `/components` preview JS | 17.4 KB br | 0 (cards are server HTML) | **#3 resolved** |
| `<link rel=canonical>` | 0 of 5 pages | 10 of 10 pages | **#4 resolved** |
| `og:url` | 0 | 0 | #4 open, see F6 |
| Status defined in three places | yes | yes, unchanged | #5 open, see F5 |
| Duplicate SVG ids (Copy to Figma) | 9 of 10 pages | 0 of 23 ids on `/components/button`; `DOMMatrix` handles `matrix3d` | **#6 resolved** |
| Converter loaded up front | 3.8 KB br on every visit | `2ifmb652v7jmr.js` loads only on hover or focus | **#7 resolved** |
| Structured data | 0 | 0 of 12 pages | #8 open, see F7 |
| Sitemap `<lastmod>` and per-page share image | 0 of 63, one image | 0 of 63, one image | #9 open, see F8 |
| Prefetch on `/components/button` (desktop) | 99 req / 162 KB / 25 routes | 24 / 87 KB / 6 | **#10 resolved there** |
| Prefetch on `/components` | not measured | 71 / 226 KB / 18 routes on desktop; 107 req / 41 routes on a scrolled phone | new, see F1 |
| Dead exports and starter SVGs | present | `categories` and `componentsByCategory` gone; `/file.svg` and `/vercel.svg` return 404; `demos` still exported | #11 mostly resolved |
| LCP / CLS / TBT | 0.85-0.93 s / 0 / 0-53 ms | 0.23-1.12 s warm / 0 / 0-119 ms | unchanged, good |

---

## F1. MEDIUM: overview cards prefetch 18-41 routes, more than the page itself weighs

**Where:** `src/components/ComponentOverview.tsx:138`. The card `<Link>` uses default prefetch.

**Evidence:**
- On `/components` at 1440 there are 71 prefetch requests, 226 KB on the wire, for 18 routes. The page itself is 30 KB of HTML and 166 KB of JS.
- On a 412 phone scrolled through the catalogue there are 107 prefetch requests, about 1.3 MB raw, for 41 routes.
- Next 16 segment prefetch sends `_tree`, `_head`, the segment and `__PAGE__` for each card that enters the viewport.
- Round 007 set `prefetch={false}` on the sidebar and Related links (`ComponentSidebarNav.tsx:99`, `[slug]/page.tsx:322`), which cut `/components/button` from 99 requests to 24. The overview grid was not changed.

**Fix:** add `prefetch={false}` to the card `Link` at `ComponentOverview.tsx:138`. Per `node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md`, the App Router still prefetches on hover, so clicking a card stays fast. Leave the header nav on default prefetch.

---

## F2. MEDIUM: the search index is serialized into every page's HTML and every prefetched page

**Where:** `src/components/Header.tsx:7,59` (`<CommandSearch entries={searchIndex} />`) and `src/lib/search-index.ts:32-68`. `Header` is rendered inside each `page.tsx` (10 files) and inside `not-found.tsx`.

**Evidence:**
- The 172-entry index is 24.7 KB raw in every production HTML document, and 21.5 KB in every RSC response.

| Page | HTML br | HTML br without the index | Share of the compressed page |
|---|---|---|---|
| `/privacy` | 8.2 KB | 5.9 KB | 28% |
| `/docs` | 9.6 KB | 7.3 KB | 24% |
| `/themes` | 9.7 KB | 7.4 KB | 24% |
| `/` | 14.3 KB | 12.1 KB | 15% |
| 404 | 7.7 KB | 5.4 KB | 30% |

- Because `Header` lives in the page and not in a layout, the index also sits in each route's `__PAGE__` segment (`components/button.segments/.../__PAGE__.segment.rsc`, 72 KB raw). On `/components`, 19 prefetch responses carried the index, about 1.1 MB raw and about 44 KB br.
- 88 color-token entries make up 12.0 KB, 55% of the index. Without the token groups, the index is 7.8 KB raw or 1.2 KB br.
- The server/client boundary itself is right. `CommandSearch` only does `import type { SearchEntry }`, so no catalogue code reaches the client.

**Fix:** pick one of these.
- **Recommended.** Serve the index as a static file and load it on first use:
  - Add `src/app/search-index.json/route.ts` with `export const dynamic = "force-static"` that returns `Response.json(searchIndex)`.
  - In `CommandSearch`, `fetch` it on the first `pointerenter`, `focus` or Ctrl K, the same warm-up pattern `useFigmaExport` already uses.
  - Drop the `entries` prop.
- **Or** move `<Header>` into `src/app/layout.tsx`, with a small client nav that derives `aria-current` from `usePathname()`. The index then lives in the root layout segment, which the client segment cache fetches once and reuses for every route.
- **Either way,** shorten token `keywords`: `${s.hex} ${s.hex.slice(1)}` repeats the hex that is already in `note`.

---

## F3. MEDIUM: an unknown `/components/<slug>` returns 404 with an empty body

**Where:** `src/app/components/[slug]/page.tsx:24-26,39`. The page has `generateStaticParams` but no `dynamicParams` export, so it defaults to `true`.

**Evidence:**
- `curl /components/nope` returns 404 with `X-Matched-Path: /components/[slug]` and 46 KB of HTML, but the `<body>` holds only `<div hidden><!--$--><!--/$--></div>` and scripts. "This page doesn't exist" appears only inside the flight data.
- In Playwright with JavaScript disabled, the page has no `<h1>` and `innerText` length 0. With JavaScript on, it renders after hydration.
- A root-level 404 (`/nope-404`) server-renders the full page, `<h1>` included.
- Each new unknown slug runs a function, because the first hit is `x-vercel-cache: MISS`.

**Fix:**
- Add `export const dynamicParams = false;` to `[slug]/page.tsx`. `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md:16-18` says unknown params then return 404 without rendering the page.
- Then check with `curl -s …/components/nope | grep '<h1'` that the server HTML carries the `not-found.tsx` content.
- `notFound()` at `:39` stays as a guard.

---

## F4. MEDIUM: the header client island is 12 KB br and still ships twice

**Where:**
- `src/components/Header.tsx:1,35`: `next/image` for a 28 px SVG.
- `src/components/HeaderMenu.tsx:5`, `CommandSearch.tsx:5`, `ThemeToggle.tsx:4`: Phosphor icons from the client entry point.

**Evidence:**
- `3pfedj4chfd95.js` (62 pages) and `1brgy3g-1ns99.js` (`/foundation`, `/themes`, `/privacy`) contain the same 21 modules in a different order: 43.5 KB raw and 12.0 KB br each, 15.1 KB on the wire.
- The live home page, `/docs` and `/components/button` download both: the second one arrives through link prefetch of `/foundation` (see "JS total" in the results table).
- Inside the chunk:
  - About 15.7 KB raw (5.4 KB br) is the `next/image` client runtime: `getImgProps`, `ImageConfigContext`, loader and blur-SVG code. It only serves `<Image src="/natuna-logo.svg" width={28}>`. SVGs are not optimized by the image loader, and `loading="eager"` adds a `<link rel=preload as=image>` that competes with the font preload.
  - 19.8 KB raw (4.5 KB br) is Phosphor icon modules with every weight, for six icons that each render in a single weight.

**Fix:**
- Replace `Image` with a plain `<img src="/natuna-logo.svg" alt="" width={28} height={28} className="h-7 w-7" />` in the server `Header`.
- Render the icons on the server with `@phosphor-icons/react/ssr` and pass them to `MenuButton`, `CommandSearch` and `ThemeToggle` as `ReactNode` props, the same way `Header` already does with `GithubLogo`.
- That shrinks the island to about 3-4 KB br, so the Turbopack twin costs that much instead of 12 KB.

---

## F5. MEDIUM: component status is still defined in three places, and the round 007 files depend on the mutation

**Where:**
- `src/lib/components-data.ts:651-662`: `trackerStatus` and the `for` loop that overwrites `c.status`.
- `src/lib/components-data.ts:664-679`: `statusText` and `statusTone`.
- `src/lib/natuna-tracker.ts:19-41`: `statusLabel` and `statusStyle`.
- `src/app/page.tsx:20`: `groupOf`.
- `src/components/ComponentOverview.tsx:48-49,62-63`, which mixes both pairs.

**Evidence:**
- Unchanged since review 006 (#5). All 56 literal `status:` values in `components-data.ts` are dead.
- Three new readers depend on that module-load mutation having already run:
  - `search-index.ts:76` (`statusText[c.status]`)
  - `ComponentSidebar.tsx:8` (`status: c.status`)
  - `components/page.tsx:11` (`c.status === "untracked"`)

**Fix:** as in review 006.
- Remove `status` from the literal data and the `ComponentMeta` type.
- Export `statusOf(slug)` built from `trackerStatus`.
- Key one `statusLabel` and `statusStyle` pair by `ComponentStatus`.
- Derive `groupOf` from `statusOf`.
- Build `components` with `.map()` rather than a `for` loop over the exported array.

---

## F6. LOW: no `og:url`, and one share image for 63 pages

**Where:** `src/app/layout.tsx:15`, every `export const metadata`, and `src/app/components/[slug]/page.tsx:32`.

**Evidence:**
- All 12 sampled pages have a canonical and the full `og:` and `twitter:` sets, but none has `og:url`.
- Every page uses `og:image` `/opengraph-image?1a1017e2c3003898` (41 KB PNG) with the alt text "Natuna Digilab, the design system for digital products".
- `/templates` sends both `canonical` and `noindex, follow`, which are mixed signals.

**Fix:**
- Export `baseOpenGraph = { siteName: "Natuna Digilab", type: "website" }` from `src/lib/site.ts`.
- Return `openGraph: { ...baseOpenGraph, url: <same path as canonical> }` next to each `alternates.canonical`. Metadata merges shallowly, so spreading the base is required.
- Add `src/app/components/[slug]/opengraph-image.tsx`, which is prerendered by the existing `generateStaticParams`.
- Drop `alternates` from `/templates`.

---

## F7. LOW: no structured data

**Where:** `src/app/layout.tsx`, `src/app/components/[slug]/page.tsx:95-99` (the visible breadcrumb).

**Evidence:** 0 `application/ld+json` blocks on all 12 sampled pages.

**Fix:** per `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`:
- Add `WebSite` plus `Organization` in the root layout, with `sameAs: [REPO_URL, FIGMA_COMMUNITY_URL]`.
- Add `BreadcrumbList` (Components > group > name) on each component page.
- Serialize with `JSON.stringify(data).replace(/</g, "\\u003c")`.

---

## F8. LOW: the sitemap has no `lastModified`

**Where:** `src/app/sitemap.ts:8-9`

**Evidence:** the live `/sitemap.xml` has 63 `<loc>` entries and 0 `<lastmod>`. `robots.txt` is correct: `Allow: /` and a production `Sitemap:` URL.

**Fix:**
- Export `TRACKER_SNAPSHOT_ISO = "2026-09-30"` beside `TRACKER_SNAPSHOT` in `src/lib/site.ts`.
- Use it as `lastModified` for `/components/*`, and the build date for the other pages.

---

## F9. LOW: Download SVG has no error path and revokes the blob URL synchronously

**Where:** `src/components/useFigmaExport.ts:62-72`, and `:53-55` for copy.

**Evidence:**
- `download` awaits `loadConverter()` without `try`/`catch`. A failed chunk fetch then becomes an unhandled rejection and no "failed" status appears. `copy` does handle that case.
- `URL.revokeObjectURL(url)` runs on the line right after `a.click()`. Firefox and Safari can cancel a download whose URL is revoked in the same task.
- When the converter is not warm, for example on a touch tap without a hover, `copy` awaits the import before `clipboard.writeText`. Safari rejects a clipboard write made after an `await` outside the user gesture.
- In Edge, copy works and produces 0 duplicate ids: the converter chunk loads on hover, and keyboard focus also warms it.

**Fix:**
- Wrap the body of `download` in `try { … flash("downloaded") } catch { flash("failed") }`.
- Revoke in `setTimeout(() => URL.revokeObjectURL(url), 0)`.
- For copy, use `navigator.clipboard.write([new ClipboardItem({ "text/plain": loadConverter().then(({ domToSvg }) => new Blob([domToSvg(el, name)], { type: "text/plain" })) })])`. `ClipboardItem` accepts a promise, so the write starts synchronously inside the gesture.

---

## F10. LOW: nothing enforces the round 007 server/client boundary

**Where:** `src/lib/search-index.ts:1`, `src/lib/components-data.ts`, `src/lib/natuna-palette.ts`

**Evidence:**
- The 13.4 KB br catalogue left the client bundle only because no client file imports it now.
- One `import { components } from "@/lib/components-data"` in any `"use client"` file would silently put it back. Before round 007, `CommandSearch` and `ComponentSidebar` did exactly that.

**Fix:**
- Add `import "server-only";` at the top of `search-index.ts` and `components-data.ts`, so such an import fails the build.
- Per `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md:555-577`, installing the package is optional in Next.js.
- Client files keep using `import type`, which is erased.

---

## F11. LOW: small leftovers in the new client files

- **`src/components/ComponentSidebarNav.tsx:69`:** `const cat = { name };` wraps a string in an object, and the code then reads `cat.name` four times. Use `name` directly.
- **`src/components/ComponentOverviewFilter.tsx:45`:** the decorative `MagnifyingGlass` lacks `aria-hidden="true"`, unlike every other icon in the new files.
- **`src/components/HeaderMenu.tsx:51`:** `aria-controls="mobile-nav"` points at an element that does not exist while the menu is closed (`MobileMenu` returns `null` at `:61`). Render the `<nav>` with `hidden={!open}` instead of unmounting it.
- **`src/components/HeaderMenu.tsx:28-37`:** the menu's document-level Esc handler and the search dialog both react to the same Esc key. Check `e.defaultPrevented`, or ignore Esc while a `dialog[open]` exists.
- **`src/lib/search-index.ts:42-49`:** the radius tuples infer as `(string | number)[][]`, so `name` and `px` are both `string | number`. Add `as const`.
- **`src/components/demos.tsx:100`:** `demos` is still exported but only used in this file (left over from review 006 #11).

---

## F12. LOW: RouteFocus behaves differently in development, and skips the target on cross-page hash links

**Where:** `src/components/RouteFocus.tsx:10-20`

**Evidence:**
- Production initial load leaves focus on `BODY`, and a client navigation moves it to `main`, as intended.
- In development, Strict Mode runs the effect twice on mount. The first run flips `first.current` to `false`, so the second run focuses `#main` on the very first page load. Anyone checking focus against `next dev`, including e2e runs, sees behavior production does not have.
- On a cross-page navigation to `/foundation#radius`, the effect returns early. Focus is then left on whatever survived the navigation, which is `<body>` once the clicked link unmounts.

**Fix:**
- Track the previous path instead of a boolean: `const prev = useRef(pathname); useEffect(() => { if (prev.current === pathname) return; prev.current = pathname; … }, [pathname]);`.
- When a hash is present, focus `document.getElementById(location.hash.slice(1))` with `tabIndex = -1`, and fall back to `#main`.

---

## Checked and fine

- LCP is under 1.3 s on every warm run and 1.9 s on the worst cold edge hit. CLS is 0 everywhere. TBT is at most 119 ms at 4x CPU. The LCP element is server-rendered text on every page.
- **Fonts:** one Urbanist variable file (27.4 KB, preloaded); `document.fonts` loads weights 400-800 from it. IBM Plex Mono is gone.
- **Sidebar data:** `ComponentSidebar` builds `SidebarData` on the server. React 19 deduplicates the shared object, so the `items` array appears once in the RSC payload even though both `SidebarAside` and `MobileComponentNav` receive it (`"items":"$c:props:items"`).
- **Previews:** `ComponentOverviewFilter` receives the cards as server-rendered `ReactNode`s. `ComponentPreview` has no client code.
- **Converter:** `useFigmaExport` loads the converter once through a shared promise, clears its timer on unmount, and is reused by `FigmaFrame` and `FigmaPanel`. `HeroBento` clears its timer.
- **`NextPage`** is a Server Component with no issues.
- **Robots and 404s:** `/templates` is `noindex, follow`. 404s send `noindex` and a 404 status. `robots.txt` and the sitemap use the production host.
