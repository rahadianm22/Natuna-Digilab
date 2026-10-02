import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComponentPreview from "@/components/ComponentPreview";
import CodeBlock from "@/components/CodeBlock";
import Demo from "@/components/demos";
import TransferDemo from "@/components/home/TransferDemo";
import Reveal from "@/components/home/Reveal";
import { buttonStyles } from "@/ui";
import { getComponent } from "@/lib/components-data";
import { componentDocs } from "@/lib/component-docs";
import { palettes } from "@/lib/natuna-palette";
import { statusLabel, statusOrder, tracker, type TrackerStatus } from "@/lib/natuna-tracker";
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

const ready = tracker
  .filter((t) => t.status === "Selesai" && t.slug)
  .map((t) => getComponent(t.slug!))
  .filter((c) => c !== undefined);

// Every number here is counted from the data in this repository.
const facts = [
  { value: tracker.length, label: "components on the build plan" },
  { value: palettes.reduce((n, p) => n + p.steps.length, 0), label: "color tokens in 8 ramps" },
  { value: 6, label: "text styles in the type scale" },
  { value: 2, label: "modes, light and dark" },
];

const routes = [
  { href: "/foundation", title: "Foundation", body: "Color ramps with contrast ratios, the Urbanist type scale, and radius steps." },
  { href: "/components", title: "Components", body: `All ${tracker.length} components with status, previews, and usage rules.` },
  { href: "/themes", title: "Themes", body: "The same card in light and dark, and the token roles behind it." },
  { href: "/docs", title: "Introduction", body: "What the system covers today, how status works, and how to contribute." },
];

const azure = palettes.find((p) => p.token === "blue")!;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="" />

      <main className="w-full overflow-x-clip">
        {/* Hero. The two soft ellipses come from the Cover frame of the Natuna Figma file. */}
        <section className="relative isolate">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-48 -top-56 h-[38rem] w-[52rem] rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -right-56 top-72 h-[34rem] w-[46rem] rounded-full bg-blue-300/15 blur-3xl" />
          </div>

          <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-16 text-center sm:pt-24">
            <h1 className="display mx-auto max-w-5xl font-extrabold text-gray-900">
              Design for how Indonesia pays, signs in, and gets things done.
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
              Natuna Digilab is a design system of foundations, components, and usage rules for Indonesian
              digital products. Version 0.1, in beta.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/components" className={buttonStyles({ size: "lg" })}>
                Browse the components
              </Link>
              <Link href="/docs" className={buttonStyles({ variant: "ghost", size: "lg" })}>
                Read the introduction
              </Link>
            </div>
            <a
              href={FIGMA_COMMUNITY_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-blue-700 underline-offset-4 hover:underline"
            >
              Open the Figma library on Figma Community
            </a>
          </div>

          <div className="mx-auto w-full max-w-6xl px-6 pb-24">
            <div className="relative mx-auto max-w-md">
              <div className="rounded-[2rem] border border-gray-200 bg-surface/80 p-2 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
                <div className="rounded-3xl border border-gray-200 bg-surface p-6 sm:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-gray-900">Send money</div>
                      <div className="text-sm text-gray-600">Try it. This form works.</div>
                    </div>
                  </div>
                  <TransferDemo />
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-gray-600">
                Built from Select, Amount Input, Button, Badge, and the Azure Blue ramp.
              </p>
            </div>
          </div>
        </section>

        <section aria-label="The system in numbers" className="border-y border-gray-200 bg-surface">
          <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px bg-gray-200 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface px-6 py-10">
                <dd className="text-5xl font-extrabold tabular-nums tracking-tight text-gray-900 sm:text-6xl">{f.value}</dd>
                <dt className="mt-2 text-sm text-gray-600">{f.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        <Reveal>
          <section aria-labelledby="foundation" className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div>
              <h2 id="foundation" className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                One foundation under every screen.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-600">
                Color, type, and radius come from the Foundation Design System in Figma. Change a token and every
                component that uses it follows, in both modes.
              </p>
              <Link href="/foundation" className={`${buttonStyles({ variant: "ghost", size: "lg" })} mt-8`}>
                Explore the foundation
              </Link>
            </div>
            <div className="space-y-6">
              <div className="flex h-24 overflow-hidden rounded-2xl" role="img" aria-label="Azure Blue ramp, steps 50 to 950">
                {azure.steps.map((s) => (
                  <span key={s.step} className="flex-1" style={{ background: s.hex }} />
                ))}
              </div>
              <div className="grid grid-cols-[auto_1fr] items-end gap-6 rounded-2xl border border-gray-200 bg-surface p-6">
                <span className="text-8xl font-extrabold leading-none tracking-tight text-gray-900" aria-hidden="true">Aa</span>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Urbanist</div>
                  <div className="mt-1 text-sm text-gray-600">Header 1 to Caption 1, six styles from 24 to 12.</div>
                  <div className="mt-4 flex items-end gap-3" aria-hidden="true">
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
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-24 lg:grid-cols-2 lg:items-center">
              <div className="lg:order-2">
                <h2 id="code" className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                  See it, try it, copy it.
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-600">
                  Components that exist in code have a live demo next to the exact code that runs it, in TypeScript
                  or JavaScript.
                </p>
                <Link href="/components/button" className={`${buttonStyles({ variant: "ghost", size: "lg" })} mt-8`}>
                  Open the Button page
                </Link>
              </div>
              <div className="min-w-0 space-y-3">
                <div className="rounded-xl border border-gray-200 bg-canvas px-6 py-10">
                  <Demo slug="button" />
                </div>
                <CodeBlock code={componentDocs.button.usage} label="Button usage" collapseAfter={9} />
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section aria-labelledby="progress" className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-24 md:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 id="progress" className="text-4xl font-extrabold tracking-tight text-gray-900">Where the build stands</h2>
              <p className="mt-4 max-w-sm leading-relaxed text-gray-600">
                {counts.Selesai} of {tracker.length} components are ready. The rest are scheduled by build day in the
                component tracker. Snapshot of {TRACKER_SNAPSHOT}.
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
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
                {statusOrder.map((s) => (
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
          <section aria-labelledby="ready" className="mx-auto w-full max-w-6xl px-6 pb-24">
            <h2 id="ready" className="text-4xl font-extrabold tracking-tight text-gray-900">Ready to use</h2>
            <p className="mt-3 max-w-xl text-lg text-gray-600">Components the tracker marks as done. Each one opens its guidance page.</p>
            <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3">
              {ready.map((c) => (
                <li key={c.slug} className="bg-surface">
                  <Link href={`/components/${c.slug}`} className="group flex h-full flex-col p-5 transition-colors hover:bg-blue-50/50">
                    <div aria-hidden="true" inert className="pointer-events-none flex h-36 items-center justify-center overflow-hidden">
                      <div className="w-full scale-[0.8]">
                        <ComponentPreview slug={c.slug} />
                      </div>
                    </div>
                    <div className="mt-4 font-semibold text-gray-900 group-hover:text-blue-700">{c.name}</div>
                    <p className="mt-1 text-sm text-gray-600">{c.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <section aria-labelledby="start" className="mx-auto w-full max-w-6xl px-6 pb-28">
          <h2 id="start" className="text-4xl font-extrabold tracking-tight text-gray-900">Where to go next</h2>
          <ul className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
            {routes.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="group grid gap-1 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
                  <span className="text-xl font-semibold text-gray-900 group-hover:text-blue-700">{r.title}</span>
                  <span className="text-gray-600">{r.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
