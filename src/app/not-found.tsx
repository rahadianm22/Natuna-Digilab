import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buttonStyles } from "@/ui";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="" />
      <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-20">
        <p className="text-sm font-semibold text-blue-700">Error 404</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          This page doesn&rsquo;t exist
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-gray-600">
          The page or component may have been renamed, moved, or never shipped. Every component, including the
          planned ones, is listed on the components page.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/components"
            className={buttonStyles({ size: "lg" })}
          >
            Browse the components
          </Link>
          <Link
            href="/"
            className={buttonStyles({ variant: "ghost", size: "lg" })}
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
