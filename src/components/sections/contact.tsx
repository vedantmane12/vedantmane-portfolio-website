import { ContactForm } from "@/components/contact-form";
import { ContactIcon } from "@/components/contact-icon";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { person, phoneHref, socials } from "@/content/site";

export function Contact() {
  return (
    <section
      id="contact"
      className="hairline relative scroll-mt-16 overflow-hidden py-24 sm:py-32"
    >
      <div className="glow-field absolute inset-0 -z-10 opacity-70" aria-hidden="true" />

      <div className="container-page">
        <SectionHeading
          eyebrow="06 / Contact"
          title="Let's work together"
          description="Whether it's a role, a research collaboration, or a data problem you're stuck on, tell me what you're working on and I'll get back to you."
        />

        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="hairline mt-16 pt-10">
            <p className="text-sm text-subtle">Or reach me directly</p>
            <a
              href={`mailto:${person.email}`}
              className="group mt-3 inline-flex max-w-full items-center gap-3 text-xl font-medium tracking-[-0.02em] sm:text-2xl"
            >
              <ContactIcon
                name="email"
                className="size-5 shrink-0 text-accent"
              />
              <span className="relative break-all">
                {person.email}
                {/* Underline wipes in from the left on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 text-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗
              </span>
            </a>

            {/* Set a step below the email, which stays the primary route. The
                tel: href is the E.164 form so it dials correctly from a phone,
                while the label keeps the readable formatting. */}
            <a
              href={phoneHref}
              className="group mt-4 flex w-fit items-center gap-3 text-lg font-medium tracking-[-0.01em] sm:text-xl"
            >
              <ContactIcon
                name="phone"
                className="size-[1.15rem] shrink-0 text-accent"
              />
              <span className="relative whitespace-nowrap">
                {person.phone}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
              </span>
            </a>

            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {socials
                .filter((social) => social.label !== "Email")
                .map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-muted transition-colors duration-300 hover:text-foreground"
                    >
                      <ContactIcon name={social.icon} className="size-4 text-subtle" />
                      <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                        {social.label}
                      </span>
                      {social.handle}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
