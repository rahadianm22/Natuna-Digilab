import { statusText, statusTone, type ComponentStatus } from "@/lib/components-data";

export default function StatusBadge({ status, className = "" }: { status: ComponentStatus; className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-xs font-medium ${statusTone[status]} ${className}`}>
      {statusText[status]}
    </span>
  );
}
