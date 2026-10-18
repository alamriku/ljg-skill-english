---
name: ljg-classic
description: "Word-by-word annotation, combined typesetting, a chapter-intent image and a full chapter reading for classical texts. Lays the source text, word glosses, sentence glosses, a wordless top image and the chapter reading out as one readable long PNG. USE WHEN the user invokes ljg-classic OR asks for word-by-word annotation, colour interlinear notes, a chapter reading, a classical-text lecture sheet, or a chapter illustration for classical Chinese, classical poetry, or the classics. NOT FOR translating a single line, writing a modern article, or general content cards."
user_invocable: true
version: "1.1.2"
---

# ljg-classic: annotated classical text

The source text is the trunk; the annotations grow against the words; the chapter reading reconnects the whole chapter into a judgment that runs. The deliverable is one long PNG, labelled with the book and chapter, written to `$HOME/Downloads/`; the generation and re-verification happen in an exclusive `/tmp` workspace.

## Workflow Notification

When running the workflow, print only the text notification:

```text
Running the **AnnotateAndRender** workflow in the **ljg-classic** skill to annotate and render the chapter...
```

Send no start, stage or progress voice notifications; the completion voice is handled by the system.

## Workflow Routing

| Workflow | Trigger | File |
|---|---|---|
| **AnnotateAndRender** | Word-by-word annotation, colour interlinear notes, chapter reading, generating the classical-text PNG | `Workflows/AnnotateAndRender.md` |

## Quick contract

- The input must pin down the source text, the book and the chapter; where the edition is unclear, keep the variant boundaries visible.
- Every non-punctuation fragment of the source has a matching annotation; you cannot annotate only the "important words".
- Cyan explains words and grammar, vermilion explains the action of a whole sentence, ochre marks only variants and uncertainty; the chapter reading uses warm paper and dark ink, never long blue body text.
- The reading borrows the plain-language standard of `ljg-explain` and the "condition - mechanism - result, transfer, boundary" of `ljg-writes`, but the artifact still follows this workflow and adds no self-tests or writing scaffolding.
- By default call the built-in `image_gen` for one wordless, low-distraction chapter-intent image, placed between the chapter title and the source text; if images are unavailable, continue without one and say so.
- Each run starts by creating an exclusive `/tmp/ljg-classic-*` workspace; the JSON, HTML, manifest, intent image, candidate PNGs and overlapping QA slices all stay in it.
- Only after a candidate PNG passes the hard acceptance checks is it copied to `$HOME/Downloads/` as the final card; if the user names a different final path, this run follows that instruction. Never overwrite a file of the same name without an explicit request.

## Gotchas

- "Word by word" means 100% coverage of the source, not splitting fixed compounds into characters that lose their meaning; annotate at the smallest meaningful unit, respecting compounds, the function of particles, and loan-character relations.
- Annotation must never rewrite the source. A suspected scribal error, loan character or edition difference is marked with `variant`, never silently replaced.
- If both the word gloss and the sentence gloss are written as long sentences, the source drowns. A word gloss settles only a local reading; a sentence gloss supplies only the current action or causal link.
- The chapter reading is neither a repetition of a line-by-line translation nor a collection of aphorisms. It runs one main relation and gives one transferable situation or one boundary of failure.
- Boundaries are written naturally into the prose; do not start method headings like "limits of the reading", "scope of application", "transfer test" - those words pull the reader out of the content and into the writing backstage.
- The top image compresses the motif; it does not retell the plot. No text, calligraphy, seals, watermarks or high-saturation religious spectacle in the image; an over-busy picture steals first reading rights from the source.
- A PNG existing is not completion. You must check the real dimensions, the title and chapter, annotation coverage, the page bottom, the whole image and the long-image slices.
- Never render straight into Downloads. Accept the candidate PNG in `/tmp` first, then copy the final card and read back the SHA-256 of both candidate and delivered file.
- A fixed image width does not mean a fixed type size. When there is more text, increase the page height and adjust line breaking first; never squeeze the body type down to unreadable.
- Punctuation is not an independently breakable unit. Sentence-final punctuation and closing quotes stay with the preceding source token; an opening quote stays with the following token, so no mark is orphaned on its own line.

## Examples

**Example 1: typesetting a whole chapter**

```text
User: "/ljg-classic Chapter 16 of the Daodejing, annotate it word by word and explain it fully"
-> pin down the book, the chapter and the base edition
-> generate word glosses, sentence glosses and the full chapter reading, section by section
-> complete acceptance in the exclusive `/tmp` workspace, and deliver only the 1080px long PNG, labelled with book and chapter, to `$HOME/Downloads/`
```

**Example 2: the user supplies the text**

```text
User: "Turn this passage into an interlinear annotated image and finish with a full reading"
-> cover the source fragment by fragment, colouring loan characters and grammar separately
-> the reading runs the condition, mechanism and result in plain language
-> the JSON, HTML, manifest, image and QA slices stay in `/tmp`; the final PNG is delivered to `$HOME/Downloads/`
```

**Example 3: translating a single line**

```text
User: "What does this line mean?"
-> do not trigger ljg-classic
-> give a short translation directly; to explain a concept or principle in the chapter, use ljg-explain
```
