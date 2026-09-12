import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { StorefrontShell } from "@/components/StorefrontShell";
import { Inter, Playfair_Display, JetBrains_Mono, Cairo } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CODShop — Moroccan COD E-Commerce Platform",
  description: "Next-generation Moroccan e-commerce and Cash-On-Delivery SaaS platform.",
  robots: {
    index: process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true",
    follow: process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true",
    nocache: false,
    googleBot: {
      index: process.env.VERCEL_ENV === "production",
      follow: process.env.VERCEL_ENV === "production",
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} ${cairo.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
