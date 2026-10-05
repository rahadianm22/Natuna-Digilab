import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NextPage from "@/components/NextPage";
import { contrast } from "@/lib/contrast";
import { colorRoles } from "@/lib/color-roles";
import { Badge } from "@/ui";

export const metadata: Metadata = {
  title: "Themes",
  alternates: { canonical: "/themes" },
  description: "Light and dark mode from the Natuna Digilab Foundation Design System color tokens.",
};

const groups = ["Background", "Text", "Border", "Tone"] as const;

function Specimen({ mode }: { mode: "light" | "dark" }) {
  return (
    <figure className={`theme-${mode} rounded-xl border border-gray-200 p-5 sm:p-6`}>
      <figcaption className="text-sm font-semibold text-gray-900">{mode === "light" ? "Light mode" : "Dark mode"}</figcaption>
      <div inert className="mt-4 rounded-xl border border-gray-200 bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold text-gray-900">Electricity bill</div>
            <div className="text-sm text-gray-700">Due 12 Oct</div>
          </div>
          <Badge tone="warning">Pending</Badge>
        </div>
        <div className="mt-4 text-2xl font-bold tabular-nums text-gray-900">Rp 412.500</div>
        <div className="mt-5 flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-700">Note</span>
          <span className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700">Add a note</span>
        </div>
        <div className="mt-5 flex gap-2">
          <span className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white">Pay now</span>
          <span className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800">Later</span>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          Paid bills move to <span className="text-blue-800 underline">history</span>.
        </p>
      </div>
    </figure>
  );
}

export default function ThemesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="Themes" />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 pt-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Themes</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-700">
          Light and dark mode come from the same tokens. Components ask for a role, such as bg/surface or text/primary, and the mode decides the value. The same card is rendered in both modes below.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Specimen mode="light" />
          <Specimen mode="dark" />
        </div>

        <section aria-labelledby="roles" className="mt-16">
          <h2 id="roles" className="type-h2 font-bold tracking-tight text-gray-900">Color roles</h2>
          <p className="mt-3 max-w-2xl text-gray-700">
            The values each role takes in light and dark, each one a --color-role-* token that holds its own value in both modes, so a copied component needs no dark-mode rewrite of the ramps. bg/brand and bg/danger stay put in both modes
            because they carry white text: {contrast("#ffffff", "#015099").toFixed(2)}:1 and{" "}
            {contrast("#ffffff", "#8c2b2c").toFixed(2)}:1. text/link lightens in dark mode to stay readable on the
            dark surface.
          </p>
          <div className="mt-6 rounded-xl border border-gray-200 bg-surface">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-700">
                <tr>
                  <th scope="col" className="w-[42%] px-3 py-3 font-medium sm:px-4">Role</th>
                  <th scope="col" className="px-3 py-3 font-medium sm:px-4">Light</th>
                  <th scope="col" className="px-3 py-3 font-medium sm:px-4">Dark</th>
                </tr>
              </thead>
              {groups.map((g) => (
                <tbody key={g} className="divide-y divide-gray-200 border-t border-gray-200 first:border-t-0">
                  <tr>
                    <th scope="rowgroup" colSpan={3} className="bg-well px-3 py-2 text-left text-xs font-semibold text-gray-900 sm:px-4">
                      {g}
                    </th>
                  </tr>
                  {colorRoles
                    .filter((r) => r.group === g)
                    .map((r) => (
                      <tr key={r.token}>
                        <th scope="row" className="px-3 py-3 align-top font-medium text-gray-900 sm:px-4">
                          {r.figma}
                          <code className="mt-0.5 block break-all font-mono-code text-xs font-normal text-gray-700">--color-{r.token}</code>
                          <span className="mt-0.5 block text-xs font-normal text-gray-700">{r.use}</span>
                        </th>
                        {(["light", "dark"] as const).map((mode) => (
                          <td key={mode} className="px-3 py-3 align-top sm:px-4">
                            <span className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                              <span aria-hidden="true" className="h-6 w-6 shrink-0 rounded border border-gray-300" style={{ background: r[mode] }} />
                              <span className="flex flex-col">
                                <code className="font-mono-code text-xs text-gray-700">{r[mode]}</code>
                                <span className="text-xs text-gray-700">{r.from[mode]}</span>
                              </span>
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              ))}
            </table>
          </div>
          <p className="mt-6 text-sm text-gray-700">
            Switch this whole site between modes with the sun and moon button in the header. Custom brand themes
            are not part of the foundation yet.
          </p>
        </section>
        <NextPage href="/components" title="Components" note="See each component in the mode you have switched to." />
      </main>
      <Footer />
    </div>
  );
}
