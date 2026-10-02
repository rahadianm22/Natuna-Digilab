import type { ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react/ssr";

export interface AccordionItem {
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

/** Built on native details elements, so it needs no script and works with the keyboard by default. */
export function Accordion({ items, className = "" }: { items: AccordionItem[]; className?: string }) {
  return (
    <div className={`divide-y divide-gray-200 rounded-md border border-gray-200 bg-surface text-sm ${className}`}>
      {items.map((item) => (
        <details key={item.title} open={item.defaultOpen} className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-gray-900">
            {item.title}
            <CaretDown size={16} aria-hidden="true" className="shrink-0 text-gray-600 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-4 pb-4 text-gray-600">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
