import type { CSSProperties } from "react";
import logosSet from "@iconify-json/logos/icons.json";
import {
  siCrewai,
  siDatabricks,
  siLangchain,
  siLanggraph,
  siScikitlearn,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";

/**
 * Icons come from two sources, in priority order:
 *
 * 1. `@iconify-json/logos`: full-colour brand marks. Preferred, since these
 *    match how each vendor actually presents its logo.
 * 2. `simple-icons`: single-colour paths, used for the brands the logos set
 *    doesn't carry (Databricks, LangChain, LangGraph, CrewAI, scikit-learn).
 *
 * Every mark sits on the same white tile used by OrgLogo in Experience and
 * Education, which keeps the two sections visually consistent and means marks
 * with near-black ink (AWS, Spark, the GitHub Octocat) need no special casing.
 *
 * Both sets are resolved at build time and inlined into the static HTML, so
 * the page ships no JavaScript and makes no image requests for logos.
 */

type IconifyIcon = { body: string; width?: number; height?: number };

const iconifyIcons = logosSet.icons as Record<string, IconifyIcon>;
const setWidth = logosSet.width ?? 24;
const setHeight = logosSet.height ?? 24;

/**
 * Drop a file at `public/logos/tech/<slug>.<ext>` and add it here to override
 * everything below. Useful where no icon set carries a usable mark, or where a
 * brand has changed logo and the earlier one is preferred.
 *
 * Both LangChain entries are the earlier parrot marks rather than the abstract
 * chain-link ones Simple Icons ships, and both are cropped out of their square
 * app icons (originals kept alongside).
 *
 * The two crops differ on purpose. LangChain's pill has dark ink on white, so
 * it is cropped to the contents and the white blends into the tile. LangGraph's
 * pill is inverted, white ink on teal, so cropping to the contents would leave
 * white on white. That one keeps the pill, which becomes the visible shape.
 */
const localMarks: Record<string, string> = {
  langchain: "/logos/tech/langchain-mark.png",
  langgraph: "/logos/tech/langgraph-mark.png",
};

/**
 * Marks wider than about 1.5:1 are limited by width in a square tile, so they
 * end up much shorter than the square logos beside them. Trimming the padding
 * buys back some height without letting them overflow.
 */
const wideMarks = new Set(["langchain", "langgraph"]);

/**
 * Wordmarks too wide to read at icon size. Oracle's is 512x67, so scaled into
 * the tile it's only a few pixels tall. Devicon's version is padded to a
 * square canvas but the letterforms are the same size, so it doesn't help.
 * These fall through to the badge below.
 */
const tooWideForTile = new Set(["oracle"]);

/**
 * Solid brand-colour badges, for technologies with no square mark.
 * Filled rather than tinted-outline so they read as deliberate next to the
 * real logos, in the spirit of how app icons handle wordmark-only brands.
 */
const badges: Record<string, { label: string; hex: string; size?: string }> = {
  oracle: { label: "ORACLE", hex: "#C74634", size: "text-[9px] tracking-[0.02em]" },
  // PL/SQL is an Oracle language rather than a product, so it has no mark of
  // its own. Same red keeps the two visibly related in the list.
  plsql: { label: "PL/SQL", hex: "#C74634", size: "text-[9px] tracking-[0.02em]" },
};

/** Iconify names for each slug. Suffixed `-icon` variants are the glyph-only marks. */
const iconifyNames: Record<string, string> = {
  python: "python",
  aws: "aws",
  gcp: "google-cloud",
  azure: "azure-icon",
  airflow: "airflow-icon",
  spark: "apache-spark",
  snowflake: "snowflake-icon",
  postgresql: "postgresql",
  tensorflow: "tensorflow",
  pytorch: "pytorch-icon",
  pinecone: "pinecone-icon",
  chromadb: "chroma",
  powerbi: "microsoft-power-bi",
  tableau: "tableau-icon",
  docker: "docker-icon",
  git: "git-icon",
  github: "github-icon",
  githubactions: "github-actions",
  dbt: "dbt-icon",
  huggingface: "hugging-face-icon",
  kubernetes: "kubernetes",
  fastapi: "fastapi-icon",
  streamlit: "streamlit",
};

type Mono = { path: string; hex: string };

const mono = (icon: SimpleIcon): Mono => ({
  path: icon.path,
  hex: `#${icon.hex}`,
});

/** Generic database glyph, since "SQL" isn't one vendor with a mark of its own. */
const sqlGlyph: Mono = {
  path: "M12 1.5c-4.7 0-8.5 1.3-8.5 3v15c0 1.7 3.8 3 8.5 3s8.5-1.3 8.5-3v-15c0-1.7-3.8-3-8.5-3zm0 2c4 0 6.5 1 6.5 1s-2.5 1-6.5 1-6.5-1-6.5-1 2.5-1 6.5-1zm6.5 15.5s-2.5 1-6.5 1-6.5-1-6.5-1v-3.2c1.7.8 4.2 1.2 6.5 1.2s4.8-.4 6.5-1.2zm0-5.5s-2.5 1-6.5 1-6.5-1-6.5-1v-3.2c1.7.8 4.2 1.2 6.5 1.2s4.8-.4 6.5-1.2zm0-5.5s-2.5 1-6.5 1-6.5-1-6.5-1V4.8c1.7.8 4.2 1.2 6.5 1.2s4.8-.4 6.5-1.2z",
  hex: "#E8484A",
};

const monoIcons: Record<string, Mono> = {
  sql: sqlGlyph,
  databricks: mono(siDatabricks),
  langchain: mono(siLangchain),
  langgraph: mono(siLanggraph),
  crewai: mono(siCrewai),
  scikitlearn: mono(siScikitlearn),
};

/**
 * 56px tile with 8px of padding, giving the mark a 40px box. Sized against the
 * roughly 96px text block beside it, so the logo reads as the row's anchor
 * rather than a bullet. Corner radius scales with the tile to keep the same
 * optical softness, and it matches the 56px org logos in Education.
 */
const TILE =
  "grid size-14 shrink-0 place-items-center rounded-2xl border border-black/10 bg-white p-2";

export function TechIcon({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const shell = cn(TILE, wideMarks.has(slug) && "p-1", className);

  // 1. A real asset dropped in locally wins over everything else.
  const local = localMarks[slug];
  if (local) {
    return (
      <span className={shell}>
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size brand mark, nothing for the optimizer to do */}
        <img src={local} alt="" className="h-full w-full object-contain" />
      </span>
    );
  }

  // 2. Full-colour brand mark.
  const iconifyName = tooWideForTile.has(slug) ? undefined : iconifyNames[slug];
  const icon = iconifyName ? iconifyIcons[iconifyName] : undefined;
  if (icon) {
    return (
      <span className={shell}>
        <svg
          viewBox={`0 0 ${icon.width ?? setWidth} ${icon.height ?? setHeight}`}
          aria-hidden="true"
          className="h-full w-full"
          // Markup comes from the bundled icon set, not from user input.
          dangerouslySetInnerHTML={{ __html: icon.body }}
        />
      </span>
    );
  }

  // 3. Single-colour brand mark.
  const flat = monoIcons[slug];
  if (flat) {
    return (
      <span className={shell}>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ "--brand": flat.hex } as CSSProperties}
          className="h-full w-full fill-[var(--brand)]"
        >
          <path d={flat.path} />
        </svg>
      </span>
    );
  }

  // 4. Solid brand badge.
  const badge = badges[slug];
  return (
    <span
      className={cn(
        // Matches TILE's footprint so badge rows sit flush with logo rows.
        "grid size-14 shrink-0 place-items-center rounded-2xl border border-black/10 px-1.5",
        className,
      )}
      style={{ background: badge?.hex ?? "#63636b" }}
    >
      <span
        className={cn(
          "font-semibold leading-none text-white",
          badge?.size ?? "text-[11px] tracking-tight",
        )}
      >
        {badge?.label ?? name.slice(0, 2).toUpperCase()}
      </span>
    </span>
  );
}
