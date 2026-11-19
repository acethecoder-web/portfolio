// src/lib/og.tsx
import { ImageResponse } from "next/og";

export function renderOg({
  eyebrow,
  title,
  subtitle,
  accent,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#020a04",
          color: "#d6ffe4",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: accent }}>{eyebrow}</div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.1,
            color: accent,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 38, color: "#78b58f" }}>
          {subtitle}
        </div>
        <div
          style={{
            display: "flex",
            width: 160,
            height: 8,
            marginTop: 48,
            borderRadius: 4,
            background: accent,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}