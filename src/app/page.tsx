import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buttonStyles } from "@/ui";
import ComponentPreview from "@/components/ComponentPreview";
import { getComponent } from "@/lib/components-data";
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

const routes = [
  {
    href: "/foundation",
    title: "Foundation",
    body: "Eight color ramps, the Urbanist type scale, and the radius steps every component is drawn with.",
  },
  {
    href: "/components",
    title: "Components",
    body: `All ${tracker.length} components on the build plan, with their status, previews, and usage guidance.`,
  },
  {
    href: "/themes",
    title: "Themes",
    body: "The light and dark mode token mapping, shown on real components side by side.",
  },
  {
    href: "/docs",
    title: "Introduction",
    body: "What the system covers today, how status works, and how to contribute.",
  },
];

function TransferExample() {
  return (
    <figure className="w-full max-w-md">
      <div
        inert
        className="rounded-2xl border border-gray-200 bg-surface p-6 sm:p-8"
      >
        <div className="text-xl font-bold text-gray-900">Send money</div>
        <p className="mt-1 text-sm text-gray-600">From your main account</p>

        <div className="mt-6 space-y-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-gray-700">Recipient bank</span>
            <span className="flex items-center justify-between rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900">
              Bank name
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="text-gray-500">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-gray-700">Amount</span>
            <span className="flex items-center rounded-md border-2 border-blue-600 px-3 py-2">
              <span className="text-base font-semibold text-gray-600">Rp</span>
              <span className="px-2 text-lg font-semibold tabular-nums text-gray-900">250.000</span>
            </span>
            <span className="text-xs text-gray-600">Balance shown here</span>
          </div>

          <fieldset>
            <legend className="mb-2 text-xs font-semibold text-gray-700">Schedule</legend>
            <div className="flex gap-2 text-sm">
              <span className="rounded-md bg-brand px-3 py-1.5 font-medium text-white">Now</span>
              <span className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700">Pick a date</span>
            </div>
          </fieldset>

          <span className="block rounded-md bg-brand py-2.5 text-center text-sm font-semibold text-white">
            Review transfer
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-gray-600">
        Example screen composed from Select, Amount Input, Button Group, and Button.
      </figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="" />

      <main className="w-full">
        <section className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
          <div>
            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl">
              The design system for Indonesian digital products.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-600">
              Components, design tokens, and usage guidance from Natuna Digilab, drawn for money,
              identity, and everyday services. Version 0.1, in beta.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/components"
                className={buttonStyles({ size: "lg" })}
              >
                Browse the components
              </Link>
              <Link
                href="/docs"
                className={buttonStyles({ variant: "ghost", size: "lg" })}
              >
                Read the introduction
              </Link>
            </div>
            <a
              href={FIGMA_COMMUNITY_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-blue-700 underline-offset-4 hover:underline"
            >
              Open the Figma library on Figma Community
            </a>
          </div>
          <div className="flex justify-center lg:justify-end">
            <TransferExample />
          </div>
        </section>

        <section aria-labelledby="progress" className="border-y border-gray-200 bg-surface">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 id="progress" className="text-2xl font-bold text-gray-900">Where the build stands</h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-600">
                {counts.Selesai} of {tracker.length} components are ready. The rest are scheduled by build day
                in the component tracker. Snapshot of {TRACKER_SNAPSHOT}.
              </p>
            </div>
            <div>
              <div className="flex h-3 overflow-hidden rounded-full bg-gray-100" role="img" aria-label={statusOrder.map((s) => `${counts[s]} ${statusLabel[s]}`).join(", ")}>
                {statusOrder.map((s) =>
                  counts[s] ? (
                    <span key={s} className={barTone[s]} style={{ width: `${(counts[s] / tracker.length) * 100}%` }} />
                  ) : null,
                )}
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                {statusOrder.map((s) => (
                  <div key={s}>
                    <dt className="flex items-center gap-2 text-sm text-gray-600">
                      <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-sm ${barTone[s]}`} />
                      {statusLabel[s]}
                    </dt>
                    <dd className="mt-1 text-3xl font-bold tabular-nums text-gray-900">{counts[s]}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/components" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-blue-700 underline-offset-4 hover:underline">
                See every component and its status
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="ready" className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="ready" className="text-3xl font-bold tracking-tight text-gray-900">Ready to use</h2>
              <p className="mt-2 max-w-xl text-gray-600">
                Components the tracker marks as done. Each one opens its guidance page.
              </p>
            </div>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3">
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

        <section aria-labelledby="start" className="mx-auto w-full max-w-6xl px-6 pb-24">
          <h2 id="start" className="text-3xl font-bold tracking-tight text-gray-900">Where to go next</h2>
          <ul className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
            {routes.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="group grid gap-1 py-5 sm:grid-cols-[14rem_1fr] sm:gap-8">
                  <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">{r.title}</span>
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
