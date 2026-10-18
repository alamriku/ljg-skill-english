# Mold: full text (-f)

`-f` casts a complete document into one continuously readable long PNG. What it designs is the layout, not the words: every visible block from the source appears exactly once, with its characters and order unchanged; headings, emphasis, space and weight only change how the reader sees them.

When running, Read `references/taste.md` and `assets/full_template.html`, in that order. The generated image count is `0` by default. When the source carries its own images, also read the asset identity and source fidelity parts of `references/image-generation.md`; those images stay `source` assets and must never be regenerated, redrawn or swapped for a concept illustration.

## Promise to the reader

- **At first glance:** a clear reading order formed by a pure white page, deep black body text, restrained greys and uneven white space.
- **While reading:** headings, body, quotations, lists, code and footnotes each have a clear level, with no added lead-in, pull quote or explanation box interrupting the author.
- **At the end:** every paragraph can be checked back against the source, with nothing dropped, altered, reordered, merged, duplicated or added.

## The source boundary

These changes are typesetting and are allowed:

- Mapping the source's existing headings and sub-headings to `h1`, `h2`, `h3`.
- Mapping the source's existing bold, italic, quotations, lists, code, tables and footnotes to the matching semantic HTML tags.
- Adding a style class such as `.full-key` or `.opening` to a source block to change size, weight, colour, leading, rules or the space above and below.
- Escaping characters for HTML safety, as long as the `textContent` read back from the browser is identical to the source block.

These changes are editing the source and are forbidden:

- Summarizing, polishing, correcting, changing punctuation, paraphrasing, cutting, merging paragraphs, reordering.
- Lifting a sentence out of the body and duplicating it as an epigraph, pull quote, sidebar or large closing line.
- Adding a title where the source has none; adding a lead-in, a summary or a transition sentence.
- Truncating lists, tables, code, footnotes or source notes to tidy the layout.
- Using CSS `order`, floats or positioning so the visual reading order departs from the DOM and the source order.

A heading that exists in the source appears once: it may become the main title, but it must not be repeated in the body. Where the source has no explicit hierarchy, you may give existing text blocks different visual weight, but you must not rewrite their textual identity by design judgment.

## Source lock and the source-block ledger

Lock one local source before rendering: for a local file, record its path and SHA-256; for URL body text or pasted text, save it verbatim into this task's `/tmp` directory first and then record the SHA-256. The source file must not change before delivery.

Build `source-ledger.json`: each entry corresponds to one final visible text block. Text inside a block is preserved character for character, and the array order is the reading order.

The ledger applies exactly one normalization: converting `CRLF` / `CR` line endings to the `LF` the browser's `textContent` uses. Never trim, collapse runs of spaces, or change character widths; `source_sha256` always refers to the unnormalized original source file.

```json
{
  "version": 1,
  "source_sha256": "<64 lowercase hex characters>",
  "blocks": [
    { "id": "b001", "text": "The source title" },
    { "id": "b002", "text": "The first paragraph, with its punctuation and spacing kept." }
  ]
}
```

Every text block in the HTML uses the same ID:

```html
<main class="full-document">
  <h1 data-source-block="b001">The source title</h1>
  <p data-source-block="b002">The first paragraph, with its punctuation and spacing kept.</p>
</main>
```

- `data-source-block` goes only on leaf text blocks and must never nest.
- Inline `strong`, `em`, `code` and links may sit inside a block; their combined `textContent` must still match the ledger exactly.
- Lists are registered item by item; tables header by header and cell by cell; code blocks, captions and footnotes each register separately.
- Every visible word inside `.full-document` must belong to a source block. Pure layout containers, rules and images with no text source need no entry.
- Source images use a local absolute path, their original ratio and a semantic `alt`; when the source has a caption, the caption itself is a source block.

## The full-text validator

After filling the template and before the screenshot, run:

```bash
bun assets/verify-full-text.ts \
  /tmp/<task>/source-ledger.json \
  /tmp/<task>/full.html \
  /tmp/<task>/source.txt
```

The tool checks the source SHA-256, block IDs, block count, characters, order, duplicates, nested blocks, and any unregistered visible text inside `.full-document`. Stop on any mismatch; visual inspection never overrides a failure.

The acceptance counterexamples are fixed at four kinds: changing one character, reordering, dropping a block, duplicating a block. Any one of them must make the validator exit non-zero.

## Layout mother tongue

- `-f` is a black-on-white long-reading surface: the canvas is fixed to pure white `#FFFFFF`; ordinary body text is a deep neutral black `#171717`; supporting text `#525252`; weak information `#7A7A7A`; rules `#E5E5E3`. A dark red `#A74432` carries only a few section breaks and emphases and never becomes the body's main colour.
- The title, headline, section headings, body, emphasis, captions, table headers and byline all prefer the locally installed classical serif. When the machine does not have it, the browser falls back automatically: the body to a serif stack, display text to a system sans stack. Never download over the network, install temporarily, or fill the gap with a remote `@font-face`. `code`, `pre` and the footer source line keep a monospace face - the one exception where character alignment carries meaning.
- In a 1080px artifact, ordinary body text is at least `40px` with line height `1.9` and an effective width of about `896px`. Paragraph spacing stays `36px`, and the space above a section is clearly larger. Setup paragraphs may be tightened, but image height must never be reduced by shrinking the type or compressing the leading.
- Heading levels are `80/54/44px`, with opening and key paragraphs at `44px/1.9`. At roughly a 390px phone width, 40px body text is about 14.4px effective; review both the phone-width preview and full-size slices.
- `strong` and `.full-key` emphasize through weight, a thin dark red rule or a pale flat ground; never highlighter colours, gradients, glow, glassmorphism or heavy shadows.
- Quotations use a thin vertical rule and looser leading; code and tables use a monospace face on a pale neutral grey ground; lists and quotations stay at `40px/1.9` and are never reduced to small type; tables are `34px`, code blocks and footnotes `32px`, captions `30px`, and these supporting levels keep a line height of at least `1.7`.
- The page carries no decorative illustration, fake seal, large display watermark, automatic numbering or template slogan. The aesthetics come from proportion, type and space.

`assets/full_template.html` already provides the fixed visual system. `{{CUSTOM_CSS}}` is only for adapting to an unusual source structure; it must never override the source boundary, shrink the body below readability, or introduce remote resources.

Font completeness is judged by what the browser actually used, not by the CSS stack alone: when the preferred serif is installed, the ordinary body, the `h1` title and the `h2` headline should all resolve to it; when it is not, the body and the display text each fall back to their local default stacks and work continues. A missing preferred font is not a failure; fetching a font over the network is.

## HTML surface

The template has exactly one body entry point: `{{DOCUMENT_HTML}}`. The complete source enters `.full-document` in its original order; the footer sits outside the body area and takes no part in source-block validation.

Available semantic surfaces:

- `h1`, `h2`, `h3`, `p.opening`
- `strong`, `em`, `.full-key`
- `ul`, `ol`, `blockquote`
- `pre`, inline `code`
- `table`, `caption`, `th`, `td`
- `.source-figure`, `figcaption`
- `.footnotes`, `.footnote`, `.section-break`

After replacing `{{DOCUMENT_HTML}}`, `{{CUSTOM_CSS}}`, `{{LOGO}}` and `{{SOURCE_LINE}}`, no placeholder may remain in the HTML.

## Screenshot and acceptance

```bash
bun assets/capture.ts /tmp/<task>/full.html <final.png> 1080 1600 fullpage
```

Conditions for delivery:

- The full-text validation exits 0, with the reported expected and actual block counts equal.
- The source file's SHA-256 after delivery matches the ledger.
- The generated image count is `0`; every source image is a local `source` asset, complete, uncropped and with a clear source identity.
- The DOM has no leftover placeholders, unregistered text, remote fonts, remote images, horizontal overflow, or body text smaller than the template's footnote level.
- The font check reports the actual platform font for the ordinary body, the title and the headline separately: when the preferred serif is installed, all three use it; when it is not, report the local default each one hit, without pretending the preferred font took effect.
- Computed styles confirm the canvas is `#FFFFFF`, ordinary body text is at least `40px/1.9`, and the body-to-background contrast is above `15:1`; reading the template source is not enough.
- The PNG is 1080px wide, 8-bit RGB; the whole-image check shows clear hierarchy and rhythm, and overlapping slices cover the full height, checked section by section for truncation, occlusion, orphan lines and table overflow.
- If the full height exceeds what a single PNG can render reliably, stop and explain the limit; never pass a truncated image off as the full text, and never split it into several files without the user's agreement.
