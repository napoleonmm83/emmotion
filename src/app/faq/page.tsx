import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FAQContent } from "./faq-content";
import { client } from "@sanity/lib/client";
import { faqsQuery } from "@sanity/lib/queries";

export const metadata: Metadata = {
  title: "FAQ | emmotion.ch",
  description:
    "Häufig gestellte Fragen zur Videoproduktion. Antworten zu Kosten, Ablauf, Technik und mehr.",
  openGraph: {
    title: "FAQ | emmotion.ch",
    description:
      "Häufig gestellte Fragen zur Videoproduktion. Antworten zu Kosten, Ablauf, Technik und mehr.",
  },
};

// Fallback FAQs when no data in Sanity
const FALLBACK_FAQS = [
  {
    _id: "fallback-1",
    question: "Was kostet ein Imagevideo?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Die Kosten für ein Imagevideo variieren je nach Umfang, Länge und Komplexität. Ein einfaches Imagevideo beginnt ab ca. CHF 2'400. Mit dem ",
          },
          {
            _type: "span",
            marks: ["strong"],
            text: "Video-Konfigurator",
          },
          {
            _type: "span",
            text: " können Sie eine unverbindliche Preisschätzung für Ihr Projekt erhalten.",
          },
        ],
      },
    ],
    category: "kosten",
  },
  {
    _id: "fallback-2",
    question: "Wie lange dauert die Produktion eines Videos?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Die Produktionszeit hängt vom Projektumfang ab. Ein typisches Imagevideo dauert ca. 2-4 Wochen von der Planung bis zur Fertigstellung. Für dringende Projekte biete ich auch einen Express-Service an.",
          },
        ],
      },
    ],
    category: "ablauf",
  },
  {
    _id: "fallback-3",
    question: "Wie läuft eine Videoproduktion ab?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Der Ablauf gliedert sich in vier Phasen:",
          },
        ],
      },
      {
        _type: "block",
        listItem: "number",
        children: [
          {
            _type: "span",
            marks: ["strong"],
            text: "Beratung & Konzept:",
          },
          {
            _type: "span",
            text: " Ich bespreche mit Ihnen Ihre Ziele und entwickle ein Konzept.",
          },
        ],
      },
      {
        _type: "block",
        listItem: "number",
        children: [
          {
            _type: "span",
            marks: ["strong"],
            text: "Planung:",
          },
          {
            _type: "span",
            text: " Drehbuch, Zeitplan und Vorbereitung.",
          },
        ],
      },
      {
        _type: "block",
        listItem: "number",
        children: [
          {
            _type: "span",
            marks: ["strong"],
            text: "Dreh:",
          },
          {
            _type: "span",
            text: " Professionelle Aufnahmen vor Ort.",
          },
        ],
      },
      {
        _type: "block",
        listItem: "number",
        children: [
          {
            _type: "span",
            marks: ["strong"],
            text: "Postproduktion:",
          },
          {
            _type: "span",
            text: " Schnitt, Farbkorrektur, Musik und Effekte.",
          },
        ],
      },
    ],
    category: "ablauf",
  },
  {
    _id: "fallback-4",
    question: "In welcher Qualität wird gefilmt?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Ich filme standardmässig in 4K-Auflösung mit professionellem Kameraequipment. Das garantiert höchste Bildqualität und Flexibilität in der Postproduktion. Auf Wunsch sind auch andere Formate möglich.",
          },
        ],
      },
    ],
    category: "technik",
  },
  {
    _id: "fallback-5",
    question: "Kann ich Änderungen am fertigen Video verlangen?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Ja, zwei Korrekturschleifen sind im Preis inbegriffen. Sie erhalten zunächst einen Rohschnitt zur Prüfung und können dann Anpassungen wünschen. Grössere Änderungen nach Freigabe werden separat berechnet.",
          },
        ],
      },
    ],
    category: "ablauf",
  },
  {
    _id: "fallback-6",
    question: "Wer sind Sie und was unterscheidet Sie von anderen?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Ich bin Marcus Martini, Videograf mit TV-Erfahrung aus dem Regionalfernsehen. Im Gegensatz zu grossen Agenturen arbeiten Sie bei mir direkt mit dem Produzenten – persönlich, flexibel und ohne Umwege. Mein Fokus liegt auf authentischen Geschichten für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
          },
        ],
      },
    ],
    category: "allgemein",
  },
  {
    _id: "fallback-7",
    question: "Bieten Sie auch Drohnenaufnahmen an?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Ja, ich bin zertifizierter Drohnenpilot und biete professionelle Luftaufnahmen an. Drohnenaufnahmen können als Extra zu jedem Videoprojekt hinzugebucht werden und verleihen Ihrem Video eine beeindruckende Perspektive.",
          },
        ],
      },
    ],
    category: "technik",
  },
  {
    _id: "fallback-8",
    question: "Welche Rechte erhalte ich am fertigen Video?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Sie erhalten die vollständigen Nutzungsrechte für alle vereinbarten Kanäle (Website, Social Media, Messen etc.). Die Rechte an der Musik und verwendeten Stockmaterial sind ebenfalls abgedeckt. Details werden im Angebot festgehalten.",
          },
        ],
      },
    ],
    category: "kosten",
  },
];

async function getFAQs() {
  try {
    const faqs = await client.fetch(faqsQuery);
    return faqs && faqs.length > 0 ? faqs : FALLBACK_FAQS;
  } catch {
    return FALLBACK_FAQS;
  }
}

// Extract plain text from Portable Text blocks
function extractPlainText(blocks: Array<{ children?: Array<{ text?: string }> }>): string {
  return blocks
    .map((block) => block.children?.map((child) => child.text || "").join("") || "")
    .join(" ")
    .trim();
}

// Generate Schema.org FAQ structured data
function generateFAQSchema(faqs: typeof FALLBACK_FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: extractPlainText(faq.answer),
      },
    })),
  };
}

export default async function FAQPage() {
  const faqs = await getFAQs();
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <main className="pt-20 pb-16">
        <FAQContent faqs={faqs} />
      </main>
      <Footer />
    </>
  );
}
