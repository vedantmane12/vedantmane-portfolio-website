import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { TechIcon } from "@/components/tech-icon";
import { techStack, techStackIntro } from "@/content/site";

export function TechStack() {
  return (
    <section id="skills" className="hairline scroll-mt-16 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="05 / Skills"
          title="My tech stack"
          description={techStackIntro}
        />

        <RevealGroup
          as="ul"
          className="mt-14 grid gap-x-12 sm:grid-cols-2"
          stagger={0.035}
        >
          {techStack.map((tech) => (
            <RevealItem
              as="li"
              key={tech.slug}
              y={14}
              className="group flex items-start gap-5 border-t border-border py-6 transition-colors duration-300 hover:border-accent/40"
            >
              <TechIcon
                slug={tech.slug}
                name={tech.name}
                className="mt-0.5 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="min-w-0">
                <h3 className="text-base font-medium tracking-[-0.01em]">
                  {tech.name}
                </h3>
                <p className="mt-1 text-pretty text-sm leading-relaxed text-muted">
                  {tech.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
