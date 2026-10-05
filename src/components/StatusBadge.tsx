import { Badge } from "@/ui";
import { statusText, statusTone, type ComponentStatus } from "@/lib/components-data";
import { componentStatusTone } from "@/lib/status-tone";

export default function StatusBadge({ status, className = "" }: { status: ComponentStatus; className?: string }) {
  // Not tracked is outside the plan, so it stays an outline instead of a toned fill.
  if (status === "untracked") {
    return (
      <span className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-xs font-medium ${statusTone[status]} ${className}`}>
        {statusText[status]}
      </span>
    );
  }
  return (
    <Badge tone={componentStatusTone[status]} className={`shrink-0 ${className}`}>
      {statusText[status]}
    </Badge>
  );
}
