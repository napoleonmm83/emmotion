import type { StructureResolver, DefaultDocumentNodeResolver } from "sanity/structure";
import { DeleteAllSubmissions } from "../components/DeleteAllSubmissions";
import { Preflight, DeadLinks, SEOAudit } from "@planetary/sanity-plugin-preflight";
import { RocketIcon } from "@sanity/icons";

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
              S.divider(),
              S.listItem()
                .title("Anfragen verwalten")
                .icon(() => "🗑️")
                .child(
                  S.component(DeleteAllSubmissions)
                    .title("Anfragen verwalten")
                ),
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

      // ===== PROJEKT-ONBOARDING =====
      S.listItem()
        .title("Projekt-Onboarding")
        .icon(() => "📋")
        .child(
          S.list()
            .title("Projekt-Onboarding")
            .items([
              S.documentTypeListItem("projectOnboarding")
                .title("Projektanfragen")
                .icon(() => "📥"),
              S.divider(),
              S.listItem()
                .title("Vertragsvorlage")
                .icon(() => "📄")
                .child(
                  S.document()
                    .schemaType("contractTemplate")
                    .documentId("contractTemplate")
                    .title("Vertragsvorlage")
                ),
              S.documentTypeListItem("onboardingQuestionnaire")
                .title("Fragebögen")
                .icon(() => "❓"),
            ])
        ),

      S.divider(),

      // ===== KUNDENSTIMMEN =====
      S.documentTypeListItem("testimonial").title("Kundenstimmen").icon(() => "💬"),

      S.divider(),

      // ===== TV PRODUKTIONEN =====
      S.listItem()
        .title("TV Produktionen")
        .icon(() => "📺")
        .child(
          S.document()
            .schemaType("tvProductions")
            .documentId("tvProductions")
            .title("TV Produktionen")
        ),

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

/**
 * Default Document Node mit Preflight SEO Plugin
 * Fügt einen "Preflight" Tab zu relevanten Dokumenttypen hinzu
 */
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  // Dokumenttypen, die den Preflight-Check erhalten sollen
  const preflightSchemaTypes = [
    "service",
    "project",
    "homePage",
    "aboutPage",
    "portfolioPage",
    "contactPage",
    "konfiguratorPage",
    "legalPage",
    "faq",
  ];

  if (preflightSchemaTypes.includes(schemaType)) {
    return S.document().views([
      // Standard Editor
      S.view.form(),
      // Preflight mit Dead Links und SEO Audit
      S.view
        .component(
          Preflight({
            plugins: [DeadLinks(), SEOAudit()],
          })
        )
        .title("Preflight")
        .icon(RocketIcon),
    ]);
  }

  return S.document().views([S.view.form()]);
};
