"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary.
 *
 * Has to be a client component and cannot use the shared Nav, which reads the
 * pathname and would risk throwing again inside the boundary that is meant to
 * contain the failure. So this deliberately stays plain: its own markup, no
 * data from `site.ts`, nothing that can fail a second time.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is the only handle on the server-side stack once this is
    // deployed, so log it rather than swallowing the error silently.
    console.error("[error boundary]", error.digest ?? "(no digest)", error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex flex-1 items-center py-32 sm:py-40"
    >
      <div className="container-page">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-highlight">
          Something broke
        </p>

        <h1 className="mt-5 max-w-3xl text-balance text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.03em]">
          This page didn&rsquo;t load.
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
          Not something you did. Try again, and if it keeps happening the rest
          of the site should still be fine.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform duration-300 hover:scale-[1.02]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
            Reference {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
