// API docs for components that exist in src/ui. Keep in step with the props in those files.

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentDoc {
  example: string;
  props: PropDoc[];
}

export const componentDocs: Record<string, ComponentDoc> = {
  button: {
    example: `import { Button } from "@/ui";

export default function Example() {
  return (
    <>
      <Button>Save changes</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">Delete account</Button>
      <Button loading>Saving</Button>
    </>
  );
}`,
    props: [
      { name: "variant", type: '"primary" | "secondary" | "ghost" | "destructive"', default: '"primary"', description: "Visual weight. Use one primary per view." },
      { name: "size", type: '"md" | "lg"', default: '"md"', description: "md is 40px tall, lg is 48px." },
      { name: "loading", type: "boolean", default: "false", description: "Shows a spinner, sets aria-busy, and blocks clicks. The label stays so the width does not change." },
      { name: "disabled", type: "boolean", default: "false", description: "Blocks interaction and uses the disabled colors." },
      { name: "type", type: '"button" | "submit" | "reset"', default: '"button"', description: "Defaults to button so a button inside a form does not submit by accident." },
      { name: "...rest", type: "ButtonHTMLAttributes", description: "Every native button attribute, such as onClick and aria-label." },
    ],
  },
  badge: {
    example: `import { Badge } from "@/ui";

export default function Example() {
  return <Badge tone="success">Paid</Badge>;
}`,
    props: [
      { name: "tone", type: '"neutral" | "info" | "success" | "warning" | "danger"', default: '"neutral"', description: "Color for the meaning. Always pair it with text." },
      { name: "...rest", type: "HTMLAttributes<HTMLSpanElement>", description: "Every native span attribute." },
    ],
  },
  input: {
    example: `import { Input } from "@/ui";

export default function Example() {
  return (
    <Input
      label="Email"
      type="email"
      hint="We send the receipt here."
      error={invalid ? "Enter a valid email address." : undefined}
    />
  );
}`,
    props: [
      { name: "label", type: "string", description: "Required visible label, connected to the field." },
      { name: "hint", type: "string", description: "Helper text under the field." },
      { name: "error", type: "string", description: "Marks the field invalid, sets aria-invalid, and replaces the hint." },
      { name: "...rest", type: "InputHTMLAttributes", description: "Every native input attribute except id, which is generated." },
    ],
  },
  avatar: {
    example: `import { Avatar } from "@/ui";

export default function Example() {
  return <Avatar name="Natuna Digilab" size="lg" />;
}`,
    props: [
      { name: "name", type: "string", description: "Full name. Initials come from the first and last word, and the name is the accessible label." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "32, 40, or 56px." },
    ],
  },
  accordion: {
    example: `import { Accordion } from "@/ui";

export default function Example() {
  return (
    <Accordion
      items={[
        { title: "How long does a transfer take?", content: "Most arrive within a minute.", defaultOpen: true },
        { title: "What are the limits?", content: "Limits depend on your account type." },
      ]}
    />
  );
}`,
    props: [
      { name: "items", type: "AccordionItem[]", description: "Each item has a title, content, and optional defaultOpen." },
      { name: "className", type: "string", description: "Extra classes for the outer container." },
    ],
  },
};
