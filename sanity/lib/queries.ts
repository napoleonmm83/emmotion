import { groq } from "next-sanity";

// Services
export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    icon,
    priceFrom,
    featuredImage,
    idealFor,
    "featuredVideoUrl": featuredVideo
  }
`;

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    description,
    icon,
    idealFor,
    priceFrom,
    featuredVideo,
    featuredImage,
    benefits[] {
      title,
      description
    },
    process[] {
      step,
      title,
      description
    },
    faq[] {
      question,
      answer
    },
    exampleVideos[] {
      title,
      youtubeUrl,
      description
    },
    relatedProjects[]-> {
      _id,
      title,
      "slug": slug.current
    },
    seo
  }
`;

// Projects
export const projectsQuery = groq`
  *[_type == "project"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    client,
    "category": category->title,
    "categorySlug": category->slug.current,
    industry,
    videoUrl,
    thumbnail,
    featured,
    publishedAt
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    client,
    "category": category->title,
    videoUrl,
    thumbnail
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    client,
    "category": category->{title, slug},
    industry,
    videoUrl,
    thumbnail,
    challenge,
    solution,
    result,
    testimonial->{
      quote,
      author,
      position,
      company,
      image
    },
    publishedAt
  }
`;

// Testimonials
export const testimonialsQuery = groq`
  *[_type == "testimonial"] {
    _id,
    quote,
    author,
    position,
    company,
    image,
    featured
  }
`;

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] {
    _id,
    quote,
    author,
    position,
    company,
    image
  }
`;

// FAQs
export const faqsQuery = groq`
  *[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`;

export const faqsByCategoryQuery = groq`
  *[_type == "faq" && category == $category] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`;

// Settings (Singleton mit fester ID)
export const settingsQuery = groq`
  *[_id == "siteSettings"][0] {
    siteName,
    siteDescription,
    logo,
    contact {
      email,
      phone,
      street,
      city,
      uid,
      region
    },
    contactForm {
      recipientEmail,
      emailSubjectPrefix,
      successMessage,
      enableEmailNotification,
      subjectOptions[] {
        value,
        label
      },
      placeholders {
        name,
        email,
        phone,
        company,
        message
      },
      submitButtonText,
      privacyText
    },
    social {
      linkedin,
      instagram,
      youtube
    },
    footer {
      tagline,
      ctaText,
      copyrightName
    },
    seo {
      allowIndexing,
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`;

// SEO Settings (Singleton mit fester ID)
export const seoSettingsQuery = groq`
  *[_id == "siteSettings"][0] {
    siteName,
    siteDescription,
    contact {
      email,
      phone,
      street,
      city,
      region
    },
    social {
      linkedin,
      instagram,
      youtube
    },
    seo {
      allowIndexing,
      metaTitle,
      metaDescription,
      ogImage {
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      }
    }
  }
`;

// Legal Pages (Impressum, Datenschutz)
export const legalPageBySlugQuery = groq`
  *[_type == "legalPage" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content,
    lastUpdated,
    seo
  }
`;

// Home Page (Singleton mit fester ID)
export const homePageQuery = groq`
  *[_id == "homePage"][0] {
    hero {
      titleLine1,
      titleHighlight,
      subtitle,
      ctaPrimaryText,
      ctaPrimaryLink,
      ctaSecondaryText,
      ctaSecondaryLink,
      backgroundVideo,
      backgroundImage {
        asset->{
          _id,
          url
        }
      }
    },
    sections {
      showServices,
      showPortfolio,
      showTestimonials,
      showCTA,
      showAbout,
      showContact
    },
    seo
  }
`;

// Konfigurator Page (Singleton mit fester ID)
export const konfiguratorPageQuery = groq`
  *[_id == "konfiguratorPage"][0] {
    hero {
      title,
      subtitle
    },
    benefits[] {
      icon,
      title,
      description
    },
    infoSection {
      title,
      description
    },
    steps[] {
      title,
      description
    },
    seo
  }
`;

// Portfolio Page (Singleton mit fester ID)
export const portfolioPageQuery = groq`
  *[_id == "portfolioPage"][0] {
    hero {
      title,
      subtitle
    },
    categories[] {
      value,
      label
    },
    industries[] {
      value,
      label
    },
    cta {
      title,
      description,
      buttonText
    },
    emptyState {
      message,
      resetText
    },
    seo
  }
`;

// About Page (Singleton mit fester ID)
export const aboutPageQuery = groq`
  *[_id == "aboutPage"][0] {
    _id,
    name,
    subtitle,
    profileImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      hotspot,
      crop
    },
    heroText,
    description,
    stats,
    values,
    timeline,
    whyWorkWithMe {
      title,
      description,
      points,
      image {
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        hotspot,
        crop
      }
    },
    seo
  }
`;

// Contact Page (Singleton mit fester ID)
export const contactPageQuery = groq`
  *[_id == "contactPage"][0] {
    hero {
      title,
      titleHighlight,
      subtitle
    },
    form {
      title,
      subjectOptions[] {
        value,
        label
      },
      placeholders {
        name,
        email,
        phone,
        company,
        message
      },
      submitButtonText,
      successMessage,
      privacyText
    },
    sidebar {
      contactTitle,
      responseTime,
      whyTitle,
      whyPoints,
      quickResponseTitle,
      quickResponseText
    },
    regions {
      title,
      subtitle,
      regionList,
      footerText
    },
    seo
  }
`;

// Email Settings (Singleton mit fester ID)
export const emailSettingsQuery = groq`
  *[_id == "emailSettings"][0] {
    enabled,
    recipientEmail,
    senderName,
    subjectPrefix,
    smtp {
      host,
      port,
      secure,
      user,
      password
    },
    testEmail {
      testRecipient,
      lastTestResult,
      lastTestDate
    }
  }
`;

// Onboarding Questionnaire by Service Slug
export const onboardingQuestionnaireQuery = groq`
  *[_type == "onboardingQuestionnaire" && serviceSlug == $serviceSlug][0] {
    _id,
    serviceSlug,
    title,
    description,
    questions[] {
      id,
      question,
      type,
      required,
      options,
      placeholder,
      helpText,
      conditionalOn {
        questionId,
        value
      }
    }
  }
`;

// Contract Template (active)
export const contractTemplateQuery = groq`
  *[_type == "contractTemplate" && isActive == true][0] {
    _id,
    version,
    companyInfo {
      name,
      owner,
      address,
      email,
      phone,
      uid,
      bank {
        name,
        iban,
        bic
      }
    },
    clauses {
      preamble,
      scopeOfWork,
      deposit,
      cancellation,
      clientObligations,
      forceMajeure,
      scopeChanges,
      paymentTerms,
      liability,
      usageRights,
      jurisdiction
    },
    depositRules {
      minPercentage,
      maxPercentage,
      thresholds[] {
        upTo,
        percentage
      }
    },
    cancellationDays
  }
`;

// TV Productions (Singleton)
export const tvProductionsQuery = groq`
  *[_type == "tvProductions"][0] {
    _id,
    enabled,
    playlistId,
    title,
    subtitle,
    description,
    channelInfo {
      channelName,
      channelUrl,
      role
    },
    cachedData {
      lastSyncedAt,
      totalVideos,
      totalViews,
      totalLikes,
      totalComments,
      videos[] {
        youtubeId,
        title,
        description,
        thumbnailUrl,
        publishedAt,
        duration,
        viewCount,
        likeCount,
        commentCount
      }
    },
    seo
  }
`;
