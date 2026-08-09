import { ImageResponse } from "next/og";
import { person } from "@/content/site";

export const alt = `${person.name} | ${person.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Rendered at build time into a static PNG. Uses plain inline styles because
 * Satori (the renderer behind ImageResponse) doesn't process Tailwind classes.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090b",
          backgroundImage:
            "radial-gradient(1000px 600px at 10% -20%, rgba(139,164,255,0.20), transparent 60%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "#f1f1f2",
              color: "#08090b",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            VM
          </div>
          <div style={{ color: "#9a9aa4", fontSize: 26 }}>{person.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              color: "#f1f1f2",
              fontSize: 78,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              maxWidth: 950,
            }}
          >
            {person.tagline}
          </div>
          <div style={{ color: "#8ba4ff", fontSize: 30 }}>{person.role}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#6e6e78",
            fontSize: 24,
          }}
        >
          <span>{person.location}</span>
          <span>{person.email}</span>
        </div>
      </div>
    ),
    size,
  );
}
