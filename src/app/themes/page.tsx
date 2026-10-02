import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Themes",
  description: "Light and dark mode from the Natuna Digilab Foundation Design System color tokens.",
};

// Values from the "Color Property" collection in the Natuna Foundation Figma file (Light Mode | Dark Mode).
const roles = [
  { role: "Background", light: "#ffffff", dark: "#19212e" },
  { role: "Soft gray", light: "#f1f5f9", dark: "#4b5565" },
  { role: "Text primary", light: "#19212e", dark: "#ffffff" },
  { role: "Text secondary", light: "#4b5565", dark: "#f1f5f9" },
  { role: "Main blue", light: "#0276e3", dark: "#0276e3" },
];

function Specimen({ mode }: { mode: "light" | "dark" }) {
  return (
    <figure className={`theme-${mode} rounded-xl border border-gray-200 p-5 sm:p-6`}>
      <figcaption className="text-sm font-semibold text-gray-900">{mode === "light" ? "Light mode" : "Dark mode"}</figcaption>
      <div inert className="mt-4 rounded-xl border border-gray-200 bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold text-gray-900">Electricity bill</div>
            <div className="text-sm text-gray-600">Due 12 Oct</div>
          </div>
          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">Pending</span>
        </div>
        <div className="mt-4 text-2xl font-bold tabular-nums text-gray-900">Rp 412.500</div>
        <div className="mt-5 flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-700">Note</span>
          <span className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500">Add a note</span>
        </div>
        <div className="mt-5 flex gap-2">
          <span className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white">Pay now</span>
          <span className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800">Later</span>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Paid bills move to <span className="text-blue-700 underline">history</span>.
        </p>
      </div>
    </figure>
  );
}

export default function ThemesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="Themes" />
      <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Themes</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
          Light and dark mode come from the same tokens. Components ask for a role, such as surface or primary
          text, and the mode decides the value. The same card is rendered in both modes below.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Specimen mode="light" />
          <Specimen mode="dark" />
        </div>

        <section aria-labelledby="roles" className="mt-16">
          <h2 id="roles" className="text-2xl font-bold text-gray-900">Color roles</h2>
          <p className="mt-3 max-w-2xl text-gray-700">
            From the Color Property collection in the Figma file. Main blue stays the same in both modes because
            it always carries white text.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-surface">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Role</th>
                  <th scope="col" className="px-4 py-3 font-medium">Light</th>
                  <th scope="col" className="px-4 py-3 font-medium">Dark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {roles.map((r) => (
                  <tr key={r.role}>
                    <th scope="row" className="px-4 py-3 font-medium text-gray-900">{r.role}</th>
                    {[r.light, r.dark].map((hex, i) => (
                      <td key={i} className="px-4 py-3">
                        <span className="flex items-center gap-3">
                          <span aria-hidden="true" className="h-6 w-6 shrink-0 rounded border border-gray-300" style={{ background: hex }} />
                          <code className="font-mono-code text-xs text-gray-700">{hex}</code>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            Switch this whole site between modes with the sun and moon button in the header. Custom brand themes
            are not part of the foundation yet.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
