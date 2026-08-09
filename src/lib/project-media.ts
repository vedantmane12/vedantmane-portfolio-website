/**
 * Shared treatment for the project photographs, so the card thumbnail and the
 * page header cannot drift apart.
 *
 * The photographs come from ten different photographers and have nothing in
 * common tonally. Pulling the saturation down and tinting toward the accent is
 * what makes them read as one set rather than as a stock library, and it keeps
 * them from competing with the type sitting on top.
 *
 * Sources and licence are recorded in `public/projects/CREDITS.md`.
 */
export const PROJECT_IMAGE_FILTER = "grayscale-[0.55] saturate-[0.7]";

/** Accent wash laid over the photograph in `color` blend mode. */
export const PROJECT_IMAGE_WASH = "bg-accent/25 mix-blend-color";

export function projectImageSrc(slug: string) {
  return `/projects/${slug}.jpg`;
}
