import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Header } from "@/components/nav/header";
import { Footer } from "@/components/nav/footer";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SoftRYT — AI-Powered SaaS Comparison Platform",
    template: "%s | SoftRYT",
  },
  description:
    "Find the right B2B SaaS tool for your team. AI-powered, data-driven comparison pages with real pricing and feature analysis.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://softryt.com"
  ),
  openGraph: {
    type: "website",
    siteName: "SoftRYT",
    title: "SoftRYT — AI-Powered SaaS Comparison Platform",
    description:
      "Find the right B2B SaaS tool for your team. AI-powered, data-driven comparison pages with real pricing and feature analysis.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
