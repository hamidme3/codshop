import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { StorefrontShell } from "@/components/StorefrontShell";

export const metadata: Metadata = {
  title: "CODShop — Moroccan COD E-Commerce Platform",
  description: "Next-generation Moroccan e-commerce and Cash-On-Delivery SaaS platform.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <ThemeProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
