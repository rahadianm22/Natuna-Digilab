"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GithubLogo, List, X } from "@phosphor-icons/react";
import ThemeToggle from "./ThemeToggle";
import CommandSearch from "./CommandSearch";
import { REPO_URL } from "@/lib/site";

const nav = [
  { href: "/docs", label: "Docs" },
  { href: "/foundation", label: "Foundation" },
  { href: "/components", label: "Components" },
  { href: "/themes", label: "Themes" },
];

export default function Header({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-surface/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 rounded-sm font-bold text-gray-900">
            <Image src="/natuna-logo.png" alt="" width={28} height={28} loading="eager" className="h-7 w-7" />
            <span>
              Natuna <span className="text-blue-700">Digilab</span>
            </span>
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 text-sm md:flex">
            {nav.map((item) => {
              const current = item.label === active;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-md px-3 py-1.5 transition-colors ${
                    current ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <CommandSearch />
          <ThemeToggle />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Source on GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <GithubLogo size={18} aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 md:hidden"
          >
            {open ? <X size={18} aria-hidden="true" /> : <List size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-gray-200 bg-surface px-4 py-3 md:hidden">
          <ul className="space-y-1 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={item.label === active ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-md px-3 ${
                    item.label === active
                      ? "bg-blue-50 font-semibold text-blue-800"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
