// API docs for components that exist in src/ui. Keep the props in step with those files and the
// usage code in step with the live demos in src/components/demos.tsx.

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/** One Figma property, by its exact name on the Naming page, and the React prop that carries it. */
export interface FigmaMapping {
  figma: string;
  /** The React prop. Leave it out when there is no prop yet. */
  prop?: string;
  note: string;
}

/** Written from what the file in src/ui does, not from what the component should do. */
export interface A11yDoc {
  keyboard: string[];
  screenReader: string[];
  /** What the component cannot do for you. */
  youMust: string[];
}

export interface ComponentDoc {
  importCode: { js: string; ts: string };
  usage: { js: string; ts: string };
  props: PropDoc[];
  figma: FigmaMapping[];
  a11y: A11yDoc;
  /** Replaces the Do and Don't in components-data when that guidance does not fit the coded component. */
  do?: string[];
  dont?: string[];
}

// The site draws focus with a global :focus-visible rule in globals.css. Components that do not draw their own
// focus indicator rely on it, and an app that copies them needs the same rule.
const FOCUS_RULE =
  "This component draws no focus indicator of its own. On this site a global :focus-visible rule draws a 2px outline in the border/focus role (--color-role-border-focus). Copy the role tokens and that rule, or an equivalent, into your app.";

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
      { name: "variant", type: '"primary" | "secondary" | "ghost" | "destructive" | "inverse"', default: '"primary"', description: "Visual weight. Use one primary per view. Inverse is the near-black page-ink fill (near white in dark mode) for the main action on marketing and landing pages." },
      { name: "size", type: '"md" | "lg"', default: '"md"', description: "md is at least 44px tall, lg at least 48px. Both clear the 44px touch target." },
      { name: "children", type: "ReactNode", description: "The label. An icon goes here too, before or after the text, and is spaced 8px from it." },
      { name: "loading", type: "boolean", default: "false", description: "Shows a spinner over the label, sets aria-busy and aria-disabled, and blocks clicks. The button keeps its size, its color, and keyboard focus." },
      { name: "disabled", type: "boolean", default: "false", description: "The native disabled attribute. Blocks interaction, removes the button from the Tab order, and uses the disabled colors." },
      { name: "type", type: '"button" | "submit" | "reset"', default: '"button"', description: "Defaults to button so a button inside a form does not submit by accident." },
      { name: "className", type: "string", default: '""', description: "Extra classes, added after the variant and size classes." },
      { name: "...rest", type: "ButtonHTMLAttributes", description: "Every other native button attribute, such as onClick and aria-label. They are spread last, so an aria-disabled or aria-busy you pass replaces the one loading sets." },
    ],
    figma: [
      { figma: "🧰 Type", prop: "variant", note: "Closest match. Naming defines Type as the structural kind; variant sets the visual weight. Destructive is a variant value in code, while Naming rule 4 puts color roles under Tone." },
      { figma: "📐 Size", prop: "size", note: "md and lg." },
      { figma: "🎯 State", note: "No prop. Hover, focus, and pressed come from the browser at runtime. Disabled is the disabled prop and loading is the loading prop." },
      { figma: "🖍 Label", prop: "children", note: "The text inside the button." },
      { figma: "◀️ Show Icon Left, 🖼 Change Icon Left", prop: "children", note: "No icon prop yet. Put the icon in children before the text, with aria-hidden." },
      { figma: "▶️ Show Icon Right, 🖼 Change Icon Right", prop: "children", note: "No icon prop yet. Put the icon in children after the text, with aria-hidden." },
      { figma: "🎨 Tone", note: "No prop yet. The destructive color is a variant value." },
    ],
    a11y: {
      keyboard: [
        "Tab moves focus to the button. Enter and Space press it. Both come from the native button element.",
        "A disabled button uses the native disabled attribute, so Tab skips it.",
        "A loading button stays in the Tab order and keeps focus while it loads and after. Presses are ignored until loading ends, and a submit button does not submit.",
      ],
      screenReader: [
        "Announced as a button, named by its children text.",
        "While loading, the label stays in the accessibility tree (it is only made transparent), so the name does not change. aria-disabled=\"true\" makes it read as unavailable, and aria-busy=\"true\" is set. The spinner is aria-hidden.",
        "Support for aria-busy varies between screen readers, so the start and end of loading may not be announced.",
      ],
      youMust: [
        "Give an icon-only button an aria-label, and mark the icon aria-hidden.",
        "Announce the result of a slow action yourself, for example with a status message, because the end of loading is silent.",
        "Pass type=\"submit\" for a form's submit button. The default is button.",
        FOCUS_RULE,
      ],
    },
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
      { name: "children", type: "ReactNode", description: "The label. The type does not require it, but a badge without text has no meaning." },
      { name: "className", type: "string", default: '""', description: "Extra classes, added after the tone classes." },
      { name: "...rest", type: "HTMLAttributes<HTMLSpanElement>", description: "Every other native span attribute, such as id or title." },
    ],
    figma: [
      { figma: "🎨 Tone", prop: "tone", note: "Same name and the same semantic values." },
      { figma: "🖍 Label", prop: "children", note: "The text inside the badge." },
      { figma: "📐 Size", note: "No prop yet. Badge has one size in code." },
      { figma: "🎯 State", note: "No prop. A badge is not interactive, so it has no states." },
    ],
    a11y: {
      keyboard: ["Not focusable and not interactive. Tab skips it."],
      screenReader: [
        "Read as plain inline text, in reading order. It has no role.",
        "The tone color is not announced. Only the text is.",
      ],
      youMust: [
        "Put the meaning in the text, such as Paid or Failed, never in the color alone.",
        "If a badge changes while someone is on the page, the change is not announced. Use a live region when they need to hear it.",
      ],
    },
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
      { name: "className", type: "string", default: '""', description: "Extra classes for the input element itself, not the wrapper around label, field, and note." },
      { name: "...rest", type: "InputHTMLAttributes", description: "Every other native input attribute, such as type, value, placeholder, disabled, and required. Not id, which is generated. They are spread last, so an aria-describedby you pass replaces the link to the hint or error." },
    ],
    figma: [
      { figma: "🖍 Label", prop: "label", note: "Required in code." },
      { figma: "🖊 Show Label", note: "No prop. The label is always shown, because a placeholder is not a label." },
      { figma: "🩹 Helper Text", prop: "hint, error", note: "hint is the help line. error is the validation line, and it replaces the hint while it is set." },
      { figma: "🩹 Show Helper Text", note: "No prop. Pass hint to show the line, or leave it out." },
      { figma: "🔤 Placeholder", prop: "placeholder", note: "The native attribute, passed through ...rest." },
      { figma: "🎯 State", prop: "error, disabled", note: "Error is the error prop and disabled is the native attribute. Hover and focus come from the browser at runtime." },
      { figma: "📐 Size", note: "No prop yet. Input has one size, at least 44px tall." },
      { figma: "☘️ Icon", note: "No prop yet. Input has no icon slot." },
    ],
    a11y: {
      keyboard: [
        "A native input: Tab focuses it, and typing and editing keys work as usual.",
        "A disabled field uses the native disabled attribute, so Tab skips it.",
        "The component draws its own focus ring: 2px in the border/focus role, or the border/danger role while there is an error.",
      ],
      screenReader: [
        "The label is linked with for and a generated id, so it is the field's accessible name. Clicking the label focuses the field.",
        "The hint, or the error when there is one, is linked with aria-describedby and read after the name.",
        "error sets aria-invalid=\"true\", so the field is announced as invalid.",
        "The error line is not a live region. It is read when the field gets focus, not at the moment it appears.",
      ],
      youMust: [
        "On submit, move focus to the first invalid field or to an error summary, because a new error is not announced.",
        "Mark a required field in the label text, and pass required for the native check. The component has no required indicator.",
        "Leave aria-describedby alone unless you mean to replace the hint and error link.",
      ],
    },
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
      { name: "className", type: "string", default: '""', description: "Extra classes, added after the size classes." },
      { name: "...rest", type: "HTMLAttributes<HTMLSpanElement>", description: "Every other native span attribute. They are spread last, so an aria-label you pass replaces the name as the accessible label, and aria-hidden hides the avatar." },
    ],
    figma: [
      { figma: "📐 Size", prop: "size", note: "sm, md, and lg." },
      { figma: "📷 Show Image", note: "No prop yet. Avatar renders initials only and takes no image source." },
      { figma: "🎯 State", note: "No prop. An avatar is not interactive, so it has no states." },
    ],
    a11y: {
      keyboard: ["Not focusable and not interactive. Tab skips it."],
      screenReader: [
        "Exposed as an image (role=\"img\") named by the full name, so a screen reader reads Natuna Digilab, not N D.",
        "The initials themselves are aria-hidden.",
      ],
      youMust: [
        "Pass the full name, not initials. The name is the accessible label.",
        "When the same name is written right next to the avatar, pass aria-hidden=\"true\" so the name is not read twice.",
        "If the avatar should open a profile, wrap it in a link or button that has its own name. The avatar is not focusable.",
      ],
    },
    do: [
      "Pass the full name. Initials come from the first and last word, so Natuna Digilab shows ND.",
      "Keep one size within the same list or table.",
    ],
    dont: [
      "Pass initials or a nickname as the name. The name is also what a screen reader reads.",
      "Expect Avatar to show a photo or a logo. It renders initials only and has no image prop yet.",
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
      { name: "items", type: "AccordionItem[]", description: "One entry per section, in order." },
      { name: "items[].title", type: "string", description: "The header text. It is also the React key, so titles must be unique within one accordion." },
      { name: "items[].content", type: "ReactNode", description: "What shows when the item is open." },
      { name: "items[].defaultOpen", type: "boolean", description: "Opens the item on first render. After that, the browser keeps the open state." },
      { name: "className", type: "string", default: '""', description: "Extra classes for the outer container. Accordion takes no other attributes, so there is no ...rest." },
    ],
    figma: [
      { figma: "🖍 Label", prop: "items[].title", note: "Closest match: the header text of each item." },
      { figma: "📝 Description", prop: "items[].content", note: "Closest match: the body of each item. In code it can hold any content, not only text." },
      { figma: "🎯 State", prop: "items[].defaultOpen", note: "Open or closed on first render only. After that, the state is runtime." },
      { figma: "☘️ Icon", note: "No prop yet. The caret icon is fixed." },
    ],
    a11y: {
      keyboard: [
        "Each header is a native summary element. Tab moves between headers, and Enter or Space opens or closes one.",
        "Items are independent. Opening one does not close the others.",
        "Links and fields inside a closed item cannot be reached with Tab until the item is opened.",
        FOCUS_RULE,
      ],
      screenReader: [
        "Browsers expose each header as an expandable control with its open or closed state. The exact wording depends on the browser and screen reader.",
        "The content of a closed item is hidden from screen readers.",
        "Headers are not headings, so they do not appear in a screen reader's list of headings. The caret icon is aria-hidden.",
      ],
      youMust: [
        "Give every item a unique title.",
        "If the headers need to be in the page's heading outline, Accordion does not support that yet.",
      ],
    },
  },
};

type Snippet = { js: string; ts: string };

/** The demo with every import it needs, so a copied snippet runs as is. */
export function fullUsage(doc: ComponentDoc): Snippet {
  return { js: `${doc.importCode.js}\n\n${doc.usage.js}`, ts: `${doc.importCode.ts}\n\n${doc.usage.ts}` };
}
