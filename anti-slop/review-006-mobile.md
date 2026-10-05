# Review 006: Mobile and responsive

Date: 2026-10-05. Branch `redesign-docs-site`, dev server at http://localhost:3000.

**Method.** Playwright (Edge) ran every route (/, /docs, /foundation, /components, /components/button, /components/accordion, /components/table, /themes, /naming, /privacy) at 360x800, 390x844, 768x1024, 1024x768, 1280x800 and 844x390 landscape, in light and dark. Each run scrolled the page first so reveal sections render, then took a full-page screenshot and measured scrollWidth, elements past the viewport, sticky and fixed elements, and the size of every interactive element. The same scripted checks were run again against the latest code before this file was written. Line numbers match the working tree at that point. Other people were editing src/ during the review.

**Clean.** No route has horizontal page overflow at any width or theme. Code blocks and the hero code sample scroll inside `overflow-x-auto`. Tables either reflow into cards (Props, Naming) or fit (Table example). The component sidebar disclosure on phones works and caps itself at `max-h-[65vh]`. The search dialog fits at 360 and at 844x390. The sitewide `sm:min-h-0` and `sm:h-9` target shrink seen in the first pass (footer links, theme toggle, search, code-block tabs, breadcrumbs, bento toggle) was fixed during the review. The one target that is still too small is finding 7.

---

## 1. HIGH: The home Copy to Figma receipt is crushed on phones

- **Page / width:** `/` at 360 and 390, light and dark
- **File:** `src/components/home/FigmaPanel.tsx:29`, `:49`, `:50`, `:62`, `:66`
- **Problem:** Three layers of padding stack up: the panel's `p-7`, the inner well's `p-6` and the card's `p-5`. The receipt's text column ends up **35px wide**. "Transfer sent" breaks onto two lines, "To savings •••• 4821" breaks word by word, and "Amount" sits against "Rp 250.000" with **0px** between them. The date and reference wrap into four ragged lines. This is the demo that sells the feature, and on a phone it looks broken.
- **Fix:**
  - Panel at :29: `p-5 gap-8 sm:p-14 sm:gap-12`.
  - Well at :49: `p-3 sm:p-8`.
  - Card at :50: `p-4 sm:p-5`.
  - Header row: put the Success pill under the title on phones with `flex-wrap` on the row and `basis-full sm:basis-auto` on the pill. Or drop `min-w-0` from the title column and add `whitespace-nowrap` to its two lines.
  - Amount row at :62: `flex flex-wrap items-baseline justify-between gap-x-3`.
  - Date row at :66: `flex flex-wrap justify-between gap-x-3 gap-y-1`.

## 2. HIGH: The home status board makes the phone page about 1,400px longer

- **Page / width:** `/` at 360 and 390 (the page is 8,237px tall at 360)
- **File:** `src/components/home/StatusBoard.tsx:75`, `:82`
- **Problem:** "All" is the default filter, so all 51 components render as a 2-column grid of 48px tiles: **1,436px** of list on a 360 screen. The narrow columns also cut off "Dropdown Me…", "QR Code Displ…" and "Transaction Li…".
- **Fix:**
  - On phones, show at most 12 items and add a "Show all 51" button. For example, cap the list with `shown.slice(0, expanded ? undefined : 12)` below `sm`, and use `sm:` to keep the full grid on wider screens.
  - Or default the phone view to the "Ready" tab.
  - Let names wrap instead of truncating: replace `truncate` with `line-clamp-2 leading-tight`.
  - Optionally use one column below 400px: `grid-cols-1 min-[400px]:grid-cols-2`.

## 3. HIGH: Foundation is 15,400px tall on a phone

- **Page / width:** `/foundation` at 360 (15,437px), 390 (about 15,000px) and 768 (10,600px). Desktop is 7,700px.
- **File:** `src/app/foundation/page.tsx:221`
- **Problem:** 8 ramps × 11 swatches in `grid-cols-4` comes to 3 rows per ramp, each swatch with hex and ratio text under it: 24 rows of swatches. Along with the stacked Accessibility table, a phone user scrolls about 19 screens to reach Effect.
- **Fix:**
  - On phones, render each ramp as one compact strip: `grid grid-cols-11 gap-1`, with `h-10` chips and the step label only. Open the hex and ratio in a popover when a chip is tapped, which also copies the hex. Keep the current detailed grid from `sm:` up.
  - Alternatively, wrap each ramp after the first in a `<details>` element that starts closed below `lg`.

## 4. MEDIUM: Hero badge and stats wrap badly on phones

- **Page / width:** `/` at 360 and 390
- **File:** `src/app/page.tsx:58`, `:88`
- **Problem:**
  - The lime count pill breaks into "9 /" and "51" on two lines; it measures 36px tall where one line would be 20px. The pill around it then wraps its sentence to two lines as well.
  - The three stats in the `dl` stack 2 + 1, leaving "440–1440 responsive range" alone on its own row.
- **Fix:**
  - Count pill at :58: add `shrink-0 whitespace-nowrap`.
  - Badge `p` at :57: add `max-w-full`.
  - Stats at :88: `grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:gap-7`. Also shrink the values on phones with `text-[22px] sm:text-[28px]` on the `dd`.

## 5. MEDIUM: Home status filter chips leave "Planned" alone on a second row

- **Page / width:** `/` at 360 and 390
- **File:** `src/components/home/StatusBoard.tsx:44`
- **Problem:** Four tabs wrap 3 + 1, so "Planned 37" sits by itself on a second line. `/components` has the same problem with its five filters, which wrap 3 + 2 (`src/components/ComponentOverview.tsx:166`).
- **Fix:** Make the tab row one line that scrolls sideways: `flex gap-2 overflow-x-auto -mx-6 px-6 [scrollbar-width:none]`, with `shrink-0` on each tab. Or use an even grid on phones: `grid grid-cols-2 gap-2 sm:flex sm:flex-wrap`, with `justify-center` on the tabs.

## 6. MEDIUM: The mobile menu stays open, covers content while scrolling, has no Escape, and lacks Naming

- **Page / width:** all pages at 360 to 767
- **File:** `src/components/Header.tsx:11-16`, `:19`, `:81`
- **Problem:**
  - The open menu sits inside the sticky header, so after scrolling it keeps a **260px** panel pinned over the content (verified at 360 after scrolling 1,200px).
  - Escape does not close it (verified).
  - It lists 4 pages, but the footer and search list 5: Naming is missing. On a phone, Naming is reachable only from the footer or the component disclosure.
- **Fix:**
  - Add `{ href: "/naming", label: "Naming" }` to `nav`, or give the mobile list its own array if the desktop bar should stay at 4.
  - Close the menu on Escape and on route change: a `useEffect` with a `keydown` listener plus `usePathname()`.
  - Either close it on scroll, or make the panel an overlay: `absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto shadow-lg`.

## 7. MEDIUM: The menu button shrinks to 36px between 640 and 767px

- **Page / width:** all pages at 640 to 767 (large phones in landscape, small tablets in portrait). Measured 36×36 at 700px.
- **File:** `src/components/Header.tsx:74`
- **Problem:** The `sm:h-9 sm:w-9` classes override `h-11 w-11` before `md:hidden` takes over. That breaks the site's own 44px rule (WCAG 2.5.5 AAA, which the site now adopts) on touch screens. The same pattern was removed everywhere else during this review; this one remains.
- **Fix:** Drop `sm:h-9 sm:w-9`, or limit the shrink to mouse users with `pointer-fine:h-9 pointer-fine:w-9`.

## 8. MEDIUM: In landscape, the Foundation sticky bars cover 31% of the screen

- **Page / width:** `/foundation` at 844x390
- **File:** `src/app/foundation/page.tsx:173` (with `src/components/Header.tsx:22`)
- **Problem:** The 65px sticky header plus the 57px sticky section chips leave the chips' bottom edge at **121px** of a 390px viewport. Swatch rows are cut in half under the bars as you scroll.
- **Fix:** Release both bars on short screens.
  - Chips at :173: `[@media(max-height:480px)]:static`.
  - Header: `[@media(max-height:480px)]:static`, or a hide-on-scroll-down header.
  - Keep `scroll-mt-40`, which is fine when the bars are pinned.

## 9. MEDIUM: At 1024, the home hero stacks into one column and leaves the right half empty

- **Page / width:** `/` at 768 to about 1,090. At 1024x768 the text column and the bento are both 976px wide, stacked at top 137 and 729.
- **File:** `src/app/page.tsx:56`, `:102`
- **Problem:** The flex bases (460 + 520 + the 56px `gap-14`) need 1,036px, so the hero only goes side by side from about 1,090px. At 1024, the hero copy fills the left 540px with empty space beside it, and the bento, which is the visual proof, falls below the fold on a landscape iPad.
- **Fix:** Use `grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14` on the section instead of `flex flex-wrap`. Or lower the bases to `flex-[1_1_400px]` and `flex-[1_1_440px]` with `gap-10`.

## 10. MEDIUM: /components is longer on a tablet than on a phone

- **Page / width:** `/components` at 768 (8,565px) and 844 landscape, compared with 7,800px at 360
- **File:** `src/components/ComponentOverview.tsx:206` (preview height at `:84`)
- **Problem:** Between 640 and 1023 the grid stays at 2 columns while each preview grows to `sm:h-40`. The result is 56 cards, each about 230px tall, in pairs, with mostly empty grey previews.
- **Fix:**
  - Grid at :206: `grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4`.
  - Preview at :84: `sm:h-32 lg:h-40`.

## 11. LOW: On phones, overview previews are cut off and their text is too small to read

- **Page / width:** `/components` at 360 and 390
- **File:** `src/components/ComponentOverview.tsx:87`
- **Problem:** The preview renders at `w-[200%]` and is scaled to `0.45` inside an `h-24` box. The OTP Input and PIN Input rows of boxes are clipped at both card edges, and every caption renders at about 5px, which reads as noise.
- **Fix:** On phones, use `w-[160%] scale-[0.6]` (keep `sm:w-full sm:scale-[0.68]`), and for wide previews add `max-w-none justify-center` so they crop symmetrically. Or show an icon instead of the live preview below `sm`.

## 12. LOW: Naming property cards are about 70% taller on phones

- **Page / width:** `/naming` at 360 and 390 (6,400px, compared with 3,700px at 1024)
- **File:** `src/app/naming/page.tsx:150-156`
- **Problem:** Below `sm`, each row turns into a block with the name, the kind badge and the use text on three separate lines. That is about 97px per property across 30+ properties.
- **Fix:** Put the badge on the name line on phones.
  - `tr` at :150: add `grid grid-cols-[1fr_auto] gap-x-3 sm:table-row`.
  - Kind `td` at :155: `mt-0 justify-self-end`.
  - Use `td` at :156: `col-span-2`.
