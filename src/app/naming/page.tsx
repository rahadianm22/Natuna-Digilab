import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NextPage from "@/components/NextPage";
import OnThisPage from "@/components/OnThisPage";
import ComponentSidebar, { ComponentMobileNav } from "@/components/ComponentSidebar";
import { statusLabel, type TrackerStatus } from "@/lib/natuna-tracker";
import { trackerTone } from "@/lib/status-tone";
import { Badge } from "@/ui";

export const metadata: Metadata = {
  title: "Naming",
  alternates: { canonical: "/naming" },
  description: "How Natuna Digilab names component properties and Figma pages, and how page names map to tracker status.",
};

// Property names as they appear in the Figma file. The emoji is part of the name, so it is shown exactly.
type Prop = { name: string; figma: string; kind: "Variant" | "Boolean" | "Text" | "Instance swap"; use: string };

const groups: { title: string; props: Prop[] }[] = [
  {
    title: "Structure and state",
    props: [
      { name: "Type", figma: "🧰 Type", kind: "Variant", use: "The structural kind or composition of the component." },
      { name: "State", figma: "🎯 State", kind: "Variant", use: "Interaction or lifecycle state, such as default, hover, or disabled." },
      { name: "Size", figma: "📐 Size", kind: "Variant", use: "Size of the component." },
      { name: "Tone", figma: "🎨 Tone", kind: "Variant", use: "Semantic color role. Replaces Color, and its values are roles such as success or danger." },
      { name: "Rounded", figma: "⚙️ Rounded", kind: "Boolean", use: "On or off. A boolean, not a variant." },
      { name: "Stroke", figma: "⚙️ Stroke", kind: "Boolean", use: "On or off. A boolean, not a variant." },
    ],
  },
  {
    title: "Text content",
    props: [
      { name: "Show Label", figma: "🖊 Show Label", kind: "Boolean", use: "Shows the label text." },
      { name: "Label", figma: "🖍 Label", kind: "Text", use: "Main text of an atomic control, or the caption of a form field." },
      { name: "Show Description", figma: "📄 Show Description", kind: "Boolean", use: "Shows the description text." },
      { name: "Description", figma: "📝 Description", kind: "Text", use: "Supporting paragraph of content." },
      { name: "Show Helper Text", figma: "🩹 Show Helper Text", kind: "Boolean", use: "Shows the helper line under a form field." },
      { name: "Helper Text", figma: "🩹 Helper Text", kind: "Text", use: "Help or validation line, for form fields only." },
      { name: "Show Placeholder", figma: "🔤 Show Placeholder", kind: "Boolean", use: "Rarely needed; a placeholder usually does not need a toggle." },
      { name: "Placeholder", figma: "🔤 Placeholder", kind: "Text", use: "Hint text inside an empty field." },
      { name: "Show Value", figma: "🔢 Show Value", kind: "Boolean", use: "Shows the number." },
      { name: "Value", figma: "🔢 Value", kind: "Text", use: "A short number or value." },
      { name: "Timestamp", figma: "📅 Timestamp", kind: "Text", use: "Absolute or relative time. Merges the old Date and Timestamp." },
    ],
  },
  {
    title: "Media and icons",
    props: [
      { name: "Show Image", figma: "📷 Show Image", kind: "Boolean", use: "Shows a photo or avatar." },
      { name: "Show Logo", figma: "💎 Show Logo", kind: "Boolean", use: "Shows a logo." },
      { name: "Icon", figma: "☘️ Icon", kind: "Instance swap", use: "A single icon slot. Its scope is wider and it absorbs Change Icon." },
      { name: "Show Icon Left", figma: "◀️ Show Icon Left", kind: "Boolean", use: "Shows the left icon." },
      { name: "Change Icon Left", figma: "🖼 Change Icon Left", kind: "Instance swap", use: "Swaps the left icon." },
      { name: "Show Icon Right", figma: "▶️ Show Icon Right", kind: "Boolean", use: "Shows the right icon." },
      { name: "Change Icon Right", figma: "🖼 Change Icon Right", kind: "Instance swap", use: "Swaps the right icon." },
    ],
  },
  {
    title: "Actions and indicators",
    props: [
      { name: "Show Button", figma: "🔘 Show Button", kind: "Boolean", use: "An embedded action button. Merges the old CTA and Action." },
      { name: "Button Value", figma: "🧰 Button Value", kind: "Text", use: "The button's label." },
      { name: "Show Actions", figma: "⚡ Show Actions", kind: "Boolean", use: "The row of actions in a footer." },
      { name: "Show Close", figma: "❌ Show Close", kind: "Boolean", use: "The close button. Replaces Dismiss." },
      { name: "Show Connector", figma: "🔗 Show Connector", kind: "Boolean", use: "The line that joins items in a timeline." },
      { name: "Show Attachment", figma: "📎 Show Attachment", kind: "Boolean", use: "The attachment indicator." },
      { name: "Show Dot", figma: "🔴 Show Dot", kind: "Boolean", use: "A small indicator dot." },
    ],
  },
];

// Figma page names carry the build stage, and each stage matches a tracker status.
const pages: { progress: string; figma: string; meaning: string; status?: TrackerStatus }[] = [
  { progress: "0%", figma: "🟥 Under Construction", meaning: "Not started yet.", status: "Belum" },
  { progress: "30%", figma: "🟧 Concepting", meaning: "Being concepted and designed.", status: "OnProgress" },
  { progress: "60%", figma: "🟨 Documentation", meaning: "Designed, being documented and reviewed.", status: "On Review" },
  { progress: "100%", figma: "🟩 Finish Component", meaning: "Signed off in Figma.", status: "Selesai" },
  { progress: "Pending", figma: "🟦 Pending", meaning: "Work on the component is paused." },
  { progress: "Takedown", figma: "⬛ Takedown", meaning: "The component was taken down after it was crafted." },
];

const rules = [
  "Name a property after what it controls, in Title Case: Show Icon Left, not iconLeftVisible.",
  "A property that turns something on or off starts with Show and is a boolean.",
  "Rounded and Stroke are booleans, never variants.",
  "Use Tone for color, with semantic values (success, warning, danger), never raw color names.",
  "Keep the emoji at the start of the name. It sorts the property panel and is part of the exact name.",
];

const sections = [
  { id: "rules", label: "Rules" },
  { id: "properties", label: "Properties" },
  { id: "pages", label: "Pages" },
];

const kindTone: Record<Prop["kind"], string> = {
  Variant: "border border-gray-500 text-gray-900",
  Boolean: "border border-gray-500 text-gray-900",
  Text: "border border-gray-500 text-gray-900",
  "Instance swap": "border border-gray-500 text-gray-900",
};

const h2 = "type-h2 font-bold tracking-tight text-gray-900";

export default function NamingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="Components" />
      {/* Naming belongs to Components, so it keeps the component sidebar, mobile list, and breadcrumb. */}
      <ComponentMobileNav />
      <div className="mx-auto flex w-full max-w-7xl">
        <ComponentSidebar />
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 px-6 pb-20 pt-10 lg:px-10">
          <div className="mx-auto flex max-w-5xl gap-12">
            <article className="min-w-0 flex-1">
              <nav aria-label="Breadcrumb" className="text-sm text-gray-700">
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li>
                    <Link href="/components" className="inline-flex min-h-11 items-center rounded-sm hover:text-blue-800">Components</Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <span aria-current="page" className="inline-flex min-h-11 items-center text-gray-900">Naming</span>
                  </li>
                </ol>
              </nav>

              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Naming</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-700">
                Every component in the Figma file uses the same property names, so a designer can pick up any component
                and an engineer reading the file knows what each property controls. The React props on each component page
                follow the same ideas, but their names are written in code style. Figma pages are named by build stage, and each stage
                matches a status in the component tracker.
              </p>

              <section aria-labelledby="rules" className="scroll-mt-24 mt-14">
                <h2 id="rules" className={h2}>Rules</h2>
                <ol className="mt-5 max-w-3xl space-y-3">
                  {rules.map((r, i) => (
                    <li key={r} className="flex gap-4 text-gray-700">
                      <span className="w-6 shrink-0 font-semibold tabular-nums text-blue-800">{i + 1}</span>
                      {r}
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="properties" className="scroll-mt-24 mt-16">
                <h2 id="properties" className={h2}>Properties</h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
                  {groups.reduce((n, g) => n + g.props.length, 0)} property names, grouped by what they control. The Figma
                  name column is the exact name to type in the property panel.
                </p>
                <div className="mt-8 space-y-10">
                  {groups.map((g) => (
                    <div key={g.title}>
                      <h3 className="text-lg font-semibold text-gray-900">{g.title}</h3>
                      <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-surface">
                        <table className="block w-full text-left text-sm sm:table">
                          <thead className="hidden border-b border-gray-200 text-gray-700 sm:table-header-group">
                            <tr>
                              <th scope="col" className="w-[26%] px-4 py-3 font-medium">Figma name</th>
                              <th scope="col" className="w-[16%] px-4 py-3 font-medium">Kind</th>
                              <th scope="col" className="px-4 py-3 font-medium">Use</th>
                            </tr>
                          </thead>
                          <tbody className="block divide-y divide-gray-200 sm:table-row-group">
                            {g.props.map((p) => (
                              // Phones: name and kind share the first line, the use text runs full width below.
                              <tr key={p.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 px-4 py-3 sm:table-row sm:p-0">
                                <th scope="row" className="font-semibold text-gray-900 sm:table-cell sm:px-4 sm:py-3">
                                  <span className="sm:whitespace-nowrap">{p.figma}</span>
                                </th>
                                <td className="justify-self-end sm:table-cell sm:px-4 sm:py-3">
                                  <span className={`inline-flex whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium ${kindTone[p.kind]}`}>{p.kind}</span>
                                </td>
                                <td className="col-span-2 mt-1 text-gray-700 sm:mt-0 sm:table-cell sm:px-4 sm:py-3">{p.use}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section aria-labelledby="pages" className="scroll-mt-24 mt-16">
                <h2 id="pages" className={h2}>Pages</h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
                  A component&apos;s Figma page is renamed as it moves through the build. The status on this site comes from the
                  tracker, and the tracker follows the page name.
                </p>
                <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pages.map((p) => (
                    <li key={p.figma} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-surface p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-2xl font-bold tabular-nums text-gray-900">{p.progress}</span>
                        {p.status ? (
                          <Badge tone={trackerTone[p.status]}>{statusLabel[p.status]}</Badge>
                        ) : (
                          <span className="rounded border border-dashed border-gray-500 px-2 py-0.5 text-xs font-medium text-gray-700">Not in tracker</span>
                        )}
                      </div>
                      <div className="font-semibold text-gray-900">{p.figma}</div>
                      <p className="text-sm text-gray-700">{p.meaning}</p>
                    </li>
                  ))}
                </ol>
              </section>
              <NextPage href="/components" title="Components" note="The components these names apply to, by status." />
            </article>

            <OnThisPage items={sections} className="hidden w-44 xl:block" />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
