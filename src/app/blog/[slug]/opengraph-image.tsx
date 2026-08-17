import { ImageResponse } from "next/og";
import { posts } from "@/content/blog";
import { person } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static alt, and deliberately no `generateImageMetadata`. That export emits
// several images per route and pushes an id into the URL, and Next never
// resolved `params` for it while prerendering, so every entry came back with an
// undefined id and the route 500'd. Same trap the project card route hit.
export const alt = `Writing | ${person.name}`;

// Without this the route compiles dynamic and every card renders per request,
// which puts a cold start between a social crawler and an image that never
// changes.
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

/**
 * A share card per article.
 *
 * These pages were declaring `twitter:card: summary_large_image` and supplying
 * no image at all, because the root `opengraph-image.tsx` did not reach a route
 * whose own metadata sets an `openGraph` block. Every project had a card and
 * every article had none, so all seven writing URLs previewed as a bare link.
 *
 * The reading time and figure count are the two things that differ most between
 * these at a glance, so they carry the footer rather than the discipline alone.
 *
 * `params` is a Promise in this version of Next and has to be awaited.
 */
export default async function BlogOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  const figures =
    post?.sections.reduce((n, s) => n + (s.figures?.length ?? 0), 0) ?? 0;

  // The editorial titles run to 88 characters, so the size has to step down or
  // the longest ones overflow the card.
  const titleLength = post?.title.length ?? 0;
  const titleSize = titleLength > 70 ? 54 : titleLength > 46 ? 64 : 76;

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
          {post?.discipline ?? "Writing"}
        </div>
        <div style={{ color: "#6e6e78", fontSize: 24 }}>{person.name}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            color: "#f1f1f2",
            fontSize: titleSize,
            lineHeight: 1.06,
            letterSpacing: "-0.035em",
            maxWidth: 1020,
          }}
        >
          {post?.title ?? "Writing"}
        </div>
        {post?.cardLine && (
          <div style={{ color: "#9a9aa4", fontSize: 30, maxWidth: 920 }}>
            {post.cardLine}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <span style={{ color: "#8ba4ff", fontSize: 34 }}>
          {post?.readingMinutes ?? 0} min read
        </span>
        <span style={{ color: "#6e6e78", fontSize: 26 }}>
          {figures > 0
            ? `${post?.wordCount.toLocaleString()} words · ${figures} figures`
            : `${post?.wordCount.toLocaleString()} words`}
        </span>
      </div>
    </div>,
    size,
  );
}
