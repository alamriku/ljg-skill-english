# Layout Grammar

## The visual judgment

The page does one thing: the eye reads down the black source text first, glances at the coloured note beside it when it hits resistance, and after the chapter ends arrives naturally at the blue reading.

## Page skeleton

```text
book title
chapter

chapter-intent image (optional; landscape, wordless, low distraction)

source text + cyan word glosses + vermilion sentence glosses + ochre variant notes
source text + coloured interlinear notes
...

chapter reading
blue paragraph
blue paragraph

sources
```

- Canvas: `1080 x auto`, warm white or plain white ground.
- Side safe margins: 72-92px; top 72-96px; bottom 64-88px.
- Book title and chapter centred, body text left-aligned.
- One image carries the whole chapter; height grows with content and is never squeezed into a poster.

## Type hierarchy

| Layer | Suggested size | Typeface | Colour |
|---|---:|---|---|
| Book title | 54-68px | serif | ink black |
| Chapter | 48-62px | serif | ink black |
| Source text | 42-52px | serif | `#171512` |
| Romanization | 18-22px | system sans | `#52615e` |
| Word gloss | 22-28px | system sans | `#27988a` |
| Sentence gloss | 22-28px | system sans | `#d84a42` |
| Variant note | 22-28px | system sans | `#b7790b` |
| Chapter reading heading | 28-32px | system sans | `#795f43` |
| Chapter reading body | 26-30px | serif | `#39342e` |
| Sources | 18-22px | system sans | `#77716a` |

Source line height 1.8-2.05; chapter reading line height 1.75-1.95. Keep the sizes steady rather than letting an oversized heading squeeze the body.

## Interlinear relations

- A source token and its annotation form an unbreakable unit; lines may break between units, but a bracket must never be separated from the note it holds.
- Commas, full stops, question marks, exclamation marks and closing quotes follow the preceding source token; an opening quote follows the next token and never breaks onto its own line.
- Coloured notes are about 45% smaller than the source and sit close to its baseline, or slightly raised; they must never drift away from their object like footnotes.
- Romanization floats only above its own source token.
- A fine dotted line may mark which part of the source is annotated, but the underline must never be more prominent than the text.
- One annotation uses one semantic colour. Blue never enters the interlinear area.

## The chapter reading area

- Separate it from the source with 52-72px of white space, then lay a very light warm grey-brown ground under it (around `#eee8dc`); never run long coloured body text on plain white.
- Use a warm near-ink black for the body (around `#39342e`); the heading uses a low-saturation tea brown only; blue never enters this area.
- A hairline border is allowed, but no rounded cards, drop shadows or floating effects. It should read as another layer of ink on the same sheet, not an embedded web component.
- The heading reads simply "Chapter reading" - no marketing subtitle.
- The first paragraph is slightly darker, slightly larger and not indented; it carries the judgment for the whole chapter. Later paragraphs indent the first line, line height 1.9-2.0, with paragraph spacing tighter than the module spacing in the source area.
- Transfer and boundary are written naturally into the prose; do not add method labels like "limits of the reading", "application", "transfer" or "limitations".

## The top intent image

- Fixed between the chapter title and the source text; it sets the mood before the words start.
- Landscape 3:2 is preferred, spanning the full body safe width, with its own safe margins inside the frame; never let the browser crop the subject.
- Use warm ivory, smoke grey, tea brown and a trace of vermilion; low saturation, low contrast, generous space. Image filters may only slightly reduce saturation and contrast - they cannot rescue a distorted image into an acceptable one.
- No text, calligraphy, titles, seals, watermarks or decorative borders inside the image.
- Keep the subject small and the motif clear. The image carries less visual weight than the chapter title and the first line of source text; the long image must never become an illustrated poster.
- Fade the bottom back into the paper, or leave white space there, so it does not cut hard into a separate picture.

## Forbidden

- Decorative faux-antique textures, scroll borders, seals and auspicious clouds must not take up reading area.
- Apart from the gentle fade under the top image, no decorative gradients, shadows, glass cards or highlighter blocks.
- Do not stuff long notes into the middle of the source and create "coloured body text".
- Never omit the book title, the chapter, or the sources.
- Do not let the browser viewport height crop the image; screenshot the full document height.

## Visual acceptance

The whole image answers hierarchy, the middle answers readability, the bottom answers completeness. For a long image you must look at overlapping slices covering the full height; a thumbnail of the whole alone will miss local occlusion, bad line breaks and cropping.
