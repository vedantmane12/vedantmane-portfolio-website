import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/motion/reveal";
import { Nav } from "@/components/nav";
import { projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  // Next injects its own `noindex` for this route outside the Metadata API, so
  // there are always two robots tags here. Without this override the second one
  // is the layout's site-wide `index, follow`, and the head then contradicts
  // itself. Crawlers take the most restrictive reading either way, but tags
  // that agree are worth the one line.
  robots: { index: false, follow: true },
};

/**
 * Shown for any unmatched route, including a project slug that no longer
 * exists after `notFound()` fires in `projects/[slug]`.
 *
 * The layout renders no chrome of its own, so this page brings its own nav and
 * footer. Without them a mistyped or stale project URL landed on a bare white
 * page with no way back into the site, which is the likeliest way anyone meets
 * this route: project links get pasted into applications and outlive slugs.
 */
export default function NotFound() {
  // Three recent projects, so the page offers somewhere to go rather than only
  // apologising. Read from the data, so it cannot drift as projects change.
  const suggestions = projects.slice(0, 3);

  return (
    <>
      <Nav />

      <main
        id="main-content"
        className="flex flex-1 items-center py-32 sm:py-40"
      >
        <div className="container-page">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-highlight">
              404
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-5 max-w-3xl text-balance text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.03em]">
              That page isn&rsquo;t here.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
              The link may be out of date, or the address slightly off. Here is
              the way back.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform duration-300 hover:scale-[1.02]"
              >
                Home
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                All projects
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="hairline mt-16 pt-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
                Or start here
              </p>
              <ul className="mt-6 space-y-px">
                {suggestions.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border py-4 transition-colors duration-300 hover:border-accent/40"
                    >
                      <span className="text-base font-medium tracking-[-0.01em] transition-colors duration-300 group-hover:text-accent">
                        {project.title}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                        {project.discipline}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </>
  );
}
