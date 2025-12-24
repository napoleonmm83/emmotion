export interface Video {
  youtubeId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface TVProductionsData {
  _id: string;
  enabled: boolean;
  playlistId: string;
  title: string;
  subtitle: string;
  description: string;
  channelInfo?: {
    channelName: string;
    channelUrl: string;
    role: string;
  };
  cachedData?: {
    lastSyncedAt: string;
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    videos: Video[];
  };
}

export interface TVSettings {
  siteName?: string;
  contact?: {
    email?: string;
    phone?: string;
    street?: string;
    city?: string;
    uid?: string;
    region?: string;
  };
  social?: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  footer?: {
    tagline?: string;
    ctaText?: string;
    copyrightName?: string;
  };
}

export type SortOption = "date" | "views" | "likes";
export type SortDirection = "asc" | "desc";
