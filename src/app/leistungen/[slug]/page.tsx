// Seite alle 60 Sekunden revalidieren für CMS-Updates
export const revalidate = 60;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageContent } from "./service-content";
import { client } from "@sanity/lib/client";
import { serviceBySlugQuery, servicesQuery, settingsQuery } from "@sanity/lib/queries";
import { urlFor } from "@sanity/lib/image";

export interface ServiceDetail {
  iconName: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  priceFrom: number;
  idealFor: string[];
  benefits: Array<{ title: string; description: string }>;
  process: Array<{ step: number; title: string; description: string }>;
  faq: Array<{ question: string; answer: string }>;
  exampleVideos: Array<{ title: string; youtubeUrl: string; description?: string }>;
  relatedProjects: string[];
}

// Default fallback services for when Sanity has no data
const defaultServices: ServiceDetail[] = [
  {
    iconName: "Film",
    title: "Imagefilme",
    slug: "imagefilm",
    shortDescription:
      "Professionelle Unternehmensvideos, die deine Marke authentisch und überzeugend präsentieren.",
    description:
      "Ein Imagefilm ist mehr als nur ein Video – er ist das Aushängeschild deines Unternehmens. Mit meiner TV-Erfahrung produziere ich authentische Unternehmensfilme, die deine Werte, Kultur und Stärken emotional vermitteln. Ob für die Website, Social Media oder Recruiting – ein professioneller Imagefilm schafft Vertrauen und bleibt im Gedächtnis.",
    image:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
    priceFrom: 2400,
    idealFor: [
      "Unternehmenspräsentation",
      "Recruiting & Employer Branding",
      "Website & Social Media",
      "Investoren & Partner",
    ],
    benefits: [
      {
        title: "Authentische Darstellung",
        description:
          "Echte Mitarbeiter, echte Geschichten – keine gestellten Szenen, sondern authentische Einblicke in dein Unternehmen.",
      },
      {
        title: "TV-Qualität",
        description:
          "Professionelle Kameraführung, Beleuchtung und Ton auf dem Niveau von Fernsehproduktionen.",
      },
      {
        title: "Strategisches Storytelling",
        description:
          "Eine durchdachte Geschichte, die deine Kernbotschaft emotional und einprägsam vermittelt.",
      },
      {
        title: "Vielseitig einsetzbar",
        description:
          "Ein Hauptfilm plus optionale Kurzversionen für Social Media, Messen und Präsentationen.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Briefing & Konzept",
        description:
          "Ich bespreche mit dir deine Ziele, Zielgruppe und Kernbotschaften und entwickle ein massgeschneidertes Konzept.",
      },
      {
        step: 2,
        title: "Vorbereitung",
        description:
          "Planung der Drehorte, Interviewpartner und Shotlist. Du erhältst einen detaillierten Ablaufplan.",
      },
      {
        step: 3,
        title: "Produktion",
        description:
          "Professioneller Dreh vor Ort mit hochwertiger Kamera- und Tontechnik. Dauer: 1-2 Tage.",
      },
      {
        step: 4,
        title: "Postproduktion",
        description:
          "Schnitt, Color Grading, Motion Graphics und Sound Design. Inklusive 2 Korrekturschleifen.",
      },
    ],
    faq: [
      {
        question: "Wie lange dauert die Produktion eines Imagefilms?",
        answer:
          "Von der Konzeption bis zur Fertigstellung rechne ich mit 4-6 Wochen. Der Dreh selbst dauert je nach Umfang 1-2 Tage.",
      },
      {
        question: "Können Mitarbeiter vor der Kamera sprechen?",
        answer:
          "Absolut! Ich bereite deine Mitarbeiter professionell vor und sorge für eine entspannte Atmosphäre. Die besten Aussagen entstehen oft spontan.",
      },
      {
        question: "Erhalte ich auch Kurzversionen für Social Media?",
        answer:
          "Ja, gegen einen Aufpreis produziere ich gerne zusätzliche Schnitte in verschiedenen Formaten (16:9, 9:16, 1:1).",
      },
    ],
    exampleVideos: [],
    relatedProjects: ["corporate-vision", "interview-series"],
  },
  {
    iconName: "Video",
    title: "Eventvideos",
    slug: "eventvideo",
    shortDescription:
      "Dynamische Dokumentation deiner Veranstaltungen – von Konferenzen bis zu Firmenfeiern.",
    description:
      "Deine Veranstaltung verdient es, festgehalten zu werden. Ob Konferenz, Jubiläum, Produktlaunch oder Firmenevent – ich dokumentiere die Highlights, die Atmosphäre und die besonderen Momente. Das Ergebnis: Ein dynamisches Video, das die Energie deines Events einfängt und für künftiges Marketing nutzbar ist.",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    priceFrom: 1800,
    idealFor: [
      "Konferenzen & Seminare",
      "Firmenfeiern & Jubiläen",
      "Produktlaunches",
      "Messen & Ausstellungen",
    ],
    benefits: [
      {
        title: "Unaufdringliche Dokumentation",
        description:
          "Ich arbeite diskret im Hintergrund und fange authentische Momente ein, ohne zu stören.",
      },
      {
        title: "Highlight-Reel",
        description:
          "Ein kompaktes Video mit den besten Momenten – perfekt für Social Media und die Nachberichterstattung.",
      },
      {
        title: "Schnelle Lieferung",
        description:
          "Auf Wunsch liefere ich bereits am nächsten Tag einen Rohschnitt für deine Social-Media-Kanäle.",
      },
      {
        title: "Mehrkamera-Option",
        description:
          "Für grössere Events setze ich mehrere Kameras ein, um keine wichtigen Momente zu verpassen.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Vorbesprechung",
        description:
          "Ich bespreche mit dir den Ablauf, wichtige Programmpunkte und deine Erwartungen an das Video.",
      },
      {
        step: 2,
        title: "Event-Tag",
        description:
          "Ich bin vor, während und nach dem Event vor Ort und dokumentiere alle wichtigen Momente.",
      },
      {
        step: 3,
        title: "Schnelle Vorschau",
        description:
          "Optional: Ein kurzer Teaser für Social Media bereits am nächsten Tag.",
      },
      {
        step: 4,
        title: "Finales Video",
        description:
          "Das fertige Highlight-Video innerhalb von 1-2 Wochen nach dem Event.",
      },
    ],
    faq: [
      {
        question: "Wie lange sollte ich dich für ein Event buchen?",
        answer:
          "Das hängt vom Programm ab. Für ein Halbtages-Event reichen 4-5 Stunden, für ganztägige Events plane ich 8-10 Stunden ein.",
      },
      {
        question: "Kannst du auch Interviews mit Teilnehmern führen?",
        answer:
          "Ja, kurze Testimonials oder Statements von Teilnehmern und Speakern können das Video aufwerten.",
      },
    ],
    exampleVideos: [],
    relatedProjects: ["summit-2024", "team-building-event"],
  },
  {
    iconName: "Camera",
    title: "Social Media Content",
    slug: "social-media",
    shortDescription:
      "Kurze, wirkungsvolle Videos optimiert für Instagram, LinkedIn, TikTok und YouTube.",
    description:
      "Social Media erfordert regelmässigen, hochwertigen Content. Ich produziere kurze, aufmerksamkeitsstarke Videos, die für die jeweilige Plattform optimiert sind. Von Instagram Reels über LinkedIn-Posts bis zu TikTok-Trends – ich kenne die Anforderungen und liefere Content, der performt.",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
    priceFrom: 600,
    idealFor: [
      "Instagram Reels & Stories",
      "LinkedIn Video-Posts",
      "TikTok Content",
      "YouTube Shorts",
    ],
    benefits: [
      {
        title: "Plattform-optimiert",
        description:
          "Jedes Video wird für die jeweilige Plattform angepasst – Format, Länge, Untertitel, Hooks.",
      },
      {
        title: "Content-Pakete",
        description:
          "Aus einem Drehtag entstehen mehrere Videos – effizient und kostensparend.",
      },
      {
        title: "Trend-Know-how",
        description:
          "Ich beobachte aktuelle Trends und kann diese in Ihre Content-Strategie einbinden.",
      },
      {
        title: "Schnelle Turnaround",
        description:
          "Social Media Content muss schnell gehen – Lieferung innerhalb weniger Tage.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Content-Planung",
        description:
          "Gemeinsam definieren wir Themen, Formate und einen Content-Kalender für die kommenden Wochen.",
      },
      {
        step: 2,
        title: "Batch-Produktion",
        description:
          "An einem Drehtag produziere ich mehrere Videos auf einmal – effizient und konsistent.",
      },
      {
        step: 3,
        title: "Postproduktion",
        description:
          "Schnitt, Untertitel, Musik und Branding. Lieferung in allen benötigten Formaten.",
      },
      {
        step: 4,
        title: "Optimierung",
        description:
          "Nach Analyse der Performance passe ich die Strategie für zukünftigen Content an.",
      },
    ],
    faq: [
      {
        question: "Wie viele Videos entstehen aus einem Drehtag?",
        answer:
          "Je nach Komplexität können 5-15 kurze Clips entstehen. Bei einfachen Formaten sogar mehr.",
      },
      {
        question: "Kannst du auch bestehende Videos für Social Media umschneiden?",
        answer:
          "Ja, ich kann längere Videos in Social-Media-taugliche Kurzformate umwandeln.",
      },
    ],
    exampleVideos: [],
    relatedProjects: ["brand-story"],
  },
  {
    iconName: "Plane",
    title: "Drohnenaufnahmen",
    slug: "drohnenaufnahmen",
    shortDescription:
      "Spektakuläre Luftaufnahmen für einzigartige Perspektiven.",
    description:
      "Drohnenaufnahmen verleihen jedem Video eine besondere Dimension. Ob weitläufige Landschaften, Immobilien aus der Vogelperspektive oder dynamische Tracking-Shots – ich bin zertifizierter Drohnenpilot und produziere atemberaubende Luftaufnahmen in 4K-Qualität.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    priceFrom: 400,
    idealFor: [
      "Immobilien & Architektur",
      "Tourismus & Hotellerie",
      "Imagefilme",
      "Bauprojekte & Dokumentation",
    ],
    benefits: [
      {
        title: "4K-Qualität",
        description:
          "Gestochen scharfe Aufnahmen in 4K-Auflösung für maximale Flexibilität in der Postproduktion.",
      },
      {
        title: "Lizenziert & versichert",
        description:
          "Ich besitze alle nötigen Lizenzen und eine umfassende Haftpflichtversicherung.",
      },
      {
        title: "Flexible Einsätze",
        description:
          "Von kurzen Ergänzungsaufnahmen bis zu umfangreichen Drohnenprojekten.",
      },
      {
        title: "Professionelle Planung",
        description:
          "Sorgfältige Vorbereitung inklusive Wetter-Check und Genehmigungen.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Standortanalyse",
        description:
          "Prüfung der Flugbedingungen, Genehmigungen und optimalen Tageszeit.",
      },
      {
        step: 2,
        title: "Flugplanung",
        description:
          "Definition der gewünschten Shots und Flugmanöver.",
      },
      {
        step: 3,
        title: "Drohnenflug",
        description:
          "Professioneller Drohnenflug mit mehreren Durchgängen für optimales Material.",
      },
      {
        step: 4,
        title: "Nachbearbeitung",
        description:
          "Color Grading und Stabilisierung für kinoreife Aufnahmen.",
      },
    ],
    faq: [
      {
        question: "Darfst du überall fliegen?",
        answer:
          "Nein, es gibt Flugverbotszonen und Einschränkungen. Ich prüfe vorab, ob ein Flug am gewünschten Ort möglich ist und hole ggf. Genehmigungen ein.",
      },
      {
        question: "Was passiert bei schlechtem Wetter?",
        answer:
          "Bei Regen, starkem Wind oder schlechter Sicht wird der Termin kostenfrei verschoben.",
      },
    ],
    exampleVideos: [],
    relatedProjects: ["alpine-views"],
  },
  {
    iconName: "Clapperboard",
    title: "Produktvideos",
    slug: "produktvideo",
    shortDescription:
      "Präsentiere deine Produkte im besten Licht.",
    description:
      "Ein gutes Produktvideo kann den Unterschied zwischen einem Kauf und einem Absprung machen. Ich inszeniere deine Produkte professionell – von einfachen E-Commerce-Clips bis zu aufwendigen Werbe-Spots. Mit der richtigen Beleuchtung, Kameraführung und Postproduktion wird dein Produkt zum Star.",
    image:
      "https://images.unsplash.com/photo-1551817958-c5b51e7b4a33?auto=format&fit=crop&w=1200&q=80",
    priceFrom: 800,
    idealFor: [
      "E-Commerce & Online-Shops",
      "Amazon & Marktplätze",
      "Produktpräsentationen",
      "Werbespots",
    ],
    benefits: [
      {
        title: "Verkaufsfördernd",
        description:
          "Videos, die Features und Benefits klar kommunizieren und zum Kauf animieren.",
      },
      {
        title: "Professionelle Ausleuchtung",
        description:
          "Studioqualität mit professionellem Licht-Setup für beste Produktdarstellung.",
      },
      {
        title: "Verschiedene Formate",
        description:
          "Vom 15-Sekunden-Spot bis zum ausführlichen Erklärvideo.",
      },
      {
        title: "Animation & Motion Graphics",
        description:
          "Bei Bedarf ergänze ich animierte Texte, Grafiken oder 3D-Elemente.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Produktanalyse",
        description:
          "Welche Features sollen hervorgehoben werden? Welcher Stil passt zur Marke?",
      },
      {
        step: 2,
        title: "Studio-Setup",
        description:
          "Professionelles Licht-Setup und Hintergrund für deine Produkte.",
      },
      {
        step: 3,
        title: "Produktion",
        description:
          "Aufnahmen aus verschiedenen Winkeln, mit Bewegung und Detail-Shots.",
      },
      {
        step: 4,
        title: "Postproduktion",
        description:
          "Schnitt, Color Grading und ggf. Motion Graphics für das perfekte Ergebnis.",
      },
    ],
    faq: [
      {
        question: "Kannst du auch bei mir vor Ort drehen?",
        answer:
          "Ja, ich bringe mobiles Equipment mit. Für komplexere Setups empfehle ich jedoch ein Studio.",
      },
      {
        question: "Wie viele Produkte können an einem Tag aufgenommen werden?",
        answer:
          "Bei ähnlichen Produkten können an einem Drehtag 5-10 Videos entstehen.",
      },
    ],
    exampleVideos: [],
    relatedProjects: ["product-launch"],
  },
  {
    iconName: "Sparkles",
    title: "Postproduktion",
    slug: "postproduktion",
    shortDescription:
      "Professionelle Nachbearbeitung deiner Videos auf höchstem Niveau.",
    description:
      "Die Postproduktion macht aus gutem Material ein grossartiges Video. Ich biete professionellen Schnitt, Color Grading, Motion Graphics und Sound Design. Ob du eigenes Footage hast oder eine Komplettproduktion wünschst – ich bringe dein Material zum Glänzen.",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    priceFrom: 500,
    idealFor: [
      "Videoschnitt",
      "Color Grading",
      "Motion Graphics",
      "Sound Design",
    ],
    benefits: [
      {
        title: "Professioneller Schnitt",
        description:
          "Storytelling-orientierter Schnitt mit Gespür für Timing und Rhythmus.",
      },
      {
        title: "Cinematic Color Grading",
        description:
          "Filmischer Look durch professionelle Farbkorrektur und Grading.",
      },
      {
        title: "Motion Graphics",
        description:
          "Animierte Titel, Lower Thirds, Logos und Infografiken.",
      },
      {
        title: "Sound Design",
        description:
          "Musik-Lizenzierung, Soundeffekte und professionelle Tonmischung.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Material-Sichtung",
        description:
          "Ich sichte dein Material und bespreche mit dir die Vision für das fertige Video.",
      },
      {
        step: 2,
        title: "Rohschnitt",
        description:
          "Erster Schnitt zur Struktur und Länge – du gibst Feedback.",
      },
      {
        step: 3,
        title: "Feinschnitt & Grading",
        description:
          "Optimierung des Schnitts, Color Grading und erste Grafiken.",
      },
      {
        step: 4,
        title: "Finalisierung",
        description:
          "Sound Design, finale Korrekturen und Export in gewünschten Formaten.",
      },
    ],
    faq: [
      {
        question: "In welchen Formaten kann ich mein Material anliefern?",
        answer:
          "Ich arbeite mit allen gängigen Formaten (MP4, MOV, MXF, etc.). Optimal ist ProRes oder H.264/H.265.",
      },
      {
        question: "Wie viele Korrekturschleifen sind inklusive?",
        answer:
          "Standardmässig sind 2 Korrekturschleifen inklusive. Weitere Änderungen werden nach Aufwand berechnet.",
      },
    ],
    exampleVideos: [],
    relatedProjects: [],
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface SanityService {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  icon?: string;
  idealFor?: string[];
  priceFrom?: number;
  featuredImage?: { asset: { _ref: string } };
  benefits?: Array<{ title: string; description: string }>;
  process?: Array<{ step: number; title: string; description: string }>;
  faq?: Array<{ question: string; answer: string }>;
  exampleVideos?: Array<{ title: string; youtubeUrl: string; description?: string }>;
  relatedProjects?: Array<{ _id: string; title: string; slug: string }>;
  seo?: { metaTitle?: string; metaDescription?: string };
}

async function getSettings() {
  try {
    return await client.fetch(settingsQuery);
  } catch {
    return null;
  }
}

async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  try {
    const sanityService = await client.fetch<SanityService>(serviceBySlugQuery, { slug });

    if (!sanityService) {
      // Fall back to default services
      return defaultServices.find((s) => s.slug === slug) || null;
    }

    return {
      iconName: sanityService.icon || "Film",
      title: sanityService.title,
      slug: sanityService.slug,
      shortDescription: sanityService.shortDescription || "",
      description: sanityService.description || sanityService.shortDescription || "",
      image: sanityService.featuredImage?.asset
        ? urlFor(sanityService.featuredImage).width(1200).height(800).url()
        : "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
      priceFrom: sanityService.priceFrom || 0,
      idealFor: sanityService.idealFor || [],
      benefits: sanityService.benefits || [],
      process: sanityService.process || [],
      faq: sanityService.faq || [],
      exampleVideos: sanityService.exampleVideos || [],
      relatedProjects: sanityService.relatedProjects?.map((p) => p.slug) || [],
    };
  } catch {
    // Fall back to default services on error
    return defaultServices.find((s) => s.slug === slug) || null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Leistung nicht gefunden",
    };
  }

  return {
    title: service.title,
    description: service.shortDescription,
    openGraph: {
      title: `${service.title} | emmotion.ch`,
      description: service.shortDescription,
      images: [{ url: service.image }],
    },
  };
}

export async function generateStaticParams() {
  try {
    const sanityServices = await client.fetch<Array<{ slug: string }>>(servicesQuery);
    if (sanityServices && sanityServices.length > 0) {
      return sanityServices.map((service) => ({
        slug: service.slug,
      }));
    }
  } catch {
    // Fall back to default services
  }

  return defaultServices.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSettings()]);

  if (!service) {
    notFound();
  }

  return <ServicePageContent service={service} settings={settings} />;
}
