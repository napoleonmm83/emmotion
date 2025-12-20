"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Video } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/shared";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-[80vh] flex items-center">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <span className="text-[150px] md:text-[200px] font-display leading-none gradient-text">
                404
              </span>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-4xl font-display text-foreground mb-4 tracking-wide">
                Seite nicht gefunden
              </h1>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Die gesuchte Seite existiert leider nicht oder wurde verschoben.
                Aber keine Sorge – hier findest du den Weg zurück.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                Zur Startseite
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Zurück
              </button>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="p-6 md:p-8">
              <p className="text-muted-foreground mb-4">
                Vielleicht suchst du eine dieser Seiten:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/leistungen"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-foreground/5 transition-colors group"
                >
                  <Video className="w-5 h-5 text-primary" />
                  <span className="text-foreground group-hover:text-primary transition-colors">
                    Leistungen
                  </span>
                </Link>
                <Link
                  href="/portfolio"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-foreground/5 transition-colors group"
                >
                  <Search className="w-5 h-5 text-primary" />
                  <span className="text-foreground group-hover:text-primary transition-colors">
                    Portfolio
                  </span>
                </Link>
                <Link
                  href="/kontakt"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-foreground/5 transition-colors group"
                >
                  <Home className="w-5 h-5 text-primary" />
                  <span className="text-foreground group-hover:text-primary transition-colors">
                    Kontakt
                  </span>
                </Link>
              </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
