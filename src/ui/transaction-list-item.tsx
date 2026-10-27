import { Wallet } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

export type TransactionTone = "neutral" | "success" | "danger";

// The sign is locked per tone: money in is +, money out is −, and neutral has none.
const TONE: Record<TransactionTone, { circle: string; amount: string; sign: string; spoken: string }> = {
  neutral: { circle: "bg-role-bg-subtle text-role-text-secondary", amount: "text-role-text-primary", sign: "", spoken: "" },
  success: { circle: "bg-role-bg-tone-success text-role-text-tone-success", amount: "text-role-status-success", sign: "+", spoken: "Incoming " },
  danger: { circle: "bg-role-bg-tone-danger text-role-text-tone-danger", amount: "text-role-text-danger", sign: "−", spoken: "Outgoing " },
};

export interface TransactionListItemProps {
  title: string;
  /** Category or status, such as Transfer. */
  label?: string;
  timestamp: string;
  /** The formatted amount without a sign, such as Rp150.000. */
  amount: string;
  tone?: TransactionTone;
  icon?: ReactNode;
  /** Makes the row a link to the transaction. */
  href?: string;
  className?: string;
}

/** A row in a transaction history. Divide rows with Separator, or put them in a list with borders. */
export function TransactionListItem({ title, label, timestamp, amount, tone = "neutral", icon, href, className = "" }: TransactionListItemProps) {
  const t = TONE[tone];
  const body = (
    <>
      <span aria-hidden="true" className={`flex size-9 shrink-0 items-center justify-center rounded-full ${t.circle}`}>
        {icon ?? <Wallet size={16} />}
      </span>
      <span className="flex min-w-0 grow flex-col">
        <span className="truncate text-sm font-medium leading-[22px] text-role-text-primary">{title}</span>
        <span className="text-xs leading-[18px] text-role-text-secondary">
          {label}
          {label && " · "}
          {timestamp}
        </span>
      </span>
      <span className={`shrink-0 text-sm font-semibold tabular-nums ${t.amount}`}>
        <span className="sr-only">{t.spoken}</span>
        <span aria-hidden="true">{t.sign}</span>
        {amount}
      </span>
    </>
  );
  const row = `flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left ${className}`;

  return href ? (
    <a href={href} className={`${row} hover:bg-role-bg-hover active:bg-role-bg-subtle`}>
      {body}
    </a>
  ) : (
    <div className={row}>{body}</div>
  );
}
