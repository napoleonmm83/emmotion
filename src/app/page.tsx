import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  HeroSection,
  ServicesSection,
  PortfolioSection,
  TestimonialsSection,
  AboutSection,
  ContactSection,
  CTASection,
} from "@/components/sections";
import { client } from "@sanity/lib/client";
import { aboutPageQuery } from "@sanity/lib/queries";
import { urlFor } from "@sanity/lib/image";

async function getAboutData() {
  try {
    const data = await client.fetch(aboutPageQuery);
    if (!data) return null;

    return {
      name: data.name,
      profileImage: data.profileImage?.asset
        ? urlFor(data.profileImage).width(800).height(1000).url()
        : undefined,
      heroText: data.heroText,
      description: data.heroText, // Use heroText for the short description on homepage
    };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const aboutData = await getAboutData();

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <TestimonialsSection />
        <CTASection variant="konfigurator" />
        <AboutSection data={aboutData} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
