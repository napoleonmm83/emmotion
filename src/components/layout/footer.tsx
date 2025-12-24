import Link from "next/link";
import { Instagram, Linkedin, Youtube, Mail, MapPin } from "lucide-react";
import { CopyrightYear } from "./copyright-year";

const navigation = [
  { name: "Leistungen", href: "/leistungen" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Über mich", href: "/ueber-mich" },
  { name: "Konfigurator", href: "/konfigurator" },
  { name: "FAQ", href: "/faq" },
  { name: "Kontakt", href: "/kontakt" },
];

// Fallback Social Links
const defaultSocialLinks = [
  { name: "Instagram", href: "https://instagram.com/emmotion.ch", icon: Instagram },
  { name: "LinkedIn", href: "https://linkedin.com/in/marcusmartini", icon: Linkedin },
  { name: "YouTube", href: "https://youtube.com/@emmotion", icon: Youtube },
];

// Fallback Kontaktdaten
const defaultContact = {
  email: "hallo@emmotion.ch",
  street: "Kerbelstrasse 6",
  city: "9470 Buchs SG",
};

// Fallback Footer-Texte
const defaultFooter = {
  tagline: "Videoproduktion mit TV-Erfahrung für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
  ctaText: "Bereit für dein nächstes Videoprojekt? Ich freue mich auf deine Anfrage.",
  copyrightName: "emmotion",
};

interface FooterProps {
  settings?: {
    siteName?: string;
    contact?: {
      email?: string;
      phone?: string;
      street?: string;
      city?: string;
    };
    social?: {
      instagram?: string;
      linkedin?: string;
      youtube?: string;
    };
    footer?: {
      tagline?: string;
      ctaText?: string;
      copyrightName?: string;
    };
  } | null;
}

export function Footer({ settings }: FooterProps) {
  // CMS-Daten oder Fallbacks verwenden
  const contact = {
    email: settings?.contact?.email || defaultContact.email,
    street: settings?.contact?.street || defaultContact.street,
    city: settings?.contact?.city || defaultContact.city,
  };

  const footer = {
    tagline: settings?.footer?.tagline || defaultFooter.tagline,
    ctaText: settings?.footer?.ctaText || defaultFooter.ctaText,
    copyrightName: settings?.footer?.copyrightName || defaultFooter.copyrightName,
  };

  // Social Links aus CMS oder Fallback
  const socialLinks = settings?.social
    ? [
        settings.social.instagram && { name: "Instagram", href: settings.social.instagram, icon: Instagram },
        settings.social.linkedin && { name: "LinkedIn", href: settings.social.linkedin, icon: Linkedin },
        settings.social.youtube && { name: "YouTube", href: settings.social.youtube, icon: Youtube },
      ].filter(Boolean) as { name: string; href: string; icon: typeof Instagram }[]
    : defaultSocialLinks;
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-light text-foreground tracking-wide">
              {settings?.siteName || "emmotion"}
            </Link>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              {footer.tagline}
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-primary hover:bg-muted transition-colors duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">
              Kontakt
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-300"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  {contact.street}<br />
                  {contact.city}
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">
              Projekt starten
            </h4>
            <p className="text-muted-foreground text-sm mb-4">
              {footer.ctaText}
            </p>
            <Link
              href="/kontakt"
              className="inline-block px-6 py-3 gradient-primary text-foreground text-sm font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-300"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © <CopyrightYear /> {footer.copyrightName}. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            <Link
              href="/impressum"
              className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-300"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-300"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
