import Link from "next/link";
import type { CSSProperties } from "react";
import { Code, FigmaLogo } from "@phosphor-icons/react/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/home/Reveal";
import LiveSpecimen from "@/components/home/LiveSpecimen";
import Anatomy from "@/components/home/Anatomy";
import BuildGrid from "@/components/home/BuildGrid";
import LayersDemo from "@/components/home/LayersDemo";
import { buttonStyles } from "@/ui";
import { componentDocs } from "@/lib/component-docs";
import { lastBuildDay, tracker } from "@/lib/natuna-tracker";
import { FIGMA_COMMUNITY_URL, TRACKER_SNAPSHOT } from "@/lib/site";

const ready = tracker.filter((t) => t.status === "Selesai").length;
const inProgress = tracker.filter((t) => t.status === "OnProgress" || t.status === "On Review").length;
const inCode = Object.keys(componentDocs).length;
const days = lastBuildDay();

const h2 = "text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl sm:leading-[1.08]";
const lead = "mt-5 max-w-xl text-lg leading-relaxed text-gray-600";

/*
  The home page makes one argument and then proves it: set a token once and it holds everywhere.
  Each section is a working piece of the system, not a picture of it: the bills screen re-types and
  re-colors itself, the button is traced to its tokens, the build grid is the tracker, and the layer
  list is what the Figma export really produces.
*/
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="" />

      <main id="main" tabIndex={-1} className="w-full overflow-x-clip">
        <section aria-labelledby="hero" className="mx-auto w-full max-w-7xl px-6 pt-14 sm:pt-20">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16">
            <h1 id="hero" className="display rise font-extrabold text-gray-900">
              Tokens that hold from 440 to 1440.
            </h1>
            <div className="rise lg:pb-2" style={{ "--d": "100ms" } as CSSProperties}>
              <p className="text-lg leading-relaxed text-gray-600">
                Natuna Digilab is the design system for Indonesian digital products. Type, color, and spacing are
                set once in Figma and carried by every component, on every screen size and in both modes. The
                screen below is built from it.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/components" className={`${buttonStyles({ size: "lg" })} w-full sm:w-auto`}>
                  Browse components
                </Link>
                <Link href="/docs" className={`${buttonStyles({ variant: "ghost", size: "lg" })} w-full sm:w-auto`}>
                  Read the introduction
                </Link>
              </div>
            </div>
          </div>

          <div className="rise mt-12 sm:mt-16" style={{ "--d": "200ms" } as CSSProperties}>
            <LiveSpecimen />
          </div>
        </section>

        <Reveal>
          <section aria-labelledby="anatomy" className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
            <div className="max-w-3xl">
              <h2 id="anatomy" className={h2}>
                Every part of a component traces back to a token.
              </h2>
              <p className={lead}>
                Point at a token to see the part it sets. Change the state and watch which values move: the fill
                darkens on hover, the button shrinks a little on press, and the gray of disabled replaces the brand.
              </p>
            </div>
            <div className="mt-12">
              <Anatomy />
            </div>
          </section>
        </Reveal>

        {/* Always dark: a pause in the page's rhythm, and the one band where the data is the design. */}
        <section aria-labelledby="build" className="theme-dark bg-[#0d121c]">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1fr_1.6fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-7xl font-extrabold leading-none tracking-tight text-white tabular-nums sm:text-8xl">
                {ready}
                <span className="text-4xl text-gray-600 sm:text-5xl">/{tracker.length}</span>
              </p>
              <h2 id="build" className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Components ready, out of a {days}-day build plan.
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-gray-600">
                Each square is one component from the tracker, placed on its build day. {inProgress} are in progress now.
                Snapshot of {TRACKER_SNAPSHOT}.
              </p>
              <ul aria-label="Legend" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-[3px] bg-emerald-500" />Ready</li>
                <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-[3px] bg-amber-400" />In progress</li>
                <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-[3px] bg-white/[0.07] ring-1 ring-inset ring-white/30" />Planned</li>
              </ul>
              <Link href="/components" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-white underline underline-offset-4 hover:text-[#9aceff]">
                See every component and its status
              </Link>
            </div>
            <BuildGrid />
          </div>
        </section>

        <Reveal>
          <section aria-labelledby="layers" className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
            <div className="max-w-3xl">
              <h2 id="layers" className={h2}>
                Paste into Figma as layers, not as a picture.
              </h2>
              <p className={lead}>
                Every preview on this site copies to Figma as named, editable layers. The list on the right is
                read from the export of this card, made when the page loaded.
              </p>
            </div>
            <div className="mt-12">
              <LayersDemo />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section aria-labelledby="start" className="mx-auto w-full max-w-7xl px-6 pb-24 sm:pb-32">
            <h2 id="start" className={h2}>
              Start where you work.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="flex flex-col rounded-3xl border border-gray-200 p-7 sm:p-9">
                <FigmaLogo size={28} aria-hidden="true" className="text-gray-900" />
                <h3 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">In Figma</h3>
                <p className="mt-3 flex-1 leading-relaxed text-gray-600">
                  Duplicate the Foundation Design System from Figma Community. Its variables and components are the
                  source every page on this site is drawn from.
                </p>
                <a href={FIGMA_COMMUNITY_URL} target="_blank" rel="noreferrer" className={`${buttonStyles({ size: "lg" })} mt-8 w-full sm:w-auto sm:self-start`}>
                  Open in Figma Community
                </a>
              </div>
              <div className="flex flex-col rounded-3xl border border-gray-200 p-7 sm:p-9">
                <Code size={28} aria-hidden="true" className="text-gray-900" />
                <h3 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">In code</h3>
                <p className="mt-3 flex-1 leading-relaxed text-gray-600">
                  {inCode} components ship as React in <code className="font-mono-code text-[15px] text-gray-900">src/ui</code> today. Copy them
                  from their pages, imports included. The package is not on npm yet.
                </p>
                <Link href="/components/button" className={`${buttonStyles({ variant: "ghost", size: "lg" })} mt-8 w-full sm:w-auto sm:self-start`}>
                  See Button in code
                </Link>
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
