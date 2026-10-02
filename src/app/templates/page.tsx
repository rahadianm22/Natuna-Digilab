import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buttonStyles } from "@/ui";
import { ISSUES_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Templates",
  description: "Page templates built with Natuna Digilab components are not published yet.",
};

export default function TemplatesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="" />
      <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-20">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">No templates yet</h1>
        <p className="mt-5 text-lg leading-relaxed text-gray-600">
          Page templates will be assembled once enough components are ready to build full screens with. Until then,
          start from the components and foundations that exist today.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/components"
            className={buttonStyles({ size: "lg" })}
          >
            Browse the components
          </Link>
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles({ variant: "ghost", size: "lg" })}
          >
            Request a template
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
