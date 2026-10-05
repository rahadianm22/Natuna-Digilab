import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/home/Reveal";
import HeroBento from "@/components/home/HeroBento";
import StatusBoard, { type Group, type Item } from "@/components/home/StatusBoard";
import FigmaPanel from "@/components/home/FigmaPanel";
import { buttonStyles } from "@/ui";
import { getComponent } from "@/lib/components-data";
import { componentDocs } from "@/lib/component-docs";
import { palettes } from "@/lib/natuna-palette";
import { lastBuildDay, tracker, type TrackerStatus } from "@/lib/natuna-tracker";
import { FIGMA_COMMUNITY_URL, REPO_URL, TRACKER_SNAPSHOT } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Everything counted here comes from the tracker snapshot and the palette, never typed in by hand.
const groupOf: Record<TrackerStatus, Group> = { Selesai: "ready", "On Review": "progress", OnProgress: "progress", Belum: "planned" };
const rank: Record<Group, number> = { ready: 0, progress: 1, planned: 2 };
const items: Item[] = tracker
  .map((t) => ({ name: (t.slug && getComponent(t.slug)?.name) || t.name, slug: t.slug, group: groupOf[t.status] }))
  .sort((a, b) => rank[a.group] - rank[b.group] || a.name.localeCompare(b.name));

const ready = items.filter((i) => i.group === "ready").length;
const progress = items.filter((i) => i.group === "progress").length;
const total = items.length;
const days = lastBuildDay();
const inCode = Object.keys(componentDocs).length;
const azure = palettes.find((p) => p.token === "blue")!;

const eyebrow = "font-label text-sm font-medium";
// One heading size and one left edge for all four numbered sections.
const h2 = "font-display text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.02] tracking-[-0.03em]";

// The three layers every component draws from, with the names they carry in Figma.
const semantic = [
  { token: "bg/brand", swatch: "bg-[#015099]", to: "blue/800" },
  { token: "text/on-brand", swatch: "bg-white", to: "white" },
  { token: "text/danger", swatch: "bg-[#8c2b2c]", to: "red/800" },
  { token: "border/focus", swatch: "border-2 border-[#0276e3] bg-transparent", to: "blue/600" },
];
const dimension = [
  { token: "Padding/16", value: "16", mark: <span className="h-4 w-4 rounded-sm bg-inverse-muted" /> },
  { token: "Padding/24", value: "24", mark: <span className="h-4 w-6 rounded-sm bg-inverse-muted" /> },
  { token: "Rounded/8", value: "8", mark: <span className="h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-inverse-muted" /> },
  { token: "Width & Height/48", value: "48", mark: <span className="h-6 w-6 rounded-md border-2 border-dashed border-inverse-subtle" /> },
];
const breakpoints = [440, 1024, 1280, 1440];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-gray-900">
      <Header active="" tone="paper" />

      <main id="main" tabIndex={-1} className="w-full overflow-x-clip">
        {/* Hero: what Natuna is, where the build stands, and the system working on the right. */}
        <section
          aria-labelledby="hero"
          className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-22 pt-18 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14"
        >
          <div className="flex min-w-0 flex-col gap-7">
            <p className="rise text-sm text-gray-700">
              <span className="font-semibold tabular-nums text-gray-900">{ready} of {total}</span> components ready.
              The {days}-day build is in progress.
            </p>
            <h1 id="hero" className="rise font-display text-[clamp(42px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.035em]" style={{ "--d": "60ms" } as CSSProperties}>
              One system.
              <br />
              Designed in Figma,
              <br />
              <span className="text-blue-800">built in React.</span>
            </h1>
            <p className="rise max-w-[520px] text-lg leading-[1.55] text-gray-700 md:text-xl" style={{ "--d": "120ms" } as CSSProperties}>
              Tokens, components, and usage rules for digital products, from banking and payments to everyday consumer
              apps. Figma is the source of truth; {inCode} components are in React so far, and more arrive each build day.
            </p>
            <div className="rise flex flex-wrap gap-3" style={{ "--d": "180ms" } as CSSProperties}>
              <Link
                href="/components"
                className="inline-flex min-h-13 w-full items-center justify-center rounded-md bg-inverse px-6 font-semibold text-inverse-text transition-transform active:scale-[0.97] sm:w-auto dark:bg-inverse-text dark:text-inverse"
              >
                Browse components
              </Link>
              <Link
                href="/docs"
                className="inline-flex min-h-13 w-full items-center justify-center rounded-md border border-gray-300 bg-surface px-6 font-semibold text-gray-900 transition-colors hover:border-gray-500 sm:w-auto"
              >
                Read the introduction
              </Link>
            </div>
            {/* Three equal columns on phones, so no stat is left alone on a second row. */}
            <dl className="rise grid grid-cols-3 gap-4 pt-2 text-sm text-gray-700 sm:flex sm:flex-wrap sm:gap-7" style={{ "--d": "240ms" } as CSSProperties}>
              {[
                [String(palettes.length), "color ramps"],
                [String(total), "components tracked"],
                ["440–1440", "responsive range"],
              ].map(([v, k]) => (
                <div key={k} className="flex flex-col-reverse justify-end gap-0.5">
                  <dt>{k}</dt>
                  <dd className="whitespace-nowrap font-display text-xl font-bold text-gray-900 sm:text-[28px]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rise min-w-0" style={{ "--d": "160ms" } as CSSProperties}>
            <HeroBento />
          </div>
        </section>

        {/* Foundation: always navy, so the tokens read as a layer under everything else. */}
        <Reveal>
          <section id="foundation" aria-labelledby="foundation-title" className="bg-inverse text-inverse-text">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-24">
              <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
                <div className="flex flex-[1_1_520px] flex-col gap-4" data-reveal-item>
                  <span className={`${eyebrow} text-lime`}>01 · Foundation</span>
                  <h2 id="foundation-title" className={h2}>
                    Every pixel traces back to a token.
                  </h2>
                </div>
                <p className="max-w-[440px] flex-[1_1_360px] text-lg text-inverse-muted" data-reveal-item>
                  Three layers feed every component: raw primitives, semantic colors that flip between light and dark,
                  and the number scale for space, radius and size.
                </p>
              </div>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
                <div className="flex flex-col gap-4.5 rounded-3xl border border-inverse-line bg-inverse-raised p-6" data-reveal-item>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">1. Primitives</span>
                    <span className="font-label text-xs text-inverse-subtle">raw scale</span>
                  </div>
                  <div className="grid h-16 gap-1" style={{ gridTemplateColumns: `repeat(${azure.steps.length}, minmax(0, 1fr))` }} role="img" aria-label="Azure Blue ramp, steps 50 to 950">
                    {azure.steps.map((s) => (
                      <span
                        key={s.step}
                        className={`rounded-md ${s.step === "800" ? "outline-2 outline-offset-2 outline-lime" : ""}`}
                        style={{ background: s.hex }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between font-label text-sm">
                    <span>blue/800</span>
                    <span className="text-inverse-subtle">#015099</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3.5 rounded-3xl border border-inverse-line bg-inverse-raised p-6" data-reveal-item>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">2. Color</span>
                    <span className="font-label text-xs text-inverse-subtle">semantic alias</span>
                  </div>
                  <ul className="flex flex-col gap-2 font-label text-sm">
                    {semantic.map((s) => (
                      <li key={s.token} className="flex items-center gap-2.5 rounded-xl bg-inverse px-3 py-2.5">
                        <span aria-hidden="true" className={`h-4.5 w-4.5 rounded-sm ${s.swatch}`} />
                        <span className="flex-1">{s.token}</span>
                        <span className="text-inverse-subtle">to {s.to}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3.5 rounded-3xl border border-inverse-line bg-inverse-raised p-6" data-reveal-item>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">3. Number</span>
                    <span className="font-label text-xs text-inverse-subtle">space · radius · size</span>
                  </div>
                  <ul className="flex flex-col gap-3 font-label text-sm">
                    {dimension.map((d) => (
                      <li key={d.token} className="flex items-center gap-3">
                        <span aria-hidden="true" className="flex w-6 justify-center">
                          {d.mark}
                        </span>
                        <span className="flex-1">{d.token}</span>
                        <span className="text-inverse-subtle">{d.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div id="themes" className="flex flex-wrap items-center gap-6 rounded-3xl border border-dashed border-inverse-line-strong p-7" data-reveal-item>
                <div className="flex flex-[1_1_320px] flex-col gap-2">
                  <span className="font-label text-sm text-inverse-muted">= Button / Primary / Large</span>
                  <span className="font-display text-2xl font-bold tracking-[-0.01em]">Tokens that hold from 440 to 1440.</span>
                  <span className="text-base text-inverse-muted">
                    The same bindings on every device frame, with light and dark modes for every color.
                  </span>
                </div>
                <ul className="flex flex-wrap gap-2 font-label text-sm" aria-label="Device frame widths">
                  {breakpoints.map((b) => (
                    <li key={b} className={`rounded-full px-3 py-2 ${b === 1440 ? "bg-lime text-inverse" : "border border-inverse-line-strong"}`}>
                      {b}
                    </li>
                  ))}
                </ul>
                <span aria-hidden="true" className={`${buttonStyles({ size: "lg" })} outline-2 outline-offset-3 outline-blue-300`}>
                  Pay Rp&nbsp;860.500
                </span>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section id="components" aria-labelledby="components-title" className="mx-auto flex w-full max-w-7xl flex-col gap-9 px-6 py-24">
            <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
              <div className="flex flex-[1_1_520px] flex-col gap-4" data-reveal-item>
                <span className={`${eyebrow} text-blue-800`}>02 · Components</span>
                <h2 id="components-title" className={h2}>
                  Built in public, one day at a time.
                </h2>
              </div>
              <div className="flex max-w-[440px] flex-[1_1_360px] flex-col gap-2.5" data-reveal-item>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">
                    {ready} of {total} ready
                  </span>
                  <span className="text-gray-700">Snapshot of {TRACKER_SNAPSHOT}</span>
                </div>
                <div
                  className="flex h-3 overflow-hidden rounded-full bg-gray-200"
                  role="img"
                  aria-label={`${ready} ready, ${progress} in progress, ${total - ready - progress} planned`}
                >
                  <span className="bg-inverse dark:bg-inverse-text" style={{ width: `${(ready / total) * 100}%` }} />
                  <span className="hatch" style={{ width: `${(progress / total) * 100}%` }} />
                </div>
              </div>
            </div>
            <div data-reveal-item>
              <StatusBoard items={items} />
            </div>
          </section>
        </Reveal>

        <Reveal>
          {/* FigmaPanel draws its own bordered panel. Here it is flattened so the 03 eyebrow and heading sit on the
              same left edge and at the same size as 01, 02 and 04; the demo keeps its own well beside the copy. */}
          <section
            aria-labelledby="figma"
            className="mx-auto w-full max-w-7xl px-6 pb-24 [&>div]:rounded-none [&>div]:border-0 [&>div]:bg-transparent [&>div]:p-0 [&>div>div:first-child>span:first-child]:text-sm [&>div>div:first-child>span:first-child]:font-medium [&>div>div:last-child]:border [&>div>div:last-child]:border-gray-200 [&>div>div:last-child]:bg-gray-100 [&_h2]:text-[clamp(36px,4.4vw,56px)] [&_h2]:leading-[1.02] [&_p]:text-lg [&_ul]:text-base"
          >
            <FigmaPanel />
          </section>
        </Reveal>

        <Reveal>
          <section id="intro" aria-labelledby="start-title" className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-24">
            <div className="flex flex-col gap-4" data-reveal-item>
              <span className={`${eyebrow} text-blue-800`}>04 · Get started</span>
              <h2 id="start-title" className={h2}>
                Pick your starting point.
              </h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
              {/* Brand blue gets its own surface here, paired with the navy "In code" card. White on #015099 is 8.0:1. */}
              <div className="flex flex-col gap-4.5 rounded-3xl bg-brand p-8 text-white" data-reveal-item>
                <span className="font-display text-[28px] font-bold">In Figma</span>
                <p className="max-w-[420px]">
                  Duplicate the Foundation Design System from Figma Community. Tokens, components and usage notes come
                  with it.
                </p>
                <a
                  href={FIGMA_COMMUNITY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex min-h-12 items-center self-start rounded-md bg-white px-5 font-semibold text-brand transition-transform focus-visible:outline-white active:scale-[0.97]"
                >
                  Open in Figma Community
                </a>
              </div>
              <div className="flex flex-col gap-4.5 rounded-3xl bg-inverse p-8 text-inverse-text" data-reveal-item>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-display text-[28px] font-bold">In code</span>
                  <span className="rounded-full border border-inverse-line-strong px-2.5 py-1 font-label text-xs text-inverse-muted">
                    npm package not released yet
                  </span>
                </div>
                <p className="max-w-[440px] text-inverse-muted">
                  {inCode} React components live in <code className="font-label text-inverse-text">src/ui</code>. Copy them into
                  your project while the package is on its way.
                </p>
                {/* Same token colors as the docs CodeBlock: violet keywords, green strings, sky tags, amber attributes. */}
                <pre tabIndex={0} aria-label="Importing Button from src/ui" className="overflow-x-auto rounded-xl border border-inverse-line bg-inverse-raised p-4.5 font-label text-sm leading-[1.7] text-[#f1f5f9]">
                  <span className="italic text-[#b7c0cc]">{"// src/ui"}</span>
                  {"\n"}
                  <span className="text-[#cfaaff]">import</span> {"{ Button } "}
                  <span className="text-[#cfaaff]">from</span> <span className="text-[#aad98c]">{'"@/ui"'}</span>
                  {"\n\n"}
                  {"<"}
                  <span className="text-[#85d0ff]">Button</span> <span className="text-[#fcd97d]">size</span>
                  {"="}
                  <span className="text-[#aad98c]">{'"lg"'}</span>
                  {">Pay Rp 860.500</"}
                  <span className="text-[#85d0ff]">Button</span>
                  {">"}
                </pre>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center self-start rounded-md bg-inverse-text px-5 font-semibold text-inverse transition-transform active:scale-[0.97]"
                >
                  View source on GitHub
                </a>
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
