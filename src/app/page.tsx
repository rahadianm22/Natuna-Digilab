import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComponentPreview from "@/components/ComponentPreview";
import CodeBlock from "@/components/CodeBlock";
import Demo from "@/components/demos";
import type { CSSProperties } from "react";
import HeroPhone from "@/components/home/HeroPhone";
import Reveal from "@/components/home/Reveal";
import { Badge, buttonStyles } from "@/ui";
import { getComponent } from "@/lib/components-data";
import { componentDocs, fullUsage } from "@/lib/component-docs";
import { palettes } from "@/lib/natuna-palette";
import { lastBuildDay, statusLabel, statusOrder, tracker, type TrackerStatus } from "@/lib/natuna-tracker";
import { FIGMA_COMMUNITY_URL, TRACKER_SNAPSHOT } from "@/lib/site";

const counts = Object.fromEntries(
  statusOrder.map((s) => [s, tracker.filter((t) => t.status === s).length]),
) as Record<TrackerStatus, number>;

const barTone: Record<TrackerStatus, string> = {
  Selesai: "bg-emerald-600",
  "On Review": "bg-blue-600",
  OnProgress: "bg-amber-500",
  Belum: "bg-gray-300",
};

// Figma documentation frames (Guideline, Artboard, and so on) are page templates, not product UI.
const ready = tracker
  .filter((t) => t.status === "Selesai" && t.slug)
  .map((t) => getComponent(t.slug!))
  .filter((c) => c !== undefined && c.category !== "Documentation")
  .map((c) => c!);

const colorTokens = palettes.reduce((n, p) => n + p.steps.length, 0);
// sm, md, xl, 2xl, 3xl and full, as listed on the Foundation page.
const RADII = 6;

// One size for every section heading on the page; the h1 alone uses the display size.
const h2 = "text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl";

const azure = palettes.find((p) => p.token === "blue")!;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="" />

      <main id="main" tabIndex={-1} className="w-full overflow-x-clip">
        <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-12 pt-14 sm:pb-16 sm:pt-20 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-10">
          <div className="min-w-0">
            <h1 className="display rise max-w-xl font-extrabold text-gray-900">
              Design for how Indonesia pays, signs in, and gets things done.
            </h1>
            <p className="rise mt-7 max-w-lg text-lg leading-relaxed text-gray-600 sm:text-xl" style={{ "--d": "90ms" } as CSSProperties}>
              Natuna Digilab is a design system of foundations, components, and usage rules for Indonesian
              digital products. Version 0.1, in beta.
            </p>
            <div className="rise mt-10 flex flex-wrap items-center gap-3" style={{ "--d": "180ms" } as CSSProperties}>
              <Link href="/components" className={`${buttonStyles({ size: "lg" })} w-full sm:w-auto`}>
                Browse the components
              </Link>
              <Link href="/docs" className={`${buttonStyles({ variant: "ghost", size: "lg" })} w-full sm:w-auto`}>
                Read the introduction
              </Link>
            </div>
            <a
              href={FIGMA_COMMUNITY_URL}
              target="_blank"
              rel="noreferrer"
              className="rise mt-5 inline-flex min-h-11 items-center text-sm font-medium text-blue-700 underline-offset-4 hover:underline"
              style={{ "--d": "240ms" } as CSSProperties}
            >
              Open the Figma library on Figma Community
            </a>
          </div>

          <figure className="min-w-0">
            <HeroPhone />
            <figcaption className="mx-auto mt-4 max-w-sm text-center text-xs text-gray-600">
              A working screen built from Avatar, Input, Button, and Badge in src/ui. Try sending more than the
              balance.
            </figcaption>
          </figure>
        </section>

        <Reveal>
          <section aria-labelledby="foundation" className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 sm:py-24 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div className="min-w-0">
              <h2 id="foundation" className={h2}>
                Tokens from the Figma foundation
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-600">
                {colorTokens} color tokens in 8 ramps, seven text styles, a number scale, {RADII} radii, and four
                shadows, all from the Foundation Design System in Figma. Change a token and every component that
                uses it follows, in both modes.
              </p>
              <Link href="/foundation" className={`${buttonStyles({ variant: "ghost", size: "lg" })} mt-8 w-full sm:w-auto`}>
                Explore the foundation
              </Link>
            </div>
            <div className="min-w-0 space-y-6">
              <div className="flex h-24 overflow-hidden rounded-2xl" role="img" aria-label="Azure Blue ramp, steps 50 to 950">
                {azure.steps.map((s) => (
                  <span key={s.step} className="flex-1" style={{ background: s.hex }} />
                ))}
              </div>
              <div className="grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-surface p-6 sm:grid-cols-[auto_1fr] sm:items-end">
                <span className="text-7xl font-extrabold leading-none tracking-tight text-gray-900 sm:text-8xl" aria-hidden="true">Aa</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900">Urbanist</div>
                  <div className="mt-1 text-sm text-gray-600">Header 1 to Caption 2: seven styles, 24 to 10px on phones and 32 to 12px on desktop.</div>
                  <div className="mt-4 flex flex-wrap items-end gap-3" aria-hidden="true">
                    {["rounded-sm", "rounded-md", "rounded-xl", "rounded-2xl", "rounded-full"].map((r) => (
                      <span key={r} className={`h-10 w-10 border-2 border-blue-600 bg-blue-50 ${r}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section aria-labelledby="code" className="border-y border-gray-200 bg-surface">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
              <div className="lg:order-2">
                <h2 id="code" className={h2}>
                  Live demos with the code that runs them
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-600">
                  Components that exist in code have a live demo next to the exact code that runs it, in TypeScript
                  or JavaScript. Every preview can also be copied into Figma as editable layers.
                </p>
                <Link href="/components/button" className={`${buttonStyles({ variant: "ghost", size: "lg" })} mt-8 w-full sm:w-auto`}>
                  Open the Button page
                </Link>
              </div>
              <div className="min-w-0 space-y-3">
                <div className="rounded-xl border border-gray-200 bg-canvas px-6 py-10">
                  <Demo slug="button" />
                </div>
                <CodeBlock code={fullUsage(componentDocs.button)} label="Button usage" collapseAfter={12} />
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section aria-labelledby="progress" className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 sm:py-24 md:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 id="progress" className={h2}>Where the build stands</h2>
              <p className="mt-4 max-w-sm leading-relaxed text-gray-600">
                {counts.Selesai} of {tracker.length} components are ready. The rest are scheduled across{" "}
                {lastBuildDay()} build days in the component tracker. Snapshot of {TRACKER_SNAPSHOT}.
              </p>
            </div>
            <div>
              <div
                className="flex h-4 overflow-hidden rounded-full bg-gray-100"
                role="img"
                aria-label={statusOrder.map((s) => `${counts[s]} ${statusLabel[s]}`).join(", ")}
              >
                {statusOrder.map((s) =>
                  counts[s] ? <span key={s} className={barTone[s]} style={{ width: `${(counts[s] / tracker.length) * 100}%` }} /> : null,
                )}
              </div>
              {/* Only statuses that hold components; an empty cell the size of a real number is noise. */}
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
                {statusOrder.filter((s) => counts[s] > 0).map((s) => (
                  <div key={s}>
                    <dt className="flex items-center gap-2 text-sm text-gray-600">
                      <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-sm ${barTone[s]}`} />
                      {statusLabel[s]}
                    </dt>
                    <dd className="mt-1 text-4xl font-bold tabular-nums text-gray-900">{counts[s]}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/components" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-blue-700 underline-offset-4 hover:underline">
                See every component and its status
              </Link>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section aria-labelledby="ready" className="mx-auto w-full max-w-7xl px-6 pb-16 sm:pb-24">
            <h2 id="ready" className={h2}>Ready in Figma</h2>
            <p className="mt-3 max-w-xl text-lg text-gray-600">
              Components the tracker marks as done. The ones marked In code also ship as React in src/ui.
            </p>
            <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3">
              {ready.map((c) => (
                <li key={c.slug} className="bg-surface">
                  <Link href={`/components/${c.slug}`} className="group flex h-full flex-col p-5 transition-colors hover:bg-blue-50/50">
                    <div aria-hidden="true" inert className="pointer-events-none flex h-44 items-center justify-center overflow-hidden rounded-lg bg-well">
                      <div className="w-full origin-center scale-[0.75]">
                        <ComponentPreview slug={c.slug} />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="font-semibold text-gray-900 group-hover:text-blue-700">{c.name}</span>
                      {componentDocs[c.slug] && <Badge tone="info">In code</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{c.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>


      </main>

      <Footer />
    </div>
  );
}
