import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icono para "Añadir a inicio" en iOS. Mismo lenguaje visual que el OG image.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e8d7f1 0%, #d3bccc 55%, #a167a5 100%)",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: "#4a306d",
            letterSpacing: "-4px",
            lineHeight: 1,
          }}
        >
          V
        </div>
      </div>
    ),
    { ...size }
  );
}
