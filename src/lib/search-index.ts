import { componentGroup, components, hasReactCode, statusText } from "./components-data";
import { palettes, signal } from "./natuna-palette";

// Built on the server and handed to CommandSearch as a prop, so the browser gets these few fields
// instead of the whole component catalogue and palette modules.
export interface SearchEntry {
  href: string;
  title: string;
  group: string;
  note?: string;
  /** Extra words that should find this entry, such as an old alias ("tag" finds Chip). */
  keywords?: string;
}

const pages: SearchEntry[] = [
  { href: "/docs", title: "Introduction", group: "Page" },
  { href: "/foundation", title: "Foundation", group: "Page", note: "Color, type, number, effect" },
  { href: "/components", title: "Components overview", group: "Page" },
  { href: "/themes", title: "Themes", group: "Page", note: "Light and dark mode" },
  { href: "/naming", title: "Naming", group: "Page", note: "Property and page names", keywords: "property properties figma variant boolean show label tone state" },
  { href: "/privacy", title: "Privacy statement", group: "Page" },
  { href: "/foundation#accessibility", title: "Accessibility", group: "Section", note: "WCAG 2.2 AAA rules", keywords: "wcag aaa contrast a11y focus target size motion" },
  { href: "/themes", title: "Dark mode", group: "Section", note: "Themes", keywords: "dark light theme mode color roles" },
  { href: "/docs#use", title: "Using it today", group: "Section", note: "Figma file and React code", keywords: "install npm package react figma duplicate start setup" },
  { href: "/docs#status", title: "Component status", group: "Section", note: "Design status and In React", keywords: "status ready review progress planned tracker react code" },
  { href: "/docs#contribute", title: "Contributing", group: "Section", keywords: "issue bug github pull request contribute" },
];

// Tokens are searchable by every name a designer or engineer might type: the ramp name, the Tailwind
// class, the hex, or the Figma variable. They come after pages and components, so a word like "blue"
// still lists components first.
const tokens: SearchEntry[] = [
  {
    href: "/foundation#signal",
    title: signal.label,
    group: "Color token",
    note: signal.hex,
    keywords: `bg-${signal.token} text-${signal.token} ${signal.hex} ${signal.hex.slice(1)} signal accent color`,
  },
  ...palettes.flatMap((p) =>
    p.steps.map((s) => ({
      href: "/foundation#color",
      title: `${p.label} ${s.step}`,
      group: "Color token",
      note: s.hex,
      keywords: `${p.token}-${s.step} ${s.hex} ${s.hex.slice(1)} color`,
    })),
  ),
  ...[
    ["sm", 4],
    ["md", 8],
    ["xl", 16],
    ["2xl", 24],
    ["3xl", 32],
    ["full", 1920],
  ].map(([name, px]) => ({
    href: "/foundation#radius",
    title: `Rounded/${px}`,
    group: "Radius token",
    note: name === "full" ? "rounded-full" : `rounded-${name}, ${px}px`,
    keywords: `rounded-${name} radius corner`,
  })),
  ...["Header 1", "Header 2", "Subheader", "Body 1", "Body 2", "Caption 1", "Caption 2"].map((t) => ({
    href: "/foundation#typography",
    title: t,
    group: "Text style",
    keywords: "typography type font urbanist",
  })),
  ...["sm", "md", "lg", "xl"].map((s) => ({
    href: "/foundation#effect",
    title: `shadow-${s}`,
    group: "Effect token",
    keywords: "shadow elevation effect",
  })),
];

export const searchIndex: SearchEntry[] = [
  ...pages,
  ...components.map((c) => ({
    href: `/components/${c.slug}`,
    title: c.name,
    group: componentGroup(c.slug),
    note: hasReactCode(c.slug) ? `${statusText[c.status]}, In React` : statusText[c.status],
    keywords: hasReactCode(c.slug) ? `${c.tags.join(" ")} react code` : c.tags.join(" "),
  })),
  ...tokens,
];
