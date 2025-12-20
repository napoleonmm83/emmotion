/**
 * YouTube Data API v3 Helper Functions
 * Fetches playlist videos and statistics
 */

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

interface YouTubePlaylistItem {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    resourceId: {
      videoId: string;
    };
    thumbnails: {
      maxres?: { url: string };
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
  };
}

interface YouTubeVideoDetails {
  id: string;
  snippet: {
    publishedAt: string;
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export interface YouTubeVideo {
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

export interface PlaylistData {
  videos: YouTubeVideo[];
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  lastSyncedAt: string;
}

/**
 * Parse ISO 8601 duration to human-readable format
 * e.g., PT4M13S -> "4:13"
 */
function parseDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Get best available thumbnail URL
 * Verwendet hqdefault als Fallback, da maxres nicht immer existiert
 */
function getBestThumbnail(
  thumbnails: YouTubePlaylistItem["snippet"]["thumbnails"],
  videoId: string
): string {
  // maxres existiert nicht für alle Videos, hqdefault ist zuverlässiger
  return (
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  );
}

/**
 * Fetch all videos from a YouTube playlist
 */
async function fetchPlaylistItems(
  playlistId: string,
  apiKey: string
): Promise<YouTubePlaylistItem[]> {
  const items: YouTubePlaylistItem[] = [];
  let nextPageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      part: "snippet",
      playlistId,
      maxResults: "50",
      key: apiKey,
    });

    if (nextPageToken) {
      params.set("pageToken", nextPageToken);
    }

    const response = await fetch(`${YOUTUBE_API_BASE}/playlistItems?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`YouTube API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    items.push(...data.items);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return items;
}

/**
 * Fetch video details (duration, statistics) for multiple videos
 */
async function fetchVideoDetails(
  videoIds: string[],
  apiKey: string
): Promise<Map<string, YouTubeVideoDetails>> {
  const details = new Map<string, YouTubeVideoDetails>();

  // YouTube API allows max 50 video IDs per request
  const chunks = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50));
  }

  for (const chunk of chunks) {
    const params = new URLSearchParams({
      part: "snippet,contentDetails,statistics",
      id: chunk.join(","),
      key: apiKey,
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`YouTube API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    for (const item of data.items) {
      details.set(item.id, item);
    }
  }

  return details;
}

/**
 * Fetch complete playlist data with statistics
 */
export async function fetchPlaylistData(playlistId: string): Promise<PlaylistData> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY environment variable is not set");
  }

  // Step 1: Get all playlist items
  const playlistItems = await fetchPlaylistItems(playlistId, apiKey);

  // Step 2: Get video IDs
  const videoIds = playlistItems.map((item) => item.snippet.resourceId.videoId);

  // Step 3: Fetch video details (duration, statistics)
  const videoDetails = await fetchVideoDetails(videoIds, apiKey);

  // Step 4: Combine data
  let totalViews = 0;
  let totalLikes = 0;
  let totalComments = 0;
  const skippedVideos: string[] = [];

  const videos: YouTubeVideo[] = playlistItems
    .map((item) => {
      const videoId = item.snippet.resourceId.videoId;
      const details = videoDetails.get(videoId);

      if (!details) {
        skippedVideos.push(`${item.snippet.title} (${videoId}) - keine Details verfügbar`);
        return null;
      }

      const viewCount = parseInt(details.statistics.viewCount || "0", 10);
      const likeCount = parseInt(details.statistics.likeCount || "0", 10);
      const commentCount = parseInt(details.statistics.commentCount || "0", 10);

      totalViews += viewCount;
      totalLikes += likeCount;
      totalComments += commentCount;

      return {
        youtubeId: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: getBestThumbnail(item.snippet.thumbnails, videoId),
        // Echtes Veröffentlichungsdatum des Videos (nicht Playlist-Hinzufügedatum)
        publishedAt: details.snippet.publishedAt,
        duration: parseDuration(details.contentDetails.duration),
        viewCount,
        likeCount,
        commentCount,
      };
    })
    .filter((video): video is YouTubeVideo => video !== null);

  // Log skipped videos for debugging
  if (skippedVideos.length > 0) {
    console.log(`Skipped ${skippedVideos.length} videos (deleted/private/unavailable):`);
    skippedVideos.forEach((v) => console.log(`  - ${v}`));
  }
  console.log(`Playlist total: ${playlistItems.length}, Available: ${videos.length}, Skipped: ${skippedVideos.length}`);

  return {
    videos,
    totalVideos: videos.length,
    totalViews,
    totalLikes,
    totalComments,
    lastSyncedAt: new Date().toISOString(),
  };
}
