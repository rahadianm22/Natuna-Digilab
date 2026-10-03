"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check } from "@phosphor-icons/react";
import { Badge, Button } from "@/ui";

type Device = "phone" | "tablet" | "desktop";
type Mode = "light" | "dark";

// Frame widths from the Device foundation; type sizes are the Mobile, Tablet, and Website columns of the
// Typography page. The stage draws the frame narrower than life, but the type tokens are the real ones.
const devices: Record<Device, { label: string; frame: number; width: string; h1: [number, number]; body: [number, number]; caption: [number, number] }> = {
  phone: { label: "Phone", frame: 440, width: "23rem", h1: [24, 36], body: [16, 24], caption: [12, 16] },
  tablet: { label: "Tablet", frame: 1024, width: "42rem", h1: [28, 40], body: [18, 26], caption: [12, 16] },
  desktop: { label: "Desktop", frame: 1440, width: "100%", h1: [32, 44], body: [18, 26], caption: [14, 20] },
};

type Bill = { id: string; name: string; detail: string; amount: number; paid: boolean };

const initialBills: Bill[] = [
  { id: "power", name: "Electricity", detail: "Postpaid, due 12 Oct", amount: 412_500, paid: false },
  { id: "water", name: "Water", detail: "Due 15 Oct", amount: 98_000, paid: false },
  { id: "net", name: "Internet", detail: "Home 50 Mbps, due 20 Oct", amount: 350_000, paid: false },
  { id: "health", name: "Health insurance", detail: "Paid on 1 Oct", amount: 150_000, paid: true },
];

const rupiah = (n: number) => `Rp ${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

const segment =
  "min-h-11 rounded-md px-3.5 text-sm font-medium transition-colors sm:min-h-9 aria-pressed:bg-surface aria-pressed:text-gray-900 aria-pressed:shadow-sm";

/**
 * The hero is a working bills screen made of src/ui components. Switching the device resizes the frame
 * and swaps the type tokens; switching the mode flips the color tokens. Nothing in it is a picture.
 */
export default function LiveSpecimen() {
  const [device, setDevice] = useState<Device>("desktop");
  const [mode, setMode] = useState<Mode>("light");
  const [bills, setBills] = useState(initialBills);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initialBills.filter((b) => !b.paid).map((b) => b.id)));
  const [paying, setPaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // A phone visitor starts on the phone frame; a 1440 frame squeezed into 390 pixels shows nothing true.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- runs once, after the viewport is known
    if (window.matchMedia("(max-width: 639px)").matches) setDevice("phone");
  }, []);

  const d = devices[device];
  const due = bills.filter((b) => !b.paid);
  const total = due.filter((b) => selected.has(b.id)).reduce((n, b) => n + b.amount, 0);

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function pay() {
    setPaying(true);
    timer.current = setTimeout(() => {
      setBills((bs) => bs.map((b) => (selected.has(b.id) ? { ...b, paid: true } : b)));
      setSelected(new Set());
      setPaying(false);
    }, 900);
  }

  function reset() {
    clearTimeout(timer.current);
    setPaying(false);
    setBills(initialBills);
    setSelected(new Set(initialBills.filter((b) => !b.paid).map((b) => b.id)));
  }

  const type = {
    "--t-h1": `${d.h1[0]}px`,
    "--t-h1-lh": `${d.h1[1]}px`,
    "--t-body": `${d.body[0]}px`,
    "--t-body-lh": `${d.body[1]}px`,
    "--t-cap": `${d.caption[0]}px`,
    "--t-cap-lh": `${d.caption[1]}px`,
  } as CSSProperties;
  const h1 = { fontSize: "var(--t-h1)", lineHeight: "var(--t-h1-lh)" };
  const body = { fontSize: "var(--t-body)", lineHeight: "var(--t-body-lh)" };
  const cap = { fontSize: "var(--t-cap)", lineHeight: "var(--t-cap-lh)" };
  const ease = "transition-[font-size,line-height] duration-300";

  return (
    <div className="rounded-[2rem] bg-gray-50 p-3 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-4">
        <div role="group" aria-label="Device" className="flex rounded-lg bg-gray-100 p-0.5 text-gray-700">
          {(Object.keys(devices) as Device[]).map((k) => (
            <button key={k} type="button" aria-pressed={device === k} onClick={() => setDevice(k)} className={`${segment} hover:text-gray-900`}>
              {devices[k].label}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Mode" className="flex rounded-lg bg-gray-100 p-0.5 text-gray-700">
          {(["light", "dark"] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={`${segment} capitalize hover:text-gray-900`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-full transition-[width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" style={{ width: d.width }}>
        <div className="mb-2 flex items-baseline justify-between px-1 text-xs text-gray-600">
          <span className="font-medium text-gray-700">{d.label} frame</span>
          <span className="tabular-nums">W {d.frame}</span>
        </div>

        {/* The screen. Its layout answers to the frame's width through a container query, not the window's. */}
        <div style={type} className={`theme-${mode} @container overflow-hidden rounded-xl border border-gray-300 shadow-md transition-colors duration-300`}>
          <div className="bg-canvas p-4 @xl:p-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p style={cap} className={`text-gray-600 ${ease}`}>October</p>
                <h3 style={h1} className={`font-bold text-gray-900 ${ease}`}>Bills</h3>
              </div>
              <Badge tone={due.length ? "warning" : "success"}>{due.length ? `${due.length} due` : "All paid"}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 @xl:grid-cols-[minmax(0,1fr)_15rem] @xl:items-start">
              <ul className="min-w-0 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-surface">
                {bills.map((b) => {
                  const on = !b.paid && selected.has(b.id);
                  return (
                    <li key={b.id}>
                      <button
                        type="button"
                        disabled={b.paid || paying}
                        aria-pressed={b.paid ? undefined : on}
                        onClick={() => toggle(b.id)}
                        className="flex min-h-14 w-full items-center gap-3 px-3 py-2.5 text-left transition-colors enabled:hover:bg-gray-50 disabled:cursor-default"
                      >
                        <span
                          aria-hidden="true"
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                            b.paid ? "border-transparent bg-emerald-100 text-emerald-800" : on ? "border-blue-600 bg-brand text-white" : "border-gray-500"
                          }`}
                        >
                          {(on || b.paid) && <Check size={12} weight="bold" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span style={body} className={`block truncate font-semibold text-gray-900 ${ease}`}>{b.name}</span>
                          <span style={cap} className={`block truncate text-gray-600 ${ease}`}>{b.detail}</span>
                        </span>
                        <span style={body} className={`shrink-0 tabular-nums ${b.paid ? "text-gray-600 line-through" : "text-gray-900"} ${ease}`}>
                          {rupiah(b.amount)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="rounded-xl border border-gray-200 bg-surface p-4">
                <p style={cap} className={`text-gray-600 ${ease}`}>Selected</p>
                <p style={h1} className={`font-bold tabular-nums text-gray-900 ${ease}`} aria-live="polite">
                  {rupiah(total)}
                </p>
                {due.length ? (
                  <Button className="mt-4 w-full" size="lg" loading={paying} disabled={!total} onClick={pay}>
                    {total ? `Pay ${rupiah(total)}` : "Select a bill"}
                  </Button>
                ) : (
                  <Button className="mt-4 w-full" size="lg" variant="ghost" onClick={reset}>
                    Reset the demo
                  </Button>
                )}
                <p style={cap} className={`mt-3 text-gray-600 ${ease}`}>From wallet •••• 4821</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The tokens in play right now, so the change on screen has a name. */}
      <dl className="mx-auto mt-5 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-3 px-1 text-sm sm:grid-cols-4">
        {[
          ["Header 1", `${d.h1[0]} / ${d.h1[1]}`],
          ["Body 1", `${d.body[0]} / ${d.body[1]}`],
          ["Caption 1", `${d.caption[0]} / ${d.caption[1]}`],
          ["Mode", mode === "light" ? "Light" : "Dark"],
        ].map(([k, v]) => (
          <div key={k} className="border-l-2 border-blue-600 pl-3">
            <dt className="text-gray-600">{k}</dt>
            <dd key={v} className="screen-in font-semibold tabular-nums text-gray-900">
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
