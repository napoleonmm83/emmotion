import Link from "next/link";
import { Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

const navigation = [
  { name: "Leistungen", href: "/leistungen" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Über mich", href: "/ueber-mich" },
  { name: "Konfigurator", href: "/konfigurator" },
  { name: "FAQ", href: "/faq" },
  { name: "Kontakt", href: "/kontakt" },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/emmotion.ch", icon: Instagram },
  { name: "LinkedIn", href: "https://linkedin.com/in/emmotion", icon: Linkedin },
  { name: "YouTube", href: "https://youtube.com/@emmotion", icon: Youtube },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-light text-foreground tracking-wide">
              emmotion
            </Link>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              Videoproduktion mit TV-Erfahrung für Unternehmen im Rheintal,
              Liechtenstein und der Ostschweiz.
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
                  href="mailto:info@emmotion.ch"
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-300"
                >
                  info@emmotion.ch
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5" />
                <a
                  href="tel:+41791234567"
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-300"
                >
                  +41 79 XXX XX XX
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  Rheintal, Schweiz
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
              Bereit für Ihr nächstes Videoprojekt? Lassen Sie uns sprechen.
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
            © {new Date().getFullYear()} emmotion. Alle Rechte vorbehalten.
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
