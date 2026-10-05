# Review 008: design-system rigor, 2026-10-05

Reviewer: design-systems lead. Scope: single source of truth for tokens, the semantic layer, type, radius, effect
and motion tokens, the five coded components against their docs, status vocabulary, and whether design-only pages
promise anything untrue.

Method: I read `src/app/globals.css`, `src/lib/*.ts`, `src/ui/*`, `src/components/demos.tsx`, the home, docs,
foundation, themes, naming and component pages. A Node script parsed the `@theme`, `.dark` and `.theme-light`
blocks and compared them with `natuna-palette.ts`, the /themes role table, the hex values named on /foundation and
the Ctrl K index, then computed WCAG contrast for every state pair the five components use. A second script listed
spacing classes that fall off the Number scale. Playwright (Edge, 1280px) checked the live breadcrumb, the dark
hover and focus colors, and computed type sizes. No source files were changed.

Note: HEAD moved from edd4e67 to 2d0f849 during this review. That commit already gives documentation frames their
own group, so the breadcrumb change asked for in the brief is in (details under "Breadcrumb" below). While I was
writing, someone else left uncommitted edits in 8 files. Two of them touch these findings. `components-data.ts` adds
`productTracker`, which leaves frames out of the counts and starts on finding 2. `button.tsx` gives Secondary a
`border-gray-300`, which is also 1.48:1 and widens finding 4. All line numbers below refer to 2d0f849.

## Review 006 status

### review-006-system.md

| # | Finding | Status | Evidence now |
|---|---|---|---|
| 1 | Foundation and Ctrl K hex differ from classes | Resolved | Script: 0 of 88 steps differ between `natuna-palette.ts` and `@theme`. The /foundation AAA table names blue-800 #015099 and red-800 #8c2b2c, both correct. No test stops a regression (see finding 10). |
| 2 | No semantic token layer | Open | Still nine role tokens. Primitives are reassigned in `.dark` (`globals.css:190-231`). See finding 1. |
| 3 | Dark focus ring under 3:1 | Resolved | `--color-blue-600: #359dff` in dark (`globals.css:207`): 4.69:1 on surface, 5.71:1 on canvas. Measured `rgb(53, 157, 255)`. Done by changing a primitive, see finding 1. |
| 4 | No variants and states on coded pages | Resolved | `StatesMatrix` in `demos.tsx`, rendered at `[slug]/page.tsx:149-157`. |
| 5 | No Anatomy or Accessibility section | Partly | Accessibility is in (`component-docs.ts:20-25`, rendered at `[slug]/page.tsx:259-283`). Anatomy is not. |
| 6 | Loading Button drops focus | Resolved | `button.tsx:41-46` uses `aria-disabled`, not `disabled`. |
| 7 | Avatar guidance describes photos | Resolved | `component-docs.ts:338-345` overrides Do and Don't. |
| 8 | No Figma-to-code mapping | Resolved | `figma` field and table (`component-docs.ts:107-114`, page `:214-257`). The destructive-as-variant decision is noted there but still not on /naming (finding 12). |
| 9 | Type styles cannot be used from code | Open | No `--text-*` Natuna tokens. See finding 5. The mono comment now matches the decision (`globals.css:306`). |
| 10 | Foundation lacks usage for elevation, motion, icons | Open | No shadow-to-component map, no motion tokens, no icon page. See finding 6. |
| 11 | Input hint, required, className | Partly | Documented in props and a11y (`component-docs.ts:247-248, 275`); behavior unchanged. |
| 12 | Accordion headings and keys | Partly | Documented (`component-docs.ts:372, 393, 397`); behavior unchanged. |

### review-006-visual.md

| # | Finding | Status | Evidence now |
|---|---|---|---|
| 1 | Two container widths | Resolved | Every page, Header and Footer use `max-w-7xl`. |
| 2 | Hero card white in dark | Resolved | `HeroBento.tsx:70` applies a theme class only after a toggle. |
| 3 | Eyebrow pill wraps | Resolved | Plain sentence at `page.tsx:65`. |
| 4 | Lime overused | Resolved | Six lime classes left (3 in `page.tsx`, 3 in `FigmaPanel.tsx`). |
| 5 | Home off the radius scale | Resolved | No arbitrary `rounded-[…]`, `shadow-[…]` or `outline-[…]` left in `src`. |
| 6 | Primitives card on step 700 | Resolved | `page.tsx:136-145` outlines 800, labels #015099. |
| 7 | Home type off the scale | Partly | `FigmaPanel.tsx:46, 52, 55` still use 13px and 26px; `HeroBento.tsx` uses 14, 18, 32px as arbitrary values. |
| 8 | Section headings change size | Resolved | `FigmaPanel.tsx:21` uses the same clamp as `page.tsx:35`. |
| 9 | Two status and filter languages | Partly | Badge colors now shared. Filters still differ: home inverse fill (`StatusBoard.tsx:68-69`), /components brand fill (`ComponentOverviewFilter.tsx:61-62`). See finding 9. |
| 10 | Docs rail moves | Resolved | `docs/page.tsx` caps the inner div, not `main`. |
| 11 | Copy to Figma card wraps at 390 | Resolved in code | `whitespace-nowrap` at `FigmaPanel.tsx:45-46`. Not re-measured at 390. |
| 12 | Two code-block styles | Open | `CodeBlock.tsx:107, 167` still `bg-[#141b26]`; home uses `bg-inverse-raised`. See finding 11. |

### Breadcrumb for documentation frames

Already landed in 2d0f849. Live check: /components/artboard reads "Components / Documentation", Role "Documentation".
The change in `src/lib/components-data.ts` is exactly what I would propose:

```ts
export const componentGroups = ["Atoms", "Molecules", "Documentation", "Not tracked"] as const;

export function componentGroup(slug: string): ComponentGroup {
  if (components.find((c) => c.slug === slug)?.category === "Documentation") return "Documentation";
  return trackerRow(slug)?.group ?? "Not tracked";
}
```

What is left: the comment at `src/app/components/[slug]/page.tsx:42` still says "(Atoms, Molecules)", and the home
counts still treat frames as components (finding 2).

## Findings

### 1. HIGH: The role layer that home and /themes describe does not exist in code; dark mode works by rewriting primitives

- **Where:** `src/app/globals.css:179-232` (`.dark` reassigns 8 blue, 11 gray, 5 emerald, 4 amber, 6 red steps);
  `src/app/page.tsx:37-43` (the "semantic alias" card); `src/app/themes/page.tsx:15-24, 62-63`;
  `src/lib/component-docs.ts:40-41` (`FOCUS_RULE`); `src/app/foundation/page.tsx:140, 142`.
- **Evidence:**
  - Home says "semantic colors that flip between light and dark" and lists `bg/brand`, `text/on-brand`, `text/danger`
    and `border/focus` as "the names they carry in Figma". None of those names exists in CSS. The card draws them with
    hardcoded hex (`bg-[#015099]`, `bg-[#8c2b2c]`, `border-[#0276e3]`), not with tokens.
  - /themes says "Components ask for a role", but its table lists `gray-200`, `gray-900`, `gray-700` and `blue-800`
    as the tokens. Those are primitives.
  - Foundation says the focus ring is "blue-600 in light, blue-400 in dark". In code there is no blue-400 reference:
    `--color-blue-600` itself is set to `#359dff` in dark (`globals.css:207`). `FOCUS_RULE` tells teams to copy "a
    2px blue-600 outline". A team that copies that rule without the `.dark` block gets `#0276e3` on `#27303f`, 2.98:1,
    which fails 2.4.13.
  - The dark ramp is no longer a ramp: gray-300 and gray-400 are both `#697586`, gray-500 and gray-600 are both
    `#cdd5df`. Secondary text (gray-700, `#d0d5dd`) and the input border (gray-500, `#cdd5df`) are almost the same
    color.
  - Ctrl K lists `blue-800` as `#015099` (`search-index.ts:33-41`); in dark `text-blue-800` renders `#9aceff`.
- **Why it matters:** A class name does not tell a team what it gets in dark mode, and a Figma role name has no code
  equivalent to search for. This is the gap between "tokens" and "a token system".
- **Fix:**
  1. Keep primitives fixed in both modes. Add role tokens that point to them, and redefine only the roles in `.dark`
     and `.theme-light`.
  2. Use the Figma role paths as names under the color namespace: `--color-text-danger`, `--color-text-secondary`,
     `--color-text-link`, `--color-text-on-brand`, `--color-border-default`, `--color-border-input`,
     `--color-border-focus`, `--color-bg-brand` (alias of today's `brand`), plus `--color-bg-{tone}` and
     `--color-text-{tone}` for the five Badge tones. Do not use `--text-danger`: `--text-*` is Tailwind's font-size
     namespace.
  3. Move `src/ui` onto the roles first (about 25 class strings), then the global `:focus-visible` rule
     (`outline-color: var(--color-border-focus)`).
  4. Export the role list from one module and render both the home card and the /themes table from it.

### 2. HIGH: Status says one thing and the page does another; counts include Figma frames

- **Where:** `src/lib/natuna-tracker.ts:31, 58` (Badge is `OnProgress`); `src/app/components/[slug]/page.tsx:109-127,
  129-147`; `src/app/page.tsx:20, 26-28, 65, 97, 221`; `src/components/home/StatusBoard.tsx:7, 11`;
  `src/lib/natuna-tracker.ts:54, 62, 80, 83` (Guideline, Artboard, Document, Changelog rows).
- **Evidence:**
  - /components/badge (live): "Status In progress, Build day 2 of 21". `statusMeaning.OnProgress` says "Being designed
    now. Do not depend on its details yet." The same page then ships copyable `src/ui` code, a props table and an
    accessibility contract. Nothing on the site separates design status from code status: the only signal is
    `statusMeaning.Selesai` telling people to "Check the component page", and no list (home board, /components,
    sidebar) marks which five have code.
  - Home says "9 of 51 components ready" and "51 components tracked". Three of the nine (Artboard, Guideline,
    Document) are Figma documentation frames, and the 51 also include Changelog and Cover, frames too. Since 2d0f849
    the site itself files them under "Documentation", not components.
  - Home has three groups. `groupOf` folds "On Review" into "progress", so an item in review shows as "In progress"
    on home and "In review" on /components and /docs. No row is in review today, so this is latent, but it is a
    second vocabulary.
- **Why it matters:** Status is the one field a team checks before building on something. Polaris and Carbon keep
  design and code status as separate columns for exactly this case.
- **Fix:**
  1. Add a derived `code: boolean` (`slug in componentDocs`) and show "In code" next to the status on the component
     header, the /components card, the sidebar row and the home board.
  2. For a component with code but a non-Ready design status, add one line under the status: "Code exists in src/ui;
     the Figma design is still changing."
  3. Compute home counts over `components.filter(c => c.category !== "Documentation")` and say "components", or keep
     the tracker total and say "tracker items".
  4. Give home the fourth group (`review`) so it uses `statusOrder` like /docs.

### 3. MEDIUM: Secondary Button hover text is 6.57:1 in dark mode, under the 7:1 the site commits to

- **Where:** `src/ui/button.tsx:14` (`bg-gray-100 text-gray-800 hover:bg-gray-200`), `globals.css:192, 198`, the
  claim at `src/app/foundation/page.tsx:137` and the hover note at `src/components/demos.tsx:180-182`.
- **Evidence:** In dark, live on /components/button, the hovered Secondary button computes to text
  `rgb(235, 240, 244)` on `rgb(75, 85, 101)` at 14px weight 500: 6.57:1. Light hover is 9.01:1. Every other Button
  state I computed clears 7:1 (ghost hover 11.58 dark, primary hover 12.34).
- **Why it matters:** 1.4.6 applies to text in every state, and this is the system's own Button, not a page detail.
- **Fix:** Add `hover:text-gray-950` to the secondary variant. gray-950 is `#0d121c` in light (12.71:1 on gray-200)
  and `#ffffff` in dark (7.54:1 on `#4b5565`). Better, once finding 1 lands: a `text-on-secondary-hover` role. Add
  the hover pair to the e2e contrast checks, since axe does not hover.

### 4. MEDIUM: The 3:1 boundary rule is applied to inputs but not to the Ghost button or the /themes specimen

- **Where:** `src/ui/button.tsx:15` (`border-gray-300`), `src/app/themes/page.tsx:41, 45`,
  `src/app/foundation/page.tsx:140`, `src/ui/input.tsx:24`.
- **Evidence:** Ghost button border gray-300 on surface: 1.48:1 in light, 2.84:1 in dark (live: `rgb(105, 117, 134)`
  on `#27303f`). The /themes card draws its "Add a note" field with `border-gray-300` (1.48:1), while the AAA table
  says "Input borders use gray-500". A ghost button has no fill, so the border is the only thing that marks it as a
  control besides its text.
- **Fix:** Ghost uses `border-gray-500` (4.68:1 light, 8.97:1 dark), the same as Input. Change the /themes specimen
  field and "Later" button to `border-gray-500`. If the team decides the ghost border is decorative, write that
  decision into the Button props description instead.

### 5. MEDIUM: There is still no type scale in code, and the docs pages use sizes the scale does not have

- **Where:** `src/app/globals.css:16-172` (no `--text-*`), `src/app/foundation/page.tsx:17-60`; every docs H1 and H2,
  for example `foundation/page.tsx:164, 178`; `src/ui/input.tsx:17, 31`; `src/ui/badge.tsx:19`.
- **Evidence:**
  - Tailwind's default `--text-xs` to `--text-9xl` are all still active, because only `--color-*` is reset.
  - Live on /foundation: H1 computes to 48px (`text-5xl`) and H2 to 30px (`text-3xl`). Foundation's own table says
    Header 1 tops out at 32px and Header 2 at 28px.
  - Input labels and hints are `text-xs`, 12px at every width. Foundation's Caption 1 is 14/20 on website.
  - The search index lists seven text styles (`search-index.ts:56-61`) that no class implements.
- **Fix:** In `@theme`, add `--text-*: initial;` and then `--text-h1`, `--text-h2`, `--text-subheader`, `--text-body-1`,
  `--text-body-2`, `--text-caption-1` and `--text-caption-2`, each with its `--line-height` pair at mobile values. Add
  one `@utility` per style for the `md:` and `lg:` steps from the Foundation table. Show the class name in each
  Foundation row, use it in `src/ui`, and either move the docs H1 and H2 onto Header 1 and Header 2 or record on
  /foundation that the docs chrome uses a separate display size.

### 6. MEDIUM: Blur, radius, shadow and motion: Foundation names do not match the classes, and Tailwind defaults leak

- **Where:** `src/app/foundation/page.tsx:118-124, 126-133, 84-88`; `src/app/globals.css:158-171`;
  `node_modules/tailwindcss/theme.css:397-482`; `src/ui/button.tsx:7`; `globals.css:449-500`.
- **Evidence:**
  - Blur: Foundation lists `blur-md` 16px and `blur-xl` 40px. `@theme` defines no blur, so Tailwind's defaults
    apply: `backdrop-blur-md` is 12px and `backdrop-blur-xl` is 24px. The comment at `:118` says Figma states only 8
    and 40, so the 16 and 24 rows are numbers the site invented.
  - Radius: `--radius-xs` equals `--radius-sm` (4px) and `--radius-lg` equals `--radius-md` (8px), so `rounded-lg`
    (5 uses) is an undocumented alias. Tailwind's `--radius-4xl` still exists. Figma's Rounded set has 20, 40 and 48
    (`:87`) with no class. Badge uses bare `rounded` while Foundation says badges use `rounded-sm` (`:127`); both are
    4px today.
  - Shadow: Natuna defines sm to xl, but Tailwind's `shadow-2xs`, `shadow-xs`, `shadow-2xl`, `inset-shadow-*` and
    `drop-shadow-*` (pure black) are still available. None is used yet.
  - Motion: four easings in use (Tailwind `ease-out` in Button, and cubic-beziers `0.22,1,0.36,1`, `0.34,1.45,0.64,1`,
    `0.16,1,0.3,1`) and durations 100, 320, 420, 700, 900 and 1100ms. None is a token and Foundation has no motion
    section.
- **Fix:** In `@theme`, reset each namespace the way color already is: `--blur-*: initial; --radius-*: initial;
  --shadow-*: initial; --inset-shadow-*: initial; --drop-shadow-*: initial; --ease-*: initial;`. Then define only the
  Figma values: blur 8 and 40 (drop the two invented rows until Figma gives them), radius 4, 8, 16, 20, 24, 32, 40,
  48 and full, and the four shadows. Name the motion that exists (`--ease-standard`, `--ease-emphasis`,
  `--duration-fast: 100ms`, `--duration-screen: 320ms`) and show them on Foundation next to the reduced-motion rule.

### 7. MEDIUM: Design-only pages promise things that are untrue or that break the AAA commitment

- **Where:** `src/lib/components-data.ts:277, 279` (Toast), `:644` (Changelog); `src/app/foundation/page.tsx:135-145,
  180-182`.
- **Evidence:**
  - Toast: "appears and disappears automatically" and Do "Auto-dismiss after a few seconds." The site commits to
    WCAG 2.2 AAA "wherever it is a property of the design". 2.2.3 No Timing (AAA) does not allow a message to vanish
    on a timer, and the AAA table has no timing row.
  - Changelog: "Use in the Figma file and on this site so teams know what changed". `src/app` has no changelog route,
    and nothing on the site lists releases.
- **Fix:** Toast summary: "A brief notification that confirms an action. It stays until the person dismisses it or
  moves on." Do: "Keep it on screen until dismissed, and send the same text to a polite live region." Add a 2.2.3 row
  to the AAA table. Changelog usage: "Use in the Figma file so teams know what changed before they update." Add "and
  on this site" back only when a page exists.

### 8. MEDIUM: The site does not use its own Badge; tone classes are copied into five places

- **Where:** `src/ui/badge.tsx:5-11`; copies at `src/lib/natuna-tracker.ts:36-41`, `src/lib/components-data.ts:672-679`,
  `src/app/naming/page.tsx:97-101`, `src/app/themes/page.tsx:36`, and the hand-written labels at
  `src/components/demos.tsx:195-201`; `StatusBadge.tsx:3-9` and `StatusBoard.tsx:89` render their own spans.
- **Evidence:** Each copy repeats `bg-emerald-100 text-emerald-900` and its siblings, plus `rounded px-2 py-0.5
  text-xs font-medium`. Changing a tone in `badge.tsx` changes the Badge page and nothing else, which contradicts
  "Change a token and every component that uses it follows" (`foundation/page.tsx:166-167`). The StatesMatrix caption
  "gray-100 / gray-700" is a string that can drift from the code it describes.
- **Fix:** Export `badgeTones` from `badge.tsx`. Make `StatusBadge`, the StatusBoard chip, the /docs status list and
  the Naming kind chips render `<Badge tone={…}>` through a `status → tone` map (`stable → success`,
  `review → info`, `beta → warning`, `planned → neutral`). Build the StatesMatrix captions from `badgeTones`.

### 9. LOW: Status is still encoded four ways, against the site's own Status guidance

- **Where:** `src/components/home/StatusBoard.tsx:68-69`; `src/components/ComponentOverviewFilter.tsx:61-62`;
  `src/components/ComponentSidebarNav.tsx:107-109`; `src/components/home/FigmaPanel.tsx:48`;
  `src/lib/components-data.ts:348-349, 650-662`.
- **Evidence:** The home filter fills navy when active and /components fills brand blue with `text-xs`. The sidebar
  shows a plain-text status for everything except Ready, so Ready is the absence of a label. The home demo shows
  "Success" in lime while Badge success is emerald. The Status component's guidance on this same site says "Map each
  state to one color" and "Don't invent a new color for a state that already has one". Every hand-typed `status:` in
  `components-data.ts` is overwritten from the tracker at `:660-662` (Spinner says "stable", the tracker says
  Belum), and the comment at `:294-295` lists three of the four mappings.
- **Fix:** One filter style: the home one (inverse active), which keeps brand blue for the primary action. In the
  sidebar, show "Ready" too, or a small dot for every status. Use `<Badge tone="success">` in the FigmaPanel demo.
  Delete the `status` field from `ComponentMeta` literals and derive it, so no one edits a value that is thrown away.

### 10. LOW: Stale contrast and anchor comments, and no test that keeps the palette in step

- **Where:** `src/app/globals.css:12-13, 28`; `src/lib/natuna-palette.ts:2`; `e2e/` (2 specs, neither reads
  `globals.css` or the palette).
- **Evidence:** `globals.css:12-13` says text and white-on-color fills use step 700; they use 800. `globals.css:28`
  says danger is 8.9:1; white on `#8c2b2c` computes to 8.41:1, and /foundation and /themes both show 8.4. The palette
  and `@theme` agree today, but only by hand.
- **Fix:** Correct the two comments ("Brand fills and link text use 800", "danger 8.4:1"). Add a unit or e2e check
  that parses the `@theme` block and asserts it equals `palettes`, and that the /themes rows equal the light and dark
  blocks. The script used for this review is about 40 lines.

### 11. LOW: Off-token hex values remain in the system's showcase surfaces

- **Where:** `src/app/page.tsx:39, 41, 42, 288-298`; `src/components/CodeBlock.tsx:107, 122, 130, 139, 167`;
  `src/components/home/HeroBento.tsx:10-13`.
- **Evidence:** The "semantic alias" card draws its swatches with `bg-[#015099]`, `bg-[#8c2b2c]` and
  `border-[#0276e3]` instead of `bg-brand`, `bg-danger` and `border-blue-600`. In dark the real focus ring is
  `#359dff`, so the card shows a value the site does not use. CodeBlock still uses `#141b26`, which matches neither
  `inverse` nor `inverse-raised`, and `#cdd5df` and `#015099` by hex. The bill tints `#9bc6f5`, `#ffd089` and
  `#e1e5eb` are not in any Natuna ramp.
- **Fix:** Use the tokens (`bg-brand`, `bg-danger`, `border-blue-600`, or the role tokens from finding 1).
  `CodeBlock`: `bg-inverse` and `from-inverse`, `text-inverse-muted`, `bg-brand`. Bill tints: `bg-blue-200`,
  `bg-amber-200`, `bg-gray-200`, with `bg-emerald-300` for the first one, which is already `#aad98c`.

### 12. LOW: Known component API debts are documented but not scheduled, and the Naming conflict is not recorded

- **Where:** `src/ui/input.tsx:7, 30-32`; `src/ui/accordion.tsx:15-17`; `src/ui/button.tsx:3`;
  `src/app/naming/page.tsx:87`; `src/lib/component-docs.ts:108, 114`.
- **Evidence:** The docs now say honestly that the error replaces the hint, that Accordion headers are not headings,
  and that titles are keys. They tell teams to work around these issues instead of fixing them. Naming rule 4 ("Use
  Tone for color … never raw color names") still conflicts with `variant="destructive"`, and only the Button
  Figma-to-code note mentions it.
- **Fix:** Render hint and error as two lines, both in `aria-describedby`. Add `headingLevel` and key by index or `id`
  on Accordion. Then remove the matching "you must" lines. For destructive: either add `tone` to Button
  (`tone="danger"`, keeping `variant` for weight) or add one line under Naming rule 4: "Button keeps destructive as a
  variant because it changes weight and color together".

## Order of work

1. Findings 3 and 4: a few class changes, and they close the two AAA gaps.
2. Finding 2: the code flag and honest counts, small and visible.
3. Finding 1 with finding 8: role tokens, then Badge reuse. This is the largest change, and it unblocks finding 11.
4. Findings 5 and 6: reset the Tailwind namespaces and define the Figma values.
5. Findings 7, 9, 10 and 12: copy and cleanup.
