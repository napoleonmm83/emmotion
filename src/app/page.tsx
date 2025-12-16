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

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <TestimonialsSection />
        <CTASection variant="konfigurator" />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
