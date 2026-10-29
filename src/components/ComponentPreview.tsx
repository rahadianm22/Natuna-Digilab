"use client";

import type { ReactElement } from "react";
import { Accordion, Alert, ButtonGroup, CodeBlock, DropdownMenu, Headline, IconButton, Select, TextLink, AmountInput, Avatar, Badge, BottomNav, Breadcrumbs, Button, Calendar, Card, Changelog, Checkbox, Chip, Combobox, Comment, Cover, DatePicker, Divider, DrawerPanel, EmptyState, FileInput, Input, LabelText, MenuList, ModalPanel, OtpInput, Pagination, PinInput, ProgressBar, QrCodeDisplay, RadioButton, RadioGroup, Rating, SearchField, Separator, Skeleton, Slider, Spinner, Status, Stepper, Table, Tabs, Textarea, Toast, Toggle, TooltipBubble, TopAppBar, TransactionListItem, buttonStyles } from "@/ui";
import { Bell, ListBullets, SquaresFour, ArrowDownLeft, ArrowUpRight, Check, CheckCircle, ClockCounterClockwise, Copy, Dot, DotsThree, DownloadSimple, House, Info, List, MagnifyingGlass, PencilSimple, Plus, QrCode, ShareNetwork, Star, Tag, Trash, Tray, UploadSimple, User, Wallet, Warning, X, XCircle } from "@phosphor-icons/react/ssr";

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
const CITIES = [
  { value: "harbor", label: "Harbor" },
  { value: "meadow", label: "Meadow" },
  { value: "ridgeway", label: "Ridgeway" },
];
const rupiahYears = (n: number) => n + " yrs";
const rupiahShort = (n: number) => (n >= 1000 ? "Rp" + n / 1000 + " M" : "Rp" + n + " jt");

const previews: Record<string, () => ReactElement> = {
  button: () => (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button loading>Saving</Button>
        <Button disabled>Disabled</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  ),
  "button-group": () => (
    <div className="flex flex-col items-center gap-4 py-6">
      <ButtonGroup label="View" defaultValue="grid" options={[{ value: "grid", label: "Grid", icon: <SquaresFour size={18} /> }, { value: "list", label: "List", icon: <ListBullets size={18} /> }]} />
      <ButtonGroup label="Period" defaultValue="month" options={[{ value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "year", label: "Year" }]} />
    </div>
  ),
  "dropdown-menu": () => (
    <div className="flex flex-col items-center gap-1 py-4">
      <DropdownMenu label="Actions" items={MENU_ITEMS} />
      <MenuList items={MENU_ITEMS} />
    </div>
  ),
  "icon-button": () => (
    <div className="flex flex-wrap items-center justify-center gap-3 py-6">
      <IconButton label="Add" icon={<Plus size={18} />} variant="primary" />
      <IconButton label="Edit" icon={<PencilSimple size={18} />} />
      <IconButton label="Download" icon={<DownloadSimple size={18} />} variant="secondary" />
      <IconButton label="Delete" icon={<Trash size={18} />} variant="destructive" />
      <IconButton label="Notifications" icon={<Bell size={20} />} shape="circle" size="lg" />
    </div>
  ),
  link: () => (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-2 py-6 text-center">
      <p className="text-sm text-role-text-secondary">
        Read the <TextLink href="#" size="sm">transfer limits</TextLink> before you send.
      </p>
      <TextLink href="#" standalone>See all transactions</TextLink>
      <TextLink href="#" standalone external size="sm">Help center</TextLink>
    </div>
  ),
  "more-menu": () => (
    <div className="flex justify-center py-4">
      <MenuList items={MENU_ITEMS} />
    </div>
  ),
  avatar: () => (
    <div className="flex items-end justify-center gap-3 py-6">
      <Avatar name="Natuna Digilab" size="sm" />
      <Avatar name="Natuna Digilab" />
      <Avatar name="Natuna Digilab" size="lg" />
    </div>
  ),
  badge: () => (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="flex flex-wrap justify-center gap-2">
        <Badge type="solid" tone="primary">Primary</Badge>
        <Badge type="solid" tone="success">Success</Badge>
        <Badge type="solid" tone="warning">Warning</Badge>
        <Badge type="solid" tone="danger">Danger</Badge>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Badge tone="primary">Primary</Badge>
        <Badge tone="success">Paid</Badge>
        <Badge tone="warning">Pending</Badge>
        <Badge tone="danger">Overdue</Badge>
        <Badge>Archived</Badge>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Badge type="outline" tone="primary" iconRight={<X size={12} />}>Filter</Badge>
        <Badge type="outline" tone="success" size="sm">Active</Badge>
      </div>
    </div>
  ),
  card: () => (
    <div className="mx-auto grid w-72 gap-4 py-4">
      <Card type="media" label="KPR" title="Subsidized Home" description="Installments from Rp1.2M/month over a 20-year term." linkLabel="See more" href="#" />
      <Card type="action" label="Promo" title="Time Savings" description="4% p.a. interest on regular deposits." actions={<><Button variant="ghost">Skip</Button><Button>Apply</Button></>} />
    </div>
  ),
  "code-block": () => (
    <div className="mx-auto w-full max-w-sm py-4">
      <CodeBlock language="TSX" title="pay-button.tsx" code={'import { Button } from "@/ui";\n\n<Button size="lg">Pay Rp 412.500</Button>'} />
    </div>
  ),
  divider: () => (
    <div className="mx-auto grid w-full max-w-xs gap-4 py-6">
      <Divider />
      <Divider label="or" />
      <Divider icon={<Dot size={12} weight="fill" />} />
    </div>
  ),
  "empty-state": () => (
    <div className="grid gap-2 py-2 sm:grid-cols-2">
      <EmptyState scope="list" size="sm" title="No transactions yet" description="Your transactions will appear here." action={<Button variant="secondary">Try again</Button>} />
      <EmptyState scope="search" size="sm" title="No results" description="Try a different keyword." />
    </div>
  ),
  input: () => (
    <div className="mx-auto grid w-full max-w-xs gap-5 py-4">
      <Input label="Email" type="email" placeholder="email@example.com" hint="We send the receipt here." />
      <Input label="Email" type="email" defaultValue="nama.pengguna" error="Enter a valid email address." />
    </div>
  ),
  checkbox: () => (
    <div className="mx-auto grid w-fit gap-3 py-4">
      <Checkbox size="md" label="Label" />
      <Checkbox size="md" label="Remember me" hint="Stay signed in on this device." defaultChecked />
      <Checkbox size="md" label="Select all" indeterminate />
      <Checkbox size="md" label="I agree to the terms" error="Accept the terms to continue." />
      <Checkbox size="md" label="Disabled" disabled />
    </div>
  ),
  select: () => (
    <div className="mx-auto grid w-full max-w-xs gap-5 py-4">
      <Select label="City" placeholder="Choose a city" options={CITIES} />
      <Select label="City" defaultValue="meadow" options={CITIES} error="Delivery is not available in this city yet." />
    </div>
  ),
  toggle: () => (
    <div className="mx-auto grid w-fit gap-3 py-4">
      <Toggle size="md" label="Email notifications" />
      <Toggle size="md" label="Transaction notifications" hint="Helper text" defaultChecked />
      <Toggle size="md" label="Disabled" disabled />
    </div>
  ),
  tabs: () => (
    <div className="mx-auto grid w-fit gap-5 py-4">
      <Tabs label="Transactions" items={[{ id: "all", label: "All", value: "12" }, { id: "in", label: "Incoming" }, { id: "out", label: "Outgoing" }]} />
      <Tabs label="Transactions, pill" type="pill" items={[{ id: "all", label: "All" }, { id: "in", label: "Incoming" }, { id: "out", label: "Outgoing" }]} />
      <Tabs label="Transactions, segmented" type="segmented" items={[{ id: "all", label: "All" }, { id: "in", label: "Incoming" }]} />
    </div>
  ),
  breadcrumbs: () => (
    <div className="mx-auto grid w-fit gap-4 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "#" }, { label: "Product", href: "#" }, { label: "KPR Digital" }]} />
      <Breadcrumbs separator="slash" items={[{ label: "Home", href: "#" }, { label: "Product", href: "#" }, { label: "KPR Digital" }]} />
      <Breadcrumbs
        maxItems={4}
        items={[{ label: "Home", href: "#" }, { label: "Product", href: "#" }, { label: "KPR Digital", href: "#" }, { label: "Simulation", href: "#" }, { label: "Detail" }]}
      />
    </div>
  ),
  pagination: () => (
    <div className="mx-auto grid w-fit gap-3 py-4">
      <Pagination page={1} pageCount={10} onPageChange={() => {}} />
      <Pagination type="arrow" page={2} pageCount={10} onPageChange={() => {}} />
      <Pagination type="loadMore" page={1} pageCount={10} onPageChange={() => {}} />
    </div>
  ),
  modal: () => (
    <div className="flex justify-center py-4">
      <ModalPanel
        title="Remove saved account?"
        description="“Andi Pratama” will be removed from your saved accounts."
        onClose={() => {}}
        footer={
          <>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive">Remove</Button>
          </>
        }
      />
    </div>
  ),
  tooltip: () => (
    <div className="flex flex-wrap items-start justify-center gap-6 py-8">
      <TooltipBubble title="Effective interest rate" description="Calculated from the outstanding principal." />
      <TooltipBubble size="sm" placement="bottom" title="Copy account number" />
    </div>
  ),
  alert: () => (
    <div className="mx-auto grid w-full max-w-md gap-3 py-4">
      <Alert tone="info" title="Scheduled maintenance" description="Transfers pause on Sunday, 01:00 to 03:00." />
      <Alert tone="danger" title="Verification failed" description="The ID photo is unclear. Upload it again." />
    </div>
  ),
  toast: () => (
    <div className="mx-auto grid w-fit gap-3 py-4">
      <Toast tone="success" title="Transfer successful" description="Rp500,000 to Andi Pratama" actionLabel="Undo" onAction={() => {}} onClose={() => {}} />
      <Toast tone="danger" type="solid" title="Connection lost" onClose={() => {}} />
      <Toast tone="warning" type="solid" title="Session ends in 1 minute" />
    </div>
  ),
  spinner: () => (
    <div className="flex flex-col items-center gap-5 py-6">
      <div className="flex items-center gap-4">
        <Spinner size="xs" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>
      <div className="flex items-center gap-4">
        <Spinner type="dots" tone="neutral" />
        <span className="inline-flex min-h-11 items-center gap-2 rounded-md bg-role-bg-brand px-4 text-sm font-medium text-role-text-on-brand">
          <Spinner tone="onPrimary" size="sm" label="Processing" />
          Processing…
        </span>
      </div>
    </div>
  ),

  headline: () => (
    <div className="mx-auto max-w-xs space-y-1 py-6 text-center">
      <Headline as="p">Header 1</Headline>
      <Headline as="p" level="h2">Header 2</Headline>
      <Headline as="p" level="subheader">Subheader</Headline>
    </div>
  ),
  "label-text": () => (
    <div className="mx-auto flex max-w-xs flex-col items-start gap-3 py-6">
      <LabelText indicator="required">Full name</LabelText>
      <LabelText indicator="optional">Email</LabelText>
      <LabelText icon={<Info size={16} />}>Interest rate</LabelText>
      <LabelText indicator="required" error>Phone number</LabelText>
      <LabelText disabled>Cannot be changed</LabelText>
    </div>
  ),
  separator: () => (
    <div className="mx-auto grid w-full max-w-xs gap-4 py-6">
      <Separator />
      <Separator label="or" />
      <div className="flex h-12 items-center gap-4 text-sm text-gray-700">
        Left
        <Separator orientation="vertical" />
        Right
      </div>
    </div>
  ),
  chip: () => (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="flex flex-wrap justify-center gap-2">
        <Chip label="KPR" tone="primary" onRemove={() => {}} />
        <Chip label="10-year term" onRemove={() => {}} />
        <Chip label="Approved" tone="success" onRemove={() => {}} />
        <Chip label="Rejected" tone="danger" onRemove={() => {}} />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Chip label="Promo" type="outline" tone="primary" icon={<Tag size={16} />} />
        <Chip label="sm" type="outline" size="sm" onRemove={() => {}} />
      </div>
    </div>
  ),
  status: () => (
    <div className="mx-auto grid w-fit gap-4 py-4">
      <div className="flex flex-wrap gap-2">
        {(["pending", "processing", "success", "failed", "expired", "refunded"] as const).map((s) => (
          <Status key={s} status={s} />
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        <Status status="pending" type="inline" timestamp="18 Sep, 14:02" />
        <Status status="success" type="dot" />
        <Status status="failed" type="dot" />
      </div>
    </div>
  ),
  comment: () => (
    <div className="mx-auto grid w-full max-w-sm gap-3 py-4">
      <Comment author="Rahadian" role="Approver" timestamp="2 hours ago" onReply={() => {}} onToggleResolved={() => {}}>
        Payslip documents check out. Moving on to collateral verification.
      </Comment>
      <Comment type="annotation" state="highlight" author="CS note" role="CS" timestamp="18 Sep, 09:12">
        Customer asked to reschedule the site survey.
      </Comment>
    </div>
  ),
  accordion: () => (
    <Accordion
      className="mx-auto w-full max-w-sm"
      items={[
        { title: "How long does a transfer take?", content: "Most transfers arrive within a minute.", defaultOpen: true },
        { title: "What are the limits?", content: "Limits depend on your account type." },
      ]}
    />
  ),
  table: () => (
    <div className="mx-auto w-full max-w-md py-4">
      <Table caption="Recent transfers" type="striped" size="sm" columns={TX_COLUMNS} rows={TX_ROWS} />
    </div>
  ),
  "transaction-list-item": () => (
    <div className="mx-auto w-full max-w-sm divide-y divide-role-border-default overflow-hidden rounded-lg border border-role-border-default">
      <TransactionListItem tone="success" icon={<ArrowDownLeft size={16} />} title="Transfer from Andi" label="Transfer" timestamp="18 Sep, 14:02" amount="Rp500.000" />
      <TransactionListItem tone="danger" icon={<ArrowUpRight size={16} />} title="QRIS Kopi Natuna" label="Shopping" timestamp="18 Sep, 14:02" amount="Rp35.000" />
      <TransactionListItem title="Top up e-wallet" label="Processing" timestamp="18 Sep, 14:02" amount="Rp100.000" />
    </div>
  ),
  "qr-code": () => (
    <div className="flex justify-center py-4">
      <QrCodeDisplay type="dynamic" size="sm" label="Warung Natuna" value="Rp150.000" expiry="Valid for 04:59" onSave={() => {}} />
    </div>
  ),
  "radio-button": () => (
    <div className="mx-auto grid w-fit gap-3 py-4">
      <RadioButton size="md" name="preview-radio-single" label="10 years" />
      <RadioButton size="md" name="preview-radio-single" label="15 years" hint="Helper text" defaultChecked />
      <RadioButton size="md" name="preview-radio-state" label="Error" error="Choose a term." defaultChecked />
      <RadioButton size="md" name="preview-radio-state" label="Disabled" disabled />
    </div>
  ),
  "radio-group": () => (
    <div className="mx-auto grid w-fit gap-5 py-4">
      <RadioGroup label="Loan term" name="preview-rg-a" defaultValue="15" options={[{ value: "10", label: "10 years" }, { value: "15", label: "15 years" }, { value: "20", label: "20 years" }]} />
      <RadioGroup label="Do you have a tax ID (NPWP)?" name="preview-rg-b" orientation="horizontal" error="Choose one term." options={[{ value: "10", label: "10 years" }, { value: "15", label: "15 years" }]} />
    </div>
  ),
  textarea: () => (
    <div className="mx-auto grid w-full max-w-sm gap-4 py-4">
      <Textarea label="Approval notes" placeholder="Write a note…" hint="Up to 500 characters" maxLength={500} />
      <Textarea label="Approval notes" placeholder="Write a note…" error="A note is required" maxLength={500} />
    </div>
  ),
  slider: () => (
    <div className="mx-auto grid w-full max-w-xs gap-4 py-4">
      <Slider label="Term" min={1} max={30} defaultValue={15} format={(n) => n + " yrs"} />
      <Slider mode="range" label="Credit limit" min={0} max={2000} step={50} defaultValue={[100, 1000]} format={(n) => (n >= 1000 ? "Rp" + n / 1000 + " M" : "Rp" + n + " jt")} />
    </div>
  ),
  "otp-input": () => (
    <div className="mx-auto grid w-fit gap-5 py-4">
      <OtpInput label="Verification code" value="4827" hint="Resend code in 00:45" />
      <OtpInput label="Verification code" length={4} value="4827" error="Incorrect OTP. 2 attempts left." />
    </div>
  ),
  "pin-input": () => (
    <div className="mx-auto w-fit py-4">
      <PinInput label="Enter transaction PIN" value="4827" hint="Never share your PIN with anyone" />
    </div>
  ),
  search: () => (
    <div className="mx-auto grid w-full max-w-sm gap-3 py-4">
      <SearchField label="Search transactions" placeholder="Search transactions" />
      <SearchField label="Search transactions" placeholder="Search transactions" defaultValue="bank transfer" />
      <SearchField label="Search transactions" placeholder="Search transactions" type="withButton" />
    </div>
  ),
  "file-input": () => (
    <div className="mx-auto grid w-full max-w-sm gap-4 py-4">
      <FileInput description="PNG, JPG maks. 5 MB" accept="image/png,image/jpeg" />
      <FileInput type="inline" />
    </div>
  ),
  "date-picker": () => (
    <div className="mx-auto flex w-fit flex-col items-center gap-4 py-4">
      <Calendar today={TODAY} value={new Date(2026, 8, 18)} />
    </div>
  ),
  combobox: () => (
    <div className="mx-auto grid w-full max-w-xs gap-4 py-4">
      <Combobox label="Destination bank" placeholder="Search banks…" options={BANKS} />
      <Combobox mode="multiple" label="Destination bank" placeholder="Search banks…" options={BANKS} value={["bri", "bsi"]} />
    </div>
  ),
  "amount-input": () => (
    <div className="mx-auto grid w-full max-w-xs gap-4 py-4">
      <AmountInput label="Amount" defaultValue={150000} />
      <AmountInput label="Amount" defaultValue={5000} error="Minimum Rp10.000" />
    </div>
  ),
  rating: () => (
    <div className="mx-auto grid w-fit gap-3 py-4">
      <Rating score={4} value="4,5" />
      <Rating score={3} type="heart" showValue={false} />
      <Rating score={4} type="number" value="4,0" />
      <Rating score={4} value="4,5" disabled />
    </div>
  ),
  stepper: () => (
    <div className="mx-auto grid w-fit gap-6 py-4">
      <Stepper current={1} steps={[{ title: "Personal details" }, { title: "Documents" }, { title: "Verification" }]} />
      <Stepper type="vertical" current={2} errorAt={2} steps={[{ title: "Personal details" }, { title: "Documents" }, { title: "Face verification", description: "Photo is unclear. Please retake it." }]} />
    </div>
  ),
  "navigation-bar": () => (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-role-border-default py-0">
      <TopAppBar titleAs="p" title="Transaction History" onBack={() => {}} actions={<button type="button" aria-label="More" className="flex size-11 items-center justify-center text-role-text-secondary"><DotsThree size={22} /></button>} />
      <div className="h-16 bg-role-bg-hover" />
      <BottomNav items={NAV_ITEMS} current="#home" />
    </div>
  ),
  drawer: () => (
    <div className="mx-auto w-fit py-2">
      <DrawerPanel
        title="Filter transactions"
        description="Choose a date range and transaction type."
        onClose={() => {}}
        footer={
          <>
            <Button variant="ghost">Cancel</Button>
            <Button>Save</Button>
          </>
        }
      >
        <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-role-border-input bg-role-bg-hover text-xs text-role-text-secondary">Drawer content</div>
      </DrawerPanel>
    </div>
  ),
  "progress-bar": () => (
    <div className="mx-auto grid w-full max-w-xs gap-4 py-4">
      <ProgressBar label="Uploading" value={60} />
      <ProgressBar label="Done" value={100} tone="success" />
      <div className="flex gap-4">
        <ProgressBar type="circular" label="Uploading" value={60} showLabel={false} />
        <ProgressBar type="circular" label="Loading" mode="indeterminate" showLabel={false} />
      </div>
    </div>
  ),
  skeleton: () => (
    <div className="mx-auto w-64 py-4" aria-busy="true">
      <Skeleton type="card" />
    </div>
  ),
  artboard: () => (
    <div className="flex justify-center py-6">
      <div className="w-64 overflow-hidden rounded-md border border-gray-300 bg-surface">
        <div className="border-b border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700">Button / Variants</div>
        <div className="flex gap-2 p-4">
          <span className="rounded-md bg-brand px-3 py-1 text-xs font-medium text-white">Primary</span>
          <span className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700">Ghost</span>
        </div>
      </div>
    </div>
  ),
  cover: () => (
    <div className="mx-auto w-full max-w-md py-4">
      <Cover size="sm" title="Natuna Digilab" description="Design System: Component Library" />
    </div>
  ),
  guideline: () => (
    <div className="flex justify-center gap-3 py-6 text-xs">
      <div className="w-32 rounded-md border border-emerald-200 bg-emerald-50 p-3">
        <div className="mb-1 flex items-center gap-1 font-semibold text-emerald-900">
          <CheckCircle size={14} weight="fill" aria-hidden="true" /> Do
        </div>
        <span className="text-gray-700">One primary button per view.</span>
      </div>
      <div className="w-32 rounded-md border border-red-200 bg-red-50 p-3">
        <div className="mb-1 flex items-center gap-1 font-semibold text-red-900">
          <XCircle size={14} weight="fill" aria-hidden="true" /> Don&apos;t
        </div>
        <span className="text-gray-700">Two primary buttons side by side.</span>
      </div>
    </div>
  ),
  document: () => (
    <div className="flex justify-center py-6">
      <div className="w-64 rounded-md border border-gray-200 bg-surface p-4">
        <div className="text-base font-bold text-gray-900">Introduction</div>
        <p className="mt-1 text-xs leading-5 text-gray-700">Written documentation sits on its own page, set in the body scale with headers for each section.</p>
      </div>
    </div>
  ),
  changelog: () => (
    <div className="mx-auto w-full max-w-md py-4">
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
  ),
};

export default function ComponentPreview({ slug }: { slug: string }) {
  const Preview = previews[slug];
  if (!Preview) {
    return <div className="py-6 text-center text-sm text-gray-700">Preview coming soon</div>;
  }
  return <Preview />;
}
