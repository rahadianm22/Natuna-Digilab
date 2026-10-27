export type SpinnerType = "circular" | "dots";
export type SpinnerTone = "neutral" | "primary" | "onPrimary";
export type SpinnerSize = "xs" | "sm" | "md" | "lg";

export interface SpinnerProps {
  type?: SpinnerType;
  /** onPrimary is for a spinner on a brand fill, such as inside a primary button. */
  tone?: SpinnerTone;
  size?: SpinnerSize;
  /** Read by screen readers. Say what is loading. */
  label?: string;
  className?: string;
}

// Circle 12, 16, 24, 32 with a 2, 2, 3, 3 stroke. Dots scale with it.
const CIRCLE: Record<SpinnerSize, string> = { xs: "size-3 border-2", sm: "size-4 border-2", md: "size-6 border-[3px]", lg: "size-8 border-[3px]" };
const DOT: Record<SpinnerSize, string> = { xs: "size-1", sm: "size-1.5", md: "size-2", lg: "size-2.5" };

// The track is the tone at 30%, the moving quarter is the tone at full strength.
const RING: Record<SpinnerTone, string> = {
  neutral: "border-role-text-secondary/30 border-t-role-text-secondary",
  primary: "border-role-bg-brand/30 border-t-role-bg-brand",
  onPrimary: "border-role-text-on-brand/30 border-t-role-text-on-brand",
};
const FILL: Record<SpinnerTone, string> = {
  neutral: "bg-role-text-secondary",
  primary: "bg-role-bg-brand",
  onPrimary: "bg-role-text-on-brand",
};

/** An inline loading indicator. For a whole area, use Skeleton; for measurable progress, use Progress Bar. */
export function Spinner({ type = "circular", tone = "primary", size = "md", label = "Loading", className = "" }: SpinnerProps) {
  return (
    <span role="status" className={`inline-flex items-center ${className}`}>
      {type === "circular" ? (
        <span aria-hidden="true" className={`inline-block rounded-full motion-safe:animate-spin ${CIRCLE[size]} ${RING[tone]}`} />
      ) : (
        <span aria-hidden="true" className="inline-flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`rounded-full motion-safe:animate-pulse ${DOT[size]} ${FILL[tone]}`}
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </span>
  );
}
