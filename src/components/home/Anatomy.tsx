"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/ui";

type State = "default" | "hover" | "pressed" | "loading" | "disabled";
type Part = "fill" | "label" | "corner" | "height" | "padding";

const states: State[] = ["default", "hover", "pressed", "loading", "disabled"];

// What each part of the button is made of, per state. Values match src/ui/button.tsx and globals.css.
function tokens(state: State): { part: Part; name: string; token: string; swatch?: string }[] {
  const off = state === "disabled";
  const fill =
    off ? { token: "gray-100", swatch: "#ebf0f4" }
    : state === "hover" || state === "pressed" ? { token: "brand-hover", swatch: "#015099" }
    : { token: "brand", swatch: "#026acc" };
  return [
    { part: "fill", name: "Fill", ...fill },
    { part: "label", name: "Label", token: off ? "Body 1, Medium, gray-500" : "Body 1, Medium, white" },
    { part: "corner", name: "Corner", token: "Rounded/8" },
    { part: "height", name: "Height", token: "Width & Height/48" },
    { part: "padding", name: "Side padding", token: "Padding/24" },
  ];
}

const RED = "#d64748";

/**
 * A real Button, drawn large, with each part traceable to the token that sets it. Hovering or focusing
 * a token marks the part with a spec line, the way a redline in the Figma file would.
 */
export default function Anatomy() {
  const [state, setState] = useState<State>("default");
  const [active, setActive] = useState<Part | null>("fill");
  const box = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState({ w: 0, h: 48, labelX: 0, labelW: 0 });

  // Measure the button and its label in the button's own coordinates, before the 2x scale is applied.
  useLayoutEffect(() => {
    const button = box.current?.querySelector("button");
    const label = box.current?.querySelector<HTMLElement>("[data-part=label]");
    if (!button || !label) return;
    setGeo({ w: button.offsetWidth, h: button.offsetHeight, labelX: label.offsetLeft, labelW: label.offsetWidth });
  }, [state]);

  const list = tokens(state);
  const look = state === "hover" ? "bg-brand-hover!" : state === "pressed" ? "bg-brand-hover! scale-[0.97]" : "";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
      <div>
        <div className="flex h-64 items-center justify-center overflow-hidden rounded-3xl bg-gray-50 sm:h-80">
          <div ref={box} className="relative origin-center scale-[1.6] sm:scale-[2.2]" aria-hidden="true" inert>
            <Button size="lg" loading={state === "loading"} disabled={state === "disabled"} className={look} tabIndex={-1}>
              <span data-part="label">Pay Rp&nbsp;412.500</span>
            </Button>

            {/* Spec overlays, in the button's own coordinates so they scale with it. */}
            <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={geo.w} height={geo.h}>
              {active === "fill" && <rect x={-2} y={-2} width={geo.w + 4} height={geo.h + 4} rx={10} fill="none" stroke={RED} strokeWidth={1} strokeDasharray="3 2" />}
              {active === "label" && (
                <rect x={geo.labelX - 2} y={geo.h / 2 - 11} width={geo.labelW + 4} height={22} fill="none" stroke={RED} strokeWidth={1} strokeDasharray="3 2" />
              )}
              {active === "corner" && <path d="M 0 14 L 0 8 Q 0 0 8 0 L 14 0" fill="none" stroke={RED} strokeWidth={1.5} />}
              {active === "height" && (
                <g stroke={RED} strokeWidth={1}>
                  <line x1={geo.w + 8} y1={0} x2={geo.w + 8} y2={geo.h} />
                  <line x1={geo.w + 5} y1={0} x2={geo.w + 11} y2={0} />
                  <line x1={geo.w + 5} y1={geo.h} x2={geo.w + 11} y2={geo.h} />
                  <text x={geo.w + 14} y={geo.h / 2 + 3} fontSize={8} fill={RED} stroke="none">48</text>
                </g>
              )}
              {active === "padding" && (
                <g>
                  <rect x={0} y={0} width={24} height={geo.h} fill={RED} fillOpacity={0.14} />
                  <rect x={geo.w - 24} y={0} width={24} height={geo.h} fill={RED} fillOpacity={0.14} />
                  <text x={12} y={geo.h + 10} fontSize={7} fill={RED} textAnchor="middle">24</text>
                </g>
              )}
            </svg>
          </div>
        </div>

        <div role="group" aria-label="Button state" className="mt-4 flex flex-wrap gap-1 rounded-lg bg-gray-100 p-0.5 text-gray-700 sm:w-fit">
          {states.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={state === s}
              onClick={() => setState(s)}
              className="min-h-11 flex-1 rounded-md px-3 text-sm font-medium capitalize transition-colors hover:text-gray-900 aria-pressed:bg-surface aria-pressed:text-gray-900 aria-pressed:shadow-sm sm:min-h-9 sm:flex-none"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <ul aria-label="Tokens in this button" className="divide-y divide-gray-200 border-y border-gray-200">
        {list.map((t) => {
          const on = active === t.part;
          return (
            <li key={t.part}>
              <button
                type="button"
                aria-pressed={on}
                onMouseEnter={() => setActive(t.part)}
                onFocus={() => setActive(t.part)}
                onClick={() => setActive(t.part)}
                className="group flex min-h-14 w-full items-center gap-4 py-3 text-left"
              >
                <span aria-hidden="true" className={`h-8 w-1 shrink-0 rounded-full transition-colors ${on ? "bg-[#d64748]" : "bg-gray-200"}`} />
                <span className="flex-1">
                  <span className="block text-sm text-gray-600">{t.name}</span>
                  <span className={`block font-semibold transition-colors ${on ? "text-gray-900" : "text-gray-700"}`}>{t.token}</span>
                </span>
                {t.swatch && (
                  <span className="flex items-center gap-2 font-mono-code text-xs text-gray-600">
                    <span aria-hidden="true" className="h-5 w-5 rounded-md border border-gray-300" style={{ background: t.swatch }} />
                    {t.swatch}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
