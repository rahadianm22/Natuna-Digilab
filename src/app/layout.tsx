import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, IBM_Plex_Mono, Urbanist } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  weight: ["400", "500", "600", "700", "800"],
});

// Code and hex values only. Plex Mono keeps 1, l, I and 0, O apart, which Urbanist does not, and its
// open shapes sit comfortably next to Urbanist's geometric forms.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  weight: ["400", "500", "600"],
});

// The landing page's voice: Bricolage for display, Geist for reading, Geist Mono for token labels.
// Documentation pages keep Urbanist, the Foundation's own typeface, so its specimens stay true.
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", weight: ["500", "700", "800"] });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", weight: ["400", "500", "600"] });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: { siteName: "Natuna Digilab", type: "website" },
  title: {
    default: "Natuna Digilab: design system for digital products",
    template: "%s · Natuna Digilab",
  },
  description:
    "Open-source components, design tokens, and guidelines built by Natuna Digilab for modern digital products.",
};

const themeScript = `try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} ${plexMono.variable} ${bricolage.variable} ${geist.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Runs before paint so a saved or system dark preference never flashes light first. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
