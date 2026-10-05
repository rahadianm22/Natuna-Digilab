import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NextPage from "@/components/NextPage";
import OnThisPage, { SectionChips } from "@/components/OnThisPage";
import Swatch from "@/components/Swatch";
import { palettes } from "@/lib/natuna-palette";
import { contrast } from "@/lib/contrast";

export const metadata: Metadata = {
  title: "Foundation",
  alternates: { canonical: "/foundation" },
  description: "Color, typography, radius, number, and effect tokens from the Natuna Digilab Foundation Design System v1.0.",
};

// Size / line height at mobile, tablet, website. Static class strings so Tailwind can see them.
const type = [
  {
    token: "Header 1",
    cls: "text-[24px] leading-[36px] md:text-[28px] md:leading-[40px] lg:text-[32px] lg:leading-[44px] font-bold",
    scale: ["24 / 36", "28 / 40", "32 / 44"],
    use: "One per page, the page title.",
  },
  {
    token: "Header 2",
    cls: "text-[20px] leading-[30px] md:text-[24px] md:leading-[36px] lg:text-[28px] lg:leading-[40px] font-bold",
    scale: ["20 / 30", "24 / 36", "28 / 40"],
    use: "Section titles.",
  },
  {
    token: "Subheader",
    cls: "text-[18px] leading-[26px] md:text-[20px] md:leading-[30px] lg:text-[24px] lg:leading-[36px] font-semibold",
    scale: ["18 / 26", "20 / 30", "24 / 36"],
    use: "Group titles inside a section.",
  },
  {
    token: "Body 1",
    cls: "text-[16px] leading-[24px] md:text-[18px] md:leading-[26px] font-medium",
    scale: ["16 / 24", "18 / 26", "18 / 26"],
    use: "Default reading text.",
  },
  {
    token: "Body 2",
    cls: "text-[14px] leading-[20px] font-medium",
    scale: ["14 / 20", "14 / 20", "14 / 20"],
    use: "Dense UI text and table cells.",
  },
  {
    token: "Caption 1",
    cls: "text-[12px] leading-[16px] lg:text-[14px] lg:leading-[20px] font-medium",
    scale: ["12 / 16", "12 / 16", "14 / 20"],
    use: "Labels, helper text, metadata.",
  },
  {
    token: "Caption 2",
    cls: "text-[10px] leading-[12px] lg:text-[12px] lg:leading-[16px] font-medium",
    scale: ["10 / 12", "10 / 12", "12 / 16"],
    use: "Smallest metadata. Avoid for anything users must read.",
  },
];

const weights = [
  { name: "Regular", cls: "font-normal" },
  { name: "Medium", cls: "font-medium" },
  { name: "Semibold", cls: "font-semibold" },
  { name: "Bold", cls: "font-bold" },
];

// px values from the Number System page. rem is px / 16.
const numbers = [
  0, 1, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 64, 72, 80, 96, 112, 128, 144, 160, 178,
  192, 208, 224, 240, 256, 288, 320, 384, 480, 560, 640, 720, 768, 1024, 1280, 1440, 1600, 1920,
];

// Number Variant page: the subsets of the scale that are published as variables, by purpose.
const variants = [
  {
    name: "Padding",
    token: "Number System/Padding",
    body: "Space around UI elements. It separates components and keeps the interface readable.",
    values: [0, 2, 4, 8, 10, 12, 16, 20, 24, 32, 40, 48, 52, 56, 64, 72, 80, 96, 112],
  },
  {
    name: "Rounded",
    token: "Number System/Rounded",
    body: "Corner radius for soft, approachable shapes. Full is the pill value, stored as 1920.",
    values: [0, 4, 8, 16, 20, 24, 32, 40, 48, "Full"],
  },
  {
    name: "Width & Height",
    token: "Number System/Width & Height",
    body: "Component dimensions. Consistent sizes keep layouts balanced and set visual hierarchy.",
    values: [0, 2, 4, 8, 10, 12, 16, 20, 24, 32, 40, 48, 52, 56, 64, 72, 80, 96],
  },
];

// Device page: frame sizes the system is designed against, width by height in px.
const devices = [
  { name: "Android", frames: [{ label: "Portrait", w: 440, h: 956 }] },
  {
    name: "Tablet",
    frames: [
      { label: "Portrait", w: 1024, h: 1366 },
      { label: "Landscape", w: 1280, h: 800 },
    ],
  },
  { name: "Desktop", frames: [{ label: "Default", w: 1440, h: 1024 }] },
];

// Each level is two stacked layers of #0d121c, taken from the Effect page.
const shadows = [
  { name: "shadow-sm", cls: "shadow-sm", layers: ["Y 1, blur 2, 6%", "Y 2, blur 4, 10%"] },
  { name: "shadow-md", cls: "shadow-md", layers: ["Y 2, blur 4, 8%", "Y 4, blur 8, 12%"] },
  { name: "shadow-lg", cls: "shadow-lg", layers: ["Y 4, blur 8, 10%", "Y 10, blur 20, 15%"] },
  { name: "shadow-xl", cls: "shadow-xl", layers: ["Y 8, blur 16, 12%", "Y 20, blur 40, 15%"] },
];

// The Effect page gives the range, blur 8 to blur 40. Only the ends are stated there.
const blurs = [
  { name: "blur-sm", px: 8 },
  { name: "blur-md", px: 16 },
  { name: "blur-lg", px: 24 },
  { name: "blur-xl", px: 40 },
];

const radii = [
  { name: "sm", px: "4px", cls: "rounded-sm", use: "Badges, checkboxes" },
  { name: "md", px: "8px", cls: "rounded-md", use: "Buttons, inputs" },
  { name: "xl", px: "16px", cls: "rounded-xl", use: "Cards, panels" },
  { name: "2xl", px: "24px", cls: "rounded-2xl", use: "Sheets, large surfaces" },
  { name: "3xl", px: "32px", cls: "rounded-3xl", use: "Hero surfaces" },
  { name: "full", px: "pill", cls: "rounded-full", use: "Avatars, toggles" },
];

// WCAG 2.2 AAA criteria the system commits to. Checked on every page by the axe tests (wcag2aaa).
const aaa = [
  { rule: "Text contrast", sc: "1.4.6 Contrast (Enhanced)", min: "7:1", how: "Body and secondary text use gray-900 and gray-700; links use blue-800. All clear 7:1 on canvas and surface, light and dark." },
  { rule: "Large text contrast", sc: "1.4.6 Contrast (Enhanced)", min: "4.5:1", how: "Applies at 24px, or 19px bold, and up. Headings meet 7:1 anyway." },
  { rule: "Text on fills", sc: "1.4.6 Contrast (Enhanced)", min: "7:1", how: "Brand fill is blue-800 #015099 (8.0:1 with white) and danger is red-800 #8c2b2c (8.4:1). Lime carries navy text only." },
  { rule: "Non-text contrast", sc: "1.4.11 Non-text Contrast", min: "3:1", how: "Input borders use gray-500 and the focus ring blue-600 (blue-400 in dark), all above 3:1 on their surface." },
  { rule: "Target size", sc: "2.5.5 Target Size (Enhanced)", min: "44 × 44px", how: "Buttons, links in lists, tabs and toggles are at least 44px tall on touch screens." },
  { rule: "Focus", sc: "2.4.13 Focus Appearance", min: "2px, 3:1", how: "A 2px outline with a 2px offset on every focusable element: blue-600 in light, blue-400 in dark, so it clears 3:1 on both surfaces." },
  { rule: "Motion", sc: "2.3.3 Animation from Interactions", min: "Can be turned off", how: "Every animation stops under prefers-reduced-motion; nothing essential depends on motion." },
  { rule: "Color alone", sc: "1.4.1 Use of Color", min: "Never", how: "Status always pairs color with a text label or a shape." },
];

const sections = [
  { id: "accessibility", label: "Accessibility" },
  { id: "color", label: "Color" },
  { id: "typography", label: "Typography" },
  { id: "number", label: "Number" },
  { id: "variants", label: "Number variables" },
  { id: "radius", label: "Radius" },
  { id: "device", label: "Device" },
  { id: "effect", label: "Effect" },
];

export default function FoundationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="Foundation" />
      <div className="mx-auto flex w-full max-w-7xl gap-16 px-6 pb-24 pt-14">
        <main id="main" tabIndex={-1} className="with-section-row min-w-0 flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Foundation</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-700">
            The tokens every component is drawn with, taken from the Foundation Design System v1.0 in Figma. Change
            a token and every component that uses it follows.
          </p>

          {/* Phones and tablets have no side navigation, so the sections sit in a sticky row instead. */}
          <SectionChips
            items={sections}
            label="Foundation sections"
            className="sticky top-16 z-20 -mx-6 mt-8 border-b border-gray-200 bg-canvas px-6 py-1.5 lg:hidden"
          />

          <section aria-labelledby="accessibility" className="mt-16 scroll-mt-40 lg:scroll-mt-24">
            <h2 id="accessibility" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Accessibility</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
              Natuna targets WCAG 2.2 level AAA wherever it is a property of the design: contrast, target size,
              focus, and motion. Every token below is chosen to pass it in light and in dark mode, and every page of
              this site is checked against it automatically.
            </p>
            <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-surface">
              <table className="w-full text-left text-sm">
                <thead className="hidden border-b border-gray-200 text-gray-700 sm:table-header-group">
                  <tr>
                    <th scope="col" className="w-[28%] px-4 py-3 font-medium">Rule</th>
                    <th scope="col" className="w-[18%] px-4 py-3 font-medium">Minimum</th>
                    <th scope="col" className="px-4 py-3 font-medium">How the system meets it</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {aaa.map((r) => (
                    <tr key={r.rule} className="block px-4 py-3 sm:table-row sm:p-0">
                      <th scope="row" className="block font-semibold text-gray-900 sm:table-cell sm:px-4 sm:py-3">
                        {r.rule}
                        <span className="block text-xs font-normal text-gray-700">{r.sc}</span>
                      </th>
                      <td className="mt-1 block font-semibold tabular-nums text-gray-900 sm:mt-0 sm:table-cell sm:px-4 sm:py-3">{r.min}</td>
                      <td className="mt-1 block text-gray-700 sm:mt-0 sm:table-cell sm:px-4 sm:py-3">{r.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section aria-labelledby="color" className="mt-16 scroll-mt-40 lg:scroll-mt-24">
            <h2 id="color" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Color</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
              Three brand ramps carry identity and five utility ramps carry meaning. Step 600 anchors each ramp.
              The ratio under each swatch is its contrast against white. Text needs 7:1, marked AAA. Steps that reach only 4.5:1 are marked AA and suit large text alone. The
              first AAA step differs per ramp: 800 for Azure and Imperial, 900 for Jade and Amber. Select a swatch to
              copy its hex.
            </p>
            <div className="mt-8 space-y-10">
              {palettes.map((p) => (
                <div key={p.token}>
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">{p.label}</h3>
                    <span className="text-sm text-gray-700">{p.group}</span>
                    <code className="ml-auto font-mono-code text-xs text-gray-700">{p.token}-50 … {p.token}-950</code>
                  </div>
                  {/* Phones get one scrolling row per ramp instead of three stacked rows. */}
                  <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-6 sm:gap-x-2 sm:gap-y-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-11">
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

          <section aria-labelledby="typography" className="mt-20 scroll-mt-40 lg:scroll-mt-24">
            <h2 id="typography" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Typography</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
              Urbanist, a geometric sans with open forms that stays legible at caption sizes. Each style has a
              size and line height for mobile, tablet, and website; line height opens up on larger screens. The
              samples below resize with your window. Four weights give emphasis without changing the size.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2" aria-label="Font weights">
              {weights.map((w) => (
                <li key={w.name} className={`${w.cls} text-lg text-gray-900`}>
                  {w.name}
                </li>
              ))}
            </ul>
            <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
              {type.map((t) => (
                <div key={t.token} className="grid gap-3 py-5 md:grid-cols-[1fr_16rem] md:items-baseline md:gap-8">
                  <div>
                    <div className={`${t.cls} text-gray-900`}>{t.token}: Send money to any account</div>
                    <div className="mt-1 text-sm text-gray-700">{t.use}</div>
                  </div>
                  <dl className="grid grid-cols-3 gap-2 font-mono-code text-xs text-gray-700">
                    {["Mobile", "Tablet", "Website"].map((device, i) => (
                      <div key={device}>
                        <dt className="font-sans text-gray-700">{device}</dt>
                        <dd className="text-gray-900">{t.scale[i]}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="number" className="mt-20 scroll-mt-40 lg:scroll-mt-24">
            <h2 id="number" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Number</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
              One numeric scale for spacing, sizing, and layout widths, so every gap is a value someone already
              named. Each step is given in px and rem, where 1rem is 16px.
            </p>
            <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Spacing and sizing</h3>
                <p className="mt-1 text-sm text-gray-700">0 to 160px. Bars are drawn at true size.</p>
                <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
                  {numbers
                    .filter((px) => px <= 160)
                    .map((px) => (
                      <li key={px} className="grid grid-cols-[3.5rem_4.5rem_1fr] items-center gap-3 py-1.5 text-sm">
                        <code className="font-mono-code text-gray-900">{px}px</code>
                        <span className="tabular-nums text-gray-700">{px / 16} rem</span>
                        <span aria-hidden="true" className="h-2.5 max-w-full rounded-sm bg-blue-600" style={{ width: Math.max(px, 1) }} />
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Layout widths</h3>
                <p className="mt-1 text-sm text-gray-700">178 to 1920px. Bars are relative to 1920px.</p>
                <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
                  {numbers
                    .filter((px) => px > 160)
                    .map((px) => (
                      <li key={px} className="grid grid-cols-[3.5rem_4.5rem_1fr] items-center gap-3 py-1.5 text-sm">
                        <code className="font-mono-code text-gray-900">{px}px</code>
                        <span className="tabular-nums text-gray-700">{px / 16} rem</span>
                        <span aria-hidden="true" className="h-2.5 rounded-sm bg-gray-400" style={{ width: `${(px / 1920) * 100}%` }} />
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="variants" className="mt-20 scroll-mt-40 lg:scroll-mt-24">
            <h2 id="variants" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Number variables</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
              The scale is published in Figma as three variable sets, each with only the steps that purpose needs.
              The token name is what you pick in the variable list.
            </p>
            <div className="mt-8 space-y-10">
              {variants.map((v) => (
                <div key={v.name}>
                  <h3 className="text-lg font-semibold text-gray-900">{v.name}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-700">{v.body}</p>
                  <code className="mt-2 block font-mono-code text-xs text-gray-700">{v.token}/{"{value}"}</code>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {v.values.map((n) => (
                      <li key={n} className="rounded-md border border-gray-200 bg-surface px-2.5 py-1 font-mono-code text-xs text-gray-900">
                        {n === 0 ? "Null" : typeof n === "number" ? `${n}px` : n}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="radius" className="mt-20 scroll-mt-40 lg:scroll-mt-24">
            <h2 id="radius" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Radius</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
              Larger surfaces take larger radii, so nesting stays visually consistent: an 8px button sits inside a
              16px card.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
              {radii.map((r) => (
                <li key={r.name}>
                  <div className={`h-20 w-20 border-2 border-blue-600 bg-blue-50 ${r.cls}`} />
                  <div className="mt-3 text-sm font-semibold text-gray-900">
                    {r.name} <span className="font-normal text-gray-700">{r.px}</span>
                  </div>
                  {/* The Figma variable name, so a token seen in a design or a hero callout can be found here. */}
                  <code className="block font-mono-code text-xs text-gray-700">
                    Rounded/{r.px === "pill" ? "1920" : r.px.replace("px", "")}
                  </code>
                  <div className="text-sm text-gray-700">{r.use}</div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="device" className="mt-20 scroll-mt-40 lg:scroll-mt-24">
            <h2 id="device" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Device</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
              Frame sizes the system is designed against. Padding and layout are set per device so content has room
              to breathe on every screen. All frames share one scale, so their sizes compare directly.
            </p>
            <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-8 rounded-2xl border border-gray-200 bg-canvas p-6">
              {devices.flatMap((d) =>
                d.frames.map((f) => (
                  <figure key={`${d.name}-${f.label}`} className="min-w-0">
                    <div
                      role="img"
                      aria-label={`${d.name} ${f.label} frame, ${f.w} by ${f.h} pixels`}
                      className="flex max-w-full items-center justify-center rounded-xl border-2 border-gray-300 bg-surface"
                      style={{ width: f.w / 6, aspectRatio: `${f.w} / ${f.h}` }}
                    >
                      <span className="text-xs tabular-nums text-gray-700">
                        {f.w} × {f.h}
                      </span>
                    </div>
                    <figcaption className="mt-3 text-sm">
                      <span className="font-semibold text-gray-900">{d.name}</span>{" "}
                      <span className="text-gray-700">{f.label.toLowerCase()}</span>
                    </figcaption>
                  </figure>
                )),
              )}
            </div>
          </section>

          <section aria-labelledby="effect" className="mt-20 scroll-mt-40 lg:scroll-mt-24">
            <h2 id="effect" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Effect</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">
              Shadow lifts cards, modals, and floating buttons off the page. Each level stacks two soft layers of
              the ink color at 6 to 15 percent opacity, so depth reads without a hard edge. Background blur
              softens what sits behind an overlay while keeping its context.
            </p>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">Shadow</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-700">
              Shadows are specified on light surfaces, so these samples stay light in both modes. In dark mode,
              elevation comes from a lighter surface instead.
            </p>
            <ul className="theme-light mt-4 grid grid-cols-1 gap-6 rounded-2xl p-1 sm:grid-cols-2 lg:grid-cols-4">
              {shadows.map((s) => (
                <li key={s.name} className="overflow-hidden rounded-2xl border border-gray-200 bg-surface">
                  <div className="flex h-36 items-center justify-center bg-gray-50">
                    <div aria-hidden="true" className={`${s.cls} h-20 w-20 rounded-xl bg-surface`} />
                  </div>
                  <div className="border-t border-gray-200 px-4 py-3">
                    <code className="font-mono-code text-sm font-semibold text-gray-900">{s.name}</code>
                    {s.layers.map((l) => (
                      <div key={l} className="mt-1 text-xs text-gray-700">{l}</div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 text-lg font-semibold text-gray-900">Background blur</h3>
            <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {blurs.map((b) => (
                <li key={b.name} className="overflow-hidden rounded-xl border border-gray-200 bg-surface">
                  {/* Real content behind the overlay, which is what the blur exists for. */}
                  <div aria-hidden="true" className="relative h-32 overflow-hidden bg-canvas">
                    <ul className="space-y-2 p-3 text-xs">
                      {[
                        ["Indomaret Cikini", "-Rp 125.000", "bg-red-100 text-red-900"],
                        ["Budi Santoso", "+Rp 500.000", "bg-emerald-100 text-emerald-900"],
                        ["PLN Token", "-Rp 200.000", "bg-amber-100 text-amber-900"],
                      ].map(([who, amount, tone]) => (
                        <li key={who} className="flex items-center gap-2">
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full font-semibold ${tone}`}>{who[0]}</span>
                          <span className="flex-1 truncate font-medium text-gray-900">{who}</span>
                          <span className="tabular-nums text-gray-700">{amount}</span>
                        </li>
                      ))}
                    </ul>
                    <div
                      className="absolute inset-x-4 bottom-3 top-10 flex items-center justify-center rounded-lg border border-white/30 bg-white/10"
                      style={{ backdropFilter: `blur(${b.px}px)`, WebkitBackdropFilter: `blur(${b.px}px)` }}
                    >
                      <span className="rounded-md bg-surface px-2 py-1 text-xs font-semibold text-gray-900">Overlay</span>
                    </div>
                  </div>
                  <div className="p-4 text-sm">
                    <span className="font-semibold text-gray-900">{b.name}</span>{" "}
                    <span className="text-gray-700">{b.px}px, fill 10%</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <NextPage href="/components" title="Components" note="Every component built from these tokens, with its status and usage rules." />
        </main>

        <OnThisPage items={sections} className="hidden w-40 lg:block" />
      </div>
      <Footer />
    </div>
  );
}
