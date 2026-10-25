import { Check, Warning } from "@phosphor-icons/react/ssr";

export interface Step {
  title: string;
  description?: string;
  disabled?: boolean;
}

export interface StepperProps {
  steps: Step[];
  /** Index of the active step. Steps before it are completed, steps after it are upcoming. */
  current: number;
  /** Index of a step in error, if any. */
  errorAt?: number;
  type?: "horizontal" | "vertical";
  className?: string;
}

type StepState = "completed" | "active" | "default" | "error" | "disabled";

const MARKER: Record<StepState, string> = {
  completed: "bg-role-status-success text-role-bg-surface",
  active: "bg-role-bg-brand text-role-text-on-brand ring-4 ring-role-bg-tone-info",
  default: "bg-role-bg-subtle text-role-text-secondary",
  error: "bg-role-bg-danger text-role-text-on-danger",
  disabled: "bg-role-bg-subtle text-role-text-disabled",
};

function Marker({ state, n }: { state: StepState; n: number }) {
  return (
    <span aria-hidden="true" className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${MARKER[state]}`}>
      {state === "completed" ? <Check size={14} weight="bold" /> : state === "error" ? <Warning size={14} weight="bold" /> : n}
    </span>
  );
}

/** A progress indicator for a multi-step flow. It shows where the user is. It does not move them. */
export function Stepper({ steps, current, errorAt, type = "horizontal", className = "" }: StepperProps) {
  const stateOf = (i: number, s: Step): StepState =>
    s.disabled ? "disabled" : i === errorAt ? "error" : i < current ? "completed" : i === current ? "active" : "default";

  const horizontal = type === "horizontal";

  return (
    <ol className={`flex ${horizontal ? "items-start" : "flex-col"} ${className}`}>
      {steps.map((s, i) => {
        const state = stateOf(i, s);
        const last = i === steps.length - 1;
        const done = i < current;
        const line = done ? "bg-role-status-success" : "bg-role-border-default";
        const text = state === "error" ? "text-role-text-danger" : state === "disabled" ? "text-role-text-disabled" : "text-role-text-primary";

        return (
          <li
            key={i}
            aria-current={state === "active" ? "step" : undefined}
            className={horizontal ? `flex ${last ? "" : "grow"} items-start` : "flex gap-3"}
          >
            {horizontal ? (
              <>
                <div className="flex min-w-20 flex-col items-center gap-2 text-center">
                  <Marker state={state} n={i + 1} />
                  <div>
                    <p className={`text-xs font-medium leading-4 ${text}`}>{s.title}</p>
                    {s.description && <p className={`mt-0.5 text-xs leading-[18px] ${state === "error" ? "text-role-text-danger" : "text-role-text-secondary"}`}>{s.description}</p>}
                  </div>
                </div>
                {!last && <span aria-hidden="true" className={`mt-3 h-0.5 min-w-4 grow ${line}`} />}
              </>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <Marker state={state} n={i + 1} />
                  {!last && <span aria-hidden="true" className={`my-1 w-0.5 grow ${line}`} />}
                </div>
                <div className={last ? "" : "pb-5"}>
                  <p className={`text-sm font-medium leading-6 ${text}`}>{s.title}</p>
                  {s.description && <p className={`text-xs leading-[18px] ${state === "error" ? "text-role-text-danger" : "text-role-text-secondary"}`}>{s.description}</p>}
                </div>
              </>
            )}
            <span className="sr-only">{state === "completed" ? " (completed)" : state === "error" ? " (error)" : state === "disabled" ? " (disabled)" : ""}</span>
          </li>
        );
      })}
    </ol>
  );
}
