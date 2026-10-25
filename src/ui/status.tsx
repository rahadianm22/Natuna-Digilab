import { ArrowDownLeft, ArrowsClockwise, CheckCircle, Clock, Info, XCircle } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "./badge";

export type StatusValue = "pending" | "processing" | "success" | "failed" | "expired" | "refunded";
export type StatusType = "pill" | "inline" | "dot";
export type StatusSize = "sm" | "md";

// A closed enum: text, icon, and tone are locked per status. Adding one is a design system change.
const STATUS: Record<StatusValue, { text: string; tone: BadgeTone; dot: string; ink: string; Icon: typeof Clock }> = {
  pending: { text: "Pending", tone: "warning", dot: "bg-role-status-warning", ink: "text-role-status-warning", Icon: Clock },
  processing: { text: "Processing", tone: "primary", dot: "bg-role-bg-brand", ink: "text-role-text-link", Icon: ArrowsClockwise },
  success: { text: "Successful", tone: "success", dot: "bg-role-status-success", ink: "text-role-status-success", Icon: CheckCircle },
  failed: { text: "Failed", tone: "danger", dot: "bg-role-bg-danger", ink: "text-role-text-danger", Icon: XCircle },
  expired: { text: "Expired", tone: "neutral", dot: "bg-role-text-primary", ink: "text-role-text-secondary", Icon: Info },
  refunded: { text: "Refunded", tone: "primary", dot: "bg-role-bg-brand", ink: "text-role-text-link", Icon: ArrowDownLeft },
};

export interface StatusProps {
  status: StatusValue;
  type?: StatusType;
  size?: StatusSize;
  /** Shown after the text for inline. Pass the formatted date. */
  timestamp?: ReactNode;
  className?: string;
}

/** Always an icon or dot plus text, so the meaning never rests on color. */
export function Status({ status, type = "pill", size = "md", timestamp, className = "" }: StatusProps) {
  const s = STATUS[status];
  const px = size === "sm" ? 12 : 16;
  const icon = <s.Icon size={px} aria-hidden="true" />;

  if (type === "pill") {
    return (
      <Badge tone={s.tone} iconLeft={icon} className={className}>
        {s.text}
      </Badge>
    );
  }

  const textSize = size === "sm" ? "text-xs leading-[18px]" : "text-sm leading-[22px]";
  return (
    <span className={`inline-flex items-center gap-1.5 ${textSize} text-role-text-primary ${className}`}>
      {type === "dot" ? (
        <span aria-hidden="true" className={`${size === "sm" ? "size-1.5" : "size-2"} rounded-full ${s.dot}`} />
      ) : (
        <span aria-hidden="true" className={`inline-flex ${s.ink}`}>{icon}</span>
      )}
      {s.text}
      {type === "inline" && timestamp && <span className="text-role-text-secondary">{timestamp}</span>}
    </span>
  );
}
