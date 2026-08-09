# Vedant Mane, Portfolio

Personal portfolio site aimed at data engineering, analytics and AI roles.
Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and Motion.

## Getting started

```bash
npm install
```

```bash
npm run dev
```

The site runs at http://localhost:3000.

| Script               | What it does               |
| -------------------- | -------------------------- |
| `npm run dev`        | Dev server with hot reload |
| `npm run build`      | Production build           |
| `npm start`          | Serve the production build |
| `npm run lint`       | ESLint                     |
| `npm run type-check` | `tsc --noEmit`             |

Requires Node 24 (see `.nvmrc` and the `engines` field).

## Editing content

**Nearly all copy lives in one file: [`src/content/site.ts`](src/content/site.ts).**
Page sections, the sitemap, and the structured data all read from it, so you
should rarely need to touch a component to change wording.

Two house rules for that file:

1. Every metric traces back to the resume or the project documentation. Don't
   add a number that isn't in a source document.
2. No em dashes in visitor-facing copy. Use a comma, a colon, or a full stop.

## Projects

Each project has a card on the home page and a statically generated page at
`/projects/[slug]`. The two halves live in different files:

- [`src/content/site.ts`](src/content/site.ts) holds the card: title, blurb,
  discipline, stack, repo link.
- [`src/content/project-details.ts`](src/content/project-details.ts) holds the
  page: the problem, the stages, the engineering decisions, the measured
  results, and the architecture diagram.

A build-time guard at the bottom of `project-details.ts` fails the build if a
project has no detail entry, or if a detail entry matches no project. That was
added after seven of ten keys silently failed to match their slugs, which
rendered a fallback page instead of the deep dive with no error anywhere.

Diagrams are declared as nodes and edges on a lane grid, not drawn. The renderer
in [`src/components/architecture-diagram.tsx`](src/components/architecture-diagram.tsx)
places them, routes the edges, and falls back to a stacked list below `md`,
where an SVG that wide would overflow the viewport.

The write-ups were made from cloned repositories rather than READMEs. Several of
those READMEs describe something the code does not do, and where the two
disagreed the code won.

## Page structure

Sections render in this order, and the nav lists all seven:

`Home → About → Education → Experience → Projects → Skills → Contact`

The nav, the scroll-spy highlight, and the mobile menu are all generated from
the `sections` array in [`src/content/site.ts`](src/content/site.ts). Adding or
reordering an entry there updates all three. Keep that array in the same order
as the components render in `src/app/page.tsx`, or the highlight will jump
around as you scroll.

## Typography

Three faces, each with a distinct job, declared in
[`src/app/layout.tsx`](src/app/layout.tsx) and wired to CSS variables in
`globals.css`:

| Face                 | Used for                        | Why                                                                       |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------- |
| **Manrope**          | body and UI                     | Geometric sans with more warmth than Inter, still neutral in long text     |
| **Instrument Serif** | display accents, italic only    | High-contrast serif; the one expressive note on the page                   |
| **JetBrains Mono**   | eyebrows, dates, metrics        | Reads as engineering, and its tabular figures align numbers between rows   |

`next/font` self-hosts all three, so there are no runtime requests to Google
and no layout shift while they load. Change a face in one place, `layout.tsx`,
and the variables in `globals.css` pick it up everywhere.

## Organisation logos

Experience and Education use [`src/components/org-logo.tsx`](src/components/org-logo.tsx).
Files live in `public/logos/companies`, and the slug in `site.ts` is the
filename minus its extension. The mapping is a static object rather than a
filesystem scan, because Experience is a client component and `node:fs` cannot
be bundled for the browser. See that directory's README for details.

Wide wordmarks are a problem in a square tile: TCS at 2.5:1 letterboxes down to
an unreadable sliver, so `tcs-mark.png` (the symbol alone, cropped from the
original `tcs-logo.png`) is used instead.

## Tech stack logos

Icons resolve in [`src/components/tech-icon.tsx`](src/components/tech-icon.tsx),
in priority order:

1. **`localMarks`**: a file under `public/logos/tech` referenced from
   `tech-icon.tsx`. Overrides everything below; empty by default.
2. **`@iconify-json/logos`**: full-colour brand marks (most logos).
3. **`simple-icons`**: single-colour marks for the ones Iconify lacks
   (Databricks, LangChain, LangGraph, CrewAI, scikit-learn).
4. **Solid brand badge**: Oracle and PL/SQL.

On those last two: Oracle's logo *is* a wordmark, 512×67, which scales to about
five pixels tall in a 40px tile. Devicon's version pads it onto a square canvas
but the letterforms are no bigger, so it doesn't help, and no icon set ships a
square Oracle symbol because none exists. PL/SQL is a language rather than a
product and has no mark at all. Both therefore render as a filled Oracle-red
badge with the wordmark set small, which reads as deliberate branding beside
the real logos. To use an actual image instead, drop it in `public/logos/tech`
and add the path to `localMarks`.

Everything is inlined into the static HTML at build time, so logos cost zero
JavaScript and make no image requests.

Each mark sits on the same white tile that `OrgLogo` uses, which keeps the
sections visually consistent and means marks with near-black ink (AWS, Spark,
the GitHub Octocat) need no dark-mode special casing.

## Contact form

The form posts to a Server Action in
[`src/app/actions/contact.ts`](src/app/actions/contact.ts), which validates
input, drops bot submissions via a honeypot field, and sends through
[Resend](https://resend.com)'s REST API.

Copy `.env.example` to `.env.local` and set `RESEND_API_KEY` and
`CONTACT_FROM_EMAIL`. `CONTACT_TO_EMAIL` is optional and defaults to
`person.email` in `site.ts`.

**Until those are set the form shows a visible error** pointing visitors at the
email address, rather than pretending to send. That is deliberate: a silent
success would lose real messages.

Two emails go out per submission, as **separate requests**:

1. The enquiry, to the site owner. This one decides whether the form reports
   success.
2. A courtesy copy back to whoever filled the form, best effort. Its failure is
   logged and swallowed.

Keep them separate. An earlier version put both addresses in a single `to`
array, which meant Resend rejecting the copy discarded the enquiry along with
it. On the shared `onboarding@resend.dev` sender Resend refuses every recipient
except the account owner, so in that configuration every real visitor's message
failed outright. Verifying a domain in Resend and moving `CONTACT_FROM_EMAIL`
onto it enables the copies, with no code change.

## SEO

Already wired up:

- Full metadata via the Next.js Metadata API, including canonical URL and a
  title template
- `schema.org` `Person` + `WebSite` + `CreativeWork` JSON-LD graph in
  [`src/app/layout.tsx`](src/app/layout.tsx), which is what lets Google build a
  structured picture of who the site is about
- `sitemap.xml` and `robots.txt` generated at build time
- A generated 1200×630 Open Graph image (`src/app/opengraph-image.tsx`)
- Semantic landmarks and a single `h1`; the headline text is server-rendered
  inside a screen-reader span so crawlers read it even before the animation runs
- Every route prerendered as static HTML

Two things to do at deploy time:

1. **Set `NEXT_PUBLIC_SITE_URL`** to the real origin, no trailing slash.
   Without it, canonical URLs, the sitemap, and OG tags all point at the
   placeholder `https://vedantmane.com`.
2. **Verify the domain in Google Search Console** and submit the sitemap. Then
   uncomment the `verification.google` field in `src/app/layout.tsx`.

## Deploying

Vercel is the least-friction option: import the repo, set the environment
variables above, and deploy. Node 24 is pinned via `engines`, which matches
Vercel's current runtime.

The site is fully static apart from the contact action, so any host that
supports Next.js Server Actions works.

## Accessibility and motion

Every animation checks `prefers-reduced-motion`. When it's set, Lenis smooth
scrolling is bypassed entirely, the scroll-progress bar is dropped, and reveal
animations render their content plainly rather than transforming it.

## A note on `npm audit`

`npm audit` reports 3 high-severity advisories in `postcss` and `sharp`. Both
are transitive dependencies pinned inside Next.js 16.2.12, and neither is
reachable from user input in this project. `npm audit fix --force` "resolves"
them by downgrading Next.js to v9, so don't run it. They'll clear when Next
ships a patched release.

## A note on building

Run `npx next build` directly. Don't wrap it in `script` to force a pty: in some
shells that fails with `tcgetattr: Operation not supported on socket` and exits
non-zero without ever running the build, which reads as a build failure.

Never run a build while `next dev` is live. Both write `.next`, and the dev
server then serves corrupt chunks, which surfaces as asset requests that hang.
