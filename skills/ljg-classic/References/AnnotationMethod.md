# Annotation Method

## One principle

The annotations remove local resistance in the source; the chapter reading explains why the chapter is arranged as it is. Neither layer can stand in for the other.

## The unit of segmentation

Segment by the smallest meaningful unit, never mechanically character by character:

- Fixed compounds, set phrases, official titles and place names stay as one token.
- A single character whose ancient and modern senses differ sharply can be its own token.
- Function words are annotated by what they do in *this* sentence; never paste the same gloss everywhere.
- A loan character keeps its original form in `text`, with the character it stands for explained in `note`; never change the source first and annotate afterwards.
- Punctuation is its own token, `{ "text": ",", "punctuation": true }`, with no fake annotation attached.

"Word-by-word annotation" is delivered through coverage: every non-punctuation token has a note. The goal of segmentation is that every note lands on one definite linguistic move.

## Three kinds of interlinear note

| tone | Colour meaning | The question it answers | Typical content |
|---|---|---|---|
| `word` | cyan | What does this word mean here | ancient vs modern sense, the function of a particle, grammar, pronunciation |
| `clause` | vermilion | What is this short clause doing | who does what to whom, the result of the action, local causation |
| `variant` | ochre | Why we cannot pretend there is only one reading | loan characters, textual variants, edition differences, disputed readings |

Keep each note short - a handful of words. Once a note runs past roughly twenty words it has usually left the boundary of local annotation and should be rewritten or moved into the chapter reading.

## Romanization

Give it only for rare readings, characters with several readings, and old pronunciations that change the understanding. Use tone marks rather than tone numbers; when you cannot confirm a reading, do not guess - use `variant` to explain instead.

## The chapter reading

The chapter reading keeps one main relation. At a minimum it lets the reader see:

1. Which words in the chapter are different parts of the same machine.
2. How a condition triggers the action, and how the action produces the result.
3. Why translating by modern common sense alone would miss one crucial step.
4. Where this relation transfers to, or under which conditions it fails.

Plain first, then precise; a technical term appears only after the plain version has landed. Do not reassemble a line-by-line translation into a paragraph, and do not pad with "wisdom for life", "worth pondering", "deeply thought-provoking".

## Factual boundaries

- Facts about the source come from the base edition; an interpretation is an interpretation and must never pose as the author's own statement.
- Where scholars disagree about a chapter's intent, say which reading this image adopts.
- A modern example tests the structure; it never proves what the ancient author meant.
