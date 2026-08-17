import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/motion/reveal";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Nav } from "@/components/nav";
import { getPost, posts, postsByDate } from "@/content/blog";
import { person, SITE_URL } from "@/content/site";
import { PROJECT_IMAGE_FILTER, PROJECT_IMAGE_WASH } from "@/lib/project-media";
import { cn } from "@/lib/utils";

/** `params` is a Promise in this version of Next and has to be awaited. */
type Params = { params: Promise<{ slug: string }> };

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
    title: post.title,
    description: post.excerpt,
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
        wordCount:
          post.intro.join(" ").split(/\s+/).length +
          post.sections.reduce(
            (n, s) => n + s.body.join(" ").split(/\s+/).length,
            0,
          ),
        datePublished: post.isoDate,
        dateModified: post.isoDate,
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
              <Reveal>
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-accent"
                >
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
                  >
                    ←
                  </span>
                  All writing
                </Link>
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

          {/* Body. Measure is capped near 68 characters, which is where long
              prose stops being comfortable regardless of how wide the screen is. */}
          <div className="container-page py-14 sm:py-16">
            <div className="mx-auto max-w-[42rem]">
              {post.sourceNote && (
                <Reveal>
                  <p className="mb-10 border-l-2 border-border pl-5 text-[13px] leading-relaxed text-subtle">
                    {post.sourceNote}
                  </p>
                </Reveal>
              )}

              {post.intro.map((para, i) => (
                <Reveal key={i} delay={0.04 * i}>
                  <p className="mb-6 text-pretty text-xl leading-[1.65] text-foreground/90">
                    {para}
                  </p>
                </Reveal>
              ))}

              {post.sections.map((section) => (
                <section key={section.heading} className="mt-14">
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
                </section>
              ))}

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
