import Image from "next/image";
import Link from "next/link";
import { GithubLogo } from "@phosphor-icons/react/ssr";
import ThemeToggle from "./ThemeToggle";
import CommandSearch from "./CommandSearch";
import { MenuButton, MenuProvider, MobileMenu } from "./HeaderMenu";
import { searchIndex } from "@/lib/search-index";
import { REPO_URL } from "@/lib/site";

const nav = [
  { href: "/docs", label: "Introduction" },
  { href: "/foundation", label: "Foundation" },
  { href: "/components", label: "Components" },
  { href: "/themes", label: "Themes" },
];

const mobileNav = [...nav.slice(0, 3), { href: "/naming", label: "Naming" }, ...nav.slice(3)];

// A Server Component: only the search, theme toggle and mobile menu hydrate, so the data behind
// the search index stays on the server.
export default function Header({ active, tone = "surface" }: { active?: string; tone?: "surface" | "paper" }) {
  return (
    <header className={`sticky top-0 z-30 border-b border-gray-200 ${tone === "paper" ? "bg-paper" : "bg-surface"}`}>
      {/* First stop for keyboard users, so they can pass the header and sidebar in one key press. */}
      <a
        href="#main"
        className="sr-only rounded-md bg-brand px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50"
      >
        Skip to content
      </a>
      <MenuProvider>
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-sm font-bold text-gray-900">
              <Image src="/natuna-logo.svg" alt="" width={28} height={28} loading="eager" className="h-7 w-7" />
              <span>
                Natuna <span className="text-blue-800">Digilab</span>
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
                    className={`inline-flex min-h-11 items-center rounded-md px-3 transition-colors ${
                      current ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <CommandSearch entries={searchIndex} />
            <ThemeToggle />
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Source on GitHub"
              className="hidden h-11 w-11 md:flex items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <GithubLogo size={18} aria-hidden="true" />
            </a>
            <MenuButton />
          </div>
        </div>

        <MobileMenu items={mobileNav} active={active} repoUrl={REPO_URL} />
      </MenuProvider>
    </header>
  );
}
