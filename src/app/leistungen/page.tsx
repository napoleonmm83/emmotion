import { Metadata } from "next";
import { LeistungenPageContent } from "./leistungen-content";

export const metadata: Metadata = {
  title: "Leistungen",
  description:
    "Professionelle Videoproduktion: Imagefilme, Eventvideos, Social Media Content, Drohnenaufnahmen, Produktvideos und Postproduktion.",
  openGraph: {
    title: "Leistungen | emmotion.ch",
    description:
      "Professionelle Videoproduktion: Imagefilme, Eventvideos, Social Media Content, Drohnenaufnahmen, Produktvideos und Postproduktion.",
  },
};

export default function LeistungenPage() {
  return <LeistungenPageContent />;
}
