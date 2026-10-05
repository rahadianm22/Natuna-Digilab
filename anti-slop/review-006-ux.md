# Review 006: information architecture, user flows and copy

Scope: /, /docs, /foundation, /components, /components/[slug], /themes, /naming, /privacy, Ctrl K search. Read from source and clicked through in Edge with Playwright against http://localhost:3000 on 2026-10-05. Every finding below was checked in both places.

Audience: designers and engineers who are deciding whether to adopt Natuna and what to do first.

## Summary

A newcomer can tell that Natuna is a design system with a Figma file and some React code. What they cannot tell is what they can use today. The main reason is that "Ready" is the only status, and it measures Figma sign-off, while the hero and the Introduction both read as if Ready means usable in product code. Token names on three pages disagree about what `blue-700` is. Naming has three different homes. Foundation, Themes and Naming have no links out of their content.

| # | Severity | Finding |
|---|---|---|
| 1 | HIGH | "Ready" means Figma sign-off, but the copy says "safe to use in product work" |
| 2 | HIGH | The hero overstates React coverage and hides the real first step at the bottom of the page |
| 3 | HIGH | `blue-700` and `red-700` name different colors on Home, Foundation, Themes and search |
| 4 | MEDIUM | /docs and /naming define the same four statuses differently |
| 5 | MEDIUM | Naming has three homes and loses the components shell when you open it |
| 6 | MEDIUM | Naming promises a Figma-to-props mapping that the page does not give |
| 7 | MEDIUM | Foundation, Themes and Naming are dead ends |
| 8 | MEDIUM | Each component page uses two taxonomies at once |
| 9 | MEDIUM | Ctrl K finds nothing for "dark", "accessibility", "contrast", "install" or "npm" |
| 10 | LOW | Foundation: Accessibility is missing from "On this page", and the Color intro sets a lower bar |
| 11 | LOW | Three different descriptions of who Natuna is for |
| 12 | LOW | Two version numbers with no explanation |

---

## 1. HIGH: "Ready" means Figma sign-off, but the copy says "safe to use in product work"

**Where:** /docs `src/app/docs/page.tsx:17`; home pill `src/app/page.tsx:57-62`; component status row `src/app/components/[slug]/page.tsx:88-106`; catalog cards `src/components/ComponentOverview.tsx:144-161`.

**Problem:** /docs defines Ready as "Designed, documented, and signed off. Safe to use in product work." The tracker data has 9 Ready rows. Only 4 of them (Button, Avatar, Input, Accordion) have React code in `src/ui`. Dropdown Menu and Headline are Ready, but their pages say "The React component is not built yet." Artboard, Guideline and Document are Ready, but they are Figma documentation frames that say "This is a Figma documentation frame, so it has no code component." Badge goes the other way: it has live code and a props table, but its status is "In progress". The home pill, "9 / 51 components ready", counts the three documentation frames as components.

**Why it matters:** For an engineer, "Ready" answers one question: can I ship this? On Dropdown Menu the answer is no, and they only find out after they open the page. A count that includes Figma documentation frames inflates progress, and that makes the site less trustworthy than it actually is.

**Fix:** Show two facts, not one.
- On every component page and catalog card, add a second badge next to the status: "In React" (when `componentDocs[slug]` exists) or "Figma only".
- Change the /docs definition to: "Ready: Designed, documented, and signed off in Figma. Check the In React badge before you use it in code."
- Leave the Documentation category out of the hero count, and change the pill to: "{n} of {m} components signed off in Figma, {inCode} in React".

## 2. HIGH: The hero overstates React coverage and hides the real first step at the bottom of the page

**Where:** / `src/app/page.tsx:63-86` (H1 and CTAs), `src/app/page.tsx:242-294` ("04 · Get started").

**Problem:** The H1 reads "One system. Figma and React, kept in sync." Five of 56 component pages have React code, and the npm package does not exist yet. The primary CTA, "Browse components", leads to a catalog where 42 of 56 entries are Planned, In progress, or Not tracked. The two real starting points ("Duplicate the Foundation Design System from Figma Community" and "Copy them into your project while the package is on its way") are in section 04, the last section before the footer.

**Why it matters:** The first question a newcomer has is "what do I do first?". The page answers it last. The headline also makes a claim the rest of the site walks back ("npm package not released yet", "The React component is not built yet").

**Fix:**
- H1: "One design system for Figma and React." Subhead: "Tokens and components are signed off in Figma first, then built in React. {inCode} components are in React today."
- Replace the two hero CTAs with the two real paths: primary "Duplicate the Figma file" (links to `FIGMA_COMMUNITY_URL`) and secondary "Use the React components" (links to `/docs#use`). Keep "Browse components" as a text link under them.
- Section 04 can stay as a recap. It should no longer be the only place where these paths appear.

## 3. HIGH: `blue-700` and `red-700` name different colors on Home, Foundation, Themes and search

**Where:**
- Home Foundation teaser `src/app/page.tsx:35-37` and `:140`: "bg/brand to blue/700", swatch `#026acc`; "text/danger to red/700", `#bb3a3b`.
- Foundation accessibility table `src/app/foundation/page.tsx:137`: "Brand fill is blue-800 #015099 ... danger is red-800 #8c2b2c".
- Themes `src/app/themes/page.tsx:19-20`: "Brand fill, brand, #015099" and "Link, blue-700, #015099".
- Ctrl K, `src/components/CommandSearch.tsx:27`: the comment says tokens are searchable by "the Tailwind class". Typing `blue-700` returns "Azure Blue 700 #026acc".

**Problem:** The palette (`natuna-palette.ts`) has blue 700 = `#026acc` and blue 800 = `#015099`. The site CSS (`globals.css:62`) remaps the class `blue-700` to `#015099`. As a result, one hex has three names (blue/700 on Home, blue-800 on Foundation, blue-700 on Themes), and the brand color on Home is a different hex from the one Foundation and Themes say is the brand. Red has the same split.

**Why it matters:** Tokens are the contract between designers and engineers. If an engineer copies `text-blue-700` from Themes and a designer picks Azure Blue 700 from Foundation, they get two different colors. Both of them followed the docs.

**Fix:** Pick one name per hex and use it everywhere. Since the AAA work moved the brand to `#015099`:
- Home teaser: "bg/brand to blue/800", swatch `#015099`; "text/danger to red/800", `#8c2b2c`. Highlight step 800 in the ramp at `page.tsx:134`.
- Themes table: token column "blue-800" for Link and Brand fill.
- If the site's remapped utility classes have to stay, add one sentence under Themes "Color roles": "On this site the utility class blue-700 renders palette step 800 so that text passes 7:1. In Figma, use blue/800."

## 4. MEDIUM: /docs and /naming define the same four statuses differently

**Where:** /docs `src/app/docs/page.tsx:16-21`; /naming `src/app/naming/page.tsx:70-77`.

**Problem:** /docs says Planned is "Scheduled on a build day but not started." /naming maps the Figma page "Under Construction, 0%, the component is under development" to Planned. /docs says In review is "Built and waiting for review." /naming maps "Documentation, 60%, crafted and needs documentation" to In review. One page says Planned work has not started, and the other says it is under development.

**Why it matters:** Status is the most-read signal on the site, and these are its only two definitions. A reader who checks both pages cannot tell whether a Planned component has a design in progress.

**Fix:** Keep one source of truth. Move the stage-to-status table into /docs#status, and have /naming link to it ("Figma page names map to statuses; see Component status"). Rewrite the meanings so they agree:
- Planned / Under Construction: "Scheduled, not designed yet."
- In progress / Concepting: "Being designed now."
- In review / Documentation: "Designed, documentation being written."
- Ready / Finish Component: "Signed off in Figma."

## 5. MEDIUM: Naming has three homes and loses the components shell when you open it

**Where:** sidebar `src/components/ComponentSidebar.tsx:37`; components index card `src/app/components/page.tsx:30-39`; footer "Docs" column `src/components/Footer.tsx:5-11`; /docs "What is in it" `src/app/docs/page.tsx:54`; /naming `src/app/naming/page.tsx:105`.

**Problem:** The sidebar and the /components index place Naming under Components. The footer and /docs list it as a peer of Foundation and Components. The header nav does not list it. When you click "Naming" in the component sidebar, the header still highlights Components, but the sidebar and breadcrumb disappear (verified: 0 sidebar navs and 0 breadcrumbs on /naming, compared with 1 sidebar on /components/button). The only way back is the header.

**Why it matters:** A page that changes layout when you click a sidebar item feels like you left the section. Three different parents for one page make it hard to remember where it lives.

**Fix:** Commit to "Naming lives in Components", as commit e96a975 intended. Render /naming with `ComponentSidebar` and `ComponentMobileNav`, add the breadcrumb "Components / Naming", and in the footer, list it indented under Components or drop it. In /docs "What is in it", fold it into the Components row: "51 components on the build plan, 9 of them ready. Naming explains how their properties are named."

## 6. MEDIUM: Naming promises a Figma-to-props mapping that the page does not give

**Where:** /naming intro `src/app/naming/page.tsx:109-113`; properties table `:34-35`; React props `src/lib/component-docs.ts:72, 117, 171-173`.

**Problem:** The intro says "an engineer can map it to props without guessing". The table has a Figma name column but no code column, and the existing components do not follow the names on this page. Figma "Helper Text" is `hint` on Input. The Button's visual weight is `variant`, while Naming says Tone replaces color and Type is the structural kind. Badge uses `tone`, which matches. Size and State have no stated mapping.

**Why it matters:** Engineers are half the audience, and this page tells them the mapping is obvious. It is not, so they will guess.

**Fix:** Add a "React prop" column. Fill it for the 5 components in `src/ui` (for example, "Helper Text: `hint` (Input)", "Tone: `tone` (Badge)", "Type: `variant` (Button)"), and write "Not in code yet" everywhere else. Until the column exists, change the intro to: "Every component in the Figma file uses the same property names. React prop names are listed on each component page."

## 7. MEDIUM: Foundation, Themes and Naming are dead ends

**Where:** `src/app/foundation/page.tsx`, `src/app/themes/page.tsx`, `src/app/naming/page.tsx`.

**Problem:** Playwright found 0 links inside `main` on /foundation, /themes and /naming. Themes repeats Foundation's color story (roles and hex values) but does not link to the Foundation color ramps, and Foundation's claim that tokens pass "in light and in dark mode" does not link to Themes. When readers finish any of these pages, the footer is the only way forward.

**Why it matters:** Docs readers go from rules to examples. A tokens page that does not point to where the tokens are used, or a theme page that does not point to the ramps behind it, makes people backtrack through the header.

**Fix:** End each page with one "Next" line:
- Foundation: "Next: see these tokens in light and dark on Themes, or browse the components built from them."
- Themes: "Every role maps to a ramp on Foundation, Color." Link the token names in the roles table to `/foundation#color`.
- Naming: "Next: see the names in use on Button and Input."

## 8. MEDIUM: Each component page uses two taxonomies at once

**Where:** `src/app/components/[slug]/page.tsx:71-83` (breadcrumb uses tracker group), `:102-105` (Category row), `:210-216` (Related uses category); sidebar `ComponentSidebar.tsx` groups by Atoms and Molecules.

**Problem:** Artboard is "Components / Atoms" in the breadcrumb and "Category: Documentation" in the status row. Guideline is "Molecules" and "Documentation". Dropdown Menu is "Molecules" in the breadcrumb, but Related lists "Other action components". The sidebar and catalog sort by one scheme, and Related and the Category row use the other. No page explains either scheme beyond a one-line group description.

**Why it matters:** Readers build a mental map from the breadcrumb. If the same page then says something else is the category, the map breaks, and Related suggestions seem random.

**Fix:** Use Atoms and Molecules (the Figma file's split) for navigation and Related. Rename the "Category" row to "Role" so it reads as a property, not a location. Make Documentation its own group (its own sidebar section and catalog heading: "Documentation frames: layouts for the Figma file, not product UI"), so frames are no longer filed as Atoms or Molecules.

## 9. MEDIUM: Ctrl K finds nothing for "dark", "accessibility", "contrast", "install" or "npm"

**Where:** `src/components/CommandSearch.tsx:18-25` (page entries), `:90` (search text).

**Problem:** Verified in the browser: "dark", "accessibility", "contrast", "wcag", "install", "npm" and "getting started" all return "Nothing matches". The search text is only title, group and keywords. The Themes note "Light and dark mode" is shown but not searched. Foundation's Accessibility section and /docs "Using it today" have no entry.

**Why it matters:** These are the first words an adopter types. An empty result reads as "this system has no accessibility guidance" or "there is no way to install it". Neither is true.

**Fix:** Add the `note` to the search text, and add these entries:
- `{ href: "/foundation#accessibility", title: "Accessibility", group: "Page section", keywords: "wcag aaa contrast target focus motion" }`
- `{ href: "/docs#use", title: "Using it today", group: "Page section", keywords: "install npm package react figma start getting started" }`
- `{ href: "/docs#status", title: "Component status", group: "Page section", keywords: "ready planned in progress review tracker" }`

## 10. LOW: Foundation: Accessibility is missing from "On this page", and the Color intro sets a lower bar

**Where:** `src/app/foundation/page.tsx:145-153` (sections), `:209` (Color intro), `:135` (text contrast rule).

**Problem:** Accessibility is the first section on Foundation, but the "On this page" list and the phone chips start at Color. The Color intro says "Small text needs 4.5:1, marked AA". The table directly above it says the system targets 7:1 for text.

**Why it matters:** The section that sets the standard cannot be reached from the page's own navigation. The next paragraph then teaches a lower threshold, so a designer picking a swatch will stop at the AA step.

**Fix:** Add `{ id: "accessibility", label: "Accessibility" }` first in `sections`, and give the section `scroll-mt-40 lg:scroll-mt-24`. Change the Color sentence to: "Text needs 7:1 against its background, marked AAA. Large text and icons need 4.5:1, marked AA."

## 11. LOW: Three different descriptions of who Natuna is for

**Where:** home `src/app/page.tsx:70-73` ("built for fintech and banking flows"); /docs `src/app/docs/page.tsx:42-44` ("for digital products, from banking and payments to everyday consumer apps"); site title ("design system for digital products").

**Problem:** One page says fintech, another says everything from banking to consumer apps, and the title says digital products in general.

**Why it matters:** When the scope is unclear, teams cannot judge fit. The tracker (OTP Input, PIN Input, Amount Input, Transaction List Item, QR Code Display) points clearly at payments.

**Fix:** Use one sentence on Home, /docs and the meta description: "A design system for banking and payments apps, with tokens, components, and usage rules kept the same in Figma and React."

## 12. LOW: Two version numbers with no explanation

**Where:** footer `src/components/Footer.tsx:35` ("Version 0.1, in beta"); /docs `src/app/docs/page.tsx:51` and Foundation intro `src/app/foundation/page.tsx:163` ("Foundation Design System v1.0").

**Problem:** A reader sees v0.1 and v1.0 and cannot tell whether the foundation is stable and the site is beta, or the other way round.

**Why it matters:** Version numbers are how teams decide whether to depend on something. Two numbers with no explanation make both less useful.

**Fix:** Footer: "Site version 0.1, in beta. Figma foundation v1.0." Put the same two facts in /docs "Using it today".
