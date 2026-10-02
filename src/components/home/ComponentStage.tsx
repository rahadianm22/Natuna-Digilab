"use client";

import { useState } from "react";
import { Accordion, Avatar, Badge, Button, Input } from "@/ui";

type Mode = "light" | "dark";

/**
 * Real src/ui components on one surface, with its own light/dark switch. The switch scopes the
 * Natuna tokens to this stage only, so visitors see both modes without changing the whole site.
 */
export default function ComponentStage() {
  const [mode, setMode] = useState<Mode>("dark");
  const [approved, setApproved] = useState(false);
  const [saving, setSaving] = useState(false);

  function approve() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setApproved(true);
    }, 900);
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span id="stage-mode" className="text-sm text-gray-600">Stage mode</span>
        <div role="radiogroup" aria-labelledby="stage-mode" className="flex rounded-lg border border-gray-300 p-0.5">
          {(["light", "dark"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => setMode(m)}
              className={`min-h-9 rounded-md px-4 text-sm font-medium capitalize transition-colors ${
                mode === m ? "bg-[#026acc] text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className={`theme-${mode} rounded-[2rem] border border-gray-200 p-2 shadow-2xl shadow-blue-900/10`}>
        <div className="grid gap-5 rounded-3xl border border-gray-200 bg-surface p-5 sm:p-7 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Avatar name="Natuna Digilab" size="lg" />
              <div className="min-w-0">
                <div className="truncate font-semibold text-gray-900">Design review</div>
                <div className="text-sm text-gray-600">Foundation v1.0</div>
              </div>
              <Badge tone={approved ? "success" : "warning"} className="ml-auto">
                {approved ? "Approved" : "Pending"}
              </Badge>
            </div>
            <Input label="Reviewer note" placeholder="Add a note" hint="Visible to the whole team." />
            <div className="flex flex-wrap gap-2">
              <Button loading={saving} disabled={approved} onClick={approve}>
                {approved ? "Approved" : saving ? "Approving" : "Approve"}
              </Button>
              <Button variant="ghost" onClick={() => setApproved(false)}>
                Reset
              </Button>
            </div>
          </div>
          <Accordion
            items={[
              { title: "What is in Foundation v1.0?", content: "Color, typography, number, effect, and icon variables.", defaultOpen: true },
              { title: "How is status decided?", content: "From the component tracker: Ready, In review, In progress, or Planned." },
              { title: "Where is the source?", content: "The Foundation Design System file in Figma." },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
