# Review 008: QA regression pass after the five-branch merge

Date: 2026-10-05. Branch `redesign-docs-site` at `edd4e67`, against http://localhost:3000 (Next.js 16 dev server).
The working tree also had uncommitted edits from other sessions (`globals.css` comment, `components-data.ts` Toast/Changelog
copy, `src/ui/button.tsx` border shade). None of them touches the behavior tested here.

Method: throwaway Playwright scripts (Edge channel). These are now deleted.

- **Sweep:** 65 routes at 390 and 1440 wide, in light and dark (260 page loads). The routes were `/`, `/docs`, `/foundation`,
  `/components`, all 56 `/components/<slug>`, `/themes`, `/naming`, `/privacy`, `/templates` and a 404. Each load checked:
  - console errors and warnings, `pageerror`, hydration and React key warnings
  - horizontal overflow
  - duplicate DOM ids, one `#main` and one `h1`
  - axe-core with `wcag2a, wcag2aa, wcag21aa, wcag22aa, wcag2aaa`, run after DocumentTimeline animations settle
  - 391 unique internal links: HTTP status, plus every `#anchor` checked against the ids on its target page
- **Interaction:** 39 scripted keyboard and pointer checks, then follow-up repros for each failure.

Severity scale: **High** blocks a task or breaks WCAG A/AA for a core flow. **Medium** is a real a11y or UX defect with a
workaround. **Low** is polish, or affects dev only.

---

## Defects

### 1. MEDIUM: Hero bills demo drops keyboard focus to `<body>` after a payment

- **Route:** `/`, any width, light and dark.
- **Steps:** Use the bills card as it loads (Electricity, Water and Internet selected, Health insurance not). Tab to
  "Pay Rp 860.500" and press Enter (or deselect Water first and pay Rp 762.500). Wait about 1 second.
- **Expected:** Focus stays on the primary button, or moves somewhere sensible such as the headline. The loading state
  already keeps focus, by design.
- **Actual:** When the payment completes, the paid bills leave the total. `total` becomes 0, so the button turns natively
  `disabled` ("Select a bill"), and Chromium moves focus to `<body>` (`document.activeElement` is BODY). The next Tab
  starts again from the top of the page. The demo only keeps focus when every bill was paid, because then the same DOM
  button turns into "Reset the demo".
- **Suspected cause:** `src/components/home/HeroBento.tsx:143`, `disabled={!total}`. The comment in `src/ui/button.tsx`
  warns about exactly this. Use `aria-disabled` plus a no-op click for the empty state, or move focus in `pay()` once
  `setBills` runs (`HeroBento.tsx:52-55`).

### 2. MEDIUM: Ctrl K search does not scroll the active option into view

- **Route:** any route (header). Seen at 1440 and 390.
- **Steps:** Press Ctrl K with an empty query (12 results), then press ArrowDown 11 times.
- **Expected:** The highlighted option (`aria-activedescendant`) scrolls into the visible part of the listbox.
- **Actual:** The listbox is capped at `max-h-[50vh]` (450px visible, 544px of content at 900px tall, and more on short
  phones or with up to 20 results for a query). `result-11` is selected but sits below the fold. A sighted keyboard user
  cannot see what Enter will open.
- **Suspected cause:** `src/components/CommandSearch.tsx:50-56` changes `index` without ever calling
  `scrollIntoView({ block: "nearest" })` on `#result-${index}`. The list is at line 106.

### 3. LOW: One Esc closes both the search dialog and the mobile menu

- **Route:** any route at 390.
- **Steps:** Open the hamburger menu, press Ctrl K, then press Esc once.
- **Expected:** Esc closes only the top layer (the search dialog), and focus goes back to where it was.
- **Actual:** The dialog closes and the mobile menu closes too, and focus jumps to "Open navigation menu".
- **Suspected cause:** `src/components/HeaderMenu.tsx:29-35` listens for Escape on `document`. The search input's handler
  (`src/components/CommandSearch.tsx:60-63`) calls `preventDefault()` but not `stopPropagation()`, and the menu listener
  does not check `e.defaultPrevented`.

### 4. LOW: Code block "Copied" label is cut short by an earlier click's timer

- **Route:** any coded component page, for example `/components/input` or `/components/button`.
- **Steps:** Click Copy, wait about 1.5 s, then click Copy again. Read the label 500 ms later.
- **Expected:** "Copied" (and the status message) stays for the full 1.8 s after the latest click.
- **Actual:** The label is already back to "Copy" after 300 ms, because the first click's timer resets it. The timer is
  also never cleared on unmount.
- **Suspected cause:** `src/components/CodeBlock.tsx:94`, a bare `setTimeout(() => setCopied("idle"), 1800)`. `useFigmaExport.ts`
  already does this correctly with `clearTimeout` on a ref.

### 5. LOW: The component sidebar filter does not announce its results

- **Routes:** `/components/<slug>` and `/naming`, desktop `aside` and the phone "All components" panel.
- **Steps:** Type "acc", then "zzzz", in "Filter components".
- **Expected:** A polite status message such as "1 component" or "No component named zzzz" (WCAG 4.1.3 Status Messages).
  `/components` and Ctrl K both already do this.
- **Actual:** The list and the empty state change silently. There is no `role="status"` or `aria-live` region in the
  sidebar.
- **Suspected cause:** `src/components/ComponentSidebarNav.tsx:32` (`matches`) and `:118` (empty state). Add an sr-only
  `role="status"` with `matches.length`.

### 6. LOW: StatusBoard "Show fewer" on a phone leaves the reader far down the page

- **Route:** `/` at 390.
- **Steps:** In "Filter by status", tap "Show all 51", scroll to the button (now "Show fewer") and tap it.
- **Expected:** The toggle, or the top of the list, stays in view.
- **Actual:** The list collapses from 51 to 12 rows above the button, so the button moves about 1,300px up, out of the
  viewport. The reader lands in the next section with no sign of what happened. The focused button is also off screen,
  which risks WCAG 2.4.11. The expanded state also carries over when you switch tabs (All, Planned, All), which is
  harmless.
- **Suspected cause:** `src/components/home/StatusBoard.tsx:112`. After collapsing, call
  `scrollIntoView({ block: "nearest" })` on the toggle or the tablist.

### 7. LOW (dev only, verify in prod): Unknown component slug logs a script-tag warning and a React error

- **Route:** `/components/not-a-component`, by direct load or client navigation.
- **Steps:** Open the URL with DevTools open.
- **Expected:** A clean 404, the same as `/this-route-does-not-exist`, which only logs the 404 resource line.
- **Actual:** The 404 page renders correctly with status 404, but the console shows:
  - `Encountered a script tag while rendering React component...` (direct load only)
  - `pageerror: Failed to execute 'measure' on 'Performance': 'ComponentDetail' cannot have a negative time stamp.`
    (direct load and client navigation)
- **Suspected cause:** `notFound()` is thrown from `src/app/components/[slug]/page.tsx:39`. React then re-renders the root
  on the client and meets the inline theme `<script>` in `src/app/layout.tsx:35`. The `Performance.measure` error looks
  like a React 19.2 dev performance-track bug. Check with `next build && next start` before acting. If the script warning
  persists, render the theme script with `next/script` `strategy="beforeInteractive"`.

### 8. LOW: The overview filter chip counts ignore the search text

- **Route:** `/components`.
- **Steps:** Type "button" in "Search components".
- **Expected:** The counts on "All", "Ready" and the other chips describe the filtered set, or the UI makes clear they are
  totals.
- **Actual:** 4 cards show, and the status reads "4 components shown", but the chips still read "All 56 | Ready 9 |
  In progress 5 | Planned 37 | Not tracked 5". Pressing "Ready 9" then shows 1 card.
- **Suspected cause:** `src/components/ComponentOverviewFilter.tsx:65` renders the static `f.count` from the server.
  Count `entries` that match `q` per status instead. This may be intended. Raise it with design.

### Observations, not defects

- Overview cards (`/components`) put buttons, inputs and two `role="status"` elements from the previews inside `<a>`.
  All 35 are under `inert` with `aria-hidden="true"` (`ComponentOverview.tsx:103`), so assistive tech and the keyboard
  never reach them and axe passes. It is still invalid HTML (interactive content inside `<a>`).
- `useFigmaExport.download` (`src/components/useFigmaExport.ts`, the `download` callback) has no try/catch, unlike
  `copy`. A failed converter import would be an unhandled rejection with no "failed" status. I did not reproduce this.
- On Windows the clipboard turns code-block `\n` into `\r\n`. This is OS behavior, not a bug.
- The link checker flagged `/this-route-does-not-exist#main`. That is the skip link on the 404 page itself, so it is
  expected.

---

## Passed

- **Route sweep (260 loads):**
  - zero axe violations (A, AA, 2.1 AA, 2.2 AA and AAA, light and dark, 390 and 1440)
  - zero console errors or warnings, zero hydration or React key warnings
  - zero horizontal overflow
  - zero duplicate DOM ids
  - exactly one `#main` and one `h1` on every page
  - all 391 internal links return 2xx/3xx, and every `#anchor` target exists (including `/components#group-*`
    breadcrumbs and On this page links)
  - the 404 route returns HTTP 404 with a titled page
- **Header:**
  - Tab order at 1440: Skip, logo, Introduction, Foundation, Components, Themes, Search, theme, GitHub, then content.
    At 390: Skip, logo, Search, theme, menu.
  - Every stop has a visible ring.
  - The skip link focuses `#main`.
- **Mobile menu:**
  - It opens with `aria-expanded`, lists Introduction, Foundation, Components, Naming, Themes and GitHub, and marks the
    current page with `aria-current`.
  - Tab goes into the menu. Esc closes it and returns focus to the button.
  - Every link navigates, closes the menu and focuses `#main`. Clicking outside leaves it open, which is acceptable.
- **Ctrl K:**
  - The input is focused when the dialog opens. "butt" gives 4 results and "4 results" is announced. "0 results" is
    announced for no matches.
  - ArrowUp and ArrowDown move `aria-activedescendant` and clamp at the ends. Enter navigates and focuses `#main`.
  - A single Esc closes the dialog even with text typed, and focus goes back to the trigger.
  - The query clears when the dialog reopens. A backdrop click closes it, and it fits at 390.
- **Sidebar:**
  - The filter matches (acc gives Accordion, tab gives Table and Tabs), and the empty state works.
  - Groups open for matches and go back to the current group when the filter is cleared. There is one `aria-current`.
  - Links focus `#main`.
  - The phone panel works on `/components/button` and `/naming`, closes on navigation and links to Naming.
- **`/components` filter:**
  - Chip counts add up (56 = 9+5+37+5), and each chip shows exactly its count with `aria-pressed`.
  - Search, the empty state and "N components shown" all work. Clearing restores all 56, with no duplicate cards.
- **StatusBoard:**
  - ArrowRight and ArrowLeft wrap, Home and End work, and the arrowed tab gets a visible ring.
  - Each tab's row count matches its badge, the panel is `aria-labelledby` the selected tab, and there is one tab stop.
  - On a phone, 12 rows show first. "Show all 51" shows all, sets `aria-expanded` and keeps focus.
- **Hero bills:**
  - Selecting and deselecting with Space updates the total (860.500 to 762.500).
  - While paying, `aria-busy` is set, focus stays on Pay, and the bills are disabled.
  - The headline updates ("2 bills due this week", then "All bills paid"), and Reset restores everything.
  - "Bills card theme: Light/Dark" names are correct in both site themes. The pinned card's surface, bills and button
    take the pinned palette, and it stays pinned when the site theme changes.
- **Copy to Figma and Download SVG:**
  - Tested on button, input, avatar, accordion, badge, tabs, modal, table, date-picker and the home FigmaPanel, in
    light and dark.
  - The clipboard SVG parses, with no duplicate or empty ids, every `url(#)` reference resolves, there is no
    NaN/undefined/Infinity, and it has text layers.
  - The download fires with a slugged filename, parses, and has no duplicate ids. The status message is announced.
- **Code blocks:**
  - TS is the default. Arrow, Home and End switch tabs with a visible ring.
  - The JS choice syncs across blocks and persists across reload and pages.
  - Copy matches the shown code and announces "Code copied". Expand and Collapse set `aria-expanded`.
- **Theme toggle:**
  - The label flips, and dark survives client navigation and reload.
  - `localStorage` is written, and `color-scheme: dark` is set on `<html>`.
- **Route-change focus:**
  - Focus lands on `#main` with scroll at the top for the main nav, logo, overview cards, sidebar, search and mobile menu.
  - A hash navigation (breadcrumb to `/components#group-Atoms`) scrolls to the group, and the next Tab continues from
    there.
