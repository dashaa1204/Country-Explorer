import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import ClientCleanup from "@/components/ClientCleanup";

export const metadata: Metadata = {
  title: "Country Explorer — Travel Routes",
  description:
    "Get 2-3 practical travel routes for every country. Search, save, and plan your next trip.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <ClientCleanup />
          <div className="container mx-auto">
            <Link href="/" className="block hover:opacity-90 transition-opacity">
              <h1 className="text-3xl font-bold">✈️ Country Explorer</h1>
              <p className="text-blue-100">
                2-3 travel routes for every country - duration, stops, and plan
              </p>
            </Link>
          </div>
        </header>
        <main className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
