import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { projectDetails } from "@/content/project-details";
import { projects } from "@/content/site";

export function Work() {
  // Only the lead project gets the wide slot and the larger type, since the
  // enlarged treatment needs the extra column width to read well.
  const [lead, ...rest] = [
    ...projects.filter((p) => p.featured),
    ...projects.filter((p) => !p.featured),
  ];

  /**
   * The card's headline figure is the first entry in the project's results, so
   * the number on the card and the number on its page are the same one.
   *
   * Read here rather than inside the card because this is a server component:
   * importing the long-form details from a client component would ship all ten
   * deep dives to the browser to display one figure each.
   */
  const headline = (slug: string) => projectDetails[slug]?.results[0];

  return (
    <section id="projects" className="hairline scroll-mt-16 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="04 / Projects"
          title="Built, shipped, measured"
          // Count comes from the data so it stays right as projects are added.
          description={`${projects.length} systems taken from raw source to something you can open. Every figure below is measured, not estimated. Open any project for its architecture and the decisions behind it.`}
        />

        {/* `auto-rows-fr` was forcing every row to the height of the tallest
            card in the whole grid, which left the shorter ones padded with dead
            space. Without it each row sizes to its own content, and the cards
            inside a row still stretch to match one another. */}
        <RevealGroup
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.09}
        >
          {lead && (
            <RevealItem className="sm:col-span-2">
              <ProjectCard
                project={lead}
                metric={headline(lead.slug)?.metric}
                metricLabel={headline(lead.slug)?.label}
                featured
              />
            </RevealItem>
          )}
          {rest.map((project) => (
            <RevealItem key={project.slug}>
              <ProjectCard
                project={project}
                metric={headline(project.slug)?.metric}
                metricLabel={headline(project.slug)?.label}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
