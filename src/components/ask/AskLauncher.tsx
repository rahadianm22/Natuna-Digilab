"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Chats, X } from "@phosphor-icons/react";
import { IconButton } from "@/ui";
import AskChat from "./AskChat";

// A floating launcher on every page except /ask, which shows the same chat full page.
// The dialog is modeled on src/ui/drawer.tsx: native showModal gives focus trap, Escape and inert page.
export default function AskLauncher() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  if (pathname === "/ask") return null;

  function onBackdropClick(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Open Ask Natuna chat"
        className="fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center rounded-full bg-role-bg-brand text-role-text-on-brand shadow-lg transition-colors hover:bg-role-bg-brand-hover active:scale-[0.97]"
      >
        <Chats size={20} aria-hidden="true" />
      </button>

      {/* The scrim stays dark in both modes: role-text-primary flips to near-white in dark and washed the page out. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="ask-launcher-title"
        onClose={() => setOpen(false)}
        onClick={onBackdropClick}
        className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink/40"
      >
        <div className="ml-auto flex h-full max-h-full w-full flex-col rounded-l-lg bg-role-bg-surface shadow-lg sm:w-[420px]">
          <header className="flex items-center gap-2.5 border-b border-role-border-default px-4 py-3">
            <Image src="/natuna-logo.svg" alt="" width={28} height={28} className="h-7 w-7" />
            <div className="grow">
              <h2 id="ask-launcher-title" className="text-base font-semibold leading-6 text-role-text-primary">
                Ask Natuna
              </h2>
              <p className="text-xs leading-[18px] text-role-text-secondary">Ask about the design system</p>
            </div>
            <IconButton label="Close chat" icon={<X size={18} aria-hidden="true" />} onClick={() => setOpen(false)} />
          </header>
          <AskChat autoFocus />
        </div>
      </dialog>
    </>
  );
}
