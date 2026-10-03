# Natuna Digilab

Documentation site for the **Natuna Digilab design system**: foundations, components, and usage guidance for digital products such as banking, payments, and everyday consumer apps.

The site is built from the [Foundation Design System v1.0](https://www.figma.com/community/file/1660946308636540525/natuna-digilab-foundation-design-system) in Figma. Build status for every component comes from the Natuna component tracker, so the site never claims a component is ready before it is.

## What is on the site

| Page | What it covers |
| --- | --- |
| Home | A live transfer screen with its tokens annotated, where the build stands, and the components that are ready |
| Introduction | What the system contains, how status works, how to contribute |
| Foundation | Eight color ramps with contrast ratios, the responsive Urbanist type scale, the number scale and its variables, radius, device frames, shadow and background blur |
| Components | 51 components on the build plan plus 5 pages not yet in the tracker, each with status, preview, usage rules, and do and don't |
| Themes | Light and dark mode shown side by side on the same component |

Components that exist as React code (Button, Badge, Input, Avatar, Accordion) also have a live demo, the same code in TypeScript and JavaScript with its imports and a copy button, and a props table. The rest are design-only for now and say so.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Press `Ctrl K` to search components, pages, and tokens (by name, class, hex, or Figma variable).

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright tests (see below) |

## Project structure

- `src/app`: pages (Home, Introduction, Foundation, Components, Themes, Privacy), sitemap, robots, share image
- `src/ui`: the React components themselves. Not published to npm yet
- `src/components`: site UI (Header, Footer, sidebar, search, previews, example tabs)
- `src/lib/components-data.ts`: usage guidance for every component
- `src/lib/component-docs.ts`: props tables and code examples for the components in `src/ui`
- `src/lib/natuna-tracker.ts`: snapshot of the Notion component tracker, the source of truth for status
- `src/lib/natuna-palette.ts`: raw Foundation palette values
- `e2e`: Playwright tests
- `anti-slop`: design audits and their follow-up reports

## Component status

Status comes from the tracker snapshot. To update it, re-run the Notion query, replace the rows in `src/lib/natuna-tracker.ts`, and update `TRACKER_SNAPSHOT` in `src/lib/site.ts`.

| Tracker | Shown as |
| --- | --- |
| Selesai | Ready |
| On Review | In review |
| OnProgress | In progress |
| Belum | Planned |

## Tests

```bash
npm run test:e2e
```

Runs 33 tests against http://localhost:3000 (starts `npm run dev` if nothing is running) in the installed Microsoft Edge: navigation, theme toggle, the hero transfer flow, tabs and copy, fixed-width loading buttons, the Copy to Figma export, sidebar, search, phone layout at 390px with no horizontal overflow, and axe WCAG 2.1 AA scans of every page in light and dark mode.

Set `PLAYWRIGHT_BASE_URL` to test another address, or `PLAYWRIGHT_CHANNEL=chrome` to use Chrome.

## Deploying

The site is a standard Next.js app and deploys to Vercel without extra configuration. On Vercel the production domain is picked up automatically for the sitemap and share image. Set `NEXT_PUBLIC_SITE_URL` to override it, for example when using a custom domain.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Phosphor Icons, Urbanist, IBM Plex Mono for code.
