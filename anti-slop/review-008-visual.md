# Review 008: Visual design and brand

Reviewer: visual and brand design. Branch `redesign-docs-site` at `edd4e67`.

Method: Playwright (msedge) full-page captures of `/`, `/docs`, `/foundation`, `/components`, `/components/button`, `/themes` and `/naming` at 390 and 1440, light and dark, sliced so each part could be read at full size. Type sizes, tracking, card heights and gaps were measured with `getComputedStyle` and `getBoundingClientRect`, and the source was read for every finding. Line numbers match `edd4e67`.

Constraints for every fix: Urbanist stays, text stays at 7:1 or better, targets stay at 44px or more, no gradients or glows, no invented numbers.

## Overall verdict

The restyle worked. The home page now has one left edge, one heading size and a much quieter palette. Lime is down to five uses. Brand blue finally has a surface of its own (the "In Figma" card, 8.05:1 with white). Dark mode follows the site theme everywhere, the hero card included. The docs pages are calm and readable, and the component page sections (Variants and states, Figma to code, Accessibility) are well structured.

What still holds it back from feeling like a crafted product:

1. The signature accent (lime) is not part of the system the site documents.
2. The display type, the footer and the scroll motion come from the generic landing-page playbook, not from Natuna's own rules.
3. Selected states and chips speak three dialects across pages.

Swap the logo and the hero's bill-payment bento, with its rupiah amounts, would still read as Natuna. The navy-and-lime bands, the giant two-line footer wordmark and the blur-in reveals would not.

## Status of review 006 findings

| 006 | Topic | Status |
| --- | --- | --- |
| 1 | Two container widths | Fixed. Header, home, docs and footer all start at x=104 at 1440. |
| 2 | White hero card in dark mode | Fixed. The card follows the site theme and its toggle reads "Dark". |
| 3 | Eyebrow pill above the hero | Fixed. It is now a plain sentence. |
| 4 | Lime everywhere, no brand-blue surface | Mostly fixed. There are 5 lime uses, and the "In Figma" card is `bg-brand`. Finding 1 below covers what is left. |
| 5 | Off-scale radii, hand-made CTAs | Partly fixed. Radii are on the scale now, but the home CTAs are still hand-rolled links (finding 7). |
| 6 | Primitives card pointed at step 700 | Fixed. It now shows `blue/800` and `#015099`. |
| 7 | Home type off the scale | Partly fixed. 13px, 15px and 26px remain, and `.display`/`.hero-name` are still unused (finding 11). |
| 8 | Section 03 heading jogged right | Fixed. All four h2s are 56px at x=104. |
| 9 | Two status and filter languages | Partly fixed. Status badges now share `statusStyle`, but the filters still differ (finding 4). |
| 10 | "On this page" rail jumped | Fixed. It sits at x=1176 on /docs and /foundation. |
| 11 | Copy to Figma card wrapped at 390 | Fixed. |
| 12 | Two code-block styles | Partly fixed. The home snippet uses the CodeBlock token colors, but CodeBlock's `#141b26` is still off-token (finding 11). |

---

## 1. HIGH: The site's signature accent is not in the system it documents

- **Route:** `/` (light and dark) against `/foundation#color`.
- **Files:**
  - `src/app/globals.css:34-46` (`--color-lime*`, labelled "Landing palette")
  - `src/app/page.tsx:119,140,196`
  - `src/components/home/FigmaPanel.tsx:41,48`
- **Evidence:** /foundation lists three brand ramps (Azure Blue, Tomato Red, Slate Gray) and five utility ramps. Lime is not among them. Tomato Red is the second brand ramp, yet it appears nowhere on the site outside its own swatch row. The 01 eyebrow, the selected step outline, the 1440 chip, the Success pill and the icon tile are all in a color that no Natuna token produces. The home page says "Every pixel traces back to a token", and its accent breaks that claim.
- **Fix:** Use the documented brand ramp for the accent and delete `--color-lime`, `--color-lime-soft` and `--color-lime-ink`.
  - Eyebrow at `page.tsx:119`: `text-orange-300` (#ffa293 on #0b1220 is 9.67:1).
  - Step outline at `:140`: `outline-orange-300`.
  - 1440 chip at `:196`: `bg-orange-300 text-inverse`.
  - Success pill at `FigmaPanel.tsx:48`: the system's own success colors, `bg-emerald-100 text-emerald-900` (the Ready badge pair).
  - Icon tile at `:41`: `bg-blue-50 text-blue-800`.

  Natuna's second brand color then carries the accent. If lime is meant to stay, add it to Foundation as a documented ramp with contrast ratios, so the claim holds either way.

## 2. MEDIUM: The scroll reveal is blur-in theatre on a documentation site

- **Route:** `/`, every section below the hero.
- **Files:**
  - `src/app/globals.css:445-470` (`translateY(56px) scale(0.97)`, `filter: blur(8px)`, 900 to 1100ms, `160ms` stagger per item)
  - `src/components/home/Reveal.tsx:17-30`
- **Evidence:** The 16 `data-reveal-item` blocks start blurred and 56px low, then take over a second to settle, with each item 160ms behind the last. A four-item row finishes about 1.6s after it enters the viewport. Blur-to-sharp entrances are one of the most recognisable AI landing-page tells, and nothing on a reference site needs them. Dead motion code sits next to it: `data-reveal-cell` (`:456-463`, an overshoot bezier the comment at `:419` says the site does not use), `.pop`, `.screen-in`, `.hero-recede` and `@keyframes hero-recede` are not referenced by any component.
- **Fix:** Change `.reveal [data-reveal-item]` to `opacity: 0; transform: translateY(12px);` with `transition: opacity 400ms ease, transform 500ms cubic-bezier(0.22,1,0.36,1); transition-delay: calc(var(--i,0) * 50ms);` and remove `filter` from both rules. Then delete the unused `data-reveal-cell`, `.pop`, `.screen-in`, `.hero-recede` and `hero-recede` blocks, and the cell loop in `Reveal.tsx:18`.

## 3. MEDIUM: Nine heading sizes, and the documented scale stops at 32

- **Routes:** all.
- **Files:**
  - `src/components/Footer.tsx:29` (72px)
  - `src/app/page.tsx:68` (68px), `:35` (56px)
  - `src/app/docs/page.tsx:36`, `foundation/page.tsx:164`, `components/[slug]/page.tsx:106` (`sm:text-5xl`, 48px)
  - `docs/page.tsx:44` and siblings (`sm:text-3xl`, 30px)
  - `page.tsx:102,261,277` (28px)
  - `FigmaPanel.tsx:53` (26px)
- **Evidence:** Measured at 1440, headings come in 72, 68, 56, 48, 32, 30, 28, 26 and 24px. Foundation documents Header 1 at 32/44 and Header 2 at 28/40 for websites. Every docs H2 is 30px, which is on neither. Tracking is also ad hoc: 48px uses -0.025em, 56px uses -0.03em, 68px uses -0.035em and 72px uses -0.04em, while the 28px stat numbers and the 26px amount have no tracking at all.
- **Fix:** Document a display tier and use only that.
  1. In `globals.css` `@theme`, add `--text-display-1: 4.25rem` (68), `--text-display-2: 3.5rem` (56) and `--text-display-3: 3rem` (48), each with a line height of 1.02 and a letter-spacing token of -0.03em.
  2. Add the same three rows to the Typography table on /foundation.
  3. Docs H2s: change `sm:text-3xl` to `sm:text-[28px] sm:leading-[40px]`, which is Header 2.
  4. Delete the unused `.display` and `.hero-name` rules at `globals.css:405-417`, since the tokens replace them.
  5. Use `tracking-[-0.01em]` on every 24 to 32px display number.

## 4. MEDIUM: "Selected" looks different on every page

- **Routes:** `/`, `/components`, `/components/button`.
- **Files:**
  - `src/components/home/StatusBoard.tsx:68-69` (navy fill, `text-sm`)
  - `src/components/ComponentOverviewFilter.tsx:61-62` (brand blue fill, `text-xs`)
  - `src/components/CodeBlock.tsx:121-122` (`bg-[#015099]` TS/JS tab on dark)
  - `src/components/Header.tsx` (gray pill)
- **Evidence:** The same "All / Ready / In progress / Planned" filter is navy and 14px on home, and brand blue and 12px one click later on /components. The code tab adds a third blue-on-navy version. Brand blue is the documented primary-action color ("Use one primary per view"). Here it marks selection, so the button page shows three brand-blue fills in the first screen: Save changes, Pay and the TS tab.
- **Fix:** Use one selected style, the home one. In `ComponentOverviewFilter.tsx:61-62`, use `min-h-11 rounded-md border px-4 text-sm font-medium`, with active `border-inverse bg-inverse text-inverse-text dark:border-inverse-text dark:bg-inverse-text dark:text-inverse`. In `CodeBlock.tsx:122`, make the active tab `bg-white/15 text-white` (on `#141b26` it stays well above 7:1).

## 5. MEDIUM: On /naming, the "Kind" chips reuse the status colors

- **Route:** `/naming`, all property tables, light and dark.
- **File:** `src/app/naming/page.tsx:98-100`.
- **Evidence:** Variant uses `bg-blue-100 text-blue-900`, Boolean uses `bg-emerald-100 text-emerald-900` and Text uses `bg-amber-100 text-amber-900`. These are exactly In review, Ready and In progress from `natuna-tracker.ts:36-41`. A reader who just learned "green means Ready" on /components sees a green "Boolean" one click away. Status color should mean status only.
- **Fix:** Make the kind chips neutral: `rounded border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-900`, in one style for all three kinds. The label already carries the meaning.

## 6. MEDIUM: /components thumbnails shrink real text to 6 to 9px

- **Route:** `/components` at 1440 and 390.
- **File:** `src/components/ComponentOverview.tsx:104-108` (`scale-[0.45]` on phones, `sm:scale-[0.68]`).
- **Evidence:** Live previews are scaled with `transform`, so a 14px caption renders at about 9.5px on desktop and about 6px on a phone. The OTP, Comment and Label Text tiles show text you cannot read inside a 160px gray well that is mostly empty. The 56 tiles are the same size and shape, so the page reads as a uniform card grid of tiny previews, the main tell on that page.
- **Fix:** Render specimens at full size and crop, rather than scaling. Change the inner wrapper to `pointer-events-none w-full shrink-0` with no scale, and the well to `h-28 sm:h-36`, so the preview's own centering shows its most important part. On phones (`max-sm`), hide the thumbnail and render each entry as a 56px list row (name, meta, badge). That also cuts the 390 page, which measured 7810px tall in light mode.

## 7. MEDIUM: Home CTAs are still not the system's Button

- **Route:** `/` (hero, sections 03 and 04) against `/components/button`.
- **Files:**
  - `src/app/page.tsx:80-91` (`min-h-13`, navy), `:266-273`, `:301-308`
  - `src/components/home/FigmaPanel.tsx:65` (`rounded-xl`)
- **Evidence:** The site's own main call to action is a 52px navy link. The documented primary is a 48px brand-blue `Button size="lg"`. The home "Copy to Figma" is a navy 16px-radius button, while the same action on every component page is a gray 8px secondary. The Foundation page says "an 8px button sits inside a 16px card". The landing page is the one place that does not show that rule.
- **Fix:**
  - Add `inverse: "bg-inverse text-inverse-text hover:bg-gray-800 dark:bg-inverse-text dark:text-inverse"` to `variants` in `src/ui/button.tsx:12`.
  - Render the hero CTAs as `<Link className={buttonStyles({ variant: "inverse", size: "lg" })}>` and `buttonStyles({ variant: "ghost", size: "lg" })`.
  - Render the two section 04 links with `buttonStyles` too.
  - In `FigmaPanel.tsx:65`, use `buttonStyles({ variant: "secondary" })` so it matches the docs toolbar.

## 8. MEDIUM: The footer wordmark is the loudest type on every docs page

- **Routes:** all, most visibly `/docs`, `/themes` and `/components/button`.
- **File:** `src/components/Footer.tsx:29` (`text-[clamp(40px,6vw,72px)] leading-[0.9] tracking-[-0.04em]`), `:20` (`text-[15px]`), `:67` (`↑`).
- **Evidence:** At 1440 the two-line "Natuna / Digilab" is 72px. The H1 on the same docs pages is 48px. With 0.9 leading, the wordmark's line box ends 1.8px above the copyright line (measured 1719.5 against 1721.3 on /docs), so the "g" descender crowds it. The oversized two-line footer wordmark is a 2024 template trope, and here it repeats the header logo 1000px further down.
- **Fix:**
  - Set the wordmark to one line at `font-display text-2xl font-extrabold tracking-[-0.01em]`, with the logo mark from `Header.tsx` beside it, and use `gap-4` before the copyright.
  - Change the link size to `text-base` (on the scale).
  - Drop the `↑` glyph from Back to top, or use the Phosphor `ArrowUp` at 16px for consistency with the other icons.

## 9. LOW: Display headlines leave one-word orphans

- **Route:** `/` at 1440 and 390.
- **Files:** `src/app/page.tsx:35` (the `h2` constant), `:64-67`; `src/components/home/FigmaPanel.tsx:21`.
- **Evidence:** At 1440, "Every pixel traces back to a / token." and "Built in public, one day at a / time." each leave one word on the second line. At 390, the status line breaks to "...is in / progress." and "Pick your starting / point." does the same. No heading on the site sets `text-wrap`.
- **Fix:** Add `text-balance` to the `h2` constant and to the h1 at `:68`, and `text-pretty` to the hero status line and lead paragraphs. Do the same for the docs H1 and H2 classes.

## 10. LOW: The brand-blue card is 145px of empty blue at 1440

- **Route:** `/` section 04 at 1440.
- **File:** `src/app/page.tsx:260-273` (`mt-auto` on the link).
- **Evidence:** The card stretches to the 389px height of the "In code" card, and its three lines of copy end 145px above the button (measured). The one large brand surface on the site reads as unfinished next to a card that carries a code sample.
- **Fix:** Give the card a real object, as its sibling has. Render the Azure ramp already in scope (`azure.steps`, as at `:136-144`) as a 40px strip of swatches under the copy, labelled "Variables, styles and components". Use `rounded-md` swatches and a `ring-2 ring-white` on step 800. Keep `mt-auto` on the button.

## 11. LOW: Off-scale sizes, a count with heading tracking, and an off-token code background

- **Routes:** `/`, `/docs`, `/components`, `/components/button`.
- **Files:**
  - `src/components/home/FigmaPanel.tsx:46,52,55` (13px), `:53` (26px)
  - `src/app/docs/page.tsx:77` (15px code)
  - `src/app/components/[slug]/page.tsx:135,152,180,202,227,247` (13px code)
  - the count `<span>` inside the group h2 in `src/components/ComponentOverview.tsx`
  - `src/components/CodeBlock.tsx:107,167` (`#141b26`)
- **Evidence:** The docs scale is 12, 14, 16, 18 and so on, but 13px and 15px still appear in 16 places. On /components, the "17", "29" and "5" counts beside the group headings inherit the heading's -0.75px tracking at 16px (measured), which is too tight for small numerals. The docs CodeBlock background `#141b26` matches neither `inverse` (#0b1220) nor `inverse-raised` (#131c2e), so the home snippet and the docs code panel are two navies.
- **Fix:**
  - 13px to `text-sm` and 15px to `text-base`.
  - 26px to `text-2xl` (24, Header 1 tablet).
  - Add `tracking-normal font-medium tabular-nums` to the count span.
  - In `CodeBlock.tsx:107`, use `bg-inverse-raised`, and change `:167` to `from-inverse-raised`.

## 12. LOW: The home status board is 51 identical tiles

- **Route:** `/` section 02 at 1440.
- **File:** `src/components/home/StatusBoard.tsx:82-94`.
- **Evidence:** At 1440, ten full rows of identical bordered tiles, 37 of them "Planned", end in a single orphan tile, "Transaction List Item". That tile wraps to two lines and stands taller than the rest. /components already shows the same 51 entries with previews, so the home grid repeats it with less information. With the numbered "01 ·" eyebrows and the outline "npm package not released yet" pill (`page.tsx:278-280`), this is where the page reads most like a template.
- **Fix:** On wider screens, show status as three columns, one per group, each a plain list with a heading and count (`Ready 9`, `In progress 5`, `Planned 37`). Use `divide-y divide-gray-200` rows of `min-h-11 text-base`, not bordered tiles, and cap Planned at 8 rows with a "See all 37 on Components" link. On phones, keep the current tabs. Turn the npm pill into a plain `text-sm text-inverse-muted` line under the "In code" title.
