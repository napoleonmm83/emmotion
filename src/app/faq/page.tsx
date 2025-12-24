import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FAQContent } from "./faq-content";
import { getFaqs, getSettings } from "@sanity/lib/data";

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

// =============================================================================
// FALLBACK DATA
// =============================================================================

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
            text: " kannst du eine unverbindliche Preisschätzung für dein Projekt erhalten.",
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
            text: " Ich bespreche mit dir deine Ziele und entwickle ein Konzept.",
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
            text: "Ja, zwei Korrekturschleifen sind im Preis inbegriffen. Du erhältst zunächst einen Rohschnitt zur Prüfung und kannst dann Anpassungen wünschen. Grössere Änderungen nach Freigabe werden separat berechnet.",
          },
        ],
      },
    ],
    category: "ablauf",
  },
  {
    _id: "fallback-6",
    question: "Wer bist du und was unterscheidet dich von anderen?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Ich bin Marcus Martini, Videograf mit TV-Erfahrung aus dem Regionalfernsehen. Im Gegensatz zu grossen Agenturen arbeitest du bei mir direkt mit dem Produzenten – persönlich, flexibel und ohne Umwege. Mein Fokus liegt auf authentischen Geschichten für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
          },
        ],
      },
    ],
    category: "allgemein",
  },
  {
    _id: "fallback-7",
    question: "Bietest du auch Drohnenaufnahmen an?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Ja, ich bin zertifizierter Drohnenpilot und biete professionelle Luftaufnahmen an. Drohnenaufnahmen können als Extra zu jedem Videoprojekt hinzugebucht werden und verleihen deinem Video eine beeindruckende Perspektive.",
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
            text: "Du erhältst die vollständigen Nutzungsrechte für alle vereinbarten Kanäle (Website, Social Media, Messen etc.). Die Rechte an der Musik und verwendeten Stockmaterial sind ebenfalls abgedeckt. Details werden im Angebot festgehalten.",
          },
        ],
      },
    ],
    category: "kosten",
  },
];

// =============================================================================
// HELPERS
// =============================================================================

type FAQItem = typeof FALLBACK_FAQS[number];

function extractPlainText(blocks: Array<{ children?: Array<{ text?: string }> }>): string {
  return blocks
    .map((block) => block.children?.map((child) => child.text || "").join("") || "")
    .join(" ")
    .trim();
}

function generateFAQSchema(faqs: FAQItem[]) {
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

// =============================================================================
// ASYNC CONTENT COMPONENT
// =============================================================================

async function FAQPageContent() {
  const [faqsData, settings] = await Promise.all([getFaqs(), getSettings()]);

  const faqs = (faqsData && Array.isArray(faqsData) && faqsData.length > 0)
    ? faqsData as FAQItem[]
    : FALLBACK_FAQS;

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
      <Footer settings={settings} />
    </>
  );
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function FAQSkeleton() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-16">
        <div className="container max-w-4xl">
          <div className="h-12 w-48 bg-muted animate-pulse rounded mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </main>
      <footer className="h-64 bg-muted/10 animate-pulse" />
    </>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function FAQPage() {
  return (
    <Suspense fallback={<FAQSkeleton />}>
      <FAQPageContent />
    </Suspense>
  );
}
