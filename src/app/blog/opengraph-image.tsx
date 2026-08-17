import { ImageResponse } from "next/og";
import { posts } from "@/content/blog";
import { person } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `Writing | ${person.name}`;

/**
 * Share card for the writing index. Sibling of the per-article card, and needed
 * for the same reason: this route sets its own `openGraph` block, which stopped
 * the root card from reaching it, so /blog previewed with no image.
 *
 * The counts come from the content rather than being written here, so the card
 * cannot claim six pieces after a seventh is added.
 */
export default function BlogIndexOpengraphImage() {
  const figures = posts.reduce(
    (n, p) => n + p.sections.reduce((m, s) => m + (s.figures?.length ?? 0), 0),
    0,
  );
  const words = posts.reduce((n, p) => n + p.wordCount, 0);

  return new ImageResponse(
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            color: "#8ba4ff",
            fontSize: 24,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Writing
        </div>
        <div style={{ color: "#6e6e78", fontSize: 24 }}>{person.name}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            color: "#f1f1f2",
            fontSize: 82,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            maxWidth: 1000,
          }}
        >
          Notes on making processes work
        </div>
        <div style={{ color: "#9a9aa4", fontSize: 30, maxWidth: 940 }}>
          Process engineering case studies: analysis, design thinking, planning,
          redesign and delivery governance.
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <span style={{ color: "#8ba4ff", fontSize: 34 }}>
          {posts.length} case studies
        </span>
        <span style={{ color: "#6e6e78", fontSize: 26 }}>
          {words.toLocaleString()} words · {figures} figures
        </span>
      </div>
    </div>,
    size,
  );
}
