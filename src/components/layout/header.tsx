"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";

// Navigation für Startseite (Mix aus Seiten-Links und Scroll-Ankern)
const homeNavItems = [
  { name: "Leistungen", href: "/leistungen" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Über mich", href: "#ueber-mich" },
  { name: "Kontakt", href: "#kontakt" },
];

// Navigation für Unterseiten (Links)
const pageNavItems = [
  { name: "Leistungen", href: "/leistungen" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Konfigurator", href: "/konfigurator" },
  { name: "Kontakt", href: "/kontakt" },
];

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const navItems = isHomePage ? homeNavItems : pageNavItems;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (isHomePage) {
        const sections = homeNavItems.map((item) => item.href.replace("#", ""));
        for (const section of [...sections].reverse()) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 150) {
              setActiveSection(`#${section}`);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(href.replace("#", ""));
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      scrollToSection(href);
    }
  };

  const isActive = (href: string) => {
    if (href.startsWith("#")) {
      return activeSection === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-accent z-[60] origin-left"
        style={{ scaleX }}
      />

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glassmorphism border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-light text-foreground tracking-wide hover:text-primary transition-colors duration-300"
          >
            emmotion
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) =>
              item.href.startsWith("#") ? (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative text-sm font-light tracking-wide transition-colors duration-300 ${
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
                    />
                  )}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-light tracking-wide transition-colors duration-300 ${
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
                    />
                  )}
                </Link>
              )
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 glassmorphism md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.href.startsWith("#") ? (
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`text-2xl font-light tracking-wide transition-colors duration-300 ${
                        isActive(item.href)
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-2xl font-light tracking-wide transition-colors duration-300 ${
                        isActive(item.href)
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
