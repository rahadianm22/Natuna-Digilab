# Review 006: design-system substance, 2026-10-05

Scope: can a product team build from this site? I read `src/ui/*`, `src/lib/component-docs.ts`,
`src/lib/components-data.ts`, `src/components/ComponentPreview.tsx`, `src/components/demos.tsx`,
`src/app/components/[slug]/page.tsx`, `/foundation`, `/themes`, `/naming`, `src/lib/natuna-palette.ts` and
`src/app/globals.css`. I loaded the five coded component pages, /foundation and /themes in Edge with Playwright at
1280 and 1440px, in light mode and with `.dark` on the root. I resolved token classes to computed colors, measured
focus outlines and checked where focus goes. Contrast was computed with the same WCAG formula as `src/lib/contrast.ts`.
Every finding below was checked against the running site or the source. No source files were changed.

## Findings

### 1. HIGH: Foundation and Ctrl K show different hex values from the classes in the code for 6 color steps

- **Where:** `src/lib/natuna-palette.ts:24, 59, 97, 132, 133` compared with `src/app/globals.css:62-63, 74, 89, 114-115`.
  Also `src/app/foundation/page.tsx:137` and `src/components/CommandSearch.tsx:31-37`.
- **Gap:** The Foundation swatches and the Ctrl K token search read from `natuna-palette.ts`. The classes read from
  `globals.css`. They disagree:

  | Step | Foundation / search says | `text-*` renders |
  |---|---|---|
  | blue-700 | #026acc | #015099 |
  | blue-800 | #015099 | #013566 |
  | gray-600 | #4b5565 | #364152 |
  | emerald-800 | #386e16 | #25490f |
  | red-700 | #bb3a3b | #8c2b2c |
  | red-800 | #8c2b2c | #5e1d1e |

  I confirmed this in the browser: on /foundation the swatch labeled "700, #026acc" sits next to a `text-blue-700`
  probe that computes to `rgb(1, 80, 153)`. Two other places disagree too. The AAA table (`foundation/page.tsx:137`)
  says "Brand fill is blue-800 #015099 … danger is red-800 #8c2b2c", but in code `#015099` is blue-700 and `#8c2b2c`
  is red-700. And `natuna-palette.ts:2` says the file "Mirrors the @theme ramps", which is no longer true.
- **Cause:** Commit 9941562 ("Adopt WCAG 2.2 AAA") moved the *primitive* steps to darker hex values instead of choosing
  darker steps for the roles. The ramps in code now repeat values: blue-800 = blue-900, gray-600 = gray-700, red-800 =
  red-900, emerald-800 = emerald-900.
- **Why it matters:** This is the first thing a design-system site has to get right. A designer picks blue-700 in
  Figma (#026acc) and an engineer writes `text-blue-700` (#015099), so the two never match. That cuts against the
  trust that "Change a token and every component that uses it follows" (`foundation/page.tsx:163`) asks for.
- **Fix:** Set the primitive ramps in `@theme` back to the Figma values from `natuna-palette.ts`. Meet AAA through
  role tokens instead: `--color-brand: var(--color-blue-800)`, link text from blue-800, secondary text from gray-700,
  error text from red-800. The semantic layer in finding 2 makes this a small change. Correct the step names in the
  AAA table. Add a unit or e2e check that parses `@theme` and compares it to `palettes`, so the two cannot drift again.

### 2. HIGH: No semantic token layer. Components use primitives whose values flip in dark mode

- **Where:** `src/app/globals.css:179-227` (the dark block reassigns `gray-*`, `blue-*`, `red-*` and others),
  `src/app/themes/page.tsx:13-22, 60-61`, and every file in `src/ui` (`text-gray-900`, `border-gray-500`,
  `bg-blue-100 text-blue-800`, and so on).
- **Gap:** Only nine tokens are semantic (canvas, surface, ink, well, paper, brand, brand-hover, danger,
  danger-hover). Everything else is a primitive name whose value is inverted in dark mode: `gray-900` becomes
  #f1f5f9 and `blue-700` becomes #9aceff. Only some steps flip. `blue-600`, `blue-400` and most of `teal` and `violet`
  do not, so `blue-600` is the same in both modes while `blue-700` inverts. /themes says "Components ask for a role,
  such as surface or primary text", but its role table shows primitives as the tokens (`gray-200`, `gray-600`,
  `blue-700`). It also leaves out roles the five components actually depend on: input border (`gray-500`), focus ring
  (`blue-600`), disabled fill and text (`gray-100` / `gray-500`), hover fills (`gray-50`, `gray-200`, `brand-hover`)
  and the five Badge tone pairs.
- **Why it matters:** A team cannot tell from a class name what it will get in dark mode. They also cannot ask for
  "a dark gray in both modes", because no such token exists. The comment at `globals.css:175-177` says the dark block
  mirrors the Figma "Color Property" collection, which already has Light and Dark columns. The semantic layer exists
  in design but not in code.
- **Fix:** Add role tokens to `@theme` that point to primitives, and redefine only those tokens in `.dark` and
  `.theme-light`. Leave the primitives fixed. A minimum set that covers `src/ui`: `text-primary`, `text-secondary`,
  `text-link`, `border-default`, `border-input`, `focus-ring`, `fill-disabled`, `text-disabled`,
  `fill-hover`, and `{info,success,warning,danger,neutral}-{bg,fg}`. Move the five components onto them (about 25
  class strings). Make the /themes table list exactly these tokens. Since that page is already "keep in step" by hand
  (`themes/page.tsx:11-12`), generate it from one exported object.

### 3. HIGH: In dark mode the focus outline is 2.98:1 on surface, under the 3:1 the site claims

- **Where:** `src/app/globals.css:306-309` (`outline: 2px solid var(--color-blue-600)`; blue-600 is not overridden in
  dark), `src/ui/input.tsx:24-26` (`focus-visible:ring-blue-600`), and the claims at `src/app/foundation/page.tsx:138,
  140` and `src/ui/input.tsx:24`.
- **Gap:** In dark mode I measured the focused "Export" button on /components/button: outline `rgb(2, 118, 227)` over
  the frame background `rgb(39, 48, 63)` (`surface`). That is 2.98:1. On `canvas` it is 3.62:1. Every component demo
  sits on `surface`, and so do cards, tables and the props table. The Foundation AAA table says "focus ring blue-600,
  above 3:1 on their surface" and "2.4.13 Focus Appearance … 2px, 3:1".
- **Why it matters:** The site's main promise is WCAG 2.2 AAA. A keyboard user in dark mode gets a focus indicator
  below the stated minimum, on the most common background in the system.
- **Fix:** Add a `focus-ring` role (finding 2) that stays blue-600 in light and becomes blue-400 (#359dff, 4.69:1 on
  surface, 5.71:1 on canvas) or blue-300 (#67b6ff, 6.14:1 and 7.48:1) in dark. Use it in the global outline and in the
  Input ring. Add the surface case to the e2e a11y spec, because axe does not measure outline contrast.

### 4. HIGH: The five coded component pages show neither the variant matrix nor the states

- **Where:** `src/app/components/[slug]/page.tsx:108-140` renders only `<Demo>` when `componentDocs[slug]` exists,
  and the TOC at `:48-54` has no Variants or States entry. The full matrix exists in
  `src/components/ComponentPreview.tsx:28-42, 92-107, 134-139, 298-306`, but it is only used on design-only pages and
  in the catalog.
- **Gap:** I checked in the browser:
  - /components/badge shows one Badge ("Pending"). It toggles between two of the five tones, so neutral, info and
    danger never appear.
  - /components/input shows the default field only. The error state appears only after typing and blurring. The
    disabled state appears nowhere, although `input.tsx:25` styles it.
  - /components/button has no hover, focus or pressed specimen, no "loading" label, and no table of the variants.
  - /components/avatar shows the three sizes, which is fine. /components/accordion shows no closed-only example and
    no long-title example.
- **Why it matters:** Teams use a component page to check "what does X look like in state Y" before they build.
  Polaris, Primer and Material all lead with a static variants and states grid. The coded components show less than
  the design-only ones.
- **Fix:** Add a "Variants and states" section under Usage for coded components, rendering `ComponentPreview` (it
  already uses the real `@/ui` components). Extend the Badge preview to label each tone and the Input preview to add
  `disabled`. For Button, add a static row with forced states (a `data-state` or `:focus-visible` specimen using
  `focus-visible:` classes on a wrapper, or a caption with the token per state: hover `brand-hover`, disabled
  `gray-100`/`gray-500`). The effort is small: the component exists and the page change is about 15 lines.

### 5. MEDIUM: The component page template has no Anatomy or Accessibility section

- **Where:** `src/lib/component-docs.ts:11-15` (`ComponentDoc` has only `importCode`, `usage`, `props`) and
  `src/app/components/[slug]/page.tsx:48-54`.
- **Gap:** The accessibility behavior lives only in code comments and prop descriptions:
  - Button defaults to `type="button"` and sets `aria-busy`.
  - Input links its note with `aria-describedby` and sets `aria-invalid`.
  - Avatar is `role="img"` with the name as its label.
  - Accordion is native `details` and toggles with Enter and Space.

  No page states the keyboard model, what a screen reader announces, or what the consumer still has to do (for
  example, an icon-only Button needs `aria-label`). Anatomy (the parts and their tokens, such as label, container,
  spinner, hint and error line) is not shown either.
- **Why it matters:** A system that claims AAA should say, per component, what it guarantees and what the consumer
  has to provide. That is the part teams most often get wrong when they copy code.
- **Fix:** Add `a11y: { keyboard: string[]; screenReader: string[]; youMust: string[] }` and
  `anatomy: { part: string; token: string }[]` to `ComponentDoc`. Fill them only from what the five files in `src/ui`
  actually do. Render them as two short sections. Anatomy can be a numbered list beside the static preview from
  finding 4.

### 6. MEDIUM: A loading Button drops keyboard focus to the page

- **Where:** `src/ui/button.tsx:41` (`disabled={disabled || loading}`) and the prop description at
  `src/lib/component-docs.ts:74`.
- **Gap:** On /components/button I focused "Save changes" and pressed Enter. `document.activeElement` became `BODY`
  while it was loading and stayed `BODY` after it finished. A keyboard or screen reader user loses their place on every
  save. `aria-busy` on a button that has become disabled is not announced in any useful way.
- **Why it matters:** "Show a loading state for actions that take time" is a Do (`components-data.ts:42`), so every
  team will use this path.
- **Fix:** While `loading`, keep the button enabled. Set `aria-disabled="true"` and ignore clicks in the handler
  (`onClick={loading ? undefined : onClick}`, plus `onKeyDown` guard if needed). Add a visually hidden live region,
  or put the text "Saving" in the accessible name. Document it in the props table, and add an e2e assertion that
  focus stays on the button.

### 7. MEDIUM: The Avatar guidance describes image features the component does not have

- **Where:** `src/lib/components-data.ts:113-114`, compared with `src/ui/avatar.tsx:23` ("Initials fallback only.
  Photos are not supported yet.") and `src/lib/component-docs.ts:212-215`.
- **Gap:** The live page says "Provide a fallback (initials) when no image is available" and "Stretch or distort the
  image to fit the shape". The component takes no `src`, and it always renders initials on `blue-100`. The props table
  also leaves out `...rest` and `className`, though the component spreads both. Badge documents its `...rest`.
- **Why it matters:** When the guidance describes a different component from the code, teams stop trusting the
  guidance on every page.
- **Fix:** Either rewrite the Do and Don't for an initials-only Avatar ("Pass the full name; initials come from the
  first and last word", "Don't pass initials as the name; the name is the accessible label"), or add an optional
  `src` prop that falls back to initials on error, which the Figma "📷 Show Image" property already expects. Add the
  `...rest` row to the props.

### 8. MEDIUM: There is no Figma-to-code property mapping, and code props break the Naming rules

- **Where:** `src/app/naming/page.tsx:22, 35, 49-52, 83, 110-111` compared with `src/lib/component-docs.ts:72, 172`
  and `src/ui/button.tsx:3`.
- **Gap:** /naming says the shared names let "an engineer … map it to props without guessing", but no page maps
  them, and several do not match:
  - Figma "🩹 Helper Text" is `hint` in code.
  - Naming rule 4 says color is Tone with semantic values, but Button carries "destructive" as a `variant`.
  - Figma has "Show Icon Left/Right" and "Change Icon Left/Right", but Button has no documented icon slot. It does
    lay out icons through `gap-2`, but nothing says so.
  - "🎯 State" has no code counterpart, which is right because state is runtime, but the site doesn't say so.
- **Why it matters:** Handoff is where design systems fail. The Naming page builds the expectation, and the props
  tables don't meet it.
- **Fix:** Add an optional `figma` field to `PropDoc` and a "Figma property" column to the props table, for example
  `variant` maps to 🧰 Type, `tone` to 🎨 Tone, `hint` to 🩹 Helper Text, `label` to 🖍 Label, `size` to 📐 Size. Note
  under the table that State is runtime only. Document icon children for Button with one example (a Phosphor icon at
  16px, `aria-hidden`). Decide whether destructive stays a variant, and record the reason on /naming.

### 9. MEDIUM: Type styles are documented but cannot be used from code

- **Where:** `src/app/foundation/page.tsx:15-58` and `src/app/globals.css:16-172` (no `--text-*` tokens). Also
  `globals.css:17-18, 297-301`.
- **Gap:** Foundation lists Header 1 to Caption 2 with sizes for each device, but no class or token name. The page
  builds them from arbitrary values (`text-[24px] leading-[36px] md:…`). The components use the default Tailwind
  `text-sm` and `text-xs`, which match Body 2 and Caption 1 on mobile only by coincidence. In addition, `.font-mono-code`
  is described as "a monospace face, so characters people copy cannot be misread", but it resolves to Urbanist, and
  so do the code blocks (computed `font-family: Urbanist …`). That was a deliberate owner change (b107df0), but the
  comment and the intent no longer agree.
- **Why it matters:** A team cannot write "Header 2" in code. Each team will invent its own mapping, so type will
  drift across products.
- **Fix:** Add `--text-h1`, `--text-h2`, `--text-subheader`, `--text-body-1`, `--text-body-2`, `--text-caption-1` and
  `--text-caption-2` to `@theme`, each with its `--line-height` pair, using the mobile values. The
  tablet and website steps go in a small `@utility` per style, or are documented as `md:`/`lg:` pairs. Show the class
  name in each Foundation row and use it in `src/ui`. Either restore a monospace stack for `--font-mono`, or change
  the comment at `globals.css:297` so it matches the decision.

### 10. MEDIUM: Foundation lists values but not how to use them: elevation, spacing, motion, iconography, grid

- **Where:** `src/app/foundation/page.tsx:96-122, 271-333, 396-400`. The motion values are in `src/ui/button.tsx:7`
  and `src/app/globals.css:403-482`, and the icon sizes are spread across `src/`.
- **Gap:**
  - **Elevation:** four shadows, but none mapped to components. The page says "In dark mode, elevation comes from a
    lighter surface", but only one raised step (`surface`) exists.
  - **Spacing:** 46 values and three variable sets, but no rule for when to use which (for example, component padding
    and stack gaps).
  - **Motion:** used in code (button 100ms ease-out, `screen-in` 320ms, `pop` 420ms, `rise` 700ms, with three
    different cubic-beziers), but not named as tokens and not on Foundation.
  - **Iconography:** Phosphor is used everywhere at nine different sizes (12, 14, 16, 18, 20, 24, 28, 32, 96). There
    is no icon page, size scale, or rule for `aria-hidden` versus labelled icons.
  - **Layout grid:** "Padding and layout are set per device" (`:361`), but no columns, gutters or margins are given.
- **Why it matters:** These are the questions teams ask in their first week. Without answers, each team decides
  locally.
- **Fix:** Use only what exists:
  1. Add a "Use" column to shadows that maps them to the components the site already draws (Card, Dropdown Menu,
     Modal, Drawer in `ComponentPreview.tsx`). Say plainly that dark-mode elevation is a single `surface` step for now.
  2. Name the four motion values that exist (`--duration-fast: 100ms`, `--duration-screen: 320ms`, and so on) with
     their easings in `@theme`, and show them in an Effect > Motion block alongside the reduced-motion rule that is
     already in `globals.css:329-336`.
  3. Pick three icon sizes from those in use (16, 20, 24) and document Phosphor, its weight, and the `aria-hidden`
     rule.
  4. Leave the grid out until its column and gutter values come from the Figma Device page. Do not invent them.

### 11. LOW: Input loses the hint on error, has no required pattern, and puts `className` on the inner field

- **Where:** `src/ui/input.tsx:17, 25-27, 30-32` and `src/lib/component-docs.ts:170-175`.
- **Gap:**
  - `error ?? hint` hides the hint as soon as there is an error. In the demo, "We send the receipt here." disappears
    exactly when the person needs context.
  - There is no `required` guidance or indicator. The native `required` passes through, but nothing marks the label.
  - `className` lands on the `<input>`, not the wrapper, so a team cannot set width or margin on the whole field. The
    props table doesn't say which element gets it.
- **Why it matters:** Input is the most-used form part, and these three issues come up in the first form a team
  builds.
- **Fix:** Render the hint and the error as two lines, both in `aria-describedby`. If `required` is set, add
  "(required)" or "Optional" to the label, following whichever convention the Figma file uses. Add `fieldClassName`,
  or move `className` to the wrapper, and document it.

### 12. LOW: Accordion headers are not headings, and items are keyed by title

- **Where:** `src/ui/accordion.tsx:15-17`.
- **Gap:** `summary` holds plain text. On /components/accordion, neither summary is inside or contains a heading, so
  screen reader users cannot jump between sections with the heading list. The usage text recommends the component for
  exactly that kind of content: "long reference content where people look for one section at a time"
  (`components-data.ts:379`). Items use `key={item.title}`, so two items with the same title collide. There is no
  option for one-open-at-a-time, although native `details` supports `name`.
- **Why it matters:** The usage guidance and the semantics disagree. The fixes are a few lines.
- **Fix:** Add `headingLevel?: 2 | 3 | 4` (default 3) and wrap the title in that heading inside `summary`. Key by
  index or by an optional `id`. Add an `exclusive?: boolean` prop that sets a shared `name` built with `useId()`.
  Document all three in the props table.

## What would most raise trust and adoption (value against effort)

| Rank | Change | Value | Effort |
|---|---|---|---|
| 1 | Make the primitives match Figma again and meet AAA through roles (1), with a drift test | Very high | Small |
| 2 | Dark-mode focus ring fix (3) | High | Very small |
| 3 | Show variants and states on the coded pages by reusing `ComponentPreview` (4) | High | Small |
| 4 | Semantic role tokens and a generated /themes table (2) | Very high | Medium |
| 5 | Loading Button keeps focus (6), Avatar guidance matches code (7) | Medium | Very small |
| 6 | Figma-property column in props (8) | Medium | Small |
| 7 | Accessibility and Anatomy sections for the five components (5) | High | Medium |
| 8 | Type tokens in code (9) | Medium | Small |
| 9 | Foundation usage: shadows mapped, motion tokens, icon sizes (10) | Medium | Medium |
| 10 | Input and Accordion API polish (11, 12) | Low to medium | Small |

Items 1 to 3 together take less than a day. They remove the two places where the site currently contradicts
itself (hex values and the AAA claim) and make the coded pages the most complete pages on the site. Do them before
adding any new component.
