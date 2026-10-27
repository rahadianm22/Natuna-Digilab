// The Natuna Build Report, as the Figma build plugin printed it on 15 October 2026. Copied by hand from the
// report frame: keep it in step with the frame, never edit a number here without the report behind it.

export interface BuiltComponent {
  name: string;
  variants: number;
  /** Page on this site, when there is one. */
  slug?: string;
}

export const buildReport = {
  date: "15 October 2026, 19:58",
  seconds: 14539,
  foundation: "Natuna v1.1",
  font: "Urbanist",
  semanticTokens: 47,
  colorsBound: 36509,
  rawHex: 0,
  numbersBound: 97488,
  textStyles: 57,
  legacyTextStyles: ["Heading/XL", "Heading/L", "Heading/M", "Heading/S", "Body/L", "Body/M", "Body/S", "Body/XS", "Label/L", "Label/M", "Label/S", "Label/XS", "Emphasis/M", "Emphasis/S"],
  effectStyles: ["Focus Ring", "Shadow/SM", "Shadow/MD", "Shadow/LG", "Shadow/XL", "Blur/SM", "Blur/MD", "Blur/LG", "Blur/XL"],
  icons: { set: "Phosphor Icons 2.1", count: 9072, weights: "Regular & Fill" },
  reused: ["Button", "Avatar"],
  // Mappings the build used where Foundation v1.1 has no token yet.
  interim: [
    { from: "text/disabled", to: "text/neutral/tertiary at 60%", why: "v1.1 has no disabled token yet" },
    { from: "bg/primary-hover", to: "bg/brand/primary-strong at 88%", why: "v1.1 has no hover token yet" },
    { from: "bg/muted-hover", to: "bg/neutral/surface", why: "v1.1 has no hover token yet" },
    { from: "bg/inverse", to: "text/neutral/primary as a fill", why: "for the dark tooltip and cover; it turns light in dark mode by itself" },
  ],
  components: [
    { name: "Checkbox", variants: 45, slug: "checkbox" },
    { name: "Radio Button", variants: 30, slug: "radio-button" },
    { name: "Badge", variants: 36, slug: "badge" },
    { name: "Label Text", variants: 27, slug: "label-text" },
    { name: "Separator", variants: 6, slug: "separator" },
    { name: "Toggle", variants: 24, slug: "toggle" },
    { name: "Breadcrumbs", variants: 18, slug: "breadcrumbs" },
    { name: "Changelog", variants: 8, slug: "changelog" },
    { name: "Comment", variants: 6, slug: "comment" },
    { name: "Status", variants: 36, slug: "status" },
    { name: "Toast", variants: 16, slug: "toast" },
    { name: "Alert", variants: 24, slug: "alert" },
    { name: "Stepper", variants: 16, slug: "stepper" },
    { name: "Cards", variants: 12, slug: "card" },
    { name: "Tabs", variants: 48, slug: "tabs" },
    { name: "Cover", variants: 9, slug: "cover" },
    { name: "Dividers", variants: 6, slug: "divider" },
    { name: "Drawer", variants: 12, slug: "drawer" },
    { name: "File Input", variants: 18, slug: "file-input" },
    { name: "Pagination", variants: 14, slug: "pagination" },
    { name: "Progress Bars", variants: 16, slug: "progress-bar" },
    { name: "Radio", variants: 24, slug: "radio-group" },
    { name: "Skeleton", variants: 15, slug: "skeleton" },
    { name: "Rating", variants: 30, slug: "rating" },
    { name: "Tooltips", variants: 8, slug: "tooltip" },
    { name: "Search", variants: 18, slug: "search" },
    { name: "Modal", variants: 12, slug: "modal" },
    { name: "Textarea", variants: 18, slug: "textarea" },
    { name: "Empty State", variants: 12, slug: "empty-state" },
    { name: "Chip", variants: 20, slug: "chip" },
    { name: "Slider", variants: 24, slug: "slider" },
    { name: "Date Picker", variants: 14, slug: "date-picker" },
    { name: "Combobox", variants: 10, slug: "combobox" },
    { name: "Menu", variants: 10, slug: "more-menu" },
    { name: "Table", variants: 15, slug: "table" },
    { name: "OTP Input", variants: 21, slug: "otp-input" },
    { name: "PIN Input", variants: 10, slug: "pin-input" },
    { name: "Spinner", variants: 24, slug: "spinner" },
    { name: "Amount Input", variants: 18, slug: "amount-input" },
    { name: "Transaction List Item", variants: 9, slug: "transaction-list-item" },
    { name: "QR Code Display", variants: 6, slug: "qr-code" },
    { name: "Navigation Bar", variants: 5, slug: "navigation-bar" },
  ] satisfies BuiltComponent[],
};

/** Totals come from the list, so the headline can never disagree with the rows under it. */
export const builtCount = buildReport.components.length;
export const variantCount = buildReport.components.reduce((n, c) => n + c.variants, 0);

/** 14539 → "4 h 2 min 19 s". */
export function duration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h && `${h} h`, m && `${m} min`, s && `${s} s`].filter(Boolean).join(" ");
}
