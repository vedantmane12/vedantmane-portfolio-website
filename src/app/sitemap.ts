import type { MetadataRoute } from "next";
import { projects, SITE_URL } from "@/content/site";
import { projectImageSrc } from "@/lib/project-media";

/**
 * Bumped by hand when the content actually changes.
 *
 * `new Date()` was tempting and wrong: it stamps every URL with the build time,
 * so a redeploy that changed one line told crawlers all fourteen pages were
 * modified. Repeated often enough that teaches Google the dates mean nothing,
 * and it stops using them to prioritise recrawls.
 */
const CONTENT_UPDATED = new Date("2026-08-09");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Each project has its own indexable page. Generated from the same array
    // the pages are, so the sitemap cannot fall behind the routes.
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.9 : 0.7,
      // Declaring the card photograph gives Google Images something to attach
      // to the page. Costs one line per project and is the only way these
      // images get discovered, since they are CSS backgrounds on the detail
      // page rather than content <img> elements.
      images: [`${SITE_URL}${projectImageSrc(project.slug)}`],
    })),
  ];
}
