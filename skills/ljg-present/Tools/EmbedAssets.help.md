# EmbedAssets

Turns an assembled deck into a shareable single HTML file: fonts, licences and local images all embedded, with no network access.

```bash
bun Tools/EmbedAssets.ts ~/Downloads/talk.html
bun Tools/EmbedAssets.ts /tmp/draft.html --output ~/Downloads/talk.html
```

- The input must come from the current template, carrying the `BEGIN/END DECK FONTS` markers.
- IBM Plex Mono Regular/Bold from `Fonts/` are embedded automatically and the HTML keeps the OFL licence; the audience never has to install the font.
- PNG/JPEG/WebP referenced by `<img src="local path">` are converted to data URIs based on the file signature bytes; relative paths resolve against the input HTML.
- Raster data URIs that are already embedded are kept, and ValidateDeck checks the encoding and type at the end. Remote resources, SVG/GIF raster entry points and srcset are rejected.
- SVG/HTML from native charts is kept as is. Non-Latin text still relies on platform font fallback; the tool does not haul in a whole CJK font package.
- Without `--output`, the input is updated in place. It can be run repeatedly; fonts and licences are never added twice.
- Afterwards, run `ValidateDeck.ts` again and do a real offline browser check; embedded assets do not mean the layout passed.
