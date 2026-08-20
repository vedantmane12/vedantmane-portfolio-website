import Image from "next/image";
import type { Figure } from "@/lib/figure";
import { cn } from "@/lib/utils";

/**
 * A figure from the work itself, framed and captioned. Used by both the
 * writing pages and the project pages.
 *
 * Three decisions worth recording.
 *
 * The image fills the frame edge to edge and its own background becomes the
 * panel. About a third of these diagrams were authored dark and the rest light,
 * and normalising them onto one background would either wash out the pastel
 * BPMN swimlanes or leave dark cards floating on white. Letting each figure
 * bring its own surface means both kinds read as deliberate.
 *
 * Nothing is upscaled past its native width. Several figures were embedded in
 * the source PDFs at around 700px and go visibly soft if stretched to fill a
 * 1024px column, so the wrapper is capped at the real asset width.
 *
 * A BPMN model with forty labelled elements is not legible on a phone at any
 * layout, so the whole figure is a link to the full-resolution file. That is
 * deliberately a plain anchor rather than a lightbox: it needs no client
 * JavaScript, it hands the reader their own pinch-zoom, and the caption states
 * the takeaway so the argument survives without opening anything.
 */
export function FigureBlock({
  figure,
  index,
}: {
  figure: Figure;
  index: number;
}) {
  return (
    <figure
      className="mx-auto mt-10 w-full"
      style={{ maxWidth: `min(100%, ${figure.width}px)` }}
    >
      <a
        href={figure.src}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "group relative block overflow-hidden rounded-xl border border-border",
          "transition-colors duration-300 hover:border-accent/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        )}
        aria-label={`${figure.alt} Opens the full size image.`}
      >
        <Image
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          sizes="(min-width: 1280px) 1024px, (min-width: 640px) 90vw, 100vw"
          className="h-auto w-full"
        />

        {/* Sits on the figure's own surface, so it has to contrast against
            whichever tone that is.

            Always visible where there is no hover. Revealing this on hover alone
            hid it permanently on touch, which is the worst place to hide it: a
            phone renders these diagrams about 310px wide, so opening the full
            file is the only way to read one, and that was the single most
            important control on the page with no affordance at all. */}
        <span
          className={cn(
            "pointer-events-none absolute right-3 top-3 rounded-full px-2.5 py-1",
            "font-mono text-[10px] uppercase tracking-[0.14em]",
            "opacity-0 transition-opacity duration-300",
            "group-hover:opacity-100 group-focus-visible:opacity-100",
            "[@media(hover:none)]:opacity-100",
            figure.tone === "light"
              ? "bg-black/75 text-white"
              : "bg-white/85 text-black",
          )}
        >
          Full size
        </span>
      </a>

      <figcaption className="mt-3.5 flex gap-3 text-[13px] leading-relaxed text-subtle">
        <span
          aria-hidden="true"
          className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-highlight"
        >
          Fig {index}
        </span>
        <span className="text-pretty">{figure.caption}</span>
      </figcaption>
    </figure>
  );
}
