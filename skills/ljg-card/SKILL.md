---
name: ljg-card
description: "Content caster. Transforms text into PNG through precise HTML typography and, when the mold needs it, generated raster imagery. Four molds: -l (default) long reading card, -f source-faithful full text, -c comic, -w whiteboard. USE WHEN user says 'cast', 'make it a card', 'make it an image', 'make a poster', 'typeset the original', 'full-text card', 'comic', or 'whiteboard'."
user_invocable: true
version: "7.4.2"
---

# ljg-card: casting

Content goes in, a PNG comes out. Generated images turn the idea into visible action; HTML makes the words exact. `-f` designs only how the source is presented - it never alters the source and never generates new imagery.

When `-l` and `-w` carry an explanation of knowledge, they must also connect "concrete situation -> discrimination criteria -> conditional relation -> concrete result". The reader should be able to see from the action or state in the body why something falls under a concept, and then use the relation to derive the result in front of them; putting an example next to a term leaves that connection missing. Decide first which judgment the target reader has to make, then choose the material and the imagery. The lower/upper structure does not dictate top and bottom on the page, and it does not require every card to begin with a story. Literary, narrative and aesthetic material is organized for its own ends, with no exercises imposed.

The artifact ends at the content's own conclusion, question or lingering note, with nothing after it but the byline and the source. Do not append "limits of this reading", a disclaimer, production notes or acceptance notes, and do not keep such a tail under a different heading. Conditions, disagreements and limits from the source that would change understanding are folded into the relevant argument where they belong; the scope of the distillation, the gaps in the material and the verification status go into the delivery message. Paragraphs already present in an `-f` source are still preserved under the full-text fidelity contract.

## Flags

| Flag | Mold | Size | Role of imagery |
|---|---|---|---|
| `-l` (default) | long image, quiet-line narrative | 1080 x auto | 0-3 images; where it aids understanding, one calm main scene, plus continuous visual beats where needed |
| `-f` | full text, source typesetting | 1080 x auto | generated images fixed at 0; only images already in the source are presented faithfully |
| `-c` | comic | 1080 x auto | gap-driven panels that rerun the same case |
| `-w` | whiteboard, vertical argument | 1080 x auto | local hand-drawn actions embedded in load-bearing reasoning steps; no top hero image |

With no flag, use `-l`.

## Required reading order

Every run of `-l`, `-c`, `-w` must Read, in order:

1. `references/taste.md`
2. `references/image-generation.md`
3. the current mode file
4. the current HTML template

Never skip the shared image protocol and start writing prompts, and never apply one mode's image grammar to another.

When `-l` or `-w` is explaining knowledge, read `references/learning-design.md` after step 3 and before the template: it covers the reader's task, the lower/upper connection, source boundaries, the change-of-case test, and four pairs of failure and repair. `-f` does not take this route.

`-f` Reads, in order:

1. `references/taste.md`
2. `references/mode-full.md`
3. `assets/full_template.html`

`-f` generates no new imagery; read the asset identity, source fidelity and local-storage contract in `references/image-generation.md` only when the source carries its own images.

## `-f` font priority

Every editorial piece of text in `-f` prefers a locally installed classical serif face - title, headline, section headings, body, emphasis, captions, table headers and byline - so that the whole long card keeps one typographic character. When the browser cannot find it, the body falls back to a serif stack and the display text to a system sans stack. Never download, temporarily install or hot-link a font over the network to make a card. `code`, `pre` and the source line keep a monospace face, because character alignment carries meaning there.

## `-f` long-reading surface

`-f` usually produces a very long card, so it uses a reading surface independent of `-l`: the canvas is fixed to pure white `#FFFFFF`, ordinary body text is a deep neutral black `#171717`, and supporting information uses restrained neutral greys only. In a 1080px artifact, ordinary body text is at least 40px with a line height of 1.9 and an effective text width of about 896px; paragraph spacing defaults to 36px, and section spacing is clearly larger than paragraph spacing. Lists and quotations are also 40px/1.9, tables 34px, footnotes and code blocks 32px, captions 30px. Re-check at roughly a 390px phone width, where the body is about 14.4px effective; let the image grow taller rather than shrinking the type to save height. Never bring warm paper grounds, small web-sized body text, tight leading or large colour blocks into `-f`.

## Global temporary directory rule

Whatever directory you start from, create a temporary directory under `/tmp` exclusive to this task before casting. Every intermediate artifact - image candidates, source images used in layout, HTML, CSS, vector drafts, render inputs, screenshot drafts, QA slices, caches and logs - goes only into that directory.

Only the final files the user explicitly asked for may be written outside `/tmp`. Candidate PNGs and renders that have not passed acceptance are still intermediates. Before finishing, check that no intermediate files were left in the current directory or the repository, and clean up this task's temporary directory after the final artifact is accepted.

## Shared production line

1. Read the URL, pasted text or local file, and confirm the title, author, source and factual boundaries.
2. `-f` locks the source, builds an ordered ledger of source blocks, and goes straight to `references/mode-full.md`; it skips distillation, visual motifs and image generation.
3. For knowledge explanation, `-l` and `-w` first follow `references/learning-design.md` to pin down the reader's task, then organize the concrete situation, the discrimination criteria, the relation, the result and the conditions of application. Before layout, the working draft must actually state the object, the action or state, and how the condition leads to the result; material the source lacks is recorded in the production notes and reported at delivery. `-l` and `-c` then build the visual motif table; `-w` first saves this input as an exact source snapshot, runs `assets/prepare-whiteboard-source.ts` to build a paragraph-by-paragraph source inventory, makes the argument ledger cover that independent inventory, and checks both the argumentative and the learning load before deciding which steps need visuals. Never jump from a one-line summary into layout. `-w`'s generated image budget is 0-4.
4. `-c` calls the environment's image generation tool and generates one representative image first to calibrate the semantics and the series style; `-l` and `-w` do the same calibration only when their asset budget is above 0, and 0 images is a legitimate result.
5. Save every image as a local PNG/JPG and check each one for the file, dimensions, composition, absence of text and source attribution.
6. Put every readable word, number, formula, label, arrow and source into HTML/CSS; images carry the concrete scene, the mechanism in action, a comparison of conditions, or an analogy that is labelled as such. A picture containing concrete objects does not automatically supply material usable for discrimination.
7. Read the matching template and replace every placeholder. The top image slot of `-l` and `-c` must be set explicitly to `data-state="empty"` when there is no image; when there is one, it must have a local path and a semantic `alt`. `-w` has no top image slot: write the final argument ledger into `{{LOGIC_LEDGER_JSON}}`, let each generated image appear only inside its own step, and point back to that step's ID with `data-source-claim`.
8. Before the screenshot, wait for the fonts and every image to load; stop if any image is broken.
9. Check the whole image before delivery; for a long image, also cover the full height with overlapping slices.
10. Knowledge explanation gets an extra content review: key concepts have usable discrimination criteria, relations correspond to their examples, and a change of case exposes the difference in conditions. Report the source and render checks, the content review, and any real reader test separately in the delivery message rather than printing them on the card; offering a practice question does not prove the reader learned anything.

When a key generated image that `-l`, `-c` or `-w` judged necessary fails, retry in a targeted way at most twice. If it still fails, state what blocked it; never silently substitute a remote placeholder, a fake icon or a vector fallback, and never quietly rewrite a failed image into "no image was needed anyway".

## Input and naming

- URL: fetch the body with whatever web reading tool is available, and keep a definite source record.
- Pasted text: use it directly; never add facts the source does not contain.
- File path: Read the local file.
- `{name}`: taken from the title or the core judgment, punctuation removed, at most 20 characters.

## Screenshot tool

Run from the skill root:

```bash
bun assets/capture.ts <html> <png> <width> <height> [fullpage]
```

Before a `-w` screenshot, generate the independent inventory from the exact source snapshot and hand both to the screenshot gate:

```bash
bun assets/prepare-whiteboard-source.ts /tmp/<task>/source.txt /tmp/<task>/whiteboard-source-inventory.json
bun assets/capture.ts <html> <png> 1080 1600 fullpage /tmp/<task>/whiteboard-source-inventory.json /tmp/<task>/source.txt
```

The source inventory must be generated directly from this run's input, never reconstructed from the argument ledger; otherwise a paragraph the ledger missed disappears too and the completeness check means nothing.

When dependencies are missing:

```bash
bun install
bunx playwright install chromium
```

The screenshot script waits for fonts and local images. Do not bypass its loading gate.

## Footer

- `-l`, `-f`, `-c`, `-w`: the logo and byline stay on the left; the right-hand side uses `{{SOURCE_LINE}}` for an explicit source, replaced by an empty string when there is none.
- The logo is an existing brand bitmap; it is not a generated image and must not be used as content illustration outside tests.

## Mode routing

| Flag | Mode file | Template |
|---|---|---|
| `-l` | `references/mode-long.md` | `assets/long_template.html` |
| `-f` | `references/mode-full.md` | `assets/full_template.html` |
| `-c` | `references/mode-comic.md` | `assets/comic_template.html` |
| `-w` | `references/mode-whiteboard.md` | `assets/whiteboard_template.html` |

## Gotchas

- "A concrete example plus an abstract conclusion" can still be hard to read. For the conceptual connection, check whether the body states the grounds for classifying the same situation and how the result changes; the presence of an example, a term and an acceptance field is not a substitute for a content review. When a user says it is hard to follow, rebuild that connection before adjusting the wording; see `references/learning-design.md` for the comparisons.
- `-l` is recognizable through "minimal single-line character + comic-style visible change + editorial evidence structure". One beautiful single image loses the explanation; a continuous comic overwhelms a long text; the routing is decided by `references/mode-long.md`.
- Emphasis in `-f` may only promote words already in the source: you may change size, weight, colour, space and semantic tags, but never lift a sentence out and duplicate it as a pull quote, and never add a title, a lead-in, a summary or a transition.
- Full-text acceptance for `-f` follows the ordered text-block ledger, not visual impression. Changing a single character, reordering, dropping a block or duplicating one must all make `assets/verify-full-text.ts` fail.
- `-f` must not be blocked by a missing display font, and must not quietly switch to a remote one; when it is missing, the local default stack takes over naturally. When it is installed, confirm before the screenshot that ordinary body text, the title and the headline all actually resolve to it - checking the CSS declaration is not enough. The monospace face for code and the source line is the only exception.
- The black-on-white of `-f` is a long-reading contract, not a temporary palette: the background must be `#FFFFFF`, ordinary body text a deep neutral black, and the body size and leading never below 40px/1.9. A dark red marks a few dividers and emphases only and must never compete with the black text for the main voice.
- Sparse line art that reads clearly in a cropped view can vanish entirely in the full long card. The representative image for `-l` must pass both a local pixel check and a whole-card thumbnail check; where necessary, thicken the outline only - do not change the metaphor, the camera or the composition along with it.
- The panel count in `-c` is decided by the cognitive beats of cause and effect, with no fixed range. Short content does not pad panels; long content does not drop a load-bearing relation to fit the template.
- The main comic image makes the action and its result visible; concept names, dialogue, captions and the precision of the evidence are still written exactly in HTML/CSS - never let the image model write the explanation.
- One round of explanation, or a rerun of the same case, requires continuity of character, props and space; the change-of-case test may change the object while keeping the relation under test. Switching metaphors at every beat breaks the comparison.
- `object-fit: cover` can ruin exactly one panel. After checking each asset, still scan every panel for faces, hands, key props and the action point, then check the final DOM, the whole image and the overlapping slices.
- The parent structure of `-w` is not one topology chosen from five; it is a `.reasoning-spine` running from the question along the reasoning. chain, branch, timeline, matrix and radial are local structures that can be embedded in that spine; a real article may progress, then branch, then converge, and you must not delete reasoning to fit one shape, nor invent a boundary node just to close.
- `-w` builds the argument ledger before any visual decision: every source section must map to a step or record a specific reason for omission, and every step and relation is bound to a ledger ID. An example can do the work of making a concept recognizable even when it proves nothing. Agreement between the source reconciliation, the ledger and the DOM is a structural gate; it does not prove the discrimination criteria are sufficient.
- An unbroken spine in `-w` does not mean every layer speaks. Ordinary continuation, explanation and progression use silent relations; only a contradiction, a rewritten question, a branch, a convergence or a boundary that really changes the reading direction gets a full transition sentence. Do not replace the specific unresolved pressure in the source with filler like "pressing further" or "one step more".
- A generated image in `-w` must never become a hero before the body. An image is embedded only in the step it explains; if deleting it harms neither the argument, nor recognition of the object, nor understanding of the result, then 0 images is the right answer. Text can supply complete lower-layer material too.
- A silent relation in `-w` keeps its endpoints only in the ledger and the real `.logic-relation` DOM, with no arrow and no copy; a visible turn's arrow must not use `::before`/`::after` but real `.relation-stem` and `.relation-arrowhead` elements, with a single `.transition-sentence` carrying the whole transition.
- `-w` never fetches fonts over the network. A Latin handwriting font supplies no glyphs for other scripts and would fall back silently; the template uses a local handwriting/sans stack, and font differences must not change the node hierarchy or the geometric acceptance.

## Examples

**Example 1: casting a paper or a book into a long image**

```text
User: "Make this paper into a card -l"
-> carry the visible change through one stable character or object: a paper runs "question -> mechanism -> evidence -> boundary -> decision", a book runs "initial state -> pressure -> change -> aftermath"
-> for knowledge explanation, pin down the reader's task first, show why the object falls under the concept and how the relation lands back on the result; generated images show the visible action while exact wording stays in HTML/CSS
-> deliver a 1080px PNG with warm paper, sparse black lines, a single dark red and a complete reading hierarchy
```

**Example 2: casting a technical concept into a comic**

```text
User: "Make this technical explanation into a comic -c"
-> fix one minimal case, let the naive model run first and fail visibly
-> introduce only the concept the current gap requires, one panel at a time, then rerun the same case
-> finally run the complete model from the start, and leave one boundary beat
```

**Example 3: casting a complete long text into a comic**

```text
User: "Make this accepted complete note into a comic -c, no panel limit"
-> lock the source path and SHA-256 first, then choose the cognitive beats along the full causal line
-> the panel count follows the load-bearing relations and the deletion test, inheriting no old five-panel or fixed page count
-> generate the panels, assemble the HTML, and complete per-image, whole-image and overlapping-slice QA
```

**Example 4: typesetting the source word for word into a long image**

```text
User: "Cast this document with -f as a full-text card, do not touch the words"
-> lock the source and its SHA-256, and register the title, paragraphs, lists, quotations, emphasis and footnotes as ordered source blocks
-> no summary, no added headings, no repeated pull quotes; the editorial design is only white ground, deep black, the display serif, restrained greys, type hierarchy and space
-> screenshot after the full-text validator passes, and deliver a 1080px long PNG with zero generated images
```

## Delivery contract

The final message reports at least: the absolute PNG path, the pixel dimensions, the content source, the mode used, the number of generated images, and the whole-image and section-by-section visual QA results. If the input came from an accepted Org note, record its path and SHA-256 first, and confirm after casting that the source hash is unchanged. `-f` also reports the number of ordered source blocks and the full-text validation result; its generated image count is fixed at 0.

For knowledge explanation, the delivery message additionally summarizes the content review of the lower/upper connection, any material gaps that remain, and whether a change-of-case test was run with a real reader. With no such test, write "no reader test was run"; never let self-review or a passing script stand in for learning effect. These are delivery notes, not body text or a tail on the card.

## Maintenance self-check

After upgrading a template or a mode, run:

```bash
bun run audit
bun test
bun run fixtures
```

The first checks the shared protocol, the four routes' references, the bitmap slots, the whiteboard source reconciliation, the full-text fidelity contract and the forbidden items; the second runs the pure-function and counterexample tests; the third generates representative HTML in `/tmp/ljg-card-v7-fixtures/`, runs the full-text and whiteboard source validation, then takes a real screenshot with `capture.ts` and reads the PNG back.

Use an exclusive directory for each maintenance run: `LJG_CARD_FIXTURE_DIR=/tmp/<task>/fixtures bun run fixtures`. The existing fixtures verify rendering and structure; when changing the learning design, draft against the comparison material in `references/learning-design.md` and check the actual wording - a text rule matching is no substitute for a content review.
