# Shared image generation protocol

This protocol decides how the three image-bearing modes get generated bitmaps out of text. `-f` generates nothing new by default and reads only the source-fidelity clauses when the original carries its own images; other mode files add their own visual grammar and must never copy or rewrite the shared contract here.

## 1. Decide the asset identity first

Every visual asset is first assigned a class:

| Type | Meaning | Handling |
|---|---|---|
| `generated` | A concept scene or object newly generated for this card | Goes through this protocol |
| `source` | A photo, chart, screenshot or evidence image from the original | Cached locally, cited faithfully, source noted |
| `brand` | An existing logo or avatar | Kept as is; never used as a content image |
| `structural` | Text, numbers, arrows, axes, labels, panel frames | Implemented in HTML/CSS |

Never regenerate a `source` image and call it the original, and never hand `structural` typesetting to an image model.

## 2. Build the visual motif table

Finish the table before writing any prompt; one row per candidate asset:

| asset_id | source claim | core tension or change | visual verb | carrier | semantic work | analogy mapping (may be empty) | image role | ratio | text safe area | colour/medium | alt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `g01` | one checkable claim | which condition makes the result differ | cut / pull / flip / gather | a concrete person or object | instance / mechanism in action / condition contrast / analogy | when using an analogy, state the mapping and where it breaks | hero/scene/detail/vignette | 4:3 etc. | left/right/top/none | as the mode requires | the visible action and what it means |

The motif table must satisfy:

1. The "visual verb" can be photographed or drawn; avoid "embodies", "symbolizes", "empowers".
2. The "carrier" is a concrete person, hand, door, rope, container, terrain or machine - not an abstract concept name.
3. Do not force a metaphor; when the object of the task can be shown directly, show it. An analogy never poses as an instance, a fact or evidence; one case may change continuously, but do not add a synonymous picture that carries no new information.
4. The safe area is decided by the text layout that follows; with no text overlay, write `none`.
5. The number of assets follows the narrative; never add one to fill a slot.

In knowledge explanation, the picture should make the discriminating feature, the key condition or the change in result visible; a concrete carrier with no stated correspondence to the source concept still does not form lower-layer material. Text may supply that correspondence rather than leaving the reader to guess the metaphor.

## 3. Establish the series bible

With more than one generated image, lock the series bible first:

- Medium: line drawing, woodcut, newspaper illustration, collage, photography - pick one main medium.
- Line and texture: weight, grain, paper surface, halftone or lighting logic.
- Characters and objects: age, hair, clothing, proportions, key props, handedness, and other continuous features.
- Camera: eye level, apparent focal length, range of shot sizes, whether high angles or extreme perspective are allowed.
- Colour: background colour, ink colour and at most two accent colours.
- Composition: the series' shared direction of white space and the subject's share of the frame.

Within a series you may change metaphor and action, but not the whole world view from image to image.

## 4. Prompt skeleton

Write the positive prompt in this order:

```text
[output type and medium].
Scene: [visible scene, subject, key action, outcome of the tension].
Composition: [ratio, subject position, shot size, visual focus, text safe area].
Series style: [line, texture, colour and character continuity from the series bible].
Semantic role: [which source claim it corresponds to; for knowledge explanation, which visible feature the reader discriminates by and which condition changes the result].
Background: [transparent, or the flat colour the mode specifies].
No readable text inside the image.
```

Write the concrete scene first and the style second; never substitute a string of style adjectives for a picture. If a transparent background is wanted but the tool is unreliable, use a flat colour identical to the template's and note it in the asset record.

## 5. Shared negative constraints

Attach to every generation:

```text
no readable text, no letters, no numbers, no logo, no watermark,
no captions, no labels, no speech bubbles, no interface panels,
no generic AI brain, no robot mascot, no decorative stock illustration,
no gradient, no glow, no glossy 3D, no heavy drop shadow,
no unintended extra limbs or objects, no cropped key subject
```

A mode file may add its own negative constraints but may never remove these shared ones.

## 6. Sample first, batch second

1. Pick the `g01` that best represents the series from the motif table.
2. Generate only that one, and check semantics, composition, safe area, character, background, absence of text and colour.
3. Change exactly one failing variable and regenerate; do not swap metaphor, camera and style at once.
4. Once the sample passes, lock the series bible and generate the rest.
5. At most two targeted regenerations per failing asset; if it still fails, stop delivery for that mode.

## 7. Calling the image generation tool

- Use the image generation tool actually available in the current runtime; never fake a main visual with HTML/CSS, icons or a remote stock library.
- Build one complete prompt from one row of the motif table. Do not throw the whole article at the image model and let it guess the picture.
- When the tool supports reference images, use only a calibrated series sample for character and medium continuity; never alter an evidence image from the source and pass it off as the original.
- Each call changes only the failing variable named in the motif table, and its result maps back to a unique `asset_id`.
- When the tool returns a temporary asset, save it immediately into this card's local working directory; an unsaved return value is not a result.

## 8. Saving and the asset record

A generated image must be saved as a local `.png` or `.jpg` before it enters the HTML. Stable naming:

```text
{name}-{mode}-{asset_id}-{role}.png
```

Keep in the working record: the asset ID, the role, a summary of the prompt, the dimensions, the file path, the SHA-256 and the source type. Two different roles must never share a hash. Remote generated-image URLs, random stock images and temporary placeholders must never reach the artifact.

Before writing the HTML, confirm for each one:

- the file exists and is non-empty;
- the pixel dimensions match the ratio in the motif table;
- the subject is not cropped and the safe area is on the right side;
- there is no readable or fake text, logo or watermark;
- `alt` is non-empty and describes the visible action and its meaning, not praise for the style.

## 9. HTML integration

All images use local paths:

```html
<figure class="generated-art generated-art--ROLE" data-asset-id="g01">
  <img src="/absolute/local/path.png" alt="a hand pulling two ropes running in opposite directions back to one anchor">
  <figcaption>The exact caption is written in HTML; the image itself sets no type.</figcaption>
</figure>
```

- A main image may use `object-fit: cover`, but the key subject must fall inside the safe area; concept objects prefer `contain`.
- When the template's top slot has no image, use `data-state="empty"` and replace the `src` and `alt` placeholders with empty strings; the CSS must hide the whole `figure` and never show a broken-image icon.
- Titles, sources, numbers, formulas, coordinates, arrows, annotations and speech bubbles are all overlaid by HTML/CSS.

## 10. Acceptance and failure contract

Before the screenshot, wait for `document.fonts.ready`, then confirm every `img` satisfies `complete && naturalWidth > 0`. If any image fails, do not take the screenshot.

Final checks:

1. The number of assets matches the current mode's budget.
2. Every image points back to one source claim in the motif table.
3. Characters, objects, medium and colour stay continuous within one round of explanation; a change-of-case test may change the object, but the pictures must not repeat the same information.
4. OCR or a manual check finds no readable or fake text.
5. No unreplaced placeholders remain in the HTML, and every `alt` is meaningful.
6. The PNG's modification time is later than the HTML and every generated asset.
7. Deliver only after both the whole-image and the section-by-section pixel checks pass.
