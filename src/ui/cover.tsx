import { Image as ImageIcon } from "@phosphor-icons/react/ssr";
import type { HTMLAttributes, ReactNode } from "react";

export type CoverType = "gradient" | "solid" | "image";
export type CoverSize = "sm" | "md" | "lg";

export interface CoverProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  type?: CoverType;
  size?: CoverSize;
  title: string;
  description?: string;
  /** Show the logo mark. */
  logo?: boolean;
  /** Image type only. A photo element that fills the cover. */
  image?: ReactNode;
}

const HEIGHT: Record<CoverSize, string> = { sm: "h-40 p-6", md: "h-[220px] p-6", lg: "h-[280px] p-8" };

// Gradient runs from brand to brand-hover and solid uses text/primary, so white text clears 7:1 in both modes.
// Image darkens the photo with a scrim for the same reason.
const FILL: Record<CoverType, string> = {
  gradient: "bg-gradient-to-r from-role-bg-brand to-role-bg-brand-hover",
  solid: "bg-role-text-primary",
  image: "bg-role-bg-brand-hover",
};

export function Cover({ type = "gradient", size = "md", title, description, logo = true, image, className = "", ...rest }: CoverProps) {
  const text = type === "solid" ? "text-role-bg-surface" : "text-role-text-on-brand";

  return (
    <section className={`relative flex w-full max-w-[560px] flex-col justify-end gap-2 overflow-hidden rounded-xl ${HEIGHT[size]} ${FILL[type]} ${text} ${className}`} {...rest}>
      {type === "image" && (
        <>
          <div className="absolute inset-0 flex items-start justify-end p-5 text-role-text-on-brand/80">{image ?? <ImageIcon size={24} aria-hidden="true" />}</div>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-role-text-on-accent/70 via-role-text-on-accent/30 to-transparent" />
        </>
      )}
      <div className="relative flex flex-col gap-2">
        {logo && (
          <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-md bg-role-text-on-brand text-sm font-bold text-role-bg-brand">
            N
          </span>
        )}
        <h2 className="text-2xl font-bold leading-8">{title}</h2>
        {description && <p className="text-sm leading-[22px]">{description}</p>}
      </div>
    </section>
  );
}
