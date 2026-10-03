# Handoff

State of the `redesign-docs-site` branch, written so the next session can pick it up without context.

## Status

- All work is committed on `redesign-docs-site`. **It is not pushed yet.**
- Checks pass: `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `npm run test:e2e` (34 tests, including
  axe WCAG 2.1 AA in light and dark, phone layout at 390px, and the Copy to Figma export).

## To push (one-time setup on this machine)

The remote uses an SSH alias, `git@github-natuna:natunadigilab/WebsiteNatunaDigilab.git`. The Windows
user that created the repo has that alias; the user `RM22` does not. Pick one:

1. Push from the Windows account that owns the repo: `git push -u origin redesign-docs-site`
2. Or, in `C:\Users\RM22\.ssh\config`, add the alias with a key registered on the `natunadigilab` GitHub account:

   ```
   Host github-natuna
     HostName github.com
     User git
     IdentityFile ~/.ssh/<your-key>
   ```

   Then run `git push -u origin redesign-docs-site`.

If git says "dubious ownership", run commands with
`git -c safe.directory="F:/ALLL/=== Test Project/natuna-digilab" ...`, or add that path once with
`git config --global --add safe.directory "F:/ALLL/=== Test Project/natuna-digilab"`.

After pushing, open a pull request into `main`. CI (`.github/workflows/ci.yml`) runs lint, types, build, and
the Playwright suite on it.

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
4. Deploy to Vercel (works without configuration; see README).

## Notes for the next session

- This Next.js version differs from older ones; read `node_modules/next/dist/docs/` before changing framework
  code (see `AGENTS.md`).
- House rules from the design reviews: no em dashes, no invented numbers, no decorative gradients or glows,
  44px tap targets on phones, AA contrast, motion that respects reduced motion.
- Site copy is English and does not mention a region. Demo content (Rp amounts, sample names) is deliberate.
