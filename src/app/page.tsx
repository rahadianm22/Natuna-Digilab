import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BookOpenText, CircleHalf, Palette, SquaresFour } from "@phosphor-icons/react/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComponentPreview from "@/components/ComponentPreview";
import CodeBlock from "@/components/CodeBlock";
import Demo from "@/components/demos";
import HeroPhone from "@/components/home/HeroPhone";
import Reveal from "@/components/home/Reveal";
import BuildRoadmap from "@/components/home/BuildRoadmap";
import { Badge, buttonStyles } from "@/ui";
import { componentGroup, getComponent } from "@/lib/components-data";
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

const azure = palettes.find((p) => p.token === "blue")!;

// The four places people start. Each tint is a Natuna ramp that flips cleanly in dark mode.
// Same order as the header nav and the footer, so the three read as one menu.
const starts = [
  { href: "/docs", label: "Introduction", note: "How it works", icon: BookOpenText, tone: "bg-amber-100 text-amber-900" },
  { href: "/foundation", label: "Foundation", note: "Color, type, number, effect", icon: Palette, tone: "bg-blue-100 text-blue-800" },
  { href: "/components", label: "Components", note: `${counts.Selesai} of ${tracker.length} ready`, icon: SquaresFour, tone: "bg-emerald-100 text-emerald-800" },
  { href: "/themes", label: "Themes", note: "Light and dark", icon: CircleHalf, tone: "bg-gray-100 text-gray-800" },
];

// How a team starts, in order. Every step ends somewhere real.
const steps = [
  { title: "Get the Figma library", body: "Duplicate the Foundation Design System from Figma Community. Its variables and components are the source of truth.", href: FIGMA_COMMUNITY_URL, cta: "Open in Figma Community", external: true },
  { title: "Use the tokens", body: "Color, type, spacing, radius and shadow come from one set of tokens, in both light and dark mode.", href: "/foundation", cta: "Explore the foundation" },
  { title: "Build with ready components", body: "Start from components marked Ready. Each page has its usage rules and the do and don't that go with it.", href: "/components", cta: "Browse the components" },
  { title: "Copy to Figma or code", body: "Paste any preview into Figma as editable layers, or copy the React code that runs the live demo.", href: "/components/button", cta: "Try it on Button" },
];

// The three shapes that form the N in the Natuna logo, without the tile behind them.
const LOGO_N =
  "M420.015 806.015C379.735 765.74 310.861 794.264 310.861 851.223V1193.71C310.861 1262.74 366.826 1318.7 435.861 1318.7H469.654C640.549 1318.7 726.132 1112.1 605.293 991.275L420.015 806.015ZM534.965 281.316C337.287 281.316 238.139 520.15 377.704 660.125L1009.48 1293.75C1023.42 1307.72 1042.34 1315.58 1062.08 1315.58C1260.59 1315.58 1360 1075.6 1219.63 935.254L587.305 302.995C573.423 289.115 554.596 281.316 534.965 281.316ZM1132.02 281.316C961.125 281.316 875.54 487.913 996.38 608.738L1181.66 793.999C1221.94 834.274 1290.81 805.749 1290.81 748.791V406.304C1290.81 337.275 1234.85 281.316 1165.81 281.316H1132.02Z";

const h2 = "text-4xl font-extrabold tracking-tight text-gray-900 sm:text-[2.75rem] sm:leading-[1.15]";

/** One feature row: a visual on one side, a short heading and a paragraph on the other, alternating down the page. */
function Feature({
  id,
  title,
  children,
  visual,
  flip = false,
}: {
  id: string;
  title: string;
  children: ReactNode;
  visual: ReactNode;
  flip?: boolean;
}) {
  return (
    <section aria-labelledby={id} className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-14 sm:py-20 lg:grid-cols-2 lg:gap-20">
      <div className={`min-w-0 ${flip ? "lg:order-2" : ""}`}>{visual}</div>
      <div className="min-w-0">
        <h2 id={id} className={h2}>
          {title}
        </h2>
        <div className="mt-5 max-w-md space-y-6 text-lg leading-relaxed text-gray-600">{children}</div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="" />

      <main id="main" tabIndex={-1} className="w-full overflow-x-clip">
        <section className="relative isolate">
          {/* The N from the logo, drawn huge and nearly invisible: the brand's own shape as the backdrop. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1600 1600"
            className="pointer-events-none absolute left-1/2 top-[-14rem] -z-10 w-[72rem] max-w-none -translate-x-[38%] text-blue-50 opacity-50 sm:top-[-18rem]"
          >
            <path d={LOGO_N} fill="currentColor" />
          </svg>

          <div className="mx-auto w-full max-w-5xl px-6 pt-20 text-center sm:pt-28">
            <p className="rise text-lg text-gray-600 sm:text-xl">Welcome to</p>
            <h1 className="hero-name rise mt-2 font-extrabold text-gray-900" style={{ "--d": "60ms" } as CSSProperties}>
              Natuna Digilab
            </h1>
            <p className="rise mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl" style={{ "--d": "120ms" } as CSSProperties}>
              The design system for Indonesian digital products, in Figma and React. Version 0.1, in beta.
            </p>
          </div>

          <nav aria-label="Start here" className="rise mx-auto mt-14 w-full max-w-6xl px-6 pb-8 sm:pb-12" style={{ "--d": "200ms" } as CSSProperties}>
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-gray-200 shadow-lg ring-1 ring-gray-200 lg:grid-cols-4">
              {starts.map(({ href, label, note, icon: Icon, tone }) => (
                <li key={href} className="bg-surface">
                  <Link
                    href={href}
                    className="group flex h-full min-h-36 flex-col items-center justify-center gap-3 px-4 py-7 text-center transition-colors hover:bg-gray-50"
                  >
                    <span className={`flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-200 group-hover:-translate-y-0.5 ${tone}`}>
                      <Icon size={28} weight="duotone" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold text-gray-900 group-hover:text-blue-700">{label}</span>
                      <span className="mt-0.5 block text-sm text-gray-600">{note}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <Reveal>
          <Feature
            id="foundation"
            title="Foundation"
            visual={
              <div className="space-y-6">
                <div className="flex h-24 overflow-hidden rounded-2xl" role="img" aria-label="Azure Blue ramp, steps 50 to 950">
                  {azure.steps.map((s) => (
                    <span key={s.step} className="flex-1" style={{ background: s.hex }} />
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-surface p-6 sm:grid-cols-[auto_1fr] sm:items-end">
                  <span className="text-7xl font-extrabold leading-none tracking-tight text-gray-900 sm:text-8xl" aria-hidden="true">Aa</span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900">Urbanist</div>
                    <div className="mt-1 text-sm text-gray-600">Seven styles, 24 to 10px on phones and 32 to 12px on desktop.</div>
                    <div className="mt-4 flex flex-wrap items-end gap-3" aria-hidden="true">
                      {["rounded-sm", "rounded-md", "rounded-xl", "rounded-2xl", "rounded-full"].map((r) => (
                        <span key={r} className={`h-10 w-10 border-2 border-blue-600 bg-blue-50 ${r}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            }
          >
            <p>
              Every screen starts from the same tokens: {colorTokens} colors in 8 ramps, seven text styles, a number
              scale, {RADII} radii, and four shadows, taken from the Foundation Design System in Figma. Change a token
              and every component that uses it follows, in both modes.
            </p>
            <Link href="/foundation" className={`${buttonStyles({ variant: "ghost", size: "lg" })} w-full sm:w-auto`}>
              Explore the foundation
            </Link>
          </Feature>
        </Reveal>

        <Reveal>
          <Feature
            id="components"
            title="Components"
            flip
            visual={
              <figure>
                <HeroPhone />
                <figcaption className="mx-auto mt-4 max-w-sm text-center text-xs text-gray-600">
                  A working screen built from Avatar, Input, Button, and Badge in src/ui. Try sending more than the
                  balance.
                </figcaption>
              </figure>
            }
          >
            <p>
              Each component is built for one job, with its status, usage rules, and do and don&apos;t on its own
              page. The screen beside this text is made of them, labelled with the tokens it uses.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/components" className={`${buttonStyles({ size: "lg" })} w-full sm:w-auto`}>
                Browse the components
              </Link>
              <a href={FIGMA_COMMUNITY_URL} target="_blank" rel="noreferrer" className={`${buttonStyles({ variant: "ghost", size: "lg" })} w-full sm:w-auto`}>
                Open the Figma library
              </a>
            </div>
          </Feature>
        </Reveal>

        <Reveal>
          <Feature
            id="code"
            title="Code"
            visual={
              <div className="space-y-3">
                <div className="rounded-xl border border-gray-200 bg-surface px-6 py-10">
                  <Demo slug="button" />
                </div>
                <CodeBlock code={fullUsage(componentDocs.button)} label="Button usage" collapseAfter={12} />
              </div>
            }
          >
            <p>
              Components that exist in React have a live demo next to the exact code that runs it, in TypeScript or
              JavaScript. Any preview can also go to Figma as editable layers with one click.
            </p>
            <Link href="/components/button" className={`${buttonStyles({ variant: "ghost", size: "lg" })} w-full sm:w-auto`}>
              Open the Button page
            </Link>
          </Feature>
        </Reveal>

        <Reveal>
          <section aria-labelledby="roadmap" className="border-y border-gray-200 bg-surface">
            <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 id="roadmap" className={h2}>Roadmap</h2>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                    {counts.Selesai} of {tracker.length} components are done. The rest are scheduled across{" "}
                    {lastBuildDay()} build days in the component tracker. Snapshot of {TRACKER_SNAPSHOT}.
                  </p>
                </div>
                <ul aria-label="Legend" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                  {statusOrder
                    .filter((s) => counts[s] > 0)
                    .map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${barTone[s]}`} />
                        {statusLabel[s]} <span className="tabular-nums text-gray-900">{counts[s]}</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="mt-12">
                <BuildRoadmap />
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          {/* Numbered steps in a ruled grid: how a team actually starts, each step ending in a real place. */}
          <section aria-labelledby="start" className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20">
            <h2 id="start" className={h2}>Getting started</h2>
            <p className="mt-4 max-w-xl text-lg text-gray-600">Four steps from an empty file to a screen built on the system.</p>
            <ol className="mt-10 grid border-t border-gray-200 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex flex-col border-b border-gray-200 py-8 sm:px-6 sm:max-lg:[&:nth-child(odd)]:pl-0 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                  <span className="text-sm font-medium tabular-nums text-blue-700">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-xl font-bold tracking-tight text-gray-900">{s.title}</h3>
                  <p className="mt-2 flex-1 text-gray-600">{s.body}</p>
                  {s.external ? (
                    <a href={s.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center self-start text-sm font-medium text-blue-700 underline-offset-4 hover:underline">
                      {s.cta}
                    </a>
                  ) : (
                    <Link href={s.href} className="mt-5 inline-flex min-h-11 items-center self-start text-sm font-medium text-blue-700 underline-offset-4 hover:underline">
                      {s.cta}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </Reveal>

        <Reveal>
          <section aria-labelledby="ready" className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
            <h2 id="ready" className={h2}>Ready in Figma</h2>
            <p className="mt-4 max-w-xl text-lg text-gray-600">
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
                    <div className="mt-4 text-xs text-gray-600">{componentGroup(c.slug)}</div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">{c.name}</span>
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
