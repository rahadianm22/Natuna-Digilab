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
      { name: "tone", type: '"neutral" | "primary" | "secondary" | "info" | "success" | "warning" | "danger"', default: '"neutral"', description: "Color for the meaning. Always pair it with text. info is the older name for primary." },
      { name: "type", type: '"solid" | "subtle" | "outline"', default: '"subtle"', description: "Solid fill, soft fill, or an outline." },
      { name: "size", type: '"sm" | "md"', default: '"md"', description: "16px or 20px tall." },
      { name: "iconLeft, iconRight", type: "ReactNode", description: "Decorative icon before or after the label. Hidden from screen readers." },
      { name: "children", type: "ReactNode", description: "The label. The type does not require it, but a badge without text has no meaning." },
      { name: "className", type: "string", default: '""', description: "Extra classes, added after the tone classes." },
      { name: "...rest", type: "HTMLAttributes<HTMLSpanElement>", description: "Every other native span attribute, such as id or title." },
    ],
    figma: [
      { figma: "🎨 Tone", prop: "tone", note: "Same name and the same semantic values." },
      { figma: "🧰 Type", prop: "type", note: "solid, subtle, or outline." },
      { figma: "Show Icon Left, Change Icon Left", prop: "iconLeft", note: "Pass an icon element to show it." },
      { figma: "Show Icon Right, Change Icon Right", prop: "iconRight", note: "Pass an icon element to show it." },
      { figma: "🖍 Label", prop: "children", note: "The text inside the badge." },
      { figma: "📐 Size", prop: "size", note: "sm or md." },
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
  checkbox: {
    importCode: {
      js: `import { useState } from "react";
import { Checkbox } from "@/ui";`,
      ts: `import { useState } from "react";
import { Checkbox } from "@/ui";`,
    },
    usage: {
      js: `export default function CheckboxDemo() {
  const [agreed, setAgreed] = useState(false);

  return (
    <Checkbox
      size="md"
      label="I agree to the terms"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
      error={agreed ? undefined : "Accept the terms to continue."}
    />
  );
}`,
      ts: `export default function CheckboxDemo() {
  const [agreed, setAgreed] = useState<boolean>(false);

  return (
    <Checkbox
      size="md"
      label="I agree to the terms"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
      error={agreed ? undefined : "Accept the terms to continue."}
    />
  );
}`,
    },
    props: [
      { name: "label", type: "string", description: "Required visible label, connected to the checkbox." },
      { name: "hint", type: "string", description: "Helper text under the label." },
      { name: "error", type: "string", description: "Marks the checkbox invalid, sets aria-invalid, and replaces the hint." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"sm"', description: "Control and text size: 16px, 20px, or 24px box." },
      { name: "indeterminate", type: "boolean", default: "false", description: "Partly selected. Only for a parent row whose children are partly selected. It is not a value users can pick." },
      { name: "className", type: "string", default: '""', description: "Extra classes for the wrapper." },
      { name: "...rest", type: "InputHTMLAttributes", description: "Every other native input attribute, such as checked, defaultChecked, onChange, disabled, name, and required. Not id or type." },
    ],
    figma: [
      { figma: "💡 Selection", prop: "checked, indeterminate", note: "Unchecked and Checked are the native checked state. Indeterminate is the indeterminate prop." },
      { figma: "📐 Size", prop: "size", note: "sm, md, or lg." },
      { figma: "🎯 State", prop: "error, disabled", note: "Error is the error prop and disabled is the native attribute. Hover and focus come from the browser at runtime." },
      { figma: "Show Label", note: "No prop. The label is always shown, because a checkbox without a label has no name." },
      { figma: "Helper Text", prop: "hint, error", note: "hint is the help line. error replaces it while it is set." },
    ],
    a11y: {
      keyboard: [
        "A native checkbox: Tab focuses it and Space toggles it.",
        "A disabled checkbox uses the native disabled attribute, so Tab skips it.",
        "The component draws its own focus ring: 2px in the border/focus role.",
      ],
      screenReader: [
        "The label is linked with for and a generated id, so it is the accessible name. Clicking the label toggles the checkbox.",
        "The hint, or the error when there is one, is linked with aria-describedby and read after the name.",
        "indeterminate is set on the DOM element, so it is announced as mixed.",
        "error sets aria-invalid=\"true\". The error line is not a live region, so it is read when the checkbox gets focus.",
      ],
      youMust: [
        "Use indeterminate only for a parent whose children are partly selected, and update it from the children.",
        "Group related checkboxes in a fieldset with a legend.",
        "On submit, move focus to the first invalid checkbox, because a new error is not announced.",
      ],
    },
  },
  "radio-button": {
    importCode: {
      js: `import { useState } from "react";
import { RadioButton } from "@/ui";`,
      ts: `import { useState } from "react";
import { RadioButton } from "@/ui";`,
    },
    usage: {
      js: `export default function RadioDemo() {
  const [term, setTerm] = useState("15");

  return (
    <div role="radiogroup" aria-label="Loan term">
      {["10", "15"].map((years) => (
        <RadioButton
          key={years}
          size="md"
          name="demo-term"
          value={years}
          label={\`\${years} years\`}
          checked={term === years}
          onChange={() => setTerm(years)}
        />
      ))}
    </div>
  );
}`,
      ts: `export default function RadioDemo() {
  const [term, setTerm] = useState<string>("15");

  return (
    <div role="radiogroup" aria-label="Loan term">
      {["10", "15"].map((years) => (
        <RadioButton
          key={years}
          size="md"
          name="demo-term"
          value={years}
          label={\`\${years} years\`}
          checked={term === years}
          onChange={() => setTerm(years)}
        />
      ))}
    </div>
  );
}`,
    },
    props: [
      { name: "label", type: "string", description: "Required visible label, connected to the radio button." },
      { name: "hint", type: "string", description: "Helper text under the label." },
      { name: "error", type: "string", description: "Shows the error look and replaces the hint. The message is linked with aria-describedby." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"sm"', description: "Circle and text size: 16px, 20px, or 24px." },
      { name: "className", type: "string", default: '""', description: "Extra classes for the wrapper." },
      { name: "...rest", type: "InputHTMLAttributes", description: "Every other native input attribute, such as name, value, checked, defaultChecked, onChange, and disabled. Not id or type." },
    ],
    figma: [
      { figma: "💡 Selection", prop: "checked", note: "Unselected and Selected are the native checked state." },
      { figma: "📐 Size", prop: "size", note: "sm, md, or lg." },
      { figma: "🎯 State", prop: "error, disabled", note: "Error is the error prop and disabled is the native attribute. Hover and focus come from the browser at runtime." },
      { figma: "🖊 Show Label, 🖍 Label", prop: "label", note: "The label is always shown, because a radio button without a label has no name." },
      { figma: "🩹 Show Helper Text, Helper Text", prop: "hint, error", note: "hint is the help line. error replaces it while it is set." },
    ],
    a11y: {
      keyboard: [
        "A native radio input: share a name and the arrow keys move between options, while Tab enters and leaves the group.",
        "A disabled option uses the native disabled attribute, so it is skipped.",
        "The component draws its own focus ring: 2px in the border/focus role.",
      ],
      screenReader: [
        "The label is linked with for and a generated id, so it is the accessible name. Clicking the label selects the option.",
        "The hint, or the error when there is one, is linked with aria-describedby and read after the name.",
        "The error is linked with aria-describedby and read after the name.",
      ],
      youMust: [
        "Give every option in a set the same name, and wrap the set in a fieldset with a legend or a role=\"radiogroup\" with a label.",
        "This is a single option. Grouping and exclusivity belong to the Radio Group, which does not exist in code yet.",
      ],
    },
  },
  "label-text": {
    importCode: {
      js: `import { LabelText } from "@/ui";`,
      ts: `import { LabelText } from "@/ui";`,
    },
    usage: {
      js: `export default function LabelTextDemo() {
  return (
    <div>
      <LabelText htmlFor="full-name" indicator="required">Full name</LabelText>
      <input id="full-name" required />
    </div>
  );
}`,
      ts: `export default function LabelTextDemo() {
  return (
    <div>
      <LabelText htmlFor="full-name" indicator="required">Full name</LabelText>
      <input id="full-name" required />
    </div>
  );
}`,
    },
    props: [
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "12px, 14px, or 16px text." },
      { name: "indicator", type: '"none" | "required" | "optional"', default: '"none"', description: "Adds an asterisk or (optional). One prop, because showing both is a content bug." },
      { name: "error", type: "boolean", default: "false", description: "Danger color." },
      { name: "disabled", type: "boolean", default: "false", description: "Muted color. Set the native disabled attribute on the field too." },
      { name: "icon", type: "ReactNode", description: "Decorative icon after the label, such as an info icon." },
      { name: "...rest", type: "LabelHTMLAttributes", description: "Every other native label attribute, such as htmlFor." },
    ],
    figma: [
      { figma: "💡 Indicator", prop: "indicator", note: "none, required, or optional." },
      { figma: "📐 Size", prop: "size", note: "sm, md, or lg." },
      { figma: "🎯 State", prop: "error, disabled", note: "Error and Disabled are boolean props." },
      { figma: "🖍 Label", prop: "children", note: "The label text." },
      { figma: "Show Icon Right, Change Icon Right", prop: "icon", note: "Pass an icon element to show it." },
    ],
    a11y: {
      keyboard: ["Not focusable. Clicking it moves focus to the field named by htmlFor."],
      screenReader: [
        "A native label: with htmlFor it is the field's accessible name.",
        "The required asterisk is aria-hidden. The icon is aria-hidden too. (optional) is read as text.",
      ],
      youMust: [
        "Pass htmlFor, or wrap the field, so the label names it.",
        "Set the native required attribute on the field. The asterisk alone tells a screen reader nothing.",
        "Put what an info icon explains in a hint, because the icon is decorative.",
      ],
    },
  },
  toggle: {
    importCode: {
      js: `import { useState } from "react";
import { Toggle } from "@/ui";`,
      ts: `import { useState, type ChangeEvent } from "react";
import { Toggle } from "@/ui";`,
    },
    usage: {
      js: `export default function ToggleDemo() {
  const [on, setOn] = useState(true);

  return <Toggle size="md" label="Transaction notifications" checked={on} onChange={(e) => setOn(e.target.checked)} />;
}`,
      ts: `export default function ToggleDemo() {
  const [on, setOn] = useState<boolean>(true);

  return (
    <Toggle
      size="md"
      label="Transaction notifications"
      checked={on}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setOn(e.target.checked)}
    />
  );
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required visible label, connected to the switch."
          },
          {
                "name": "hint",
                "type": "string",
                "description": "Helper text under the label."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\"",
                "default": "\"sm\"",
                "description": "Track size: 28 x 16, 36 x 20, or 44 x 24."
          },
          {
                "name": "...rest",
                "type": "InputHTMLAttributes",
                "description": "Every other native input attribute, such as checked, defaultChecked, onChange, and disabled. Not id, type, or role."
          }
    ],
    figma: [
          {
                "figma": "💡 Selection",
                "prop": "checked",
                "note": "Off and On are the native checked state."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm, md, or lg."
          },
          {
                "figma": "🎯 State",
                "prop": "disabled",
                "note": "Disabled is the native attribute. Hover and focus come from the browser. There is no Error state, by design."
          },
          {
                "figma": "Show Label, Label",
                "prop": "label",
                "note": "The label is always shown, because a switch without a label has no name."
          },
          {
                "figma": "Show Helper Text, Helper Text",
                "prop": "hint",
                "note": "Pass hint to show the line."
          }
    ],
    a11y: {
          "keyboard": [
                "A native checkbox with role=switch: Tab focuses it and Space toggles it.",
                "A disabled toggle uses the native disabled attribute, so Tab skips it.",
                "The component draws its own focus ring: 2px in the border/focus role."
          ],
          "screenReader": [
                "Announced as a switch, with on or off as its state.",
                "The label is linked with for and a generated id, so it is the accessible name.",
                "The hint is linked with aria-describedby and read after the name."
          ],
          "youMust": [
                "Use it for a setting that applies at once. If the choice needs a Save button, use a checkbox.",
                "A setting that can fail validation is a field, not a toggle."
          ]
    },
  },
  separator: {
    importCode: {
      js: `import { Separator } from "@/ui";`,
      ts: `import { Separator } from "@/ui";`,
    },
    usage: {
      js: `export default function SeparatorDemo() {
  return (
    <div>
      <p>Sign in with your email</p>
      <Separator label="or" />
      <p>Continue with your phone number</p>
    </div>
  );
}`,
      ts: `export default function SeparatorDemo() {
  return (
    <div>
      <p>Sign in with your email</p>
      <Separator label="or" />
      <p>Continue with your phone number</p>
    </div>
  );
}`,
    },
    props: [
          {
                "name": "orientation",
                "type": "\"horizontal\" | \"vertical\"",
                "default": "\"horizontal\"",
                "description": "Direction of the line. A vertical one stretches to the height of its flex parent."
          },
          {
                "name": "weight",
                "type": "\"subtle\" | \"default\" | \"strong\"",
                "default": "\"default\"",
                "description": "Subtle is the default line at 60%, strong is 2px."
          },
          {
                "name": "label",
                "type": "string",
                "description": "Text centered on a horizontal line, such as or. Ignored when vertical."
          },
          {
                "name": "className",
                "type": "string",
                "default": "\"\"",
                "description": "Extra classes."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "orientation",
                "note": "horizontal or vertical."
          },
          {
                "figma": "💡 Style",
                "prop": "weight",
                "note": "Named weight in code, because style is a reserved prop. subtle, default, or strong."
          },
          {
                "figma": "Show Label, Label",
                "prop": "label",
                "note": "Pass label to show the text."
          }
    ],
    a11y: {
          "keyboard": [
                "Not focusable. Tab skips it."
          ],
          "screenReader": [
                "Has role=separator with its orientation.",
                "A labelled separator is read by its label, such as or. The text inside is aria-hidden so it is not read twice."
          ],
          "youMust": [
                "Use it for a real change of topic. For pure spacing, use margin."
          ]
    },
  },
  breadcrumbs: {
    importCode: {
      js: `import { Breadcrumbs } from "@/ui";`,
      ts: `import { Breadcrumbs, type BreadcrumbItem } from "@/ui";`,
    },
    usage: {
      js: `export default function BreadcrumbsDemo() {
  return (
    <Breadcrumbs
      maxItems={4}
      items={[
        { label: "Home", href: "/" },
        { label: "Product", href: "/product" },
        { label: "KPR Digital", href: "/product/kpr" },
        { label: "Simulation", href: "/product/kpr/simulation" },
        { label: "Detail" },
      ]}
    />
  );
}`,
      ts: `const items: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "KPR Digital", href: "/product/kpr" },
  { label: "Simulation", href: "/product/kpr/simulation" },
  { label: "Detail" },
];

export default function BreadcrumbsDemo() {
  return <Breadcrumbs maxItems={4} items={items} />;
}`,
    },
    props: [
          {
                "name": "items",
                "type": "{ label: string; href?: string }[]",
                "description": "The path. The last item is the current page and is not a link."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\"",
                "default": "\"md\"",
                "description": "12px or 14px text."
          },
          {
                "name": "separator",
                "type": "\"chevron\" | \"slash\"",
                "default": "\"chevron\"",
                "description": "The mark between items."
          },
          {
                "name": "home",
                "type": "boolean",
                "default": "true",
                "description": "Shows a house icon on the first item."
          },
          {
                "name": "maxItems",
                "type": "number",
                "default": "0",
                "description": "Collapses the middle to an ellipsis when there are more items. 0 never collapses. The first and last two items stay."
          }
    ],
    figma: [
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm or md."
          },
          {
                "figma": "🔀 Count",
                "prop": "items, maxItems",
                "note": "2 to 5 Level is the length of items. Truncated is maxItems."
          },
          {
                "figma": "Change Icon",
                "prop": "separator",
                "note": "chevron or slash."
          },
          {
                "figma": "Show Icon Left",
                "prop": "home",
                "note": "House icon on the first item."
          },
          {
                "figma": "🎯 State",
                "note": "Hover comes from the browser. Current is the last item. There is no disabled item in code."
          }
    ],
    a11y: {
          "keyboard": [
                "Each link is a native anchor: Tab focuses it and Enter follows it. The current page is not focusable."
          ],
          "screenReader": [
                "Wrapped in a nav labelled Breadcrumb, with the items in an ordered list.",
                "The last item has aria-current=\"page\".",
                "Separators and the house icon are aria-hidden."
          ],
          "youMust": [
                "Pass real href values. Without one, an item is a link that goes nowhere.",
                "Do not use it as the only navigation."
          ]
    },
  },
  status: {
    importCode: {
      js: `import { Status } from "@/ui";`,
      ts: `import { Status, type StatusValue } from "@/ui";`,
    },
    usage: {
      js: `export default function StatusDemo() {
  return (
    <>
      <Status status="pending" />
      <Status status="success" type="dot" />
      <Status status="refunded" type="inline" timestamp="18 Sep, 14:02" />
    </>
  );
}`,
      ts: `const status: StatusValue = "pending";

export default function StatusDemo() {
  return (
    <>
      <Status status={status} />
      <Status status="success" type="dot" />
      <Status status="refunded" type="inline" timestamp="18 Sep, 14:02" />
    </>
  );
}`,
    },
    props: [
          {
                "name": "status",
                "type": "\"pending\" | \"processing\" | \"success\" | \"failed\" | \"expired\" | \"refunded\"",
                "description": "A closed set. Text, icon, and tone are locked per status. Adding one is a design system change."
          },
          {
                "name": "type",
                "type": "\"pill\" | \"inline\" | \"dot\"",
                "default": "\"pill\"",
                "description": "Filled pill, icon with text, or a dot with text."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\"",
                "default": "\"md\"",
                "description": "Icon and text size."
          },
          {
                "name": "timestamp",
                "type": "ReactNode",
                "description": "Shown after the text for inline only. Pass the formatted date."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "pill, inline, or dot."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm or md."
          },
          {
                "figma": "🎯 Status",
                "prop": "status",
                "note": "Same six values. Success is Successful in the text."
          },
          {
                "figma": "📅 Show Timestamp, Timestamp",
                "prop": "timestamp",
                "note": "Pass timestamp to show it. Inline only."
          }
    ],
    a11y: {
          "keyboard": [
                "Not focusable and not interactive. Tab skips it."
          ],
          "screenReader": [
                "Read as plain text. Icons and dots are aria-hidden, so the text carries the meaning."
          ],
          "youMust": [
                "Format the timestamp for the user's locale before you pass it.",
                "A status that changes while the user is on the page is not announced. Use a live region if they need to hear it."
          ]
    },
  },
  toast: {
    importCode: {
      js: `import { useState } from "react";
import { Toast } from "@/ui";`,
      ts: `import { useState } from "react";
import { Toast } from "@/ui";`,
    },
    usage: {
      js: `export default function ToastDemo() {
  const [open, setOpen] = useState(true);

  if (!open) return null;
  return (
    <Toast
      tone="success"
      title="Transfer successful"
      description="Rp500,000 to Andi Pratama"
      actionLabel="Undo"
      onAction={() => setOpen(false)}
      onClose={() => setOpen(false)}
    />
  );
}`,
      ts: `export default function ToastDemo() {
  const [open, setOpen] = useState<boolean>(true);

  if (!open) return null;
  return (
    <Toast
      tone="success"
      title="Transfer successful"
      description="Rp500,000 to Andi Pratama"
      actionLabel="Undo"
      onAction={() => setOpen(false)}
      onClose={() => setOpen(false)}
    />
  );
}`,
    },
    props: [
          {
                "name": "title",
                "type": "string",
                "description": "Required. The short message."
          },
          {
                "name": "description",
                "type": "string",
                "description": "A second line with detail."
          },
          {
                "name": "tone",
                "type": "\"info\" | \"success\" | \"warning\" | \"danger\"",
                "default": "\"info\"",
                "description": "Color and icon. The icon is locked per tone."
          },
          {
                "name": "type",
                "type": "\"solid\" | \"subtle\"",
                "default": "\"subtle\"",
                "description": "Filled or soft background."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\"",
                "default": "\"md\"",
                "description": "Vertical padding."
          },
          {
                "name": "actionLabel, onAction",
                "type": "string, () => void",
                "description": "A text action such as Undo. Both are needed to show it."
          },
          {
                "name": "onClose",
                "type": "() => void",
                "description": "Shows the close button."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "solid or subtle."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm or md."
          },
          {
                "figma": "🎨 Tone",
                "prop": "tone",
                "note": "info, success, warning, or danger."
          },
          {
                "figma": "Show Icon Left",
                "note": "No prop. The icon is always shown, locked per tone."
          },
          {
                "figma": "Title, Description",
                "prop": "title, description",
                "note": "Pass description to show the second line."
          },
          {
                "figma": "Show Button, Button Value",
                "prop": "actionLabel, onAction",
                "note": "Both together."
          },
          {
                "figma": "Show Close",
                "prop": "onClose",
                "note": "Pass onClose to show the button."
          }
    ],
    a11y: {
          "keyboard": [
                "The action and close buttons are native buttons: Tab focuses them and Enter or Space activates them."
          ],
          "screenReader": [
                "Danger uses role=alert and is read at once. The other tones use role=status and are read politely.",
                "The close button is named Close notification. Icons are aria-hidden."
          ],
          "youMust": [
                "Show, stack, and dismiss toasts in your app. This component is only the toast.",
                "Auto-dismiss after 5 seconds, or 8 with an action. Danger never auto-dismisses: the user must acknowledge an error.",
                "Give the user enough time to reach the action before it goes."
          ]
    },
  },
  comment: {
    importCode: {
      js: `import { useState } from "react";
import { Comment } from "@/ui";`,
      ts: `import { useState } from "react";
import { Comment, type CommentState } from "@/ui";`,
    },
    usage: {
      js: `export default function CommentDemo() {
  const [resolved, setResolved] = useState(false);

  return (
    <Comment
      author="Rahadian"
      role="Approver"
      timestamp="2 hours ago"
      state={resolved ? "resolved" : "default"}
      onReply={() => {}}
      onToggleResolved={() => setResolved(!resolved)}
    >
      Payslip documents check out. Moving on to collateral verification.
    </Comment>
  );
}`,
      ts: `export default function CommentDemo() {
  const [resolved, setResolved] = useState<boolean>(false);
  const state: CommentState = resolved ? "resolved" : "default";

  return (
    <Comment
      author="Rahadian"
      role="Approver"
      timestamp="2 hours ago"
      state={state}
      onReply={() => {}}
      onToggleResolved={() => setResolved(!resolved)}
    >
      Payslip documents check out. Moving on to collateral verification.
    </Comment>
  );
}`,
    },
    props: [
          {
                "name": "author",
                "type": "string",
                "description": "Required. The name. It also makes the avatar initials."
          },
          {
                "name": "role",
                "type": "string",
                "description": "A tag next to the name, such as Approver."
          },
          {
                "name": "timestamp",
                "type": "string",
                "description": "Required. Pass the formatted time."
          },
          {
                "name": "type",
                "type": "\"thread\" | \"annotation\"",
                "default": "\"thread\"",
                "description": "Thread has actions. Annotation has a 3px warning accent and no actions."
          },
          {
                "name": "state",
                "type": "\"default\" | \"highlight\" | \"resolved\"",
                "default": "\"default\"",
                "description": "Highlight is brand colored. Resolved is muted."
          },
          {
                "name": "onReply",
                "type": "() => void",
                "description": "Shows Reply. Thread only."
          },
          {
                "name": "onToggleResolved",
                "type": "() => void",
                "description": "Shows Resolve, or Reopen when the state is resolved. Thread only."
          },
          {
                "name": "children",
                "type": "ReactNode",
                "description": "The comment text."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "thread or annotation."
          },
          {
                "figma": "🎯 State",
                "prop": "state",
                "note": "default, highlight, or resolved."
          },
          {
                "figma": "Title, Label, Timestamp",
                "prop": "author, role, timestamp",
                "note": "Name, tag, and time."
          },
          {
                "figma": "Description",
                "prop": "children",
                "note": "The text."
          },
          {
                "figma": "Show Actions, Button Value",
                "prop": "onReply, onToggleResolved",
                "note": "Pass the handlers to show the actions."
          },
          {
                "figma": "Show Image",
                "note": "No prop. The avatar always shows initials."
          }
    ],
    a11y: {
          "keyboard": [
                "Reply and Resolve are native buttons: Tab focuses them and Enter or Space activates them."
          ],
          "screenReader": [
                "An article labelled Comment by the author.",
                "The avatar is named by the author, so the name is read twice. Pass the avatar name only when it adds something."
          ],
          "youMust": [
                "Do not rely on the highlight or the accent color alone to say a comment is new or resolved. Say it in text.",
                "The more-options menu in the design is not in code yet."
          ]
    },
  },
  changelog: {
    importCode: {
      js: `import { Changelog } from "@/ui";`,
      ts: `import { Changelog, type ChangelogType } from "@/ui";`,
    },
    usage: {
      js: `export default function ChangelogDemo() {
  return (
    <>
      <Changelog
        type="added"
        version="v2.4.0"
        timestamp="18 Sep 2026"
        title="Scheduled transfers"
        description="Set up recurring monthly transfers right from the account page."
        actionLabel="View details"
        actionHref="/changelog/2-4-0"
      />
      <Changelog type="fixed" version="v2.3.1" timestamp="2 Sep 2026" title="Fixed delayed balance updates" connector={false} />
    </>
  );
}`,
      ts: `const type: ChangelogType = "added";

export default function ChangelogDemo() {
  return (
    <Changelog
      type={type}
      version="v2.4.0"
      timestamp="18 Sep 2026"
      title="Scheduled transfers"
      description="Set up recurring monthly transfers right from the account page."
      actionLabel="View details"
      actionHref="/changelog/2-4-0"
    />
  );
}`,
    },
    props: [
          {
                "name": "version",
                "type": "string",
                "description": "Required. For example v2.4.0."
          },
          {
                "name": "timestamp",
                "type": "string",
                "description": "Required. Pass the formatted date."
          },
          {
                "name": "title",
                "type": "string",
                "description": "Required. What changed."
          },
          {
                "name": "description",
                "type": "string",
                "description": "One line of detail."
          },
          {
                "name": "type",
                "type": "\"added\" | \"improved\" | \"fixed\" | \"deprecated\"",
                "default": "\"added\"",
                "description": "Icon and tone are locked: success, primary, neutral, warning."
          },
          {
                "name": "scope",
                "type": "\"product\" | \"system\"",
                "default": "\"product\"",
                "description": "Product shows the action link. System shows the affected components."
          },
          {
                "name": "actionLabel, actionHref",
                "type": "string",
                "description": "Product scope only. The link under the entry."
          },
          {
                "name": "affects",
                "type": "string[]",
                "description": "System scope only. Components touched."
          },
          {
                "name": "connector",
                "type": "boolean",
                "default": "true",
                "description": "Vertical line to the next entry. Turn it off for the last one."
          }
    ],
    figma: [
          {
                "figma": "Scope",
                "prop": "scope",
                "note": "product or system."
          },
          {
                "figma": "Type",
                "prop": "type",
                "note": "added, improved, fixed, or deprecated."
          },
          {
                "figma": "Label, Timestamp, Title, Description",
                "prop": "version, timestamp, title, description",
                "note": "Same text."
          },
          {
                "figma": "Show Connector",
                "prop": "connector",
                "note": "Boolean."
          },
          {
                "figma": "Show Button, Button Value",
                "prop": "actionLabel, actionHref",
                "note": "Pass actionLabel to show it."
          }
    ],
    a11y: {
          "keyboard": [
                "The action is a native link: Tab focuses it and Enter follows it."
          ],
          "screenReader": [
                "An article. The type is added as hidden text after the date, so it is read even though the icon is aria-hidden."
          ],
          "youMust": [
                "Pass a real actionHref.",
                "Order entries newest first, and wrap the list in a list element if you need list semantics."
          ]
    },
  },
  tabs: {
    importCode: {
      js: `import { Tabs } from "@/ui";`,
      ts: `import { Tabs, type TabItem } from "@/ui";`,
    },
    usage: {
      js: `export default function TabsDemo() {
  return (
    <Tabs
      label="Transactions"
      items={[
        { id: "all", label: "All", value: "12", content: "All twelve transactions." },
        { id: "in", label: "Incoming", content: "Money received." },
      ]}
    />
  );
}`,
      ts: `const items: TabItem[] = [
  { id: "all", label: "All", value: "12", content: "All twelve transactions." },
  { id: "in", label: "Incoming", content: "Money received." },
];

export default function TabsDemo() {
  return <Tabs label="Transactions" items={items} />;
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required. Names the tab list for screen readers."
          },
          {
                "name": "items",
                "type": "TabItem[]",
                "description": "Each has id, label, and optionally value (a count), icon, disabled, and content (the panel)."
          },
          {
                "name": "type",
                "type": "\"underline\" | \"pill\" | \"segmented\"",
                "default": "\"underline\"",
                "description": "The style of the list."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\"",
                "default": "\"md\"",
                "description": "Height of a tab: 32, 40, or 48."
          },
          {
                "name": "value, onChange",
                "type": "string, (id) => void",
                "description": "Controlled selection. Leave out value for an uncontrolled list."
          },
          {
                "name": "defaultValue",
                "type": "string",
                "description": "The first selected tab when uncontrolled. Defaults to the first enabled tab."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "underline, pill, or segmented."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm, md, or lg."
          },
          {
                "figma": "🎯 State",
                "prop": "disabled",
                "note": "Active is the selection. Hover is the browser. Disabled is on the item."
          },
          {
                "figma": "Label, Show Value, Value",
                "prop": "label, value",
                "note": "Text and the count."
          },
          {
                "figma": "Show Icon Left",
                "prop": "icon",
                "note": "Pass an icon element."
          },
          {
                "figma": "🔀 Count",
                "prop": "items",
                "note": "2 to 5 Tab is the length of items."
          }
    ],
    a11y: {
          "keyboard": [
                "Tab moves focus into the list on the selected tab, and out again. Only the selected tab is in the tab order.",
                "Left and Right arrows move to the previous or next enabled tab and select it. Home and End go to the first and last.",
                "A disabled tab is skipped."
          ],
          "screenReader": [
                "The list has role=tablist with the label. Each tab has role=tab and aria-selected.",
                "The panel has role=tabpanel and is named by its tab through aria-labelledby."
          ],
          "youMust": [
                "Give each tab a short label. A long label wraps and breaks the row.",
                "Pass content on the items, or render the panel yourself with the same ids."
          ]
    },
  },
  rating: {
    importCode: {
      js: `import { Rating } from "@/ui";`,
      ts: `import { Rating, type RatingType } from "@/ui";`,
    },
    usage: {
      js: `export default function RatingDemo() {
  return <Rating score={4} value="4,5" />;
}`,
      ts: `const type: RatingType = "star";

export default function RatingDemo() {
  return <Rating type={type} score={4} value="4,5" />;
}`,
    },
    props: [
          {
                "name": "score",
                "type": "1 | 2 | 3 | 4 | 5",
                "description": "Required. The number of filled icons."
          },
          {
                "name": "type",
                "type": "\"star\" | \"heart\" | \"number\"",
                "default": "\"star\"",
                "description": "The look."
          },
          {
                "name": "value",
                "type": "string",
                "description": "The displayed average, such as 4,5. Format it for the locale before you pass it."
          },
          {
                "name": "showValue",
                "type": "boolean",
                "default": "true",
                "description": "Shows the value after the icons."
          },
          {
                "name": "disabled",
                "type": "boolean",
                "default": "false",
                "description": "Muted colors."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "star, heart, or number."
          },
          {
                "figma": "🎯 State",
                "prop": "disabled",
                "note": "Default or disabled."
          },
          {
                "figma": "🔢 Score",
                "prop": "score",
                "note": "1 to 5."
          },
          {
                "figma": "Show Value, Value",
                "prop": "showValue, value",
                "note": "The text after the icons."
          }
    ],
    a11y: {
          "keyboard": [
                "Not focusable and not interactive. It shows a score, it does not collect one."
          ],
          "screenReader": [
                "Read as one image named Rated 4,5 out of 5. The icons are hidden so they are not read one by one."
          ],
          "youMust": [
                "For a control that collects a rating, build it from a radio group. This component does not."
          ]
    },
  },
  stepper: {
    importCode: {
      js: `import { Stepper } from "@/ui";`,
      ts: `import { Stepper, type Step } from "@/ui";`,
    },
    usage: {
      js: `export default function StepperDemo() {
  return (
    <Stepper
      current={1}
      steps={[{ title: "Personal details" }, { title: "Documents" }, { title: "Verification" }]}
    />
  );
}`,
      ts: `const steps: Step[] = [{ title: "Personal details" }, { title: "Documents" }, { title: "Verification" }];

export default function StepperDemo() {
  return <Stepper current={1} steps={steps} />;
}`,
    },
    props: [
          {
                "name": "steps",
                "type": "{ title, description?, disabled? }[]",
                "description": "Required. Three to five is the designed range."
          },
          {
                "name": "current",
                "type": "number",
                "description": "Required. Index of the active step. Earlier steps show as completed."
          },
          {
                "name": "errorAt",
                "type": "number",
                "description": "Index of a step in error."
          },
          {
                "name": "type",
                "type": "\"horizontal\" | \"vertical\"",
                "default": "\"horizontal\"",
                "description": "Layout."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "horizontal or vertical."
          },
          {
                "figma": "🔀 Count",
                "prop": "steps",
                "note": "3, 4, or 5 Step is the length of steps."
          },
          {
                "figma": "🎯 State",
                "prop": "current, errorAt, disabled",
                "note": "Completed, active, and default come from current. Error and disabled are explicit."
          },
          {
                "figma": "Title, Description",
                "prop": "title, description",
                "note": "Per step."
          },
          {
                "figma": "Show Connector",
                "note": "No prop. The connector shows between steps and not after the last one."
          }
    ],
    a11y: {
          "keyboard": [
                "Not focusable and not interactive. It shows progress, it does not move the user."
          ],
          "screenReader": [
                "An ordered list, so the position is read. The active step has aria-current=\"step\".",
                "Completed, error, and disabled are added as hidden text, so state does not rest on color."
          ],
          "youMust": [
                "Buttons that move between steps belong to your flow. Move focus to the new step heading when it changes.",
                "Say what is wrong in an error step, as the description does."
          ]
    },
  },
  divider: {
    importCode: {
      js: `import { Divider } from "@/ui";`,
      ts: `import { Divider } from "@/ui";`,
    },
    usage: {
      js: `export default function DividerDemo() {
  return (
    <>
      <p>Sign in with your email</p>
      <Divider label="or" />
      <p>Continue with your phone number</p>
    </>
  );
}`,
      ts: `export default function DividerDemo() {
  return (
    <>
      <p>Sign in with your email</p>
      <Divider label="or" />
      <p>Continue with your phone number</p>
    </>
  );
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Text in the middle, such as or."
          },
          {
                "name": "icon",
                "type": "ReactNode",
                "description": "An icon in the middle. Ignored when there is a label. Decorative."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\"",
                "default": "\"md\"",
                "description": "Text size."
          }
    ],
    figma: [
          {
                "figma": "🔧 Content",
                "prop": "label, icon",
                "note": "Line is neither. Label is label. Icon is icon."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm or md."
          },
          {
                "figma": "Label, Icon",
                "prop": "label, icon",
                "note": "Same props."
          }
    ],
    a11y: {
          "keyboard": [
                "Not focusable. Tab skips it."
          ],
          "screenReader": [
                "Has role=separator. The label is its accessible name and the text inside is hidden, so it is read once."
          ],
          "youMust": [
                "For a plain line, use Separator. The design file notes that the two overlap and should be merged once the scope is decided."
          ]
    },
  },
  "radio-group": {
    importCode: {
      js: `import { useState } from "react";
import { RadioGroup } from "@/ui";`,
      ts: `import { useState } from "react";
import { RadioGroup, type RadioOption } from "@/ui";`,
    },
    usage: {
      js: `export default function RadioGroupDemo() {
  const [term, setTerm] = useState("15");

  return (
    <RadioGroup
      label="Loan term"
      options={[
        { value: "10", label: "10 years" },
        { value: "15", label: "15 years" },
      ]}
      value={term}
      onChange={setTerm}
    />
  );
}`,
      ts: `const options: RadioOption[] = [
  { value: "10", label: "10 years" },
  { value: "15", label: "15 years" },
];

export default function RadioGroupDemo() {
  const [term, setTerm] = useState<string>("15");

  return <RadioGroup label="Loan term" options={options} value={term} onChange={setTerm} />;
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required. The fieldset legend."
          },
          {
                "name": "options",
                "type": "{ value, label }[]",
                "description": "Required. The choices."
          },
          {
                "name": "value, onChange",
                "type": "string, (value) => void",
                "description": "Controlled value. Leave out value for an uncontrolled group."
          },
          {
                "name": "defaultValue",
                "type": "string",
                "description": "The first choice when uncontrolled."
          },
          {
                "name": "orientation",
                "type": "\"vertical\" | \"horizontal\"",
                "default": "\"vertical\"",
                "description": "Layout of the options."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\"",
                "default": "\"md\"",
                "description": "Passed to every option."
          },
          {
                "name": "hint, error",
                "type": "string",
                "description": "Helper line under the group. error replaces it and puts every option in the error state."
          },
          {
                "name": "disabled",
                "type": "boolean",
                "description": "Disables the whole group."
          },
          {
                "name": "name",
                "type": "string",
                "description": "Form field name. Generated when left out."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "orientation",
                "note": "vertical or horizontal."
          },
          {
                "figma": "🔀 Count",
                "prop": "options",
                "note": "2 to 5 Item is the length of options."
          },
          {
                "figma": "🎯 State",
                "prop": "error, disabled",
                "note": "Default, error, or disabled."
          },
          {
                "figma": "Label, Helper Text",
                "prop": "label, hint",
                "note": "The legend and the line below."
          }
    ],
    a11y: {
          "keyboard": [
                "Tab enters the group on the selected option, or the first one when none is selected. The arrow keys move between options and select. Tab leaves.",
                "A disabled group is skipped."
          ],
          "screenReader": [
                "A fieldset with a legend, so the label is read when focus enters the group.",
                "The hint or error is linked to the fieldset with aria-describedby, so it is read when focus enters the group. Every option shows the error look."
          ],
          "youMust": [
                "Keep a choice selected by default when one is safe. A radio group cannot be cleared by the user.",
                "For one on/off choice, use a checkbox or a toggle."
          ]
    },
  },
  drawer: {
    importCode: {
      js: `import { useState } from "react";
import { Button, Drawer } from "@/ui";`,
      ts: `import { useState } from "react";
import { Button, Drawer } from "@/ui";`,
    },
    usage: {
      js: `export default function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Filter transactions</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filter transactions"
        footer={<Button onClick={() => setOpen(false)}>Save</Button>}
      >
        Drawer content
      </Drawer>
    </>
  );
}`,
      ts: `export default function DrawerDemo() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Filter transactions</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filter transactions"
        footer={<Button onClick={() => setOpen(false)}>Save</Button>}
      >
        Drawer content
      </Drawer>
    </>
  );
}`,
    },
    props: [
          {
                "name": "open",
                "type": "boolean",
                "description": "Required on Drawer."
          },
          {
                "name": "onClose",
                "type": "() => void",
                "description": "Required on Drawer. Called for the close button, the scrim, and Escape."
          },
          {
                "name": "title",
                "type": "string",
                "description": "Required. Names the dialog."
          },
          {
                "name": "description",
                "type": "string",
                "description": "A line under the title."
          },
          {
                "name": "children",
                "type": "ReactNode",
                "description": "The body."
          },
          {
                "name": "footer",
                "type": "ReactNode",
                "description": "Footer buttons."
          },
          {
                "name": "side",
                "type": "\"right\" | \"left\" | \"bottom\" | \"top\"",
                "default": "\"right\"",
                "description": "Where the panel comes from."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\"",
                "default": "\"sm\"",
                "description": "Width 320, 400, or 720."
          },
          {
                "name": "DrawerPanel",
                "type": "component",
                "description": "The panel without the dialog. Use it for documentation or your own layout."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "side",
                "note": "right, left, bottom, or top."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm, md, or lg."
          },
          {
                "figma": "Title, Description",
                "prop": "title, description",
                "note": "Same text."
          },
          {
                "figma": "Show Close",
                "prop": "onClose",
                "note": "On DrawerPanel, pass onClose to show the button."
          },
          {
                "figma": "Show Button, Button Value",
                "prop": "footer",
                "note": "Pass your own buttons."
          }
    ],
    a11y: {
          "keyboard": [
                "Opening moves focus into the drawer. Tab stays inside. Escape closes it and focus returns to what opened it."
          ],
          "screenReader": [
                "A native dialog named by its title. The page behind is inert."
          ],
          "youMust": [
                "For a critical confirmation in the middle of the screen, use a modal, not a drawer.",
                "A drawer is only the panel and the scrim. The scrim at 40% is on the screen, as the design notes."
          ]
    },
  },
  card: {
    importCode: {
      js: `import { Button, Card } from "@/ui";`,
      ts: `import { Button, Card } from "@/ui";`,
    },
    usage: {
      js: `export default function CardDemo() {
  return (
    <Card
      type="action"
      label="Promo"
      title="Time Savings"
      description="4% p.a. interest on regular deposits."
      actions={
        <>
          <Button variant="ghost">Skip</Button>
          <Button>Apply</Button>
        </>
      }
    />
  );
}`,
      ts: `export default function CardDemo() {
  return (
    <Card
      type="action"
      label="Promo"
      title="Time Savings"
      description="4% p.a. interest on regular deposits."
      actions={
        <>
          <Button variant="ghost">Skip</Button>
          <Button>Apply</Button>
        </>
      }
    />
  );
}`,
    },
    props: [
          {
                "name": "title",
                "type": "string",
                "description": "Required."
          },
          {
                "name": "description",
                "type": "string",
                "description": "Body text."
          },
          {
                "name": "label",
                "type": "string",
                "description": "A small tag above the title."
          },
          {
                "name": "type",
                "type": "\"basic\" | \"media\" | \"action\"",
                "default": "\"basic\"",
                "description": "Media adds a 16:9 image. Action adds a footer for buttons."
          },
          {
                "name": "image",
                "type": "ReactNode",
                "description": "Media only. An image element. Leave out for the placeholder."
          },
          {
                "name": "linkLabel, href",
                "type": "string",
                "description": "Media only. The link under the description."
          },
          {
                "name": "actions",
                "type": "ReactNode",
                "description": "Action only. Footer buttons."
          },
          {
                "name": "interactive",
                "type": "boolean",
                "default": "false",
                "description": "Hover shadow and pressed fill, for a card that is itself pressable."
          },
          {
                "name": "disabled",
                "type": "boolean",
                "default": "false",
                "description": "50% opacity."
          },
          {
                "name": "stroke",
                "type": "boolean",
                "default": "true",
                "description": "The border."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "basic, media, or action."
          },
          {
                "figma": "🎯 State",
                "prop": "interactive, disabled",
                "note": "Hover and Pressed are the interactive prop. Disabled is disabled."
          },
          {
                "figma": "Stroke",
                "prop": "stroke",
                "note": "Boolean."
          },
          {
                "figma": "Show Image, Show Label, Show Description, Show Button",
                "prop": "image, label, description, actions",
                "note": "Pass or leave out."
          }
    ],
    a11y: {
          "keyboard": [
                "The card is not focusable. Its link and buttons are."
          ],
          "screenReader": [
                "An article with the title as a heading. A disabled card has aria-disabled."
          ],
          "youMust": [
                "If the whole card is a link, put the link on the title and stretch it, so there is one link per card.",
                "Do not nest interactive elements inside an interactive card."
          ]
    },
  },
  cover: {
    importCode: {
      js: `import { Cover } from "@/ui";`,
      ts: `import { Cover } from "@/ui";`,
    },
    usage: {
      js: `export default function CoverDemo() {
  return <Cover title="Natuna Digilab" description="Design System — Component Library" />;
}`,
      ts: `export default function CoverDemo() {
  return <Cover title="Natuna Digilab" description="Design System — Component Library" />;
}`,
    },
    props: [
          {
                "name": "title",
                "type": "string",
                "description": "Required."
          },
          {
                "name": "description",
                "type": "string",
                "description": "A line under the title."
          },
          {
                "name": "type",
                "type": "\"gradient\" | \"solid\" | \"image\"",
                "default": "\"gradient\"",
                "description": "The fill."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\"",
                "default": "\"md\"",
                "description": "Height 160, 220, or 280."
          },
          {
                "name": "logo",
                "type": "boolean",
                "default": "true",
                "description": "Shows the logo mark."
          },
          {
                "name": "image",
                "type": "ReactNode",
                "description": "Image type only. A photo element."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "gradient, solid, or image."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm, md, or lg."
          },
          {
                "figma": "Show Logo",
                "prop": "logo",
                "note": "Boolean."
          },
          {
                "figma": "Title, Show Description, Description",
                "prop": "title, description",
                "note": "Same text."
          }
    ],
    a11y: {
          "keyboard": [
                "Not focusable."
          ],
          "screenReader": [
                "A section with the title as a heading."
          ],
          "youMust": [
                "With an image, pick a photo the scrim keeps readable. The scrim darkens the lower half for the text.",
                "The logo mark is decorative. Put the product name in the title."
          ]
    },
  },
  "progress-bar": {
    importCode: {
      js: `import { ProgressBar } from "@/ui";`,
      ts: `import { ProgressBar } from "@/ui";`,
    },
    usage: {
      js: `export default function ProgressBarDemo() {
  return <ProgressBar label="Uploading" value={60} />;
}`,
      ts: `export default function ProgressBarDemo() {
  const value: number = 60;

  return <ProgressBar label="Uploading" value={value} />;
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required. Names what is progressing."
          },
          {
                "name": "value",
                "type": "number",
                "default": "0",
                "description": "0 to 100. Ignored when indeterminate."
          },
          {
                "name": "type",
                "type": "\"linear\" | \"circular\"",
                "default": "\"linear\"",
                "description": "Shape."
          },
          {
                "name": "mode",
                "type": "\"determinate\" | \"indeterminate\"",
                "default": "\"determinate\"",
                "description": "Indeterminate is a process with no known duration."
          },
          {
                "name": "tone",
                "type": "\"primary\" | \"success\" | \"warning\" | \"danger\"",
                "default": "\"primary\"",
                "description": "Fill color."
          },
          {
                "name": "showLabel, showValue",
                "type": "boolean",
                "default": "true",
                "description": "The text around the bar."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "linear or circular."
          },
          {
                "figma": "🔀 Mode",
                "prop": "mode",
                "note": "determinate or indeterminate."
          },
          {
                "figma": "🎨 Tone",
                "prop": "tone",
                "note": "primary, success, warning, or danger."
          },
          {
                "figma": "Show Label, Label",
                "prop": "showLabel, label",
                "note": "Same."
          },
          {
                "figma": "Show Value, Value",
                "prop": "showValue, value",
                "note": "The percent is computed from value."
          }
    ],
    a11y: {
          "keyboard": [
                "Not focusable."
          ],
          "screenReader": [
                "role=progressbar with the label, and aria-valuenow from 0 to 100. Indeterminate has no value, so it is read as busy.",
                "The percent text is hidden because the value is already read."
          ],
          "youMust": [
                "Do not rely on color for failure. Change the label when the tone changes, such as Upload failed.",
                "The motion stops for people who ask for reduced motion, and the bar shows a still segment."
          ]
    },
  },
  skeleton: {
    importCode: {
      js: `import { Skeleton } from "@/ui";`,
      ts: `import { Skeleton } from "@/ui";`,
    },
    usage: {
      js: `export default function SkeletonDemo() {
  return (
    <div aria-busy="true">
      <Skeleton type="card" />
    </div>
  );
}`,
      ts: `export default function SkeletonDemo() {
  return (
    <div aria-busy="true">
      <Skeleton type="card" />
    </div>
  );
}`,
    },
    props: [
          {
                "name": "type",
                "type": "\"text\" | \"title\" | \"avatar\" | \"image\" | \"card\"",
                "default": "\"text\"",
                "description": "The shape."
          },
          {
                "name": "animation",
                "type": "\"static\" | \"pulse\" | \"wave\"",
                "default": "\"pulse\"",
                "description": "Static does not move."
          },
          {
                "name": "lines",
                "type": "number",
                "default": "3",
                "description": "Text only. The last line is shorter."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "text, title, avatar, image, or card."
          },
          {
                "figma": "💡 Animation",
                "prop": "animation",
                "note": "static, pulse, or wave."
          }
    ],
    a11y: {
          "keyboard": [
                "Not focusable."
          ],
          "screenReader": [
                "Hidden from screen readers."
          ],
          "youMust": [
                "Set aria-busy on the region that is loading, and say when it is done.",
                "Shape the placeholder like the real content, so the page does not jump.",
                "Pulse and wave stop for people who ask for reduced motion."
          ]
    },
  },
  pagination: {
    importCode: {
      js: `import { useState } from "react";
import { Pagination } from "@/ui";`,
      ts: `import { useState } from "react";
import { Pagination } from "@/ui";`,
    },
    usage: {
      js: `export default function PaginationDemo() {
  const [page, setPage] = useState(1);

  return <Pagination page={page} pageCount={10} onPageChange={setPage} />;
}`,
      ts: `export default function PaginationDemo() {
  const [page, setPage] = useState<number>(1);

  return <Pagination page={page} pageCount={10} onPageChange={setPage} />;
}`,
    },
    props: [
          {
                "name": "page",
                "type": "number",
                "description": "Required. Current page, from 1."
          },
          {
                "name": "pageCount",
                "type": "number",
                "description": "Required. Total pages."
          },
          {
                "name": "onPageChange",
                "type": "(page) => void",
                "description": "Required."
          },
          {
                "name": "type",
                "type": "\"number\" | \"arrow\" | \"loadMore\"",
                "default": "\"number\"",
                "description": "Page buttons, Page x of y, or one button."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\"",
                "default": "\"md\"",
                "description": "Item size 32 or 40."
          },
          {
                "name": "loadMoreLabel",
                "type": "string",
                "default": "\"Load more\"",
                "description": "Text of the load more button."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "number, arrow, or loadMore."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm or md."
          },
          {
                "figma": "🎯 State",
                "prop": "page",
                "note": "Active is the current page. Disabled is the first and last arrow."
          },
          {
                "figma": "Label",
                "note": "Page x of y is computed from page and pageCount."
          }
    ],
    a11y: {
          "keyboard": [
                "Every item is a button: Tab and Enter. Disabled arrows are skipped."
          ],
          "screenReader": [
                "A nav named Pagination. The current page has aria-current=\"page\". Each button is named, such as Page 3.",
                "The ellipsis is hidden."
          ],
          "youMust": [
                "At 32px the sm item is under the 44px target size the rest of this system uses. Prefer md on touch screens.",
                "Update the content and move focus to it when the page changes."
          ]
    },
  },
  "file-input": {
    importCode: {
      js: `import { FileInput } from "@/ui";`,
      ts: `import { FileInput } from "@/ui";`,
    },
    usage: {
      js: `export default function FileInputDemo() {
  return (
    <FileInput
      description="PNG, JPG maks. 5 MB"
      accept="image/png,image/jpeg"
      onFiles={(files) => console.log(files)}
    />
  );
}`,
      ts: `export default function FileInputDemo() {
  function handleFiles(files: File[]): void {
    console.log(files.map((f) => f.name));
  }

  return <FileInput description="PNG, JPG maks. 5 MB" accept="image/png,image/jpeg" onFiles={handleFiles} />;
}`,
    },
    props: [
          {
                "name": "type",
                "type": "\"dropzone\" | \"button\" | \"inline\"",
                "default": "\"dropzone\"",
                "description": "The layout."
          },
          {
                "name": "title",
                "type": "string",
                "default": "\"Drag files here\"",
                "description": "The dropzone title."
          },
          {
                "name": "description",
                "type": "string",
                "description": "The rules shown to the user."
          },
          {
                "name": "buttonLabel",
                "type": "string",
                "default": "\"Choose file\"",
                "description": ""
          },
          {
                "name": "placeholder",
                "type": "string",
                "default": "\"No file selected\"",
                "description": "Inline only."
          },
          {
                "name": "accept, multiple",
                "type": "string, boolean",
                "description": "Native file input attributes."
          },
          {
                "name": "progress",
                "type": "number",
                "description": "0 to 100 while uploading. The upload itself is yours."
          },
          {
                "name": "error",
                "type": "string",
                "description": "Replaces the description and marks the field."
          },
          {
                "name": "disabled",
                "type": "boolean",
                "description": ""
          },
          {
                "name": "dragging",
                "type": "boolean",
                "description": "Forces the dragging look, for documentation."
          },
          {
                "name": "onFiles",
                "type": "(files: File[]) => void",
                "description": "Called with the chosen or dropped files."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "dropzone, button, or inline."
          },
          {
                "figma": "🎯 State",
                "prop": "error, disabled, progress, dragging",
                "note": "Hover is the browser. Dragging is a real drag or the prop. Uploading is progress."
          },
          {
                "figma": "Title, Description, Button Value, Placeholder",
                "prop": "title, description, buttonLabel, placeholder",
                "note": "Same text."
          }
    ],
    a11y: {
          "keyboard": [
                "Choosing works from the keyboard: Tab to the button and press Enter or Space. Dropping is an extra for pointer users."
          ],
          "screenReader": [
                "The button is a real button. The error or description is linked with aria-describedby. Upload progress is a progressbar."
          ],
          "youMust": [
                "Check the type and size in your code too. accept is only a hint for the file picker.",
                "Show uploaded files with the Document component, below the dropzone."
          ]
    },
  },
  tooltip: {
    importCode: {
      js: `import { Button, Tooltip } from "@/ui";`,
      ts: `import { Button, Tooltip, type TooltipPlacement } from "@/ui";`,
    },
    usage: {
      js: `export default function TooltipDemo() {
  return (
    <Tooltip title="Effective interest rate" description="Calculated from the outstanding principal.">
      <Button variant="ghost">Interest rate</Button>
    </Tooltip>
  );
}`,
      ts: `const placement: TooltipPlacement = "top";

export default function TooltipDemo() {
  return (
    <Tooltip placement={placement} title="Effective interest rate" description="Calculated from the outstanding principal.">
      <Button variant="ghost">Interest rate</Button>
    </Tooltip>
  );
}`,
    },
    props: [
          {
                "name": "title",
                "type": "string",
                "description": "Required. The hint."
          },
          {
                "name": "description",
                "type": "string",
                "description": "A second line."
          },
          {
                "name": "placement",
                "type": "\"top\" | \"bottom\" | \"left\" | \"right\"",
                "default": "\"top\"",
                "description": "Side of the trigger."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\"",
                "default": "\"md\"",
                "description": "Padding and text size."
          },
          {
                "name": "arrow",
                "type": "boolean",
                "default": "true",
                "description": "The 12x6 pointer."
          },
          {
                "name": "children",
                "type": "ReactNode",
                "description": "The trigger. It must be focusable, such as a button."
          },
          {
                "name": "TooltipBubble",
                "type": "component",
                "description": "The bubble on its own, for documentation."
          }
    ],
    figma: [
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm or md."
          },
          {
                "figma": "🧰 Type",
                "prop": "placement",
                "note": "Top, Bottom, Left, Right."
          },
          {
                "figma": "🔺 Show Arrow",
                "prop": "arrow",
                "note": "Boolean."
          },
          {
                "figma": "Title, Show Description, Description",
                "prop": "title, description",
                "note": "Same text."
          }
    ],
    a11y: {
          "keyboard": [
                "Shows when the trigger gets keyboard focus, hides on blur and on Escape."
          ],
          "screenReader": [
                "The bubble has role=tooltip and is linked to the trigger with aria-describedby, so it is read after the trigger's name."
          ],
          "youMust": [
                "Put nothing in a tooltip that the user needs to finish a task; it is a hint.",
                "The bubble stays while the pointer is over it, so it can be read and copied (WCAG 1.4.13).",
                "Do not put links or buttons in a tooltip. Use a popover or a Modal instead."
          ]
    },
  },
  search: {
    importCode: {
      js: `import { useState } from "react";
import { SearchField } from "@/ui";`,
      ts: `import { useState } from "react";
import { SearchField, type SearchFieldType } from "@/ui";`,
    },
    usage: {
      js: `export default function SearchDemo() {
  const [query, setQuery] = useState("");

  return (
    <SearchField
      label="Search transactions"
      placeholder="Search transactions"
      type="withButton"
      value={query}
      onValueChange={setQuery}
      onSearch={(q) => console.log(q)}
    />
  );
}`,
      ts: `const type: SearchFieldType = "withButton";

export default function SearchDemo() {
  const [query, setQuery] = useState<string>("");

  return (
    <SearchField
      label="Search transactions"
      placeholder="Search transactions"
      type={type}
      value={query}
      onValueChange={setQuery}
      onSearch={(q: string) => console.log(q)}
    />
  );
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required. The accessible name; the design has no visible label."
          },
          {
                "name": "type",
                "type": "\"basic\" | \"withButton\" | \"inline\"",
                "default": "\"basic\"",
                "description": "Inline is a rounded, unbordered field."
          },
          {
                "name": "value, onValueChange",
                "type": "string, (value) => void",
                "description": "Controlled text. Leave out value for uncontrolled."
          },
          {
                "name": "onSearch",
                "type": "(value) => void",
                "description": "Called on Enter and on the Search button."
          },
          {
                "name": "error",
                "type": "string",
                "description": "Marks the field invalid and shows the message."
          },
          {
                "name": "buttonLabel",
                "type": "string",
                "default": "\"Search\"",
                "description": ""
          },
          {
                "name": "showIcon",
                "type": "boolean",
                "default": "true",
                "description": "The left search icon."
          },
          {
                "name": "...rest",
                "type": "InputHTMLAttributes",
                "description": "placeholder, disabled, name, and so on."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "basic, withButton, or inline."
          },
          {
                "figma": "🎯 State",
                "prop": "value, error, disabled",
                "note": "Filled is any text, which also shows the clear button. Hover and focus come from the browser."
          },
          {
                "figma": "Placeholder",
                "prop": "placeholder",
                "note": "Native attribute."
          },
          {
                "figma": "Show Icon Left",
                "prop": "showIcon",
                "note": "Boolean."
          },
          {
                "figma": "Button Value",
                "prop": "buttonLabel",
                "note": "With Button only."
          }
    ],
    a11y: {
          "keyboard": [
                "A native search input in a form with role=search: Enter searches, the clear button and Search button are reachable with Tab."
          ],
          "screenReader": [
                "The field is named by label. The clear button is named Clear search. The error is linked with aria-describedby."
          ],
          "youMust": [
                "Announce the number of results when they change, for example in a live region."
          ]
    },
  },
  alert: {
    importCode: {
      js: `import { useState } from "react";
import { Alert } from "@/ui";`,
      ts: `import { useState } from "react";
import { Alert, type AlertTone } from "@/ui";`,
    },
    usage: {
      js: `export default function AlertDemo() {
  const [open, setOpen] = useState(true);

  if (!open) return null;
  return (
    <Alert
      tone="warning"
      title="Your session ends in 5 minutes"
      description="Save your changes to keep them."
      onClose={() => setOpen(false)}
    />
  );
}`,
      ts: `const tone: AlertTone = "warning";

export default function AlertDemo() {
  const [open, setOpen] = useState<boolean>(true);

  if (!open) return null;
  return (
    <Alert
      tone={tone}
      title="Your session ends in 5 minutes"
      description="Save your changes to keep them."
      onClose={() => setOpen(false)}
    />
  );
}`,
    },
    props: [
          {
                "name": "title",
                "type": "string",
                "description": "Required."
          },
          {
                "name": "description",
                "type": "ReactNode",
                "description": "Detail under the title."
          },
          {
                "name": "tone",
                "type": "\"info\" | \"success\" | \"warning\" | \"danger\"",
                "default": "\"info\"",
                "description": "Color and icon, locked together."
          },
          {
                "name": "action",
                "type": "ReactNode",
                "description": "A link or button for the next step."
          },
          {
                "name": "onClose",
                "type": "() => void",
                "description": "Shows the dismiss button."
          }
    ],
    figma: [
          {
                "figma": "Tone",
                "prop": "tone",
                "note": "info, success, warning, or danger."
          },
          {
                "figma": "Title, Description",
                "prop": "title, description",
                "note": "Same text."
          },
          {
                "figma": "Action",
                "prop": "action",
                "note": "Pass a link or button."
          }
    ],
    a11y: {
          "keyboard": [
                "The dismiss button and any action are reachable with Tab."
          ],
          "screenReader": [
                "Danger uses role=alert and is read at once. Other tones use role=status."
          ],
          "youMust": [
                "An alert stays until the problem is gone. For a short confirmation that disappears, use Toast."
          ]
    },
  },
  textarea: {
    importCode: {
      js: `import { useState } from "react";
import { Textarea } from "@/ui";`,
      ts: `import { useState, type ChangeEvent } from "react";
import { Textarea } from "@/ui";`,
    },
    usage: {
      js: `export default function TextareaDemo() {
  const [note, setNote] = useState("");

  return (
    <Textarea
      label="Approval notes"
      placeholder="Write a note…"
      maxLength={500}
      value={note}
      onChange={(e) => setNote(e.target.value)}
    />
  );
}`,
      ts: `export default function TextareaDemo() {
  const [note, setNote] = useState<string>("");

  return (
    <Textarea
      label="Approval notes"
      placeholder="Write a note…"
      maxLength={500}
      value={note}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
    />
  );
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required."
          },
          {
                "name": "hint",
                "type": "string",
                "description": "Helper text."
          },
          {
                "name": "error",
                "type": "string",
                "description": "Marks the field invalid and replaces the hint."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\"",
                "default": "\"md\"",
                "description": "Height 64, 88, 120."
          },
          {
                "name": "showCounter",
                "type": "boolean",
                "default": "true",
                "description": "Shows used/max. Needs maxLength."
          },
          {
                "name": "...rest",
                "type": "TextareaHTMLAttributes",
                "description": "value, onChange, maxLength, placeholder, disabled, and so on."
          }
    ],
    figma: [
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm, md, or lg."
          },
          {
                "figma": "🎯 State",
                "prop": "value, error, disabled",
                "note": "Hover and focus come from the browser."
          },
          {
                "figma": "Show Label, Label",
                "prop": "label",
                "note": "Always shown in code."
          },
          {
                "figma": "Show Helper Text, Helper Text",
                "prop": "hint",
                "note": "Pass to show."
          },
          {
                "figma": "Placeholder",
                "prop": "placeholder",
                "note": "Native."
          },
          {
                "figma": "Show Counter",
                "prop": "showCounter",
                "note": "Needs maxLength."
          }
    ],
    a11y: {
          "keyboard": [
                "A native textarea."
          ],
          "screenReader": [
                "Label linked with for. The hint, error and counter are linked with aria-describedby."
          ],
          "youMust": [
                "maxLength stops typing at the limit; say the limit in the hint so it is not a surprise."
          ]
    },
  },
  chip: {
    importCode: {
      js: `import { useState } from "react";
import { Chip } from "@/ui";`,
      ts: `import { useState } from "react";
import { Chip } from "@/ui";`,
    },
    usage: {
      js: `export default function ChipDemo() {
  const [filters, setFilters] = useState(["KPR", "10-year term"]);

  return filters.map((f) => (
    <Chip key={f} label={f} tone="primary" onRemove={() => setFilters(filters.filter((x) => x !== f))} />
  ));
}`,
      ts: `export default function ChipDemo() {
  const [filters, setFilters] = useState<string[]>(["KPR", "10-year term"]);

  return filters.map((f: string) => (
    <Chip key={f} label={f} tone="primary" onRemove={() => setFilters(filters.filter((x) => x !== f))} />
  ));
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required. Also names the remove button."
          },
          {
                "name": "tone",
                "type": "\"neutral\" | \"primary\" | \"success\" | \"warning\" | \"danger\"",
                "default": "\"neutral\"",
                "description": ""
          },
          {
                "name": "type",
                "type": "\"filled\" | \"outline\"",
                "default": "\"filled\"",
                "description": ""
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\"",
                "default": "\"md\"",
                "description": "Height 24 or 32."
          },
          {
                "name": "icon",
                "type": "ReactNode",
                "description": "Decorative icon before the label."
          },
          {
                "name": "onRemove",
                "type": "() => void",
                "description": "Shows the remove button."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "filled or outline."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm or md."
          },
          {
                "figma": "🎨 Tone",
                "prop": "tone",
                "note": "Same five tones."
          },
          {
                "figma": "Show Icon Left, Change Icon Left",
                "prop": "icon",
                "note": "Pass an icon."
          },
          {
                "figma": "Show Close",
                "prop": "onRemove",
                "note": "Pass the handler to show it."
          },
          {
                "figma": "Label",
                "prop": "label",
                "note": "Same."
          }
    ],
    a11y: {
          "keyboard": [
                "The remove button is a native button with a 44px target."
          ],
          "screenReader": [
                "The remove button is named Remove followed by the label."
          ],
          "youMust": [
                "After removing a chip, move focus to the next chip or back to the field that made it.",
                "Unlike Badge, which only labels, a chip stands for something the user chose."
          ]
    },
  },
  slider: {
    importCode: {
      js: `import { Slider } from "@/ui";`,
      ts: `import { Slider } from "@/ui";`,
    },
    usage: {
      js: `export default function SliderDemo() {
  return <Slider label="Term" min={1} max={30} defaultValue={15} format={(n) => n + " yrs"} />;
}`,
      ts: `export default function SliderDemo() {
  return <Slider label="Term" min={1} max={30} defaultValue={15} format={(n: number) => n + " yrs"} />;
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required."
          },
          {
                "name": "mode",
                "type": "\"single\" | \"range\"",
                "default": "\"single\"",
                "description": "Range has two thumbs."
          },
          {
                "name": "value, onChange",
                "type": "number or [number, number]",
                "description": "Controlled value."
          },
          {
                "name": "defaultValue",
                "type": "number or [number, number]",
                "description": "Uncontrolled start."
          },
          {
                "name": "min, max, step",
                "type": "number",
                "default": "0, 100, 1",
                "description": ""
          },
          {
                "name": "format",
                "type": "(value) => string",
                "description": "Text shown and read, such as 15 yrs."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\"",
                "default": "\"md\"",
                "description": "Track 2, 4, 6; thumb 12, 16, 20."
          },
          {
                "name": "showLabel, showValue",
                "type": "boolean",
                "default": "true",
                "description": ""
          },
          {
                "name": "disabled",
                "type": "boolean",
                "description": ""
          }
    ],
    figma: [
          {
                "figma": "🔀 Mode",
                "prop": "mode",
                "note": "single or range."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm, md, or lg."
          },
          {
                "figma": "🎯 State",
                "prop": "disabled",
                "note": "Hover and focus come from the browser."
          },
          {
                "figma": "Show Label",
                "prop": "showLabel",
                "note": "Boolean."
          },
          {
                "figma": "Show Value, Value",
                "prop": "showValue, format",
                "note": "The value text is computed."
          }
    ],
    a11y: {
          "keyboard": [
                "Native range inputs: arrows step, Page Up and Page Down jump, Home and End go to the ends. Range has two inputs in Tab order."
          ],
          "screenReader": [
                "Each thumb is named by the label, with minimum or maximum in range mode, and reads the formatted value through aria-valuetext."
          ],
          "youMust": [
                "The row is 44px tall, so the whole width is the touch target."
          ]
    },
  },
  spinner: {
    importCode: {
      js: `import { Spinner } from "@/ui";`,
      ts: `import { Spinner, type SpinnerSize } from "@/ui";`,
    },
    usage: {
      js: `export default function SpinnerDemo() {
  return <Spinner label="Loading transactions" />;
}`,
      ts: `const size: SpinnerSize = "md";

export default function SpinnerDemo() {
  return <Spinner size={size} label="Loading transactions" />;
}`,
    },
    props: [
          {
                "name": "type",
                "type": "\"circular\" | \"dots\"",
                "default": "\"circular\"",
                "description": ""
          },
          {
                "name": "tone",
                "type": "\"neutral\" | \"primary\" | \"onPrimary\"",
                "default": "\"primary\"",
                "description": "onPrimary is for a brand fill, such as inside a primary button."
          },
          {
                "name": "size",
                "type": "\"xs\" | \"sm\" | \"md\" | \"lg\"",
                "default": "\"md\"",
                "description": "12, 16, 24, 32."
          },
          {
                "name": "label",
                "type": "string",
                "default": "\"Loading\"",
                "description": "Read by screen readers."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "circular or dots."
          },
          {
                "figma": "🎨 Tone",
                "prop": "tone",
                "note": "Neutral, Primary, On-Primary."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "xs to lg."
          }
    ],
    a11y: {
          "keyboard": [
                "Not focusable."
          ],
          "screenReader": [
                "role=status with a hidden label, so Loading is announced once."
          ],
          "youMust": [
                "Use it inline or in a button. For a whole area, use Skeleton; for measurable progress, use Progress Bar.",
                "Motion stops for people who ask for reduced motion; the static ring still shows."
          ]
    },
  },
  "otp-input": {
    importCode: {
      js: `import { useState } from "react";
import { OtpInput } from "@/ui";`,
      ts: `import { useState } from "react";
import { OtpInput } from "@/ui";`,
    },
    usage: {
      js: `export default function OtpDemo() {
  const [code, setCode] = useState("");

  return (
    <OtpInput
      label="Verification code"
      value={code}
      onChange={setCode}
      onComplete={(v) => console.log("submit", v)}
      hint="Resend code in 00:45"
    />
  );
}`,
      ts: `export default function OtpDemo() {
  const [code, setCode] = useState<string>("");

  return (
    <OtpInput
      label="Verification code"
      value={code}
      onChange={setCode}
      onComplete={(v: string) => console.log("submit", v)}
      hint="Resend code in 00:45"
    />
  );
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required. Names the group."
          },
          {
                "name": "length",
                "type": "4 | 6",
                "default": "6",
                "description": "Number of boxes."
          },
          {
                "name": "value, onChange",
                "type": "string, (value) => void",
                "description": "Digits only."
          },
          {
                "name": "onComplete",
                "type": "(value) => void",
                "description": "Called once every box is filled. Use it to submit."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\"",
                "default": "\"md\"",
                "description": ""
          },
          {
                "name": "hint, error",
                "type": "string",
                "description": "Helper or error line."
          },
          {
                "name": "disabled",
                "type": "boolean",
                "description": ""
          }
    ],
    figma: [
          {
                "figma": "🔀 Count",
                "prop": "length",
                "note": "4 or 6 Digit."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "OTP Cell size."
          },
          {
                "figma": "🎯 State",
                "prop": "value, error, disabled",
                "note": "Focused is the browser."
          },
          {
                "figma": "Show Helper Text, Helper Text",
                "prop": "hint",
                "note": "Pass to show."
          }
    ],
    a11y: {
          "keyboard": [
                "Typing moves to the next box, Backspace goes back, arrows move, and pasting a code fills every box."
          ],
          "screenReader": [
                "A group named by the label. Each box is named Digit 1 of 6 and so on. The first box has autocomplete=one-time-code."
          ],
          "youMust": [
                "Tell people how long until they can resend, and do not clear the boxes on error without saying so."
          ]
    },
  },
  "pin-input": {
    importCode: {
      js: `import { useState } from "react";
import { PinInput } from "@/ui";`,
      ts: `import { useState } from "react";
import { PinInput } from "@/ui";`,
    },
    usage: {
      js: `export default function PinDemo() {
  const [pin, setPin] = useState("");

  return <PinInput label="Enter transaction PIN" value={pin} onChange={setPin} hint="Never share your PIN with anyone" />;
}`,
      ts: `export default function PinDemo() {
  const [pin, setPin] = useState<string>("");

  return <PinInput label="Enter transaction PIN" value={pin} onChange={setPin} hint="Never share your PIN with anyone" />;
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required."
          },
          {
                "name": "length",
                "type": "4 | 6",
                "default": "6",
                "description": ""
          },
          {
                "name": "value, onChange",
                "type": "string, (value) => void",
                "description": "A keypad outside the component can call onChange."
          },
          {
                "name": "onComplete",
                "type": "(value) => void",
                "description": "Called at full length."
          },
          {
                "name": "hint, error",
                "type": "string",
                "description": ""
          },
          {
                "name": "showLabel",
                "type": "boolean",
                "default": "true",
                "description": ""
          },
          {
                "name": "disabled",
                "type": "boolean",
                "description": ""
          }
    ],
    figma: [
          {
                "figma": "🔀 Count",
                "prop": "length",
                "note": "4 or 6 Digit."
          },
          {
                "figma": "🎯 State",
                "prop": "value, error, disabled",
                "note": "Filled is the dot count."
          },
          {
                "figma": "Show Label, Label",
                "prop": "showLabel, label",
                "note": "Same."
          },
          {
                "figma": "Show Helper Text, Helper Text",
                "prop": "hint",
                "note": "Pass to show."
          }
    ],
    a11y: {
          "keyboard": [
                "A real password input sits over the dots, so the system keyboard works and Tab reaches it."
          ],
          "screenReader": [
                "Named by the label. The value is never shown or read. The helper line is a polite live region, so an error is announced."
          ],
          "youMust": [
                "The numeric keypad lives outside this component. Give its buttons names, and its delete button the name Delete."
          ]
    },
  },
  modal: {
    importCode: {
      js: `import { useState } from "react";
import { Button, Modal } from "@/ui";`,
      ts: `import { useState } from "react";
import { Button, Modal } from "@/ui";`,
    },
    usage: {
      js: `export default function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>Remove saved account</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Remove saved account?"
        description="“Andi Pratama” will be removed from your saved accounts."
        footer={<Button variant="destructive" onClick={() => setOpen(false)}>Remove</Button>}
      />
    </>
  );
}`,
      ts: `export default function ModalDemo() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>Remove saved account</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Remove saved account?"
        description="“Andi Pratama” will be removed from your saved accounts."
        footer={<Button variant="destructive" onClick={() => setOpen(false)}>Remove</Button>}
      />
    </>
  );
}`,
    },
    props: [
          {
                "name": "open, onClose",
                "type": "boolean, () => void",
                "description": "Required on Modal. onClose runs for the close button, the backdrop, and Escape."
          },
          {
                "name": "title",
                "type": "string",
                "description": "Required. Names the dialog."
          },
          {
                "name": "description",
                "type": "ReactNode",
                "description": ""
          },
          {
                "name": "type",
                "type": "\"confirmation\" | \"form\" | \"alert\"",
                "default": "\"confirmation\"",
                "description": "Alert adds a warning icon."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\" | \"xl\"",
                "default": "\"sm\"",
                "description": "400, 560, 720, 960 wide."
          },
          {
                "name": "children",
                "type": "ReactNode",
                "description": "The body, such as form fields."
          },
          {
                "name": "footer",
                "type": "ReactNode",
                "description": "Buttons, right aligned."
          },
          {
                "name": "ModalPanel",
                "type": "component",
                "description": "The box on its own, for documentation."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "confirmation, form, or alert."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm to xl."
          },
          {
                "figma": "Show Close",
                "prop": "onClose",
                "note": "On ModalPanel, pass onClose."
          },
          {
                "figma": "Title, Show Description, Description",
                "prop": "title, description",
                "note": "Same."
          },
          {
                "figma": "Show Button",
                "prop": "footer",
                "note": "Pass your buttons."
          }
    ],
    a11y: {
          "keyboard": [
                "A native dialog: focus moves in, Tab stays inside, Escape closes, and focus returns to the trigger."
          ],
          "screenReader": [
                "Named by its title. The page behind is inert."
          ],
          "youMust": [
                "One primary action. A destructive one uses the destructive Button and a clear verb, such as Remove.",
                "For something that is not critical, use a Drawer or the page itself."
          ]
    },
  },
  table: {
    importCode: {
      js: `import { Status, Table } from "@/ui";`,
      ts: `import { Status, Table, type TableColumn } from "@/ui";`,
    },
    usage: {
      js: `const columns = [
  { key: "customer", header: "Customer" },
  { key: "status", header: "Status" },
];
const rows = [{ customer: "Andi P.", status: <Status status="success" size="sm" /> }];

export default function TableDemo() {
  return <Table caption="Recent transfers" type="striped" columns={columns} rows={rows} />;
}`,
      ts: `const columns: TableColumn[] = [
  { key: "customer", header: "Customer" },
  { key: "status", header: "Status" },
];
const rows = [{ customer: "Andi P.", status: <Status status="success" size="sm" /> }];

export default function TableDemo() {
  return <Table caption="Recent transfers" type="striped" columns={columns} rows={rows} />;
}`,
    },
    props: [
          {
                "name": "caption",
                "type": "string",
                "description": "Required. Describes the table for screen readers."
          },
          {
                "name": "showCaption",
                "type": "boolean",
                "default": "false",
                "description": "Shows the caption above the table."
          },
          {
                "name": "columns",
                "type": "{ key, header, align? }[]",
                "description": "Required."
          },
          {
                "name": "rows",
                "type": "Record<string, ReactNode>[]",
                "description": "Required."
          },
          {
                "name": "type",
                "type": "\"basic\" | \"striped\" | \"bordered\"",
                "default": "\"basic\"",
                "description": ""
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\"",
                "default": "\"md\"",
                "description": "Row height 32, 40, 48."
          },
          {
                "name": "stroke",
                "type": "boolean",
                "default": "true",
                "description": "Outer border."
          },
          {
                "name": "selectedRow",
                "type": "number",
                "description": "Index of the selected row."
          }
    ],
    figma: [
          {
                "figma": "Table Cell · Type",
                "prop": "columns",
                "note": "Header cells come from columns, body cells from rows."
          },
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "basic, striped, or bordered."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm, md, or lg."
          },
          {
                "figma": "Stroke",
                "prop": "stroke",
                "note": "Boolean."
          }
    ],
    a11y: {
          "keyboard": [
                "Scrolls sideways on its own when narrow; the scroll area is reachable."
          ],
          "screenReader": [
                "A native table with a caption and th scope=col, so each cell is read with its column."
          ],
          "youMust": [
                "Put an action in a row as a real button or link, with a name that says which row it acts on."
          ]
    },
  },
  "date-picker": {
    importCode: {
      js: `import { useState } from "react";
import { DatePicker } from "@/ui";`,
      ts: `import { useState } from "react";
import { DatePicker } from "@/ui";`,
    },
    usage: {
      js: `export default function DatePickerDemo() {
  const [date, setDate] = useState(null);

  return <DatePicker label="Due date" value={date} onChange={setDate} hint="Format DD MMM YYYY" />;
}`,
      ts: `export default function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(null);

  return <DatePicker label="Due date" value={date} onChange={setDate} hint="Format DD MMM YYYY" />;
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required."
          },
          {
                "name": "mode",
                "type": "\"single\" | \"range\"",
                "default": "\"single\"",
                "description": ""
          },
          {
                "name": "value, onChange",
                "type": "Date or [Date, Date | null]",
                "description": "Controlled."
          },
          {
                "name": "defaultValue",
                "type": "Date or [Date, Date | null]",
                "description": ""
          },
          {
                "name": "today",
                "type": "Date",
                "description": "For the outline. Pass it from the server to avoid a mismatch."
          },
          {
                "name": "hint, error",
                "type": "string",
                "description": ""
          },
          {
                "name": "placeholder",
                "type": "string",
                "default": "\"Select date\"",
                "description": ""
          },
          {
                "name": "disabled",
                "type": "boolean",
                "description": ""
          },
          {
                "name": "Calendar",
                "type": "component",
                "description": "The month grid on its own."
          }
    ],
    figma: [
          {
                "figma": "Calendar · Mode",
                "prop": "mode",
                "note": "single or range."
          },
          {
                "figma": "🎯 State",
                "prop": "value, error, disabled",
                "note": "Focused is the open calendar."
          },
          {
                "figma": "Label, Helper Text, Placeholder",
                "prop": "label, hint, placeholder",
                "note": "Same."
          },
          {
                "figma": "Change Icon Left",
                "note": "No prop. The calendar icon is fixed."
          }
    ],
    a11y: {
          "keyboard": [
                "The field opens the calendar. In the grid, arrows move a day or a week, Page Up and Page Down a month, Home and End the week, Enter picks. Escape closes and returns focus."
          ],
          "screenReader": [
                "The grid is a role=grid named by the month. Each day is named in full, such as Jumat, 18 September 2026. Today has aria-current=date."
          ],
          "youMust": [
                "Dates show in id-ID format. If people type dates, add a text input next to it."
          ]
    },
  },
  combobox: {
    importCode: {
      js: `import { useState } from "react";
import { Combobox } from "@/ui";`,
      ts: `import { useState } from "react";
import { Combobox, type ComboboxOption } from "@/ui";`,
    },
    usage: {
      js: `const banks = [
  { value: "bri", label: "Bank Rakyat Indonesia" },
  { value: "bni", label: "Bank Negara Indonesia" },
];

export default function ComboboxDemo() {
  const [bank, setBank] = useState(null);

  return <Combobox label="Destination bank" options={banks} value={bank} onChange={setBank} />;
}`,
      ts: `const banks: ComboboxOption[] = [
  { value: "bri", label: "Bank Rakyat Indonesia" },
  { value: "bni", label: "Bank Negara Indonesia" },
];

export default function ComboboxDemo() {
  const [bank, setBank] = useState<string | null>(null);

  return <Combobox label="Destination bank" options={banks} value={bank} onChange={setBank} />;
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required."
          },
          {
                "name": "options",
                "type": "{ value, label }[]",
                "description": "Required."
          },
          {
                "name": "mode",
                "type": "\"single\" | \"multiple\"",
                "default": "\"single\"",
                "description": "Multiple shows picks as chips."
          },
          {
                "name": "value, onChange",
                "type": "string | null, or string[]",
                "description": "Controlled."
          },
          {
                "name": "placeholder",
                "type": "string",
                "description": ""
          },
          {
                "name": "hint, error",
                "type": "string",
                "description": ""
          },
          {
                "name": "emptyText",
                "type": "string",
                "default": "\"No results\"",
                "description": "Shown when nothing matches."
          },
          {
                "name": "disabled",
                "type": "boolean",
                "description": ""
          }
    ],
    figma: [
          {
                "figma": "🔀 Mode",
                "prop": "mode",
                "note": "single or multiple."
          },
          {
                "figma": "🎯 State",
                "prop": "error, disabled",
                "note": "Hover and focus come from the browser."
          },
          {
                "figma": "Label, Helper Text, Placeholder",
                "prop": "label, hint, placeholder",
                "note": "Same."
          }
    ],
    a11y: {
          "keyboard": [
                "Typing filters. Down opens and moves, Up moves, Enter picks, Escape closes. In multiple mode, Backspace in an empty field removes the last pick."
          ],
          "screenReader": [
                "The ARIA combobox pattern: role=combobox with aria-expanded and aria-activedescendant, and a role=listbox of options."
          ],
          "youMust": [
                "For a short fixed list, use Select. Show an Empty State when nothing matches."
          ]
    },
  },
  "more-menu": {
    importCode: {
      js: `import { Menu } from "@/ui";`,
      ts: `import { Menu, type MenuItemData } from "@/ui";`,
    },
    usage: {
      js: `export default function MenuDemo() {
  return (
    <Menu
      label="More actions"
      trigger="⋯"
      items={[
        { label: "Edit", onSelect: () => {} },
        { label: "Remove", danger: true, separatorBefore: true, onSelect: () => {} },
      ]}
    />
  );
}`,
      ts: `const items: MenuItemData[] = [
  { label: "Edit", onSelect: () => {} },
  { label: "Remove", danger: true, separatorBefore: true, onSelect: () => {} },
];

export default function MenuDemo() {
  return <Menu label="More actions" trigger="⋯" items={items} />;
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required. Names the trigger; needed when it is only an icon."
          },
          {
                "name": "trigger",
                "type": "ReactNode",
                "description": "Required. Such as a kebab icon."
          },
          {
                "name": "items",
                "type": "{ label, icon?, onSelect?, danger?, disabled?, separatorBefore? }[]",
                "description": "Required."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\"",
                "default": "\"md\"",
                "description": "Text and icon size. Items stay 44px tall."
          },
          {
                "name": "align",
                "type": "\"start\" | \"end\"",
                "default": "\"start\"",
                "description": "Which edge the list lines up with."
          },
          {
                "name": "MenuList",
                "type": "component",
                "description": "The open list on its own."
          }
    ],
    figma: [
          {
                "figma": "Menu Item · 📐 Size",
                "prop": "size",
                "note": "sm or md."
          },
          {
                "figma": "Menu Item · 🎯 State",
                "prop": "disabled, danger",
                "note": "Default, Hover (browser), Disabled, Danger."
          },
          {
                "figma": "Show Icon Left, Change Icon Left",
                "prop": "icon",
                "note": "Per item."
          },
          {
                "figma": "Label",
                "prop": "label",
                "note": "Per item."
          }
    ],
    a11y: {
          "keyboard": [
                "The trigger opens the menu and focus goes to the first item. Up and Down move, Home and End jump, Escape closes and returns focus. Disabled items are skipped."
          ],
          "screenReader": [
                "The ARIA menu pattern: aria-haspopup and aria-expanded on the trigger, role=menu and role=menuitem in the list."
          ],
          "youMust": [
                "Use it for actions. For choosing a value in a form, use Select or Combobox."
          ]
    },
  },
  "empty-state": {
    importCode: {
      js: `import { Button, EmptyState } from "@/ui";`,
      ts: `import { Button, EmptyState, type EmptyStateScope } from "@/ui";`,
    },
    usage: {
      js: `export default function EmptyStateDemo() {
  return (
    <EmptyState
      scope="list"
      title="No transactions yet"
      description="Your transactions will appear here."
      action={<Button variant="secondary">Try again</Button>}
    />
  );
}`,
      ts: `const scope: EmptyStateScope = "list";

export default function EmptyStateDemo() {
  return (
    <EmptyState
      scope={scope}
      title="No transactions yet"
      description="Your transactions will appear here."
      action={<Button variant="secondary">Try again</Button>}
    />
  );
}`,
    },
    props: [
          {
                "name": "title",
                "type": "string",
                "description": "Required."
          },
          {
                "name": "description",
                "type": "string",
                "description": "Up to 280px wide."
          },
          {
                "name": "scope",
                "type": "\"search\" | \"list\" | \"error\" | \"custom\"",
                "default": "\"list\"",
                "description": "Sets the icon; error uses the danger tone."
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\"",
                "default": "\"md\"",
                "description": "Circle 48, 64, 80."
          },
          {
                "name": "icon",
                "type": "ReactNode",
                "description": "Replaces the scope icon."
          },
          {
                "name": "action",
                "type": "ReactNode",
                "description": "One action at most."
          },
          {
                "name": "showImage",
                "type": "boolean",
                "default": "true",
                "description": ""
          }
    ],
    figma: [
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm, md, or lg."
          },
          {
                "figma": "Scope",
                "prop": "scope",
                "note": "Search, List, Error, Custom."
          },
          {
                "figma": "Show Image",
                "prop": "showImage",
                "note": "Boolean."
          },
          {
                "figma": "Title, Show Description, Description",
                "prop": "title, description",
                "note": "Same."
          },
          {
                "figma": "Show Button, Button Value",
                "prop": "action",
                "note": "Pass a Button."
          }
    ],
    a11y: {
          "keyboard": [
                "Only the action is focusable."
          ],
          "screenReader": [
                "The title is a heading. The icon is decorative."
          ],
          "youMust": [
                "Say what happened and what to do next. After a failed load, the action should retry."
          ]
    },
  },
  "navigation-bar": {
    importCode: {
      js: `import { BottomNav, TopAppBar } from "@/ui";`,
      ts: `import { BottomNav, TopAppBar, type NavItem } from "@/ui";`,
    },
    usage: {
      js: `const items = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "History", href: "/history", icon: "🕘", count: 3 },
];

export default function NavDemo() {
  return (
    <>
      <TopAppBar title="Transaction History" onBack={() => history.back()} />
      <BottomNav items={items} current="/" />
    </>
  );
}`,
      ts: `const items: NavItem[] = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "History", href: "/history", icon: "🕘", count: 3 },
];

export default function NavDemo() {
  return (
    <>
      <TopAppBar title="Transaction History" onBack={() => history.back()} />
      <BottomNav items={items} current="/" />
    </>
  );
}`,
    },
    props: [
          {
                "name": "TopAppBar title",
                "type": "string",
                "description": "Required. The page title, an h1."
          },
          {
                "name": "TopAppBar onBack",
                "type": "() => void",
                "description": "Shows the back button."
          },
          {
                "name": "TopAppBar actions",
                "type": "ReactNode",
                "description": "Buttons on the right."
          },
          {
                "name": "BottomNav items",
                "type": "{ label, href, icon, count?, disabled? }[]",
                "description": "3 to 5 destinations."
          },
          {
                "name": "BottomNav current",
                "type": "string",
                "description": "href of the current page."
          },
          {
                "name": "BottomNav label",
                "type": "string",
                "default": "\"Main\"",
                "description": "Names the nav."
          }
    ],
    figma: [
          {
                "figma": "Navigation Bar · Type",
                "note": "Two components in code: TopAppBar and BottomNav."
          },
          {
                "figma": "Title",
                "prop": "title",
                "note": "TopAppBar."
          },
          {
                "figma": "Nav Item · 🎯 State",
                "prop": "current, disabled",
                "note": "Active is current."
          },
          {
                "figma": "Nav Item · Icon, Label",
                "prop": "icon, label",
                "note": "Per item."
          },
          {
                "figma": "Show Value, Value",
                "prop": "count",
                "note": "Danger badge."
          }
    ],
    a11y: {
          "keyboard": [
                "Every item is a link; Tab reaches each one. The back button is a button named Back."
          ],
          "screenReader": [
                "BottomNav is a nav landmark. The current item has aria-current=page. A count is read, such as History, 3 new."
          ],
          "youMust": [
                "Keep 3 to 5 items. Do not hide the label; an icon alone is not enough."
          ]
    },
  },
  "transaction-list-item": {
    importCode: {
      js: `import { TransactionListItem } from "@/ui";`,
      ts: `import { TransactionListItem, type TransactionTone } from "@/ui";`,
    },
    usage: {
      js: `export default function TxDemo() {
  return (
    <TransactionListItem
      href="/transactions/123"
      tone="success"
      title="Transfer from Andi"
      label="Transfer"
      timestamp="18 Sep, 14:02"
      amount="Rp500.000"
    />
  );
}`,
      ts: `const tone: TransactionTone = "success";

export default function TxDemo() {
  return (
    <TransactionListItem
      href="/transactions/123"
      tone={tone}
      title="Transfer from Andi"
      label="Transfer"
      timestamp="18 Sep, 14:02"
      amount="Rp500.000"
    />
  );
}`,
    },
    props: [
          {
                "name": "title",
                "type": "string",
                "description": "Required. One line, truncated."
          },
          {
                "name": "timestamp",
                "type": "string",
                "description": "Required."
          },
          {
                "name": "amount",
                "type": "string",
                "description": "Required. Formatted, without a sign."
          },
          {
                "name": "tone",
                "type": "\"neutral\" | \"success\" | \"danger\"",
                "default": "\"neutral\"",
                "description": "The sign is locked per tone: + in, − out."
          },
          {
                "name": "label",
                "type": "string",
                "description": "Category or status."
          },
          {
                "name": "icon",
                "type": "ReactNode",
                "description": "Defaults to a wallet."
          },
          {
                "name": "href",
                "type": "string",
                "description": "Makes the row a link."
          }
    ],
    figma: [
          {
                "figma": "🎨 Tone",
                "prop": "tone",
                "note": "Neutral, Success, Danger."
          },
          {
                "figma": "🎯 State",
                "prop": "href",
                "note": "Hover and Pressed need a link row."
          },
          {
                "figma": "Icon",
                "prop": "icon",
                "note": "Pass an icon."
          },
          {
                "figma": "Title, Label, Timestamp, Value",
                "prop": "title, label, timestamp, amount",
                "note": "Same text."
          }
    ],
    a11y: {
          "keyboard": [
                "With href, the row is one link."
          ],
          "screenReader": [
                "The sign is read as Incoming or Outgoing, not as a plus or minus character."
          ],
          "youMust": [
                "Do not rely on green and red alone: the sign and the spoken direction carry the meaning."
          ]
    },
  },
  "amount-input": {
    importCode: {
      js: `import { useState } from "react";
import { AmountInput } from "@/ui";`,
      ts: `import { useState } from "react";
import { AmountInput } from "@/ui";`,
    },
    usage: {
      js: `export default function AmountDemo() {
  const [amount, setAmount] = useState(null);

  return <AmountInput label="Amount" value={amount} onChange={setAmount} hint="Minimum Rp10.000" />;
}`,
      ts: `export default function AmountDemo() {
  const [amount, setAmount] = useState<number | null>(null);

  return <AmountInput label="Amount" value={amount} onChange={setAmount} hint="Minimum Rp10.000" />;
}`,
    },
    props: [
          {
                "name": "label",
                "type": "string",
                "description": "Required."
          },
          {
                "name": "value, onChange",
                "type": "number | null",
                "description": "The amount in rupiah, as a number."
          },
          {
                "name": "defaultValue",
                "type": "number | null",
                "description": ""
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\"",
                "default": "\"md\"",
                "description": "Field 44, 48, 56."
          },
          {
                "name": "hint, error",
                "type": "string",
                "description": ""
          },
          {
                "name": "placeholder",
                "type": "string",
                "default": "\"0\"",
                "description": ""
          },
          {
                "name": "disabled",
                "type": "boolean",
                "description": ""
          }
    ],
    figma: [
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm, md, or lg."
          },
          {
                "figma": "🎯 State",
                "prop": "value, error, disabled",
                "note": "Hover and focus come from the browser."
          },
          {
                "figma": "Show Label, Label",
                "prop": "label",
                "note": "Same."
          },
          {
                "figma": "Show Helper Text, Helper Text",
                "prop": "hint",
                "note": "Pass to show."
          },
          {
                "figma": "Placeholder",
                "prop": "placeholder",
                "note": "Same."
          }
    ],
    a11y: {
          "keyboard": [
                "A text input with inputMode=numeric, so phones show the number pad."
          ],
          "screenReader": [
                "Named by the label. The Rp prefix is visual; say rupiah in the label if it is not obvious."
          ],
          "youMust": [
                "Validate the minimum and maximum on the number, not on the formatted text."
          ]
    },
  },
  "qr-code": {
    importCode: {
      js: `import { QrCodeDisplay } from "@/ui";`,
      ts: `import type { ReactNode } from "react";
import { QrCodeDisplay } from "@/ui";`,
    },
    usage: {
      js: `export default function QrDemo({ qrSvg }) {
  return (
    <QrCodeDisplay
      type="dynamic"
      label="Warung Natuna"
      qr={qrSvg}
      value="Rp150.000"
      expiry="Valid for 04:59"
      onSave={() => {}}
    />
  );
}`,
      ts: `export default function QrDemo({ qrSvg }: { qrSvg: ReactNode }) {
  return (
    <QrCodeDisplay
      type="dynamic"
      label="Warung Natuna"
      qr={qrSvg}
      value="Rp150.000"
      expiry="Valid for 04:59"
      onSave={() => {}}
    />
  );
}`,
    },
    props: [
          {
                "name": "qr",
                "type": "ReactNode",
                "description": "The real QR from the backend. Leave out only in documentation."
          },
          {
                "name": "label",
                "type": "string",
                "description": "Merchant or account."
          },
          {
                "name": "value",
                "type": "string",
                "description": "Formatted amount."
          },
          {
                "name": "expiry",
                "type": "string",
                "description": "Dynamic only. The countdown text."
          },
          {
                "name": "type",
                "type": "\"static\" | \"dynamic\"",
                "default": "\"static\"",
                "description": ""
          },
          {
                "name": "size",
                "type": "\"sm\" | \"md\" | \"lg\"",
                "default": "\"md\"",
                "description": "QR 160, 200, 240."
          },
          {
                "name": "onSave, saveLabel",
                "type": "() => void, string",
                "description": "Shows the save button."
          }
    ],
    figma: [
          {
                "figma": "🧰 Type",
                "prop": "type",
                "note": "static or dynamic."
          },
          {
                "figma": "📐 Size",
                "prop": "size",
                "note": "sm, md, or lg."
          },
          {
                "figma": "Show Label, Label",
                "prop": "label",
                "note": "Same."
          },
          {
                "figma": "Show Value, Value",
                "prop": "value",
                "note": "Same."
          },
          {
                "figma": "Show Button, Button Value",
                "prop": "onSave, saveLabel",
                "note": "Pass to show."
          }
    ],
    a11y: {
          "keyboard": [
                "Only the save button is focusable."
          ],
          "screenReader": [
                "The QR is an image named Payment QR code for the merchant."
          ],
          "youMust": [
                "The placeholder pattern is illustrative and not scannable. Always render the real QR from the backend.",
                "Do not announce the countdown every second."
          ]
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
