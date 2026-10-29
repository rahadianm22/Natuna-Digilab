import type { HTMLAttributes, ReactNode } from "react";
import { Avatar } from "./avatar";

export type CommentType = "thread" | "annotation";
export type CommentState = "default" | "highlight" | "resolved";

export interface CommentProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  type?: CommentType;
  state?: CommentState;
  author: string;
  /** Role tag next to the name, such as Approver. */
  role?: string;
  timestamp: string;
  children: ReactNode;
  /** Thread only. Shows the Reply action. */
  onReply?: () => void;
  /** Thread only. Shows Resolve, or Reopen when the state is resolved. */
  onToggleResolved?: () => void;
}

const surface: Record<CommentState, string> = {
  default: "border-role-border-default bg-role-bg-canvas",
  highlight: "border-role-bg-brand bg-role-bg-tone-info shadow-sm",
  resolved: "border-role-border-default bg-role-bg-subtle",
};

/** Thread for threaded replies, annotation for a remark with no actions. */
export function Comment({ type = "thread", state = "default", author, role, timestamp, children, onReply, onToggleResolved, className = "", ...rest }: CommentProps) {
  return (
    <article
      aria-label={`Comment by ${author}`}
      className={`flex flex-col gap-2 rounded-md border p-3 ${surface[state]} ${type === "annotation" ? "border-l-[3px] border-l-role-status-warning" : ""} ${className}`}
      {...rest}
    >
      <header className="flex items-center gap-2">
        <Avatar name={author} size="sm" />
        <span className="text-xs font-semibold text-role-text-primary">{author}</span>
        {role && <span className="rounded-full bg-role-bg-subtle px-2 text-xs leading-5 text-role-text-secondary">{role}</span>}
        <span className="ml-auto text-xs text-role-text-secondary">{timestamp}</span>
      </header>
      <div className={`text-sm leading-[22px] ${state === "resolved" ? "text-role-text-secondary" : "text-role-text-primary"}`}>{children}</div>
      {type === "thread" && (onReply || onToggleResolved) && (
        <div className="-mb-2 flex gap-3 text-sm">
          {onReply && (
            <button type="button" onClick={onReply} className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm ${state === "default" ? "text-role-text-link" : "text-role-text-primary underline"}`}>
              Reply
            </button>
          )}
          {onToggleResolved && (
            <button type="button" onClick={onToggleResolved} className="inline-flex min-h-11 items-center rounded-sm text-role-text-secondary">
              {state === "resolved" ? "Reopen" : "Resolve"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
