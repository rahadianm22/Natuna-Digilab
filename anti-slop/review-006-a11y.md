# Review 006: Accessibility (WCAG 2.2 AAA), beyond the automated scan

Date: 2026-10-05. Branch: `redesign-docs-site`. Target: http://localhost:3000 (dev server).

Method: Playwright driving Edge (`chromium.launch({ channel: "msedge" })`) at 1280x900, 640x450 (200% zoom at 1280) and 320x225 (400% zoom at 1280). I used keyboard presses only for the interaction checks. Names come from role queries, `ariaSnapshot()`, and the CDP full accessibility tree (I used CDP to confirm inert content, because Playwright's snapshot ignores `inert`). Targets were measured with `getBoundingClientRect`. I emulated reduced motion with `reducedMotion: "reduce"`. Contrast is out of scope, because axe `wcag2aaa` already passes it.

Pages covered: `/`, `/docs`, `/foundation`, `/components`, `/components/button`, `/components/dropdown-menu`, `/components/skeleton`, `/components/spinner`, `/themes`, `/naming`, `/privacy`.

Every finding below was reproduced. I left out anything I could not reproduce.

---

## 1. HIGH: Shift+Tab leaves focused controls fully hidden under the sticky header

- **Pages:** all. Worst on `/` (status board) and `/components` (cards).
- **Code:** `src/components/Header.tsx:22` (`sticky top-0`, 65px tall) and `src/app/foundation/page.tsx:171` (second sticky row at `top-16`, below lg). No `scroll-padding-top` exists anywhere. `src/app/globals.css:316-327` sets `scroll-margin-top` only on `h2[id]`/`h3[id]`, which helps anchor jumps but not focus.
- **WCAG:** 2.4.11 Focus Not Obscured (Minimum, AA) when an item is fully hidden. 2.4.12 Focus Not Obscured (Enhanced, AAA) when any part is hidden.
- **Problem:** On `/`, Shift+Tab backward from the footer places focus on status-board links ("Alert", "Radio Button", "Comment", "Checkbox", "Transaction List Item") at `top=0`. These links are about 48px tall, so the 65px header covers them completely. Others ("Combobox", "Chip", "Card") sit at `top=61` and are partly covered. On `/components/button`, the demo buttons sit at `top=43` and are partly covered. On `/components`, the cards are clipped at `top=0`. On `/foundation`, the color swatch buttons sit at `top=8`, under the header.
- **Fix:** Reserve the sticky height for every scroll the browser makes to show focus:
  ```css
  html { scroll-padding-top: calc(65px + 1rem); }
  @media (width < 64rem) { html:has(.with-section-row) { scroll-padding-top: calc(65px + 57px + 1rem); } }
  ```
  Then the per-heading `scroll-margin-top` rules can go.

## 2. HIGH: Targets shrink below 44px at the sm and lg breakpoints

- **Pages:** all, at 1280px.
- **Code (measured at 1280):**
  - `src/components/ThemeToggle.tsx:34`: `sm:h-9 sm:w-9`, 36x36
  - `src/components/CommandSearch.tsx:141`: `sm:h-9`, 208x36
  - `src/components/Header.tsx:46`: main nav links `py-1.5`, about 97x32
  - `src/components/Header.tsx:64`: GitHub `h-9 w-9`, 36x36
  - `src/components/CodeBlock.tsx:120,138,146`: TS/JS tabs, Expand, Copy `sm:min-h-8`, 32px high (TS is 39x32)
  - `src/components/home/HeroBento.tsx:73`: bills theme switch `sm:min-h-8`, 72x32
  - `src/components/ComponentSidebar.tsx:30,44,69,87`: `lg:min-h-10/9/9/8`, 40, 36, 36, 32px
  - `src/components/ComponentOverview.tsx:173`: filter buttons `sm:min-h-9`, 36px
  - `src/components/FigmaFrame.tsx:53`: Copy to Figma, Download SVG `sm:min-h-9`, 36px
  - `src/components/Footer.tsx:20`: `sm:min-h-0`, 31px
  - `src/app/components/[slug]/page.tsx:74,78`: breadcrumb `sm:min-h-0`, 79x20 and 40x20
  - `src/components/OnThisPage.tsx:52`: `py-1`, 28px
- **WCAG:** 2.5.5 Target Size (Enhanced, AAA). The 32px and 20px targets with neighbours under 24px apart also put 2.5.8 (AA) at risk.
- **Problem:** Each control is 44px on phones and then shrinks back on larger screens. AAA has no exception for a mouse or a large screen, and people with tremor use desktops too. The breadcrumb links are 20px high.
- **Fix:** Remove the `sm:`/`lg:` reductions (`sm:h-9`, `sm:min-h-8`, `sm:min-h-9`, `sm:min-h-0`, `lg:min-h-8/9/10`) so `min-h-11`/`h-11 w-11` holds at every width. In the header nav, change `py-1.5` to `min-h-11 inline-flex items-center`. If the visual size must stay compact, extend the hit area with a pseudo-element (`relative after:absolute after:-inset-y-1.5 after:inset-x-0`).

## 3. MEDIUM: A Button that enters `loading` drops keyboard focus to `<body>`

- **Pages:** `/` (bills card "Pay Rp 860.500") and `/components/button` ("Save changes", "Delete account").
- **Code:** `src/ui/button.tsx` (`disabled={disabled || loading}`), used from `src/components/home/HeroBento.tsx:120` and `src/components/demos.tsx:21,24`. The bill rows (`HeroBento.tsx:92`, `disabled={b.paid || paying}`) behave the same way.
- **WCAG:** 2.4.3 Focus Order and 4.1.3 Status Messages.
- **Problem:** Pressing Enter on "Save changes" or "Pay" disables the focused button, and `document.activeElement` becomes `BODY` at once. It stays there when loading ends. Screen readers lose their place. After a payment, the only announcement is the polite `Rp 0` total. Nobody hears "3 bills paid", and the heading change ("1 bill due this week") is silent. This is the system's own Button, so every product that uses `loading` inherits the problem.
- **Fix:** In `Button`, do not set native `disabled` for `loading`. Keep `aria-disabled="true"` plus `aria-busy`, and ignore clicks while loading, so focus stays on the button. In HeroBento, once paid, move focus to the next sensible control (Reset, or the card heading with `tabIndex={-1}`). Add a `role="status"` line such as "3 bills paid, Rp 860.500".

## 4. MEDIUM: Focus falls to `<body>` after every client-side route change

- **Pages:** all navigation: header nav, sidebar links, and Ctrl K results.
- **Code:** `src/app/layout.tsx:310`. Each page renders its own `<Header>`, so the link that was activated unmounts.
- **WCAG:** 2.4.3 Focus Order (also 3.2.3 predictability for screen reader users).
- **Problem:** Enter on "Foundation" in the header, on "Avatar" in the sidebar, or on a Ctrl K result leaves `activeElement === BODY`. Next's route announcer does say "Foundation · Natuna Digilab", but screen reader focus and the virtual cursor reset to the top of the document. Sidebar users have to Tab through the whole header again. The Ctrl K token jump (`/foundation#color`) also lands on `BODY` rather than the section.
- **Fix:** Add a small client component to the root layout. When `usePathname()` changes, it focuses `#main`, which already has `tabIndex={-1}` and no ring. When there is a hash, it focuses the target heading instead (give `h2[id]` `tabIndex={-1}`).

## 5. MEDIUM: The Ctrl K search field has no visible focus indicator

- **Page:** all (dialog).
- **Code:** `src/components/CommandSearch.tsx:171` (`focus:outline-none`). The wrapper at line 154 draws nothing either.
- **WCAG:** 2.4.13 Focus Appearance (AAA) and 2.4.7 Focus Visible.
- **Problem:** With the dialog open, the focused combobox computes to `outline: none`, `box-shadow: none`, and so does its parent. Only the text caret shows where focus is.
- **Fix:** Put `focus-within:ring-2 focus-within:ring-blue-600` (or an inset outline) on the row at line 154, or drop `focus:outline-none` and let the global `:focus-visible` rule apply.

## 6. MEDIUM: The bills-card theme switch has a name that contradicts its visible label

- **Page:** `/`.
- **Code:** `src/components/home/HeroBento.tsx:72`.
- **WCAG:** 2.5.3 Label in Name (A), and 4.1.2 for state.
- **Problem:** The visible text is "Light", but the accessible name is "Show the bills card in dark mode". A speech user who says "click Light" gets no match. A screen reader user hears an action, but the visible word describes the current state.
- **Fix:** Use a toggle with a stable name that contains the visible word: visible "Dark", `aria-pressed={dark}`, and `aria-label` removed (or "Dark mode for bills card"). The same pattern would also make the header `ThemeToggle.tsx:33` state explicit (`aria-pressed` with a fixed "Dark mode" name) instead of swapping labels.

## 7. MEDIUM: `/foundation` needs a horizontal scroll at 400% zoom

- **Page:** `/foundation`, Number > Spacing and sizing.
- **Code:** `src/app/foundation/page.tsx:285`. The 160px bar is drawn at true pixel width in a `grid-cols-[3.5rem_4.5rem_1fr]` row.
- **WCAG:** 1.4.10 Reflow (AA).
- **Problem:** At 320 CSS px (1280 at 400%), `scrollWidth` is 336 against `clientWidth` 320. The whole page scrolls sideways by 16px, and the H3, paragraph, and list overflow. At this size the two sticky bars (header 65px plus section row 57px) also take 122px of the 225px viewport, more than half the screen.
- **Fix:** Use `grid-cols-[3.5rem_4.5rem_minmax(0,1fr)]` and `max-w-full` on the bar, or let the 1fr cell `overflow-hidden`. Below about 480px wide or below about 500px tall, make the section row non-sticky (`max-sm:static`, or `@media (max-height: 500px) { position: static }`).

## 8. LOW: Esc in Ctrl K clears the text first and needs a second press to close

- **Page:** all.
- **Code:** `src/components/CommandSearch.tsx:158` (`type="search"`) and `:122` (`onInputKey` does not handle Escape).
- **WCAG:** 3.2.4 Consistent Identification and 3.3.2 (the footer says "Esc to close").
- **Problem:** After typing "chip", the first Esc empties the field and the dialog stays open. Only the second Esc closes it. Focus does return to the trigger correctly.
- **Fix:** Use `type="text"`, or handle `Escape` in `onInputKey` with `e.preventDefault(); close()`.

## 9. LOW: Ctrl K results change without being announced, and some options repeat a label

- **Page:** all.
- **Code:** `src/components/CommandSearch.tsx:174` (listbox; no status region) and `:73-74` (`note: statusText[c.status]`, `group: componentGroup(...)`).
- **WCAG:** 4.1.3 Status Messages and 2.4.6 Headings and Labels.
- **Problem:** Typing filters the list, but nothing announces the count or the "Nothing matches" message. The option for an untracked component reads "Button Group Not tracked Not tracked" and "Icon Button Not tracked Not tracked", because note and group are the same string.
- **Fix:** Add `<p role="status" className="sr-only">{results.length} results</p>` inside the dialog. Leave the note out when it equals the group.

## 10. LOW: Component cards and status rows say the status twice

- **Pages:** `/` status board and `/components` cards.
- **Code:** `src/components/home/StatusBoard.tsx:81` (dot `role="img" aria-label={l.label}`) next to `:83` (the same label as text), and `src/components/ComponentOverview.tsx:48-50` (`meta: "Done"` plus badge "Ready").
- **WCAG:** 2.4.4 Link Purpose and 2.4.6 Headings and Labels (AAA 2.4.9 asks for link text that is clear on its own).
- **Problem:** Link names come out as "Ready Accordion Ready" on the home page and "Artboard Done Ready" or "Button Done Ready" on `/components`. Below sm the text label is hidden, so the dot is the only source there. Above sm, screen reader users hear the status twice, and "Done" with "Ready" sounds like two different states.
- **Fix:** Mark the dot `aria-hidden="true"` and keep the visible label in the DOM at every size as `sr-only` below sm (`sr-only sm:not-sr-only`). On `/components`, leave out "Done" when the badge already says Ready, or write the meta line as "Built" for stable items.

## 11. LOW: The tab widgets do not support Home and End

- **Pages:** `/` (status filter) and every page with a TS/JS code block.
- **Code:** `src/components/home/StatusBoard.tsx:33-40` and `src/components/CodeBlock.tsx:97-103`.
- **WCAG:** 2.1.1 Keyboard (the ARIA tabs pattern the components say they follow).
- **Problem:** Arrow keys work, but Home and End do nothing. With "Ready" focused, End stays on "Ready" and Home stays on "Ready". The code-block handler also responds to Left and Right without `preventDefault`.
- **Fix:** Map `Home` to index 0 and `End` to `filters.length - 1` (in CodeBlock, Home to `ts` and End to `js`), and call `preventDefault()` for each key handled.

## 12. LOW: The home install snippet scrolls sideways but cannot be reached by keyboard

- **Page:** `/` ("Pick your starting point"), at 320px.
- **Code:** `src/app/page.tsx:276` (`<pre className="overflow-x-auto ...">` with no `tabIndex`).
- **WCAG:** 2.1.1 Keyboard.
- **Problem:** At 400% zoom the `<pre>` scrolls horizontally, contains nothing focusable, and is not focusable itself, so keyboard users cannot scroll to the clipped end of `<Button size="lg">Pay Rp 860.500</Button>`. `CodeBlock.tsx` already solves this with `tabIndex={0}` and an `aria-label`.
- **Fix:** Add `tabIndex={0}` and `aria-label="Import example"` to the `<pre>`, or use `<CodeBlock>`.

---

### Checked and passing (not reported)

- **Landmarks:** a single `main#main` (`tabIndex=-1`) on every page. Named navs (Main, Components, Breadcrumb, On this page, Docs, Project) with no duplicate names visible at once.
- **Headings:** one `h1` per page and no skipped levels.
- **Skip link:** the first Tab stop on every page.
- **Focus rings:** present on every Tab stop on `/`, `/components/button`, `/foundation`, and `/components`, apart from the Ctrl K input (finding 5).
- **Ctrl K modal:** native `showModal` keeps focus inside the page, and closing returns focus to the trigger.
- **Sidebar disclosures:** `aria-expanded` and `aria-controls` are correct, and collapsed lists are removed with `hidden`.
- **Inert demos:** the bento "Button states" Pay buttons and the `/components` thumbnails are absent from the real AX tree, verified through CDP.
- **Reduced motion:**
  - With `reduce` emulated, Reveal and the hero scroll-recede are skipped.
  - Infinite `spin`/`pulse` animations collapse to 0.01ms.
  - Sampled values stayed static over about 1s, with no flicker.
  - SectionChips scrolling honours the preference.
- **Reflow:** at 640px no page overflows. At 320px only `/foundation` does (finding 7).
