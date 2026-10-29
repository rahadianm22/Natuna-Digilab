# Natuna Digilab Design System: component spec for rebuilding the Figma plugin

> Written for Claude (chat, no repository access). Paste or attach this file, then ask Claude to rebuild the local Figma plugin. Everything the plugin needs is in this file: naming rules, variables, and one section per component with its Figma properties.

Generated from the Natuna Digilab docs site source on 2026-10-29. If the site changes, regenerate; do not hand-edit values here.

## 1. What to build

A **local Figma plugin** (`manifest.json`, `code.ts`, optional `ui.html`) that builds the Natuna Digilab components inside a Figma file, from this spec. Plugin requirements:

1. Create the **variables** first (section 4): a `Color` collection with the primitive ramps, and a `Roles` collection with Light and Dark modes whose values alias the primitives. Build components only after the variables exist.
2. Build each component as a **component set** whose variant properties and component properties use the **exact names in section 3**, emoji included. The emoji is part of the name.
3. **Bind every fill, stroke, text color and effect to a variable or style. Never write a raw hex into a node.** The only exception is the Signal accent, which is a single flat color.
4. Use **auto layout** everywhere. Interactive targets are at least **44 x 44 px**. Corner radius uses the radius scale in section 4.
5. Text uses the **Urbanist** font. Load every font style with `figma.loadFontAsync` before setting characters.
6. Name Figma pages with the stage prefixes in section 3.3.
7. Make the plugin **idempotent**: if a variable collection, variable or component already exists (match by name), update it instead of creating a duplicate.
8. Report progress with `figma.notify` and a per-component log in the plugin UI. A failure in one component must not stop the others.

Suggested order: variables, then atoms, then molecules (the group is listed per component).

## 2. System facts

- Source Figma file: Natuna Digilab Foundation Design System v1.1 (Figma Community file 1660946308636540525).
- Tracker: 51 rows, all status Selesai (Ready). 46 are product components, 5 are documentation frames (Artboard, Cover, Guideline, Document, Changelog) that are Figma file layouts, not product components.
- 53 components also exist as React code, which is where the prop lists below come from.
- Design status and code status are separate. This file describes the design (Figma) contract.
- Text contrast target is WCAG AAA (7:1) in light and dark.
- House style for any text the plugin writes: English, no em dashes, no emoji except inside property names.

## 3. Naming conventions

### 3.1 Rules

- Name a property after what it controls, in Title Case: Show Icon Left, not iconLeftVisible.
- A property that turns something on or off starts with Show and is a boolean.
- Rounded and Stroke are booleans, never variants.
- Use Tone for color, with semantic values (success, warning, danger), never raw color names.
- Keep the emoji at the start of the name. It sorts the property panel and is part of the exact name.

### 3.2 Property names (exact, emoji included)

**Structure and state**

| Figma property name | Type | Use |
| --- | --- | --- |
| 🧰 Type | Variant | The structural kind or composition of the component. |
| 🎯 State | Variant | Interaction or lifecycle state, such as default, hover, or disabled. |
| 📐 Size | Variant | Size of the component. |
| 🎨 Tone | Variant | Semantic color role. Replaces Color, and its values are roles such as success or danger. |
| ⚙️ Rounded | Boolean | On or off. A boolean, not a variant. |
| ⚙️ Stroke | Boolean | On or off. A boolean, not a variant. |

**Text content**

| Figma property name | Type | Use |
| --- | --- | --- |
| 🖊 Show Label | Boolean | Shows the label text. |
| 🖍 Label | Text | Main text of an atomic control, or the caption of a form field. |
| 📄 Show Description | Boolean | Shows the description text. |
| 📝 Description | Text | Supporting paragraph of content. |
| 🩹 Show Helper Text | Boolean | Shows the helper line under a form field. |
| 🩹 Helper Text | Text | Help or validation line, for form fields only. |
| 🔤 Show Placeholder | Boolean | Rarely needed; a placeholder usually does not need a toggle. |
| 🔤 Placeholder | Text | Hint text inside an empty field. |
| 🔢 Show Value | Boolean | Shows the number. |
| 🔢 Value | Text | A short number or value. |
| 📅 Timestamp | Text | Absolute or relative time. Merges the old Date and Timestamp. |

**Media and icons**

| Figma property name | Type | Use |
| --- | --- | --- |
| 📷 Show Image | Boolean | Shows a photo or avatar. |
| 💎 Show Logo | Boolean | Shows a logo. |
| ☘️ Icon | Instance swap | A single icon slot. Its scope is wider and it absorbs Change Icon. |
| ◀️ Show Icon Left | Boolean | Shows the left icon. |
| 🖼 Change Icon Left | Instance swap | Swaps the left icon. |
| ▶️ Show Icon Right | Boolean | Shows the right icon. |
| 🖼 Change Icon Right | Instance swap | Swaps the right icon. |

**Actions and indicators**

| Figma property name | Type | Use |
| --- | --- | --- |
| 🔘 Show Button | Boolean | An embedded action button. Merges the old CTA and Action. |
| 🧰 Button Value | Text | The button's label. |
| ⚡ Show Actions | Boolean | The row of actions in a footer. |
| ❌ Show Close | Boolean | The close button. Replaces Dismiss. |
| 🔗 Show Connector | Boolean | The line that joins items in a timeline. |
| 📎 Show Attachment | Boolean | The attachment indicator. |
| 🔴 Show Dot | Boolean | A small indicator dot. |

### 3.3 Page names

| Stage | Figma page name | Meaning |
| --- | --- | --- |
| 0% | 🟥 Under Construction | Not started yet. |
| 30% | 🟧 Concepting | Being concepted and designed. |
| 60% | 🟨 Documentation | Designed, being documented and reviewed. |
| 100% | 🟩 Finish Component | Signed off in Figma. |
| Pending | 🟦 Pending | Work on the component is paused. |
| Takedown | ⬛ Takedown | The component was taken down after it was crafted. |

## 4. Variables and foundations

### 4.1 Primitive ramps (collection `Color`, single mode)

Variable path is `<ramp>/<step>`, for example `blue/800`.

**Azure Blue** (`blue`, Brand)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| #e5f3ff | #d1e9ff | #9aceff | #67b6ff | #359dff | #0285ff | #0274e0 | #026acc | #015099 | #013566 | #001b33 |

**Tomato Red** (`orange`, Brand)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| #ffe9e5 | #ffd7d1 | #ffc1b7 | #ffa293 | #ff836f | #ff644b | #e04b33 | #c64e3a | #993c2d | #66281e | #33140f |

**Slate Gray** (`gray`, Brand)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| #f1f5f9 | #ebf0f4 | #d0d5dd | #b4bbc7 | #9aa4b2 | #697586 | #4b5565 | #364152 | #27303f | #19212e | #0d121c |

**Sky Blue** (`teal`, Utility)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| #f0f9ff | #d1edff | #b2e2ff | #85d0ff | #52bdff | #24abff | #129df3 | #0091eb | #0078c2 | #00629e | #003f66 |

**Jade Green** (`emerald`, Utility)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| #f7fbf3 | #e5f4dd | #d4ecc5 | #aad98c | #7dc551 | #5db725 | #54a522 | #4a921e | #386e16 | #25490f | #132507 |

**Amber Yellow** (`amber`, Utility)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| #fffbf0 | #fef2d2 | #fde5a5 | #fcd97d | #fac233 | #fab400 | #e0a200 | #c89000 | #966c00 | #644800 | #322400 |

**Imperial Red** (`red`, Utility)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| #fef1f2 | #fbdadb | #f7b6b7 | #f29192 | #ee6d6e | #ea484a | #d64748 | #bb3a3b | #8c2b2c | #5e1d1e | #2f0e0f |

**Amethyst Purple** (`violet`, Utility)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| #f5edff | #dfc6ff | #cfaaff | #b984ff | #ac6cff | #9747ff | #8941e8 | #6b32b5 | #53278c | #3f1e6b | #261240 |

**Signal Lime** `#c6f432`: one flat accent color, used only for a single marked step or state on navy `#0b1220`. Not a ramp.

Also create `white` = #ffffff, `navy` = #0b1220.

### 4.2 Role variables (collection `Roles`, modes `Light` and `Dark`)

Components use **roles only**, never primitives. Each role is an alias to a primitive step in each mode. Role path is the Figma column.

| Role (Figma path) | Group | Use | Light | Dark |
| --- | --- | --- | --- | --- |
| bg/canvas | Background | The page. | white #ffffff | gray/900 #19212e |
| bg/surface | Background | Cards, fields, panels. | white #ffffff | gray/800 #27303f |
| bg/subtle | Background | Secondary button, disabled fill. | gray/100 #ebf0f4 | gray/700 #364152 |
| bg/subtle-hover | Background | Hover on a subtle fill. | gray/200 #d0d5dd | gray/600 #4b5565 |
| bg/hover | Background | Hover on an unfilled control. | gray/50 #f1f5f9 | gray/700 #364152 |
| bg/brand | Background | Primary action. Carries white text. | blue/800 #015099 | blue/800 #015099 |
| bg/brand-hover | Background | Hover on the primary action. | blue/900 #013566 | blue/900 #013566 |
| bg/danger | Background | Destructive action. Carries white text. | red/800 #8c2b2c | red/800 #8c2b2c |
| bg/danger-hover | Background | Hover on the destructive action. | red/900 #5e1d1e | red/900 #5e1d1e |
| text/primary | Text | Default text. | gray/900 #19212e | gray/50 #f1f5f9 |
| text/secondary | Text | Hints, labels, placeholders. | gray/700 #364152 | gray/200 #d0d5dd |
| text/tertiary | Text | Metadata and captions on the canvas. On a surface use text/secondary. | gray/600 #4b5565 | gray/300 #b4bbc7 |
| text/on-danger | Text | Text on a danger fill. | white #ffffff | white #ffffff |
| text/on-accent | Text | Navy text on the Signal lime and on status solid fills. | navy #0b1220 | navy #0b1220 |
| text/strong | Text | Text on secondary and ghost buttons. | gray/800 #27303f | gray/100 #ebf0f4 |
| text/strong-hover | Text | That text while hovered. | gray/950 #0d121c | white #ffffff |
| text/disabled | Text | Text on a disabled control. | gray/500 #697586 | gray/300 #b4bbc7 |
| text/on-brand | Text | Text on a brand or danger fill. | white #ffffff | white #ffffff |
| text/danger | Text | Error messages. | red/800 #8c2b2c | red/200 #f7b6b7 |
| text/link | Text | Links. | blue/800 #015099 | blue/200 #9aceff |
| border/default | Border | Dividers and card edges. | gray/200 #d0d5dd | gray/600 #4b5565 |
| border/input | Border | Field and ghost button edges. 3:1 or more. | gray/500 #697586 | gray/400 #9aa4b2 |
| border/disabled | Border | Edge of a disabled field. | gray/300 #b4bbc7 | gray/500 #697586 |
| border/focus | Border | Focus ring. 3:1 or more. | blue/600 #0274e0 | blue/400 #359dff |
| border/danger | Border | Edge and ring of an invalid field. | red/800 #8c2b2c | red/200 #f7b6b7 |
| bg/tone/neutral | Tone | Neutral badge fill. | gray/100 #ebf0f4 | gray/700 #364152 |
| text/tone/neutral | Tone | Neutral badge text. | gray/700 #364152 | gray/200 #d0d5dd |
| bg/tone/info | Tone | Info badge and avatar fill. | blue/100 #d1e9ff | blue/900 #013566 |
| text/tone/info | Tone | Info badge and avatar text. | blue/900 #013566 | blue/100 #d1e9ff |
| bg/tone/success | Tone | Success badge fill. | emerald/100 #e5f4dd | emerald/900 #25490f |
| text/tone/success | Tone | Success badge text. | emerald/900 #25490f | emerald/200 #d4ecc5 |
| bg/tone/warning | Tone | Warning badge fill. | amber/100 #fef2d2 | amber/900 #644800 |
| text/tone/warning | Tone | Warning badge text. | amber/900 #644800 | amber/100 #fef2d2 |
| bg/tone/danger | Tone | Danger badge fill. | red/100 #fbdadb | red/900 #5e1d1e |
| text/tone/danger | Tone | Danger badge text. | red/900 #5e1d1e | red/100 #fbdadb |
| status/success | Status | Success text. Pair it with a label or icon. | emerald/900 #25490f | emerald/200 #d4ecc5 |
| status/success-bg | Status | Success message fill. | emerald/50 #f7fbf3 | emerald/950 #132507 |
| status/warning | Status | Warning text. Pair it with a label or icon. | amber/900 #644800 | amber/200 #fde5a5 |
| status/warning-bg | Status | Warning message fill. | amber/50 #fffbf0 | amber/950 #322400 |
| status/danger | Status | Danger text. Pair it with a label or icon. | red/900 #5e1d1e | red/200 #f7b6b7 |
| status/danger-bg | Status | Danger message fill. | red/50 #fef1f2 | red/950 #2f0e0f |
| status/info | Status | Info text. Pair it with a label or icon. | teal/950 #003f66 | teal/200 #b2e2ff |
| status/info-bg | Status | Info message fill. | teal/50 #f0f9ff | teal/950 #003f66 |
| status/solid/success | Status | Solid success badge. Carries text/on-accent. | emerald/500 #5db725 | emerald/500 #5db725 |
| status/solid/warning | Status | Solid warning badge. Carries text/on-accent. | amber/500 #fab400 | amber/500 #fab400 |
| status/solid/info | Status | Solid info badge. Carries text/on-accent. | teal/500 #24abff | teal/500 #24abff |

Surface rule: in dark mode `bg/surface` (gray/800) is lighter than `bg/canvas` (gray/900), so `text/tertiary` drops under 7:1 on a surface. On a surface use `text/secondary`.

### 4.3 Radius, shadow, type

| Radius | px |
| --- | --- |
| xs, sm | 4 |
| md, lg | 8 |
| xl | 16 |
| 2xl | 24 |
| 3xl | 32 |

Shadows (color gray/950 #0d121c): sm `0 1 2 / .06` + `0 2 4 / .10`; md `0 2 4 / .08` + `0 4 8 / .12`; lg `0 4 8 / .10` + `0 10 20 / .15`; xl `0 8 16 / .12` + `0 20 40 / .15`. Create them as effect styles.

Type styles, font **Urbanist**, size / line height in px. Create text styles with these names:

| Style | Mobile | Medium | Large |
| --- | --- | --- | --- |
| H1 | 24 / 36 | 28 / 40 | 32 / 44 |
| H2 | 20 / 30 | 24 / 36 | 28 / 40 |
| Subheader | 18 / 26 | 20 / 30 | 24 / 36 |
| Body 1 | 16 / 24 | 18 / 28 | |
| Body 2 | 14 / 22 | | |
| Caption 1 | 12 / 18 | | 14 / 22 |
| Caption 2 | 12 / 16 | | |

## 5. Components

Each section gives the Figma properties to create (left column is the exact property name) and, for context, the matching React prop. Where a row says there is no prop, the property still belongs in Figma.

Documentation frames (Artboard, Cover, Guideline, Document, Changelog) are page layouts for the Figma file. Build them last, or skip them if the plugin only needs product components.

Index: Avatar, Badge, Breadcrumbs, Button, Changelog, Checkbox, Chip, Comment, Headline, Label Text, OTP Input, PIN Input, Radio Button, Separator, Slider, Spinner, Textarea, Toggle, Accordion, Alert, Amount Input, Card, Combobox, Cover, Date Picker, Divider, Drawer, Dropdown Menu, Empty State, File Input, Input, Modal, More Menu, Navigation Bar, Pagination, Progress Bar, QR Code Display, Radio Group, Rating, Search, Skeleton, Status, Stepper, Table, Tabs, Toast, Tooltip, Transaction List Item, Button Group, Code Block, Icon Button, Link, Select.

### Avatar

- Group: Atoms. Category: Display. Slug: `avatar`.
- A visual representation of a user, team, or entity.
- When to use: Shows identity in tables, comments, headers, and anywhere else it matters.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 📐 Size | `size` | sm, md, and lg. |
| 📷 Show Image | none | No prop yet. Avatar renders initials only and takes no image source. |
| 🎯 State | none | No prop. An avatar is not interactive, so it has no states. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `name` | `string` |  |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `className` | `string` | `""` |
| `...rest` | `HTMLAttributes<HTMLSpanElement>` |  |

Rules to respect in the design:

- Do: Pass the full name. Initials come from the first and last word, so Natuna Digilab shows ND.
- Do: Keep one size within the same list or table.
- Don't: Pass initials or a nickname as the name. The name is also what a screen reader reads.
- Don't: Expect Avatar to show a photo or a logo. It renders initials only and has no image prop yet.

Accessibility the design must keep:

- Pass the full name, not initials. The name is the accessible label.
- When the same name is written right next to the avatar, pass aria-hidden="true" so the name is not read twice.
- If the avatar should open a profile, wrap it in a link or button that has its own name. The avatar is not focusable.

### Badge

- Group: Atoms. Category: Display. Slug: `badge`.
- A small label used to highlight status, category, or count.
- When to use: Statuses (Paid, Pending, Overdue), counts, or tags.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🎨 Tone | `tone` | Same name and the same semantic values. |
| 🧰 Type | `type` | solid, subtle, or outline. |
| Show Icon Left, Change Icon Left | `iconLeft` | Pass an icon element to show it. |
| Show Icon Right, Change Icon Right | `iconRight` | Pass an icon element to show it. |
| 🖍 Label | `children` | The text inside the badge. |
| 📐 Size | `size` | sm or md. |
| 🎯 State | none | No prop. A badge is not interactive, so it has no states. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `tone` | `"neutral" \| "primary" \| "secondary" \| "info" \| "success" \| "warning" \| "danger"` | `"neutral"` |
| `type` | `"solid" \| "subtle" \| "outline"` | `"subtle"` |
| `size` | `"sm" \| "md"` | `"md"` |
| `iconLeft, iconRight` | `ReactNode` |  |
| `children` | `ReactNode` |  |
| `className` | `string` | `""` |
| `...rest` | `HTMLAttributes<HTMLSpanElement>` |  |

Rules to respect in the design:

- Do: Use consistent colors for the same meaning across the product.
- Do: Keep badge text short: one or two words.
- Don't: Use more than one badge per item unless necessary.
- Don't: Rely on color alone to convey meaning: add text too.

Accessibility the design must keep:

- Put the meaning in the text, such as Paid or Failed, never in the color alone.
- If a badge changes while someone is on the page, the change is not announced. Use a live region when they need to hear it.

### Breadcrumbs

- Group: Atoms. Category: Navigation. Slug: `breadcrumbs`.
- Shows the user's location within a hierarchy and allows quick backtracking.
- When to use: Deep or nested page structures.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 📐 Size | `size` | sm or md. |
| 🔀 Count | `items, maxItems` | 2 to 5 Level is the length of items. Truncated is maxItems. |
| Change Icon | `separator` | chevron or slash. |
| Show Icon Left | `home` | House icon on the first item. |
| 🎯 State | none | Hover comes from the browser. Current is the last item. There is no disabled item in code. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ label: string; href?: string }[]` |  |
| `size` | `"sm" \| "md"` | `"md"` |
| `separator` | `"chevron" \| "slash"` | `"chevron"` |
| `home` | `boolean` | `true` |
| `maxItems` | `number` | `0` |

Rules to respect in the design:

- Do: Reflect the actual hierarchy of the site.
- Do: Make all but the current page clickable.
- Don't: Use on flat, single-level sites.
- Don't: Make the current page a clickable link.

Accessibility the design must keep:

- Pass real href values. Without one, an item is a link that goes nowhere.
- Do not use it as the only navigation.

### Button

- Group: Atoms. Category: Action. Slug: `button`.
- Trigger an action or event, such as submitting a form or opening a dialog.
- When to use: Buttons run actions: submitting a form, confirming a choice, opening a dialog, or starting a process. To move to another page, use a Link, styled as a button only when it is the main call to action.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `variant` | Closest match. Naming defines Type as the structural kind; variant sets the visual weight. Destructive is a variant value in code, while Naming rule 4 puts color roles under Tone. |
| 📐 Size | `size` | md and lg. |
| 🎯 State | none | No prop. Hover, focus, and pressed come from the browser at runtime. Disabled is the disabled prop and loading is the loading prop. |
| 🖍 Label | `children` | The text inside the button. |
| ◀️ Show Icon Left, 🖼 Change Icon Left | `children` | No icon prop yet. Put the icon in children before the text, with aria-hidden. |
| ▶️ Show Icon Right, 🖼 Change Icon Right | `children` | No icon prop yet. Put the icon in children after the text, with aria-hidden. |
| 🎨 Tone | none | No prop yet. The destructive color is a variant value. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "destructive" \| "inverse"` | `"primary"` |
| `size` | `"md" \| "lg"` | `"md"` |
| `children` | `ReactNode` |  |
| `loading` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` |
| `className` | `string` | `""` |
| `...rest` | `ButtonHTMLAttributes` |  |

Rules to respect in the design:

- Do: Reserve primary for the single most important action in the view. Use secondary or ghost for everything else.
- Do: Write labels that describe the action ("Save changes", "Delete account"). Avoid vague labels like "OK" or "Click here".
- Do: Show a loading state for actions that take time, like saving or submitting, so the user knows it is working.
- Don't: Place more than one primary button in the same view: this dilutes the visual hierarchy.
- Don't: Use the destructive variant without a confirmation step for irreversible actions like deleting data.
- Don't: Use a button for navigation. If it only takes the user to another page, use a link instead.

Accessibility the design must keep:

- Give an icon-only button an aria-label, and mark the icon aria-hidden.
- Announce the result of a slow action yourself, for example with a status message, because the end of loading is silent.
- Pass type="submit" for a form's submit button. The default is button.

### Changelog

- Group: Atoms. Category: Documentation. Slug: `changelog`.
- A dated list of what changed in each release of the design system.
- When to use: Tells teams in the Figma file what changed before they update.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| Scope | `scope` | product or system. |
| Type | `type` | added, improved, fixed, or deprecated. |
| Label, Timestamp, Title, Description | `version, timestamp, title, description` | Same text. |
| Show Connector | `connector` | Boolean. |
| Show Button, Button Value | `actionLabel, actionHref` | Pass actionLabel to show it. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `version` | `string` |  |
| `timestamp` | `string` |  |
| `title` | `string` |  |
| `description` | `string` |  |
| `type` | `"added" \| "improved" \| "fixed" \| "deprecated"` | `"added"` |
| `scope` | `"product" \| "system"` | `"product"` |
| `actionLabel, actionHref` | `string` |  |
| `affects` | `string[]` |  |
| `connector` | `boolean` | `true` |

Rules to respect in the design:

- Do: Group entries by version and date.
- Do: Say what changed and what teams need to do.
- Don't: Write "minor fixes" without saying what was fixed.
- Don't: Edit past entries after release.

Accessibility the design must keep:

- Pass a real actionHref.
- Order entries newest first, and wrap the list in a list element if you need list semantics.

### Checkbox

- Group: Atoms. Category: Form. Slug: `checkbox`.
- Lets users select one or more options from a set.
- When to use: Multi-select choices and binary settings.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 💡 Selection | `checked, indeterminate` | Unchecked and Checked are the native checked state. Indeterminate is the indeterminate prop. |
| 📐 Size | `size` | sm, md, or lg. |
| 🎯 State | `error, disabled` | Error is the error prop and disabled is the native attribute. Hover and focus come from the browser at runtime. |
| Show Label | none | No prop. The label is always shown, because a checkbox without a label has no name. |
| Helper Text | `hint, error` | hint is the help line. error replaces it while it is set. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `hint` | `string` |  |
| `error` | `string` |  |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` |
| `indeterminate` | `boolean` | `false` |
| `className` | `string` | `""` |
| `...rest` | `InputHTMLAttributes` |  |

Rules to respect in the design:

- Do: Group related checkboxes with a clear label.
- Do: Support an indeterminate state for partial selection.
- Don't: Use checkboxes for mutually exclusive options: use radio buttons instead.
- Don't: Hide the selection state visually.

Accessibility the design must keep:

- Use indeterminate only for a parent whose children are partly selected, and update it from the children.
- Group related checkboxes in a fieldset with a legend.
- On submit, move focus to the first invalid checkbox, because a new error is not announced.

### Chip

- Group: Atoms. Category: Display. Slug: `chip`.
- A compact label for a category, filter, or selected value.
- When to use: Applied filters, selected options in a multi-select, or content categories.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | filled or outline. |
| 📐 Size | `size` | sm or md. |
| 🎨 Tone | `tone` | Same five tones. |
| Show Icon Left, Change Icon Left | `icon` | Pass an icon. |
| Show Close | `onRemove` | Pass the handler to show it. |
| Label | `label` | Same. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `tone` | `"neutral" \| "primary" \| "success" \| "warning" \| "danger"` | `"neutral"` |
| `type` | `"filled" \| "outline"` | `"filled"` |
| `size` | `"sm" \| "md"` | `"md"` |
| `icon` | `ReactNode` |  |
| `onRemove` | `() => void` |  |

Rules to respect in the design:

- Do: Give removable chips a clear remove button with an accessible name.
- Do: Keep chip text to one or two words.
- Don't: Use a chip for status: use a badge.
- Don't: Let a row of chips overflow the screen: wrap it.

Accessibility the design must keep:

- After removing a chip, move focus to the next chip or back to the field that made it.
- Unlike Badge, which only labels, a chip stands for something the user chose.

### Comment

- Group: Atoms. Category: Display. Slug: `comment`.
- A single message in a discussion, with author, time, and text.
- When to use: Review notes, support threads, and activity on a record.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | thread or annotation. |
| 🎯 State | `state` | default, highlight, or resolved. |
| Title, Label, Timestamp | `author, role, timestamp` | Name, tag, and time. |
| Description | `children` | The text. |
| Show Actions, Button Value | `onReply, onToggleResolved` | Pass the handlers to show the actions. |
| Show Image | none | No prop. The avatar always shows initials. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `author` | `string` |  |
| `role` | `string` |  |
| `timestamp` | `string` |  |
| `type` | `"thread" \| "annotation"` | `"thread"` |
| `state` | `"default" \| "highlight" \| "resolved"` | `"default"` |
| `onReply` | `() => void` |  |
| `onToggleResolved` | `() => void` |  |
| `children` | `ReactNode` |  |

Rules to respect in the design:

- Do: Show when the comment was posted.
- Do: Use initials when there is no profile photo.
- Don't: Truncate a comment without a way to read the rest.
- Don't: Show edit actions to people who cannot edit.

Accessibility the design must keep:

- Do not rely on the highlight or the accent color alone to say a comment is new or resolved. Say it in text.
- The more-options menu in the design is not in code yet.

### Headline

- Group: Atoms. Category: Display. Slug: `headline`.
- A page or section title set in the Urbanist header scale.
- When to use: One Header 1 per page, then Header 2 and Subheader for the sections below it.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `level` | Header 1, Header 2, Subheader. The text styles are Foundation Typography v1.1. |
| 🖍 Label | `children` | The title text. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `level` | `"h1" \| "h2" \| "subheader"` | `"h1"` |
| `as` | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "p"` | `h1, h2, h3` |
| `children` | `ReactNode` |  |
| `...rest` | `HTMLAttributes` |  |

Rules to respect in the design:

- Do: Follow the scale in order: Header 1, Header 2, Subheader.
- Do: Keep titles short enough to fit on one line on mobile.
- Don't: Pick a heading size for looks: the level must match the document outline.
- Don't: Set whole paragraphs in a header style.

Accessibility the design must keep:

- Use one h1 per page and do not skip levels: h1, then h2, then h3.
- Pick the element for the outline and the level for the look, not the other way round.

### Label Text

- Group: Atoms. Category: Display. Slug: `label-text`.
- Short text that names a field, value, or group.
- When to use: Sits above inputs and beside values in summaries, set in Caption 1 semibold.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 💡 Indicator | `indicator` | none, required, or optional. |
| 📐 Size | `size` | sm, md, or lg. |
| 🎯 State | `error, disabled` | Error and Disabled are boolean props. |
| 🖍 Label | `children` | The label text. |
| Show Icon Right, Change Icon Right | `icon` | Pass an icon element to show it. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `indicator` | `"none" \| "required" \| "optional"` | `"none"` |
| `error` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `icon` | `ReactNode` |  |
| `...rest` | `LabelHTMLAttributes` |  |

Rules to respect in the design:

- Do: Write labels as nouns: "Account number", not "Enter your account number".
- Do: Connect every form label to its input.
- Don't: Replace a label with placeholder text.
- Don't: End labels with a colon when they sit above the field.

Accessibility the design must keep:

- Pass htmlFor, or wrap the field, so the label names it.
- Set the native required attribute on the field. The asterisk alone tells a screen reader nothing.
- Put what an info icon explains in a hint, because the icon is decorative.

### OTP Input

- Group: Atoms. Category: Form. Slug: `otp-input`.
- Boxes for entering a one-time code sent by SMS or email.
- When to use: Verification steps. Accept a pasted code and move focus between boxes automatically.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🔀 Count | `length` | 4 or 6 Digit. |
| 📐 Size | `size` | OTP Cell size. |
| 🎯 State | `value, error, disabled` | Focused is the browser. |
| Show Helper Text, Helper Text | `hint` | Pass to show. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `length` | `4 \| 6` | `6` |
| `value, onChange` | `string, (value) => void` |  |
| `onComplete` | `(value) => void` |  |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `hint, error` | `string` |  |
| `disabled` | `boolean` |  |

Rules to respect in the design:

- Do: Set autocomplete="one-time-code" so phones can fill it.
- Do: Show where the code was sent and a way to resend it.
- Don't: Block paste.
- Don't: Clear the whole code when one digit is wrong.

Accessibility the design must keep:

- Tell people how long until they can resend, and do not clear the boxes on error without saying so.

### PIN Input

- Group: Atoms. Category: Form. Slug: `pin-input`.
- Masked boxes for entering a secret PIN.
- When to use: Authorising a transaction or unlocking an app.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🔀 Count | `length` | 4 or 6 Digit. |
| 🎯 State | `value, error, disabled` | Filled is the dot count. |
| Show Label, Label | `showLabel, label` | Same. |
| Show Helper Text, Helper Text | `hint` | Pass to show. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `length` | `4 \| 6` | `6` |
| `value, onChange` | `string, (value) => void` |  |
| `onComplete` | `(value) => void` |  |
| `hint, error` | `string` |  |
| `showLabel` | `boolean` | `true` |
| `disabled` | `boolean` |  |

Rules to respect in the design:

- Do: Mask each digit after it is entered.
- Do: Use a numeric keyboard on mobile.
- Don't: Show the PIN in plain text by default.
- Don't: Store or log the entered digits.

Accessibility the design must keep:

- The numeric keypad lives outside this component. Give its buttons names, and its delete button the name Delete.

### Radio Button

- Group: Atoms. Category: Form. Slug: `radio-button`.
- A single option that belongs to a set where only one can be chosen.
- When to use: Lives inside a radio group. A radio button on its own cannot be unselected.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 💡 Selection | `checked` | Unselected and Selected are the native checked state. |
| 📐 Size | `size` | sm, md, or lg. |
| 🎯 State | `error, disabled` | Error is the error prop and disabled is the native attribute. Hover and focus come from the browser at runtime. |
| 🖊 Show Label, 🖍 Label | `label` | The label is always shown, because a radio button without a label has no name. |
| 🩹 Show Helper Text, Helper Text | `hint, error` | hint is the help line. error replaces it while it is set. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `hint` | `string` |  |
| `error` | `string` |  |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` |
| `className` | `string` | `""` |
| `...rest` | `InputHTMLAttributes` |  |

Rules to respect in the design:

- Do: Make the label clickable along with the circle.
- Do: Keep the tap area at least 44px tall.
- Don't: Use a single radio button for a yes/no setting: use a checkbox or toggle.
- Don't: Style it so it looks like a checkbox.

Accessibility the design must keep:

- Give every option in a set the same name, and wrap the set in a fieldset with a legend or a role="radiogroup" with a label.
- This is a single option. Grouping and exclusivity belong to the Radio Group, which does not exist in code yet.

### Separator

- Group: Atoms. Category: Display. Slug: `separator`.
- A small inline mark (dot or bar) between items on the same line.
- When to use: Splits metadata such as date, category, and author in a single row.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `orientation` | horizontal or vertical. |
| 💡 Style | `weight` | Named weight in code, because style is a reserved prop. subtle, default, or strong. |
| Show Label, Label | `label` | Pass label to show the text. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `weight` | `"subtle" \| "default" \| "strong"` | `"default"` |
| `label` | `string` |  |
| `className` | `string` | `""` |

Rules to respect in the design:

- Do: Keep the mark lighter than the text it separates.
- Do: Hide it from screen readers.
- Don't: Use it to split whole sections: use a divider.
- Don't: Chain more than four items on one line.

Accessibility the design must keep:

- Use it for a real change of topic. For pure spacing, use margin.

### Slider

- Group: Atoms. Category: Form. Slug: `slider`.
- Picks a value from a continuous range by dragging.
- When to use: Choices where position in the range matters more than the exact value, such as volume or a price filter.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🔀 Mode | `mode` | single or range. |
| 📐 Size | `size` | sm, md, or lg. |
| 🎯 State | `disabled` | Hover and focus come from the browser. |
| Show Label | `showLabel` | Boolean. |
| Show Value, Value | `showValue, format` | The value text is computed. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `mode` | `"single" \| "range"` | `"single"` |
| `value, onChange` | `number or [number, number]` |  |
| `defaultValue` | `number or [number, number]` |  |
| `min, max, step` | `number` | `0, 100, 1` |
| `format` | `(value) => string` |  |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `showLabel, showValue` | `boolean` | `true` |
| `disabled` | `boolean` |  |

Rules to respect in the design:

- Do: Show the current value next to the slider.
- Do: Support arrow keys for fine steps.
- Don't: Use for exact values like an amount to transfer: use an input.
- Don't: Make the thumb smaller than a finger.

Accessibility the design must keep:

- The row is 44px tall, so the whole width is the touch target.

### Spinner

- Group: Atoms. Category: Feedback. Slug: `spinner`.
- Indicates that content is loading or an action is in progress.
- When to use: Short waits. For longer operations, consider a progress bar with more context.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | circular or dots. |
| 🎨 Tone | `tone` | Neutral, Primary, On-Primary. |
| 📐 Size | `size` | xs to lg. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `type` | `"circular" \| "dots"` | `"circular"` |
| `tone` | `"neutral" \| "primary" \| "onPrimary"` | `"primary"` |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` |
| `label` | `string` | `"Loading"` |

Rules to respect in the design:

- Do: Pair with a label when the wait may be longer than a second or two.
- Do: Use consistent sizing across similar contexts.
- Don't: Use a spinner for waits long enough to need progress feedback.
- Don't: Leave the user without any indication that something is happening.

Accessibility the design must keep:

- Use it inline or in a button. For a whole area, use Skeleton; for measurable progress, use Progress Bar.
- Motion stops for people who ask for reduced motion; the static ring still shows.

### Textarea

- Group: Atoms. Category: Form. Slug: `textarea`.
- A multi-line text field for longer answers.
- When to use: Notes, descriptions, and messages.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 📐 Size | `size` | sm, md, or lg. |
| 🎯 State | `value, error, disabled` | Hover and focus come from the browser. |
| Show Label, Label | `label` | Always shown in code. |
| Show Helper Text, Helper Text | `hint` | Pass to show. |
| Placeholder | `placeholder` | Native. |
| Show Counter | `showCounter` | Needs maxLength. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `hint` | `string` |  |
| `error` | `string` |  |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `showCounter` | `boolean` | `true` |
| `...rest` | `TextareaHTMLAttributes` |  |

Rules to respect in the design:

- Do: Size it to the expected length of the answer.
- Do: Show a character count when there is a limit.
- Don't: Use for single-line answers.
- Don't: Disable resizing without a reason.

Accessibility the design must keep:

- maxLength stops typing at the limit; say the limit in the hint so it is not a surprise.

### Toggle

- Group: Atoms. Category: Form. Slug: `toggle`.
- A switch for turning a single setting on or off.
- When to use: Binary settings that take effect immediately.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 💡 Selection | `checked` | Off and On are the native checked state. |
| 📐 Size | `size` | sm, md, or lg. |
| 🎯 State | `disabled` | Disabled is the native attribute. Hover and focus come from the browser. There is no Error state, by design. |
| Show Label, Label | `label` | The label is always shown, because a switch without a label has no name. |
| Show Helper Text, Helper Text | `hint` | Pass hint to show the line. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `hint` | `string` |  |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` |
| `...rest` | `InputHTMLAttributes` |  |

Rules to respect in the design:

- Do: Apply the change immediately, without a separate save step.
- Do: Label clearly what the on/off state means.
- Don't: Use for actions that need confirmation before applying.
- Don't: Use ambiguous labels where on/off meaning is unclear.

Accessibility the design must keep:

- Use it for a setting that applies at once. If the choice needs a Save button, use a checkbox.
- A setting that can fail validation is a field, not a toggle.

### Accordion

- Group: Molecules. Category: Display. Slug: `accordion`.
- Stacked sections that expand to reveal their content.
- When to use: Long reference content, where people look for one section at a time.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🖍 Label | `items[].title` | Closest match: the header text of each item. |
| 📝 Description | `items[].content` | Closest match: the body of each item. In code it can hold any content, not only text. |
| 🎯 State | `items[].defaultOpen` | Open or closed on first render only. After that, the state is runtime. |
| ☘️ Icon | none | No prop yet. The caret icon is fixed. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `AccordionItem[]` |  |
| `items[].title` | `string` |  |
| `items[].content` | `ReactNode` |  |
| `items[].defaultOpen` | `boolean` |  |
| `className` | `string` | `""` |

Rules to respect in the design:

- Do: Write headers that describe what is inside.
- Do: Let the whole header row toggle the section.
- Don't: Hide the only important content in a collapsed section.
- Don't: Nest accordions inside accordions.

Accessibility the design must keep:

- Give every item a unique title.
- If the headers need to be in the page's heading outline, Accordion does not support that yet.

### Alert

- Group: Molecules. Category: Feedback. Slug: `alert`.
- A persistent, inline message that communicates important information.
- When to use: Warnings, errors, and important context tied to a section of the page.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| Tone | `tone` | info, success, warning, or danger. |
| Title, Description | `title, description` | Same text. |
| Action | `action` | Pass a link or button. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` |  |
| `description` | `ReactNode` |  |
| `tone` | `"info" \| "success" \| "warning" \| "danger"` | `"info"` |
| `action` | `ReactNode` |  |
| `onClose` | `() => void` |  |

Rules to respect in the design:

- Do: Match color and icon to severity (info, success, warning, error).
- Do: Keep messages actionable and specific.
- Don't: Use for transient confirmations: use a toast instead.
- Don't: Overuse alerts for low-priority information.

Accessibility the design must keep:

- An alert stays until the problem is gone. For a short confirmation that disappears, use Toast.

### Amount Input

- Group: Molecules. Category: Form. Slug: `amount-input`.
- An input for money that formats the value as the user types.
- When to use: Transfer, top-up, and payment amounts.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 📐 Size | `size` | sm, md, or lg. |
| 🎯 State | `value, error, disabled` | Hover and focus come from the browser. |
| Show Label, Label | `label` | Same. |
| Show Helper Text, Helper Text | `hint` | Pass to show. |
| Placeholder | `placeholder` | Same. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `value, onChange` | `number \| null` |  |
| `defaultValue` | `number \| null` |  |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `hint, error` | `string` |  |
| `placeholder` | `string` | `"0"` |
| `disabled` | `boolean` |  |

Rules to respect in the design:

- Do: Show the currency (Rp) next to the value.
- Do: Show the limit or balance close to the field.
- Don't: Accept letters or more than one decimal separator.
- Don't: Reformat the value in a way that moves the cursor.

Accessibility the design must keep:

- Validate the minimum and maximum on the number, not on the formatted text.

### Card

- Group: Molecules. Category: Display. Slug: `card`.
- A container that groups related content and actions.
- When to use: One card per record the user can act on, such as a bill or a transfer.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | basic, media, or action. |
| 🎯 State | `interactive, disabled` | Hover and Pressed are the interactive prop. Disabled is disabled. |
| Stroke | `stroke` | Boolean. |
| Show Image, Show Label, Show Description, Show Button | `image, label, description, actions` | Pass or leave out. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` |  |
| `description` | `string` |  |
| `label` | `string` |  |
| `type` | `"basic" \| "media" \| "action"` | `"basic"` |
| `image` | `ReactNode` |  |
| `linkLabel, href` | `string` |  |
| `actions` | `ReactNode` |  |
| `interactive` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `stroke` | `boolean` | `true` |

Rules to respect in the design:

- Do: Keep consistent padding and radius across cards.
- Do: Use a clear hierarchy inside: title, body, action.
- Don't: Nest cards inside cards.
- Don't: Overload a single card with unrelated content.

Accessibility the design must keep:

- If the whole card is a link, put the link on the title and stretch it, so there is one link per card.
- Do not nest interactive elements inside an interactive card.

### Combobox

- Group: Molecules. Category: Form. Slug: `combobox`.
- An input that suggests matching options as the user types.
- When to use: Long option lists such as banks, cities, or countries.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🔀 Mode | `mode` | single or multiple. |
| 🎯 State | `error, disabled` | Hover and focus come from the browser. |
| Label, Helper Text, Placeholder | `label, hint, placeholder` | Same. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `options` | `{ value, label }[]` |  |
| `mode` | `"single" \| "multiple"` | `"single"` |
| `value, onChange` | `string \| null, or string[]` |  |
| `placeholder` | `string` |  |
| `hint, error` | `string` |  |
| `emptyText` | `string` | `"No results"` |
| `disabled` | `boolean` |  |

Rules to respect in the design:

- Do: Match anywhere in the option name, not only the start.
- Do: Support arrow keys and Enter to pick an option.
- Don't: Use for fewer than about ten options: use a select or radio group.
- Don't: Accept free text when only listed values are valid.

Accessibility the design must keep:

- For a short fixed list, use Select. Show an Empty State when nothing matches.

### Cover

- Group: Molecules. Category: Documentation. Slug: `cover`.
- The first frame of a Figma file: product name, file title, and version.
- When to use: The thumbnail frame of every Natuna Digilab Figma file.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | gradient, solid, or image. |
| 📐 Size | `size` | sm, md, or lg. |
| Show Logo | `logo` | Boolean. |
| Title, Show Description, Description | `title, description` | Same text. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` |  |
| `description` | `string` |  |
| `type` | `"gradient" \| "solid" \| "image"` | `"gradient"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `logo` | `boolean` | `true` |
| `image` | `ReactNode` |  |

Rules to respect in the design:

- Do: Update the version on every release.
- Do: List only what the file really contains.
- Don't: Leave an old version number on the cover.
- Don't: Add decoration that is not part of the brand.

Accessibility the design must keep:

- With an image, pick a photo the scrim keeps readable. The scrim darkens the lower half for the text.
- The logo mark is decorative. Put the product name in the title.

### Date Picker

- Group: Molecules. Category: Form. Slug: `date-picker`.
- Chooses a date from a calendar or by typing.
- When to use: Scheduling and date filters. Let people type the date as well.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| Calendar · Mode | `mode` | single or range. |
| 🎯 State | `value, error, disabled` | Focused is the open calendar. |
| Label, Helper Text, Placeholder | `label, hint, placeholder` | Same. |
| Change Icon Left | none | No prop. The calendar icon is fixed. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `mode` | `"single" \| "range"` | `"single"` |
| `value, onChange` | `Date or [Date, Date \| null]` |  |
| `defaultValue` | `Date or [Date, Date \| null]` |  |
| `today` | `Date` |  |
| `hint, error` | `string` |  |
| `placeholder` | `string` | `"Select date"` |
| `disabled` | `boolean` |  |
| `Calendar` | `component` |  |

Rules to respect in the design:

- Do: Show the expected format, such as DD/MM/YYYY.
- Do: Disable dates that cannot be chosen and say why.
- Don't: Force a calendar for dates far in the past, like a birth date.
- Don't: Mix date formats in the same product.

Accessibility the design must keep:

- Dates show in id-ID format. If people type dates, add a text input next to it.
- Each day is 44px tall. On a screen narrower than about 400px the seven columns share the width, so a day can be 35 to 39px wide. Give the calendar the full width of the screen on phones.

### Divider

- Group: Molecules. Category: Display. Slug: `divider`.
- A thin line used to separate content into distinct sections.
- When to use: Groups related content without adding a full container. Keep it sparing.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🔧 Content | `label, icon` | Line is neither. Label is label. Icon is icon. |
| 📐 Size | `size` | sm or md. |
| Label, Icon | `label, icon` | Same props. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `icon` | `ReactNode` |  |
| `size` | `"sm" \| "md"` | `"md"` |

Rules to respect in the design:

- Do: Use consistent spacing above and below.
- Do: Use as a lighter alternative to a card border.
- Don't: Overuse: too many dividers create visual noise.
- Don't: Use as a replacement for proper spacing.

Accessibility the design must keep:

- For a plain line, use Separator. The design file notes that the two overlap and should be merged once the scope is decided.

### Drawer

- Group: Molecules. Category: Overlay. Slug: `drawer`.
- A panel that slides in from the edge of the screen over the page.
- When to use: Filters, details, or a secondary task that keeps the page in context.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `side` | right, left, bottom, or top. |
| 📐 Size | `size` | sm, md, or lg. |
| Title, Description | `title, description` | Same text. |
| Show Close | `onClose` | On DrawerPanel, pass onClose to show the button. |
| Show Button, Button Value | `footer` | Pass your own buttons. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `open` | `boolean` |  |
| `onClose` | `() => void` |  |
| `title` | `string` |  |
| `description` | `string` |  |
| `children` | `ReactNode` |  |
| `footer` | `ReactNode` |  |
| `side` | `"right" \| "left" \| "bottom" \| "top"` | `"right"` |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` |
| `DrawerPanel` | `component` |  |

Rules to respect in the design:

- Do: Close it with Escape, the close button, and a backdrop tap.
- Do: Move focus into the drawer when it opens.
- Don't: Open a drawer from inside a drawer.
- Don't: Put a whole multi-step flow inside it.

Accessibility the design must keep:

- For a critical confirmation in the middle of the screen, use a modal, not a drawer.
- A drawer is only the panel and the scrim. The scrim at 40% is on the screen, as the design notes.

### Dropdown Menu

- Group: Molecules. Category: Action. Slug: `dropdown-menu`.
- A menu of actions or options revealed by a trigger.
- When to use: Reach for it when there are more actions than fit inline.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `variant` | The trigger button's variant. |
| 🖍 Label | `label` | The trigger text. |
| Menu Item · 📐 Size | `size` | sm or md. |
| Menu Item · 🎯 State | `items[].disabled, items[].danger` | Default, Hover (browser), Disabled, Danger. |
| Show Icon Left, Change Icon Left | `icon, items[].icon` | On the trigger and per item. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `items` | `{ label, icon?, onSelect?, danger?, disabled?, separatorBefore? }[]` |  |
| `icon` | `ReactNode` |  |
| `variant` | `"secondary" \| "ghost" \| "primary" \| "inverse"` | `"secondary"` |
| `size` | `"sm" \| "md"` | `"md"` |
| `align` | `"start" \| "end"` | `"start"` |
| `className` | `string` | `""` |

Rules to respect in the design:

- Do: Group related items with dividers.
- Do: Order items by frequency of use.
- Don't: Nest more than one level of submenu.
- Don't: Hide destructive actions among safe ones without separation.

Accessibility the design must keep:

- Use it for actions. For choosing a value in a form, use Select or Combobox.
- Confirm a destructive item before it runs.
- This component draws no focus indicator of its own. On this site a global :focus-visible rule draws a 2px outline in the border/focus role (--color-role-border-focus). Copy the role tokens and that rule, or an equivalent, into your app.

### Empty State

- Group: Molecules. Category: Display. Slug: `empty-state`.
- Communicates that there is no content to show, with a next step.
- When to use: Empty tables, empty search results, and first-run experiences.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 📐 Size | `size` | sm, md, or lg. |
| Scope | `scope` | Search, List, Error, Custom. |
| Show Image | `showImage` | Boolean. |
| Title, Show Description, Description | `title, description` | Same. |
| Show Button, Button Value | `action` | Pass a Button. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` |  |
| `description` | `string` |  |
| `scope` | `"search" \| "list" \| "error" \| "custom"` | `"list"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `icon` | `ReactNode` |  |
| `action` | `ReactNode` |  |
| `showImage` | `boolean` | `true` |

Rules to respect in the design:

- Do: Explain why it's empty and what to do next.
- Do: Include a clear primary action when applicable.
- Don't: Leave a blank screen with no explanation.
- Don't: Use overly technical language.

Accessibility the design must keep:

- Say what happened and what to do next. After a failed load, the action should retry.

### File Input

- Group: Molecules. Category: Form. Slug: `file-input`.
- Lets people choose or drop a file to upload.
- When to use: Documents such as ID cards, receipts, and attachments.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | dropzone, button, or inline. |
| 🎯 State | `error, disabled, progress, dragging` | Hover is the browser. Dragging is a real drag or the prop. Uploading is progress. |
| Title, Description, Button Value, Placeholder | `title, description, buttonLabel, placeholder` | Same text. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `type` | `"dropzone" \| "button" \| "inline"` | `"dropzone"` |
| `title` | `string` | `"Drag files here"` |
| `description` | `string` |  |
| `buttonLabel` | `string` | `"Choose file"` |
| `placeholder` | `string` | `"No file selected"` |
| `accept, multiple` | `string, boolean` |  |
| `progress` | `number` |  |
| `error` | `string` |  |
| `disabled` | `boolean` |  |
| `dragging` | `boolean` |  |
| `onFiles` | `(files: File[]) => void` |  |

Rules to respect in the design:

- Do: State the allowed file types and the size limit before upload.
- Do: Show upload progress and a way to remove the file.
- Don't: Accept a file and reject it only after upload.
- Don't: Rely on drag and drop alone: keep a button.

Accessibility the design must keep:

- Check the type and size in your code too. accept is only a hint for the file picker.
- Show uploaded files with the Document component, below the dropzone.

### Input

- Group: Molecules. Category: Form. Slug: `input`.
- A field for entering short text, numbers, or other data.
- When to use: Single-line text entry in forms.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🖍 Label | `label` | Required in code. |
| 🖊 Show Label | none | No prop. The label is always shown, because a placeholder is not a label. |
| 🩹 Helper Text | `hint, error` | hint is the help line. error is the validation line, and it replaces the hint while it is set. |
| 🩹 Show Helper Text | none | No prop. Pass hint to show the line, or leave it out. |
| 🔤 Placeholder | `placeholder` | The native attribute, passed through ...rest. |
| 🎯 State | `error, disabled` | Error is the error prop and disabled is the native attribute. Hover and focus come from the browser at runtime. |
| 📐 Size | none | No prop yet. Input has one size, at least 44px tall. |
| ☘️ Icon | none | No prop yet. Input has no icon slot. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `hint` | `string` |  |
| `error` | `string` |  |
| `className` | `string` | `""` |
| `...rest` | `InputHTMLAttributes` |  |

Rules to respect in the design:

- Do: Always pair with a visible label.
- Do: Show inline validation errors close to the field.
- Don't: Use placeholder text as a substitute for a label.
- Don't: Disable a field without explaining why.

Accessibility the design must keep:

- On submit, move focus to the first invalid field or to an error summary, because a new error is not announced.
- Mark a required field in the label text, and pass required for the native check. The component has no required indicator.
- Leave aria-describedby alone unless you mean to replace the hint and error link.

### Modal

- Group: Molecules. Category: Overlay. Slug: `modal`.
- A dialog that interrupts the current context to focus the user on a task.
- When to use: Focused tasks, confirmations, and critical information that needs immediate attention.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | confirmation, form, or alert. |
| 📐 Size | `size` | sm to xl. |
| Show Close | `onClose` | On ModalPanel, pass onClose. |
| Title, Show Description, Description | `title, description` | Same. |
| Show Button | `footer` | Pass your buttons. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `open, onClose` | `boolean, () => void` |  |
| `title` | `string` |  |
| `description` | `ReactNode` |  |
| `type` | `"confirmation" \| "form" \| "alert"` | `"confirmation"` |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"sm"` |
| `children` | `ReactNode` |  |
| `footer` | `ReactNode` |  |
| `ModalPanel` | `component` |  |

Rules to respect in the design:

- Do: Provide a clear way to dismiss (close button, escape key, backdrop click).
- Do: Keep content focused on a single task.
- Don't: Stack multiple modals on top of each other.
- Don't: Use for content that could be a regular page or panel.

Accessibility the design must keep:

- One primary action. A destructive one uses the destructive Button and a clear verb, such as Remove.
- For something that is not critical, use a Drawer or the page itself.

### More Menu

- Group: Molecules. Category: Action. Slug: `more-menu`.
- An overflow menu (kebab / ellipsis) for secondary or less-used actions.
- When to use: Houses the actions that don't need to be primary, in table rows, cards, or toolbars.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| Menu Item · 📐 Size | `size` | sm or md. |
| Menu Item · 🎯 State | `disabled, danger` | Default, Hover (browser), Disabled, Danger. |
| Show Icon Left, Change Icon Left | `icon` | Per item. |
| Label | `label` | Per item. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `trigger` | `ReactNode` |  |
| `items` | `{ label, icon?, onSelect?, danger?, disabled?, separatorBefore? }[]` |  |
| `size` | `"sm" \| "md"` | `"md"` |
| `align` | `"start" \| "end"` | `"start"` |
| `MenuList` | `component` |  |

Rules to respect in the design:

- Do: Keep the most common action easy to reach even when hidden here.
- Do: Limit to 3-7 items.
- Don't: Hide the primary action of a row inside this menu.
- Don't: Use for the only action available: just show it directly.

Accessibility the design must keep:

- Use it for actions. For choosing a value in a form, use Select or Combobox.

### Navigation Bar

- Group: Molecules. Category: Navigation. Slug: `navigation-bar`.
- The main app navigation: a top bar on desktop, a bottom bar on mobile.
- When to use: The three to five destinations people switch between most.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| Navigation Bar · Type | none | Two components in code: TopAppBar and BottomNav. |
| Title | `title` | TopAppBar. |
| Nav Item · 🎯 State | `current, disabled` | Active is current. |
| Nav Item · Icon, Label | `icon, label` | Per item. |
| Show Value, Value | `count` | Danger badge. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `TopAppBar title` | `string` |  |
| `TopAppBar titleAs` | `"h1" \| "h2" \| "p"` | `"h1"` |
| `TopAppBar onBack` | `() => void` |  |
| `TopAppBar actions` | `ReactNode` |  |
| `BottomNav items` | `{ label, href, icon, count?, disabled? }[]` |  |
| `BottomNav current` | `string` |  |
| `BottomNav label` | `string` | `"Main"` |

Rules to respect in the design:

- Do: Pair every icon with a text label.
- Do: Mark the current destination with more than color.
- Don't: Put more than five items in a bottom bar.
- Don't: Use the bar for actions: it is for destinations.

Accessibility the design must keep:

- Keep 3 to 5 items. Do not hide the label; an icon alone is not enough.

### Pagination

- Group: Molecules. Category: Navigation. Slug: `pagination`.
- Splits large sets of content across multiple pages.
- When to use: Tables and lists with many items.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | number, arrow, or loadMore. |
| 📐 Size | `size` | sm or md. |
| 🎯 State | `page` | Active is the current page. Disabled is the first and last arrow. |
| Label | none | Page x of y is computed from page and pageCount. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `page` | `number` |  |
| `pageCount` | `number` |  |
| `onPageChange` | `(page) => void` |  |
| `type` | `"number" \| "arrow" \| "loadMore"` | `"number"` |
| `size` | `"sm" \| "md"` | `"md"` |
| `loadMoreLabel` | `string` | `"Load more"` |

Rules to respect in the design:

- Do: Show the current page and total clearly.
- Do: Consider infinite scroll for casual browsing contexts instead.
- Don't: Hide how many pages/items exist in total.
- Don't: Reset scroll position unexpectedly on page change.

Accessibility the design must keep:

- At 32px the sm item is under the 44px target size the rest of this system uses. Prefer md on touch screens.
- Update the content and move focus to it when the page changes.

### Progress Bar

- Group: Molecules. Category: Feedback. Slug: `progress-bar`.
- Shows how much of a task is complete.
- When to use: Uploads, processing, and any wait long enough to need a sense of progress.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | linear or circular. |
| 🔀 Mode | `mode` | determinate or indeterminate. |
| 🎨 Tone | `tone` | primary, success, warning, or danger. |
| Show Label, Label | `showLabel, label` | Same. |
| Show Value, Value | `showValue, value` | The percent is computed from value. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `value` | `number` | `0` |
| `type` | `"linear" \| "circular"` | `"linear"` |
| `mode` | `"determinate" \| "indeterminate"` | `"determinate"` |
| `tone` | `"primary" \| "success" \| "warning" \| "danger"` | `"primary"` |
| `showLabel, showValue` | `boolean` | `true` |

Rules to respect in the design:

- Do: Show the percentage or remaining amount in text.
- Do: Use a determinate bar whenever the total is known.
- Don't: Fake progress that is not tied to real work.
- Don't: Use for waits under a second.

Accessibility the design must keep:

- Do not rely on color for failure. Change the label when the tone changes, such as Upload failed.
- The motion stops for people who ask for reduced motion, and the bar shows a still segment.

### QR Code Display

- Group: Molecules. Category: Display. Slug: `qr-code`.
- A scannable code with its amount, recipient, and expiry.
- When to use: QRIS payments, check-in, and sharing an account.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | static or dynamic. |
| 📐 Size | `size` | sm, md, or lg. |
| Show Label, Label | `label` | Same. |
| Show Value, Value | `value` | Same. |
| Show Button, Button Value | `onSave, saveLabel` | Pass to show. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `qr` | `ReactNode` |  |
| `label` | `string` |  |
| `value` | `string` |  |
| `expiry` | `string` |  |
| `type` | `"static" \| "dynamic"` | `"static"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `onSave, saveLabel` | `() => void, string` |  |

Rules to respect in the design:

- Do: Keep a quiet zone around the code and a white background.
- Do: Show who is being paid next to the code.
- Don't: Place the code on a colored or dark background.
- Don't: Crop or stretch the code to fit a layout.

Accessibility the design must keep:

- The placeholder pattern is illustrative and not scannable. Always render the real QR from the backend.
- Do not announce the countdown every second.

### Radio Group

- Group: Molecules. Category: Form. Slug: `radio-group`.
- A labelled set of radio buttons for choosing one option.
- When to use: Two to six options that people should see all at once.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `orientation` | vertical or horizontal. |
| 🔀 Count | `options` | 2 to 5 Item is the length of options. |
| 🎯 State | `error, disabled` | Default, error, or disabled. |
| Label, Helper Text | `label, hint` | The legend and the line below. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `options` | `{ value, label }[]` |  |
| `value, onChange` | `string, (value) => void` |  |
| `defaultValue` | `string` |  |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `hint, error` | `string` |  |
| `disabled` | `boolean` |  |
| `name` | `string` |  |

Rules to respect in the design:

- Do: Wrap the set in a fieldset with a legend.
- Do: Pre-select the safest option when a default is needed.
- Don't: Use for more than about six options: use a select.
- Don't: Leave the group without a legend.

Accessibility the design must keep:

- Keep a choice selected by default when one is safe. A radio group cannot be cleared by the user.
- For one on/off choice, use a checkbox or a toggle.

### Rating

- Group: Molecules. Category: Form. Slug: `rating`.
- Collects or shows a score on a fixed scale, usually five stars.
- When to use: Reviews and short satisfaction questions.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | star, heart, or number. |
| 🎯 State | `disabled` | Default or disabled. |
| 🔢 Score | `score` | 1 to 5. |
| Show Value, Value | `showValue, value` | The text after the icons. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `score` | `1 \| 2 \| 3 \| 4 \| 5` |  |
| `type` | `"star" \| "heart" \| "number"` | `"star"` |
| `value` | `string` |  |
| `showValue` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |

Rules to respect in the design:

- Do: Label the ends of the scale.
- Do: Show the score as text for screen readers.
- Don't: Use a rating where a yes/no answer is enough.
- Don't: Show an average without the number of ratings.

Accessibility the design must keep:

- For a control that collects a rating, build it from a radio group. This component does not.

### Search

- Group: Molecules. Category: Form. Slug: `search`.
- A field for finding content by keyword.
- When to use: The top of long lists and the header of content-heavy apps.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | basic, withButton, or inline. |
| 🎯 State | `value, error, disabled` | Filled is any text, which also shows the clear button. Hover and focus come from the browser. |
| Placeholder | `placeholder` | Native attribute. |
| Show Icon Left | `showIcon` | Boolean. |
| Button Value | `buttonLabel` | With Button only. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `type` | `"basic" \| "withButton" \| "inline"` | `"basic"` |
| `value, onValueChange` | `string, (value) => void` |  |
| `onSearch` | `(value) => void` |  |
| `error` | `string` |  |
| `buttonLabel` | `string` | `"Search"` |
| `showIcon` | `boolean` | `true` |
| `...rest` | `InputHTMLAttributes` |  |

Rules to respect in the design:

- Do: Say what can be searched in the placeholder.
- Do: Show a clear empty state when nothing matches.
- Don't: Hide search behind an icon when it is the main task.
- Don't: Search on every keystroke against a slow server without debouncing.

Accessibility the design must keep:

- Announce the number of results when they change, for example in a live region.

### Skeleton

- Group: Molecules. Category: Feedback. Slug: `skeleton`.
- A grey placeholder in the shape of content that is still loading.
- When to use: Stands in while the first load of a list or card is in progress.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | text, title, avatar, image, or card. |
| 💡 Animation | `animation` | static, pulse, or wave. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `type` | `"text" \| "title" \| "avatar" \| "image" \| "card"` | `"text"` |
| `animation` | `"static" \| "pulse" \| "wave"` | `"pulse"` |
| `lines` | `number` | `3` |

Rules to respect in the design:

- Do: Match the skeleton to the real layout it replaces.
- Do: Announce loading to screen readers.
- Don't: Keep a skeleton on screen after an error: show the error state.
- Don't: Animate it so strongly it draws the eye.

Accessibility the design must keep:

- Set aria-busy on the region that is loading, and say when it is done.
- Shape the placeholder like the real content, so the page does not jump.
- Pulse and wave stop for people who ask for reduced motion.

### Status

- Group: Molecules. Category: Display. Slug: `status`.
- Shows the state of a record, such as a payment or request, with color and text.
- When to use: Lists and detail pages where the user needs to know what state an item is in.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | pill, inline, or dot. |
| 📐 Size | `size` | sm or md. |
| 🎯 Status | `status` | Same six values. Success is Successful in the text. |
| 📅 Show Timestamp, Timestamp | `timestamp` | Pass timestamp to show it. Inline only. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `status` | `"pending" \| "processing" \| "success" \| "failed" \| "expired" \| "refunded"` |  |
| `type` | `"pill" \| "inline" \| "dot"` | `"pill"` |
| `size` | `"sm" \| "md"` | `"md"` |
| `timestamp` | `ReactNode` |  |

Rules to respect in the design:

- Do: Map each state to one color and keep it the same across the product.
- Do: Always include the state name in text.
- Don't: Rely on color alone.
- Don't: Invent a new color for a state that already has one.

Accessibility the design must keep:

- Format the timestamp for the user's locale before you pass it.
- A status that changes while the user is on the page is not announced. Use a live region if they need to hear it.

### Stepper

- Group: Molecules. Category: Navigation. Slug: `stepper`.
- Shows progress through a task split into ordered steps.
- When to use: Multi-step flows such as onboarding, KYC, or checkout.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | horizontal or vertical. |
| 🔀 Count | `steps` | 3, 4, or 5 Step is the length of steps. |
| 🎯 State | `current, errorAt, disabled` | Completed, active, and default come from current. Error and disabled are explicit. |
| Title, Description | `title, description` | Per step. |
| Show Connector | none | No prop. The connector shows between steps and not after the last one. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `steps` | `{ title, description?, disabled? }[]` |  |
| `current` | `number` |  |
| `errorAt` | `number` |  |
| `type` | `"horizontal" \| "vertical"` | `"horizontal"` |

Rules to respect in the design:

- Do: Name each step, not just number it.
- Do: Mark completed, current, and upcoming steps differently.
- Don't: Use for content that can be read in any order: use tabs.
- Don't: Show more steps than fit on a phone screen.

Accessibility the design must keep:

- Buttons that move between steps belong to your flow. Move focus to the new step heading when it changes.
- Say what is wrong in an error step, as the description does.

### Table

- Group: Molecules. Category: Display. Slug: `table`.
- Rows and columns for comparing many records at once.
- When to use: Built for scanning, sorting, and comparing records. Put the deciding column first.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| Table Cell · Type | `columns` | Header cells come from columns, body cells from rows. |
| 🧰 Type | `type` | basic, striped, or bordered. |
| 📐 Size | `size` | sm, md, or lg. |
| Stroke | `stroke` | Boolean. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `caption` | `string` |  |
| `showCaption` | `boolean` | `false` |
| `columns` | `{ key, header, align? }[]` |  |
| `rows` | `Record<string, ReactNode>[]` |  |
| `type` | `"basic" \| "striped" \| "bordered"` | `"basic"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `stroke` | `boolean` | `true` |
| `selectedRow` | `number` |  |

Rules to respect in the design:

- Do: Right-align numbers so they line up.
- Do: Show an empty state and a loading state for the table body.
- Don't: Add columns because the component supports them.
- Don't: Hide horizontal scroll on mobile: let the table scroll inside its container.

Accessibility the design must keep:

- Put an action in a row as a real button or link, with a name that says which row it acts on.

### Tabs

- Group: Molecules. Category: Navigation. Slug: `tabs`.
- Organizes content into separate views within the same context.
- When to use: Switches between related views without leaving the page.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | underline, pill, or segmented. |
| 📐 Size | `size` | sm, md, or lg. |
| 🎯 State | `disabled` | Active is the selection. Hover is the browser. Disabled is on the item. |
| Label, Show Value, Value | `label, value` | Text and the count. |
| Show Icon Left | `icon` | Pass an icon element. |
| 🔀 Count | `items` | 2 to 5 Tab is the length of items. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `items` | `TabItem[]` |  |
| `type` | `"underline" \| "pill" \| "segmented"` | `"underline"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `value, onChange` | `string, (id) => void` |  |
| `defaultValue` | `string` |  |

Rules to respect in the design:

- Do: Keep tab labels short and parallel in structure.
- Do: Keep it to five tabs or fewer. More than that wraps on a 360px screen.
- Don't: Use tabs for steps that must happen in order. That is a Stepper.
- Don't: Hide critical information behind a non-default tab.

Accessibility the design must keep:

- Give each tab a short label. A long label wraps and breaks the row.
- Pass content on the items, or render the panel yourself with the same ids.

### Toast

- Group: Molecules. Category: Feedback. Slug: `toast`.
- A brief, temporary notification that appears and disappears automatically.
- When to use: Confirms the result of an action, like saving or sending.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `type` | solid or subtle. |
| 📐 Size | `size` | sm or md. |
| 🎨 Tone | `tone` | info, success, warning, or danger. |
| Show Icon Left | none | No prop. The icon is always shown, locked per tone. |
| Title, Description | `title, description` | Pass description to show the second line. |
| Show Button, Button Value | `actionLabel, onAction` | Both together. |
| Show Close | `onClose` | Pass onClose to show the button. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` |  |
| `description` | `string` |  |
| `tone` | `"info" \| "success" \| "warning" \| "danger"` | `"info"` |
| `type` | `"solid" \| "subtle"` | `"subtle"` |
| `size` | `"sm" \| "md"` | `"md"` |
| `actionLabel, onAction` | `string, () => void` |  |
| `onClose` | `() => void` |  |

Rules to respect in the design:

- Do: Keep it on screen until the reader dismisses it, or let them turn auto-dismiss off (WCAG 2.2.3 No Timing).
- Do: Keep the message short and specific to what just happened.
- Don't: Use for critical errors that require action: use an alert or modal instead.
- Don't: Stack too many toasts at once.

Accessibility the design must keep:

- Show, stack, and dismiss toasts in your app. This component is only the toast.
- Auto-dismiss after 5 seconds, or 8 with an action. Danger never auto-dismisses: the user must acknowledge an error.
- Give the user enough time to reach the action before it goes.

### Tooltip

- Group: Molecules. Category: Overlay. Slug: `tooltip`.
- A small popup that shows brief, supplementary information on hover or focus.
- When to use: Clarifies icon-only buttons or gives extra context.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 📐 Size | `size` | sm or md. |
| 🧰 Type | `placement` | Top, Bottom, Left, Right. |
| 🔺 Show Arrow | `arrow` | Boolean. |
| Title, Show Description, Description | `title, description` | Same text. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` |  |
| `description` | `string` |  |
| `placement` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` |
| `size` | `"sm" \| "md"` | `"md"` |
| `arrow` | `boolean` | `true` |
| `children` | `ReactNode` |  |
| `TooltipBubble` | `component` |  |

Rules to respect in the design:

- Do: Keep the text short: a phrase, not a paragraph.
- Do: Ensure it's accessible via keyboard focus, not just hover.
- Don't: Put essential information only in a tooltip.
- Don't: Use for content that requires interaction: use a popover instead.

Accessibility the design must keep:

- Put nothing in a tooltip that the user needs to finish a task; it is a hint.
- The bubble stays while the pointer is over it, so it can be read and copied (WCAG 1.4.13).
- Do not put links or buttons in a tooltip. Use a popover or a Modal instead.

### Transaction List Item

- Group: Molecules. Category: Display. Slug: `transaction-list-item`.
- One row in a transaction history: counterparty, time, and signed amount.
- When to use: Account history, wallet activity, and payment lists.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🎨 Tone | `tone` | Neutral, Success, Danger. |
| 🎯 State | `href` | Hover and Pressed need a link row. |
| Icon | `icon` | Pass an icon. |
| Title, Label, Timestamp, Value | `title, label, timestamp, amount` | Same text. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` |  |
| `timestamp` | `string` |  |
| `amount` | `string` |  |
| `tone` | `"neutral" \| "success" \| "danger"` | `"neutral"` |
| `label` | `string` |  |
| `icon` | `ReactNode` |  |
| `href` | `string` |  |

Rules to respect in the design:

- Do: Show money out and money in with both a sign and color.
- Do: Format amounts in the user's currency and locale.
- Don't: Use color alone to show direction.
- Don't: Round amounts in a history list.

Accessibility the design must keep:

- Do not rely on green and red alone: the sign and the spoken direction carry the meaning.

### Button Group

- Group: n/a. Category: Action. Slug: `button-group`.
- A set of related buttons, visually grouped together as a single control.
- When to use: Segmented choices such as view toggles (grid/list) or grouped filters.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 📐 Size | `size` | md and lg. |
| 🎯 State | `value, options[].disabled` | Selected is the chosen value. Hover and focus come from the browser. |
| 🖍 Label | `options[].label` | Per segment. |
| ☘️ Icon | `options[].icon, options[].iconOnly` | Per segment. Icon-only keeps the label as the accessible name. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `options` | `{ value, label, icon?, iconOnly?, disabled? }[]` |  |
| `value` | `string` |  |
| `defaultValue` | `string` | `first enabled option` |
| `onChange` | `(value: string) => void` |  |
| `size` | `"md" \| "lg"` | `"md"` |
| `fullWidth` | `boolean` | `false` |
| `className` | `string` | `""` |

Rules to respect in the design:

- Do: Keep labels short so groups stay compact.
- Do: Use for mutually exclusive choices.
- Don't: Mix unrelated actions in a single group.
- Don't: Put more than four options in one group. Two to four reads at a glance.

Accessibility the design must keep:

- Show the result of the choice, such as switching the view, right away. A segment is a choice, not a submit.
- Use Tabs instead when each choice shows a different panel of content.
- This component draws no focus indicator of its own. On this site a global :focus-visible rule draws a 2px outline in the border/focus role (--color-role-border-focus). Copy the role tokens and that rule, or an equivalent, into your app.

### Code Block

- Group: n/a. Category: Display. Slug: `code-block`.
- Shows read-only code with a copy button, in plain text that keeps 7:1 contrast in light and dark.
- When to use: Documentation and usage examples.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🖍 Label | `title, language` | The header text. |
| 🎯 State | none | Copied is shown for two seconds after a copy. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `code` | `string` |  |
| `language` | `string` |  |
| `title` | `string` |  |
| `showLineNumbers` | `boolean` | `false` |
| `wrap` | `boolean` | `false` |
| `copyable` | `boolean` | `true` |
| `className` | `string` | `""` |

Rules to respect in the design:

- Do: Include a copy button.
- Do: Keep line length reasonable, wrap when needed.
- Don't: Use for non-code content.
- Don't: Omit language context when it aids readability.

Accessibility the design must keep:

- Keep the code short enough to read. Link to the full file for anything long.
- Plain text only: there are no syntax colors, so meaning must not depend on color.

### Icon Button

- Group: n/a. Category: Action. Slug: `icon-button`.
- A compact button that uses only an icon to represent its action.
- When to use: Toolbars and dense UI, where a label would take too much space.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 🧰 Type | `variant` | Same values as Button. |
| 📐 Size | `size` | md and lg. |
| 🎯 State | `disabled, loading` | Hover, focus, and pressed come from the browser. |
| ☘️ Icon | `icon` | Any Phosphor icon, 18 at md and 20 at lg. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `icon` | `ReactNode` |  |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "destructive" \| "inverse"` | `"ghost"` |
| `size` | `"md" \| "lg"` | `"md"` |
| `shape` | `"square" \| "circle"` | `"square"` |
| `loading` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `...rest` | `ButtonHTMLAttributes` |  |

Rules to respect in the design:

- Do: Always pair with an accessible label / tooltip.
- Do: Use recognizable, standard icons.
- Don't: Use for critical or destructive actions without confirmation.
- Don't: Use ambiguous or custom icons without a label.

Accessibility the design must keep:

- Write a label that names the action, such as "Delete transaction", not the icon, such as "Trash".
- Wrap it in a Tooltip when the icon is not universally known, so sighted users get the name too.
- Keep the label the same for a toggle and use aria-pressed for the state.

### Link

- Group: n/a. Category: Navigation. Slug: `link`.
- Navigates the user to another page, section, or resource.
- When to use: Links navigate. When the interaction triggers an action instead, use a button.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 📐 Size | `size` | sm and md. |
| 🧰 Type | `standalone` | Inline or standalone. |
| 🎯 State | none | No prop. Hover and focus come from the browser. |
| ▶️ Show Icon Right, 🖼 Change Icon Right | `external` | The arrow for a link that leaves the site. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `href` | `string` |  |
| `children` | `ReactNode` |  |
| `size` | `"sm" \| "md"` | `"md"` |
| `standalone` | `boolean` | `false` |
| `external` | `boolean` | `false` |
| `as` | `ElementType` | `"a"` |
| `...rest` | `AnchorHTMLAttributes` |  |

Rules to respect in the design:

- Do: Underline or clearly distinguish inline links from body text.
- Do: Use descriptive link text.
- Don't: Use "click here" as link text.
- Don't: Style a link to look like a button if it performs an action.

Accessibility the design must keep:

- Write link text that says where it goes. "Click here" and "Read more" mean nothing in a list of links.
- Use Button for actions that stay on the page. Use buttonStyles() when a link must look like a button.
- Keep inline links underlined; color alone does not mark them for people who cannot see the color.

### Select

- Group: n/a. Category: Form. Slug: `select`.
- Lets users choose one option from a list in a dropdown.
- When to use: Many options in little space.

Figma properties to create:

| Figma property | React prop | Note |
| --- | --- | --- |
| 📐 Size | `size` | md and lg. |
| 🎯 State | `disabled, error` | Hover and focus come from the browser. The open list is the platform's own. |
| 🖍 Label | `label` | Always visible. |
| 🔤 Placeholder | `placeholder` | The empty first option. |
| 🩹 Show Helper Text, Helper Text | `hint, error` | Error replaces the hint. |

React props (values for variant properties come from these types):

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `options` | `{ value, label, disabled? }[]` |  |
| `placeholder` | `string` |  |
| `hint` | `string` |  |
| `error` | `string` |  |
| `size` | `"md" \| "lg"` | `"md"` |
| `disabled` | `boolean` | `false` |
| `...rest` | `SelectHTMLAttributes` |  |

Rules to respect in the design:

- Do: Sort long lists logically (alphabetical, frequency).
- Do: Support search/filter for long lists.
- Don't: Use for fewer than 3 options: consider a button group or radio instead.
- Don't: Pre-select an option that could cause harm if unnoticed.

Accessibility the design must keep:

- Use Combobox when the list is long enough that people would want to type to filter it, such as banks.
- Use a Radio group for two to four options, so all of them are visible.
- Pass required when a choice is needed; the placeholder alone does not block an empty submit.

## 6. In the tracker but no React code yet

These have a Figma design but no entry above: Artboard, Guideline, Document. Build them from the Figma file, not from this spec.

## 7. Instructions for Claude

1. Ask which Figma file the plugin targets and whether the Natuna library file already contains the variables. If it does, the plugin should only read them, not recreate them.
2. Write the plugin in TypeScript for the Figma Plugin API (`editorType: ["figma"]`, `documentAccess: "dynamic-page"`). Provide `manifest.json`, `code.ts`, `ui.html`, `tsconfig.json`, and `package.json` with `@figma/plugin-typings`.
3. Structure: `variables.ts` (collections and modes), `styles.ts` (text and effect styles), one builder per component under `components/`, and a small `helpers.ts` (auto layout frame, bind fill to variable, create variant set).
4. Use `figma.variables.createVariableCollection`, `addMode`, `createVariable`, `setValueForMode` with `{ type: "VARIABLE_ALIAS" }` for roles, and `figma.variables.setBoundVariableForPaint` for fills and strokes.
5. Build variant sets with `figma.combineAsVariants`, then name each variant `Property=Value, Property=Value` using the exact property names from section 3 and the values from the component's React types. Add boolean, text and instance-swap component properties with `addComponentProperty`.
6. Build a few components first (Button, Input Field, Badge), show the result, then continue. Do not generate all components in one reply; split by group.
7. Never invent a property name, hex value, or variant value. If this file does not say it, ask.
