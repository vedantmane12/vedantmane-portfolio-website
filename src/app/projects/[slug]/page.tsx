import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { Footer } from "@/components/footer";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Nav } from "@/components/nav";
import { projectDetails } from "@/content/project-details";
import { person, projects, SITE_URL } from "@/content/site";
import {
  PROJECT_IMAGE_FILTER,
  PROJECT_IMAGE_WASH,
  projectImageSrc,
} from "@/lib/project-media";
import { cn } from "@/lib/utils";

/**
 * One statically generated page per project.
 *
 * `params` is a Promise in this version of Next and has to be awaited, in the
 * page and in `generateMetadata` alike.
 */
type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const path = `/projects/${project.slug}`;
  const title = `${project.title} | ${person.name}`;

  return {
    title: project.title,
    description: project.blurb,
    // Reusing the project's own stack as page-level keywords, so each page
    // carries its own terms rather than the site-wide list from the layout.
    keywords: [project.title, project.discipline, ...project.stack],
    alternates: { canonical: path },
    openGraph: {
      title,
      description: project.blurb,
      url: `${SITE_URL}${path}`,
      type: "article",
      siteName: `${person.name} Portfolio`,
    },
    // Without this the layout's site-wide card wins, and every project shared
    // on X or Slack previewed with the same generic title and description as
    // the home page.
    twitter: {
      card: "summary_large_image",
      title,
      description: project.blurb,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const detail = projectDetails[slug];
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  const pageUrl = `${SITE_URL}/projects/${project.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        "@id": `${pageUrl}#project`,
        name: project.title,
        headline: project.title,
        description: project.blurb,
        abstract: project.description,
        url: pageUrl,
        codeRepository: project.repo,
        programmingLanguage: project.stack,
        keywords: [project.discipline, ...project.stack].join(", "),
        image: `${SITE_URL}${projectImageSrc(project.slug)}`,
        author: { "@type": "Person", name: person.name, url: SITE_URL },
        // Slash before the fragment, matching the WebSite node's own @id in
        // the layout graph. Without it the reference points at nothing.
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      // Lets Google render "Home > Projects > This project" in the result
      // instead of a bare URL, and ties each page back to the site root.
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${SITE_URL}/#projects`,
          },
          { "@type": "ListItem", position: 3, name: project.title },
        ],
      },
    ],
  };

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="main-content" className="flex-1">
        <article>
          {/* Header */}
          <header className="hairline relative overflow-hidden pt-28 sm:pt-32">
            {/* The project's photograph sits behind the title, under three
                scrims. One vertical, fading the image into the page so there is
                no hard edge where the header ends. One horizontal, keeping the
                left side (where the type sits) dark enough for the title to
                hold contrast over any of the ten photographs. One flat wash to
                take the overall level down. Layered rather than a single darker
                overlay so the image stays visible on the right, where nothing
                is competing with it. */}
            <div aria-hidden="true" className="absolute inset-0 -z-10">
              <Image
                src={projectImageSrc(project.slug)}
                alt=""
                fill
                priority
                sizes="100vw"
                className={cn("object-cover", PROJECT_IMAGE_FILTER)}
              />
              <div className={cn("absolute inset-0", PROJECT_IMAGE_WASH)} />
              {/* Heavier on a phone. The horizontal scrim below only darkens
                  the left, which is enough when the type sits in a column, but
                  on a narrow screen the title runs the full width and its right
                  end lands on the brightest part of the photograph. */}
              <div className="absolute inset-0 bg-background/55 sm:bg-background/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            </div>

            <div className="container-page pb-14 sm:pb-16">
              <Reveal>
                <Link
                  href="/#projects"
                  className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-accent"
                >
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
                  >
                    ←
                  </span>
                  All projects
                </Link>
              </Reveal>

              <Reveal delay={0.05}>
                <h1 className="mt-8 max-w-4xl text-balance text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.03em]">
                  {project.title}
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-muted">
                  {project.blurb}
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {detail?.links?.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform duration-300 hover:scale-[1.02]"
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  ))}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent"
                    >
                      Source
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  )}
                </div>
              </Reveal>
            </div>
          </header>

          {detail ? (
            <>
              {/* Results strip */}
              <section className="hairline py-14 sm:py-16">
                <div className="container-page">
                  <RevealGroup
                    as="ul"
                    className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
                    stagger={0.07}
                  >
                    {detail.results.map((result) => (
                      <RevealItem as="li" key={result.label}>
                        <p className="font-mono text-3xl tracking-[-0.02em] text-accent sm:text-4xl">
                          {result.metric}
                        </p>
                        <p className="mt-3 text-[13px] leading-relaxed text-muted">
                          {result.label}
                        </p>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </div>
              </section>

              {/* The problem */}
              <section className="hairline py-20 sm:py-24">
                <div className="container-page">
                  <Reveal>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-highlight">
                      The problem
                    </p>
                  </Reveal>
                  <Reveal delay={0.06}>
                    <p className="mt-6 max-w-3xl text-pretty text-xl leading-[1.6]">
                      {detail.problem}
                    </p>
                  </Reveal>

                  {detail.sourceNote && (
                    <Reveal delay={0.1}>
                      <p className="mt-8 max-w-3xl border-l-2 border-border pl-5 text-[13px] leading-relaxed text-subtle">
                        {detail.sourceNote}
                      </p>
                    </Reveal>
                  )}
                </div>
              </section>

              {/* Architecture */}
              <section className="hairline py-20 sm:py-24">
                <div className="container-page">
                  <Reveal>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-highlight">
                      Architecture
                    </p>
                  </Reveal>
                  <Reveal delay={0.06}>
                    <h2 className="mt-5 text-[clamp(1.6rem,3.4vw,2.4rem)] font-medium tracking-[-0.03em]">
                      How it fits together
                    </h2>
                  </Reveal>

                  <ArchitectureDiagram diagram={detail.diagram} />

                  <RevealGroup
                    as="ol"
                    className="mt-16 space-y-px overflow-hidden rounded-2xl border border-border"
                    stagger={0.06}
                  >
                    {detail.stages.map((stage, i) => (
                      <RevealItem
                        as="li"
                        key={stage.name}
                        className="group grid gap-2 bg-surface p-6 transition-colors duration-500 hover:bg-surface-raised sm:grid-cols-[3rem_11rem_1fr] sm:items-baseline sm:gap-6 sm:p-7"
                      >
                        <span className="font-mono text-[11px] tabular-nums text-subtle">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-base font-medium tracking-[-0.01em] transition-colors duration-500 group-hover:text-accent">
                          {stage.name}
                        </h3>
                        <p className="text-pretty text-[14px] leading-relaxed text-muted">
                          {stage.detail}
                        </p>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </div>
              </section>

              {/* Decisions */}
              <section className="hairline py-20 sm:py-24">
                <div className="container-page">
                  <Reveal>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-highlight">
                      Engineering decisions
                    </p>
                  </Reveal>
                  <Reveal delay={0.06}>
                    <h2 className="mt-5 max-w-3xl text-[clamp(1.6rem,3.4vw,2.4rem)] font-medium tracking-[-0.03em]">
                      The choices worth explaining
                    </h2>
                  </Reveal>

                  <RevealGroup
                    className="mt-12 grid gap-5 lg:grid-cols-2"
                    stagger={0.08}
                  >
                    {detail.decisions.map((decision) => (
                      <RevealItem
                        key={decision.title}
                        className="rounded-2xl border border-border bg-surface p-7 transition-colors duration-500 hover:border-accent/40"
                      >
                        <h3 className="text-lg font-medium tracking-[-0.015em]">
                          {decision.title}
                        </h3>
                        <p className="mt-3 text-pretty text-[14px] leading-relaxed text-muted">
                          {decision.detail}
                        </p>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </div>
              </section>
            </>
          ) : (
            <section className="hairline py-20 sm:py-24">
              <div className="container-page">
                <Reveal>
                  <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted">
                    {project.description}
                  </p>
                </Reveal>
              </div>
            </section>
          )}

          {/* Next project */}
          <section className="hairline py-20 sm:py-24">
            <div className="container-page">
              <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
                  Next project
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <Link
                  href={`/projects/${next.slug}`}
                  className="group mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2"
                >
                  <span className="text-[clamp(1.5rem,3.4vw,2.4rem)] font-medium tracking-[-0.03em] transition-colors duration-300 group-hover:text-accent">
                    {next.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-accent transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            </div>
          </section>
        </article>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
