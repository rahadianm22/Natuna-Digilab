"use client";

// Live demos for component pages. Each one matches the code shown under it in component-docs.ts,
// so what people copy is what they just used.

import { useState, type ReactElement, type ReactNode } from "react";
import { Accordion, Avatar, Badge, Button, Input, type AvatarSize, type BadgeTone, type ButtonVariant } from "@/ui";

function ButtonDemo() {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function run(set: (busy: boolean) => void) {
    set(true);
    setTimeout(() => set(false), 1500);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button loading={saving} onClick={() => run(setSaving)}>Save changes</Button>
        <Button variant="secondary">Export</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="destructive" loading={deleting} onClick={() => run(setDeleting)}>
          Delete account
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg">Pay Rp&nbsp;412.500</Button>
        <Button disabled>Unavailable</Button>
      </div>
    </div>
  );
}

function BadgeDemo() {
  const [paid, setPaid] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <span className="text-sm text-gray-700">Invoice INV-0042</span>
      <Badge tone={paid ? "success" : "warning"}>{paid ? "Paid" : "Pending"}</Badge>
      <Button variant="ghost" onClick={() => setPaid(!paid)}>
        {paid ? "Mark as pending" : "Mark as paid"}
      </Button>
    </div>
  );
}

function InputDemo() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="mx-auto w-full max-w-xs">
      <Input
        label="Email"
        type="email"
        value={email}
        placeholder="email@example.com"
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        hint="We send the receipt here."
        error={invalid ? "Enter a valid email address." : undefined}
      />
    </div>
  );
}

function AvatarDemo() {
  const [name, setName] = useState("Natuna Digilab");

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-5">
      <div className="flex items-end gap-3">
        <Avatar name={name || "?"} size="sm" />
        <Avatar name={name || "?"} />
        <Avatar name={name || "?"} size="lg" />
      </div>
      <div className="w-full">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
    </div>
  );
}

function AccordionDemo() {
  return (
    <Accordion
      className="mx-auto w-full max-w-md"
      items={[
        { title: "How long does a transfer take?", content: "Most transfers arrive within a minute.", defaultOpen: true },
        { title: "What are the limits?", content: "Limits depend on your account type." },
      ]}
    />
  );
}

export const demos: Record<string, () => ReactElement> = {
  button: ButtonDemo,
  badge: BadgeDemo,
  input: InputDemo,
  avatar: AvatarDemo,
  accordion: AccordionDemo,
};

export default function Demo({ slug }: { slug: string }) {
  const D = demos[slug];
  return D ? <D /> : null;
}

// Variants and states: every specimen is the real component from src/ui, fixed in one state.

const caption = "text-xs text-gray-700";
const code = "font-mono-code text-[13px] text-gray-900";

function Specimen({ label, detail, children, className = "" }: { label: string; detail?: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`flex flex-col gap-3 rounded-lg border border-gray-200 bg-surface p-4 ${className}`}>
      <figcaption className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-sm font-semibold text-gray-900">{label}</span>
        {detail && <span className={caption}>{detail}</span>}
      </figcaption>
      {children}
    </figure>
  );
}

const buttonVariants: ButtonVariant[] = ["primary", "secondary", "ghost", "destructive", "inverse"];
const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

function ButtonMatrix() {
  return (
    <div className="space-y-6">
      {/* Phones get one block per variant, so no state column is pushed off screen. */}
      <div className="grid gap-4 sm:hidden">
        {buttonVariants.map((v) => (
          <Specimen key={v} label={`variant ${v}`} detail="default, disabled, loading">
            <div className="flex flex-wrap gap-3">
              <Button variant={v}>{capitalize(v)}</Button>
              <Button variant={v} disabled>{capitalize(v)}</Button>
              <Button variant={v} loading>{capitalize(v)}</Button>
            </div>
          </Specimen>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-surface sm:block">
        <table className="w-full min-w-[30rem] text-left text-sm">
          <caption className="sr-only">Button variants in the default, disabled, and loading states</caption>
          <thead className="border-b border-gray-200 text-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Variant</th>
              <th scope="col" className="px-4 py-3 font-medium">Default</th>
              <th scope="col" className="px-4 py-3 font-medium">Disabled</th>
              <th scope="col" className="px-4 py-3 font-medium">Loading</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {buttonVariants.map((v) => (
              <tr key={v}>
                <th scope="row" className={`px-4 py-3 font-semibold ${code}`}>{v}</th>
                <td className="px-4 py-3"><Button variant={v}>{capitalize(v)}</Button></td>
                <td className="px-4 py-3"><Button variant={v} disabled>{capitalize(v)}</Button></td>
                <td className="px-4 py-3"><Button variant={v} loading>{capitalize(v)}</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Specimen label="size md" detail="At least 44px tall">
          <div><Button>Save changes</Button></div>
        </Specimen>
        <Specimen label="size lg" detail="At least 48px tall">
          <div><Button size="lg">Save changes</Button></div>
        </Specimen>
      </div>
      <ul className="max-w-2xl list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700">
        <li>These buttons are live but do nothing. Hover one, or Tab to it to see the focus outline.</li>
        <li>
          Hover changes the fill: <code className={code}>brand-hover</code> for primary, <code className={code}>gray-200</code> for
          secondary, <code className={code}>gray-50</code> for ghost, <code className={code}>danger-hover</code> for destructive, <code className={code}>gray-800</code> for inverse.
        </li>
        <li>
          Disabled looks the same for every variant: a <code className={code}>gray-100</code> fill with <code className={code}>gray-500</code>{" "}
          text. Disabled controls are exempt from the text contrast rule.
        </li>
        <li>Loading keeps the variant color and the width, hides the label visually, and shows a spinner.</li>
      </ul>
    </div>
  );
}

const badgeTones: { tone: BadgeTone; text: string; colors: string }[] = [
  { tone: "neutral", text: "Draft", colors: "gray-100 / gray-700" },
  { tone: "info", text: "New", colors: "blue-100 / blue-900" },
  { tone: "success", text: "Paid", colors: "emerald-100 / emerald-900" },
  { tone: "warning", text: "Pending", colors: "amber-100 / amber-900" },
  { tone: "danger", text: "Failed", colors: "red-100 / red-900" },
];

function BadgeMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {badgeTones.map((b) => (
        <Specimen key={b.tone} label={`tone ${b.tone}`} detail={`Fill / text: ${b.colors}`}>
          <div><Badge tone={b.tone}>{b.text}</Badge></div>
        </Specimen>
      ))}
    </div>
  );
}

function InputMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Specimen label="Default" detail="label only">
        <Input label="Full name" />
      </Specimen>
      <Specimen label="With hint" detail="hint">
        <Input label="Phone number" type="tel" hint="We only call about this order." />
      </Specimen>
      <Specimen label="Error" detail="error replaces hint">
        <Input label="Email" type="email" defaultValue="budi@" hint="We send the receipt here." error="Enter a valid email address." />
      </Specimen>
      <Specimen label="Disabled" detail="native disabled">
        <Input label="Invoice number" defaultValue="INV-0042" disabled />
      </Specimen>
    </div>
  );
}

const avatarSizes: { size: AvatarSize; px: string }[] = [
  { size: "sm", px: "32px" },
  { size: "md", px: "40px" },
  { size: "lg", px: "56px" },
];

function AvatarMatrix() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {avatarSizes.map((a) => (
          <Specimen key={a.size} label={`size ${a.size}`} detail={a.px}>
            <div className="flex h-14 items-center"><Avatar name="Natuna Digilab" size={a.size} /></div>
          </Specimen>
        ))}
      </div>
      <p className="text-sm text-gray-700">Initials come from the first and last word of the name, so a one-word name gives one letter.</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {["Budi", "Natuna Digilab", "Siti Nur Aisyah"].map((name) => (
          <Specimen key={name} label={`name "${name}"`}>
            <div className="flex h-14 items-center"><Avatar name={name} /></div>
          </Specimen>
        ))}
      </div>
    </div>
  );
}

function AccordionMatrix() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700">These specimens are inert, so each one stays in the state it is labelled with.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Specimen label="Closed" detail="default">
          <div inert>
            <Accordion items={[{ title: "What are the limits?", content: "Limits depend on your account type." }]} />
          </div>
        </Specimen>
        <Specimen label="Open" detail="defaultOpen">
          <div inert>
            <Accordion items={[{ title: "What are the limits?", content: "Limits depend on your account type.", defaultOpen: true }]} />
          </div>
        </Specimen>
        <Specimen label="Long title" detail="wraps, caret stays put" className="sm:col-span-2">
          <div inert>
            <Accordion
              items={[
                {
                  title: "Can I send money to an account at another bank, and how long does that transfer take to arrive?",
                  content: "Most transfers arrive within a minute.",
                },
              ]}
            />
          </div>
        </Specimen>
      </div>
    </div>
  );
}

const matrices: Record<string, () => ReactElement> = {
  button: ButtonMatrix,
  badge: BadgeMatrix,
  input: InputMatrix,
  avatar: AvatarMatrix,
  accordion: AccordionMatrix,
};

export function StatesMatrix({ slug }: { slug: string }) {
  const M = matrices[slug];
  return M ? <M /> : null;
}
