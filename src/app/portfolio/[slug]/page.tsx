import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPageContent } from "./project-content";

// Demo projects - will be replaced with Sanity data
const projects = [
  {
    title: "Corporate Vision",
    slug: "corporate-vision",
    category: "Imagefilm",
    industry: "Dienstleistung",
    thumbnail:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    client: "TechVision AG",
    year: "2024",
    challenge:
      "TechVision AG benötigte einen Imagefilm, der ihre innovative Unternehmenskultur und technische Expertise authentisch darstellt, um qualifizierte Fachkräfte anzuziehen.",
    solution:
      "Ich entwickelte ein Konzept, das die Mitarbeiter in den Mittelpunkt stellt und die moderne Arbeitsumgebung sowie spannende Projekte zeigt. Durch Interviews und B-Roll-Material entstand ein authentisches Porträt des Unternehmens.",
    result:
      "Der Imagefilm wird erfolgreich im Recruiting eingesetzt und hat die Bewerberquote um 40% gesteigert. Auf LinkedIn erreichte das Video über 50.000 Views.",
    testimonial: {
      quote:
        "Die Zusammenarbeit war von Anfang an professionell und unkompliziert. Das Ergebnis hat unsere Erwartungen übertroffen.",
      name: "Sarah Müller",
      role: "Marketing Leiterin",
      company: "TechVision AG",
    },
  },
  {
    title: "Summit 2024",
    slug: "summit-2024",
    category: "Eventdokumentation",
    industry: "Dienstleistung",
    thumbnail:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    client: "Swiss Business Forum",
    year: "2024",
    challenge:
      "Das Swiss Business Forum wollte ihren jährlichen Summit dokumentieren und ein Highlight-Video für Social Media und die Website erstellen.",
    solution:
      "Mit einem Mehrkamera-Setup habe ich die wichtigsten Keynotes, Networking-Momente und die Atmosphäre eingefangen. Schnelle Schnitte und dynamische Musik sorgen für einen packenden Gesamteindruck.",
    result:
      "Das Eventvideo wurde auf allen Kanälen geteilt und half, die Anmeldungen für das nächste Jahr zu steigern.",
  },
  {
    title: "Product Launch",
    slug: "product-launch",
    category: "Produktvideo",
    industry: "Industrie",
    thumbnail:
      "https://images.unsplash.com/photo-1551817958-c5b51e7b4a33?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    client: "InnoTech GmbH",
    year: "2024",
    challenge:
      "InnoTech GmbH brachte ein neues Industrieprodukt auf den Markt und benötigte ein Video, das die technischen Vorteile klar kommuniziert.",
    solution:
      "Ich kombinierte Produktaufnahmen mit 3D-Animationen, um die inneren Funktionen zu visualisieren. Klare Grafiken und ein professioneller Sprecher ergänzen das Video.",
    result:
      "Das Produktvideo wird auf Messen und der Website eingesetzt und hat die Anfragen um 25% gesteigert.",
  },
  {
    title: "Alpine Views",
    slug: "alpine-views",
    category: "Drohnenaufnahmen",
    industry: "Tourismus",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    client: "Tourismus Rheintal",
    year: "2024",
    challenge:
      "Die Region wollte ihre atemberaubende Landschaft in einem Imagevideo präsentieren, das Touristen anzieht.",
    solution:
      "Mit professionellen Drohnenaufnahmen habe ich die schönsten Orte der Region aus der Luft eingefangen. Unterschiedliche Tageszeiten und Jahreszeiten sorgen für Abwechslung.",
    result:
      "Das Video wird auf allen Tourismuskanälen eingesetzt und hat zu einer Steigerung der Website-Besuche geführt.",
  },
  {
    title: "Brand Story",
    slug: "brand-story",
    category: "Social Media",
    industry: "Handwerk",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    client: "Schreinerei Müller",
    year: "2023",
    challenge:
      "Die Schreinerei Müller wollte ihre Handwerkskunst und Leidenschaft für Holz auf Social Media präsentieren.",
    solution:
      "Ich erstellte eine Serie von kurzen, authentischen Videos, die den Arbeitsprozess und die fertigen Produkte zeigen. Der persönliche Touch des Inhabers steht im Mittelpunkt.",
    result:
      "Die Social Media Reichweite hat sich verdreifacht und mehrere neue Aufträge konnten direkt auf die Videos zurückgeführt werden.",
  },
  {
    title: "Interview Series",
    slug: "interview-series",
    category: "Imagefilm",
    industry: "Dienstleistung",
    thumbnail:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    client: "Consulting Partners",
    year: "2023",
    challenge:
      "Consulting Partners wollte ihre Expertise und Unternehmenskultur durch authentische Mitarbeiter-Interviews vermitteln.",
    solution:
      "Ich führte ausführliche Interviews mit Mitarbeitern aus verschiedenen Abteilungen und ergänzte diese mit Aufnahmen aus dem Arbeitsalltag.",
    result:
      "Die Interviewserie wird erfolgreich für Employer Branding und die Unternehmenswebsite eingesetzt.",
  },
  {
    title: "Restaurant Ambiance",
    slug: "restaurant-ambiance",
    category: "Imagefilm",
    industry: "Gastronomie",
    thumbnail:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    client: "Restaurant Rheinblick",
    year: "2023",
    challenge:
      "Das Restaurant Rheinblick wollte die Atmosphäre und kulinarische Qualität in einem stimmungsvollen Video einfangen.",
    solution:
      "Ich filmte während des Abendbetriebs und fing die Zubereitung der Gerichte, das Ambiente und die zufriedenen Gäste ein.",
    result:
      "Das Video wird auf der Website und Social Media eingesetzt und hat die Reservierungsanfragen gesteigert.",
  },
  {
    title: "Factory Tour",
    slug: "factory-tour",
    category: "Imagefilm",
    industry: "Industrie",
    thumbnail:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    client: "Metallbau Rheintal",
    year: "2023",
    challenge:
      "Metallbau Rheintal wollte ihre Produktionsanlagen und Fertigungsqualität potenziellen Kunden präsentieren.",
    solution:
      "Ich erstellte eine virtuelle Werkstour mit beeindruckenden Aufnahmen der Maschinen und des Fertigungsprozesses.",
    result:
      "Das Video wird bei Kundenbesuchen und auf der Website eingesetzt und vermittelt sofort Kompetenz und Qualität.",
  },
  {
    title: "Team Building Event",
    slug: "team-building-event",
    category: "Eventvideo",
    industry: "Dienstleistung",
    thumbnail:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    client: "Corporate Events AG",
    year: "2023",
    challenge:
      "Corporate Events AG wollte ihr Team-Building-Event dokumentieren, um es für Marketingzwecke zu nutzen.",
    solution:
      "Ich begleitete das Event den ganzen Tag und fing die besten Momente, Aktivitäten und Emotionen ein.",
    result:
      "Das Highlight-Video wird erfolgreich für die Vermarktung ähnlicher Events eingesetzt.",
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Projekt nicht gefunden",
    };
  }

  return {
    title: project.title,
    description: `${project.category} für ${project.client} - ${project.challenge?.slice(0, 150)}...`,
    openGraph: {
      title: `${project.title} | emmotion.ch`,
      description: `${project.category} für ${project.client}`,
      images: [{ url: project.thumbnail }],
    },
  };
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Get related projects (same category, excluding current)
  const relatedProjects = projects
    .filter((p) => p.category === project.category && p.slug !== project.slug)
    .slice(0, 3);

  return <ProjectPageContent project={project} relatedProjects={relatedProjects} />;
}
