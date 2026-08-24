import type { Metadata } from "next";
import { Hind, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BackToTopButton } from "./components/back-to-top-button";

const hind = Hind({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat"
});

export const metadata: Metadata = {
  title: "Luz Roja Contenidos",
  description:
    "Encendemos la luz roja para contar historias que inspiran y construyen comunidades que perduran.",
  icons: {
    icon: "/icons/favicon.png",
    shortcut: "/icons/favicon.png",
    apple: "/icons/favicon.png"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`page-container ${hind.className} ${hind.variable} ${montserrat.variable}`}
      >
        <Header />
        <main className="page-main">{children}</main>
        <Footer />
        <BackToTopButton />
        <Analytics />
      </body>
    </html>
  );
}

