import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComponentOverview from "@/components/ComponentOverview";
import { components } from "@/lib/components-data";
import { tracker } from "@/lib/natuna-tracker";
import { TRACKER_SNAPSHOT } from "@/lib/site";

const ready = tracker.filter((t) => t.status === "Selesai").length;
const untracked = components.filter((c) => c.status === "untracked").length;

export const metadata: Metadata = {
  title: "Components",
  alternates: { canonical: "/components" },
  description: `Browse the ${tracker.length} Natuna Digilab components on the build plan, ${ready} ready to use, plus ${untracked} pages the tracker does not list yet.`,
};

export default function ComponentsOverview() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="Components" />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Components</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
          {tracker.length} components are on the build plan and {ready} are ready today. The rest are scheduled by
          build day and move to ready as they pass review. Status comes from the component tracker, snapshot of{" "}
          {TRACKER_SNAPSHOT}. {untracked} more pages exist that the tracker does not list yet; they are shown last, marked
          Not tracked.
        </p>
        <Link
          href="/naming"
          className="mt-5 flex max-w-2xl items-center justify-between gap-4 rounded-xl border border-gray-200 bg-surface px-5 py-4 transition-colors hover:border-gray-500"
        >
          <span>
            <span className="block font-semibold text-gray-900">Naming</span>
            <span className="block text-sm text-gray-700">How component properties and Figma pages are named.</span>
          </span>
          <span aria-hidden="true" className="text-gray-700">→</span>
        </Link>
        <div className="mt-8">
          <ComponentOverview />
        </div>
      </main>
      <Footer />
    </div>
  );
}
