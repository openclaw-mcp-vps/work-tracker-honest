import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkTracker Honest — Anonymous Time Tracking for Actual Productivity",
  description: "Track your real work hours anonymously. No accounts, no complex setup. Honest productivity measurement with local storage and optional cloud sync."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-[#c9d1d9] min-h-screen">{children}</body>
    </html>
  );
}
