/**
 * A figure lifted from the work itself: a BPMN model, a journey map, a
 * dashboard screenshot. Shared by the writing and the project pages, because
 * both need the same thing and a project has no business importing a blog type.
 *
 * `width` and `height` are the real pixel dimensions of the asset, so the page
 * reserves the right box and never shifts on load, and so the component can
 * refuse to upscale a figure past its native size. Several of these came out of
 * source PDFs at modest resolution and go visibly soft if stretched.
 *
 * `tone` is measured, not guessed. It comes from the luminance of the top right
 * corner, where the zoom affordance sits, rather than from the whole image: a
 * mean across the frame called one dark diagram light because a few pale cards
 * outweighed the black canvas the badge actually lands on.
 */
export type Figure = {
  /** Path under /public. */
  src: string;
  width: number;
  height: number;
  /** Describes what the figure contains, for screen readers and for search. */
  alt: string;
  /** Visible caption. Says what to look for rather than restating the alt. */
  caption: string;
  tone: "light" | "dark";
};
