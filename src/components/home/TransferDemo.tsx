"use client";

import { useId, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { Badge, Button } from "@/ui";

const banks = ["Bank A", "Bank B", "Bank C"];
const LIMIT = 25_000_000;

const rupiah = (n: number) => n.toLocaleString("id-ID");

/**
 * A working transfer form built from Natuna components. Nothing is sent anywhere: the last step
 * only shows the summary a real app would confirm.
 */
export default function TransferDemo() {
  const id = useId();
  const [bank, setBank] = useState(banks[0]);
  const [amount, setAmount] = useState(250_000);
  const [schedule, setSchedule] = useState<"now" | "later">("now");
  const [date, setDate] = useState("");
  const [state, setState] = useState<"edit" | "checking" | "review">("edit");

  const tooHigh = amount > LIMIT;
  const missingDate = schedule === "later" && !date;
  const blocked = amount <= 0 || tooHigh || missingDate;

  function review() {
    setState("checking");
    setTimeout(() => setState("review"), 900);
  }

  if (state === "review") {
    return (
      <div className="flex flex-col items-center py-6 text-center" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <CheckCircle size={32} weight="fill" aria-hidden="true" />
        </span>
        <div className="mt-4 text-lg font-bold text-gray-900">Ready to send</div>
        <div className="mt-1 text-3xl font-extrabold tabular-nums tracking-tight text-gray-900">Rp {rupiah(amount)}</div>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          to {bank}
          <Badge tone="info">{schedule === "now" ? "Now" : date}</Badge>
        </div>
        <p className="mt-4 max-w-xs text-xs text-gray-600">This is a demo. Nothing was sent.</p>
        <Button variant="ghost" className="mt-5" onClick={() => setState("edit")}>
          Edit transfer
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!blocked) review();
      }}
      className="space-y-5"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-bank`} className="text-xs font-semibold text-gray-700">Recipient bank</label>
        <select
          id={`${id}-bank`}
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="min-h-11 rounded-md border border-gray-300 bg-surface px-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {banks.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-amount`} className="text-xs font-semibold text-gray-700">Amount</label>
        <span
          className={`flex min-h-12 items-center rounded-md border-2 px-3 focus-within:ring-2 ${
            tooHigh ? "border-red-700 focus-within:ring-red-300" : "border-gray-300 focus-within:border-blue-600 focus-within:ring-blue-200"
          }`}
        >
          <span className="text-base font-semibold text-gray-600">Rp</span>
          <input
            id={`${id}-amount`}
            inputMode="numeric"
            value={amount ? rupiah(amount) : ""}
            placeholder="0"
            aria-invalid={tooHigh || undefined}
            aria-describedby={`${id}-amount-note`}
            onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "").slice(0, 12)) || 0)}
            className="w-full bg-transparent px-2 text-xl font-semibold tabular-nums text-gray-900 outline-none placeholder:text-gray-500"
          />
        </span>
        <span id={`${id}-amount-note`} className={`text-xs ${tooHigh ? "text-red-700" : "text-gray-600"}`}>
          {tooHigh ? `The limit per transfer is Rp ${rupiah(LIMIT)}.` : `Up to Rp ${rupiah(LIMIT)} per transfer.`}
        </span>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold text-gray-700">Schedule</legend>
        <div className="flex gap-2">
          {(["now", "later"] as const).map((s) => (
            <Button
              key={s}
              variant={schedule === s ? "primary" : "ghost"}
              aria-pressed={schedule === s}
              onClick={() => setSchedule(s)}
            >
              {s === "now" ? "Now" : "Pick a date"}
            </Button>
          ))}
        </div>
        {schedule === "later" && (
          <input
            type="date"
            aria-label="Transfer date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-3 min-h-11 w-full rounded-md border border-gray-300 bg-surface px-3 text-sm text-gray-900"
          />
        )}
      </fieldset>

      <Button type="submit" size="lg" className="w-full" loading={state === "checking"} disabled={blocked}>
        {state === "checking" ? "Checking" : "Review transfer"}
      </Button>
      {missingDate && <p className="text-center text-xs text-gray-600">Pick a date to continue.</p>}
    </form>
  );
}
