import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "emmotion.ch - Videoproduktion mit TV-Erfahrung";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 20,
            }}
          >
            emmotion
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              color: "#9ca3af",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Videoproduktion mit TV-Erfahrung
          </div>

          {/* Location */}
          <div
            style={{
              marginTop: 40,
              fontSize: 24,
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Rheintal • Liechtenstein • Ostschweiz
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
