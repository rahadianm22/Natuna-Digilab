import Link from "next/link";

import { FIGMA_COMMUNITY_URL, ISSUES_URL, REPO_URL } from "@/lib/site";

const docsLinks = [
  { href: "/docs", label: "Introduction" },
  { href: "/foundation", label: "Foundation" },
  { href: "/components", label: "Components" },
  { href: "/naming", label: "Naming" },
  { href: "/themes", label: "Themes" },
];

const projectLinks = [
  { href: REPO_URL, label: "GitHub source", external: true },
  { href: ISSUES_URL, label: "Report an issue", external: true },
  { href: FIGMA_COMMUNITY_URL, label: "Figma Community file", external: true },
  { href: "/privacy", label: "Privacy", external: false },
];

const linkClass = "inline-flex min-h-11 items-center text-[15px] text-gray-900 transition-colors hover:text-blue-800 sm:py-1";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap justify-between gap-x-16 gap-y-8 px-6 pb-10 pt-12">
        <div className="flex flex-[1_1_260px] flex-col gap-3">
          <Link
            href="/"
            className="self-start font-display text-[clamp(32px,4.5vw,48px)] font-extrabold leading-none tracking-[-0.035em] text-gray-900"
          >
            Natuna
            <br />
            Digilab
          </Link>
          <p className="text-sm text-gray-700">&copy; {new Date().getFullYear()} Natuna Digilab. Site in beta, built on Foundation Design System v1.0.</p>
        </div>

        <div className="flex flex-col items-start gap-8 sm:items-end">
        <div className="flex flex-wrap gap-x-16 gap-y-8">
          <nav aria-label="Docs" className="flex flex-col gap-1.5">
            <h2 className="font-label text-xs font-normal text-gray-700">Docs</h2>
            {docsLinks.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass}>
                {l.label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Project" className="flex flex-col gap-1.5">
            <h2 className="font-label text-xs font-normal text-gray-700">Project</h2>
            {projectLinks.map((l) =>
              l.external ? (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={linkClass}>
                  {l.label}
                </a>
              ) : (
                <Link key={l.href} href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              ),
            )}
          </nav>
        </div>
          <a
            href="#main"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-300 px-4 text-sm font-medium text-gray-900 transition-colors hover:border-gray-500"
          >
            <span aria-hidden="true">↑</span>
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
