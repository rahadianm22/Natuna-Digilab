// Raw Natuna Foundation palette values (Figma "Color" collection), independent of light/dark mode.
// Mirrors the @theme ramps in globals.css; use it wherever the real hex must be shown.

export interface Palette {
  token: string;
  label: string;
  group: "Brand" | "Utility";
  steps: { step: string; hex: string }[];
}

export const palettes: Palette[] = [
  {
    token: "blue",
    label: "Azure Blue",
    group: "Brand",
    steps: [
      { step: "50", hex: "#e5f3ff" },
      { step: "100", hex: "#d1e9ff" },
      { step: "200", hex: "#9aceff" },
      { step: "300", hex: "#67b6ff" },
      { step: "400", hex: "#359dff" },
      { step: "500", hex: "#0285ff" },
      { step: "600", hex: "#0276e3" },
      { step: "700", hex: "#026acc" },
      { step: "800", hex: "#015099" },
      { step: "900", hex: "#013566" },
      { step: "950", hex: "#001b33" },
    ],
  },
  {
    token: "orange",
    label: "Tomato Red",
    group: "Brand",
    steps: [
      { step: "50", hex: "#ffe9e5" },
      { step: "100", hex: "#ffd7d1" },
      { step: "200", hex: "#ffc1b7" },
      { step: "300", hex: "#ffa293" },
      { step: "400", hex: "#ff836f" },
      { step: "500", hex: "#ff644b" },
      { step: "600", hex: "#e04b33" },
      { step: "700", hex: "#cc503c" },
      { step: "800", hex: "#993c2d" },
      { step: "900", hex: "#66281e" },
      { step: "950", hex: "#33140f" },
    ],
  },
  {
    token: "gray",
    label: "Slate Gray",
    group: "Brand",
    steps: [
      { step: "50", hex: "#f1f5f9" },
      { step: "100", hex: "#ebf0f4" },
      { step: "200", hex: "#d0d5dd" },
      { step: "300", hex: "#cdd5df" },
      { step: "400", hex: "#9aa4b2" },
      { step: "500", hex: "#697586" },
      { step: "600", hex: "#4b5565" },
      { step: "700", hex: "#364152" },
      { step: "800", hex: "#27303f" },
      { step: "900", hex: "#19212e" },
      { step: "950", hex: "#0d121c" },
    ],
  },
  {
    token: "teal",
    label: "Sky Blue",
    group: "Utility",
    steps: [
      { step: "50", hex: "#f0f9ff" },
      { step: "100", hex: "#d1edff" },
      { step: "200", hex: "#b2e2ff" },
      { step: "300", hex: "#85d0ff" },
      { step: "400", hex: "#52bdff" },
      { step: "500", hex: "#24abff" },
      { step: "600", hex: "#129df3" },
      { step: "700", hex: "#0091eb" },
      { step: "800", hex: "#0078c2" },
      { step: "900", hex: "#00629e" },
      { step: "950", hex: "#003f66" },
    ],
  },
  {
    token: "emerald",
    label: "Jade Green",
    group: "Utility",
    steps: [
      { step: "50", hex: "#f7fbf3" },
      { step: "100", hex: "#e5f4dd" },
      { step: "200", hex: "#d4ecc5" },
      { step: "300", hex: "#aad98c" },
      { step: "400", hex: "#7dc551" },
      { step: "500", hex: "#5db725" },
      { step: "600", hex: "#54a522" },
      { step: "700", hex: "#4a921e" },
      { step: "800", hex: "#386e16" },
      { step: "900", hex: "#25490f" },
      { step: "950", hex: "#132507" },
    ],
  },
  {
    token: "amber",
    label: "Amber Yellow",
    group: "Utility",
    steps: [
      { step: "50", hex: "#fffbf0" },
      { step: "100", hex: "#fef2d2" },
      { step: "200", hex: "#fde5a5" },
      { step: "300", hex: "#fcd97d" },
      { step: "400", hex: "#fac233" },
      { step: "500", hex: "#fab400" },
      { step: "600", hex: "#e0a200" },
      { step: "700", hex: "#c89000" },
      { step: "800", hex: "#966c00" },
      { step: "900", hex: "#644800" },
      { step: "950", hex: "#322400" },
    ],
  },
  {
    token: "red",
    label: "Imperial Red",
    group: "Utility",
    steps: [
      { step: "50", hex: "#fef1f2" },
      { step: "100", hex: "#fbdadb" },
      { step: "200", hex: "#f7b6b7" },
      { step: "300", hex: "#f29192" },
      { step: "400", hex: "#ee6d6e" },
      { step: "500", hex: "#ea484a" },
      { step: "600", hex: "#d64748" },
      { step: "700", hex: "#bb3a3b" },
      { step: "800", hex: "#8c2b2c" },
      { step: "900", hex: "#5e1d1e" },
      { step: "950", hex: "#2f0e0f" },
    ],
  },
  {
    token: "violet",
    label: "Amethyst Purple",
    group: "Utility",
    steps: [
      { step: "50", hex: "#f5edff" },
      { step: "100", hex: "#dfc6ff" },
      { step: "200", hex: "#cfaaff" },
      { step: "300", hex: "#b984ff" },
      { step: "400", hex: "#ac6cff" },
      { step: "500", hex: "#9747ff" },
      { step: "600", hex: "#8941e8" },
      { step: "700", hex: "#6b32b5" },
      { step: "800", hex: "#53278c" },
      { step: "900", hex: "#3f1e6b" },
      { step: "950", hex: "#261240" },
    ],
  },
];

// The Signal accent: one flat color for a single marked step or state on dark navy. Not a ramp.
export const signal = {
  token: "lime",
  label: "Signal Lime",
  hex: "#c6f432",
  onNavy: "#0b1220",
};
