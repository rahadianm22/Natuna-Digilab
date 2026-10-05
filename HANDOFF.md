# Handoff

State of the `redesign-docs-site` branch, written so the next session can pick it up without context.

## Status

- Code lives at `https://github.com/rahadianm22/Natuna-Digilab` (git remote `personal`).
- Branch `main` there deploys to production on Vercel: https://natunadigilab.vercel.app/. Other branches get a
  preview URL. To ship: `git push personal redesign-docs-site:main`.
- Checks pass: `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `npm run test:e2e` (36 tests, including
  axe WCAG AA and AAA in light and dark, phone layout, and the Copy to Figma export).
- If git says "dubious ownership", run `git config --global --add safe.directory "F:/ALLL/=== Test Project/natuna-digilab"`.
- If a commit fails with "Author identity unknown", set `user.name` and `user.email` for this repo.
## Run and test

```bash
npm install
npm run dev          # http://localhost:3000
npm run test:e2e     # uses the installed Microsoft Edge locally
```

## Where things are

- Home: `src/app/page.tsx` with its sections in `src/components/home/`
  (`LiveSpecimen`, `Anatomy`, `BuildGrid`, `LayersDemo`)
- Copy to Figma: `src/lib/dom-to-svg.ts` and `src/components/FigmaFrame.tsx`
- Tokens: `src/app/globals.css` (light and dark), raw palette in `src/lib/natuna-palette.ts`
- Component status: `src/lib/natuna-tracker.ts` (snapshot of the Notion tracker; update `TRACKER_SNAPSHOT`
  in `src/lib/site.ts` when you refresh it)
- Design reviews and their fixes: `anti-slop/audit-00N-*.md` and `*-report.md`

## Next, in order of value

1. Test a real paste of Copy to Figma into a Figma file. Only the SVG output has been verified so far.
2. Build the next components in `src/ui` by tracker build day: Checkbox and Radio Button (day 1), Badge is done,
   Label Text (day 2). Add each to `src/lib/component-docs.ts` and `src/components/demos.tsx`.
3. Generate `globals.css`, the Themes table, and the Foundation page from one token file, so they cannot drift.

## Notes for the next session

- This Next.js version differs from older ones; read `node_modules/next/dist/docs/` before changing framework
  code (see `AGENTS.md`).
- House rules from the design reviews: no em dashes, no invented numbers, no decorative gradients or glows,
  44px tap targets on phones, WCAG AAA contrast (7:1 for text; the axe tests enforce it), motion that respects reduced motion.
- Site copy is English and does not mention a region. Demo content (Rp amounts, sample names) is deliberate.
