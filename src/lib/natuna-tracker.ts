// Snapshot of the "Natuna Component Tracker" Notion database (51 rows, fetched 2026-09-30).
// Source: https://app.notion.com/p/d8d2440445804014b2d89d66856d69bc
// Re-sync by re-running the Notion query; figmaLink is empty for every row so far.

export type TrackerGroup = "Atoms" | "Molecules";
export type TrackerStatus = "Belum" | "OnProgress" | "On Review" | "Selesai";

export interface TrackerItem {
  no: number;
  name: string;
  group: TrackerGroup;
  status: TrackerStatus;
  buildDay?: number;
  figmaLink?: string;
  /** Slug of the matching detail page in components-data.ts, if one exists. */
  slug?: string;
}

export const statusLabel: Record<TrackerStatus, string> = {
  Selesai: "Ready",
  "On Review": "In review",
  OnProgress: "In progress",
  Belum: "Planned",
};

export const statusOrder: TrackerStatus[] = ["Selesai", "On Review", "OnProgress", "Belum"];

export const statusStyle: Record<TrackerStatus, string> = {
  Selesai: "bg-emerald-100 text-emerald-800",
  "On Review": "bg-blue-100 text-blue-800",
  OnProgress: "bg-amber-100 text-amber-900",
  Belum: "bg-gray-100 text-gray-700",
};

export const trackerGroups: { name: TrackerGroup; description: string }[] = [
  { name: "Atoms", description: "The smallest building blocks: buttons, badges, inputs, and other single-purpose elements." },
  { name: "Molecules", description: "Compositions of atoms that work together: forms, navigation, overlays, and data views." },
];

export const tracker: TrackerItem[] = [
  { no: 1, name: "Tabs", group: "Molecules", status: "Belum", buildDay: 8, slug: "tabs" },
  { no: 2, name: "Rating", group: "Molecules", status: "Belum", buildDay: 13, slug: "rating" },
  { no: 3, name: "Guideline", group: "Molecules", status: "Selesai", slug: "guideline" },
  { no: 4, name: "Stepper", group: "Molecules", status: "Belum", buildDay: 7, slug: "stepper" },
  { no: 5, name: "Search", group: "Molecules", status: "Belum", buildDay: 14, slug: "search" },
  { no: 6, name: "Dividers", group: "Molecules", status: "Belum", buildDay: 9, slug: "divider" },
  { no: 7, name: "Badge", group: "Atoms", status: "OnProgress", buildDay: 2, slug: "badge" },
  { no: 8, name: "Toggle", group: "Atoms", status: "Belum", buildDay: 3, slug: "toggle" },
  { no: 9, name: "Separator", group: "Atoms", status: "Belum", buildDay: 3, slug: "separator" },
  { no: 10, name: "Headline", group: "Atoms", status: "Selesai", slug: "headline" },
  { no: 11, name: "Artboard", group: "Atoms", status: "Selesai", slug: "artboard" },
  { no: 12, name: "Radio", group: "Molecules", status: "Belum", buildDay: 12, slug: "radio-group" },
  { no: 13, name: "Comment", group: "Atoms", status: "OnProgress", buildDay: 5, slug: "comment" },
  { no: 14, name: "Dropdown", group: "Molecules", status: "Selesai", slug: "dropdown-menu" },
  { no: 15, name: "Tooltips", group: "Molecules", status: "Belum", buildDay: 13, slug: "tooltip" },
  { no: 16, name: "Label Text", group: "Atoms", status: "Belum", buildDay: 2, slug: "label-text" },
  { no: 17, name: "Drawer", group: "Molecules", status: "Belum", buildDay: 10, slug: "drawer" },
  { no: 18, name: "Toast", group: "Molecules", status: "Belum", buildDay: 6, slug: "toast" },
  { no: 19, name: "Cards", group: "Molecules", status: "Belum", buildDay: 8, slug: "card" },
  { no: 20, name: "Alert", group: "Molecules", status: "Belum", buildDay: 7, slug: "alert" },
  { no: 21, name: "Status", group: "Molecules", status: "Belum", buildDay: 6, slug: "status" },
  { no: 22, name: "Avatar", group: "Atoms", status: "Selesai", slug: "avatar" },
  { no: 23, name: "Input Field", group: "Molecules", status: "Selesai", slug: "input" },
  { no: 24, name: "Breadcrumbs", group: "Atoms", status: "Belum", buildDay: 4, slug: "breadcrumbs" },
  { no: 25, name: "Cover", group: "Molecules", status: "Belum", buildDay: 9, slug: "cover" },
  { no: 26, name: "Button", group: "Atoms", status: "Selesai", slug: "button" },
  { no: 27, name: "Progress Bars", group: "Molecules", status: "Belum", buildDay: 11, slug: "progress-bar" },
  { no: 28, name: "Checkbox", group: "Atoms", status: "OnProgress", buildDay: 1, slug: "checkbox" },
  { no: 29, name: "Document", group: "Molecules", status: "Selesai", slug: "document" },
  { no: 30, name: "Accordion", group: "Molecules", status: "Selesai", slug: "accordion" },
  { no: 31, name: "Radio Button", group: "Atoms", status: "OnProgress", buildDay: 1, slug: "radio-button" },
  { no: 32, name: "Changelog", group: "Atoms", status: "OnProgress", buildDay: 5, slug: "changelog" },
  { no: 33, name: "Skeleton", group: "Molecules", status: "Belum", buildDay: 12, slug: "skeleton" },
  { no: 34, name: "Pagination", group: "Molecules", status: "Belum", buildDay: 11, slug: "pagination" },
  { no: 35, name: "File Input", group: "Molecules", status: "Belum", buildDay: 10, slug: "file-input" },
  { no: 36, name: "Textarea", group: "Atoms", status: "Belum", buildDay: 15, slug: "textarea" },
  { no: 37, name: "Chip / Tag", group: "Atoms", status: "Belum", buildDay: 16, slug: "chip" },
  { no: 38, name: "Slider", group: "Atoms", status: "Belum", buildDay: 16, slug: "slider" },
  { no: 39, name: "Spinner / Loader", group: "Atoms", status: "Belum", buildDay: 19, slug: "spinner" },
  { no: 40, name: "OTP Input", group: "Atoms", status: "Belum", buildDay: 19, slug: "otp-input" },
  { no: 41, name: "PIN Input", group: "Atoms", status: "Belum", buildDay: 19, slug: "pin-input" },
  { no: 42, name: "Modal / Dialog", group: "Molecules", status: "Belum", buildDay: 15, slug: "modal" },
  { no: 43, name: "Table / Data Table", group: "Molecules", status: "Belum", buildDay: 18, slug: "table" },
  { no: 44, name: "Date Picker", group: "Molecules", status: "Belum", buildDay: 17, slug: "date-picker" },
  { no: 45, name: "Combobox / Autocomplete", group: "Molecules", status: "Belum", buildDay: 17, slug: "combobox" },
  { no: 46, name: "Menu (Dropdown Action)", group: "Molecules", status: "Belum", buildDay: 18, slug: "more-menu" },
  { no: 47, name: "Empty State", group: "Molecules", status: "Belum", buildDay: 15, slug: "empty-state" },
  { no: 48, name: "Navigation Bar (Top/Bottom)", group: "Molecules", status: "Belum", buildDay: 21, slug: "navigation-bar" },
  { no: 49, name: "Transaction List Item", group: "Molecules", status: "Belum", buildDay: 20, slug: "transaction-list-item" },
  { no: 50, name: "Amount / Currency Input", group: "Molecules", status: "Belum", buildDay: 20, slug: "amount-input" },
  { no: 51, name: "QR Code Display", group: "Molecules", status: "Belum", buildDay: 21, slug: "qr-code" },
];
