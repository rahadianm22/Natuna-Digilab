import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { statusLabel, statusOrder, statusStyle, tracker, type TrackerStatus } from "@/lib/natuna-tracker";
import { FIGMA_COMMUNITY_URL, ISSUES_URL, REPO_URL, TRACKER_SNAPSHOT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "What the Natuna Digilab design system contains today, how to use it, how component status works, and how to contribute.",
};

const statusMeaning: Record<TrackerStatus, string> = {
  Selesai: "Designed, documented, and signed off. Safe to use in product work.",
  "On Review": "Built and waiting for review. Expect small changes.",
  OnProgress: "Being designed or built now. Do not depend on its details yet.",
  Belum: "Scheduled on a build day but not started. The page shows the intended design.",
};

const sections = [
  { id: "contents", label: "What is in it" },
  { id: "use", label: "Using it today" },
  { id: "status", label: "Component status" },
  { id: "contribute", label: "Contributing" },
];

const linkClass = "font-medium text-blue-700 underline underline-offset-4 hover:text-blue-800";

export default function DocsPage() {
  const ready = tracker.filter((t) => t.status === "Selesai").length;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="Docs" />
      <div className="mx-auto flex w-full max-w-6xl gap-16 px-6 pb-24 pt-14">
        <main className="min-w-0 max-w-3xl flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Introduction</h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Natuna Digilab is an open design system for Indonesian digital products, from banking and payments to
            everyday consumer apps. It gives designers and engineers one set of foundations, components, and
            usage rules, so products built by different teams look and behave the same.
          </p>

          <section aria-labelledby="contents" className="mt-14 scroll-mt-24">
            <h2 id="contents" className="text-2xl font-bold text-gray-900">What is in it</h2>
            <dl className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
              {[
                ["Foundation", "Color, typography, and radius tokens from the Foundation Design System v1.0 in Figma.", "/foundation"],
                ["Components", `${tracker.length} components on the build plan, ${ready} of them ready.`, "/components"],
                ["Themes", "A light and a dark mode mapped from the same tokens.", "/themes"],
              ].map(([term, desc, href]) => (
                <div key={term} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt>
                    <Link href={href} className={linkClass}>{term}</Link>
                  </dt>
                  <dd className="text-gray-700">{desc}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="use" className="mt-14 scroll-mt-24">
            <h2 id="use" className="text-2xl font-bold text-gray-900">Using it today</h2>
            <p className="mt-4 leading-relaxed text-gray-700">
              The Figma library is the source of truth. Duplicate it from{" "}
              <a href={FIGMA_COMMUNITY_URL} target="_blank" rel="noreferrer" className={linkClass}>Figma Community</a>{" "}
              and use its variables and components in your files. Each component page on this site carries the
              usage rules that go with it.
            </p>
            <p className="mt-4 leading-relaxed text-gray-700">
              A React package named <code className="font-mono-code text-[15px]">@natuna/ui</code> is planned but not
              published to npm yet. Code on component pages shows its proposed API, so treat it as a preview rather
              than something you can install.
            </p>
          </section>

          <section aria-labelledby="status" className="mt-14 scroll-mt-24">
            <h2 id="status" className="text-2xl font-bold text-gray-900">Component status</h2>
            <p className="mt-4 leading-relaxed text-gray-700">
              Every component carries one of four statuses from the component tracker. This site uses the snapshot
              of {TRACKER_SNAPSHOT}.
            </p>
            <dl className="mt-5 space-y-4">
              {statusOrder.map((s) => (
                <div key={s} className="grid gap-2 sm:grid-cols-[8rem_1fr] sm:gap-6">
                  <dt>
                    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${statusStyle[s]}`}>{statusLabel[s]}</span>
                  </dt>
                  <dd className="text-gray-700">{statusMeaning[s]}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="contribute" className="mt-14 scroll-mt-24">
            <h2 id="contribute" className="text-2xl font-bold text-gray-900">Contributing</h2>
            <p className="mt-4 leading-relaxed text-gray-700">
              Found a gap, a wrong rule, or a bug on this site?{" "}
              <a href={ISSUES_URL} target="_blank" rel="noreferrer" className={linkClass}>Open an issue</a> and
              describe what you expected. The site itself is open source on{" "}
              <a href={REPO_URL} target="_blank" rel="noreferrer" className={linkClass}>GitHub</a>, where you can
              propose a change with a pull request.
            </p>
          </section>

        </main>

        <nav aria-label="On this page" className="sticky top-24 hidden h-fit w-48 shrink-0 lg:block">
          <div className="text-sm font-semibold text-gray-900">On this page</div>
          <ul className="mt-3 space-y-1 border-l border-gray-200 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1 pl-3 text-gray-600 hover:border-gray-400 hover:text-gray-900">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Footer />
    </div>
  );
}
