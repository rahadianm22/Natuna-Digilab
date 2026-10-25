import { ArrowRight, Image as ImageIcon } from "@phosphor-icons/react/ssr";
import type { HTMLAttributes, ReactNode } from "react";

export type CardType = "basic" | "media" | "action";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  type?: CardType;
  title: string;
  description?: string;
  /** A small tag above the title, such as KPR. */
  label?: string;
  /** Media only. Pass an image element. Leave it out for the placeholder. */
  image?: ReactNode;
  /** Media only. Link text and target under the description. */
  linkLabel?: string;
  href?: string;
  /** Action only. The footer buttons. */
  actions?: ReactNode;
  /** Whole card is a button or link you can press: adds the hover shadow and the pressed fill. */
  interactive?: boolean;
  disabled?: boolean;
  /** Figma Stroke boolean. */
  stroke?: boolean;
}

export function Card({ type = "basic", title, description, label, image, linkLabel, href, actions, interactive = false, disabled = false, stroke = true, className = "", ...rest }: CardProps) {
  return (
    <article
      aria-disabled={disabled || undefined}
      className={`overflow-hidden rounded-lg bg-role-bg-surface shadow-sm ${stroke ? "border border-role-border-default" : ""} ${
        interactive && !disabled ? "transition-shadow hover:shadow-md active:bg-role-bg-hover" : ""
      } ${disabled ? "opacity-50" : ""} ${className}`}
      {...rest}
    >
      {type === "media" && (
        <div className="flex aspect-video items-center justify-center bg-role-bg-hover text-role-text-secondary">
          {image ?? <ImageIcon size={32} aria-hidden="true" />}
        </div>
      )}
      <div className="flex flex-col gap-1.5 p-4">
        {label && <span className="w-fit rounded-full bg-role-bg-tone-info px-2 text-xs leading-5 text-role-text-tone-info">{label}</span>}
        <h3 className="text-base font-semibold leading-6 text-role-text-primary">{title}</h3>
        {description && <p className="text-sm leading-[22px] text-role-text-secondary">{description}</p>}
        {type === "media" && linkLabel && (
          <a href={disabled ? undefined : href} className="inline-flex min-h-11 w-fit items-center gap-1 text-sm text-role-text-link">
            {linkLabel}
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        )}
      </div>
      {type === "action" && actions && <div className="flex justify-end gap-2 border-t border-role-border-default px-4 py-3">{actions}</div>}
    </article>
  );
}
