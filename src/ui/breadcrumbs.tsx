import { CaretRight, House } from "@phosphor-icons/react/ssr";
import type { HTMLAttributes } from "react";

export type BreadcrumbsSize = "sm" | "md";

export interface BreadcrumbItem {
  label: string;
  /** Leave out for the current page, which is always the last item. */
  href?: string;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: BreadcrumbItem[];
  size?: BreadcrumbsSize;
  separator?: "chevron" | "slash";
  /** Show a house icon on the first item. */
  home?: boolean;
  /** Collapse the middle to "…" when there are more items than this. 0 never collapses. */
  maxItems?: number;
}

const text: Record<BreadcrumbsSize, string> = { sm: "text-xs leading-[18px]", md: "text-sm leading-[22px]" };
const icon: Record<BreadcrumbsSize, number> = { sm: 14, md: 16 };

export function Breadcrumbs({ items, size = "md", separator = "chevron", home = true, maxItems = 0, className = "", ...rest }: BreadcrumbsProps) {
  // Truncated keeps the first item and the last two, so the user still sees where they are.
  const collapsed = maxItems > 0 && items.length > maxItems;
  const shown: (BreadcrumbItem | null)[] = collapsed ? [items[0], null, ...items.slice(-2)] : items;

  return (
    <nav aria-label="Breadcrumb" className={className} {...rest}>
      <ol className={`flex flex-wrap items-center gap-2 ${text[size]}`}>
        {shown.map((item, i) => {
          const last = i === shown.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {item === null ? (
                <span className="px-1 text-role-text-secondary">…</span>
              ) : last ? (
                <span aria-current="page" className="px-1 font-semibold text-role-text-primary">{item.label}</span>
              ) : (
                <a href={item.href} className="inline-flex min-h-11 items-center gap-1 rounded-sm px-1 text-role-text-secondary hover:bg-role-bg-hover hover:text-role-text-primary">
                  {i === 0 && home && <House size={icon[size]} aria-hidden="true" />}
                  {item.label}
                </a>
              )}
              {!last &&
                (separator === "slash" ? (
                  <span aria-hidden="true" className="text-role-text-secondary">/</span>
                ) : (
                  <CaretRight size={12} aria-hidden="true" className="text-role-text-secondary" />
                ))}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
