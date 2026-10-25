import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import type { HTMLAttributes } from "react";

export type PaginationSize = "sm" | "md";

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Current page, starting at 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** number shows page buttons, arrow shows Page x of y, loadMore is one button. */
  type?: "number" | "arrow" | "loadMore";
  size?: PaginationSize;
  loadMoreLabel?: string;
}

// The visible square is 32 or 40 per Figma. Every button is 44px square around it, so the touch target stays 44.
const BOX: Record<PaginationSize, string> = { sm: "size-8 text-xs", md: "size-10 text-sm" };

/** First, last, and two around the current page, with an ellipsis for each gap. */
function pageList(page: number, count: number): (number | "gap")[] {
  const keep = new Set([1, count, page - 1, page, page + 1].filter((n) => n >= 1 && n <= count));
  const sorted = [...keep].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

const HIT = "group inline-flex size-11 items-center justify-center disabled:cursor-not-allowed";

export function Pagination({ page, pageCount, onPageChange, type = "number", size = "md", loadMoreLabel = "Load more", className = "", ...rest }: PaginationProps) {
  const box = BOX[size];
  const arrow = `flex items-center justify-center rounded-md border border-role-border-default text-role-text-secondary group-hover:bg-role-bg-hover group-disabled:text-role-text-disabled group-disabled:group-hover:bg-transparent ${box}`;

  if (type === "loadMore") {
    return (
      <nav aria-label="Pagination" className={className} {...rest}>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="group inline-flex min-h-11 items-center justify-center disabled:cursor-not-allowed"
        >
          <span
            className={`flex items-center rounded-md border border-role-bg-brand px-5 text-role-text-link group-hover:bg-role-bg-hover group-disabled:border-role-border-disabled group-disabled:text-role-text-disabled group-disabled:group-hover:bg-transparent ${
              size === "sm" ? "h-8 text-xs" : "h-10 text-sm"
            }`}
          >
            {loadMoreLabel}
          </span>
        </button>
      </nav>
    );
  }

  const prev = (
    <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={HIT}>
      <span className={arrow}>
        <CaretLeft size={16} aria-hidden="true" />
      </span>
    </button>
  );
  const next = (
    <button type="button" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} className={HIT}>
      <span className={arrow}>
        <CaretRight size={16} aria-hidden="true" />
      </span>
    </button>
  );

  return (
    <nav aria-label="Pagination" className={`flex items-center ${className}`} {...rest}>
      {prev}
      {type === "arrow" ? (
        <span className={`px-3 text-role-text-primary ${size === "sm" ? "text-xs" : "text-sm"}`}>
          Page {page} of {pageCount}
        </span>
      ) : (
        pageList(page, pageCount).map((n, i) =>
          n === "gap" ? (
            <span key={`gap-${i}`} aria-hidden="true" className={`inline-flex size-11 items-center justify-center text-role-text-secondary`}>
              …
            </span>
          ) : (
            <button key={n} type="button" aria-current={n === page ? "page" : undefined} aria-label={`Page ${n}`} onClick={() => onPageChange(n)} className={HIT}>
              <span
                className={`flex items-center justify-center rounded-md ${box} ${
                  n === page ? "bg-role-bg-brand text-role-text-on-brand" : "text-role-text-secondary group-hover:bg-role-bg-hover"
                }`}
              >
                {n}
              </span>
            </button>
          ),
        )
      )}
      {next}
    </nav>
  );
}
