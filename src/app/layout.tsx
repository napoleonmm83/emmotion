import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { BackToTop } from "@/components/shared";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "emmotion.ch | Videoproduktion mit TV-Erfahrung",
    template: "%s | emmotion.ch",
  },
  description:
    "Professionelle Videoproduktion für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz. Imagefilme, Eventvideos, Social Media Content und mehr.",
  keywords: [
    "Videoproduktion",
    "Imagefilm",
    "Rheintal",
    "Liechtenstein",
    "Ostschweiz",
    "Unternehmensfilm",
    "Eventvideo",
    "Social Media",
  ],
  authors: [{ name: "emmotion.ch" }],
  creator: "emmotion.ch",
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: "https://emmotion.ch",
    siteName: "emmotion.ch",
    title: "emmotion.ch | Videoproduktion mit TV-Erfahrung",
    description:
      "Professionelle Videoproduktion für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
  },
  twitter: {
    card: "summary_large_image",
    title: "emmotion.ch | Videoproduktion mit TV-Erfahrung",
    description:
      "Professionelle Videoproduktion für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
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
    <html lang="de" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="min-h-screen bg-background antialiased">
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
