import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@sanity/lib/data";

export const runtime = "edge";

export const alt = "emmotion.ch Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  const title = project?.title || "Portfolio";
  const client = project?.client || "";
  const category = project?.category?.title || "Videoproduktion";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 40%, rgba(212, 25, 25, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(212, 25, 25, 0.2) 0%, transparent 50%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            padding: "0 60px",
            textAlign: "center",
          }}
        >
          {/* Category Badge */}
          <div
            style={{
              fontSize: 24,
              color: "#d41919",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            {category}
          </div>

          {/* Project Title */}
          <div
            style={{
              fontSize: title.length > 30 ? 64 : 80,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 24,
              lineHeight: 1.1,
              maxWidth: "90%",
            }}
          >
            {title}
          </div>

          {/* Client */}
          {client && (
            <div
              style={{
                fontSize: 32,
                color: "#9ca3af",
              }}
            >
              für {client}
            </div>
          )}

          {/* Brand */}
          <div
            style={{
              marginTop: 60,
              fontSize: 28,
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            emmotion.ch • Portfolio
          </div>
        </div>

        {/* Red accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #d41919 0%, #ff4444 50%, #d41919 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
