import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-light text-foreground mb-4">emmotion</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Videoproduktion mit TV-Erfahrung für Unternehmen im Rheintal, 
              Liechtenstein und der Ostschweiz.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/leistungen" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-400">
                  Leistungen
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-400">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/ueber-mich" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-400">
                  Über mich
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-400">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Kontakt</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>Rheintal, Schweiz</li>
              <li>info@emmotion.ch</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} emmotion. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            <Link to="/impressum" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-400">
              Impressum
            </Link>
            <Link to="/datenschutz" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-400">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
