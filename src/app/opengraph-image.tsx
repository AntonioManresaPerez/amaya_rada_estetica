import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #e8d7f1 0%, #d3bccc 50%, #a167a5 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: "24px",
            padding: "48px 64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: "700",
              color: "#4a306d",
              letterSpacing: "-1px",
              textAlign: "center",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#4a306d",
              opacity: 0.8,
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            {siteConfig.description}
          </div>
          <div
            style={{
              marginTop: "16px",
              fontSize: "20px",
              color: "#4a306d",
              background: "rgba(255,255,255,0.4)",
              padding: "8px 24px",
              borderRadius: "999px",
            }}
          >
            Murcia · Reserva online
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
