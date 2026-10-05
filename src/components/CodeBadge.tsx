/**
 * Marks a component that has React code in src/ui. It is derived from componentDocs, never typed per component, and
 * it answers a different question than the design status next to it. White on brand blue is 8.0:1.
 */
export default function CodeBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded bg-brand px-2 py-0.5 text-xs font-medium text-white ${className}`}>
      In React
    </span>
  );
}
