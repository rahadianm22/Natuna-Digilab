import { CaretLeft } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

export interface TopAppBarProps {
  title: string;
  /** Shows the back button. */
  onBack?: () => void;
  /** Buttons on the right, such as a more menu. Each needs its own accessible name. */
  actions?: ReactNode;
  className?: string;
}

/** The top app bar: 56 tall on phones, 64 on desktop. */
export function TopAppBar({ title, onBack, actions, className = "" }: TopAppBarProps) {
  return (
    <header className={`flex h-14 items-center gap-2 border-b border-role-border-default bg-role-bg-surface px-2 sm:h-16 ${className}`}>
      {onBack ? (
        <button type="button" onClick={onBack} aria-label="Back" className="flex size-11 shrink-0 items-center justify-center rounded-md text-role-text-primary hover:bg-role-bg-hover">
          <CaretLeft size={22} aria-hidden="true" />
        </button>
      ) : (
        <span className="w-2" />
      )}
      <h1 className="min-w-0 grow truncate text-lg font-semibold text-role-text-primary">{title}</h1>
      {actions && <div className="flex shrink-0 items-center">{actions}</div>}
    </header>
  );
}

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  /** A count shown as a danger badge, such as unread notifications. */
  count?: number;
  disabled?: boolean;
}

export interface BottomNavProps {
  /** Names the navigation for screen readers. */
  label?: string;
  items: NavItem[];
  /** href of the current page. */
  current: string;
  className?: string;
}

/** Bottom navigation for 3 to 5 top-level destinations, equal width, 64 tall plus the safe area. */
export function BottomNav({ label = "Main", items, current, className = "" }: BottomNavProps) {
  return (
    <nav aria-label={label} className={`border-t border-role-border-default bg-role-bg-surface pb-[env(safe-area-inset-bottom)] ${className}`}>
      <ul className="flex">
        {items.map((item) => {
          const active = item.href === current;
          const color = item.disabled ? "text-role-text-disabled" : active ? "text-role-text-link" : "text-role-text-secondary";
          return (
            <li key={item.href} className="relative flex-1">
              {active && <span aria-hidden="true" className="absolute inset-x-1/4 top-0 h-0.5 rounded-full bg-role-bg-brand" />}
              <a
                href={item.disabled ? undefined : item.href}
                aria-current={active ? "page" : undefined}
                aria-disabled={item.disabled || undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-xs ${color} ${item.disabled ? "cursor-not-allowed" : "hover:bg-role-bg-hover"}`}
              >
                <span aria-hidden="true" className="relative inline-flex">
                  {item.icon}
                  {item.count ? (
                    <span className="absolute -right-2 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-role-bg-danger px-1 text-xs leading-4 text-role-text-on-danger">
                      {item.count}
                    </span>
                  ) : null}
                </span>
                {item.label}
                {item.count ? <span className="sr-only">, {item.count} new</span> : null}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
