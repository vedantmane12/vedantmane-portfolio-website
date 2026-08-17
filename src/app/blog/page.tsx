import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Nav } from "@/components/nav";
import { blogIntro, postsByDate } from "@/content/blog";
import { person, SITE_URL } from "@/content/site";
import { PROJECT_IMAGE_FILTER, PROJECT_IMAGE_WASH } from "@/lib/project-media";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Process engineering case studies: service desk analysis, design thinking, project planning, process redesign and delivery governance.",
  keywords: [
    "business process engineering",
    "process analysis",
    "BPMN",
    "design thinking",
    "project management",
    "process redesign",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Writing | ${person.name}`,
    description:
      "Process engineering case studies: analysis, design thinking, planning, redesign and delivery governance.",
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: `${person.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Writing | ${person.name}`,
    description: "Process engineering case studies.",
  },
};

export default function BlogIndex() {
  const [lead, ...rest] = postsByDate;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name: `Writing by ${person.name}`,
    description:
      "Process engineering case studies: analysis, design thinking, planning, redesign and delivery governance.",
    url: `${SITE_URL}/blog`,
    author: { "@id": `${SITE_URL}/#person` },
    blogPost: postsByDate.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${SITE_URL}/blog/${post.slug}#post`,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.isoDate,
      url: `${SITE_URL}/blog/${post.slug}`,
      keywords: post.tags.join(", "),
    })),
  };

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="main-content" className="flex-1">
        {/* Masthead */}
        <header className="hairline pt-28 sm:pt-32">
          <div className="container-page pb-14 sm:pb-16">
            {/* Route back to the portfolio, same treatment the project pages
                use. Without it this page's only way home was inside the nav,
                where the section links are hidden below 1024px and the brand
                loses its label below 640px, leaving an unlabelled memoji as the
                sole affordance on a phone. Points at #projects rather than the
                top because that is the section the visitor left to get here. */}
            <Reveal>
              {/* `py-2 -my-2` grows the hit area to about 33px without moving
                  anything: 11px type gives a 17px box, and WCAG 2.5.8 asks for
                  24px minimum. The negative margin cancels the padding in flow. */}
              <Link
                href="/#projects"
                className="group -my-2 inline-flex items-center gap-2 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-accent"
              >
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
                >
                  ←
                </span>
                Back to portfolio
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-highlight">
                Writing
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.03em]">
                Notes on making processes work
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
                {blogIntro}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
                {postsByDate.length} pieces
              </p>
            </Reveal>
          </div>
        </header>

        {/* Lead post, given the wide treatment */}
        {lead && (
          <section className="hairline py-14 sm:py-16">
            <div className="container-page">
              <Reveal>
                <Link href={`/blog/${lead.slug}`} className="group block">
                  <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-border">
                    <Image
                      src={`/blog/${lead.slug}.jpg`}
                      alt=""
                      fill
                      priority
                      sizes="(min-width: 1024px) 1100px, 100vw"
                      className={cn(
                        "object-cover transition-transform duration-700 group-hover:scale-[1.03]",
                        PROJECT_IMAGE_FILTER,
                      )}
                    />
                    <div
                      className={cn("absolute inset-0", PROJECT_IMAGE_WASH)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  </div>

                  <div className="mt-7 max-w-3xl">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                      {lead.kicker} · {lead.date}
                    </p>
                    <h2 className="mt-3 text-balance text-[clamp(1.5rem,3.4vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.03em] transition-colors duration-300 group-hover:text-accent">
                      {lead.title}
                    </h2>
                    <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
                      {lead.excerpt}
                    </p>
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                      {lead.readingMinutes} min read
                    </p>
                  </div>
                </Link>
              </Reveal>
            </div>
          </section>
        )}

        {/* The rest, as a list rather than a grid: these are articles, and a
            reader scanning them wants titles and standfirsts, not thumbnails. */}
        <section className="hairline py-14 sm:py-16">
          <div className="container-page">
            <RevealGroup as="ol" className="space-y-px" stagger={0.07}>
              {rest.map((post) => (
                <RevealItem as="li" key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group grid gap-5 border-t border-border py-8 transition-colors duration-300 hover:border-accent/40 sm:grid-cols-[13rem_1fr] sm:gap-8 md:py-10"
                  >
                    <div className="relative hidden aspect-[4/3] overflow-hidden rounded-xl border border-border sm:block">
                      <Image
                        src={`/blog/${post.slug}.jpg`}
                        alt=""
                        fill
                        sizes="208px"
                        className={cn(
                          "object-cover transition-transform duration-700 group-hover:scale-[1.05]",
                          PROJECT_IMAGE_FILTER,
                        )}
                      />
                      <div
                        className={cn("absolute inset-0", PROJECT_IMAGE_WASH)}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                        {post.kicker} · {post.date}
                      </p>
                      <h2 className="mt-2.5 text-balance text-xl font-medium leading-snug tracking-[-0.02em] transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                        {post.title}
                      </h2>
                      <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted">
                        {post.excerpt}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                          {post.readingMinutes} min read
                        </span>
                        <ul className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
