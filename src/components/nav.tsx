"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { person, sections } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * A section link has to work from two places, and the two need different
 * elements.
 *
 * On the home page the target is on the page already, so it stays a bare hash
 * anchor and Lenis handles the smooth scroll. Routing it through Next's Link
 * instead would hand the scroll to the router and produce a hard jump.
 *
 * From a project page there is nothing on the page to scroll to, which is why
 * these links used to do nothing at all there. Off the home page the href
 * becomes "/#id" and goes through Link, so it travels home client-side rather
 * than triggering a full reload of a fairly heavy page.
 */
function SectionLink({
  id,
  href,
  isHome,
  className,
  onClick,
  ariaCurrent,
  children,
}: {
  id: string;
  /** Set for entries that are routes rather than sections, such as Writing. */
  href?: string;
  isHome: boolean;
  className?: string;
  onClick?: () => void;
  ariaCurrent?: boolean;
  children: ReactNode;
}) {
  // A route entry has nothing to scroll to, so it always goes through Link,
  // from the home page as well as anywhere else.
  if (href) {
    return (
      <Link
        href={href}
        className={className}
        onClick={onClick}
        aria-current={ariaCurrent ? "page" : undefined}
      >
        {children}
      </Link>
    );
  }

  if (isHome) {
    return (
      <a
        href={`#${id}`}
        className={className}
        onClick={onClick}
        aria-current={ariaCurrent ? "true" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={`/#${id}`}
      className={className}
      onClick={onClick}
      aria-current={ariaCurrent ? "true" : undefined}
    >
      {children}
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const onProjectPage = pathname.startsWith("/projects");
  const onBlog = pathname.startsWith("/blog");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the nav link for whichever section currently owns the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const section of sections) {
      // Route entries such as Writing have no element here to observe.
      if ("href" in section) continue;
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="container-page flex h-16 items-center justify-between gap-6"
      >
        <SectionLink
          id="home"
          isHome={isHome}
          className="group flex items-center gap-2.5 text-sm font-medium tracking-tight"
        >
          {/* The same head as the favicon, so the tab and the header carry one
              mark. No chip behind it: the silhouette is its own shape, and a
              tile would put the low-contrast dark hair back on a dark panel.
              Decorative, since the name sits next to it inside the same link. */}
          <Image
            src="/memoji.png"
            alt=""
            width={205}
            height={288}
            priority
            className="h-8 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="hidden whitespace-nowrap font-bold sm:inline">
            {person.name}
          </span>
        </SectionLink>

        {/* Seven links plus the brand and buttons need ~1024px to sit
            comfortably; below that the hamburger takes over. */}
        <ul className="hidden items-center gap-1 lg:flex">
          {sections.map((section) => {
            // On the home page the observer decides. On a project page nothing
            // is observable, so Projects is marked instead: that is the section
            // the visitor came from and would return to.
            const current = onBlog
              ? section.id === "blog"
              : isHome
                ? active === section.id
                : onProjectPage && section.id === "projects";

            return (
              <li key={section.id}>
                <SectionLink
                  id={section.id}
                  href={"href" in section ? section.href : undefined}
                  isHome={isHome}
                  ariaCurrent={current}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300",
                    current
                      ? "text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {current && !reduceMotion && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-surface-raised"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  {section.label}
                </SectionLink>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={person.resumeHref}
            className="hidden rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors duration-300 hover:border-accent hover:text-accent sm:inline-block"
          >
            Résumé
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full border border-border text-muted transition-colors hover:text-foreground lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-current transition-all duration-300",
                  open ? "top-1.5 rotate-45" : "top-0.5",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-current transition-all duration-300",
                  open ? "top-1.5 -rotate-45" : "top-2.5",
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-4">
              {sections.map((section) => (
                <li key={section.id}>
                  <SectionLink
                    id={section.id}
                    href={"href" in section ? section.href : undefined}
                    isHome={isHome}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-2 py-2.5 text-base text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
                  >
                    {section.label}
                  </SectionLink>
                </li>
              ))}
              <li>
                <a
                  href={person.resumeHref}
                  className="block rounded-lg px-2 py-2.5 text-base text-accent"
                >
                  Résumé
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
