# Review 008: Product and credibility, first-visit pass

Date: 2026-10-05. Branch `redesign-docs-site` at `edd4e67`. Target: http://localhost:3000 (dev server).

Reviewer stance: an outside consultant, visiting for the first time as a product designer or front-end engineer at a fintech company. The question for each page: do I understand the value, can I start using it today, and do I believe what it says?

Method: Playwright with Edge (`channel: "msedge"`) at 1440x900 and 390x844, in light and dark, with reduced motion on one run. I captured text, links, computed fonts and the scroll width for `/`, `/docs`, `/components`, five component pages, `/foundation`, `/themes`, `/naming`, `/templates`, `/privacy` and a 404. External links were checked with curl. The review006 findings and the round 006/007 fixes were not repeated.

What holds up: Urbanist renders on every page. No page scrolls sideways at 390. Header, footer and sidebar targets measure 44px at 1440. The dark-mode hero card is fixed. The new Button sections (Variants and states, Props, Figma to code, Accessibility) are the best content on the site: specific, honest about gaps, and written for the people who will use them.

---

## 1. HIGH: The headline "9 of 51 components ready" counts Figma documentation frames as components

- **Where:** `src/app/page.tsx:22-28` (the `ready` and `total` counts), `:65` (hero line), `:215-223` (status board). The same count appears on `/docs` ("51 components on the build plan, 9 of them ready") and `/components`. URL: http://localhost:3000/
- **Evidence:** Three of the nine Ready items are Artboard, Document and Guideline. Changelog and Cover are in the 51 too. The site itself says these "are not product UI" (`src/components/ComponentOverview.tsx:72`, and the sidebar files them under Documentation). Only six Ready items are product UI: Accordion, Avatar, Button, Dropdown Menu, Headline and Input. The first number a visitor reads is the progress figure, and a designer who opens "Artboard: Ready" will doubt every other number on the site.
- **Fix:** Exclude `category === "Documentation"` from the home, `/docs` and `/components` counts, and from the home status board. The line then reads "6 of 46 components ready", and the five frames get their own line ("plus 5 Figma documentation frames"). Do this in one place, for example a `productItems` helper in `src/lib/natuna-tracker.ts`, so the three pages cannot drift apart again.

## 2. HIGH: Previews name real cities and a country calling code

- **Where:** `src/components/ComponentPreview.tsx:150-152` (Select options: Jakarta, Bandung), `:260` (Chip: "Jakarta"), `:410` (OTP: "Code sent to +62 812 •••• 4821"), `:478` (Bandung, Jakarta, Makassar, Medan, Natuna, Surabaya, Tangerang). These are visible on http://localhost:3000/components (the Chip and OTP Input thumbnails), `/components/chip`, `/components/select` and `/components/otp-input`, and they travel into Figma through Copy to Figma.
- **Evidence:** The `/components` page text contains "Jakarta" and "Code sent to +62 812 •••• 4821". The house rule says no country or region anywhere.
- **Fix:** Use neutral values: chips such as "Savings", "This month", "Transfer". Select options should be account or category names ("Main account", "Savings", "Bills", ...). The OTP line becomes "Code sent to •••• 4821". The `Rp` currency and the personal names (Rina Putri) also point at one market. Decide whether `Rp` stays as the system's sample currency, and write that decision down. If it does not stay, switch to a neutral amount format.

## 3. HIGH: The "In code" start path cannot be followed

- **Where:** `src/app/page.tsx:283-307` (Get started, "In code" card). `/docs` "Using it today". URL: http://localhost:3000/#get-started
- **Evidence:**
  - The card says "Copy them into your project", but "View source on GitHub" points at the repository root, not at `src/ui`.
  - `https://github.com/natunadigilab/WebsiteNatunaDigilab/tree/main/src/ui` returns 404 today. `origin/main` has no `src/ui`; it exists only on this unmerged branch.
  - Copying the files is not enough. `src/ui/button.tsx` depends on Tailwind v4 and on theme tokens defined in `src/app/globals.css` (`bg-brand`, `hover:bg-brand-hover`, the custom gray ramp). It also needs the `@/ui` path alias and, for the focus ring, a global `:focus-visible` rule (the Button page says so itself). No page lists these requirements.
  - An engineer who follows the card ends up with unstyled buttons, or with a 404.
- **Fix:** Merge `src/ui` before launch and link straight to `tree/main/src/ui`. Add a short "Use the React code today" block to `/docs`:
  1. Requirements: React 19 and Tailwind v4.
  2. Copy `src/ui/*`.
  3. Copy the `@theme` token block from `globals.css`. Link to the exact line range, or better, move the tokens into `src/ui/tokens.css`.
  4. Add the `@/ui` alias, or change the import path.
  5. Copy the focus rule.

  Then point the home card at that block.

## 4. HIGH: A secondary Button and a disabled Button look the same

- **Where:** `src/ui/button.tsx:10` (`disabled:bg-gray-100 disabled:text-gray-500`) and `:14` (`secondary: "bg-gray-100 text-gray-800"`). URL: http://localhost:3000/components/button, in the Usage demo and the Variants and states table, in light and in dark.
- **Evidence:** In both themes, "Export" (secondary) and "Unavailable" (disabled) sit next to each other with the same fill. The only difference is a slightly lighter label. In a payment flow a person cannot tell an available action from an unavailable one, and the Button page documents this pairing as the system's standard.
- **Fix:** Give secondary its own look, for example a white or surface fill with a `gray-300` border and `gray-900` text. Ghost would then lose its border and become text-only. Or keep secondary and change disabled to a dashed or no-fill treatment. Update the hover sentence in `src/components/demos.tsx:182` and the Figma variant to match.

## 5. MEDIUM: The Copy to Figma caption promises shadows that the export removes

- **Where:** `src/components/FigmaFrame.tsx:36` (the caption under every demo) and `:9` (the "Copied" message). `src/components/home/FigmaPanel.tsx:7,25`. `src/lib/dom-to-svg.ts:8-9,174`.
- **Evidence:** Every component page says "Pastes as editable layers. Shadows come from Natuna effect styles." The converter's own header says "Box shadows, images, and gradients are left out; Figma users add effects from the Natuna styles instead." So the caption implies linked effect styles, but the paste has no shadow at all. The caption also appears on Artboard and Avatar, which have no shadow. The success message says "Paste into Figma with Ctrl V", which is wrong on a Mac. The home panel lists what survives the paste but not what is lost.
- **Fix:** Change the caption to "Pastes as editable layers. Shadows, images and gradients are left out; add shadows from the Natuna effect styles." Show it only when the preview actually has a shadow, or keep it generic. Change the message to "Copied. Paste into Figma with Ctrl V or Cmd V." Add a fourth point to the home panel: "Shadows and images are left out".

## 6. MEDIUM: The home token story uses names that no other page documents

- **Where:** `src/app/page.tsx:37-43` (`bg/brand`, `text/on-brand`, `text/danger`, `border/focus`, with the comment "with the names they carry in Figma") and `:146` (`blue/800`). Compare `/foundation`, `/themes` and the Button page.
- **Evidence:** The home section "2. Color, semantic alias" is the only place where `bg/brand` and the other alias names appear (`grep` finds them only in `src/app/page.tsx`). Foundation names colors `blue-800` with a hyphen. Themes names the roles `brand`, `canvas`, `surface` and `gray-700`. The Button page names `brand-hover` and `gray-200`. A designer who looks for `bg/brand` in Foundation finds nothing, so the "three layers" promise has no second layer documented anywhere.
- **Fix:** Add a "Semantic colors" table to `/foundation` with the exact Figma variable names (`bg/brand` → `blue/800`, ...) and the code token each one maps to. Make `/themes` use the same names. If the Figma names really are `blue/800` with a slash, say so once, for example: "Figma: `blue/800`, code: `blue-800`".

## 7. MEDIUM: The build-day progress claims cannot be checked

- **Where:** `src/app/page.tsx:65-66` ("The 21-day build is in progress.") and `:77` ("5 components are in React so far, and more arrive each build day"). The `Build day N of 21` labels come from `src/components/ComponentOverview.tsx:46`. URL: http://localhost:3000/ and `/components`.
- **Evidence:** No page gives a start date or says which build day it is today. A visitor sees "Label Text: Build day 2 of 21: Planned" next to "Badge: Build day 2 of 21: In progress". The snapshot is dated 30 September 2026, but the page gives no way to tell whether day 2 has passed. "More arrive each build day" ties React code to the Figma schedule, but Badge has React code while its Figma status is In progress, and Headline is Ready in Figma with no code. The two tracks are not linked.
- **Fix:** State the schedule once, on `/docs` "Component status": "Build day 1 was <date>; today is day N." Then show the current day next to the snapshot date. Change the hero to "Figma components move to Ready on a 21-day schedule. React code follows separately: 5 components so far." If the schedule has no fixed dates, drop "Build day N of 21" from Planned cards.

## 8. MEDIUM: Ready components without React code get a thin page with no accessibility guidance

- **Where:** `src/app/components/[slug]/page.tsx:59-67`. Variants and states, Figma to code and Accessibility render only when `componentDocs[slug]` exists. URL: http://localhost:3000/components/dropdown-menu and `/components/headline`.
- **Evidence:** The Button, Badge, Input, Avatar and Accordion pages have eight sections. Dropdown Menu is Ready ("Safe to design with", per `/docs`), but its page has only Example, When to use, Do and don't, and Related. A menu's keyboard model (arrow keys, Escape, focus return, typeahead) is a design decision that a designer needs before handoff. The site has the Naming table, but it does not say which Figma properties this component exposes. After the parallel edits the two page types now differ a lot, and the difference follows code status rather than design status.
- **Fix:** For every Ready component, always render "Figma properties" (the property names and values from the Figma file) and "Expected accessibility" (keyboard, roles, focus). Mark these sections "design spec, no code yet" when there is no React code. Show "Props" and "Variants and states" only when code exists.

## 9. MEDIUM: "440–1440 responsive range" and the frame pills mislead

- **Where:** `src/app/page.tsx:98` (hero stat), `:50` and `:189-198` (the "Tokens that hold from 440 to 1440" pills, with 1440 highlighted in lime). URL: http://localhost:3000/ at 390 and at 1440.
- **Evidence:** At 390 the hero says the range starts at 440, so a phone visitor seems to be outside it. The range is really the set of Figma frame sizes, and Foundation calls them device frames. The four pills look like a segmented control with 1440 selected, but they are static `<li>` elements that do nothing when clicked. This is a false affordance in the one section that sells responsiveness.
- **Fix:** Rename the stat to "4 device frames" (or "Figma frames 440 to 1440"). Remove the selected state from the pills and show them as plain labels. Alternatively, make them real toggles that resize the "Button / Primary / Large" preview, which would actually demonstrate the claim.

## 10. LOW: The Foundation accessibility table undersells target size

- **Where:** `src/app/foundation/page.tsx:141`. URL: http://localhost:3000/foundation#accessibility
- **Evidence:** The row says targets are "at least 44px tall on touch screens". The site now measures 44px at 1440 too (header nav 97x44, theme toggle 44x44, footer links 44px high). The house rule and 2.5.5 AAA apply at every width, so the copy describes the old breakpoint-dependent behaviour. The claim "every page of this site is checked against it automatically" (`:182`) is true (`e2e/a11y.spec.ts` runs axe with `wcag2aaa`), but the page gives no evidence of it.
- **Fix:** Change the row to "Every button, link, tab and toggle has at least a 44 by 44px target, at every screen width." Link "checked automatically" to the test file on GitHub.

## 11. LOW: Slogan headlines read as generated copy, and one is contradicted by the code

- **Where:** `src/app/page.tsx:121` ("Every pixel traces back to a token."), `:215` ("Built in public, one day at a time."), `src/components/home/FigmaPanel.tsx:22` ("Paste layers, not screenshots."), and the hero ("One system. Designed in Figma, built in React.").
- **Evidence:** All four use stock patterns: the three-beat fragment, the "X, not Y" contrast, and the "one day at a time" cliché. The first one is not true of the page that shows it. `src/app/page.tsx` hard-codes hex values (`bg-[#015099]` `:39`, `bg-[#8c2b2c]` `:41`, `border-[#0276e3]` `:42`, and eight `text-[#...]` classes at `:287-298`), and `src/` has 31 such arbitrary-hex classes in total. The hero says "built in React" while the paragraph under it says only 5 of 51 components are.
- **Fix:** Use plain statements that the page backs up. For example: hero "Figma components and React code for fintech and consumer apps", 01 "Three token layers feed every component", 02 "Component status, updated each build day", 03 "Copy any example into Figma as editable layers". Replace the hard-coded hexes with the theme tokens (`bg-brand`, `bg-danger`, `border-focus`, and so on). The home page can then make its claim honestly.

## 12. LOW: Templated microcopy on component pages

- **Where:** `src/app/components/[slug]/page.tsx:316` ("4 of 16 other atoms, same role and ready ones first."). `src/components/FigmaFrame.tsx:41` ("Copied") compared with `src/components/home/FigmaPanel.tsx:68` ("Copied. Paste in Figma"). `/templates` is a "No templates yet" page that no navigation links to.
- **Evidence:** The Related intro describes the sorting algorithm instead of telling the reader something useful. The same Copy to Figma action gives two different confirmations depending on the page. `/templates` is reachable only by guessing the URL, so it is a dead end.
- **Fix:** Change the Related intro to "More atoms" (or "More molecules"), and drop the count and the sort explanation. Use one confirmation everywhere ("Copied. Paste into Figma with Ctrl V or Cmd V"). Either `noindex` `/templates` and leave it out of the sitemap, or link it from `/docs` "What is in it" as "Templates: planned".

---

### Suggested order

Fix 1, 2 and 4 first. They are small code changes that remove the most visible reasons to distrust the site. Then fix 3, which decides whether an engineer can start at all, and 5, which decides whether the headline feature behaves as described. Items 6 to 9 are content work, and 10 to 12 are copy edits.
