import type { Metadata } from "next";
import "./globals.css";
import ClientCleanup from '@/components/ClientCleanup';

export const metadata: Metadata = {
  title: "Country Explorer",
  description: "Browse and search 250+ countries worldwide",
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
            <h1 className="text-3xl font-bold">🌍 Country Explorer</h1>
            <p className="text-blue-100">
              Browse and search 250+ countries worldwide
            </p>
          </div>
        </header>
        <main className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
