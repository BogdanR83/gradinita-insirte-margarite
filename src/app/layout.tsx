import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grădinița Înșir'te Mărgărite | Sector 4, București",
  description:
    "Site oficial al Grădiniței Înșir'te Mărgărite din Sectorul 4, București — contact, program, sediul principal și sediul Piticot.",
  openGraph: {
    title: "Grădinița Înșir'te Mărgărite",
    description:
      "Un loc vesel de învățare și joacă în Sectorul 4, București.",
    locale: "ro_RO",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${nunito.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
