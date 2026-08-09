import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Small monospace label, e.g. "01 / Work". */
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="mt-4 text-balance text-[clamp(1.85rem,4.2vw,3rem)] font-medium leading-[1.1] tracking-[-0.03em]">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.12}>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted sm:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
