import type { HTMLAttributes } from "react";

export type SkeletonType = "text" | "title" | "avatar" | "image" | "card";
export type SkeletonAnimation = "static" | "pulse" | "wave";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  type?: SkeletonType;
  animation?: SkeletonAnimation;
  /** Text only: how many lines. The last one is shorter. */
  lines?: number;
}

// Wave sweeps a lighter band across the block. Both animations stop for people who ask for reduced motion.
const ANIM: Record<SkeletonAnimation, string> = {
  static: "",
  pulse: "motion-safe:animate-pulse",
  wave: "bg-[linear-gradient(90deg,var(--color-role-bg-subtle)_25%,var(--color-role-bg-hover)_50%,var(--color-role-bg-subtle)_75%)] bg-[length:200%_100%] motion-safe:animate-[nd-wave_1.6s_linear_infinite]",
};

function Block({ className, animation }: { className: string; animation: SkeletonAnimation }) {
  return <div className={`bg-role-bg-subtle ${className} ${ANIM[animation]}`} />;
}

/**
 * A placeholder shaped like the content that is loading. It is hidden from screen readers:
 * put aria-busy on the region that loads, and announce the result when it arrives.
 */
export function Skeleton({ type = "text", animation = "pulse", lines = 3, className = "", ...rest }: SkeletonProps) {
  let body;
  if (type === "text") {
    body = (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }, (_, i) => (
          <Block key={i} animation={animation} className={`h-2 rounded-sm ${i === lines - 1 && lines > 1 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    );
  } else if (type === "title") {
    body = <Block animation={animation} className="h-3 w-1/2 rounded-sm" />;
  } else if (type === "avatar") {
    body = <Block animation={animation} className="size-10 rounded-full" />;
  } else if (type === "image") {
    body = <Block animation={animation} className="aspect-video w-full rounded-md" />;
  } else {
    body = (
      <div className="flex flex-col gap-4 rounded-lg border border-role-border-default p-4">
        <Block animation={animation} className="aspect-video w-full rounded-md" />
        <div className="flex items-center gap-3">
          <Block animation={animation} className="size-10 shrink-0 rounded-full" />
          <div className="flex grow flex-col gap-2">
            <Block animation={animation} className="h-2 w-3/4 rounded-sm" />
            <Block animation={animation} className="h-2 w-1/2 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={className} {...rest}>
      {body}
    </div>
  );
}
