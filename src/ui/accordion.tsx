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
    <div className={`divide-y divide-role-border-default rounded-md border border-role-border-default bg-role-bg-surface text-sm ${className}`}>
      {items.map((item) => (
        <details key={item.title} open={item.defaultOpen} className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-role-text-primary">
            {item.title}
            <CaretDown size={16} aria-hidden="true" className="shrink-0 text-role-text-secondary transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-4 pb-4 text-role-text-secondary">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
