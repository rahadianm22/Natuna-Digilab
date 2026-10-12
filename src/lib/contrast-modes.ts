import { contrast } from "@/lib/contrast";
import type { Palette } from "@/lib/natuna-palette";

// Page canvas in each mode. Dark canvas is gray-900.
export const LIGHT_CANVAS = "#ffffff";
export const DARK_CANVAS = "#19212e";

// WCAG thresholds, kept in one place so no page retypes them.
export const AAA_TEXT = 7;
export const AA_TEXT = 4.5;
export const UI_MIN = 3;

/** Short label shown next to a swatch ratio. Empty when the step is not text-safe. */
export function textLabel(ratio: number): "AAA" | "AA" | "" {
  if (ratio >= AAA_TEXT) return "AAA";
  if (ratio >= AA_TEXT) return "AA";
  return "";
}

/** Plain-language note for how an anchor step may be used. */
export function anchorNote(ratio: number): string {
  if (ratio >= AAA_TEXT) return "AAA text";
  if (ratio >= AA_TEXT) return "AA text";
  if (ratio >= UI_MIN) return "large text only";
  return "fills only";
}

export interface TextSafeRow {
  label: string;
  anchorRatio: number;
  anchorNote: string;
  uiFrom: string;
  aaFrom: string;
  aaaFrom: string;
  darkAaaTo: string;
}

const NONE = "None";

/** Every cell of the Text-safe steps table, computed from the ramp. Steps run lightest to darkest. */
export function textSafeRow(p: Palette): TextSafeRow {
  const onWhite = p.steps.map((s) => ({ step: s.step, r: contrast(s.hex, LIGHT_CANVAS) }));
  const from = (min: number) => onWhite.find((s) => s.r >= min)?.step ?? NONE;
  const anchor = p.steps.find((s) => s.step === "600");
  const anchorRatio = anchor ? contrast(anchor.hex, LIGHT_CANVAS) : 0;
  const darkSafe = p.steps.filter((s) => contrast(s.hex, DARK_CANVAS) >= AAA_TEXT);
  const darkTop = darkSafe[darkSafe.length - 1]?.step;
  return {
    label: p.label,
    anchorRatio,
    anchorNote: anchorNote(anchorRatio),
    uiFrom: from(UI_MIN),
    aaFrom: from(AA_TEXT),
    aaaFrom: from(AAA_TEXT),
    darkAaaTo: darkTop ? `≤ ${darkTop}` : NONE,
  };
}
