import { Metadata } from "next";
import { PortfolioPageContent } from "./portfolio-content";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Entdecken Sie eine Auswahl meiner Videoprojekte – von Imagefilmen über Eventvideos bis hin zu Social Media Content.",
  openGraph: {
    title: "Portfolio | emmotion.ch",
    description:
      "Entdecken Sie eine Auswahl meiner Videoprojekte – von Imagefilmen über Eventvideos bis hin zu Social Media Content.",
  },
};

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
