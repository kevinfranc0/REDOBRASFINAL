import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";

const dm = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "REDOBRA Popayán — Conecta, crea, construye",
    template: "%s · REDOBRA Popayán",
  },
  description:
    "La plataforma que une a estudiantes, profesionales y emprendedores de arquitectura, ingeniería y construcción en Popayán.",
  applicationName: "REDOBRA",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0c3b2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={`${dm.className} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
