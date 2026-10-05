import type { ReactElement } from "react";
import { Accordion, Avatar, Badge, Button, Input, buttonStyles } from "@/ui";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckCircle,
  DotsThree,
  DownloadSimple,
  House,
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
        <button className="border-r border-gray-300 bg-brand px-4 py-2 text-sm font-medium text-white">Grid</button>
        <button className="px-4 py-2 text-sm text-gray-700">List</button>
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
    <div className="flex flex-wrap justify-center gap-2 py-6">
      <Badge tone="success">Paid</Badge>
      <Badge tone="warning">Pending</Badge>
      <Badge tone="danger">Overdue</Badge>
      <Badge tone="info">Draft</Badge>
      <Badge>Archived</Badge>
    </div>
  ),
  card: () => (
    <div className="flex justify-center py-6">
      <div className="w-64 rounded-xl border border-gray-200 bg-surface p-4">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-gray-900">Electricity bill <span className="tabular-nums">Rp 412.500</span></div>
        <div className="text-xs text-gray-700">PLN postpaid, due 12 Oct</div>
        <span className="mt-3 flex min-h-9 w-full items-center justify-center rounded-md bg-brand text-xs font-medium text-white">Pay now</span>
      </div>
    </div>
  ),
  "code-block": () => (
    <div className="flex justify-center py-6">
      <pre className="rounded-md bg-ink px-4 py-3 text-xs text-emerald-300">{`import { Button } from "@/ui";`}</pre>
    </div>
  ),
  divider: () => (
    <div className="mx-auto w-2/3 border-t border-gray-300 py-6" />
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
    <div className="flex justify-center py-6">
      <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" /> Remember me
      </label>
    </div>
  ),
  select: () => (
    <div className="flex justify-center py-6">
      <select aria-label="City" className="w-48 rounded-md border border-gray-300 bg-surface px-3 py-2 text-sm">
        <option>Jakarta</option>
        <option>Tangerang</option>
        <option>Bandung</option>
      </select>
    </div>
  ),
  toggle: () => (
    <div className="flex justify-center py-6">
      <span className="inline-flex h-6 w-11 items-center rounded-full bg-brand p-1">
        <span className="h-4 w-4 translate-x-5 rounded-full bg-white" />
      </span>
    </div>
  ),
  tabs: () => (
    <div className="py-6">
      {/* The active underline overlaps the 1px track, so the indicator sits on the line it belongs to. */}
      <div className="mx-auto flex max-w-sm justify-center gap-6 border-b border-gray-200 text-sm">
        <span className="-mb-px border-b-2 border-blue-600 pb-3 font-medium text-blue-800">Bills</span>
        <span className="-mb-px border-b-2 border-transparent pb-3 text-gray-700">Transfers</span>
        <span className="-mb-px border-b-2 border-transparent pb-3 text-gray-700">Top up</span>
      </div>
    </div>
  ),
  breadcrumbs: () => (
    <div className="flex justify-center gap-2 py-6 text-sm text-gray-700">
      <span>Home</span> / <span>Transfers</span> / <span className="text-gray-900">Details</span>
    </div>
  ),
  pagination: () => (
    <div className="flex justify-center gap-1 py-6 text-sm">
      {[1, 2, 3].map((n) => (
        <span key={n} className={`flex h-8 w-8 items-center justify-center rounded-md ${n === 1 ? "bg-brand text-white" : "border border-gray-200 text-gray-700"}`}>
          {n}
        </span>
      ))}
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
    <div className="flex justify-center py-6">
      <div className="w-64 rounded-md bg-ink px-3 py-2 text-xs text-white">Changes saved successfully</div>
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
    <div className="mx-auto flex max-w-xs flex-col gap-4 py-6">
      <div>
        <div className="text-xs font-semibold text-gray-700">Account number</div>
        <div className="text-base font-medium text-gray-900">1234 5678 90</div>
      </div>
      <div>
        <div className="text-xs font-semibold text-gray-700">Account holder</div>
        <div className="text-base font-medium text-gray-900">Rina Putri</div>
      </div>
    </div>
  ),
  separator: () => (
    <div className="flex justify-center py-6 text-sm text-gray-700">
      <span>30 Sep 2026</span>
      <span aria-hidden="true" className="mx-2 text-gray-300">•</span>
      <span>Transfer</span>
      <span aria-hidden="true" className="mx-2 text-gray-300">•</span>
      <span>Mobile</span>
    </div>
  ),
  chip: () => (
    <div className="flex flex-wrap justify-center gap-2 py-6">
      {["Jakarta", "This month", "Transfer"].map((c) => (
        <span key={c} className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 py-1 pl-3 pr-1.5 text-xs font-medium text-blue-900">
          {c}
          <button type="button" aria-label={`Remove ${c}`} className="rounded-full p-1 hover:bg-blue-100">
            <X size={12} weight="bold" />
          </button>
        </span>
      ))}
    </div>
  ),
  status: () => (
    <div className="flex flex-wrap justify-center gap-4 py-6 text-sm font-medium">
      {[
        ["Success", "bg-emerald-600", "text-emerald-900"],
        ["Processing", "bg-amber-500", "text-amber-900"],
        ["Failed", "bg-danger", "text-red-900"],
      ].map(([label, dot, text]) => (
        <span key={label} className={`inline-flex items-center gap-2 ${text}`}>
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${dot}`} />
          {label}
        </span>
      ))}
    </div>
  ),
  comment: () => (
    <div className="flex justify-center py-6">
      <div className="flex w-72 gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-900">R</span>
        <div>
          <div className="text-sm">
            <span className="font-semibold text-gray-900">Rina Putri</span>
            <span className="ml-2 text-xs text-gray-700">2 hours ago</span>
          </div>
          <p className="mt-1 text-sm text-gray-700">Please check the daily transfer limit before we release this flow.</p>
        </div>
      </div>
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
          <span className="mt-1 text-[10px] text-gray-700">Sample, not a scannable code</span>
        </div>
        <div className="mt-3 text-lg font-bold tabular-nums text-gray-900">Rp 25.000</div>
        <div className="text-sm font-semibold text-gray-900">Warung Bu Sari</div>
        <div className="text-xs text-gray-700">Expires at 15:00 WIB</div>
      </div>
    </div>
  ),
  "radio-button": () => (
    <div className="flex justify-center py-6">
      <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-gray-800">
        <input type="radio" name="preview-radio-single" defaultChecked className="h-4 w-4 accent-blue-600" />
        Transfer now
      </label>
    </div>
  ),
  "radio-group": () => (
    <div className="flex justify-center py-6">
      <fieldset className="space-y-1">
        <legend className="mb-2 text-xs font-semibold text-gray-700">Transfer schedule</legend>
        {["Now", "Later today", "Pick a date"].map((o, i) => (
          <label key={o} className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-gray-800">
            <input type="radio" name="preview-radio-group" defaultChecked={i === 0} className="h-4 w-4 accent-blue-600" />
            {o}
          </label>
        ))}
      </fieldset>
    </div>
  ),
  textarea: () => (
    <div className="flex justify-center py-6">
      <label className="flex w-72 flex-col gap-1.5">
        <span className="text-xs font-semibold text-gray-700">Note</span>
        <textarea rows={3} maxLength={120} placeholder="Add a note for the recipient" className="rounded-md border border-gray-300 bg-surface px-3 py-2 text-sm text-gray-900 placeholder:text-gray-700" />
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
        <input type="range" min={0} max={100} defaultValue={60} className="w-full accent-blue-600" />
      </label>
    </div>
  ),
  "otp-input": () => (
    // A picture of the pattern, not a working field: three digits entered, focus on the fourth.
    <div className="flex flex-col items-center gap-2 py-6">
      <span className="text-xs font-semibold text-gray-700">Code sent to +62 812 •••• 4821</span>
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
            className="h-11 w-10 rounded-md border border-gray-300 bg-surface text-center text-lg font-semibold text-gray-900"
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
        <input type="search" placeholder="Search by name or amount" className="w-full rounded-md border border-gray-300 bg-surface py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-700" />
      </label>
    </div>
  ),
  "file-input": () => (
    <div className="flex justify-center py-6">
      <label className="flex w-72 cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed border-gray-300 bg-surface px-4 py-5 text-center hover:border-blue-400">
        <UploadSimple size={24} aria-hidden="true" className="text-blue-800" />
        <span className="text-sm font-semibold text-gray-900">Choose a file</span>
        <span className="text-xs text-gray-700">JPG, PNG, or PDF, up to 5 MB</span>
        <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="sr-only" />
      </label>
    </div>
  ),
  "date-picker": () => (
    <div className="flex justify-center py-6">
      <label className="flex w-56 flex-col gap-1.5">
        <span className="text-xs font-semibold text-gray-700">Transfer date</span>
        <input type="date" className="rounded-md border border-gray-300 bg-surface px-3 py-2 text-sm text-gray-900" />
      </label>
    </div>
  ),
  combobox: () => (
    <div className="flex justify-center py-6">
      <label className="flex w-64 flex-col gap-1.5">
        <span className="text-xs font-semibold text-gray-700">City</span>
        <input list="preview-cities" placeholder="Type to search" className="rounded-md border border-gray-300 bg-surface px-3 py-2 text-sm text-gray-900 placeholder:text-gray-700" />
        <datalist id="preview-cities">
          {["Bandung", "Jakarta", "Makassar", "Medan", "Natuna", "Surabaya", "Tangerang"].map((c) => (
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
        <span className="flex items-center rounded-md border border-gray-300 bg-surface px-3 focus-within:border-blue-600">
          <span className="text-base font-semibold text-gray-700">Rp</span>
          <input inputMode="numeric" placeholder="0" className="w-full bg-transparent px-2 py-2 text-lg font-semibold text-gray-900 outline-none placeholder:text-gray-700" />
        </span>
        <span className="text-xs text-gray-700">Balance Rp 2.450.000</span>
      </label>
    </div>
  ),
  rating: () => (
    <div className="flex flex-col items-center gap-1 py-6">
      <div role="img" aria-label="4 out of 5 stars" className="flex gap-1 text-amber-500">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={24} weight={n <= 4 ? "fill" : "regular"} className={n <= 4 ? "" : "text-gray-300"} />
        ))}
      </div>
      <span className="text-xs text-gray-700">4 of 5</span>
    </div>
  ),
  stepper: () => (
    <div className="flex justify-center py-6">
      <ol className="flex items-center gap-2 text-xs font-medium">
        {["Identity", "Selfie", "Review"].map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span
              aria-current={i === 1 ? "step" : undefined}
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
                i === 0 ? "bg-brand text-white" : i === 1 ? "border-2 border-blue-600 text-blue-900" : "border border-gray-300 text-gray-700"
              }`}
            >
              {i === 0 ? <Check size={14} weight="bold" aria-label="Done" /> : i + 1}
            </span>
            <span className={i === 2 ? "text-gray-700" : "text-gray-900"}>{s}</span>
            {i < 2 && <span aria-hidden="true" className="h-px w-6 bg-gray-300" />}
          </li>
        ))}
      </ol>
    </div>
  ),
  "navigation-bar": () => (
    <div className="flex justify-center py-6">
      <div className="flex w-72 justify-around rounded-md border border-gray-200 bg-surface py-2 text-[11px] font-medium">
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
    <div className="flex justify-center py-6">
      <div className="relative h-40 w-72 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
        <div className="absolute inset-0 bg-ink/50" />
        <div className="absolute inset-y-0 right-0 w-40 border-l border-gray-200 bg-surface p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Filters</span>
            <X size={14} aria-hidden="true" className="text-gray-700" />
          </div>
          <ul className="mt-3 space-y-1.5 text-xs text-gray-700">
            {["Transfer", "Top up", "QRIS payment"].map((f, i) => (
              <li key={f} className="flex items-center gap-2">
                <span aria-hidden="true" className={`h-3 w-3 rounded-sm border ${i === 0 ? "border-blue-600 bg-brand" : "border-gray-400"}`} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ),
  "progress-bar": () => (
    <div className="flex justify-center py-6">
      <div className="w-64">
        <div className="mb-1.5 flex justify-between text-xs font-medium text-gray-700">
          <span>Uploading receipt</span>
          <span className="tabular-nums">60%</span>
        </div>
        <div role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress" className="h-2 rounded-full bg-gray-100">
          <div className="h-2 w-3/5 rounded-full bg-brand" />
        </div>
      </div>
    </div>
  ),
  skeleton: () => (
    <div role="status" aria-label="Loading" className="mx-auto flex w-64 items-center gap-3 py-6">
      <span className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
      <span className="flex-1 space-y-2">
        <span className="block h-3 w-3/4 animate-pulse rounded bg-gray-200" />
        <span className="block h-3 w-1/2 animate-pulse rounded bg-gray-200" />
      </span>
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
    <div className="flex justify-center py-6">
      <div className="flex aspect-video w-72 flex-col items-center justify-center rounded-md bg-blue-50 text-center">
        <span className="text-xs font-semibold text-blue-900">Natuna Digilab</span>
        <span className="text-2xl font-bold text-gray-900">Foundation</span>
        <span className="text-xs text-gray-700">Design System, Version 1.0</span>
      </div>
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
    <div className="flex justify-center py-6">
      <ol className="w-64 border-l-2 border-gray-200 pl-4 text-sm">
        <li className="relative">
          <span aria-hidden="true" className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-brand" />
          <div className="font-semibold text-gray-900">v1.0</div>
          <div className="text-xs text-gray-700">Foundation Design System: color, typography, number, effect, and icon variables.</div>
        </li>
      </ol>
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
