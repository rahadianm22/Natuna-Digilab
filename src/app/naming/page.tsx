import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OnThisPage from "@/components/OnThisPage";
import { statusLabel, statusStyle, type TrackerStatus } from "@/lib/natuna-tracker";

export const metadata: Metadata = {
  title: "Naming",
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
  { progress: "0%", figma: "🟥 Under Construction", meaning: "The component is under development.", status: "Belum" },
  { progress: "30%", figma: "🟧 Concepting", meaning: "The component is being concepted.", status: "OnProgress" },
  { progress: "60%", figma: "🟨 Documentation", meaning: "The component is crafted and needs documentation.", status: "On Review" },
  { progress: "100%", figma: "🟩 Finish Component", meaning: "The component is complete.", status: "Selesai" },
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
  Variant: "bg-blue-100 text-blue-800",
  Boolean: "bg-emerald-100 text-emerald-800",
  Text: "bg-amber-100 text-amber-900",
  "Instance swap": "bg-gray-100 text-gray-700",
};

const h2 = "text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl";

export default function NamingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="Introduction" />
      <div className="mx-auto flex w-full max-w-7xl gap-16 px-6 pb-24 pt-14">
        <main id="main" tabIndex={-1} className="min-w-0 flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Naming</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            Every component in the Figma file uses the same property names, so a designer can pick up any component
            and an engineer can map it to props without guessing. Figma pages are named by build stage, and each stage
            matches a status in the component tracker.
          </p>

          <section aria-labelledby="rules" className="mt-14">
            <h2 id="rules" className={h2}>Rules</h2>
            <ol className="mt-5 max-w-3xl space-y-3">
              {rules.map((r, i) => (
                <li key={r} className="flex gap-4 text-gray-700">
                  <span className="w-6 shrink-0 font-semibold tabular-nums text-blue-700">{i + 1}</span>
                  {r}
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="properties" className="mt-16">
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
                    <table className="w-full text-left text-sm">
                      <thead className="hidden border-b border-gray-200 text-gray-600 sm:table-header-group">
                        <tr>
                          <th scope="col" className="w-[26%] px-4 py-3 font-medium">Figma name</th>
                          <th scope="col" className="w-[16%] px-4 py-3 font-medium">Kind</th>
                          <th scope="col" className="px-4 py-3 font-medium">Use</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {g.props.map((p) => (
                          <tr key={p.name} className="block px-4 py-3 sm:table-row sm:p-0">
                            <th scope="row" className="block font-semibold text-gray-900 sm:table-cell sm:px-4 sm:py-3">
                              <span className="whitespace-nowrap">{p.figma}</span>
                            </th>
                            <td className="mt-1.5 block sm:mt-0 sm:table-cell sm:px-4 sm:py-3">
                              <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${kindTone[p.kind]}`}>{p.kind}</span>
                            </td>
                            <td className="mt-1.5 block text-gray-700 sm:mt-0 sm:table-cell sm:px-4 sm:py-3">{p.use}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="pages" className="mt-16">
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
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusStyle[p.status]}`}>{statusLabel[p.status]}</span>
                    ) : (
                      <span className="rounded border border-dashed border-gray-500 px-2 py-0.5 text-xs font-medium text-gray-700">Not in tracker</span>
                    )}
                  </div>
                  <div className="font-semibold text-gray-900">{p.figma}</div>
                  <p className="text-sm text-gray-600">{p.meaning}</p>
                </li>
              ))}
            </ol>
          </section>
        </main>

        <OnThisPage items={sections} className="hidden w-40 lg:block" />
      </div>
      <Footer />
    </div>
  );
}
