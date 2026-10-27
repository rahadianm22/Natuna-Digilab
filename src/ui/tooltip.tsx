"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipSize = "sm" | "md";

interface BubbleProps {
  title: string;
  description?: string;
  placement?: TooltipPlacement;
  size?: TooltipSize;
  arrow?: boolean;
  id?: string;
  className?: string;
}

// The bubble uses text/primary as its fill and bg/surface as its text, so it inverts in dark mode with the page.
const ARROW: Record<TooltipPlacement, string> = {
  top: "left-1/2 top-full -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-role-text-primary",
  bottom: "left-1/2 bottom-full -translate-x-1/2 border-x-[6px] border-b-[6px] border-x-transparent border-b-role-text-primary",
  left: "top-1/2 left-full -translate-y-1/2 border-y-[6px] border-l-[6px] border-y-transparent border-l-role-text-primary",
  right: "top-1/2 right-full -translate-y-1/2 border-y-[6px] border-r-[6px] border-y-transparent border-r-role-text-primary",
};

/** The bubble on its own, for documentation. Tooltip places it next to a trigger. */
export function TooltipBubble({ title, description, placement = "top", size = "md", arrow = true, id, className = "" }: BubbleProps) {
  return (
    <span
      role="tooltip"
      id={id}
      className={`relative inline-flex max-w-60 flex-col gap-0.5 rounded-sm bg-role-text-primary text-left text-role-bg-surface shadow-md ${size === "sm" ? "px-2.5 py-1.5" : "px-3 py-2"} ${className}`}
    >
      <span className={`font-medium ${size === "sm" ? "text-xs leading-[18px]" : "text-sm leading-5"}`}>{title}</span>
      {description && <span className="text-xs leading-[18px] text-role-bg-surface">{description}</span>}
      {arrow && <span aria-hidden="true" className={`absolute size-0 ${ARROW[placement]}`} />}
    </span>
  );
}

const POSITION: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

export interface TooltipProps extends Omit<BubbleProps, "id" | "className"> {
  /** The trigger. It must be focusable, such as a button. */
  children: ReactNode;
  className?: string;
}

/**
 * Shows on hover and on keyboard focus, hides on Escape, and stays while the pointer is over it (WCAG 1.4.13).
 * The hint is linked to the trigger with aria-describedby, so put nothing in it the user must read to continue.
 */
export function Tooltip({ children, placement = "top", className = "", ...bubble }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // The trigger is the first focusable child; it gets aria-describedby so the hint is read with it.
  useEffect(() => {
    const el = wrap.current?.querySelector<HTMLElement>("button, a, input, [tabindex]");
    el?.setAttribute("aria-describedby", id);
  }, [id]);

  return (
    <span
      ref={wrap}
      className={`relative inline-flex ${className}`}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <span className={`absolute z-20 w-max ${POSITION[placement]} ${open ? "" : "hidden"}`}>
        <TooltipBubble id={id} placement={placement} {...bubble} />
      </span>
    </span>
  );
}
