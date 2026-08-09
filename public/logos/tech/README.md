# Tech stack logo overrides

Drop a file here to override the icon a technology gets in the Skills section,
then add one line to `localMarks` in `src/components/tech-icon.tsx`:

```ts
const localMarks: Record<string, string> = {
  langchain: "/logos/tech/langchain.png",
};
```

The key is the `slug` from `src/content/site.ts`. An entry here takes priority
over both icon sets.

Accepted: `.svg`, `.png`, `.webp`, `.jpg`. SVG is preferred since it stays sharp
on high-density displays. The mark renders at 40px inside a 56px rounded tile
with a white backing, so trim surrounding whitespace before saving and leave the
artwork itself transparent or white-backed.

## Why you might need this

Simple Icons and Iconify carry a brand's *current* mark. Where a company has
changed logo and you prefer the earlier one, or where neither set carries the
brand at all, put the file here.
