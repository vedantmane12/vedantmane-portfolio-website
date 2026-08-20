import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FigureBlock } from "@/components/figure-block";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/motion/reveal";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Nav } from "@/components/nav";
import { CONTENT_REVISED, getPost, posts, postsByDate } from "@/content/blog";
import { person, SITE_URL } from "@/content/site";
import { PROJECT_IMAGE_FILTER, PROJECT_IMAGE_WASH } from "@/lib/project-media";
import { cn } from "@/lib/utils";

/** `params` is a Promise in this version of Next and has to be awaited. */
type Params = { params: Promise<{ slug: string }> };

/**
 * The prose measure. Applied per block rather than once around the whole body,
 * so figures can sit wider than the text. See the comment above the body.
 */
const MEASURE = "mx-auto max-w-[35rem]";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const path = `/blog/${post.slug}`;
  const title = `${post.title} | ${person.name}`;

  return {
    // Search gets the short keyword-led pair, because a result truncates at
    // roughly 60 characters of title and 155 of description. Social gets the
    // editorial title and the full excerpt, where the hook does more work than
    // the keywords and neither is clipped.
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    keywords: [post.discipline, ...post.tags],
    authors: [{ name: person.name, url: SITE_URL }],
    alternates: { canonical: path },
    openGraph: {
      title,
      description: post.excerpt,
      url: `${SITE_URL}${path}`,
      type: "article",
      publishedTime: post.isoDate,
      authors: [person.name],
      tags: post.tags,
      siteName: `${person.name} Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = postsByDate.findIndex((p) => p.slug === slug);
  const next = postsByDate[(index + 1) % postsByDate.length];
  const pageUrl = `${SITE_URL}/blog/${post.slug}`;

  /**
   * Figure numbers run continuously through the article, so "Fig 3" in a caption
   * means the third figure on the page rather than the third in its section.
   * Resolved from a flat list up front because the figures render inside a
   * per-section map that has no view of what came before it.
   */
  const figureOrder = post.sections.flatMap((s) =>
    (s.figures ?? []).map((fig) => fig.src),
  );
  const figureNumber = (src: string) => figureOrder.indexOf(src) + 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${pageUrl}#post`,
        headline: post.title,
        description: post.excerpt,
        articleSection: post.discipline,
        keywords: post.tags.join(", "),
        // The same count the reading time is derived from. Computing it here
        // separately is how the markup came to claim 535 words on a 750 word
        // article: this version skipped the lists, the stats and the closing.
        wordCount: post.wordCount,
        timeRequired: `PT${post.readingMinutes}M`,
        datePublished: post.isoDate,
        // The revision date, not the publication date. These were the same
        // value, which told Google the pieces had not been touched since they
        // went up, while every one of them has since been rewritten.
        dateModified: CONTENT_REVISED,
        image: `${SITE_URL}/blog/${post.slug}.jpg`,
        url: pageUrl,
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        isPartOf: { "@id": `${SITE_URL}/blog#blog` },
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Writing",
            item: `${SITE_URL}/blog`,
          },
          { "@type": "ListItem", position: 3, name: post.title },
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
          {/* Masthead. Type-led rather than image-led: this is an article, and
              a full-bleed photograph above the headline would push the first
              sentence below the fold for no editorial gain. */}
          <header className="hairline pt-28 sm:pt-32">
            <div className="container-page pb-12">
              {/* A trail, not a single back link. A post is two levels deep,
                  so one "up" only reached /blog: getting home meant finding it
                  in the nav, where the section links are hidden below 1024px.
                  Showing both rungs also makes the visible navigation agree
                  with the BreadcrumbList below. */}
              <Reveal>
                <nav
                  aria-label="Breadcrumb"
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted"
                >
                  {/* Both rungs carry `py-2 -my-2`, which grows an 11px link's
                      17px box to about 33px without shifting the row. WCAG 2.5.8
                      wants 24px minimum, and these are the primary way back. */}
                  <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <li>
                      <Link
                        href="/#projects"
                        className="group -my-2 inline-flex items-center gap-2 py-2 transition-colors duration-300 hover:text-accent"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
                        >
                          ←
                        </span>
                        Portfolio
                      </Link>
                    </li>
                    <li aria-hidden="true" className="text-subtle">
                      /
                    </li>
                    <li>
                      <Link
                        href="/blog"
                        className="-my-2 inline-block py-2 transition-colors duration-300 hover:text-accent"
                      >
                        All writing
                      </Link>
                    </li>
                  </ol>
                </nav>
              </Reveal>

              <Reveal delay={0.05}>
                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-highlight">
                  {post.kicker}
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2rem,4.6vw,3.25rem)] font-medium leading-[1.06] tracking-[-0.03em]">
                  {post.title}
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                  <span>{person.name}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.isoDate}>{post.date}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
              </Reveal>
            </div>
          </header>

          {/* Cover */}
          <div className="container-page pt-10">
            <Reveal>
              <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-border">
                <Image
                  src={`/blog/${post.slug}.jpg`}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 1100px, 100vw"
                  className={cn("object-cover", PROJECT_IMAGE_FILTER)}
                />
                <div className={cn("absolute inset-0", PROJECT_IMAGE_WASH)} />
              </div>
            </Reveal>
          </div>

          {/* Body.
              MEASURE is 35rem, which is 560px. At the 17px body size and
              Manrope's measured average glyph width of 8.01px that comes to
              about 70 characters a line, inside the 45 to 75 range prose stays
              comfortable in.

              The measure is applied per block rather than once around
              everything, because figures have to be wider than the prose to be
              readable at all. A BPMN model with forty labelled elements set into
              a 560px column is decoration. Negative margins were the other
              option and they are worse: container-page has only 80px of slack
              each side at 768px, so the safe value differs per breakpoint and
              silently overflows the day the padding changes. */}
          <div className="container-page py-14 sm:py-16">
            {post.sourceNote && (
              <div className={MEASURE}>
                <Reveal>
                  <p className="mb-10 border-l-2 border-border pl-5 text-[13px] leading-relaxed text-subtle">
                    {post.sourceNote}
                  </p>
                </Reveal>
              </div>
            )}

            <div className={MEASURE}>
              {post.intro.map((para, i) => (
                <Reveal key={i} delay={0.04 * i}>
                  <p className="mb-6 text-pretty text-xl leading-[1.65] text-foreground/90">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>

            {post.sections.map((section) => (
              <section key={section.heading} className="mt-14">
                <div className={MEASURE}>
                  <Reveal>
                    <h2 className="text-[clamp(1.3rem,2.6vw,1.7rem)] font-medium tracking-[-0.025em]">
                      {section.heading}
                    </h2>
                  </Reveal>

                  {section.body.map((para, i) => (
                    <Reveal key={i} delay={0.03 * i}>
                      <p className="mt-5 text-pretty text-[1.0625rem] leading-[1.75] text-muted">
                        {para}
                      </p>
                    </Reveal>
                  ))}

                  {section.list && (
                    <Reveal>
                      <dl className="mt-7 space-y-px overflow-hidden rounded-xl border border-border">
                        {section.list.map((item) => (
                          <div
                            key={item.term}
                            className="bg-surface p-5 transition-colors duration-500 hover:bg-surface-raised"
                          >
                            <dt className="text-[15px] font-medium tracking-[-0.01em]">
                              {item.term}
                            </dt>
                            <dd className="mt-1.5 text-pretty text-[14px] leading-relaxed text-muted">
                              {item.detail}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </Reveal>
                  )}

                  {section.stats && (
                    <Reveal>
                      <ul className="mt-8 grid gap-6 rounded-xl border border-border bg-surface p-6 sm:grid-cols-3">
                        {section.stats.map((stat) => (
                          <li key={stat.label}>
                            <p className="font-mono text-2xl tracking-[-0.02em] text-accent">
                              {stat.value}
                            </p>
                            <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                              {stat.label}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  )}
                </div>

                {section.figures?.map((figure) => (
                  <div
                    key={figure.src}
                    className="mx-auto max-w-3xl lg:max-w-5xl"
                  >
                    <Reveal>
                      <FigureBlock
                        figure={figure}
                        index={figureNumber(figure.src)}
                      />
                    </Reveal>
                  </div>
                ))}
              </section>
            ))}

            <div className={MEASURE}>
              <div className="hairline mt-16 pt-10">
                {post.closing.map((para, i) => (
                  <Reveal key={i} delay={0.03 * i}>
                    <p className="mb-5 text-pretty text-lg leading-[1.7] text-foreground/90">
                      {para}
                    </p>
                  </Reveal>
                ))}
              </div>

              <Reveal>
                <ul className="mt-10 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>

          {/* Next */}
          <section className="hairline py-16 sm:py-20">
            <div className="container-page">
              <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
                  Read next
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <Link
                  href={`/blog/${next.slug}`}
                  className="group mt-5 block max-w-3xl"
                >
                  <span className="text-[clamp(1.4rem,3.2vw,2.1rem)] font-medium leading-tight tracking-[-0.03em] transition-colors duration-300 group-hover:text-accent">
                    {next.title}
                  </span>
                  <span className="mt-3 block text-pretty leading-relaxed text-muted">
                    {next.excerpt}
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
