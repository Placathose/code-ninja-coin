import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Code Ninja Coin",
  description: "A modern web application with Next.js, Supabase, and Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen">
        {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
