import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Swatch from "@/components/Swatch";
import { palettes } from "@/lib/natuna-palette";
import { contrast } from "@/lib/contrast";

export const metadata: Metadata = {
  title: "Foundation",
  description: "Color, typography, and radius tokens from the Natuna Digilab Foundation Design System v1.0.",
};

const type = [
  { token: "Header 1", cls: "text-2xl font-bold", spec: "24 / 36, Bold", use: "One per page, the page title." },
  { token: "Header 2", cls: "text-xl font-bold", spec: "20 / 30, Bold", use: "Section titles." },
  { token: "Subheader", cls: "text-lg font-semibold", spec: "18 / 26, Semibold", use: "Group titles inside a section." },
  { token: "Body 1", cls: "text-base font-medium", spec: "16 / 24, Medium", use: "Default reading text." },
  { token: "Body 2", cls: "text-sm font-medium", spec: "14 / 20, Medium", use: "Dense UI text and table cells." },
  { token: "Caption 1", cls: "text-xs font-medium", spec: "12 / 16, Medium", use: "Labels, helper text, metadata." },
];

const radii = [
  { name: "sm", px: "4px", cls: "rounded-sm", use: "Badges, checkboxes" },
  { name: "md", px: "8px", cls: "rounded-md", use: "Buttons, inputs" },
  { name: "xl", px: "16px", cls: "rounded-xl", use: "Cards, panels" },
  { name: "2xl", px: "24px", cls: "rounded-2xl", use: "Sheets, large surfaces" },
  { name: "3xl", px: "32px", cls: "rounded-3xl", use: "Hero surfaces" },
  { name: "full", px: "pill", cls: "rounded-full", use: "Avatars, toggles" },
];

const sections = [
  { id: "color", label: "Color" },
  { id: "typography", label: "Typography" },
  { id: "radius", label: "Radius" },
];

export default function FoundationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="Foundation" />
      <div className="mx-auto flex w-full max-w-6xl gap-16 px-6 pb-24 pt-14">
        <main className="min-w-0 flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Foundation</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            The tokens every component is drawn with, taken from the Foundation Design System v1.0 in Figma. Change
            a token and every component that uses it follows.
          </p>

          <section aria-labelledby="color" className="mt-16 scroll-mt-24">
            <h2 id="color" className="text-3xl font-bold tracking-tight text-gray-900">Color</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
              Three brand ramps carry identity and five utility ramps carry meaning. Step 600 anchors each ramp.
              The ratio under each swatch is its contrast against white. Small text needs 4.5:1, marked AA, and the
              step that reaches it differs per ramp: 700 for Azure, 800 for Jade and Amber. Select a swatch to
              copy its hex.
            </p>
            <div className="mt-8 space-y-10">
              {palettes.map((p) => (
                <div key={p.token}>
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">{p.label}</h3>
                    <span className="text-sm text-gray-600">{p.group}</span>
                    <code className="ml-auto font-mono-code text-xs text-gray-600">{p.token}-50 … {p.token}-950</code>
                  </div>
                  <div className="grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-6 lg:grid-cols-11">
                    {p.steps.map(({ step, hex }) => (
                      <Swatch
                        key={step}
                        step={step}
                        hex={hex}
                        anchor={step === "600"}
                        onWhite={contrast(hex, "#ffffff")}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="typography" className="mt-20 scroll-mt-24">
            <h2 id="typography" className="text-3xl font-bold tracking-tight text-gray-900">Typography</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
              Urbanist, a geometric sans with open forms that stays legible at caption sizes. Sizes below are the
              mobile scale; tablet and desktop step up in the Figma file.
            </p>
            <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
              {type.map((t) => (
                <div key={t.token} className="grid gap-2 py-5 md:grid-cols-[1fr_12rem] md:items-baseline md:gap-8">
                  <div>
                    <div className={`${t.cls} text-gray-900`}>{t.token}: Kirim uang ke rekening mana saja</div>
                    <div className="mt-1 text-sm text-gray-600">{t.use}</div>
                  </div>
                  <code className="font-mono-code text-xs text-gray-600 md:text-right">{t.spec}</code>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="radius" className="mt-20 scroll-mt-24">
            <h2 id="radius" className="text-3xl font-bold tracking-tight text-gray-900">Radius</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
              Larger surfaces take larger radii, so nesting stays visually consistent: an 8px button sits inside a
              16px card.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
              {radii.map((r) => (
                <li key={r.name}>
                  <div className={`h-20 w-20 border-2 border-blue-600 bg-blue-50 ${r.cls}`} />
                  <div className="mt-3 text-sm font-semibold text-gray-900">
                    {r.name} <span className="font-normal text-gray-600">{r.px}</span>
                  </div>
                  <div className="text-sm text-gray-600">{r.use}</div>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <nav aria-label="On this page" className="sticky top-24 hidden h-fit w-40 shrink-0 lg:block">
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
