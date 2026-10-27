"use client";

// Live demos for component pages. Each one matches the code shown under it in component-docs.ts,
// so what people copy is what they just used.

import { useState, type ReactElement, type ReactNode } from "react";
import { Bell, Heart, ListBullets, SquaresFour, ArrowDownLeft, ArrowUpRight, ClockCounterClockwise, Copy, DotsThree, DownloadSimple, House, PencilSimple, ShareNetwork, Tag, Trash, User, Wallet } from "@phosphor-icons/react/ssr";
import { Accordion, Alert, ButtonGroup, CodeBlock, DropdownMenu, Headline, IconButton, Select, TextLink, AmountInput, Avatar, Badge, BottomNav, Breadcrumbs, Button, Calendar, Card, Changelog, Checkbox, Chip, Combobox, Comment, Cover, DatePicker, Divider, Drawer, DrawerPanel, EmptyState, FileInput, Input, LabelText, Menu, MenuList, Modal, ModalPanel, OtpInput, Pagination, PinInput, ProgressBar, QrCodeDisplay, RadioButton, RadioGroup, Rating, SearchField, Separator, Skeleton, Slider, Spinner, Status, Stepper, Table, Tabs, Textarea, Toast, Toggle, Tooltip, TooltipBubble, TopAppBar, TransactionListItem, type AvatarSize, type BadgeTone, type BadgeType, type ButtonVariant, type CheckboxSize, type LabelTextIndicator, type RadioButtonSize } from "@/ui";

const TODAY = new Date(2026, 8, 13);
const BANKS = [
  { value: "bri", label: "Bank Rakyat Indonesia" },
  { value: "bni", label: "Bank Negara Indonesia" },
  { value: "bsi", label: "Bank Syariah Indonesia" },
  { value: "bca", label: "Bank Central Asia" },
  { value: "mandiri", label: "Bank Mandiri" },
];
const TX_COLUMNS = [
  { key: "customer", header: "Customer" },
  { key: "date", header: "Date" },
  { key: "status", header: "Status" },
];
const TX_ROWS = [
  { customer: "Andi P.", date: "18 Sep", status: <Status status="success" size="sm" /> },
  { customer: "Sari W.", date: "17 Sep", status: <Status status="processing" size="sm" /> },
  { customer: "Budi S.", date: "16 Sep", status: <Status status="failed" size="sm" /> },
  { customer: "Rina K.", date: "15 Sep", status: <Status status="pending" size="sm" /> },
];
const MENU_ITEMS = [
  { label: "Edit", icon: <PencilSimple size={18} /> },
  { label: "Duplicate", icon: <Copy size={18} /> },
  { label: "Share", icon: <ShareNetwork size={18} /> },
  { label: "Download", icon: <DownloadSimple size={18} />, disabled: true, separatorBefore: true },
  { label: "Remove", icon: <Trash size={18} />, danger: true },
];
const NAV_ITEMS = [
  { label: "Home", href: "#home", icon: <House size={24} /> },
  { label: "Accounts", href: "#accounts", icon: <Wallet size={24} /> },
  { label: "History", href: "#history", icon: <ClockCounterClockwise size={24} />, count: 3 },
  { label: "Account", href: "#account", icon: <User size={24} /> },
];
const rupiahYears = (n: number) => n + " yrs";
const rupiahShort = (n: number) => (n >= 1000 ? "Rp" + n / 1000 + " M" : "Rp" + n + " jt");

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

function CheckboxDemo() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="mx-auto w-fit">
      <Checkbox
        size="md"
        label="I agree to the terms"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        error={agreed ? undefined : "Accept the terms to continue."}
      />
    </div>
  );
}

function ToggleDemo() {
  const [on, setOn] = useState(true);

  return (
    <div className="mx-auto w-fit">
      <Toggle size="md" label="Transaction notifications" hint="Sent to your phone." checked={on} onChange={(e) => setOn(e.target.checked)} />
    </div>
  );
}

function SeparatorDemo() {
  return (
    <div className="mx-auto grid w-full max-w-xs gap-4">
      <p className="text-sm text-role-text-primary">Sign in with your email</p>
      <Separator label="or" />
      <p className="text-sm text-role-text-primary">Continue with your phone number</p>
    </div>
  );
}

function BreadcrumbsDemo() {
  return (
    <div className="mx-auto w-fit">
      <Breadcrumbs
        maxItems={4}
        items={[
          { label: "Home", href: "#" },
          { label: "Product", href: "#" },
          { label: "KPR Digital", href: "#" },
          { label: "Simulation", href: "#" },
          { label: "Detail" },
        ]}
      />
    </div>
  );
}

function StatusDemo() {
  return (
    <div className="mx-auto flex flex-wrap items-center justify-center gap-3">
      <Status status="pending" />
      <Status status="success" />
      <Status status="failed" type="dot" />
      <Status status="refunded" type="inline" timestamp="18 Sep, 14:02" />
    </div>
  );
}

function ToastDemo() {
  const [open, setOpen] = useState(true);

  return open ? (
    <div className="mx-auto w-fit">
      <Toast
        tone="success"
        title="Transfer successful"
        description="Rp500,000 to Andi Pratama"
        actionLabel="Undo"
        onAction={() => setOpen(false)}
        onClose={() => setOpen(false)}
      />
    </div>
  ) : (
    <div className="mx-auto w-fit">
      <Button variant="ghost" onClick={() => setOpen(true)}>Show the toast again</Button>
    </div>
  );
}

function CommentDemo() {
  const [resolved, setResolved] = useState(false);

  return (
    <div className="mx-auto w-full max-w-sm">
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
    </div>
  );
}

function ChangelogDemo() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Changelog
        type="added"
        version="v2.4.0"
        timestamp="18 Sep 2026"
        title="Scheduled transfers"
        description="Set up recurring monthly transfers right from the account page."
        actionLabel="View details"
        actionHref="#"
      />
      <Changelog type="fixed" version="v2.3.1" timestamp="2 Sep 2026" title="Fixed delayed balance updates" connector={false} />
    </div>
  );
}

function TabsDemo() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Tabs
        label="Transactions"
        items={[
          { id: "all", label: "All", value: "12", content: "All twelve transactions." },
          { id: "in", label: "Incoming", content: "Money received." },
          { id: "out", label: "Outgoing", content: "Money sent." },
        ]}
      />
    </div>
  );
}

function RatingDemo() {
  return (
    <div className="mx-auto flex flex-wrap items-center justify-center gap-6">
      <Rating score={4} value="4,5" />
      <Rating score={3} type="heart" showValue={false} />
      <Rating score={4} type="number" value="4,0" />
    </div>
  );
}

function StepperDemo() {
  const [step, setStep] = useState(1);
  const steps = [{ title: "Personal details" }, { title: "Documents" }, { title: "Verification" }];

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5">
      <Stepper steps={steps} current={step} />
      <div className="flex gap-3">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
        <Button disabled={step === steps.length - 1} onClick={() => setStep(step + 1)}>Next</Button>
      </div>
    </div>
  );
}

function DividerDemo() {
  return (
    <div className="mx-auto grid w-full max-w-xs gap-4">
      <p className="text-sm text-role-text-primary">Sign in with your email</p>
      <Divider label="or" />
      <p className="text-sm text-role-text-primary">Continue with your phone number</p>
    </div>
  );
}

function RadioGroupDemo() {
  const [term, setTerm] = useState("15");
  const options = [{ value: "10", label: "10 years" }, { value: "15", label: "15 years" }, { value: "20", label: "20 years" }];

  return (
    <div className="mx-auto w-fit">
      <RadioGroup label="Loan term" name="demo-loan" options={options} value={term} onChange={setTerm} error={term === "20" ? "Choose one term." : undefined} hint="Longer terms cost more in total." />
    </div>
  );
}

function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto flex w-fit flex-col items-center gap-4">
      {/* The panel as it looks when open, so Copy to Figma takes the drawer and not only its trigger. */}
      <DrawerPanel
        title="Filter transactions"
        description="Choose a date range and transaction type."
        footer={
          <>
            <Button variant="ghost">Cancel</Button>
            <Button>Save</Button>
          </>
        }
      >
        <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-role-border-input bg-role-bg-hover text-sm text-role-text-secondary">Drawer content</div>
      </DrawerPanel>
      <Button onClick={() => setOpen(true)}>Open the real drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filter transactions"
        description="Choose a date range and transaction type."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </>
        }
      >
        <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-role-border-input bg-role-bg-hover text-sm text-role-text-secondary">Drawer content</div>
      </Drawer>
    </div>
  );
}

function CardDemo() {
  return (
    <div className="mx-auto w-72">
      <Card type="media" label="KPR" title="Subsidized Home" description="Installments from Rp1.2M/month over a 20-year term." linkLabel="See more" href="#" />
    </div>
  );
}

function CoverDemo() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Cover size="sm" title="Natuna Digilab" description="Design System — Component Library" />
    </div>
  );
}

function ProgressBarDemo() {
  const [value, setValue] = useState(60);

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-4">
      <ProgressBar label="Uploading" value={value} tone={value === 100 ? "success" : "primary"} />
      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => setValue(Math.max(0, value - 20))}>Less</Button>
        <Button variant="ghost" onClick={() => setValue(Math.min(100, value + 20))}>More</Button>
      </div>
    </div>
  );
}

function SkeletonDemo() {
  return (
    <div className="mx-auto w-64" aria-busy="true">
      <Skeleton type="card" />
    </div>
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(1);

  return (
    <div className="mx-auto w-fit">
      <Pagination page={page} pageCount={10} onPageChange={setPage} />
    </div>
  );
}

function FileInputDemo() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <FileInput description="PNG, JPG maks. 5 MB" accept="image/png,image/jpeg" />
    </div>
  );
}

function TooltipDemo() {
  return (
    <div className="flex justify-center py-10">
      <Tooltip title="Effective interest rate" description="Calculated from the outstanding principal.">
        <Button variant="ghost">Interest rate</Button>
      </Tooltip>
    </div>
  );
}

function SearchDemo() {
  const [query, setQuery] = useState("");
  const [last, setLast] = useState("");

  return (
    <div className="mx-auto grid w-full max-w-sm gap-2">
      <SearchField label="Search transactions" placeholder="Search transactions" type="withButton" value={query} onValueChange={setQuery} onSearch={setLast} error={last && last.length < 3 ? "Enter at least 3 characters" : undefined} />
      {last.length >= 3 && <p className="text-sm text-role-text-secondary">Searching for “{last}”.</p>}
    </div>
  );
}

function AlertDemo() {
  const [open, setOpen] = useState(true);

  return open ? (
    <div className="mx-auto w-full max-w-md">
      <Alert tone="warning" title="Your session ends in 5 minutes" description="Save your changes to keep them." action={<a href="#" className="font-medium underline">Stay signed in</a>} onClose={() => setOpen(false)} />
    </div>
  ) : (
    <div className="mx-auto w-fit">
      <Button variant="ghost" onClick={() => setOpen(true)}>Show the alert again</Button>
    </div>
  );
}

function TextareaDemo() {
  const [note, setNote] = useState("");

  return (
    <div className="mx-auto w-full max-w-sm">
      <Textarea label="Approval notes" placeholder="Write a note…" maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} hint="Up to 500 characters" />
    </div>
  );
}

function ChipDemo() {
  const [filters, setFilters] = useState(["KPR", "10-year term", "Approved"]);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {filters.map((f) => (
        <Chip key={f} label={f} tone="primary" onRemove={() => setFilters(filters.filter((x) => x !== f))} />
      ))}
      {filters.length === 0 && <Button variant="ghost" onClick={() => setFilters(["KPR", "10-year term", "Approved"])}>Reset filters</Button>}
    </div>
  );
}

function SliderDemo() {
  return (
    <div className="mx-auto grid w-full max-w-xs gap-4">
      <Slider label="Term" min={1} max={30} defaultValue={15} format={rupiahYears} />
      <Slider mode="range" label="Credit limit" min={0} max={2000} step={50} defaultValue={[100, 1000]} format={rupiahShort} />
    </div>
  );
}

function SpinnerDemo() {
  return (
    <div className="flex justify-center">
      <Button loading>Processing</Button>
    </div>
  );
}

function OtpInputDemo() {
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "wrong">("idle");

  return (
    <div className="mx-auto grid w-fit gap-2">
      <OtpInput
        label="Verification code"
        value={code}
        onChange={(v) => {
          setCode(v);
          setState("idle");
        }}
        onComplete={(v) => setState(v === "482719" ? "ok" : "wrong")}
        hint={state === "ok" ? "Verified." : "Try 482719. Resend code in 00:45"}
        error={state === "wrong" ? "Incorrect OTP. 2 attempts left." : undefined}
      />
    </div>
  );
}

function PinInputDemo() {
  const [pin, setPin] = useState("");
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <div className="mx-auto flex w-fit flex-col items-center gap-4">
      <PinInput label="Enter transaction PIN" value={pin} onChange={setPin} hint="Never share your PIN with anyone" />
      <div className="grid grid-cols-3 gap-2 rounded-lg border border-role-border-default p-2">
        {keys.map((k, i) =>
          k ? (
            <button
              key={i}
              type="button"
              aria-label={k === "⌫" ? "Delete" : k}
              onClick={() => setPin(k === "⌫" ? pin.slice(0, -1) : (pin + k).slice(0, 6))}
              className="flex h-12 w-16 items-center justify-center rounded-md bg-role-bg-subtle text-lg text-role-text-primary hover:bg-role-bg-subtle-hover"
            >
              {k}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
    </div>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <Button variant="destructive" onClick={() => setOpen(true)}>Remove saved account</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Remove saved account?"
        description="“Andi Pratama” will be removed from your saved accounts."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>Remove</Button>
          </>
        }
      />
    </div>
  );
}

function TableDemo() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <Table caption="Recent transfers" showCaption type="striped" columns={TX_COLUMNS} rows={TX_ROWS} />
    </div>
  );
}

function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 8, 18));

  return (
    <div className="mx-auto grid w-full max-w-xs gap-2 pb-80">
      <DatePicker label="Due date" today={TODAY} value={date} onChange={setDate} hint="Format DD MMM YYYY" />
    </div>
  );
}

function ComboboxDemo() {
  const [bank, setBank] = useState<string | null>(null);

  return (
    <div className="mx-auto grid w-full max-w-xs gap-2 pb-64">
      <Combobox label="Destination bank" placeholder="Search banks…" options={BANKS} value={bank} onChange={setBank} hint="Type at least 3 characters" />
    </div>
  );
}

function MenuDemo() {
  const [last, setLast] = useState("");
  const items = MENU_ITEMS.map((it) => ({ ...it, onSelect: () => setLast(it.label) }));

  return (
    <div className="flex flex-col items-center gap-2 pb-72">
      <Menu label="More actions" trigger={<DotsThree size={24} weight="bold" />} items={items} />
      <p className="text-sm text-role-text-secondary" aria-live="polite">{last ? "Chose " + last + "." : "Open the menu."}</p>
    </div>
  );
}

function EmptyStateDemo() {
  return (
    <EmptyState scope="error" title="Couldn’t load transactions" description="Check your connection and try again." action={<Button variant="secondary">Try again</Button>} />
  );
}

function NavigationBarDemo() {
  const [current, setCurrent] = useState("#home");
  const items = NAV_ITEMS.map((n) => ({ ...n }));

  return (
    <div
      className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-role-border-default"
      onClick={(e) => {
        const a = (e.target as HTMLElement).closest("a");
        if (a?.getAttribute("href")?.startsWith("#")) {
          e.preventDefault();
          setCurrent(a.getAttribute("href")!);
        }
      }}
    >
      <TopAppBar title="Transaction History" onBack={() => {}} />
      <div className="flex h-24 items-center justify-center bg-role-bg-hover text-sm text-role-text-secondary">{items.find((i) => i.href === current)?.label}</div>
      <BottomNav items={items} current={current} />
    </div>
  );
}

function TransactionListItemDemo() {
  return (
    <div className="mx-auto w-full max-w-sm divide-y divide-role-border-default overflow-hidden rounded-lg border border-role-border-default">
      <TransactionListItem href="#" tone="success" icon={<ArrowDownLeft size={16} />} title="Transfer from Andi" label="Transfer" timestamp="18 Sep, 14:02" amount="Rp500.000" />
      <TransactionListItem href="#" tone="danger" icon={<ArrowUpRight size={16} />} title="QRIS Kopi Natuna" label="Shopping" timestamp="18 Sep, 14:02" amount="Rp35.000" />
    </div>
  );
}

function AmountInputDemo() {
  const [amount, setAmount] = useState<number | null>(150000);
  const low = amount !== null && amount < 10000;

  return (
    <div className="mx-auto w-full max-w-xs">
      <AmountInput label="Amount" value={amount} onChange={setAmount} hint="Minimum Rp10.000" error={low ? "Minimum Rp10.000" : undefined} />
    </div>
  );
}

function QrCodeDemo() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      <QrCodeDisplay type="dynamic" size="sm" label="Warung Natuna" value="Rp150.000" expiry="Valid for 04:59" onSave={() => setSaved(true)} />
      <p className="text-sm text-role-text-secondary" aria-live="polite">{saved ? "Saved to your gallery." : ""}</p>
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
  "button-group": ButtonGroupDemo,
  "dropdown-menu": DropdownMenuDemo,
  "icon-button": IconButtonDemo,
  link: LinkDemo,
  select: SelectDemo,
  headline: HeadlineDemo,
  "code-block": CodeBlockDemo,
  button: ButtonDemo,
  badge: BadgeDemo,
  input: InputDemo,
  checkbox: CheckboxDemo,
  "radio-button": RadioDemo,
  "label-text": LabelTextDemo,
  tooltip: TooltipDemo,
  search: SearchDemo,
  alert: AlertDemo,
  textarea: TextareaDemo,
  chip: ChipDemo,
  slider: SliderDemo,
  spinner: SpinnerDemo,
  "otp-input": OtpInputDemo,
  "pin-input": PinInputDemo,
  modal: ModalDemo,
  table: TableDemo,
  "date-picker": DatePickerDemo,
  combobox: ComboboxDemo,
  "more-menu": MenuDemo,
  "empty-state": EmptyStateDemo,
  "navigation-bar": NavigationBarDemo,
  "transaction-list-item": TransactionListItemDemo,
  "amount-input": AmountInputDemo,
  "qr-code": QrCodeDemo,
  tabs: TabsDemo,
  rating: RatingDemo,
  stepper: StepperDemo,
  divider: DividerDemo,
  "radio-group": RadioGroupDemo,
  drawer: DrawerDemo,
  card: CardDemo,
  cover: CoverDemo,
  "progress-bar": ProgressBarDemo,
  skeleton: SkeletonDemo,
  pagination: PaginationDemo,
  "file-input": FileInputDemo,
  toggle: ToggleDemo,
  separator: SeparatorDemo,
  breadcrumbs: BreadcrumbsDemo,
  status: StatusDemo,
  toast: ToastDemo,
  comment: CommentDemo,
  changelog: ChangelogDemo,
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
    <figure className={`flex min-w-0 flex-col gap-3 rounded-lg border border-gray-200 bg-surface p-4 ${className}`}>
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
          secondary, <code className={code}>gray-50</code> for ghost, <code className={code}>danger-hover</code> for destructive, <code className={code}>inverse-raised</code> for inverse.
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

const badgeTones: BadgeTone[] = ["neutral", "primary", "secondary", "success", "warning", "danger"];
const badgeTypes: BadgeType[] = ["solid", "subtle", "outline"];

function BadgeMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {badgeTypes.map((type) => (
        <Specimen key={type} label={`type ${type}`} detail="sm and md">
          <div className="grid gap-2">
            {(["sm", "md"] as const).map((size) => (
              <div key={size} className="flex flex-wrap items-center gap-2">
                {badgeTones.map((tone) => (
                  <Badge key={tone} type={type} tone={tone} size={size}>{capitalize(tone)}</Badge>
                ))}
              </div>
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function RadioDemo() {
  const [term, setTerm] = useState("15");

  return (
    <div className="mx-auto grid w-fit gap-3" role="radiogroup" aria-label="Loan term">
      {["10", "15"].map((years) => (
        <RadioButton
          key={years}
          size="md"
          name="demo-term"
          value={years}
          label={`${years} years`}
          checked={term === years}
          onChange={() => setTerm(years)}
        />
      ))}
    </div>
  );
}

const radioSizes: { size: RadioButtonSize; px: string }[] = [
  { size: "sm", px: "16px" },
  { size: "md", px: "20px" },
  { size: "lg", px: "24px" },
];

function RadioMatrix() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {radioSizes.map((r) => (
          <Specimen key={r.size} label={`size ${r.size}`} detail={r.px}>
            <div className="grid gap-3">
              <RadioButton size={r.size} name={`matrix-${r.size}`} label="Unselected" />
              <RadioButton size={r.size} name={`matrix-${r.size}`} label="Selected" defaultChecked />
            </div>
          </Specimen>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Specimen label="Error" detail="error replaces hint">
          <div className="grid gap-3">
            <RadioButton size="md" name="matrix-error" label="15-year term" error="Choose a term." />
            <RadioButton size="md" name="matrix-error" label="15-year term" defaultChecked error="Choose a term." />
          </div>
        </Specimen>
        <Specimen label="Disabled" detail="native disabled">
          <div className="grid gap-3">
            <RadioButton size="md" name="matrix-disabled" label="Disabled" disabled />
            <RadioButton size="md" name="matrix-disabled" label="Disabled, selected" disabled defaultChecked />
          </div>
        </Specimen>
      </div>
    </div>
  );
}

function LabelTextDemo() {
  return (
    <div className="mx-auto grid w-full max-w-xs gap-1.5">
      <LabelText htmlFor="demo-label-name" indicator="required">Full name</LabelText>
      <input id="demo-label-name" required className="min-h-11 rounded-md border border-role-border-input bg-role-bg-surface px-3 text-sm text-role-text-primary" />
    </div>
  );
}

function LabelTextMatrix() {
  const indicators: LabelTextIndicator[] = ["none", "required", "optional"];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {indicators.map((indicator) => (
        <Specimen key={indicator} label={`indicator ${indicator}`} detail="sm, md, lg">
          <div className="grid gap-2">
            {(["sm", "md", "lg"] as const).map((size) => (
              <div key={size}><LabelText size={size} indicator={indicator}>Full name</LabelText></div>
            ))}
          </div>
        </Specimen>
      ))}
      <Specimen label="Error" detail="error">
        <div><LabelText indicator="required" error>Phone number</LabelText></div>
      </Specimen>
      <Specimen label="Disabled" detail="disabled">
        <div><LabelText disabled>Cannot be changed</LabelText></div>
      </Specimen>
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

const checkboxSizes: { size: CheckboxSize; px: string }[] = [
  { size: "sm", px: "16px" },
  { size: "md", px: "20px" },
  { size: "lg", px: "24px" },
];

function CheckboxMatrix() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {checkboxSizes.map((c) => (
          <Specimen key={c.size} label={`size ${c.size}`} detail={c.px}>
            <div className="grid gap-3">
              <Checkbox size={c.size} label="Unchecked" />
              <Checkbox size={c.size} label="Checked" defaultChecked />
              <Checkbox size={c.size} label="Indeterminate" indeterminate />
            </div>
          </Specimen>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Specimen label="Error" detail="error replaces hint">
          <Checkbox size="md" label="I agree to the terms" hint="Required." error="Accept the terms to continue." />
        </Specimen>
        <Specimen label="Disabled" detail="native disabled">
          <div className="grid gap-3">
            <Checkbox size="md" label="Disabled" disabled />
            <Checkbox size="md" label="Disabled, checked" disabled defaultChecked />
          </div>
        </Specimen>
      </div>
    </div>
  );
}

const toggleSizes = [
  { size: "sm", px: "28 x 16" },
  { size: "md", px: "36 x 20" },
  { size: "lg", px: "44 x 24" },
] as const;

function ToggleMatrix() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {toggleSizes.map((t) => (
          <Specimen key={t.size} label={`size ${t.size}`} detail={t.px}>
            <div className="grid gap-3">
              <Toggle size={t.size} label="Off" />
              <Toggle size={t.size} label="On" defaultChecked />
            </div>
          </Specimen>
        ))}
      </div>
      <Specimen label="Disabled" detail="native disabled. There is no error state.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle size="md" label="Off, disabled" disabled />
          <Toggle size="md" label="On, disabled" disabled defaultChecked />
        </div>
      </Specimen>
    </div>
  );
}

function SeparatorMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(["subtle", "default", "strong"] as const).map((weight) => (
        <Specimen key={weight} label={`weight ${weight}`}>
          <div className="grid gap-4">
            <Separator weight={weight} />
            <Separator weight={weight} label="or" />
            <div className="flex h-10 items-center gap-3 text-sm text-role-text-primary">
              Left
              <Separator weight={weight} orientation="vertical" />
              Right
            </div>
          </div>
        </Specimen>
      ))}
    </div>
  );
}

const crumbs = [{ label: "Home", href: "#" }, { label: "Product", href: "#" }, { label: "KPR Digital", href: "#" }, { label: "Simulation", href: "#" }, { label: "Detail" }];

function BreadcrumbsMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["sm", "md"] as const).map((size) => (
        <Specimen key={size} label={`size ${size}`}>
          <div className="grid gap-3">
            <Breadcrumbs size={size} items={crumbs.slice(0, 2).map((c, i) => (i === 1 ? { label: c.label } : c))} />
            <Breadcrumbs size={size} items={crumbs.slice(0, 3).map((c, i) => (i === 2 ? { label: c.label } : c))} />
            <Breadcrumbs size={size} items={crumbs} />
            <Breadcrumbs size={size} items={crumbs} maxItems={4} />
            <Breadcrumbs size={size} separator="slash" items={crumbs.slice(0, 3).map((c, i) => (i === 2 ? { label: c.label } : c))} />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

const statusValues = ["pending", "processing", "success", "failed", "expired", "refunded"] as const;

function StatusMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {(["pill", "inline", "dot"] as const).map((type) => (
        <Specimen key={type} label={`type ${type}`} detail="sm and md">
          <div className="grid gap-2">
            {(["sm", "md"] as const).map((size) => (
              <div key={size} className="grid gap-2">
                {statusValues.map((status) => (
                  <div key={status}>
                    <Status status={status} type={type} size={size} timestamp="18 Sep, 14:02" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function ToastMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {(["solid", "subtle"] as const).map((type) => (
        <Specimen key={type} label={`type ${type}`} detail="four tones">
          <div className="grid gap-3">
            {(["info", "success", "warning", "danger"] as const).map((tone) => (
              <Toast key={tone} type={type} tone={tone} title="Transfer successful" description="Rp500,000 to Andi Pratama" actionLabel="Undo" onAction={() => {}} onClose={() => {}} />
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function CommentMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {(["thread", "annotation"] as const).map((type) => (
        <Specimen key={type} label={`type ${type}`} detail="default, highlight, resolved">
          <div className="grid gap-3">
            {(["default", "highlight", "resolved"] as const).map((state) => (
              <Comment key={state} type={type} state={state} author="Rahadian" role="Approver" timestamp="2 hours ago" onReply={() => {}} onToggleResolved={() => {}}>
                Payslip documents check out. Moving on to collateral verification.
              </Comment>
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

const changelogTypes = ["added", "improved", "fixed", "deprecated"] as const;

function ChangelogMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {(["product", "system"] as const).map((scope) => (
        <Specimen key={scope} label={`scope ${scope}`} detail="four types">
          <div>
            {changelogTypes.map((type, i) => (
              <Changelog
                key={type}
                scope={scope}
                type={type}
                version="v2.4.0"
                timestamp="18 Sep 2026"
                title="Scheduled transfers"
                description="Set up recurring monthly transfers right from the account page."
                actionLabel="View details"
                actionHref="#"
                affects={["Button", "Input Field"]}
                connector={i < changelogTypes.length - 1}
              />
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

const tabItems = [{ id: "all", label: "All", value: "12" }, { id: "in", label: "Incoming" }, { id: "out", label: "Outgoing", disabled: true }];

function TabsMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {(["underline", "pill", "segmented"] as const).map((type) => (
        <Specimen key={type} label={"type " + type} detail="sm, md, lg. The last tab is disabled.">
          <div className="grid gap-4 overflow-x-auto">
            {(["sm", "md", "lg"] as const).map((size) => (
              <Tabs key={size} label={type + " " + size} type={type} size={size} items={tabItems} />
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function RatingMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(["star", "heart", "number"] as const).map((type) => (
        <Specimen key={type} label={"type " + type} detail="default and disabled">
          <div className="grid gap-2">
            {([1, 2, 3, 4, 5] as const).map((score) => (
              <Rating key={score} type={type} score={score} value="4,5" />
            ))}
            <Rating type={type} score={3} value="4,5" disabled />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

const stepSet = [{ title: "Personal details" }, { title: "Documents", description: "Upload your ID card and payslips." }, { title: "Verification" }, { title: "Confirm" }];

function StepperMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Specimen label="type horizontal" detail="3, 4 steps">
        <div className="grid gap-6 overflow-x-auto">
          <Stepper current={1} steps={stepSet.slice(0, 3)} />
          <Stepper current={1} steps={stepSet} />
        </div>
      </Specimen>
      <Specimen label="type vertical" detail="active, and error">
        <div className="grid gap-6">
          <Stepper type="vertical" current={1} steps={stepSet.slice(0, 3)} />
          <Stepper type="vertical" current={1} errorAt={1} steps={[{ title: "Documents" }, { title: "Face verification", description: "Photo is unclear. Please retake it." }, { title: "Confirm" }]} />
        </div>
      </Specimen>
    </div>
  );
}

function DividerMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["sm", "md"] as const).map((size) => (
        <Specimen key={size} label={"size " + size} detail="line, label, icon">
          <div className="grid gap-4">
            <Divider size={size} />
            <Divider size={size} label="or" />
            <Divider size={size} icon={<span className="size-1 rounded-full bg-role-text-secondary" />} />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

const loanOptions = [{ value: "10", label: "10 years" }, { value: "15", label: "15 years" }, { value: "20", label: "20 years" }];

function RadioGroupMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(["default", "error", "disabled"] as const).map((state) => (
        <Specimen key={state} label={"state " + state} detail="vertical, then horizontal">
          <div className="grid gap-5">
            {(["vertical", "horizontal"] as const).map((orientation) => (
              <RadioGroup
                key={orientation}
                label="Loan term"
                name={"matrix-rg-" + state + orientation}
                orientation={orientation}
                options={loanOptions}
                defaultValue="15"
                disabled={state === "disabled"}
                error={state === "error" ? "Choose one term." : undefined}
              />
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function DrawerMatrix() {
  const footer = (
    <>
      <Button variant="ghost">Cancel</Button>
      <Button>Save</Button>
    </>
  );
  const body = <div className="flex h-20 items-center justify-center rounded-md border border-dashed border-role-border-input bg-role-bg-hover text-xs text-role-text-secondary">Drawer content</div>;
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700">These are the panel on its own. The Drawer adds the scrim, the focus trap, and Escape.</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {(["right", "left", "bottom", "top"] as const).map((side) => (
          <Specimen key={side} label={"side " + side} detail="size sm">
            <DrawerPanel side={side} size="sm" title="Filter transactions" description="Choose a date range and transaction type." onClose={() => {}} footer={footer}>
              {body}
            </DrawerPanel>
          </Specimen>
        ))}
        <Specimen label="size md and lg" detail="400 and 720 wide, shrinking to fit" className="lg:col-span-2">
          <div className="grid gap-4">
            <DrawerPanel size="md" title="Filter transactions" onClose={() => {}} footer={footer}>{body}</DrawerPanel>
            <DrawerPanel size="lg" title="Filter transactions" onClose={() => {}} footer={footer}>{body}</DrawerPanel>
          </div>
        </Specimen>
      </div>
    </div>
  );
}

function CardMatrix() {
  const actions = (
    <>
      <Button variant="ghost">Skip</Button>
      <Button>Apply</Button>
    </>
  );
  return (
    <div className="space-y-4">
      {(["default", "interactive", "disabled"] as const).map((state) => (
        <Specimen key={state} label={"state " + state} detail={state === "interactive" ? "hover for the shadow, press for the fill" : undefined}>
          <div className="grid gap-4 sm:grid-cols-3">
            {(["basic", "media", "action"] as const).map((type) => (
              <Card
                key={type}
                type={type}
                label="KPR"
                title="Subsidized Home"
                description="Installments from Rp1.2M/month over a 20-year term."
                linkLabel="See more"
                href="#"
                actions={actions}
                interactive={state === "interactive"}
                disabled={state === "disabled"}
              />
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function CoverMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {(["gradient", "solid", "image"] as const).map((type) => (
        <Specimen key={type} label={"type " + type} detail="sm, md, lg">
          <div className="grid gap-3">
            {(["sm", "md", "lg"] as const).map((size) => (
              <Cover key={size} type={type} size={size} title="Natuna Digilab" description="Design System — Component Library" />
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

const progressTones = ["primary", "success", "warning", "danger"] as const;

function ProgressBarMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {progressTones.map((tone) => (
        <Specimen key={tone} label={"tone " + tone}>
          <div className="grid gap-4">
            <ProgressBar label="Uploading" tone={tone} value={60} />
            <ProgressBar label="Uploading" tone={tone} mode="indeterminate" showValue={false} />
            <div className="flex gap-4">
              <ProgressBar type="circular" label="Uploading" tone={tone} value={60} />
              <ProgressBar type="circular" label="Uploading" tone={tone} mode="indeterminate" />
            </div>
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function SkeletonMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(["static", "pulse", "wave"] as const).map((animation) => (
        <Specimen key={animation} label={"animation " + animation}>
          <div className="grid gap-4">
            <Skeleton type="text" animation={animation} />
            <Skeleton type="title" animation={animation} />
            <Skeleton type="avatar" animation={animation} />
            <Skeleton type="image" animation={animation} />
            <Skeleton type="card" animation={animation} />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function PaginationMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["sm", "md"] as const).map((size) => (
        <Specimen key={size} label={"size " + size}>
          <div className="grid gap-4 overflow-x-auto">
            <Pagination size={size} page={1} pageCount={10} onPageChange={() => {}} />
            <Pagination size={size} page={5} pageCount={10} onPageChange={() => {}} />
            <Pagination size={size} type="arrow" page={2} pageCount={10} onPageChange={() => {}} />
            <Pagination size={size} type="loadMore" page={1} pageCount={10} onPageChange={() => {}} />
            <Pagination size={size} type="loadMore" page={10} pageCount={10} onPageChange={() => {}} />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function FileInputMatrix() {
  const states: { label: string; props: Partial<React.ComponentProps<typeof FileInput>> }[] = [
    { label: "Default", props: {} },
    { label: "Dragging", props: { dragging: true } },
    { label: "Uploading", props: { progress: 60 } },
    { label: "Error", props: { error: "File exceeds 5 MB" } },
    { label: "Disabled", props: { disabled: true } },
  ];
  return (
    <div className="space-y-4">
      {(["dropzone", "button", "inline"] as const).map((type) => (
        <Specimen key={type} label={"type " + type}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {states.map((s) => (
              <div key={s.label} className="grid gap-1">
                <span className="text-xs text-gray-700">{s.label}</span>
                <FileInput type={type} description="PNG, JPG maks. 5 MB" {...s.props} />
              </div>
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

const tooltipPlacements = ["top", "bottom", "left", "right"] as const;

function TooltipMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tooltipPlacements.map((p) => (
        <Specimen key={p} label={"placement " + p} detail="sm, md, and without arrow">
          <div className="flex flex-wrap items-start gap-4 p-2">
            <TooltipBubble size="sm" placement={p} title="Effective interest rate" description="Calculated from the outstanding principal." />
            <TooltipBubble placement={p} title="Effective interest rate" description="Calculated from the outstanding principal." />
            <TooltipBubble placement={p} arrow={false} title="Copy account number" />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function SearchMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {(["basic", "withButton", "inline"] as const).map((type) => (
        <Specimen key={type} label={"type " + type} detail="default, filled, error, disabled">
          <div className="grid gap-3">
            <SearchField type={type} label="Search transactions" placeholder="Search transactions" />
            <SearchField type={type} label="Search transactions" placeholder="Search transactions" defaultValue="bank transfer" />
            <SearchField type={type} label="Search transactions" placeholder="Search transactions" error="Enter at least 3 characters" />
            <SearchField type={type} label="Search transactions" placeholder="Search transactions" disabled />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function AlertMatrix() {
  return (
    <div className="grid gap-3">
      {(["info", "success", "warning", "danger"] as const).map((tone) => (
        <Alert key={tone} tone={tone} title={tone[0].toUpperCase() + tone.slice(1) + " alert"} description="Stays on the page until the problem is gone." action={<a href="#" className="font-medium underline">Learn more</a>} onClose={() => {}} />
      ))}
    </div>
  );
}

function TextareaMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Specimen key={size} label={"size " + size} detail={{ sm: "64", md: "88", lg: "120" }[size] + "px tall"}>
          <div className="grid gap-4">
            <Textarea size={size} label="Approval notes" placeholder="Write a note…" maxLength={500} />
            <Textarea size={size} label="Approval notes" defaultValue="Documents have been verified." maxLength={500} />
            <Textarea size={size} label="Approval notes" placeholder="Write a note…" error="A note is required" maxLength={500} />
            <Textarea size={size} label="Approval notes" placeholder="Write a note…" disabled maxLength={500} />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

const chipTones = ["neutral", "primary", "success", "warning", "danger"] as const;

function ChipMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {(["filled", "outline"] as const).map((type) => (
        <Specimen key={type} label={"type " + type} detail="sm and md">
          <div className="grid gap-3">
            {(["sm", "md"] as const).map((size) => (
              <div key={size} className="flex flex-wrap items-center gap-2">
                {chipTones.map((tone) => (
                  <Chip key={tone} type={type} size={size} tone={tone} label={tone[0].toUpperCase() + tone.slice(1)} onRemove={() => {}} />
                ))}
              </div>
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function SliderMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Specimen key={size} label={"size " + size} detail="single, range, disabled">
          <div className="grid gap-3">
            <Slider size={size} label="Term" min={1} max={30} defaultValue={15} format={rupiahYears} />
            <Slider size={size} mode="range" label="Credit limit" min={0} max={2000} step={50} defaultValue={[100, 1000]} format={rupiahShort} />
            <Slider size={size} label="Term" min={1} max={30} defaultValue={15} format={rupiahYears} disabled />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function SpinnerMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["circular", "dots"] as const).map((type) => (
        <Specimen key={type} label={"type " + type} detail="neutral, primary, on-primary · xs to lg">
          <div className="grid gap-3">
            {(["neutral", "primary", "onPrimary"] as const).map((tone) => (
              <div key={tone} className={"flex items-center gap-4 rounded-md p-2 " + (tone === "onPrimary" ? "bg-role-bg-brand" : "")}>
                {(["xs", "sm", "md", "lg"] as const).map((size) => (
                  <Spinner key={size} type={type} tone={tone} size={size} />
                ))}
              </div>
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function OtpInputMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Specimen key={size} label={"size " + size} detail="empty, filled, error, disabled">
          <div className="grid gap-4 overflow-x-auto">
            <OtpInput size={size} length={4} label="Code" />
            <OtpInput size={size} length={4} label="Code" value="4827" />
            <OtpInput size={size} length={4} label="Code" value="4827" error="Incorrect OTP. 2 attempts left." />
            <OtpInput size={size} length={4} label="Code" disabled />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function PinInputMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {([4, 6] as const).map((length) => (
        <Specimen key={length} label={length + " digit"} detail="empty, filled, error, disabled">
          <div className="grid gap-5">
            <PinInput length={length} label="Enter transaction PIN" hint="Never share your PIN with anyone" />
            <PinInput length={length} label="Enter transaction PIN" value="48" hint="Never share your PIN with anyone" />
            <PinInput length={length} label="Enter transaction PIN" value={"4827".slice(0, length) + "19".slice(0, length - 4)} error="Incorrect PIN. 2 attempts left." />
            <PinInput length={length} label="Enter transaction PIN" disabled hint="Never share your PIN with anyone" />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function ModalMatrix() {
  const confirm = (
    <>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">Remove</Button>
    </>
  );
  const save = (
    <>
      <Button variant="ghost">Cancel</Button>
      <Button>Save</Button>
    </>
  );
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700">These are the dialog box on its own. Modal adds the backdrop, the focus trap, and Escape.</p>
      <div className="grid gap-4 lg:grid-cols-3">
        {(["confirmation", "form", "alert"] as const).map((type) => (
          <Specimen key={type} label={"type " + type} detail="size sm">
            <ModalPanel type={type} size="sm" title="Remove saved account?" description="“Andi Pratama” will be removed from your saved accounts." onClose={() => {}} footer={type === "form" ? save : confirm}>
              {type === "form" ? <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-role-border-input bg-role-bg-hover text-xs text-role-text-secondary">Form content</div> : null}
            </ModalPanel>
          </Specimen>
        ))}
      </div>
      <Specimen label="size md, lg, xl" detail="560, 720, 960 wide, never wider than the screen">
        <div className="grid gap-4 overflow-x-auto">
          {(["md", "lg", "xl"] as const).map((size) => (
            <ModalPanel key={size} size={size} title="Remove saved account?" description="“Andi Pratama” will be removed from your saved accounts." onClose={() => {}} footer={confirm} />
          ))}
        </div>
      </Specimen>
    </div>
  );
}

function TableMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {(["basic", "striped", "bordered"] as const).map((type) => (
        <Specimen key={type} label={"type " + type} detail="sm, md, lg">
          <div className="grid gap-4">
            {(["sm", "md", "lg"] as const).map((size) => (
              <Table key={size} caption={type + " table, " + size} type={type} size={size} columns={TX_COLUMNS} rows={TX_ROWS} selectedRow={size === "md" ? 1 : undefined} />
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function DatePickerMatrix() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Specimen label="Calendar single" detail="13 Sep is today, 18 Sep is picked">
          <Calendar today={TODAY} value={new Date(2026, 8, 18)} />
        </Specimen>
        <Specimen label="Calendar range" detail="18 to 24 Sep">
          <Calendar mode="range" today={TODAY} value={[new Date(2026, 8, 18), new Date(2026, 8, 24)]} />
        </Specimen>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Specimen label="Default"><DatePicker label="Date" today={TODAY} /></Specimen>
        <Specimen label="Filled"><DatePicker label="Date" today={TODAY} defaultValue={new Date(2026, 8, 18)} /></Specimen>
        <Specimen label="Range filled"><DatePicker mode="range" label="Date" today={TODAY} defaultValue={[new Date(2026, 8, 18), new Date(2026, 8, 24)]} /></Specimen>
        <Specimen label="Error"><DatePicker label="Date" today={TODAY} error="Choose a date" /></Specimen>
        <Specimen label="Disabled"><DatePicker label="Date" today={TODAY} disabled /></Specimen>
      </div>
    </div>
  );
}

function ComboboxMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["single", "multiple"] as const).map((mode) => (
        <Specimen key={mode} label={"mode " + mode} detail="default, error, disabled">
          <div className="grid gap-4">
            {mode === "single" ? (
              <>
                <Combobox label="Destination bank" placeholder="Search banks…" options={BANKS} />
                <Combobox label="Destination bank" placeholder="Search banks…" options={BANKS} error="Choose a bank" />
                <Combobox label="Destination bank" placeholder="Search banks…" options={BANKS} disabled />
              </>
            ) : (
              <>
                <Combobox mode="multiple" label="Destination bank" placeholder="Search banks…" options={BANKS} value={["bri", "bsi"]} />
                <Combobox mode="multiple" label="Destination bank" placeholder="Search banks…" options={BANKS} value={["bri", "bsi"]} error="Choose at most two" />
                <Combobox mode="multiple" label="Destination bank" placeholder="Search banks…" options={BANKS} value={["bri", "bsi"]} disabled />
              </>
            )}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function MenuMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["sm", "md"] as const).map((size) => (
        <Specimen key={size} label={"size " + size} detail="default, disabled, danger, and a group divider">
          <MenuList size={size} items={MENU_ITEMS} />
        </Specimen>
      ))}
    </div>
  );
}

function EmptyStateMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {(["search", "list", "error", "custom"] as const).map((scope) => (
        <Specimen key={scope} label={"scope " + scope} detail="sm, md, lg">
          <div className="grid gap-2">
            {(["sm", "md", "lg"] as const).map((size) => (
              <EmptyState key={size} scope={scope} size={size} title="No transactions yet" description="Your transactions will appear here." action={<Button variant="secondary">Try again</Button>} />
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function NavigationBarMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Specimen label="type top" detail="with back and an action">
        <TopAppBar title="Transaction History" onBack={() => {}} actions={<button type="button" aria-label="More" className="flex size-11 items-center justify-center text-role-text-secondary"><DotsThree size={22} /></button>} />
      </Specimen>
      <Specimen label="type bottom" detail="active, a count, and a disabled item">
        <BottomNav items={NAV_ITEMS.map((n, i) => (i === 1 ? { ...n, disabled: true } : n))} current="#home" />
      </Specimen>
    </div>
  );
}

function TransactionListItemMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {(["neutral", "success", "danger"] as const).map((tone) => (
        <Specimen key={tone} label={"tone " + tone} detail="static, then a link you can hover and press">
          <div className="divide-y divide-role-border-default overflow-hidden rounded-md border border-role-border-default">
            <TransactionListItem tone={tone} title="Transfer to Andi Pratama" label="Transfer" timestamp="18 Sep, 14:02" amount="Rp150.000" />
            <TransactionListItem href="#" tone={tone} title="Transfer to Andi Pratama" label="Transfer" timestamp="18 Sep, 14:02" amount="Rp150.000" />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function AmountInputMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Specimen key={size} label={"size " + size} detail="empty, filled, error, disabled">
          <div className="grid gap-4">
            <AmountInput size={size} label="Amount" />
            <AmountInput size={size} label="Amount" defaultValue={150000} />
            <AmountInput size={size} label="Amount" defaultValue={5000} error="Minimum Rp10.000" />
            <AmountInput size={size} label="Amount" disabled />
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function QrCodeMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {(["static", "dynamic"] as const).map((type) => (
        <Specimen key={type} label={"type " + type} detail="sm, md, lg">
          <div className="flex flex-wrap items-start gap-4 overflow-x-auto">
            {(["sm", "md", "lg"] as const).map((size) => (
              <QrCodeDisplay key={size} type={type} size={size} label="Warung Natuna" value="Rp150.000" expiry="Valid for 04:59" onSave={() => {}} />
            ))}
          </div>
        </Specimen>
      ))}
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

const CITIES = [
  { value: "harbor", label: "Harbor" },
  { value: "meadow", label: "Meadow" },
  { value: "ridgeway", label: "Ridgeway" },
];
const VIEW_OPTIONS = [
  { value: "grid", label: "Grid", icon: <SquaresFour size={18} /> },
  { value: "list", label: "List", icon: <ListBullets size={18} /> },
];
const EXPORT_ITEMS = [
  { label: "CSV" },
  { label: "PDF" },
  { label: "Excel" },
];
const SAMPLE_CODE = `import { Button } from "@/ui";

export function PayButton() {
  return <Button size="lg">Pay Rp 412.500</Button>;
}`;

function ButtonGroupDemo() {
  const [view, setView] = useState("grid");

  return (
    <div className="flex flex-col items-center gap-3">
      <ButtonGroup label="View" value={view} onChange={setView} options={VIEW_OPTIONS} />
      <p className="text-sm text-role-text-secondary" aria-live="polite">Showing the {view} view.</p>
    </div>
  );
}

function DropdownMenuDemo() {
  const [format, setFormat] = useState("");
  const items = EXPORT_ITEMS.map((it) => ({ ...it, onSelect: () => setFormat(it.label) }));

  return (
    <div className="flex flex-col items-center gap-2 pb-48">
      <DropdownMenu label="Export" icon={<DownloadSimple size={18} />} items={items} />
      <p className="text-sm text-role-text-secondary" aria-live="polite">{format ? "Exporting as " + format + "." : "Choose a format."}</p>
    </div>
  );
}

function IconButtonDemo() {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex items-center justify-center gap-2">
      <Tooltip title="Edit">
        <IconButton label="Edit" icon={<PencilSimple size={18} />} />
      </Tooltip>
      <Tooltip title="Share">
        <IconButton label="Share" icon={<ShareNetwork size={18} />} />
      </Tooltip>
      <IconButton
        label="Favorite"
        aria-pressed={liked}
        onClick={() => setLiked(!liked)}
        icon={<Heart size={18} weight={liked ? "fill" : "regular"} />}
      />
    </div>
  );
}

function LinkDemo() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-start gap-2">
      <p className="text-base text-role-text-primary">
        Read the <TextLink href="#limits">transfer limits</TextLink> before you send.
      </p>
      <TextLink href="#history" standalone>See all transactions</TextLink>
      <TextLink href="https://natunadigilab.vercel.app" standalone external>Natuna Digilab</TextLink>
    </div>
  );
}

function SelectDemo() {
  const [city, setCity] = useState("");

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-3">
      <Select
        label="City"
        placeholder="Choose a city"
        hint="We deliver the card here."
        options={CITIES}
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <p className="text-sm text-role-text-secondary" aria-live="polite">{city ? "Chose " + city + "." : "Nothing chosen yet."}</p>
    </div>
  );
}

function HeadlineDemo() {
  // On a real page, leave out "as": the levels default to h1, h2 and h3.
  // Here the demo sits under the page's own headings, so it starts at h3.
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-2">
      <Headline as="h3">Transfer money</Headline>
      <Headline level="h2" as="h4">Recent recipients</Headline>
      <Headline level="subheader" as="h5">Saved accounts</Headline>
    </div>
  );
}

function CodeBlockDemo() {
  return <CodeBlock className="mx-auto max-w-lg" title="pay-button.tsx" language="TSX" showLineNumbers code={SAMPLE_CODE} />;
}

function ButtonGroupMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["md", "lg"] as const).map((size) => (
        <Specimen key={size} label={"size " + size} detail="text, icon and text, icon only">
          <div className="flex flex-col items-start gap-3">
            <ButtonGroup size={size} label="Period" defaultValue="month" options={[{ value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "year", label: "Year" }]} />
            <ButtonGroup size={size} label="View" options={VIEW_OPTIONS} />
            <ButtonGroup size={size} label="View" options={VIEW_OPTIONS.map((o) => ({ ...o, iconOnly: true }))} />
          </div>
        </Specimen>
      ))}
      <Specimen label="Disabled option" detail="one segment unavailable">
        <ButtonGroup label="Period" options={[{ value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "year", label: "Year", disabled: true }]} />
      </Specimen>
      <Specimen label="fullWidth" detail="equal segments">
        <ButtonGroup fullWidth label="Type" options={[{ value: "in", label: "Income" }, { value: "out", label: "Expense" }]} />
      </Specimen>
    </div>
  );
}

function DropdownMenuMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Specimen label="Trigger" detail="secondary, ghost, primary, inverse, with an icon">
        <div className="flex flex-wrap gap-2">
          {(["secondary", "ghost", "primary", "inverse"] as const).map((v) => (
            <DropdownMenu key={v} variant={v} label={capitalize(v)} items={EXPORT_ITEMS} />
          ))}
          <DropdownMenu label="Export" icon={<DownloadSimple size={18} />} items={EXPORT_ITEMS} />
        </div>
      </Specimen>
      {(["sm", "md"] as const).map((size) => (
        <Specimen key={size} label={"Open, size " + size} detail="default, disabled, danger, and a group divider">
          <MenuList size={size} items={MENU_ITEMS} />
        </Specimen>
      ))}
    </div>
  );
}

function IconButtonMatrix() {
  const variants = ["primary", "secondary", "ghost", "destructive", "inverse"] as const;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["md", "lg"] as const).map((size) => (
        <Specimen key={size} label={"size " + size} detail={size === "md" ? "44 × 44" : "48 × 48"}>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <IconButton key={v} size={size} variant={v} label={capitalize(v)} icon={<PencilSimple size={size === "md" ? 18 : 20} />} />
            ))}
          </div>
        </Specimen>
      ))}
      <Specimen label="shape circle" detail="every variant">
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <IconButton key={v} shape="circle" variant={v} label={capitalize(v)} icon={<Bell size={18} />} />
          ))}
        </div>
      </Specimen>
      <Specimen label="State" detail="loading, disabled">
        <div className="flex flex-wrap gap-2">
          <IconButton loading variant="primary" label="Saving" icon={<PencilSimple size={18} />} />
          <IconButton loading label="Saving" icon={<PencilSimple size={18} />} />
          <IconButton disabled label="Edit" icon={<PencilSimple size={18} />} />
          <IconButton disabled variant="primary" label="Edit" icon={<PencilSimple size={18} />} />
        </div>
      </Specimen>
    </div>
  );
}

function LinkMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["sm", "md"] as const).map((size) => (
        <Specimen key={size} label={"size " + size} detail="inline, standalone, external">
          <div className="flex flex-col items-start gap-1">
            <p className={`text-role-text-primary ${size === "sm" ? "text-sm" : "text-base"}`}>
              Read the <TextLink href="#limits" size={size}>transfer limits</TextLink> first.
            </p>
            <TextLink href="#history" size={size} standalone>See all transactions</TextLink>
            <TextLink href="#help" size={size} standalone external>Help center</TextLink>
          </div>
        </Specimen>
      ))}
    </div>
  );
}

function SelectMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["md", "lg"] as const).map((size) => (
        <Specimen key={size} label={"size " + size} detail="placeholder, chosen, hint">
          <div className="grid gap-4">
            <Select size={size} label="City" placeholder="Choose a city" options={CITIES} />
            <Select size={size} label="City" defaultValue="meadow" hint="We deliver the card here." options={CITIES} />
          </div>
        </Specimen>
      ))}
      <Specimen label="Error" detail="border, message, aria-invalid">
        <Select label="City" defaultValue="ridgeway" error="Delivery is not available in this city yet." options={CITIES} />
      </Specimen>
      <Specimen label="Disabled">
        <Select label="City" defaultValue="harbor" disabled options={CITIES} />
      </Specimen>
    </div>
  );
}

function HeadlineMatrix() {
  const levels = [
    { level: "h1", name: "Header 1", spec: "24/36 · 28/40 · 32/44, Bold" },
    { level: "h2", name: "Header 2", spec: "20/30 · 24/36 · 28/40, Bold" },
    { level: "subheader", name: "Subheader", spec: "18/26 · 20/30 · 24/36, SemiBold" },
  ] as const;
  return (
    <div className="grid gap-4">
      {levels.map((l) => (
        <Specimen key={l.level} label={"level " + l.level} detail={l.spec + " (mobile · tablet · website)"}>
          <Headline as="p" level={l.level}>{l.name}: Transfer money</Headline>
        </Specimen>
      ))}
    </div>
  );
}

function CodeBlockMatrix() {
  const short = 'import { Button } from "@/ui";';
  const long = 'const message = "A long line keeps going past the edge of the panel, so it scrolls, or wraps when wrap is set.";';
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Specimen label="Default" detail="header, copy">
        <CodeBlock language="TSX" code={short} />
      </Specimen>
      <Specimen label="showLineNumbers" detail="with a title">
        <CodeBlock title="pay-button.tsx" language="TSX" showLineNumbers code={SAMPLE_CODE} />
      </Specimen>
      <Specimen label="Long line" detail="scrolls; the region is focusable">
        <CodeBlock language="TS" code={long} />
      </Specimen>
      <Specimen label="wrap" detail="no copy button">
        <CodeBlock language="TS" wrap copyable={false} code={long} />
      </Specimen>
    </div>
  );
}

const matrices: Record<string, () => ReactElement> = {
  "button-group": ButtonGroupMatrix,
  "dropdown-menu": DropdownMenuMatrix,
  "icon-button": IconButtonMatrix,
  link: LinkMatrix,
  select: SelectMatrix,
  headline: HeadlineMatrix,
  "code-block": CodeBlockMatrix,
  button: ButtonMatrix,
  badge: BadgeMatrix,
  input: InputMatrix,
  checkbox: CheckboxMatrix,
  "radio-button": RadioMatrix,
  "label-text": LabelTextMatrix,
  tooltip: TooltipMatrix,
  search: SearchMatrix,
  alert: AlertMatrix,
  textarea: TextareaMatrix,
  chip: ChipMatrix,
  slider: SliderMatrix,
  spinner: SpinnerMatrix,
  "otp-input": OtpInputMatrix,
  "pin-input": PinInputMatrix,
  modal: ModalMatrix,
  table: TableMatrix,
  "date-picker": DatePickerMatrix,
  combobox: ComboboxMatrix,
  "more-menu": MenuMatrix,
  "empty-state": EmptyStateMatrix,
  "navigation-bar": NavigationBarMatrix,
  "transaction-list-item": TransactionListItemMatrix,
  "amount-input": AmountInputMatrix,
  "qr-code": QrCodeMatrix,
  tabs: TabsMatrix,
  rating: RatingMatrix,
  stepper: StepperMatrix,
  divider: DividerMatrix,
  "radio-group": RadioGroupMatrix,
  drawer: DrawerMatrix,
  card: CardMatrix,
  cover: CoverMatrix,
  "progress-bar": ProgressBarMatrix,
  skeleton: SkeletonMatrix,
  pagination: PaginationMatrix,
  "file-input": FileInputMatrix,
  toggle: ToggleMatrix,
  separator: SeparatorMatrix,
  breadcrumbs: BreadcrumbsMatrix,
  status: StatusMatrix,
  toast: ToastMatrix,
  comment: CommentMatrix,
  changelog: ChangelogMatrix,
  avatar: AvatarMatrix,
  accordion: AccordionMatrix,
};

export function StatesMatrix({ slug }: { slug: string }) {
  const M = matrices[slug];
  return M ? <M /> : null;
}
