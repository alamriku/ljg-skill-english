---
name: ljg-present
description: "Unix-flavoured presentation design and faithful typesetting. Turns an Org/Markdown outline, or an authorized distillation of a talk, into a single offline HTML file; picks a layout by semantic role among the big statement, the contrast, the Unicode relation diagram, the evidence slide and the chapter divider. Dark by default, with a speaker-notes layer, native charts and a clicker. USE WHEN asked to present, build a talk, make slides, beautify an outline, or put the essence of a talk on screen. NOT FOR rewriting an author's content without authorization or producing corporate PowerPoint."
user_invocable: true
version: "4.8.0"
---

# ljg-present: the talk foundry

Let the audience find the point of the slide at a glance, and give the speaker enough to keep unfolding it. The Unix feel comes from precise relations, natural language, clear hierarchy and space left deliberately empty.

## Workflow routing

| Task | Entry point |
|---|---|
| Generate, re-lay out, or improve a deck | [Workflows/Generate.md](Workflows/Generate.md) |

## Gotchas

- Purpose tags such as "share" or "talk" do not decide the colour. With no visual theme specified, use hacker-dark.
- Two lines can be one judgment. The role follows the speaking function; line count only affects type size and pagination.
- Title, body and a closing line are not a mandatory set of three. When the main sentence already says it, let it stand alone.
- Unicode connector lines use the monospace grid, and non-Latin nodes are laid out separately. Do not force wide characters into fixed character cells.
- Passing a static check is not the same as the slide working. The build tool fixes the template; the browser probe checks what was actually painted, and the screenshots check the visual hierarchy separately.

## Two content contracts

| Mode | When to use it | What is preserved |
|---|---|---|
| faithful typesetting | An outline already exists; no authorization to rewrite | the original wording, order, tables, code and source images |
| editorial arrangement | The user asked for a distilled talk, a reorganized deck, or redrawn diagrams | the claims, evidence, qualifications, numbers and relations; on-screen wording may be rewritten within the authorization |

When the current request already authorizes distillation or redrawing, just do it - do not ask again. An editorial arrangement records the editingBasis, and on-screen content links back to the full source through sourceIds; the complete narration goes into notes, viewed with N. "Make this a deck" alone is not authorization to cut or alter the author's content.

## Design and implementation

- Read [DesignSystem.md](DesignSystem.md) first, and look at the real samples for the relevant layout in [CompositionReference.md](CompositionReference.md).
- The data contract is in [RenderingSpec.md](RenderingSpec.md); the boundaries between relation diagrams, native charts and source code are in [ChartSpec.md](ChartSpec.md).
- Use Tools/BuildDeck.ts to load the data into SloganTemplate.html; do not append CSS at the end of the artifact, and do not write a second rendering path.
- Preserve the chapter turns and pauses in the source. The number of content nodes, slides and diagrams is never a quality target.
- The core claim, the important qualifications and the data stay readable at projection distance; supporting information recedes or moves into the notes - never shrink the core information to manufacture white space.

## Themes

An explicit choice beats an explicit theme_* visual tag, which beats hacker-dark. Ordinary topic words and purpose tags play no part in choosing a theme.

| Intent or flag | theme |
|---|---|
| default, Unix, terminal, dark | hacker-dark |
| light hacker, --hacker, compatible --cyber | hacker |
| -b / --theme=black | black |
| -r / --theme=red | red |
| -y / --theme=yellow | yellow |

## Delivery

One ~/Downloads/{title}.html, fonts embedded, charts inline, offline, no animation. Forward: right arrow, down arrow, Space, Enter, j, PageDown; back: left arrow, up arrow, k, PageUp; Home/End for first and last slide; F for fullscreen; N for notes. Scrolling a diagram or the notes does not flip the slide.

Static validation checks the current template against the source data; use the interceptor's isolated browser to load Tools/ProbeDeck.js, then look at the full thumbnail set and representative slides. If the isolated browser is unavailable, keep the artifact and report honestly that the visual re-check was not completed - never substitute the main browser and call it acceptance.

## Examples

- "Make a deck from my outline, do not change the words" -> faithful; pick layouts by semantics and continue onto another slide along the source's own boundaries when needed.
- "Put the essence of the talk on screen so I can expand live" -> editorial; distil the claim, the contrast or the relation, and put the full narration into notes.
- "Turn the old ASCII diagram into Unicode" -> record the redraw authorization and check the new diagram against nodes, connections and direction; real code is still preserved character for character.
