/** One selected-filter pattern for every row of filter buttons and tabs on the site. */
export const filterChip = (on: boolean) =>
  `inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors ${
    on
      ? "border-inverse bg-inverse text-inverse-text dark:border-inverse-text dark:bg-inverse-text dark:text-inverse"
      : "border-gray-300 bg-surface text-gray-900 hover:border-gray-500"
  }`;
