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

// Settings
export const settingsQuery = groq`
  *[_type == "settings"][0] {
    siteName,
    siteDescription,
    logo,
    contact,
    social,
    defaultSeo
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

// About Page
export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    _id,
    name,
    subtitle,
    profileImage,
    heroText,
    description,
    stats,
    values,
    timeline,
    whyWorkWithMe,
    seo
  }
`;
