# Review 006: Visual design and brand

Reviewer: visual and brand design. Scope: hierarchy, type rhythm, spacing, container alignment, radius and border consistency, color use, and how well home matches the docs pages.

Method: Playwright (msedge) at 1440 and 390, light and dark, on `/`, `/docs`, `/foundation`, `/components`, `/components/button`, `/themes`, `/naming`. Each page was scrolled before capture. DOM measurements came from `getBoundingClientRect` and `getComputedStyle`, and I read the source too.

Note: the working tree was being edited while I reviewed (brand blue was renamed from `blue-700` to `blue-800` in `globals.css`, `page.tsx` and others). Line numbers match the files as of this review. Each finding below was rechecked against the current source.

Constraints for every fix below: Urbanist stays, no change lowers contrast below 7:1 for text, no gradients or glows, tap targets stay at 44px or more.

---

## 1. HIGH: Header, docs and footer use one container width, home uses another

- **Pages:** all. **Files:** `src/components/Header.tsx:30` (`max-w-7xl`, which is 1280), `src/app/docs/page.tsx:38`, `src/app/foundation/page.tsx:160`, `src/app/naming/page.tsx:106`, `src/app/themes/page.tsx:57`, `src/app/components/page.tsx:22`, `src/app/components/[slug]/page.tsx:66` (all `max-w-7xl`). Against them: `src/app/page.tsx:55,110,204,236,242` and `src/components/Footer.tsx:25` (`max-w-[1240px]`).
- **What is wrong:** Measured at 1440: the header logo and every docs H1 start at x=104. Home content and the footer start at x=124. On home, the logo sits 20px left of the H1 directly below it. On every docs page, the footer wordmark sits 20px right of the content above it. Nothing shares one left edge across the whole site.
- **Why it matters:** The left edge is the strongest line on a page. A 20px jog reads as an accident on any screen, and it undercuts a site that sells precision ("every pixel traces back to a token").
- **Fix:** Add one container token and use it everywhere. In `globals.css` `@theme`, add `--container-page: 77.5rem;` (1240px). Then replace `max-w-7xl` and `max-w-[1240px]` with `max-w-page` in the files listed above. Keep `px-6`.

## 2. HIGH: In dark mode the hero's main card stays white

- **Page:** `/` dark, 1440 and 390. **File:** `src/components/home/HeroBento.tsx:35` (`useState(false)`) and `:65` (`dark ? "theme-dark" : "theme-light"`).
- **What is wrong:** The card always mounts with `theme-light`, so with the site in dark mode it renders `#ffffff` (measured). It is the brightest and largest object on a `#19212e` page, and its toggle says "Light" while the site is dark.
- **Why it matters:** The first impression in dark mode is a white slab, and the card shows the opposite of the theme the visitor chose. The demo exists to prove the tokens flip with the theme, so starting in the wrong mode undercuts it.
- **Fix:** Default to the site theme. Use `const [dark, setDark] = useState<boolean | null>(null);` and set the class as `dark === null ? "" : dark ? "theme-dark" : "theme-light"`, so the card takes the site's tokens until someone toggles it. For the label and icon, read `document.documentElement.classList.contains("dark")` in a `useEffect` and keep that in a separate `siteDark` state, used only when `dark === null`.

## 3. HIGH: The status pill above the hero wraps at 390, and it is the eyebrow pill the house rules ban

- **Page:** `/` at 390. **File:** `src/app/page.tsx:57-62`.
- **What is wrong:** The lime counter breaks into two lines, "9 /" over "51". It measures 36px tall against a 16px line height, so the rounded-full chip becomes a lumpy oval. The sentence beside it also wraps to two lines. At 1440 it is an eyebrow pill with a nested lime chip, sitting above the H1.
- **Why it matters:** This is the first thing on the page on a phone, and it looks broken. It also breaks the "no eyebrow-pill clutter" rule.
- **Fix:** Replace the pill with a plain line: `<p className="rise text-sm font-medium text-gray-700"><span className="font-semibold text-gray-900 tabular-nums whitespace-nowrap">{ready} of {total}</span> components ready, {days}-day build in progress</p>`. Drop the border, the background and the lime chip. If the chip has to stay, at least add `whitespace-nowrap shrink-0` to the inner span at `:58`.

## 4. HIGH: Lime is the loudest color on the page, and brand blue has no surface of its own

- **Page:** `/`, light and dark. **Files:** `src/app/page.tsx:41-43,58,113,134,182,190,250,273,279-280`; `src/components/home/HeroBento.tsx:10,147`; `src/components/home/StatusBoard.tsx:11`; `src/components/home/FigmaPanel.tsx:52,59`.
- **What is wrong:** I counted more than 20 lime marks on the home page: the hero chip, the PWR bill tile, the whole type/scale card, the 01 eyebrow, the ramp outline, three Number marks, the "= Button" label, the 1440 chip, every in-progress dot, the lime-soft icon and Success pill, the whole "In Figma" card, and three code keywords. Two of these are full lime slabs, about 290x210 and 590x380. In dark mode both slabs are the brightest areas on screen. Brand blue `#015099`, by contrast, appears only in demo Buttons and three words of the H1, so the brand reads as navy plus lime, not Natuna blue.
- **Why it matters:** A signal color only works while it is rare. With lime on every section it stops pointing at anything, and the brand color looks secondary. The darker AAA blue does look premium where it appears (deep, calm, 8:1 with white), but it never gets a surface large enough to register.
- **Fix:** Limit lime to the in-progress status dot plus one accent per inverse section.
  - Type/scale card (`HeroBento.tsx:147`): change to `rounded-3xl border border-gray-200 bg-surface p-5 text-gray-900`, and change the divider `border-inverse/20` to `border-gray-200`.
  - "In Figma" card (`page.tsx:250`): change to `bg-brand text-white` (8.0:1), and its button at `:260` to `bg-white text-brand` (8.0:1). Brand blue then gets one large surface, and it sits next to the navy "In code" card as a pair.
  - Code keywords at `:273,279-280`: use the CodeBlock token colors (see finding 12) in place of lime.
  - Hero chip at `:58`: removed by finding 3.
  - The 01 eyebrow, the ramp outline, the 1440 chip and the status dot can stay.

## 5. MEDIUM: The home page ignores the documented radius scale, and overrides the Button's own radius

- **Pages:** `/` against `/foundation#radius`. **Files:** `src/components/home/HeroBento.tsx:65` (28px), `:95` (14px), `:99` (10px), `:120,124` (`Button ... rounded-[14px]`); `src/app/page.tsx:41-42` (3px), `:153` (5px), `:77,83` (14px), `:250,265` (28px), `:276` (14px), `:195` (`outline-[#5fa3ec]`, an off-palette hex); `src/components/home/StatusBoard.tsx:86` (14px); `src/components/home/FigmaPanel.tsx:50` (20px).
- **What is wrong:** Foundation documents the radius scale as 4/8/16/24/32/full, with "Buttons, inputs: 8px" and "an 8px button sits inside a 16px card". Home uses 3, 5, 10, 14, 20 and 28, none of which are on that scale. The hero's own `<Button>` is forced to 14px, so the showcase of the system contradicts the system. The home CTAs at `page.tsx:77,83,260,288` and `FigmaPanel.tsx:74` are hand-made navy links at 52px with a 14px or 16px radius, not the `Button` that the docs present.
- **Why it matters:** A visitor who opens /foundation after the home page sees rules that the landing page does not follow. Nesting also stops reading cleanly: a 14px button sits in a 28px card in one place and a 32px card in the next.
- **Fix:**
  - Map every radius onto the scale: 3px and 5px to `rounded-sm`, 10px to `rounded-md`, 14px rows and code blocks to `rounded-xl`, 20px to `rounded-2xl`, 28px to `rounded-3xl`.
  - Remove `rounded-[14px]` from `HeroBento.tsx:120,124`.
  - Add `inverse: "bg-inverse text-inverse-text dark:bg-inverse-text dark:text-inverse"` as a variant in `src/ui/button.tsx`, then render the home CTAs as `<Link className={buttonStyles({ variant: "inverse", size: "lg" })}>`. This keeps the navy look and makes the CTAs real system buttons.
  - Change `outline-[#5fa3ec]` to `outline-blue-300`.
  - Replace the arbitrary shadows (`HeroBento.tsx:65`, `FigmaPanel.tsx:50`) with `shadow-lg`, since the docs say shadows come from the Natuna effect styles.

## 6. MEDIUM: The Primitives card still points at the old brand step

- **Page:** `/` Foundation band. **File:** `src/app/page.tsx:134` (`s.step === "700"`), `:140-141` (`blue/700`, `#026ACC`).
- **What is wrong:** The Color card beside it now says `bg/brand to blue/800`, with swatch `#015099` (`:35`), and every brand fill on the site is `#015099`. The Primitives card still outlines step 700 and labels it `#026ACC`, a lighter blue than the "Pay" button 300px to its right.
- **Why it matters:** This band's whole message is "every pixel traces back to a token". Two neighbouring cards naming two different brand steps breaks that claim.
- **Fix:** Change `:134` to `s.step === "800"` and `:140-141` to `blue/800` and `#015099`.

## 7. MEDIUM: Home type sizes sit off the documented type scale, and some go below its minimum

- **Pages:** `/` against `/foundation#typography`. **Files:** `src/app/page.tsx:30` (13px eyebrow), `:70` (19px), `:96` (28px), `:118` (17px), `:183` (26px), `:184` (15px); `HeroBento.tsx:82` (22px), `:99,141` (11px); `StatusBoard.tsx:82` (15px), `:83` (11px); `FigmaPanel.tsx:35` (17px), `:39` (15px). Also `globals.css:385-397`.
- **What is wrong:** The documented scale is 12/14/16/18/20/24/28/32. Home uses 11, 13, 15, 17, 19, 22 and 26, none of which are on it. The 11px labels ("Ready", "In progress", button state names) sit under Caption 2's 12px floor, which the docs say to "avoid for anything users must read". Docs H1s are 48px at -0.025em. Home display type uses -0.03 to -0.035em, and the `.display` and `.hero-name` classes in `globals.css` that were meant to unify this are not used anywhere.
- **Why it matters:** The step from home to docs feels like a step between two sites. The smallest status labels are also hard to read on a phone.
- **Fix:**
  - 11px to `text-xs` (12px).
  - 13px to `text-sm` (14px), or `text-xs` for meta.
  - 15px and 17px to `text-base` (16px) and `text-lg` (18px).
  - 19px to `text-xl` (20px).
  - 22px and 26px to `text-2xl` (24px).
  - The 28px stat values can stay (Header 2 is 28).
  - Put the H1 tracking in one place: use `tracking-[-0.03em]` on the docs H1s (`docs/page.tsx:40` and siblings), or delete the unused `.display` and `.hero-name` rules.

## 8. MEDIUM: Section headings on home change size and left edge partway down the page

- **Page:** `/` at 1440. **Files:** `src/app/page.tsx:31` (h2 `clamp(36px,4.4vw,56px)`, used by 01 and 02), `:245` (04 `clamp(32px,3.6vw,46px)`); `src/components/home/FigmaPanel.tsx:29-33` (03, same smaller clamp, inside `p-14`).
- **What is wrong:** Sections 01 and 02 open with 56px headings at x=124. Section 03's eyebrow and heading move inside a bordered panel to x=181 and drop to 46px. Section 04 stays at 46px. The numbered 01 to 04 sequence promises four equal sections, but the eye loses the left rail at 03.
- **Why it matters:** A consistent heading rail is what makes a long landing page scannable. The jog at 03 makes it read as a different kind of block.
- **Fix:** Use the `h2` constant for all four sections. In `FigmaPanel`, move the eyebrow and h2 out of the panel and above it, like section 02 does with its grid, so they start at the container edge. Keep the panel for the copy, the list and the demo card.

## 9. MEDIUM: Home and /components use two different status and filter languages

- **Pages:** `/` (StatusBoard) against `/components`. **Files:** `src/components/home/StatusBoard.tsx:10-12,62-64`; `src/components/ComponentOverview.tsx:111,173-174`; `src/lib/natuna-tracker.ts` `statusStyle`.
- **What is wrong:** Home shows status as a navy dot (Ready), a lime dot (In progress) and a hollow ring (Planned), with rounded-full filter tabs that fill navy when active. /components shows the same statuses as tinted rectangular chips (green, amber, gray), with `rounded-md` filter buttons that fill brand blue when active. The same data and the same filter control look different one click apart.
- **Why it matters:** A visitor learns "lime means in progress" on home and then sees amber for it on /components. Brand blue also gets spent on a filter toggle, which weakens it as the single primary-action color.
- **Fix:** Use one status mark everywhere: add the StatusBoard dot (`h-2.5 w-2.5 rounded-full border-2` plus the same fills) inside the docs status badges, and make the In progress badge `bg-lime-soft text-lime-ink`. Then give the docs filter the home tab style: `ComponentOverview.tsx:173-174` becomes `rounded-full border px-4 text-sm min-h-11`, with active `border-inverse bg-inverse text-inverse-text dark:border-inverse-text dark:bg-inverse-text dark:text-inverse`. Brand blue then stays reserved for the primary Button.

## 10. MEDIUM: The "On this page" rail moves 240px between docs pages

- **Pages:** `/docs` against `/foundation` and `/naming`. **File:** `src/app/docs/page.tsx:39` (`min-w-0 max-w-3xl flex-1`).
- **What is wrong:** At 1440 the table of contents sits at x=936 on /docs and at x=1176 on /foundation and /naming. The cause is that /docs caps the whole `main` at 768px, while the others let `main` fill the row.
- **Why it matters:** Moving between Introduction and Foundation, the right rail jumps about a quarter of the screen. Docs chrome should hold still, with only the content changing.
- **Fix:** In `docs/page.tsx:39` use `min-w-0 flex-1` and move `max-w-3xl` onto the inner sections, or onto a wrapper `div`, so line length stays the same and the rail lands at 1176 like its siblings.

## 11. LOW: The Copy to Figma demo card wraps badly at 390

- **Page:** `/` at 390. **File:** `src/components/home/FigmaPanel.tsx:51-59`.
- **What is wrong:** With the icon, the title and the Success pill on one row, the title breaks to "Transfer / sent" and the subtitle breaks to "To savings / •••• 4821". This card is meant to show a polished component.
- **Fix:** Add `flex-wrap` to the row at `:51` and `whitespace-nowrap` to the title at `:56`. Or move the Success pill onto the amount row (`:62`) so the header row only holds the icon and the text. Also reduce the outer padding to `p-5 sm:p-8` at `:49`, which currently nests `p-7` and `p-6`.

## 12. LOW: There are two code-block styles

- **Pages:** `/` "In code" card against `/components/button`. **Files:** `src/app/page.tsx:276-282`; `src/components/CodeBlock.tsx:35-41,106`.
- **What is wrong:** The docs CodeBlock uses its own navy (`#141b26`, which matches neither `inverse` `#0b1220` nor `inverse-raised` `#131c2e`) with violet, green and sky tokens. The home snippet uses `inverse-raised`, lime keywords and a separate `#dce3ec` text color. The same "code" object has two looks.
- **Fix:** In `CodeBlock.tsx:106` use `bg-inverse` (and swap the fade's `from-[#141b26]` to `from-inverse`). On home, color the snippet with the CodeBlock token map (`text-[#cfaaff]` keywords, `text-[#aad98c]` strings, `text-[#f1f5f9]` plain), or render it through `CodeBlock`. All of these colors clear 7:1 on `#0b1220`.
