import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TEMPLO OS — Soberanía Biológica",
  description: "Reclama tu Soberanía Biológica. El manual de instrucciones del Creador, decodificado por IA.",
  openGraph: {
    title: "TEMPLO OS — Soberanía Biológica",
    description: "El manual de instrucciones del Creador, decodificado por IA.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
