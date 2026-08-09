import { Certifications } from "@/components/certifications";
import { ContactIcon } from "@/components/contact-icon";
import { CourseList } from "@/components/course-list";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { OrgLogo } from "@/components/org-logo";
import { SectionHeading } from "@/components/section-heading";
import { education } from "@/content/site";

export function Education() {
  return (
    <section id="education" className="hairline scroll-mt-16 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading eyebrow="02 / Education" title="Where I studied" />

        <RevealGroup as="ol" className="mt-14" stagger={0.1}>
          {education.map((entry) => (
            <RevealItem
              as="li"
              key={`${entry.school}-${entry.degree}`}
              className="group border-t border-border py-8 transition-colors duration-300 hover:border-accent/40 md:py-10"
            >
              {/* Logo and copy share a row; the date column drops below the
                  copy on narrow screens rather than squeezing three columns. */}
              <div className="flex items-start gap-5 sm:gap-7">
                <OrgLogo
                  slug={entry.logo}
                  name={entry.school}
                  className="size-14 sm:size-[4.5rem]"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-x-8 gap-y-2 lg:flex-row lg:items-baseline lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h3 className="text-xl font-medium tracking-[-0.02em] sm:text-2xl">
                          {entry.degree}
                        </h3>
                        <span className="font-mono text-xs text-accent">
                          {entry.grade}
                        </span>
                      </div>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm text-muted">
                        {entry.school}
                        <span aria-hidden="true" className="text-subtle">
                          ·
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <ContactIcon
                            name="location"
                            className="size-3 shrink-0 text-subtle"
                          />
                          {entry.location}
                        </span>
                      </p>
                    </div>

                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle lg:whitespace-nowrap lg:pt-1">
                      {entry.start} to {entry.end}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary and coursework sit outside the logo row, so on a phone
                  they use the full width. Inside it, the logo held a 76px
                  gutter down the whole entry and squeezed the summary to 251px
                  of 327px, which ran it to twenty lines. The padding from sm up
                  restores the original alignment: logo width plus its gap. */}
              <div className="sm:pl-[6.25rem]">
                {entry.summary && (
                  <p className="mt-5 max-w-3xl text-pretty leading-relaxed text-muted">
                    {entry.summary}
                  </p>
                )}

                {entry.courses && entry.courses.length > 0 && (
                  <CourseList
                    courses={entry.courses}
                    totalCredits={entry.totalCredits}
                  />
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Certifications sit under the degrees rather than in a section of
            their own: they are the same thing, formal study, and separating
            them would imply the site has more sections than it does. */}
        <div className="hairline mt-20 pt-14">
          <Reveal>
            <Certifications />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
