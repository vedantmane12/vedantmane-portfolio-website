import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Organisation marks for the Experience and Education sections.
 *
 * The mapping is static on purpose. An earlier version scanned
 * `public/logos/companies` with `node:fs`, which broke the moment a client
 * component imported it: Turbopack can't put `node:fs` in a browser bundle,
 * and Experience is a client component because of its scroll-driven rail.
 * Adding a logo means dropping the file in and adding one line here.
 *
 * `plate` sets the backing tile. These are third-party marks with fixed
 * colours we can't recolour for dark mode, so each needs the right backdrop:
 *   light - dark or colour ink (TCS, the two university seals)
 *   dark  - reversed white ink (ABCOM's wordmark)
 */
type Org = {
  /** Shown if `src` is unset or the image fails to load. */
  label: string;
  hex: string;
  plate: "light" | "dark";
  src?: string;
};

const orgs: Record<string, Org> = {
  "tcs-logo": {
    label: "TCS",
    hex: "#0F75BC",
    plate: "light",
    // The full lockup is 2.5:1, which letterboxes down to an unreadable sliver
    // in a square tile. tcs-mark.png is the symbol alone, cropped from the
    // original (still here as tcs-logo.png) and close to square.
    src: "/logos/companies/tcs-mark.png",
  },
  "neu-logo": {
    label: "NU",
    hex: "#C8102E",
    plate: "light",
    src: "/logos/companies/neu-logo.png",
  },
  "abcom-logo": {
    label: "AB",
    hex: "#FFFFFF",
    plate: "dark",
    src: "/logos/companies/abcom-logo.png",
  },
  "mu-logo": {
    label: "MU",
    hex: "#8C1D40",
    plate: "light",
    src: "/logos/companies/mu-logo.png",
  },
};

export function OrgLogo({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const org = orgs[slug];

  const shell = cn(
    "grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl border p-2",
    org?.plate === "dark"
      ? "border-white/15 bg-[#0d0d0f]"
      : "border-black/10 bg-white",
    className,
  );

  if (org?.src) {
    return (
      <span className={shell}>
        {/* Letterboxed, so wide wordmarks like TCS and ABCOM stay as large as
            their aspect ratio allows inside a square tile. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size brand mark, nothing for the optimizer to do */}
        <img
          src={org.src}
          alt={`${name} logo`}
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  return (
    <span
      className={shell}
      style={{ "--brand": org?.hex ?? "#8e8e98" } as CSSProperties}
    >
      <span className="text-sm font-semibold tracking-tight text-[var(--brand)]">
        {org?.label ?? name.slice(0, 2).toUpperCase()}
      </span>
    </span>
  );
}
