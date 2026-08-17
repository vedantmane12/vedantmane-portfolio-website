import type { MetadataRoute } from "next";
import { CONTENT_REVISED, postsByDate } from "@/content/blog";
import { projects, SITE_URL } from "@/content/site";
import { projectImageSrc } from "@/lib/project-media";

/**
 * Three dates, bumped by hand, because these three groups of pages genuinely
 * change at different times.
 *
 * `new Date()` was tempting and wrong: it stamps every URL with the build time,
 * so a redeploy that changed one line told crawlers all fourteen pages were
 * modified. Repeated often enough that teaches Google the dates mean nothing,
 * and it stops using them to prioritise recrawls.
 *
 * Collapsing them onto one constant is the same mistake more slowly. The home
 * page copy changed with the last writing pass and the project pages did not, so
 * they carry different dates. Bump the one that actually moved.
 */
const HOME_UPDATED = new Date("2026-08-17");
const PROJECTS_UPDATED = new Date("2026-08-09");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: HOME_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Each project has its own indexable page. Generated from the same array
    // the pages are, so the sitemap cannot fall behind the routes.
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: PROJECTS_UPDATED,
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.9 : 0.7,
      // Declaring the card photograph gives Google Images something to attach
      // to the page. Costs one line per project and is the only way these
      // images get discovered, since they are CSS backgrounds on the detail
      // page rather than content <img> elements.
      images: [`${SITE_URL}${projectImageSrc(project.slug)}`],
    })),
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(CONTENT_REVISED),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // `lastmod` is the revision date, not the publication date. It used to be
    // `post.isoDate`, which is when the piece went up, so the sitemap claimed
    // nothing had changed since January while all six had been rewritten. The
    // JSON-LD keeps `datePublished` on the original date and takes
    // `dateModified` from the same constant, so the two never disagree.
    ...postsByDate.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(CONTENT_REVISED),
      changeFrequency: "yearly" as const,
      priority: 0.7,
      // The cover photograph plus every figure in the article. The figures are
      // the diagrams the analysis actually produced, and each one carries real
      // alt text, so they are worth surfacing to image search rather than
      // leaving them discoverable only by crawling the page body.
      images: [
        `${SITE_URL}/blog/${post.slug}.jpg`,
        ...post.sections.flatMap((section) =>
          (section.figures ?? []).map((figure) => `${SITE_URL}${figure.src}`),
        ),
      ],
    })),
  ];
}
