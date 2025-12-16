import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactPageContent } from "./contact-content";

export const metadata: Metadata = {
  title: "Kontakt | emmotion.ch",
  description:
    "Nehmen Sie Kontakt auf für Ihr nächstes Videoprojekt. Videoproduktion im Rheintal, Liechtenstein und der Ostschweiz.",
  openGraph: {
    title: "Kontakt | emmotion.ch",
    description:
      "Nehmen Sie Kontakt auf für Ihr nächstes Videoprojekt. Videoproduktion im Rheintal, Liechtenstein und der Ostschweiz.",
  },
};

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ContactPageContent />
      </main>
      <Footer />
    </>
  );
}
