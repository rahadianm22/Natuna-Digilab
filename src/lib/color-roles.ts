// Semantic color roles: what a component asks for, with the value it takes in each mode.
// The values are mirrored by the --color-role-* tokens in globals.css (the @theme static block for light,
// the .dark and .theme-dark block for dark). `from` names the fixed primitive ramp step that holds each value.
// Keep the two in step: a role page with wrong hex values is worse than none.

export type RoleGroup = "Background" | "Text" | "Border" | "Tone";

export interface ColorRole {
  /** The CSS variable name without the --color- prefix, so the Tailwind class is bg-role-bg-brand and so on. */
  token: string;
  /** The Figma role path. */
  figma: string;
  group: RoleGroup;
  use: string;
  light: string;
  dark: string;
  from: { light: string; dark: string };
}

const r = (
  token: string,
  figma: string,
  group: RoleGroup,
  use: string,
  light: string,
  lightFrom: string,
  dark: string,
  darkFrom: string,
): ColorRole => ({ token, figma, group, use, light, dark, from: { light: lightFrom, dark: darkFrom } });

export const colorRoles: ColorRole[] = [
  r("role-bg-canvas", "bg/canvas", "Background", "The page.", "#ffffff", "white", "#19212e", "gray/900"),
  r("role-bg-surface", "bg/surface", "Background", "Cards, fields, panels.", "#ffffff", "white", "#27303f", "gray/800"),
  r("role-bg-subtle", "bg/subtle", "Background", "Secondary button, disabled fill.", "#ebf0f4", "gray/100", "#364152", "gray/700"),
  r("role-bg-subtle-hover", "bg/subtle-hover", "Background", "Hover on a subtle fill.", "#d0d5dd", "gray/200", "#4b5565", "gray/600"),
  r("role-bg-hover", "bg/hover", "Background", "Hover on an unfilled control.", "#f1f5f9", "gray/50", "#27303f", "gray/800"),
  r("role-bg-brand", "bg/brand", "Background", "Primary action. Carries white text.", "#015099", "blue/800", "#015099", "blue/800"),
  r("role-bg-brand-hover", "bg/brand-hover", "Background", "Hover on the primary action.", "#013566", "blue/900", "#013566", "blue/900"),
  r("role-bg-danger", "bg/danger", "Background", "Destructive action. Carries white text.", "#8c2b2c", "red/800", "#8c2b2c", "red/800"),
  r("role-bg-danger-hover", "bg/danger-hover", "Background", "Hover on the destructive action.", "#5e1d1e", "red/900", "#5e1d1e", "red/900"),

  r("role-text-primary", "text/primary", "Text", "Default text.", "#19212e", "gray/900", "#f1f5f9", "gray/50"),
  r("role-text-secondary", "text/secondary", "Text", "Hints, labels, placeholders.", "#364152", "gray/700", "#d0d5dd", "gray/200"),
  r("role-text-strong", "text/strong", "Text", "Text on secondary and ghost buttons.", "#27303f", "gray/800", "#ebf0f4", "gray/100"),
  r("role-text-strong-hover", "text/strong-hover", "Text", "That text while hovered.", "#0d121c", "gray/950", "#ffffff", "white"),
  r("role-text-disabled", "text/disabled", "Text", "Text on a disabled control.", "#697586", "gray/500", "#cdd5df", "gray/300"),
  r("role-text-on-brand", "text/on-brand", "Text", "Text on a brand or danger fill.", "#ffffff", "white", "#ffffff", "white"),
  r("role-text-danger", "text/danger", "Text", "Error messages.", "#8c2b2c", "red/800", "#f7b6b7", "red/200"),
  r("role-text-link", "text/link", "Text", "Links.", "#015099", "blue/800", "#9aceff", "blue/200"),

  r("role-border-default", "border/default", "Border", "Dividers and card edges.", "#d0d5dd", "gray/200", "#4b5565", "gray/600"),
  r("role-border-input", "border/input", "Border", "Field and ghost button edges. 3:1 or more.", "#697586", "gray/500", "#cdd5df", "gray/300"),
  r("role-border-disabled", "border/disabled", "Border", "Edge of a disabled field.", "#cdd5df", "gray/300", "#697586", "gray/500"),
  r("role-border-focus", "border/focus", "Border", "Focus ring. 3:1 or more.", "#0276e3", "blue/600", "#359dff", "blue/400"),
  r("role-border-danger", "border/danger", "Border", "Edge and ring of an invalid field.", "#8c2b2c", "red/800", "#f7b6b7", "red/200"),

  r("role-bg-tone-neutral", "bg/tone/neutral", "Tone", "Neutral badge fill.", "#ebf0f4", "gray/100", "#364152", "gray/700"),
  r("role-text-tone-neutral", "text/tone/neutral", "Tone", "Neutral badge text.", "#364152", "gray/700", "#d0d5dd", "gray/200"),
  r("role-bg-tone-info", "bg/tone/info", "Tone", "Info badge and avatar fill.", "#d1e9ff", "blue/100", "#013566", "blue/900"),
  r("role-text-tone-info", "text/tone/info", "Tone", "Info badge and avatar text.", "#013566", "blue/900", "#d1e9ff", "blue/100"),
  r("role-bg-tone-success", "bg/tone/success", "Tone", "Success badge fill.", "#e5f4dd", "emerald/100", "#25490f", "emerald/900"),
  r("role-text-tone-success", "text/tone/success", "Tone", "Success badge text.", "#25490f", "emerald/900", "#d4ecc5", "emerald/200"),
  r("role-bg-tone-warning", "bg/tone/warning", "Tone", "Warning badge fill.", "#fef2d2", "amber/100", "#644800", "amber/900"),
  r("role-text-tone-warning", "text/tone/warning", "Tone", "Warning badge text.", "#644800", "amber/900", "#fef2d2", "amber/100"),
  r("role-bg-tone-danger", "bg/tone/danger", "Tone", "Danger badge fill.", "#fbdadb", "red/100", "#5e1d1e", "red/900"),
  r("role-text-tone-danger", "text/tone/danger", "Tone", "Danger badge text.", "#5e1d1e", "red/900", "#fbdadb", "red/100"),
];

export const roleByToken = Object.fromEntries(colorRoles.map((x) => [x.token, x])) as Record<string, ColorRole>;
