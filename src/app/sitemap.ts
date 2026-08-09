import type { MetadataRoute } from "next";
import { projects, SITE_URL } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Each project has its own indexable page. Generated from the same array
    // the pages are, so the sitemap cannot fall behind the routes.
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
