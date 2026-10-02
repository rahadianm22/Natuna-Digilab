import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComponentOverview from "@/components/ComponentOverview";
import { tracker } from "@/lib/natuna-tracker";
import { TRACKER_SNAPSHOT } from "@/lib/site";

const ready = tracker.filter((t) => t.status === "Selesai").length;

export const metadata: Metadata = {
  title: "Components",
  description: `Browse all ${tracker.length} Natuna Digilab components, ${ready} ready to use, grouped as atoms and molecules.`,
};

export default function ComponentsOverview() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="Components" />
      <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Components</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
          {tracker.length} components are on the build plan and {ready} are ready today. The rest are scheduled by
          build day and move to ready as they pass review. Status comes from the component tracker, snapshot of{" "}
          {TRACKER_SNAPSHOT}.
        </p>
        <div className="mt-8">
          <ComponentOverview />
        </div>
      </main>
      <Footer />
    </div>
  );
}
