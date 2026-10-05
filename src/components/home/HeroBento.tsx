"use client";

import { useRef, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { Button } from "@/ui";

type Bill = { id: string; code: string; tint: string; name: string; due: string; amount: number; selected: boolean; paid: boolean };

const start: Bill[] = [
  { id: "power", code: "PWR", tint: "bg-lime", name: "Electricity", due: "Due 8 Oct", amount: 412_500, selected: true, paid: false },
  { id: "water", code: "H2O", tint: "bg-[#9bc6f5]", name: "Water", due: "Due 10 Oct", amount: 98_000, selected: true, paid: false },
  { id: "net", code: "NET", tint: "bg-[#ffd089]", name: "Internet", due: "Due 12 Oct", amount: 350_000, selected: true, paid: false },
  { id: "health", code: "INS", tint: "bg-[#e1e5eb]", name: "Health insurance", due: "Due 15 Oct", amount: 150_000, selected: false, paid: false },
];

const rupiah = (n: number) => `Rp ${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

// Real Buttons from src/ui, frozen in each state so the card shows exactly what ships.
const states = [
  { label: "default", props: {}, className: "" },
  { label: "hover", props: {}, className: "bg-brand-hover!" },
  { label: "pressed", props: {}, className: "bg-brand-hover! scale-[0.97]" },
  { label: "loading", props: { loading: true }, className: "" },
  { label: "disabled", props: { disabled: true }, className: "" },
] as const;

const scale = [
  { name: "Header 1", spec: "32/44", cls: "font-display text-[32px] leading-[44px] font-bold" },
  { name: "Body 1", spec: "18/26", cls: "text-[18px] leading-[26px]" },
  { name: "Caption 1", spec: "14/20", cls: "text-[14px] leading-[20px]" },
];

/** The hero's right side: a bills screen that works, the Button in every state, and the type scale. */
export default function HeroBento() {
  const [dark, setDark] = useState(false);
  const [bills, setBills] = useState(start);
  const [paying, setPaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const open = bills.filter((b) => !b.paid);
  const total = open.filter((b) => b.selected).reduce((n, b) => n + b.amount, 0);

  function toggle(id: string) {
    setBills((bs) => bs.map((b) => (b.id === id ? { ...b, selected: !b.selected } : b)));
  }

  function pay() {
    setPaying(true);
    timer.current = setTimeout(() => {
      setBills((bs) => bs.map((b) => (b.selected ? { ...b, paid: true, selected: false } : b)));
      setPaying(false);
    }, 900);
  }

  function reset() {
    clearTimeout(timer.current);
    setPaying(false);
    setBills(start);
  }

  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      {/* Bills: the theme switch flips only this card, through the same light and dark tokens as the site. */}
      <div
        className={`${dark ? "theme-dark" : "theme-light"} flex flex-col gap-4 rounded-[28px] border border-gray-200 bg-surface p-5 text-gray-900 shadow-[0_1px_0_rgba(11,18,32,0.04),0_24px_48px_-24px_rgba(11,18,32,0.25)] transition-colors duration-300 sm:row-span-2`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-label text-xs text-gray-600">preview / bill-payment</span>
          <button
            type="button"
            onClick={() => setDark((v) => !v)}
            aria-label={dark ? "Show the bills card in light mode" : "Show the bills card in dark mode"}
            className="flex min-h-11 items-center gap-1.5 rounded-full border border-gray-200 bg-canvas px-3 text-xs font-medium sm:min-h-8"
          >
            {dark ? <Moon size={14} aria-hidden="true" /> : <Sun size={14} aria-hidden="true" />}
            {dark ? "Dark" : "Light"}
          </button>
        </div>

        <div>
          <div className="text-[13px] text-gray-600">October bills</div>
          <div className="font-display text-[22px] font-bold tracking-[-0.01em]">
            {open.length ? `${open.length} bill${open.length === 1 ? "" : "s"} due this week` : "All bills paid"}
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {bills.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                disabled={b.paid || paying}
                aria-pressed={b.paid ? undefined : b.selected}
                onClick={() => toggle(b.id)}
                className={`flex min-h-14 w-full items-center gap-3 rounded-[14px] border p-3 text-left transition-colors ${
                  b.selected ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-canvas"
                } enabled:hover:border-gray-500 disabled:cursor-default`}
              >
                <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] font-label text-[11px] font-medium text-inverse ${b.tint}`}>
                  {b.code}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{b.name}</span>
                  <span className="block text-xs text-gray-600">{b.paid ? "Paid" : b.selected ? b.due : "Not selected"}</span>
                </span>
                <span className={`text-sm font-semibold tabular-nums ${b.paid ? "text-gray-600 line-through" : ""}`}>{rupiah(b.amount)}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-2.5">
          <div className="flex justify-between text-[13px] text-gray-600">
            <span>Selected total</span>
            <span className="font-semibold tabular-nums text-gray-900" aria-live="polite">
              {rupiah(total)}
            </span>
          </div>
          {open.length ? (
            <Button size="lg" className="w-full rounded-[14px]" loading={paying} disabled={!total} onClick={pay}>
              {total ? `Pay ${rupiah(total)}` : "Select a bill"}
            </Button>
          ) : (
            <Button size="lg" variant="ghost" className="w-full rounded-[14px]" onClick={reset}>
              Reset the demo
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3.5 rounded-3xl border border-gray-200 bg-surface p-5">
        <span className="font-label text-xs text-gray-600">button / states</span>
        <ul className="flex flex-col gap-2" aria-label="Button states">
          {states.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-3">
              <span inert className="pointer-events-none">
                <Button {...s.props} className={`min-h-9! px-3.5 text-[13px] ${s.className}`} tabIndex={-1}>
                  Pay
                </Button>
              </span>
              <span className="font-label text-[11px] text-gray-600">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl bg-lime p-5 text-inverse">
        <span className="font-label text-xs">type / scale</span>
        {scale.map((t, i) => (
          <div key={t.name} className={`flex items-baseline justify-between gap-2 ${i < scale.length - 1 ? "border-b border-inverse/20 pb-2" : ""}`}>
            <span className={t.cls}>{t.name}</span>
            <span className="font-label text-xs">{t.spec}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
