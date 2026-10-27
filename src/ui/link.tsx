import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import type { AnchorHTMLAttributes, ElementType, ReactNode } from "react";

export type TextLinkSize = "sm" | "md";

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  size?: TextLinkSize;
  /**
   * Inline links sit in a sentence and are always underlined. A standalone link stands on its own line, is 44px tall,
   * and shows its underline on hover.
   */
  standalone?: boolean;
  /** Opens in a new tab, with an arrow icon and "opens in a new tab" for screen readers. */
  external?: boolean;
  /** Render through your router's link, such as next/link. It receives href, className, and the rest. */
  as?: ElementType;
}

const SIZE: Record<TextLinkSize, string> = { sm: "text-sm", md: "text-base" };

/** Text that goes somewhere. For an action that stays on the page, use a Button. */
export function TextLink({ href, children, size = "md", standalone = false, external = false, as: Tag = "a", className = "", ...rest }: TextLinkProps) {
  return (
    <Tag
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`font-medium text-role-text-link decoration-1 underline-offset-4 hover:decoration-2 ${SIZE[size]} ${
        standalone ? "inline-flex min-h-11 items-center gap-1 hover:underline" : "underline"
      } ${className}`}
      {...rest}
    >
      {children}
      {external && (
        <>
          <ArrowUpRight size={size === "sm" ? 14 : 16} aria-hidden="true" className={standalone ? "shrink-0" : "ml-0.5 inline align-[-2px]"} />
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      )}
    </Tag>
  );
}
