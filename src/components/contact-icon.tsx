import { siGithub, siInstagram } from "simple-icons";

/**
 * Monochrome glyphs for the contact links.
 *
 * All four are filled 24x24 paths inheriting `currentColor`, so they take the
 * colour of the link they sit in and change with it on hover. That rules out
 * the Iconify `logos` set, whose marks carry hardcoded brand fills and would
 * sit as two coloured badges among two grey ones.
 *
 * GitHub and Instagram come from `simple-icons`, which is already a dependency.
 * LinkedIn is inlined because Simple Icons no longer ships it. Mail, phone and
 * location are not brands at all, so they use the conventional envelope,
 * handset and map pin shapes.
 */
const PATHS: Record<string, string> = {
  github: siGithub.path,
  instagram: siInstagram.path,
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  email:
    "M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z",
  phone:
    "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
  location:
    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z",
};

export type ContactIconName = keyof typeof PATHS;

export function ContactIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}
