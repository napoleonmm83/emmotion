/**
 * Script zum Importieren der Leistungen ins Sanity CMS
 *
 * Ausführen mit: npx tsx scripts/import-services.ts
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = join(process.cwd(), ".env.local");
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const [key, ...valueParts] = line.split("=");
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join("=").trim();
      }
    }
  } catch (e) {
    console.error("Could not load .env.local");
  }
}

loadEnv();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

interface ServiceData {
  _type: "service";
  title: string;
  slug: { _type: "slug"; current: string };
  icon: string;
  shortDescription: string;
  description: string;
  priceFrom: number;
  idealFor: string[];
  benefits: Array<{ _key: string; title: string; description: string }>;
  process: Array<{ _key: string; step: number; title: string; description: string }>;
  faq: Array<{ _key: string; question: string; answer: string }>;
  order: number;
}

// Die bestehenden hardcoded Leistungen
const services: ServiceData[] = [
  {
    _type: "service",
    title: "Imagefilme",
    slug: { _type: "slug", current: "imagefilm" },
    icon: "Film",
    shortDescription: "Professionelle Unternehmensvideos, die Ihre Marke authentisch und überzeugend präsentieren.",
    description: "Ein Imagefilm ist mehr als nur ein Video – er ist das Aushängeschild Ihres Unternehmens. Mit meiner TV-Erfahrung produziere ich authentische Unternehmensfilme, die Ihre Werte, Kultur und Stärken emotional vermitteln. Ob für die Website, Social Media oder Recruiting – ein professioneller Imagefilm schafft Vertrauen und bleibt im Gedächtnis.",
    priceFrom: 2400,
    idealFor: [
      "Unternehmenspräsentation",
      "Recruiting & Employer Branding",
      "Website & Social Media",
      "Investoren & Partner",
    ],
    benefits: [
      {
        _key: "b1",
        title: "Authentische Darstellung",
        description: "Echte Mitarbeiter, echte Geschichten – keine gestellten Szenen, sondern authentische Einblicke in Ihr Unternehmen.",
      },
      {
        _key: "b2",
        title: "TV-Qualität",
        description: "Professionelle Kameraführung, Beleuchtung und Ton auf dem Niveau von Fernsehproduktionen.",
      },
      {
        _key: "b3",
        title: "Strategisches Storytelling",
        description: "Eine durchdachte Geschichte, die Ihre Kernbotschaft emotional und einprägsam vermittelt.",
      },
      {
        _key: "b4",
        title: "Vielseitig einsetzbar",
        description: "Ein Hauptfilm plus optionale Kurzversionen für Social Media, Messen und Präsentationen.",
      },
    ],
    process: [
      {
        _key: "p1",
        step: 1,
        title: "Briefing & Konzept",
        description: "Ich bespreche mit Ihnen Ihre Ziele, Zielgruppe und Kernbotschaften und entwickle ein massgeschneidertes Konzept.",
      },
      {
        _key: "p2",
        step: 2,
        title: "Vorbereitung",
        description: "Planung der Drehorte, Interviewpartner und Shotlist. Sie erhalten einen detaillierten Ablaufplan.",
      },
      {
        _key: "p3",
        step: 3,
        title: "Produktion",
        description: "Professioneller Dreh vor Ort mit hochwertiger Kamera- und Tontechnik. Dauer: 1-2 Tage.",
      },
      {
        _key: "p4",
        step: 4,
        title: "Postproduktion",
        description: "Schnitt, Color Grading, Motion Graphics und Sound Design. Inklusive 2 Korrekturschleifen.",
      },
    ],
    faq: [
      {
        _key: "f1",
        question: "Wie lange dauert die Produktion eines Imagefilms?",
        answer: "Von der Konzeption bis zur Fertigstellung rechne ich mit 4-6 Wochen. Der Dreh selbst dauert je nach Umfang 1-2 Tage.",
      },
      {
        _key: "f2",
        question: "Können Mitarbeiter vor der Kamera sprechen?",
        answer: "Absolut! Ich bereite Ihre Mitarbeiter professionell vor und sorge für eine entspannte Atmosphäre. Die besten Aussagen entstehen oft spontan.",
      },
      {
        _key: "f3",
        question: "Erhalte ich auch Kurzversionen für Social Media?",
        answer: "Ja, gegen einen Aufpreis produziere ich gerne zusätzliche Schnitte in verschiedenen Formaten (16:9, 9:16, 1:1).",
      },
    ],
    order: 1,
  },
  {
    _type: "service",
    title: "Eventvideos",
    slug: { _type: "slug", current: "eventvideo" },
    icon: "Video",
    shortDescription: "Dynamische Dokumentation Ihrer Veranstaltungen – von Konferenzen bis zu Firmenfeiern.",
    description: "Ihre Veranstaltung verdient es, festgehalten zu werden. Ob Konferenz, Jubiläum, Produktlaunch oder Firmenevent – ich dokumentiere die Highlights, die Atmosphäre und die besonderen Momente. Das Ergebnis: Ein dynamisches Video, das die Energie Ihres Events einfängt und für künftiges Marketing nutzbar ist.",
    priceFrom: 1800,
    idealFor: [
      "Konferenzen & Seminare",
      "Firmenfeiern & Jubiläen",
      "Produktlaunches",
      "Messen & Ausstellungen",
    ],
    benefits: [
      {
        _key: "b1",
        title: "Unaufdringliche Dokumentation",
        description: "Ich arbeite diskret im Hintergrund und fange authentische Momente ein, ohne zu stören.",
      },
      {
        _key: "b2",
        title: "Highlight-Reel",
        description: "Ein kompaktes Video mit den besten Momenten – perfekt für Social Media und die Nachberichterstattung.",
      },
      {
        _key: "b3",
        title: "Schnelle Lieferung",
        description: "Auf Wunsch liefere ich bereits am nächsten Tag einen Rohschnitt für Ihre Social-Media-Kanäle.",
      },
      {
        _key: "b4",
        title: "Mehrkamera-Option",
        description: "Für grössere Events setze ich mehrere Kameras ein, um keine wichtigen Momente zu verpassen.",
      },
    ],
    process: [
      {
        _key: "p1",
        step: 1,
        title: "Vorbesprechung",
        description: "Ich bespreche mit Ihnen den Ablauf, wichtige Programmpunkte und Ihre Erwartungen an das Video.",
      },
      {
        _key: "p2",
        step: 2,
        title: "Event-Tag",
        description: "Ich bin vor, während und nach dem Event vor Ort und dokumentiere alle wichtigen Momente.",
      },
      {
        _key: "p3",
        step: 3,
        title: "Schnelle Vorschau",
        description: "Optional: Ein kurzer Teaser für Social Media bereits am nächsten Tag.",
      },
      {
        _key: "p4",
        step: 4,
        title: "Finales Video",
        description: "Das fertige Highlight-Video innerhalb von 1-2 Wochen nach dem Event.",
      },
    ],
    faq: [
      {
        _key: "f1",
        question: "Wie lange sollte ich Sie für ein Event buchen?",
        answer: "Das hängt vom Programm ab. Für ein Halbtages-Event reichen 4-5 Stunden, für ganztägige Events plane ich 8-10 Stunden ein.",
      },
      {
        _key: "f2",
        question: "Können Sie auch Interviews mit Teilnehmern führen?",
        answer: "Ja, kurze Testimonials oder Statements von Teilnehmern und Speakern können das Video aufwerten.",
      },
    ],
    order: 2,
  },
  {
    _type: "service",
    title: "Social Media Content",
    slug: { _type: "slug", current: "social-media" },
    icon: "Camera",
    shortDescription: "Kurze, wirkungsvolle Videos optimiert für Instagram, LinkedIn, TikTok und YouTube.",
    description: "Social Media erfordert regelmässigen, hochwertigen Content. Ich produziere kurze, aufmerksamkeitsstarke Videos, die für die jeweilige Plattform optimiert sind. Von Instagram Reels über LinkedIn-Posts bis zu TikTok-Trends – ich kenne die Anforderungen und liefere Content, der performt.",
    priceFrom: 600,
    idealFor: [
      "Instagram Reels & Stories",
      "LinkedIn Video-Posts",
      "TikTok Content",
      "YouTube Shorts",
    ],
    benefits: [
      {
        _key: "b1",
        title: "Plattform-optimiert",
        description: "Jedes Video wird für die jeweilige Plattform angepasst – Format, Länge, Untertitel, Hooks.",
      },
      {
        _key: "b2",
        title: "Content-Pakete",
        description: "Aus einem Drehtag entstehen mehrere Videos – effizient und kostensparend.",
      },
      {
        _key: "b3",
        title: "Trend-Know-how",
        description: "Ich beobachte aktuelle Trends und kann diese in Ihre Content-Strategie einbinden.",
      },
      {
        _key: "b4",
        title: "Schnelle Turnaround",
        description: "Social Media Content muss schnell gehen – Lieferung innerhalb weniger Tage.",
      },
    ],
    process: [
      {
        _key: "p1",
        step: 1,
        title: "Content-Planung",
        description: "Gemeinsam definieren wir Themen, Formate und einen Content-Kalender für die kommenden Wochen.",
      },
      {
        _key: "p2",
        step: 2,
        title: "Batch-Produktion",
        description: "An einem Drehtag produziere ich mehrere Videos auf einmal – effizient und konsistent.",
      },
      {
        _key: "p3",
        step: 3,
        title: "Postproduktion",
        description: "Schnitt, Untertitel, Musik und Branding. Lieferung in allen benötigten Formaten.",
      },
      {
        _key: "p4",
        step: 4,
        title: "Optimierung",
        description: "Nach Analyse der Performance passe ich die Strategie für zukünftigen Content an.",
      },
    ],
    faq: [
      {
        _key: "f1",
        question: "Wie viele Videos entstehen aus einem Drehtag?",
        answer: "Je nach Komplexität können 5-15 kurze Clips entstehen. Bei einfachen Formaten sogar mehr.",
      },
      {
        _key: "f2",
        question: "Können Sie auch bestehende Videos für Social Media umschneiden?",
        answer: "Ja, ich kann längere Videos in Social-Media-taugliche Kurzformate umwandeln.",
      },
    ],
    order: 3,
  },
  {
    _type: "service",
    title: "Drohnenaufnahmen",
    slug: { _type: "slug", current: "drohnenaufnahmen" },
    icon: "Plane",
    shortDescription: "Spektakuläre Luftaufnahmen für einzigartige Perspektiven.",
    description: "Drohnenaufnahmen verleihen jedem Video eine besondere Dimension. Ob weitläufige Landschaften, Immobilien aus der Vogelperspektive oder dynamische Tracking-Shots – ich bin zertifizierter Drohnenpilot und produziere atemberaubende Luftaufnahmen in 4K-Qualität.",
    priceFrom: 400,
    idealFor: [
      "Immobilien & Architektur",
      "Tourismus & Hotellerie",
      "Imagefilme",
      "Bauprojekte & Dokumentation",
    ],
    benefits: [
      {
        _key: "b1",
        title: "4K-Qualität",
        description: "Gestochen scharfe Aufnahmen in 4K-Auflösung für maximale Flexibilität in der Postproduktion.",
      },
      {
        _key: "b2",
        title: "Lizenziert & versichert",
        description: "Ich besitze alle nötigen Lizenzen und eine umfassende Haftpflichtversicherung.",
      },
      {
        _key: "b3",
        title: "Flexible Einsätze",
        description: "Von kurzen Ergänzungsaufnahmen bis zu umfangreichen Drohnenprojekten.",
      },
      {
        _key: "b4",
        title: "Professionelle Planung",
        description: "Sorgfältige Vorbereitung inklusive Wetter-Check und Genehmigungen.",
      },
    ],
    process: [
      {
        _key: "p1",
        step: 1,
        title: "Standortanalyse",
        description: "Prüfung der Flugbedingungen, Genehmigungen und optimalen Tageszeit.",
      },
      {
        _key: "p2",
        step: 2,
        title: "Flugplanung",
        description: "Definition der gewünschten Shots und Flugmanöver.",
      },
      {
        _key: "p3",
        step: 3,
        title: "Drohnenflug",
        description: "Professioneller Drohnenflug mit mehreren Durchgängen für optimales Material.",
      },
      {
        _key: "p4",
        step: 4,
        title: "Nachbearbeitung",
        description: "Color Grading und Stabilisierung für kinoreife Aufnahmen.",
      },
    ],
    faq: [
      {
        _key: "f1",
        question: "Dürfen Sie überall fliegen?",
        answer: "Nein, es gibt Flugverbotszonen und Einschränkungen. Ich prüfe vorab, ob ein Flug am gewünschten Ort möglich ist und hole ggf. Genehmigungen ein.",
      },
      {
        _key: "f2",
        question: "Was passiert bei schlechtem Wetter?",
        answer: "Bei Regen, starkem Wind oder schlechter Sicht wird der Termin kostenfrei verschoben.",
      },
    ],
    order: 4,
  },
  {
    _type: "service",
    title: "Produktvideos",
    slug: { _type: "slug", current: "produktvideo" },
    icon: "Clapperboard",
    shortDescription: "Präsentieren Sie Ihre Produkte im besten Licht.",
    description: "Ein gutes Produktvideo kann den Unterschied zwischen einem Kauf und einem Absprung machen. Ich inszeniere Ihre Produkte professionell – von einfachen E-Commerce-Clips bis zu aufwendigen Werbe-Spots. Mit der richtigen Beleuchtung, Kameraführung und Postproduktion wird Ihr Produkt zum Star.",
    priceFrom: 800,
    idealFor: [
      "E-Commerce & Online-Shops",
      "Amazon & Marktplätze",
      "Produktpräsentationen",
      "Werbespots",
    ],
    benefits: [
      {
        _key: "b1",
        title: "Verkaufsfördernd",
        description: "Videos, die Features und Benefits klar kommunizieren und zum Kauf animieren.",
      },
      {
        _key: "b2",
        title: "Professionelle Ausleuchtung",
        description: "Studioqualität mit professionellem Licht-Setup für beste Produktdarstellung.",
      },
      {
        _key: "b3",
        title: "Verschiedene Formate",
        description: "Vom 15-Sekunden-Spot bis zum ausführlichen Erklärvideo.",
      },
      {
        _key: "b4",
        title: "Animation & Motion Graphics",
        description: "Bei Bedarf ergänze ich animierte Texte, Grafiken oder 3D-Elemente.",
      },
    ],
    process: [
      {
        _key: "p1",
        step: 1,
        title: "Produktanalyse",
        description: "Welche Features sollen hervorgehoben werden? Welcher Stil passt zur Marke?",
      },
      {
        _key: "p2",
        step: 2,
        title: "Studio-Setup",
        description: "Professionelles Licht-Setup und Hintergrund für Ihre Produkte.",
      },
      {
        _key: "p3",
        step: 3,
        title: "Produktion",
        description: "Aufnahmen aus verschiedenen Winkeln, mit Bewegung und Detail-Shots.",
      },
      {
        _key: "p4",
        step: 4,
        title: "Postproduktion",
        description: "Schnitt, Color Grading und ggf. Motion Graphics für das perfekte Ergebnis.",
      },
    ],
    faq: [
      {
        _key: "f1",
        question: "Können Sie auch bei mir vor Ort drehen?",
        answer: "Ja, ich bringe mobiles Equipment mit. Für komplexere Setups empfehle ich jedoch ein Studio.",
      },
      {
        _key: "f2",
        question: "Wie viele Produkte können an einem Tag aufgenommen werden?",
        answer: "Bei ähnlichen Produkten können an einem Drehtag 5-10 Videos entstehen.",
      },
    ],
    order: 5,
  },
  {
    _type: "service",
    title: "Postproduktion",
    slug: { _type: "slug", current: "postproduktion" },
    icon: "Sparkles",
    shortDescription: "Professionelle Nachbearbeitung Ihrer Videos auf höchstem Niveau.",
    description: "Die Postproduktion macht aus gutem Material ein grossartiges Video. Ich biete professionellen Schnitt, Color Grading, Motion Graphics und Sound Design. Ob Sie eigenes Footage haben oder eine Komplettproduktion wünschen – ich bringe Ihr Material zum Glänzen.",
    priceFrom: 500,
    idealFor: [
      "Videoschnitt",
      "Color Grading",
      "Motion Graphics",
      "Sound Design",
    ],
    benefits: [
      {
        _key: "b1",
        title: "Professioneller Schnitt",
        description: "Storytelling-orientierter Schnitt mit Gespür für Timing und Rhythmus.",
      },
      {
        _key: "b2",
        title: "Cinematic Color Grading",
        description: "Filmischer Look durch professionelle Farbkorrektur und Grading.",
      },
      {
        _key: "b3",
        title: "Motion Graphics",
        description: "Animierte Titel, Lower Thirds, Logos und Infografiken.",
      },
      {
        _key: "b4",
        title: "Sound Design",
        description: "Musik-Lizenzierung, Soundeffekte und professionelle Tonmischung.",
      },
    ],
    process: [
      {
        _key: "p1",
        step: 1,
        title: "Material-Sichtung",
        description: "Ich sichte Ihr Material und bespreche mit Ihnen die Vision für das fertige Video.",
      },
      {
        _key: "p2",
        step: 2,
        title: "Rohschnitt",
        description: "Erster Schnitt zur Struktur und Länge – Sie geben Feedback.",
      },
      {
        _key: "p3",
        step: 3,
        title: "Feinschnitt & Grading",
        description: "Optimierung des Schnitts, Color Grading und erste Grafiken.",
      },
      {
        _key: "p4",
        step: 4,
        title: "Finalisierung",
        description: "Sound Design, finale Korrekturen und Export in gewünschten Formaten.",
      },
    ],
    faq: [
      {
        _key: "f1",
        question: "In welchen Formaten kann ich mein Material anliefern?",
        answer: "Ich arbeite mit allen gängigen Formaten (MP4, MOV, MXF, etc.). Optimal ist ProRes oder H.264/H.265.",
      },
      {
        _key: "f2",
        question: "Wie viele Korrekturschleifen sind inklusive?",
        answer: "Standardmässig sind 2 Korrekturschleifen inklusive. Weitere Änderungen werden nach Aufwand berechnet.",
      },
    ],
    order: 6,
  },
];

async function importServices() {
  console.log("🚀 Starte Import der Leistungen...\n");

  for (const service of services) {
    try {
      // Check if service already exists
      const existing = await client.fetch(
        `*[_type == "service" && slug.current == $slug][0]._id`,
        { slug: service.slug.current }
      );

      if (existing) {
        console.log(`⏭️  "${service.title}" existiert bereits (${existing})`);
        continue;
      }

      // Create new service
      const result = await client.create(service);
      console.log(`✅ "${service.title}" erstellt (${result._id})`);
    } catch (error) {
      console.error(`❌ Fehler bei "${service.title}":`, error);
    }
  }

  console.log("\n✨ Import abgeschlossen!");
}

importServices();
