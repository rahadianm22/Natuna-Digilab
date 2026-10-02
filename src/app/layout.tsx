import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: { siteName: "Natuna Digilab", type: "website" },
  title: {
    default: "Natuna Digilab: design system for digital Indonesia",
    template: "%s · Natuna Digilab",
  },
  description:
    "Open-source components, design tokens, and guidelines built by Natuna Digilab for modern Indonesian digital products.",
};

const themeScript = `try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Runs before paint so a saved or system dark preference never flashes light first. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
