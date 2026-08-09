# Organisation logos

Used by the Experience and Education sections via
`src/components/org-logo.tsx`.

The slug in `src/content/site.ts` is the filename minus its extension, so
`tcs-logo` resolves to `tcs-logo.png`.

| Slug           | Organisation              | Tile  |
| -------------- | ------------------------- | ----- |
| `tcs-logo`     | Tata Consultancy Services | light |
| `neu-logo`     | Northeastern University   | light |
| `abcom-logo`   | ABCOM Information Systems | dark  |
| `mu-logo`      | University of Mumbai      | light |

Accepted extensions: `.svg`, `.png`, `.webp`, `.jpg`. SVG is preferred since it
stays sharp on high-density displays; the current files are PNG.

Each mark is letterboxed inside a rounded tile (48px, 40px on small screens), so
wide wordmarks like TCS and ABCOM render shorter than square seals. Trim
surrounding whitespace before saving to get the most out of the space.

The tile colour is set per organisation by the `plate` field in `org-logo.tsx`.
ABCOM is `dark` because its wordmark is reversed white; the others are `light`.

If a file is missing the component falls back to a brand-coloured monogram, so
the layout never breaks. Hover it to see the expected filename.
