import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TanyaChat from "@/components/tanya/TanyaChat";

export const metadata: Metadata = {
  title: "Tanya Natuna",
  description: "Ask about components, tokens, and usage rules of the Natuna Digilab design system.",
  alternates: { canonical: "/tanya" },
};

export default function TanyaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-gray-900">
      <Header active="Tanya Natuna" tone="paper" />
      <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-3xl grow flex-col px-4 pb-10 pt-10 sm:px-6">
        <div className="flex flex-col gap-2 pb-6">
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.02em] text-gray-900">Tanya Natuna</h1>
          <p className="text-lg text-gray-700">
            Ask about components, tokens, and how to use the system. Anything the docs cover better, the answer points there.
          </p>
        </div>
        <div className="flex min-h-[560px] grow flex-col overflow-hidden rounded-3xl border border-gray-200 bg-role-bg-surface">
          <TanyaChat />
        </div>
      </main>
      <Footer />
    </div>
  );
}
