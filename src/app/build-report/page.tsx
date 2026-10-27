import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/home/Reveal";
import CountUp from "@/components/build-report/CountUp";
import VariantChart, { type ChartRow } from "@/components/build-report/VariantChart";
import { buttonStyles } from "@/ui";
import { buildReport, builtCount, duration, variantCount } from "@/lib/build-report";
import { tracker } from "@/lib/natuna-tracker";

export const metadata: Metadata = {
  title: "Build report",
  alternates: { canonical: "/build-report" },
  description: `The Figma build of the Natuna library: ${builtCount} components, ${variantCount} variants, every color bound to a variable and none typed as raw hex.`,
};

const eyebrow = "font-label text-sm font-medium";
const h2 = "font-display text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.04] tracking-[-0.03em]";

// Group each built component as the tracker does, so the chart and the Components pages agree.
const groupOf = Object.fromEntries(tracker.filter((t) => t.slug).map((t) => [t.slug!, t.group])) as Record<string, ChartRow["group"]>;
const rows: ChartRow[] = buildReport.components.map((c) => ({ ...c, group: groupOf[c.slug ?? ""] ?? "Molecules" }));
const top = [...rows].sort((a, b) => b.variants - a.variants)[0];
const avg = (variantCount / builtCount).toFixed(1);

export default function BuildReportPage() {
  const r = buildReport;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="Build report" />
      <main id="main" tabIndex={-1} className="w-full overflow-x-clip">
        {/* Hero: always navy, like the Foundation band on the home page, with the signal lime used for the numbers that matter. */}
        <section aria-labelledby="report-title" className="relative isolate overflow-hidden bg-inverse text-inverse-text">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_10%,rgba(198,244,50,0.16),transparent_60%),radial-gradient(50%_70%_at_0%_100%,rgba(2,133,255,0.22),transparent_60%)]" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(var(--color-inverse-text)_1px,transparent_1px),linear-gradient(90deg,var(--color-inverse-text)_1px,transparent_1px)] [background-size:48px_48px]"
          />
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-20 pt-16 sm:pt-24">
            <div className="flex flex-col gap-5">
              <p className={`rise ${eyebrow} flex flex-wrap items-center gap-x-3 gap-y-1 text-lime`}>
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className="size-2 rounded-full bg-lime motion-safe:animate-pulse" />
                  Natuna Build Report
                </span>
                <span className="text-inverse-subtle">{r.date}</span>
              </p>
              <h1 id="report-title" className="rise font-display text-[clamp(44px,7vw,96px)] font-extrabold leading-[0.95] tracking-[-0.04em]" style={{ "--d": "60ms" } as CSSProperties}>
                {builtCount} components.
                <br />
                <span className="text-lime">{variantCount} variants.</span>
                <br />
                Zero raw hex.
              </h1>
              <p className="rise max-w-2xl text-lg text-inverse-muted" style={{ "--d": "120ms" } as CSSProperties}>
                One run of the Figma build plugin drew the whole library on {r.foundation}, in {r.font}, from {r.semanticTokens} semantic tokens. It took{" "}
                {duration(r.seconds)}, and every one of its {(r.colorsBound + r.numbersBound).toLocaleString("en-US")} values points at a variable.
              </p>
            </div>

            <dl className="rise grid grid-cols-2 gap-3 lg:grid-cols-4" style={{ "--d": "180ms" } as CSSProperties}>
              {[
                { k: "Colors bound to variables", v: r.colorsBound, accent: false },
                { k: "Numbers bound to variables", v: r.numbersBound, accent: false },
                { k: "Raw hex values", v: r.rawHex, accent: true },
                { k: "Icons, Regular and Fill", v: r.icons.count, accent: false },
              ].map((s) => (
                <div
                  key={s.k}
                  className={`flex flex-col-reverse justify-end gap-2 rounded-3xl border p-5 sm:p-6 ${s.accent ? "border-lime bg-lime text-inverse" : "border-inverse-line bg-inverse-raised"}`}
                >
                  <dt className={`text-sm ${s.accent ? "font-medium" : "text-inverse-subtle"}`}>{s.k}</dt>
                  <dd className="font-display text-[clamp(32px,4.2vw,52px)] font-extrabold leading-none tracking-[-0.03em]">
                    <CountUp value={s.v} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* The chart: one bar per component. */}
        <Reveal>
          <section aria-labelledby="variants-title" className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-24">
            <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
              <div className="flex flex-[1_1_520px] flex-col gap-4" data-reveal-item>
                <span className={`${eyebrow} text-role-text-link`}>Variants per component</span>
                <h2 id="variants-title" className={`${h2} text-gray-900`}>
                  {variantCount} variants, drawn in one pass.
                </h2>
              </div>
              <dl className="grid flex-[1_1_360px] grid-cols-2 gap-6 text-sm text-gray-700" data-reveal-item>
                <div className="flex flex-col-reverse justify-end gap-1">
                  <dt>most variants, {top.name}</dt>
                  <dd className="font-display text-4xl font-extrabold text-gray-900">{top.variants}</dd>
                </div>
                <div className="flex flex-col-reverse justify-end gap-1">
                  <dt>variants per component, on average</dt>
                  <dd className="font-display text-4xl font-extrabold text-gray-900">{avg}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-surface p-5 sm:p-8" data-reveal-item>
              <VariantChart rows={rows} />
            </div>
          </section>
        </Reveal>

        {/* Interim mappings: where the build had to stand in for a token that v1.1 does not have. */}
        <Reveal>
          <section aria-labelledby="interim-title" className="bg-inverse text-inverse-text">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-24">
              <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
                <div className="flex flex-[1_1_520px] flex-col gap-4" data-reveal-item>
                  <span className={`${eyebrow} text-lime`}>Interim mappings</span>
                  <h2 id="interim-title" className={h2}>
                    Four stand-ins until v1.2.
                  </h2>
                </div>
                <p className="max-w-[440px] flex-[1_1_360px] text-lg text-inverse-muted" data-reveal-item>
                  Foundation v1.1 has no disabled, hover or inverse tokens yet. The build pointed these four at the nearest
                  existing token, so they can move in one step when the real ones land.
                </p>
              </div>
              <ol className="grid gap-4 md:grid-cols-2">
                {r.interim.map((m, i) => (
                  <li key={m.from} className="flex flex-col gap-4 rounded-3xl border border-inverse-line bg-inverse-raised p-6" data-reveal-item>
                    <span className="font-label text-xs text-inverse-subtle">0{i + 1}</span>
                    <p className="flex flex-wrap items-center gap-3 font-mono-code text-[15px]">
                      <span className="rounded-lg bg-inverse px-3 py-1.5 text-inverse-text">{m.from}</span>
                      <span aria-hidden="true" className="text-lime">→</span>
                      <span className="sr-only">maps to</span>
                      <span className="rounded-lg bg-lime px-3 py-1.5 text-inverse">{m.to}</span>
                    </p>
                    <p className="text-inverse-muted">{m.why[0].toUpperCase() + m.why.slice(1)}.</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </Reveal>

        {/* Styles and the rest of the report. */}
        <Reveal>
          <section aria-labelledby="styles-title" className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-24">
            <div className="flex flex-col gap-4" data-reveal-item>
              <span className={`${eyebrow} text-role-text-link`}>Styles and assets</span>
              <h2 id="styles-title" className={`${h2} max-w-3xl text-gray-900`}>
                Text, effects and icons, all from the library.
              </h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="flex flex-col gap-5 rounded-3xl border border-gray-200 bg-surface p-6 lg:col-span-2" data-reveal-item>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-bold text-gray-900">Text styles v1.1</h3>
                  <p className="font-display text-4xl font-extrabold text-gray-900">
                    <CountUp value={r.textStyles} />
                  </p>
                </div>
                <p className="text-sm text-gray-700">{r.legacyTextStyles.length} legacy styles were mapped onto them:</p>
                <ul className="flex flex-wrap gap-2">
                  {r.legacyTextStyles.map((s) => (
                    <li key={s} className="rounded-full bg-role-bg-tone-info px-3 py-1 font-mono-code text-[13px] text-role-text-tone-info">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-5 rounded-3xl border border-gray-200 bg-surface p-6" data-reveal-item>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-bold text-gray-900">Effect styles</h3>
                  <p className="font-display text-4xl font-extrabold text-gray-900">{r.effectStyles.length}</p>
                </div>
                <ul className="grid grid-cols-3 gap-2">
                  {r.effectStyles.map((s) => {
                    const shadow = s.startsWith("Shadow") ? { "Shadow/SM": "shadow-sm", "Shadow/MD": "shadow-md", "Shadow/LG": "shadow-lg", "Shadow/XL": "shadow-xl" }[s] : "";
                    const blur = s.startsWith("Blur") ? { "Blur/SM": "blur-[1px]", "Blur/MD": "blur-[2px]", "Blur/LG": "blur-[3px]", "Blur/XL": "blur-[4px]" }[s] : "";
                    return (
                      <li key={s} className="flex flex-col items-center gap-2 text-center">
                        <span
                          aria-hidden="true"
                          className={`size-10 rounded-xl border border-gray-200 bg-surface ${shadow} ${s === "Focus Ring" ? "outline-2 outline-offset-2 outline-role-border-focus" : ""}`}
                        >
                          {blur && <span className={`m-2.5 block size-5 rounded-full bg-role-bg-brand ${blur}`} />}
                        </span>
                        <span className="text-xs text-gray-700">{s}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-surface p-6" data-reveal-item>
                <h3 className="text-lg font-bold text-gray-900">Icons</h3>
                <p className="font-display text-4xl font-extrabold text-gray-900">
                  <CountUp value={r.icons.count} />
                </p>
                <p className="text-sm text-gray-700">
                  {r.icons.set}, {r.icons.weights}, as components.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-surface p-6" data-reveal-item>
                <h3 className="text-lg font-bold text-gray-900">Foundation</h3>
                <p className="font-display text-4xl font-extrabold text-gray-900">{r.foundation}</p>
                <p className="text-sm text-gray-700">
                  {r.font}, {r.semanticTokens} semantic tokens.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-surface p-6" data-reveal-item>
                <h3 className="text-lg font-bold text-gray-900">Reused, not redrawn</h3>
                <ul className="flex flex-wrap gap-2">
                  {r.reused.map((c) => (
                    <li key={c}>
                      <Link href={`/components/${c.toLowerCase()}`} className="inline-flex min-h-11 items-center rounded-full border border-gray-200 px-4 text-sm font-medium text-gray-900 hover:bg-role-bg-hover">
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-700">The existing components were placed as instances.</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-6 rounded-3xl bg-inverse p-8 text-inverse-text sm:flex-row sm:items-center sm:justify-between sm:p-10" data-reveal-item>
              <p className="max-w-xl font-display text-2xl font-bold leading-tight sm:text-3xl">
                Every component in this report has a page, with live code you can copy.
              </p>
              <Link href="/components" className={`${buttonStyles({ variant: "primary", size: "lg" })} w-full shrink-0 sm:w-auto`}>
                Browse components
              </Link>
            </div>
            <p className="text-xs text-gray-700">Figures from the build plugin&rsquo;s report frame, {r.date}.</p>
          </section>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
