import type { StructureResolver } from "sanity/structure";

/**
 * Benutzerdefinierte Sanity Studio Struktur
 * Gruppiert und sortiert die Dokument-Typen logisch
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Inhalt")
    .items([
      // ===== SEITEN =====
      S.listItem()
        .title("Seiten")
        .icon(() => "📝")
        .child(
          S.list()
            .title("Seiten")
            .items([
              // Startseite - Singleton
              S.listItem()
                .title("Startseite")
                .icon(() => "🏠")
                .child(
                  S.document()
                    .schemaType("homePage")
                    .documentId("homePage")
                    .title("Startseite")
                ),
              // Über mich - Singleton
              S.listItem()
                .title("Über mich")
                .icon(() => "👤")
                .child(
                  S.document()
                    .schemaType("aboutPage")
                    .documentId("aboutPage")
                    .title("Über mich")
                ),
              // Portfolio-Seite - Singleton
              S.listItem()
                .title("Portfolio-Seite")
                .icon(() => "🖼️")
                .child(
                  S.document()
                    .schemaType("portfolioPage")
                    .documentId("portfolioPage")
                    .title("Portfolio-Seite Einstellungen")
                ),
              // Leistungen
              S.documentTypeListItem("service").title("Leistungen").icon(() => "🎬"),
              // Portfolio/Projekte
              S.documentTypeListItem("project").title("Portfolio-Projekte").icon(() => "🎥"),
              // FAQ
              S.documentTypeListItem("faq").title("FAQ").icon(() => "❓"),
              // Rechtliche Seiten
              S.documentTypeListItem("legalPage").title("Rechtliches").icon(() => "⚖️"),
            ])
        ),

      S.divider(),

      // ===== KONTAKT =====
      S.listItem()
        .title("Kontakt")
        .icon(() => "📬")
        .child(
          S.list()
            .title("Kontakt")
            .items([
              S.listItem()
                .title("Seiten-Inhalt")
                .icon(() => "📝")
                .child(
                  S.document()
                    .schemaType("contactPage")
                    .documentId("contactPage")
                    .title("Kontakt-Seite")
                ),
              S.listItem()
                .title("E-Mail Einstellungen")
                .icon(() => "✉️")
                .child(
                  S.document()
                    .schemaType("emailSettings")
                    .documentId("emailSettings")
                    .title("E-Mail Einstellungen")
                ),
              S.divider(),
              S.documentTypeListItem("contactSubmission")
                .title("Anfragen")
                .icon(() => "📥"),
            ])
        ),

      // ===== KONFIGURATOR =====
      S.listItem()
        .title("Konfigurator")
        .icon(() => "🧮")
        .child(
          S.document()
            .schemaType("konfiguratorPage")
            .documentId("konfiguratorPage")
            .title("Konfigurator-Seite")
        ),

      S.divider(),

      // ===== KUNDENSTIMMEN =====
      S.documentTypeListItem("testimonial").title("Kundenstimmen").icon(() => "💬"),

      S.divider(),

      // ===== EINSTELLUNGEN =====
      S.listItem()
        .title("Einstellungen")
        .icon(() => "⚙️")
        .child(
          S.document()
            .schemaType("settings")
            .documentId("siteSettings")
            .title("Website Einstellungen")
        ),
    ]);
