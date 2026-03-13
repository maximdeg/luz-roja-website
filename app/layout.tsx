import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const metadata: Metadata = {
  title: "Luz Roja Contenidos",
  description:
    "Encendemos la luz roja para contar historias que inspiran y construyen comunidades que perduran."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="page-container">
        <Header />
        <main className="page-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

