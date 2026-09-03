import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeSelectorBar } from "@/components/ThemeSelectorBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "CODShop — Boutique E-Commerce Maroc & Paiement à la Livraison",
  description: "Plateforme e-commerce nouvelle génération pensée pour le marché marocain. Produits certifiés, livraison express 24h/48h et paiement en espèces à la livraison.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider>
          <ThemeSelectorBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
