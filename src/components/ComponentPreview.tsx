"use client";

import type { ReactElement } from "react";
import { Accordion, Avatar, Badge, Breadcrumbs, Button, Card, Changelog, Checkbox, Comment, Cover, Divider, DrawerPanel, FileInput, Input, LabelText, Pagination, ProgressBar, RadioButton, RadioGroup, Rating, Separator, Skeleton, Status, Stepper, Tabs, Toast, Toggle, buttonStyles } from "@/ui";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckCircle,
  Dot,
  DotsThree,
  DownloadSimple,
  House,
  Info,
  List,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  QrCode,
  Star,
  Trash,
  Tray,
  UploadSimple,
  User,
  Wallet,
  Warning,
  X,
  XCircle,
} from "@phosphor-icons/react/ssr";

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
    <div className="flex justify-center py-6">
      <div className="inline-flex overflow-hidden rounded-md border border-gray-300">
        <button className="border-r border-gray-300 bg-brand min-h-11 px-4 text-sm font-medium text-white">Grid</button>
        <button className="min-h-11 px-4 text-sm text-gray-700">List</button>
      </div>
    </div>
  ),
  "dropdown-menu": () => (
    <div className="flex justify-center py-6">
      <div className="w-48 rounded-md border border-gray-200 bg-surface shadow-sm">
        <div className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">Edit</div>
        <div className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">Duplicate</div>
        <div className="px-3 py-2 text-sm text-red-800">Delete</div>
      </div>
    </div>
  ),
  "icon-button": () => (
    <div className="flex justify-center gap-3 py-6">
      {[
        { label: "Add", icon: <Plus size={18} /> },
        { label: "Edit", icon: <PencilSimple size={18} /> },
        { label: "Download", icon: <DownloadSimple size={18} /> },
        { label: "Delete", icon: <Trash size={18} /> },
      ].map(({ label, icon }) => (
        <span
          key={label}
          role="img"
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-700"
        >
          {icon}
        </span>
      ))}
    </div>
  ),
  link: () => (
    <p className="mx-auto max-w-xs py-6 text-center text-sm text-gray-700">
      Read the <span className="font-medium text-blue-800 underline underline-offset-4">transfer limits</span> before you
      send.
    </p>
  ),
  "more-menu": () => (
    <div className="flex justify-center py-6 text-gray-700">
      <span role="img" aria-label="More actions">
        <DotsThree size={28} weight="bold" />
      </span>
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
    <div className="flex justify-center py-6">
      <pre className="rounded-md bg-ink px-4 py-3 text-xs text-emerald-300">{`import { Button } from "@/ui";`}</pre>
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
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-800">
        <Tray size={24} />
      </span>
      <div className="text-sm font-medium text-gray-700">No results found</div>
      <div className="text-xs text-gray-700">Try adjusting your search or filters.</div>
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
    <div className="flex justify-center py-6">
      <select aria-label="City" className="w-48 rounded-md border border-gray-500 bg-surface px-3 text-sm min-h-11">
        <option>Harbor</option>
        <option>Meadow</option>
        <option>Ridgeway</option>
      </select>
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
    // A scrim, a close control, and the system's own button styles, as the guidance on this page asks.
    // Spans styled as buttons keep the picture inert: nothing here is a focusable control that does nothing.
    <div className="relative mx-auto flex max-w-md justify-center overflow-hidden rounded-xl bg-ink/40 px-4 py-8">
      <div className="w-full max-w-xs rounded-xl bg-surface p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="text-base font-semibold text-gray-900">Cancel this transfer?</div>
          <span aria-hidden="true" className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-gray-700">
            <X size={18} />
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-700">Rp&nbsp;500.000 to Budi Santoso will not be sent. You can start it again later.</p>
        <div className="mt-5 flex justify-end gap-2">
          <span className={buttonStyles({ variant: "ghost" })}>Keep it</span>
          <span className={buttonStyles({ variant: "destructive" })}>Cancel transfer</span>
        </div>
      </div>
    </div>
  ),
  tooltip: () => (
    <div className="flex justify-center py-6">
      <span className="rounded-md bg-ink px-3 py-1.5 text-xs text-white">Save changes</span>
    </div>
  ),
  alert: () => (
    <div className="flex justify-center py-6">
      <div role="status" className="flex w-80 items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
        <Warning size={18} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0" />
        <span>Your session ends in 5 minutes. Save your draft to keep it.</span>
      </div>
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
    <div className="flex justify-center py-6">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
    </div>
  ),

  headline: () => (
    <div className="mx-auto max-w-xs space-y-1 py-6 text-center">
      <div className="text-2xl font-bold leading-9 text-gray-900">Header 1</div>
      <div className="text-xl font-bold leading-[30px] text-gray-900">Header 2</div>
      <div className="text-lg font-semibold leading-[26px] text-gray-700">Subheader</div>
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
    <div className="flex flex-wrap justify-center gap-2 py-6">
      {["Harbor", "This month", "Transfer"].map((c) => (
        <span key={c} className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 py-1 pl-3 pr-1.5 text-xs font-medium text-blue-900">
          {c}
          <button type="button" aria-label={`Remove ${c}`} className="-my-3 -mr-3 inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-blue-100">
            <X size={12} weight="bold" />
          </button>
        </span>
      ))}
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
    <div className="flex justify-center py-6">
      <div className="w-full max-w-md overflow-x-auto rounded-md border border-gray-200 bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-700">
            <tr>
              <th scope="col" className="px-3 py-2">Invoice</th>
              <th scope="col" className="px-3 py-2">Status</th>
              <th scope="col" className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            <tr>
              <td className="px-3 py-2 font-mono-code text-xs">INV-0001</td>
              <td className="px-3 py-2">Paid</td>
              <td className="px-3 py-2 text-right tabular-nums">Rp 250.000</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-mono-code text-xs">INV-0002</td>
              <td className="px-3 py-2">Pending</td>
              <td className="px-3 py-2 text-right tabular-nums">Rp 1.200.000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
  "transaction-list-item": () => (
    <div className="mx-auto w-full max-w-sm divide-y divide-gray-100 py-4">
      {[
        { name: "Warung Bu Sari", meta: "QRIS payment, 09:41", amount: "-Rp 125.000", out: true },
        { name: "Budi Santoso", meta: "Transfer in, 08:10", amount: "+Rp 500.000", out: false },
      ].map((t) => (
        <div key={t.name} className="flex items-center gap-3 py-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${t.out ? "bg-gray-100 text-gray-700" : "bg-emerald-100 text-emerald-900"}`}>
            {t.out ? <ArrowUpRight size={18} aria-hidden="true" /> : <ArrowDownLeft size={18} aria-hidden="true" />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-gray-900">{t.name}</div>
            <div className="text-xs text-gray-700">{t.meta}</div>
          </div>
          <span className={`text-sm font-semibold tabular-nums ${t.out ? "text-gray-900" : "text-emerald-900"}`}>{t.amount}</span>
        </div>
      ))}
    </div>
  ),
  "qr-code": () => (
    <div className="flex justify-center py-6">
      <div className="w-52 rounded-xl border border-gray-200 bg-surface p-4 text-center">
        {/* The code always sits on white with a quiet zone, in both modes, as the guidance requires. */}
        <div className="theme-light mx-auto flex w-fit flex-col items-center rounded-lg border border-gray-200 bg-white p-3">
          <QrCode size={96} weight="regular" aria-hidden="true" className="text-[#0d121c]" />
          <span className="mt-1 text-xs text-gray-700">Sample, not a scannable code</span>
        </div>
        <div className="mt-3 text-lg font-bold tabular-nums text-gray-900">Rp 25.000</div>
        <div className="text-sm font-semibold text-gray-900">Warung Bu Sari</div>
        <div className="text-xs text-gray-700">Expires at 15:00 WIB</div>
      </div>
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
    <div className="flex justify-center py-6">
      <label className="flex w-72 flex-col gap-1.5">
        <span className="text-xs font-semibold text-gray-700">Note</span>
        <textarea rows={3} maxLength={120} placeholder="Add a note for the recipient" className="rounded-md border border-gray-500 bg-surface px-3 py-2 text-sm text-gray-900 placeholder:text-gray-700" />
        <span className="text-right text-xs text-gray-700">Up to 120 characters</span>
      </label>
    </div>
  ),
  slider: () => (
    <div className="flex justify-center py-6">
      <label className="flex w-64 flex-col gap-2">
        <span className="flex justify-between text-xs font-semibold text-gray-700">
          Daily limit <span className="font-normal text-gray-700">Rp 0 to 10 jt</span>
        </span>
        <input type="range" min={0} max={100} defaultValue={60} className="min-h-11 w-full accent-blue-600" />
      </label>
    </div>
  ),
  "otp-input": () => (
    // A picture of the pattern, not a working field: three digits entered, focus on the fourth.
    <div className="flex flex-col items-center gap-2 py-6">
      <span className="text-xs font-semibold text-gray-700">Code sent to ••• •••• 4821</span>
      <div role="img" aria-label="Six-digit code, three digits entered" className="flex gap-2">
        {["4", "8", "2", "", "", ""].map((d, i) => (
          <span
            key={i}
            className={`flex h-11 w-10 items-center justify-center rounded-md border bg-surface text-lg font-semibold tabular-nums text-gray-900 ${
              i === 3 ? "border-blue-600 ring-2 ring-blue-600" : "border-gray-500"
            }`}
          >
            {d}
          </span>
        ))}
      </div>
      <span className="text-xs text-gray-700">
        Resend code in <span className="tabular-nums">0:45</span>
      </span>
    </div>
  ),
  "pin-input": () => (
    <div className="flex flex-col items-center gap-2 py-6">
      <span id="pin-preview-label" className="text-xs font-semibold text-gray-700">Enter your PIN</span>
      <div role="group" aria-labelledby="pin-preview-label" className="flex gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <input
            key={i}
            type="password"
            inputMode="numeric"
            maxLength={1}
            aria-label={`PIN digit ${i + 1}`}
            className="h-11 w-11 rounded-md border border-gray-500 bg-surface text-center text-lg font-semibold text-gray-900"
          />
        ))}
      </div>
    </div>
  ),
  search: () => (
    <div className="flex justify-center py-6">
      <label className="relative block w-72">
        <span className="sr-only">Search transactions</span>
        <MagnifyingGlass size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
        <input type="search" placeholder="Search by name or amount" className="w-full rounded-md border min-h-11 border-gray-500 bg-surface pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-700" />
      </label>
    </div>
  ),
  "file-input": () => (
    <div className="mx-auto grid w-full max-w-sm gap-4 py-4">
      <FileInput description="PNG, JPG maks. 5 MB" accept="image/png,image/jpeg" />
      <FileInput type="inline" />
    </div>
  ),
  "date-picker": () => (
    <div className="flex justify-center py-6">
      <label className="flex w-56 flex-col gap-1.5">
        <span className="text-xs font-semibold text-gray-700">Transfer date</span>
        <input type="date" className="rounded-md border min-h-11 border-gray-500 bg-surface px-3 text-sm text-gray-900" />
      </label>
    </div>
  ),
  combobox: () => (
    <div className="flex justify-center py-6">
      <label className="flex w-64 flex-col gap-1.5">
        <span className="text-xs font-semibold text-gray-700">City</span>
        <input list="preview-cities" placeholder="Type to search" className="rounded-md border min-h-11 border-gray-500 bg-surface px-3 text-sm text-gray-900 placeholder:text-gray-700" />
        <datalist id="preview-cities">
          {["Harbor", "Meadow", "Natuna", "Ridgeway", "Summit", "Valley", "Westfield"].map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>
    </div>
  ),
  "amount-input": () => (
    <div className="flex justify-center py-6">
      <label className="flex w-64 flex-col gap-1.5">
        <span className="text-xs font-semibold text-gray-700">Amount</span>
        <span className="flex items-center rounded-md border border-gray-500 bg-surface px-3 focus-within:border-role-border-focus focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-role-border-focus">
          <span className="text-base font-semibold text-gray-700">Rp</span>
          <input inputMode="numeric" placeholder="0" className="w-full bg-transparent min-h-11 px-2 text-lg font-semibold text-gray-900 outline-none placeholder:text-gray-700" />
        </span>
        <span className="text-xs text-gray-700">Balance Rp 2.450.000</span>
      </label>
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
    <div className="flex justify-center py-6">
      <div className="flex w-72 justify-around rounded-md border border-gray-200 bg-surface py-2 text-xs font-medium">
        {[
          { label: "Home", icon: <House size={20} weight="fill" aria-hidden="true" />, active: true },
          { label: "Wallet", icon: <Wallet size={20} aria-hidden="true" /> },
          { label: "History", icon: <List size={20} aria-hidden="true" /> },
          { label: "Profile", icon: <User size={20} aria-hidden="true" /> },
        ].map((n) => (
          <span key={n.label} className={`flex flex-col items-center gap-0.5 ${n.active ? "text-blue-900" : "text-gray-700"}`}>
            {n.icon}
            <span className={n.active ? "font-semibold" : ""}>{n.label}</span>
          </span>
        ))}
      </div>
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
      <Cover size="sm" title="Natuna Digilab" description="Design System — Component Library" />
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
