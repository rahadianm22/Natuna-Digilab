"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GithubLogo, List, X } from "@phosphor-icons/react";
import ThemeToggle from "./ThemeToggle";
import CommandSearch from "./CommandSearch";
import { REPO_URL } from "@/lib/site";

const nav = [
  { href: "/docs", label: "Introduction" },
  { href: "/foundation", label: "Foundation" },
  { href: "/components", label: "Components" },
  { href: "/themes", label: "Themes" },
];

export default function Header({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-surface/90 backdrop-blur">
      {/* First stop for keyboard users, so they can pass the header and sidebar in one key press. */}
      <a
        href="#main"
        className="sr-only rounded-md bg-brand px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-sm font-bold text-gray-900">
            <Image src="/natuna-logo.svg" alt="" width={28} height={28} loading="eager" className="h-7 w-7" />
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
            className="hidden h-9 w-9 md:flex items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <GithubLogo size={18} aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 sm:h-9 sm:w-9 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 md:hidden"
          >
            {open ? <X size={18} aria-hidden="true" /> : <List size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-gray-200 bg-surface px-6 py-3 md:hidden">
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
            <li className="mt-1 border-t border-gray-200 pt-1">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center gap-2 rounded-md px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <GithubLogo size={18} aria-hidden="true" />
                Source on GitHub
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
