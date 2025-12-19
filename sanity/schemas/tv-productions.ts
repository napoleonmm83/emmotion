import { defineType, defineField } from "sanity";
import { YouTubeSyncButton } from "../components";

export default defineType({
  name: "tvProductions",
  title: "TV Produktionen",
  type: "document",
  icon: () => "📺",
  fields: [
    defineField({
      name: "enabled",
      title: "Aktiv",
      type: "boolean",
      description: "TV Produktionen Bereich auf der Website anzeigen",
      initialValue: true,
    }),
    defineField({
      name: "playlistId",
      title: "YouTube Playlist ID",
      type: "string",
      description: "Die ID der YouTube-Playlist (z.B. PLlqvVZIoFthOJTjq3WQNmRwQa2SxMVkN3)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "syncButton",
      title: "Synchronisieren",
      type: "string",
      components: {
        field: YouTubeSyncButton,
      },
    }),
    defineField({
      name: "title",
      title: "Seitentitel",
      type: "string",
      initialValue: "TV Produktionen",
    }),
    defineField({
      name: "subtitle",
      title: "Untertitel",
      type: "text",
      rows: 2,
      initialValue: "Meine Arbeiten für TV Rheintal – professionelle Videoproduktion für das Regionalfernsehen.",
    }),
    defineField({
      name: "description",
      title: "Beschreibung",
      type: "text",
      rows: 4,
      description: "Einleitungstext für die TV Produktionen Seite",
    }),
    defineField({
      name: "channelInfo",
      title: "Kanal-Informationen",
      type: "object",
      fields: [
        {
          name: "channelName",
          type: "string",
          title: "Kanalname",
          initialValue: "TV Rheintal",
        },
        {
          name: "channelUrl",
          type: "url",
          title: "Kanal-URL",
        },
        {
          name: "role",
          type: "string",
          title: "Deine Rolle",
          description: "z.B. 'Kameramann & Editor'",
          initialValue: "Kameramann & Editor",
        },
      ],
    }),
    defineField({
      name: "cachedData",
      title: "Gecachte YouTube-Daten",
      type: "object",
      description: "Wird automatisch vom Cron-Job aktualisiert",
      readOnly: true,
      fields: [
        {
          name: "lastSyncedAt",
          type: "datetime",
          title: "Letzte Aktualisierung",
        },
        {
          name: "totalVideos",
          type: "number",
          title: "Anzahl Videos",
        },
        {
          name: "totalViews",
          type: "number",
          title: "Gesamte Views",
        },
        {
          name: "totalLikes",
          type: "number",
          title: "Gesamte Likes",
        },
        {
          name: "totalComments",
          type: "number",
          title: "Gesamte Kommentare",
        },
        {
          name: "videos",
          type: "array",
          title: "Videos",
          of: [
            {
              type: "object",
              fields: [
                { name: "youtubeId", type: "string", title: "YouTube ID" },
                { name: "title", type: "string", title: "Titel" },
                { name: "description", type: "text", title: "Beschreibung" },
                { name: "thumbnailUrl", type: "url", title: "Thumbnail URL" },
                { name: "publishedAt", type: "datetime", title: "Veröffentlicht am" },
                { name: "duration", type: "string", title: "Dauer" },
                { name: "viewCount", type: "number", title: "Views" },
                { name: "likeCount", type: "number", title: "Likes" },
                { name: "commentCount", type: "number", title: "Kommentare" },
              ],
              preview: {
                select: {
                  title: "title",
                  subtitle: "viewCount",
                },
                prepare({ title, subtitle }) {
                  return {
                    title: title || "Video",
                    subtitle: subtitle ? `${subtitle.toLocaleString()} Views` : "",
                  };
                },
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta Title" },
        { name: "metaDescription", type: "text", title: "Meta Description" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      enabled: "enabled",
      totalVideos: "cachedData.totalVideos",
    },
    prepare({ title, enabled, totalVideos }) {
      return {
        title: title || "TV Produktionen",
        subtitle: `${enabled ? "✅ Aktiv" : "❌ Inaktiv"} • ${totalVideos || 0} Videos`,
      };
    },
  },
});
