"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Avatar, Badge, Button, Input } from "@/ui";

type Mode = "light" | "dark";
type Step = "form" | "sending" | "sent";

const BALANCE = 2_450_000;
const QUICK = [50_000, 100_000, 250_000];

/** 2450000 -> "2.450.000", the Indonesian thousands separator. Written by hand so server and client agree. */
function rupiah(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Token names exactly as they appear in the Figma variable list. Each one points at the element marked
// with the same data-callout value, measured after layout, so a label can never drift off its part.
const callouts = [
  { key: "title", label: "Subheader", detail: "18 / 26 Semibold", side: "left" },
  { key: "card", label: "Rounded/16", detail: "Padding/12", side: "right" },
  { key: "device", label: "shadow-md", detail: "8% + 12% layers", side: "right" },
  { key: "send", label: "Rounded/8", detail: "Width & Height/48", side: "left" },
] as const;

type Pin = { top: number; reach: number };

/**
 * A working transfer screen built only from src/ui components, laid out as an artboard 440 wide (the
 * Android frame in the Device foundation), cropped to its content. Red spec lines name the tokens the
 * screen is drawn with, so the picture is also documentation.
 */
export default function HeroPhone() {
  const [mode, setMode] = useState<Mode>("light");
  const [amount, setAmount] = useState("50.000");
  const [error, setError] = useState<string>();
  const [step, setStep] = useState<Step>("form");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrap = useRef<HTMLDivElement>(null);
  const [pins, setPins] = useState<Record<string, Pin>>({});
  const value = Number(amount.replace(/\D/g, ""));

  // Vertical center of each target, and how far its near edge sits inside the device, so the leader
  // line can run from the label all the way to the part.
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    // Layout offsets, not getBoundingClientRect: the entrance animation still has the device shifted down
    // when this runs, and offsets ignore transforms, so the labels land where the parts come to rest.
    function offsetIn(t: HTMLElement) {
      let top = 0;
      let left = 0;
      for (let node: HTMLElement | null = t; node && node !== el; node = node.offsetParent as HTMLElement | null) {
        top += node.offsetTop;
        left += node.offsetLeft;
      }
      return { top, left };
    }
    function measure() {
      const width = el!.offsetWidth;
      const next: Record<string, Pin> = {};
      for (const c of callouts) {
        const t = el!.querySelector<HTMLElement>(`[data-callout="${c.key}"]`);
        if (!t) continue;
        const { top, left } = offsetIn(t);
        const inset = c.side === "left" ? left : width - (left + t.offsetWidth);
        // Stop 6px short of the part, so the dot reads as a pointer, not a bullet glued to the text.
        next[c.key] = { top: top + t.offsetHeight / 2, reach: Math.max(0, inset - 6) };
      }
      setPins(next);
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [step]);

  function change(raw: string) {
    const digits = raw.replace(/\D/g, "").replace(/^0+/, "").slice(0, 9);
    setAmount(digits ? rupiah(Number(digits)) : "");
    setError(undefined);
  }

  function send(e: FormEvent) {
    e.preventDefault();
    if (!value) return setError("Enter an amount to send.");
    if (value > BALANCE) return setError(`That is more than your balance of Rp ${rupiah(BALANCE)}.`);
    setStep("sending");
    timer.current = setTimeout(() => setStep("sent"), 900);
  }

  function again() {
    clearTimeout(timer.current);
    setStep("form");
  }

  return (
    // A page from the design file, not a device ad: a quiet canvas, a named artboard at the Android frame
    // size from the Device foundation, and red spec lines like the ones the Natuna Figma pages use.
    <div className="rounded-2xl bg-gray-50 px-5 pb-6 pt-8 sm:px-10">
      <div ref={wrap} className="relative mx-auto w-full max-w-[18.5rem]">
        <div className="mb-2 flex items-baseline justify-between gap-3 text-xs">
          <span className="font-medium text-gray-700">Android / Send money</span>
          <span className="tabular-nums text-gray-600">W 440, cropped</span>
        </div>

        {callouts.map((c, i) => {
          const pin = pins[c.key];
          if (!pin) return null;
          return (
            <div
              key={c.key}
              aria-hidden="true"
              className={`rise absolute z-10 hidden -translate-y-1/2 items-center gap-2 xl:flex ${
                c.side === "left" ? "flex-row" : "flex-row-reverse"
              }`}
              style={
                {
                  top: pin.top,
                  [c.side === "left" ? "right" : "left"]: `calc(100% - ${pin.reach}px)`,
                  "--d": `${700 + i * 90}ms`,
                } as CSSProperties
              }
            >
              <div className={`whitespace-nowrap ${c.side === "left" ? "text-right" : ""}`}>
                <div className="text-xs font-semibold text-gray-900">{c.label}</div>
                <div className="text-xs text-gray-600">{c.detail}</div>
              </div>
              <span className="h-px bg-[#d64748]" style={{ width: 12 + pin.reach }} />
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#d64748]" />
            </div>
          );
        })}

        <div
          data-callout="device"
          className={`theme-${mode} rise overflow-hidden rounded-lg border border-gray-300 shadow-md`}
          style={{ "--d": "250ms" } as CSSProperties}
        >
          <div className="flex min-h-[26.5rem] flex-col bg-canvas pb-5 text-gray-900 transition-colors duration-300">
            <div className="flex items-center justify-between px-4 pb-2 pt-5">
              <div data-callout="title" className="text-lg font-semibold leading-[26px]">Send money</div>
              {step === "sent" && <Badge tone="success">Sent</Badge>}
            </div>

            {step === "sent" ? (
              <div key="sent" role="status" className="screen-in flex flex-1 flex-col items-center justify-center px-4 pb-6 text-center">
                <span className="pop flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <div className="mt-5 text-2xl font-bold leading-9">Rp&nbsp;{amount}</div>
                <div className="mt-1 text-sm text-gray-600">sent to Rina Putri</div>
                <Button variant="ghost" className="mt-8 w-full" onClick={again}>
                  Send another
                </Button>
              </div>
            ) : (
              <form key="form" onSubmit={send} noValidate className="screen-in flex flex-col gap-4 px-4">
                <div data-callout="card" className="flex items-center gap-3 rounded-xl border border-gray-200 bg-surface p-3">
                  <Avatar name="Rina Putri" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">Rina Putri</div>
                    <div className="text-xs text-gray-600">Bank account •••• 4821</div>
                  </div>
                </div>

                <Input
                  label="Amount in rupiah"
                  inputMode="numeric"
                  autoComplete="off"
                  value={amount}
                  onChange={(e) => change(e.target.value)}
                  error={error}
                  hint={error ? undefined : `Balance Rp ${rupiah(BALANCE)}`}
                  disabled={step === "sending"}
                />

                <div className="flex gap-2" role="group" aria-label="Quick amounts">
                  {QUICK.map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={step === "sending"}
                      onClick={() => change(String(q))}
                      aria-pressed={value === q}
                      className={`min-h-11 flex-1 rounded-md text-xs font-medium tabular-nums transition-[background-color,color,transform] duration-100 active:scale-[0.97] sm:min-h-9 ${
                        value === q ? "bg-blue-50 text-blue-800 ring-1 ring-blue-600" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {rupiah(q / 1000)}k
                    </button>
                  ))}
                </div>

                <Input
                  label="Note (optional)"
                  placeholder="Dinner on Friday"
                  autoComplete="off"
                  maxLength={40}
                  disabled={step === "sending"}
                />

                <Button data-callout="send" type="submit" size="lg" loading={step === "sending"} className="mt-2 w-full">
                  {value ? `Send Rp ${amount}` : "Send"}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Where the spec lines do not fit beside the artboard, the same tokens sit under it as a list. */}
        <dl className="mt-5 hidden grid-cols-2 gap-x-6 gap-y-3 sm:grid xl:hidden">
          {callouts.map((c) => (
            <div key={c.key} className="border-l-2 border-[#d64748] pl-2.5">
              <dt className="text-xs font-semibold text-gray-900">{c.label}</dt>
              <dd className="text-xs text-gray-600">{c.detail}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span id="stage-mode" className="text-sm text-gray-600">Artboard mode</span>
          <div role="group" aria-labelledby="stage-mode" className="flex rounded-lg bg-gray-100 p-0.5">
            {(["light", "dark"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={`min-h-11 rounded-md px-4 text-sm font-medium capitalize transition-colors sm:min-h-9 ${
                  mode === m ? "bg-surface text-gray-900 shadow-sm" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
