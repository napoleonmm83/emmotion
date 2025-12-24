import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Sanity document types mapped to cache tags and their cache profiles
const DOCUMENT_TYPE_TO_TAGS: Record<string, { tags: string[]; profile: string }> = {
  // Core content types (hourly cache)
  service: { tags: ["services"], profile: "hours" },
  project: { tags: ["projects"], profile: "hours" },
  testimonial: { tags: ["testimonials"], profile: "hours" },
  faq: { tags: ["faqs"], profile: "hours" },

  // Singleton pages
  siteSettings: { tags: ["settings", "seo-settings"], profile: "hours" },
  homePage: { tags: ["home-page"], profile: "hours" },
  aboutPage: { tags: ["about-page"], profile: "days" },
  contactPage: { tags: ["contact-page"], profile: "hours" },
  portfolioPage: { tags: ["portfolio-page"], profile: "hours" },
  konfiguratorPage: { tags: ["konfigurator-page"], profile: "hours" },

  // Legal pages (daily cache)
  legalPage: { tags: ["legal-pages"], profile: "days" },

  // TV Productions
  tvProductions: { tags: ["tv-productions"], profile: "hours" },

  // Onboarding/Contract
  contractTemplate: { tags: ["contract-template"], profile: "days" },
  onboardingQuestionnaire: { tags: ["onboarding-questionnaire"], profile: "hours" },
};

// All tags with their profiles for full revalidation
const ALL_TAGS_WITH_PROFILES = [
  { tag: "services", profile: "hours" },
  { tag: "projects", profile: "hours" },
  { tag: "testimonials", profile: "hours" },
  { tag: "faqs", profile: "hours" },
  { tag: "settings", profile: "hours" },
  { tag: "seo-settings", profile: "hours" },
  { tag: "home-page", profile: "hours" },
  { tag: "about-page", profile: "days" },
  { tag: "contact-page", profile: "hours" },
  { tag: "portfolio-page", profile: "hours" },
  { tag: "konfigurator-page", profile: "hours" },
  { tag: "legal-pages", profile: "days" },
  { tag: "tv-productions", profile: "hours" },
  { tag: "contract-template", profile: "days" },
  { tag: "onboarding-questionnaire", profile: "hours" },
];

export async function POST(req: NextRequest) {
  try {
    // Validate webhook secret
    const { body, isValidSignature } = await parseBody<{
      _type: string;
      _id: string;
      slug?: { current: string };
    }>(req, process.env.SANITY_REVALIDATE_SECRET);

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature", revalidated: false },
        { status: 401 }
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: "Missing document type", revalidated: false },
        { status: 400 }
      );
    }

    // Get cache tags for this document type
    const config = DOCUMENT_TYPE_TO_TAGS[body._type];

    if (!config) {
      // Unknown document type - revalidate all tags to be safe
      const revalidatedTags: string[] = [];
      for (const { tag, profile } of ALL_TAGS_WITH_PROFILES) {
        revalidateTag(tag, profile);
        revalidatedTags.push(tag);
      }
      return NextResponse.json({
        message: `Unknown type "${body._type}", revalidated all tags`,
        revalidated: true,
        tags: revalidatedTags,
      });
    }

    // Revalidate specific tags
    for (const tag of config.tags) {
      revalidateTag(tag, config.profile);
    }

    return NextResponse.json({
      message: `Revalidated ${body._type}`,
      revalidated: true,
      tags: config.tags,
      documentId: body._id,
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { message: "Error revalidating", revalidated: false },
      { status: 500 }
    );
  }
}

// Optional: GET handler for manual testing
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const tag = req.nextUrl.searchParams.get("tag");
  const profile = req.nextUrl.searchParams.get("profile") || "hours";

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (tag) {
    // Revalidate specific tag
    revalidateTag(tag, profile);
    return NextResponse.json({ revalidated: true, tag, profile });
  }

  // Revalidate all tags
  const revalidatedTags: string[] = [];
  for (const { tag: t, profile: p } of ALL_TAGS_WITH_PROFILES) {
    revalidateTag(t, p);
    revalidatedTags.push(t);
  }
  return NextResponse.json({ revalidated: true, tags: revalidatedTags });
}
