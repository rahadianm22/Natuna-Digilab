import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ISSUES_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy statement",
  alternates: { canonical: "/privacy" },
  description:
    "How the Natuna Digilab documentation site handles data: it doesn't collect any.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="" />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-2xl px-6 pb-24 pt-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Privacy statement</h1>
        <p className="mt-5 text-lg leading-relaxed text-gray-700">
          This documentation site is a static, open-source project. It does not collect,
          store, or share personal data.
        </p>

        <h2 className="mt-10 mb-3 text-xl font-bold text-gray-900">What we collect</h2>
        <p className="text-gray-700">
          Nothing. There are no accounts, no contact forms, and no analytics or tracking
          scripts. We do not set cookies, and nothing you type into the component search
          leaves your browser. Your light or dark mode choice is saved in your browser&rsquo;s local storage
          and never sent anywhere.
        </p>

        <h2 className="mt-10 mb-3 text-xl font-bold text-gray-900">Third parties</h2>
        <p className="text-gray-700">
          Links to GitHub and other external sites are governed by those services&rsquo; own
          privacy policies. Your hosting provider may keep standard server logs, which are
          outside the scope of this site.
        </p>

        <h2 className="mt-10 mb-3 text-xl font-bold text-gray-900">Questions</h2>
        <p className="text-gray-700">
          <a href={ISSUES_URL} target="_blank" rel="noreferrer" className="font-medium text-blue-800 underline underline-offset-4 hover:text-blue-900">
            Open an issue
          </a>{" "}
          on the project repository and we&rsquo;ll respond there in the open.
        </p>
      </main>
      <Footer />
    </div>
  );
}
