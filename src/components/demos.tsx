"use client";

// Live demos for component pages. Each one matches the code shown under it in component-docs.ts,
// so what people copy is what they just used.

import { useState, type ReactElement } from "react";
import { Accordion, Avatar, Badge, Button, Input } from "@/ui";

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
