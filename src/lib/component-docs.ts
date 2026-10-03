// API docs for components that exist in src/ui. Keep the props in step with those files and the
// usage code in step with the live demos in src/components/demos.tsx.

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentDoc {
  importCode: { js: string; ts: string };
  usage: { js: string; ts: string };
  props: PropDoc[];
}

export const componentDocs: Record<string, ComponentDoc> = {
  button: {
    importCode: {
      js: `import { useState } from "react";
import { Button } from "@/ui";`,
      ts: `import { useState } from "react";
import { Button } from "@/ui";`,
    },
    usage: {
      js: `export default function ButtonDemo() {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function run(set) {
    set(true);
    setTimeout(() => set(false), 1500);
  }

  return (
    <>
      <Button loading={saving} onClick={() => run(setSaving)}>Save changes</Button>
      <Button variant="secondary">Export</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive" loading={deleting} onClick={() => run(setDeleting)}>
        Delete account
      </Button>
      <Button size="lg">Pay Rp 412.500</Button>
      <Button disabled>Unavailable</Button>
    </>
  );
}`,
      ts: `export default function ButtonDemo() {
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  function run(set: (busy: boolean) => void): void {
    set(true);
    setTimeout(() => set(false), 1500);
  }

  return (
    <>
      <Button loading={saving} onClick={() => run(setSaving)}>Save changes</Button>
      <Button variant="secondary">Export</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive" loading={deleting} onClick={() => run(setDeleting)}>
        Delete account
      </Button>
      <Button size="lg">Pay Rp 412.500</Button>
      <Button disabled>Unavailable</Button>
    </>
  );
}`,
    },
    props: [
      { name: "variant", type: '"primary" | "secondary" | "ghost" | "destructive"', default: '"primary"', description: "Visual weight. Use one primary per view." },
      { name: "size", type: '"md" | "lg"', default: '"md"', description: "md is 40px tall (44px on phones, for touch), lg is 48px." },
      { name: "loading", type: "boolean", default: "false", description: "Shows a spinner over the label, sets aria-busy, and blocks clicks. The button keeps its size and color." },
      { name: "disabled", type: "boolean", default: "false", description: "Blocks interaction and uses the disabled colors." },
      { name: "type", type: '"button" | "submit" | "reset"', default: '"button"', description: "Defaults to button so a button inside a form does not submit by accident." },
      { name: "...rest", type: "ButtonHTMLAttributes", description: "Every native button attribute, such as onClick and aria-label." },
    ],
  },
  badge: {
    importCode: {
      js: `import { useState } from "react";
import { Badge, Button } from "@/ui";`,
      ts: `import { useState } from "react";
import { Badge, Button, type BadgeTone } from "@/ui";`,
    },
    usage: {
      js: `export default function BadgeDemo() {
  const [paid, setPaid] = useState(false);

  return (
    <>
      <span>Invoice INV-0042</span>
      <Badge tone={paid ? "success" : "warning"}>{paid ? "Paid" : "Pending"}</Badge>
      <Button variant="ghost" onClick={() => setPaid(!paid)}>
        {paid ? "Mark as pending" : "Mark as paid"}
      </Button>
    </>
  );
}`,
      ts: `export default function BadgeDemo() {
  const [paid, setPaid] = useState<boolean>(false);
  const tone: BadgeTone = paid ? "success" : "warning";

  return (
    <>
      <span>Invoice INV-0042</span>
      <Badge tone={tone}>{paid ? "Paid" : "Pending"}</Badge>
      <Button variant="ghost" onClick={() => setPaid(!paid)}>
        {paid ? "Mark as pending" : "Mark as paid"}
      </Button>
    </>
  );
}`,
    },
    props: [
      { name: "tone", type: '"neutral" | "info" | "success" | "warning" | "danger"', default: '"neutral"', description: "Color for the meaning. Always pair it with text." },
      { name: "...rest", type: "HTMLAttributes<HTMLSpanElement>", description: "Every native span attribute." },
    ],
  },
  input: {
    importCode: {
      js: `import { useState } from "react";
import { Input } from "@/ui";`,
      ts: `import { useState, type ChangeEvent } from "react";
import { Input } from "@/ui";`,
    },
    usage: {
      js: `const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export default function InputDemo() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = touched && !EMAIL.test(email);

  return (
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
  );
}`,
      ts: `const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export default function InputDemo() {
  const [email, setEmail] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);
  const invalid: boolean = touched && !EMAIL.test(email);

  return (
    <Input
      label="Email"
      type="email"
      value={email}
      placeholder="email@example.com"
      onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      onBlur={() => setTouched(true)}
      hint="We send the receipt here."
      error={invalid ? "Enter a valid email address." : undefined}
    />
  );
}`,
    },
    props: [
      { name: "label", type: "string", description: "Required visible label, connected to the field." },
      { name: "hint", type: "string", description: "Helper text under the field." },
      { name: "error", type: "string", description: "Marks the field invalid, sets aria-invalid, and replaces the hint." },
      { name: "...rest", type: "InputHTMLAttributes", description: "Every native input attribute except id, which is generated." },
    ],
  },
  avatar: {
    importCode: {
      js: `import { useState } from "react";
import { Avatar, Input } from "@/ui";`,
      ts: `import { useState } from "react";
import { Avatar, Input, type AvatarSize } from "@/ui";`,
    },
    usage: {
      js: `export default function AvatarDemo() {
  const [name, setName] = useState("Natuna Digilab");

  return (
    <>
      <Avatar name={name || "?"} size="sm" />
      <Avatar name={name || "?"} />
      <Avatar name={name || "?"} size="lg" />
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
    </>
  );
}`,
      ts: `const sizes: AvatarSize[] = ["sm", "md", "lg"];

export default function AvatarDemo() {
  const [name, setName] = useState<string>("Natuna Digilab");

  return (
    <>
      {sizes.map((size) => (
        <Avatar key={size} name={name || "?"} size={size} />
      ))}
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
    </>
  );
}`,
    },
    props: [
      { name: "name", type: "string", description: "Full name. Initials come from the first and last word, and the name is the accessible label." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "32, 40, or 56px." },
    ],
  },
  accordion: {
    importCode: {
      js: `import { Accordion } from "@/ui";`,
      ts: `import { Accordion, type AccordionItem } from "@/ui";`,
    },
    usage: {
      js: `const items = [
  { title: "How long does a transfer take?", content: "Most transfers arrive within a minute.", defaultOpen: true },
  { title: "What are the limits?", content: "Limits depend on your account type." },
];

export default function AccordionDemo() {
  return <Accordion items={items} />;
}`,
      ts: `const items: AccordionItem[] = [
  { title: "How long does a transfer take?", content: "Most transfers arrive within a minute.", defaultOpen: true },
  { title: "What are the limits?", content: "Limits depend on your account type." },
];

export default function AccordionDemo() {
  return <Accordion items={items} />;
}`,
    },
    props: [
      { name: "items", type: "AccordionItem[]", description: "Each item has a title, content, and optional defaultOpen." },
      { name: "className", type: "string", description: "Extra classes for the outer container." },
    ],
  },
};

type Snippet = { js: string; ts: string };

/** The demo with every import it needs, so a copied snippet runs as is. */
export function fullUsage(doc: ComponentDoc): Snippet {
  return { js: `${doc.importCode.js}\n\n${doc.usage.js}`, ts: `${doc.importCode.ts}\n\n${doc.usage.ts}` };
}
