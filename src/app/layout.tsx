import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { themeInitScript } from "@/components/providers/theme-toggle";
import {
  education,
  person,
  projects,
  SITE_URL,
  socials,
  targetRoles,
  techStack,
} from "@/content/site";
import "./globals.css";

/**
 * Type system, three faces with distinct jobs:
 *   Manrope         body and UI. Geometric sans with more warmth than Inter,
 *                   still neutral enough to disappear in long paragraphs.
 *   Instrument Serif display accents only, set in italic. High-contrast, and
 *                   the single expressive note on the page.
 *   JetBrains Mono  eyebrows, dates, and metrics. Signals engineering, and its
 *                   tabular figures keep numbers aligned between rows.
 *
 * next/font self-hosts all three, so there are no requests to Google at
 * runtime and no layout shift while they load.
 */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = `${person.name} | ${person.role}`;
const description = `${person.name} is a Data Engineer and AI Developer in ${person.location} with 3+ years building production data platforms. Real-time ETL, dimensional warehousing on Databricks and Snowflake, and multi-agent AI systems with LangGraph and RAG.`;

export const metadata: Metadata = {
  // Makes every relative URL below resolve against the real domain.
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s | ${person.name}`,
  },
  description,
  applicationName: `${person.name} Portfolio`,
  authors: [{ name: person.name, url: SITE_URL }],
  creator: person.name,
  publisher: person.name,
  keywords: [
    person.name,
    "data engineer",
    "AI developer",
    "machine learning engineer",
    "data engineer portfolio",
    "ETL pipelines",
    "dimensional modelling",
    "multi-agent AI",
    "LangGraph",
    "RAG",
    "LLM fine-tuning",
    "Northeastern University",
    person.location,
    ...techStack.map((tech) => tech.name),
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    siteName: `${person.name} Portfolio`,
    title,
    description,
    url: SITE_URL,
    locale: "en_US",
    firstName: person.firstName,
    lastName: person.name.split(" ").slice(1).join(" "),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  // TODO: paste the token from Google Search Console once the domain is live.
  // verification: { google: "..." },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbf9" },
    { media: "(prefers-color-scheme: dark)", color: "#08090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * schema.org Person graph. This is what lets Google build a knowledge-panel
 * style understanding of who the site is about, rather than guessing from text.
 */
function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: person.name,
        givenName: person.firstName,
        jobTitle: person.role,
        // Not `bio`: the visible copy is deliberately generic, and crawlers
        // still need the concrete stack and scale nouns.
        description: person.seoDescription,
        email: `mailto:${person.email}`,
        // E.164, which is the form schema.org expects.
        telephone: person.phone.replace(/[^\d+]/g, ""),
        url: SITE_URL,
        address: {
          "@type": "PostalAddress",
          addressLocality: person.location.split(",")[0]?.trim(),
          addressRegion: person.location.split(",")[1]?.trim(),
          addressCountry: "US",
        },
        sameAs: socials
          .filter((s) => s.href.startsWith("http"))
          .map((s) => s.href),
        knowsAbout: techStack.map((tech) => tech.name),
        // The titles this profile should surface for. The hero names six of
        // them on the pipeline; this is where the rest become machine-readable
        // without resorting to hidden keyword text on the page.
        hasOccupation: targetRoles.map((title) => ({
          "@type": "Occupation",
          name: title,
        })),
        // Deduped by school: two Mumbai degrees are one institution. The
        // degrees themselves are listed separately under hasCredential.
        alumniOf: [
          ...new Map(
            education.map((entry) => [
              entry.school,
              {
                "@type": "CollegeOrUniversity",
                name: entry.school,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: entry.location.split(",")[0]?.trim(),
                },
              },
            ]),
          ).values(),
        ],
        hasCredential: education.map((entry) => ({
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "degree",
          name: entry.degree,
          recognizedBy: { "@type": "CollegeOrUniversity", name: entry.school },
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: title,
        description,
        inLanguage: "en-US",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      ...projects
        .filter((p) => p.featured)
        .map((project) => ({
          "@type": "CreativeWork",
          name: project.title,
          description: project.blurb,
          url: project.href ?? project.repo ?? `${SITE_URL}/#work`,
          author: { "@id": `${SITE_URL}/#person` },
          keywords: project.stack.join(", "),
        })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Content is authored by us in site.ts, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          // Sets the theme class before first paint to avoid a colour flash.
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Rendered in the body, matching Next's own JSON-LD guidance. React
            hoists it as needed; crawlers read it from anywhere in the document. */}
        <StructuredData />
        {/* Targets the main landmark rather than a section id. Pointing at
            "#about" only worked on the home page, so the skip link did nothing
            on a project page, and even at home it skipped past the entire hero
            including its calls to action. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
