import Image from "next/image";
import Link from "next/link";

import { FIGMA_COMMUNITY_URL, ISSUES_URL, REPO_URL } from "@/lib/site";

const siteLinks = [
  { href: "/docs", label: "Introduction" },
  { href: "/foundation", label: "Foundation" },
  { href: "/components", label: "Components" },
  { href: "/themes", label: "Themes" },
];

const projectLinks = [
  { href: REPO_URL, label: "Source on GitHub", external: true },
  { href: ISSUES_URL, label: "Report an issue", external: true },
  { href: FIGMA_COMMUNITY_URL, label: "Figma Community file", external: true },
  { href: "/privacy", label: "Privacy statement", external: false },
];

const linkClass =
  "inline-flex min-h-11 items-center rounded-sm text-sm text-gray-600 transition-colors hover:text-blue-700 sm:min-h-0 sm:py-1";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-surface">
      <div className="mx-auto w-full max-w-7xl px-6 pb-8 pt-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex min-h-11 items-center gap-3 rounded-sm font-bold text-gray-900">
              <Image src="/natuna-logo.svg" alt="" width={36} height={36} className="h-9 w-9" />
              <span className="text-lg">
                Natuna <span className="text-blue-700">Digilab</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Open-source components, design tokens, and guidelines for Indonesian digital
              products. Currently v0.1, in beta.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:gap-x-16">
            <nav aria-label="Design system">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">Design system</h2>
              <ul className="space-y-1">
                {siteLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Project">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">Project</h2>
              <ul className="space-y-1">
                {projectLinks.map((l) => (
                  <li key={l.href}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noreferrer" className={linkClass}>
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-gray-200 pt-6 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Natuna Digilab</p>
          <a href="#" className="inline-flex min-h-11 items-center self-start rounded-sm hover:text-blue-700 sm:min-h-0 sm:self-auto">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
