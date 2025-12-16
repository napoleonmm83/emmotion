import type { PortableTextBlock } from "@portabletext/types";

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  alt?: string;
}

export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: SanitySlug;
  shortDescription?: string;
  description?: PortableTextBlock[];
  icon?: string;
  idealFor?: string[];
  priceFrom?: number;
  featuredVideo?: string;
  featuredImage?: SanityImage;
  benefits?: Array<{
    title: string;
    description: string;
  }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  order?: number;
}

export interface Project {
  _id: string;
  title: string;
  slug: SanitySlug;
  client?: string;
  category?: string;
  categorySlug?: string;
  industry?: string;
  videoUrl?: string;
  thumbnail: SanityImage;
  challenge?: string;
  solution?: string;
  result?: string;
  testimonial?: Testimonial;
  featured?: boolean;
  publishedAt?: string;
}

export interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  position?: string;
  company?: string;
  image?: SanityImage;
  featured?: boolean;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  category?: "kosten" | "ablauf" | "technik" | "allgemein";
  order?: number;
}

export interface SiteSettings {
  siteName?: string;
  siteDescription?: string;
  logo?: SanityImage;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  social?: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  defaultSeo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
}
