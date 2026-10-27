import type { HTMLAttributes, ReactNode } from "react";

export type HeadlineLevel = "h1" | "h2" | "subheader";
export type HeadlineTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

// The Foundation header scale. Each style steps up at md (tablet) and lg (website).
const STYLE: Record<HeadlineLevel, string> = {
  h1: "type-h1 font-bold text-role-text-primary",
  h2: "type-h2 font-bold text-role-text-primary",
  subheader: "type-subheader font-semibold text-role-text-strong",
};
const DEFAULT_TAG: Record<HeadlineLevel, HeadlineTag> = { h1: "h1", h2: "h2", subheader: "h3" };

export interface HeadlineProps extends HTMLAttributes<HTMLHeadingElement> {
  /** The visual style: Header 1, Header 2, or Subheader. */
  level?: HeadlineLevel;
  /**
   * The HTML element, when the outline needs a different level than the look. Defaults to h1, h2, and h3.
   * A card title styled as Header 2 inside an h2 section, for example, should be an h3.
   */
  as?: HeadlineTag;
  children: ReactNode;
}

/** A page or section title in the Urbanist header scale. */
export function Headline({ level = "h1", as, className = "", children, ...rest }: HeadlineProps) {
  const Tag = as ?? DEFAULT_TAG[level];
  return (
    <Tag className={`font-display text-balance ${STYLE[level]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
