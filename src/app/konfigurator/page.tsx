import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { KonfiguratorPageContent } from "./konfigurator-content";

export const metadata: Metadata = {
  title: "Video-Konfigurator | emmotion.ch",
  description:
    "Berechnen Sie den Preis für Ihr Videoprojekt. Imagefilm, Recruiting-Video, Produktvideo oder Social Media Content – konfigurieren Sie Ihr Wunschvideo.",
  openGraph: {
    title: "Video-Konfigurator | emmotion.ch",
    description:
      "Berechnen Sie den Preis für Ihr Videoprojekt. Konfigurieren Sie Ihr Wunschvideo und erhalten Sie eine unverbindliche Preisschätzung.",
  },
};

export default function KonfiguratorPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <KonfiguratorPageContent />
      </main>
      <Footer />
    </>
  );
}
