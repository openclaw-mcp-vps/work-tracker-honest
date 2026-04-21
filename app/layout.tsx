import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Space_Grotesk, Geist } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://work-tracker-honest.example"),
  title: {
    default: "Work Tracker Honest | Anonymous productivity insights",
    template: "%s | Work Tracker Honest"
  },
  description:
    "Anonymous time tracking for actual productivity. Understand focus time, distractions, and real work patterns without invasive surveillance.",
  keywords: [
    "anonymous time tracking",
    "remote productivity",
    "focus insights",
    "privacy-first tracker",
    "work pattern analytics"
  ],
  openGraph: {
    type: "website",
    title: "Work Tracker Honest",
    description:
      "Measure how your day really flows with privacy-first activity tracking and practical productivity insights.",
    siteName: "Work Tracker Honest"
  },
  twitter: {
    card: "summary_large_image",
    title: "Work Tracker Honest",
    description: "Anonymous time tracking for remote workers who want truth, not guilt."
  }
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
  colorScheme: "dark"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(headingFont.variable, monoFont.variable, "font-sans", geist.variable)}>
      <body className="bg-[#0d1117] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
