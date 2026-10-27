import type { ReactNode } from "react";

export type TableType = "basic" | "striped" | "bordered";
export type TableSize = "sm" | "md" | "lg";

export interface TableColumn {
  key: string;
  header: string;
  align?: "left" | "right";
}

export interface TableProps {
  /** Describes the table for screen readers. Shown only when showCaption is true. */
  caption: string;
  showCaption?: boolean;
  columns: TableColumn[];
  rows: Record<string, ReactNode>[];
  type?: TableType;
  size?: TableSize;
  /** The outer border. */
  stroke?: boolean;
  /** Index of a selected row. */
  selectedRow?: number;
  className?: string;
}

// Row height 32, 40, 48.
const ROW: Record<TableSize, string> = { sm: "h-8 text-xs", md: "h-10 text-sm", lg: "h-12 text-sm" };

/** A data table for back-office screens. It scrolls sideways on its own when the page is narrower than the columns. */
export function Table({ caption, showCaption = false, columns, rows, type = "basic", size = "md", stroke = true, selectedRow, className = "" }: TableProps) {
  const cellBorder = type === "bordered" ? "border-r border-role-border-default last:border-r-0" : "";

  return (
    <div className={`overflow-x-auto rounded-md ${stroke ? "border border-role-border-default" : ""} ${className}`}>
      <table className="w-full border-collapse text-left">
        <caption className={showCaption ? "px-3 py-2 text-left text-sm font-semibold text-role-text-primary" : "sr-only"}>{caption}</caption>
        <thead className="bg-role-bg-subtle">
          <tr className={`${ROW[size]} border-b border-role-border-default`}>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={`px-3 font-medium text-role-text-secondary ${c.align === "right" ? "text-right" : ""} ${cellBorder}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              aria-selected={selectedRow === i || undefined}
              className={`${ROW[size]} border-b border-role-border-default last:border-b-0 hover:bg-role-bg-hover ${
                selectedRow === i ? "bg-role-bg-tone-info" : type === "striped" && i % 2 === 1 ? "bg-role-bg-hover" : ""
              }`}
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-3 text-role-text-primary ${c.align === "right" ? "text-right tabular-nums" : ""} ${cellBorder}`}>
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
