import { ImageResponse } from "next/og";
import { getServiceBySlug } from "@sanity/lib/data";

export const runtime = "edge";

export const alt = "emmotion.ch Leistungen";
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
  const service = await getServiceBySlug(slug);

  const title = service?.title || "Leistung";
  const shortDescription = service?.shortDescription || "";
  const priceFrom = service?.priceFrom;

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
          {/* Service Badge */}
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
            Leistung
          </div>

          {/* Service Title */}
          <div
            style={{
              fontSize: title.length > 20 ? 72 : 90,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 24,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>

          {/* Description */}
          {shortDescription && (
            <div
              style={{
                fontSize: 28,
                color: "#9ca3af",
                maxWidth: "80%",
                lineHeight: 1.4,
              }}
            >
              {shortDescription.length > 100
                ? shortDescription.slice(0, 100) + "..."
                : shortDescription}
            </div>
          )}

          {/* Price */}
          {priceFrom && (
            <div
              style={{
                marginTop: 40,
                fontSize: 32,
                color: "#d41919",
                fontWeight: 700,
              }}
            >
              ab CHF {priceFrom.toLocaleString("de-CH")}
            </div>
          )}

          {/* Brand */}
          <div
            style={{
              marginTop: 40,
              fontSize: 28,
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            emmotion.ch
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
