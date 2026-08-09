import { ImageResponse } from "next/og";
import { projectDetails } from "@/content/project-details";
import { person, projects } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static alt, and no `generateImageMetadata`. That export exists to emit several
// images per route and pushes the id into the URL, but Next never resolved
// `params` for it while prerendering this segment, so every entry came back with
// an undefined id and the route 500'd. One image per project needs none of it:
// the plain file convention takes the slug from the page's own
// `generateStaticParams`. The specific title still reaches crawlers through
// `og:title` on the page itself.
export const alt = `Project | ${person.name}`;

// Needed for the thirteen cards to be baked at build time. Without it the route
// compiles as dynamic and every card is rendered per request, which puts a
// server function behind an image that never changes and leaves a social
// crawler waiting on a cold start. Safe here only because
// `generateImageMetadata` is gone: the two together left `params` unresolved.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * A share card per project, rather than thirteen links all previewing the same
 * site-wide image.
 *
 * Typographic rather than photographic: the card photos are duotoned with CSS
 * blend modes that Satori cannot reproduce, and decoding a 2400px JPEG per
 * project at build time buys a background nobody reads at preview size. The
 * headline metric does more work here, since it is the one thing that differs
 * between projects at a glance.
 *
 * `params` is a Promise in this version of Next and has to be awaited.
 */
export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const headline = projectDetails[slug]?.results[0];

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
            {project?.discipline ?? "Project"}
          </div>
          <div style={{ color: "#6e6e78", fontSize: 24 }}>{person.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#f1f1f2",
              fontSize: project && project.title.length > 34 ? 62 : 76,
              lineHeight: 1.06,
              letterSpacing: "-0.035em",
              maxWidth: 1000,
            }}
          >
            {project?.title ?? person.name}
          </div>
          {project?.cardLine && (
            <div style={{ color: "#9a9aa4", fontSize: 30, maxWidth: 900 }}>
              {project.cardLine}
            </div>
          )}
        </div>

        {headline ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <span style={{ color: "#8ba4ff", fontSize: 56 }}>
              {headline.metric}
            </span>
            <span style={{ color: "#6e6e78", fontSize: 26, maxWidth: 800 }}>
              {headline.label}
            </span>
          </div>
        ) : (
          <div style={{ color: "#6e6e78", fontSize: 24 }}>{person.role}</div>
        )}
      </div>
    ),
    size,
  );
}
