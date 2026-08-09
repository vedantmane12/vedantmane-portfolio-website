import { ContactIcon } from "@/components/contact-icon";
import { person, socials } from "@/content/site";

export function Footer() {
  return (
    <footer className="hairline">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-subtle">
          © {new Date().getFullYear()} {person.name}
        </p>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={
                social.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="inline-flex items-center gap-1.5 text-xs text-subtle transition-colors duration-300 hover:text-foreground"
            >
              <ContactIcon name={social.icon} className="size-3.5" />
              {social.label}
            </a>
          ))}
          <a
            // Same landmark, so this works on a project page too, where
            // there is no "#home" to scroll to.
            href="#main-content"
            className="text-xs text-subtle transition-colors duration-300 hover:text-foreground"
          >
            Back to top ↑
          </a>
        </nav>
      </div>
    </footer>
  );
}
