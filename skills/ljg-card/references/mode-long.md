# Mold: long image (-l, default)

The default parent style of `-l` is the "Quiet Narrative Line": the calm of minimal single-line drawing, the visible change of comic grammar, and the evidence structure of editorial design. Text is still the main body; a generated image appears only where deleting it would damage understanding.

When running, Read `references/image-generation.md` and `assets/long_template.html`. If the input came from an accepted Org note, lock its path and SHA-256 first; the card never replaces or rewrites its source.

## Promise to the reader

- **3 seconds:** see one concrete situation and a single main visual focus.
- **15 seconds:** see what changed for the person or object.
- **60 seconds:** understand the mechanism, the strength of the evidence and the boundary of application.

All three scales are required. Beautiful atmosphere with no change of action is decoration; continuous plot with no evidence structure is just another comic; compressed text with no visible situation is a screenshot of a summary.

These times are reading-design targets for finding the situation, the change and the main mechanism - not a time limit for the whole text and not a guarantee of learning. For knowledge explanation, also read `references/learning-design.md`: pin down which new situation the target reader will face and what they must recognize and derive, then choose the source material; the overall judgment may still appear early. Load-bearing cases and derivations may be unfolded - never compress them into a string of terms to hit a one-minute read. Narrative or aesthetic work is not forced into a knowledge exercise.

## Visual mother tongue

- The background is a warm paper colour, `#FAF6EC` by default; body text is a warm black `#292621`, supporting text `#746F68`, hairlines `#DED7CC`.
- The whole card keeps one dark vermilion accent, `#B6533F` by default. It marks the turn, the point of control, or the load-bearing number; it is never spread evenly across modules.
- Generated images use sparse, slightly hand-made black single lines; figure proportions may be plain and expressions stay restrained, letting posture, distance and objects carry the feeling.
- The main image keeps dominant clean white space, with no decorative background, texture fill, dense shadow or second colour system.
- Line weight must keep the action visible when the whole long card is reduced. Clear in a crop and gone in the whole card is still a failure.

These properties form a reusable visual system. When a user names an artist or a work, use it only to identify the aesthetic direction; whatever the reference, first translate it into non-proprietary visual properties - medium, line, colour, white space, figure proportion, intensity of expression, narrative distance and density of detail. Generation prompts state only those properties; they never name a creator and never ask to copy a signature stroke or composition.

## Narrative routing

One round of explanation fixes one person, object or spatial relation and lets it carry the change; the change-of-case test at the close may swap the object while stating which relation was kept and which condition changed. The number of visuals follows the cognitive beats:

| Shape of the content | Visual structure | What must not happen |
|---|---|---|
| One core judgment | 1 main scene | adding a synonymous image to reach a count |
| One causal or mechanical change | 2-3 continuous visual beats on the same object | a new metaphor or character at every beat |
| A book | initial state -> pressure -> change -> aftermath, carried by one object | illustrating the table of contents chapter by chapter |
| A paper | question -> mechanism -> evidence -> boundary -> decision; images show only the visible action | handing the framework, the numbers or the conclusion to the image model to spell out |
| A philosophical or single idea | 1 quiet metaphor plus the content's own lingering note | forcing it into a plot comic or appending an editor's note |

"Comic grammar" here means continuity of action, continuity of object, and comparability before and after - not speech bubbles, exaggerated expressions, dense panel grids or cartoon decoration. Once there are more than three separate pictures and the story itself becomes the main way to read, switch to `-c`.

## Reading structure

Write one overall judgment first, then compress the body into 3-7 progressive units. Each unit carries one cognitive action: pose, open up, reverse, prove, qualify or close.

A recommended skeleton for the long card:

1. `eyebrow + title + deck`: the field, the judgment and the question for reading.
2. `lead`: one visible situation that lands the abstract problem on people and things.
3. `narrative-beat`: the same object keeps changing, explaining the mechanism.
4. `metric-row`: load-bearing numbers and comparisons, in HTML/CSS.
5. `closing-judgment`: hand the conclusion back to the reader's next judgment, then end the body.

Short content may drop any non-load-bearing unit; the skeleton is an available surface, not a set of sections to fill.

The strength of the evidence, the conditions of application and the disagreements in the source are written next to the judgment they qualify. The ending adds no detached notes such as "limits of this reading", "this is only the author's view", or "whether the reader learned it is unproven", and does not keep such a box under another name. The scope of distillation, insufficient sources and acceptance status stay in the delivery message.

The deletion test for knowledge explanation weighs both argument and learning: an example that proves nothing but carries the first recognition of a concept or a boundary distinction is kept. Put the instance next to the rule it explains, and state the concrete object, the discrimination criteria, the relation and the result; leave material gaps marked in the production notes and the delivery message rather than letting a pretty scene stand in for a missing correspondence.

Between a neighbouring story and concept there must be a readable sentence of correspondence: who or what changed how, which feature supports the classification, and how the rule lands on this case's result. A heading may use the question the reader is about to ask, and the body unfolds it with concrete verbs; swapping abstract nouns for a colloquial heading does not supply the connection.

Where readers easily misapply something, you can close with a condition contrast or a change-of-case question: change the situation and ask the reader to name the discriminating grounds or predict the result. It can be a few lines of text, without crowding the main scene and without another generated image. The answer goes into a separate feedback area further down, with a prompt to judge before scrolling; a static image cannot guarantee the reader did not see the answer first, so actual learning effect is verified separately.

## Visual anchors

One long card uses 0-3 local semantic bitmaps. First decide whether an image makes the object, the discriminating feature or the change easier to understand; with no such gain, 0 is legitimate and the main visual focus is carried by the type hierarchy. Make this decision before generating - a necessary image that failed to generate must never be reclassified as "no image was needed". When images are used, combine these roles:

| role | Job | Composition | Continuity |
|---|---|---|---|
| `lead` | the overall situation after the title | wide, one action, whole subject, generous space | fixes the initial state of the person/object |
| `inline` | explains one mechanism or turn | 4:3 or 3:2, still one action only | continues the lead's people, objects and spatial rules |
| `closing` | closes the aftermath; omitted when it carries nothing new | fewer objects, quieter posture | shows the changed state without starting a new metaphor |

Sections not chosen stay pure text. An image must never become a decorative divider between paragraphs.

## Prompt additions

After the shared motif table and prompt skeleton, append the observable `-l` properties:

```text
contemporary minimalist editorial monoline illustration on a warm off-white paper ground;
one stable person or object performing one clear action;
sparse slightly uneven black contour lines, restrained expression, mildly naive proportions;
dominant clean negative space, flat shapes only where structurally necessary;
one tiny muted-vermilion accent on the load-bearing turn or control point;
line weight strong enough to remain legible in a reduced full-card thumbnail;
no decorative background, no shading, no hatching, no dense texture, no poster typography.
```

A sample passes on semantics, complete characters and props, matching background colour, absence of text, and holding up at both the local and the whole-card scale. If the line art vanishes when reduced, fix only the contour weight or the subject's share of the frame - do not change metaphor, camera and composition at the same time.

## HTML/CSS surface

The template keeps these composable primitives:

- `.eyebrow`: a small field or source cue.
- `.deck`: one reading question under the title.
- `.narrative-beat` and `.beat-index`: the text explanation of continuous action.
- `.metric-row` and `.metric`: load-bearing numbers and comparisons.
- `.closing-judgment`: the last transferable judgment.
- `.learning-material`: optional instance, discrimination criteria or condition contrast, with `.learning-label` stating the material's identity; not required in every unit.
- `.transfer-check` / `.transfer-feedback`: an optional change-of-case question and its later feedback, kept a recognizable distance apart; the feedback explains the grounds rather than just giving the answer.

Ordinary paragraphs, `h2`, `.highlight`, `.prompt`, lists, quotations and `.divider` remain available. Every title, paragraph, number, formula, label, arrow and source is written exactly in HTML/CSS.

With a lead image, use a local path and an `alt` describing the specific action; with no image, set the top slot to `data-state="empty"` and clear `src` and `alt`. Inline and closing images go into the body with `.generated-art--inline` or `.generated-art--closing`.

## Screenshot tool contract

The HTML, CSS, candidate images and QA artifacts stay in this task's exclusive `/tmp` directory; only the accepted PNG leaves. The screenshot command stays:

```bash
bun assets/capture.ts <html> <png> 1080 1600 fullpage
```

## Acceptance

- 0-3 visual anchors; each one points back to a source claim, with no synonymous or decorative image. With 0, the card still needs a clear situation and the necessary discriminating material - a summary screenshot is not acceptable.
- The same person or object stays continuous across a multi-beat structure, with the action comparable before and after.
- No readable text, logo, watermark, fake label or brand contamination inside an image.
- No placeholders, remote images, broken images, missing `alt` or horizontal overflow in the DOM.
- The artifact is a 1080px 8-bit RGB PNG; the title, body, numbers, evidence boundaries and source are all carried by HTML/CSS. Claim an embedded sRGB profile only once an ICC profile is actually embedded.
- The main visual passes both the local check and the whole-card thumbnail check; key actions, hands, feet and props are not cropped.
- After the whole-image check, cover the full height with overlapping slices rather than sampling only the top, middle and bottom.
- If bound to an Org note, the source file's SHA-256 after delivery matches the one taken before rendering.
- Knowledge explanation also checks the lower/upper connection: the concrete situation has an input and a result, the key concept has discrimination criteria, and the relation has conditions of application; a change of case that only swaps names or numbers while the original answer still copies over is not a valid transfer test. The identity of source material, added hypotheticals and analogies is distinguishable. This is a content review that pixel or structural checks cannot replace; when no reader test was run, say so explicitly.
