# AnnotateAndRender

Turn one chapter of a classical text into a single long PNG: the source text as the trunk, coloured interlinear notes beside it, and a complete chapter reading at the end.

## Step 0 - Sufficiency Check

Read the user's input and the recent context and confirm three things: the source text, the book, the chapter.

- All three present: proceed.
- The book or chapter follows uniquely from the title: adopt that and state the inference in one line.
- Two readings would change the base edition or the chapter's extent: ask at most 3 short questions; when the user replies `proceed`, use the most credible edition and mark the source boundary explicitly.
- Only a single short line and the user only wants its meaning: leave this skill and give a plain translation.

## Step 1 - Load the contracts

Read in full:

1. `~/.agents/skills/ljg-explain/SKILL.md`
2. `~/.agents/skills/ljg-writes/SKILL.md`
3. `~/.agents/skills/ljg-writes/Workflows/WriteEssay.md`
4. `References/AnnotationMethod.md`
5. `References/LayoutGrammar.md`
6. `References/InputSchema.md`

Borrow the language and understanding standards of the first two skills; the artifact and its organization follow this workflow, and you do not run their self-tests or their Org saving steps. This workflow produces the classic JSON, HTML, candidate PNG, manifest and re-verification slices in `/tmp`, and delivers only the PNG that passed acceptance.

## Step 2 - Lock the source text

1. Preserve exactly what the user gave: the base text, its punctuation, the book, the chapter and the description of the source.
2. When only a book and chapter are given, use a verifiable authoritative or public-domain base text; any network reading follows the current `web-access` contract.
3. Never pass a modern paraphrase off as the source. Where editions differ on something important, pick one base edition and say so in `source` or in a `variant` note.
4. Build the continuous read-back string. Concatenating the rendered black source text in order must match the base edition character for character.

## Step 3 - Annotate word by word

Segment into the smallest meaningful units per `References/AnnotationMethod.md`:

- Every non-punctuation token must have a `note`.
- `word`: the sense of the character or compound, the function of a particle, grammar, ancient versus modern meaning.
- `clause`: what this short clause is doing, who the action is aimed at, how the causation connects.
- `variant`: loan characters, textual variants, doubts about the base edition, or disputed readings.
- Give `pinyin` only for rare readings; do not turn every common character into a pronunciation drill.

Then run the coverage check: number of non-punctuation tokens = number of annotated tokens. Fill any gap before writing the chapter reading.

## Step 4 - Write the full chapter reading

First fix the chapter's main relation in one plain sentence:

```text
Under which condition, who changes what through which action, and what results.
```

Then, internally, apply the shared checks from `ljg-explain` and `ljg-writes`:

1. Say the load-bearing words in language a bright twelve-year-old could repeat back.
2. Start from the smallest situation inside the chapter, let the natural explanation run first, then point out the step it misses.
3. Add only the one distinction the current gap requires, and rerun the same situation.
4. Finally reconnect "condition - mechanism - result".
5. Leave one cross-situation transfer or one boundary of failure.

Default 600-1000 words, written as 3-6 naturally progressing paragraphs. One heading, "Chapter reading", is allowed; the body never displays scaffolding such as "the zero model", "concept patch", "transfer test". Never invent the author's biography or a modern anecdote.

The boundary must be buried inside the natural prose; headings or markers like "limits of the reading", "scope of application", "boundary of failure" must not appear. The reader should encounter the limiting condition directly, never the writer's checklist.

## Step 4.5 - Generate the top intent image

By default call the built-in `image_gen` for one landscape chapter-intent image; omit it when the user says "no image" or "text only". The image captures one main relation of this chapter; it does not illustrate the story line by line.

The prompt must include:

- Purpose: the top of a long classical-text image, landscape 3:2, below the title and above the source text.
- Core intent: express the chapter's main relation through one visible action or state.
- Mood: classical, soft, airy, generous white space, low contrast.
- Medium: ink wash or pale mineral colour, warm paper ground, optional subtle paper grain.
- Forbidden: text, calligraphy, titles, seals, watermarks, borders, high saturation, crowded scenes, unverifiable historical detail.

After calling the built-in `image_gen`, copy the selected PNG into `assets/` inside this run's exclusive `/tmp` workspace. If generation fails or the tool is unavailable, do not block the text: omit `heroImage` and `heroAlt`, keep rendering, and explain in the delivery why there is no image. Never fake it with a remote image URL or a placeholder; the image must be a real local file in the workspace that can be embedded in the HTML and take part in the manifest hash check.

## Step 5 - Create an isolated workspace and generate the classic JSON

Create a fresh exclusive workspace on every run. Do not reuse the previous directory, and do not write process files into the repository, the notes directory, the current working directory, or Downloads.

```bash
run_dir="$(mktemp -d /tmp/ljg-classic.XXXXXX)"
mkdir -p "$run_dir/assets" "$run_dir/qa-slices"
```

Following `References/InputSchema.md`, write all of these process files into `$run_dir`:

```text
$run_dir/{timestamp}--classic-{safe-name}.json
$run_dir/{timestamp}--classic-{safe-name}.html
$run_dir/{timestamp}--classic-{safe-name}.candidate.png
$run_dir/{timestamp}--classic-{safe-name}.candidate.manifest.json
$run_dir/assets/{safe-name}-intent.png
$run_dir/qa-slices/*.png
```

`{safe-name}` is built from the book and chapter with path separators and control characters removed. Even when the user asks to "redo, revise, rerun", create a new workspace for the run; only the final delivery path may be overwritten, and only on an explicit request.

`original` holds the complete locked base text and must never be abbreviated. The renderer concatenates every token's `text` in order and compares it character for character.

## Intent-to-Flag Mapping

| What the user says | Flag | Effect |
|---|---|---|
| default, with an image, classical feel | JSON `heroImage` + `heroAlt` | generate and embed the top intent image |
| no image, text only | omit `heroImage` + `heroAlt` | keep the long image text-only |
| default, long image, one image | `--width 1080` | standard reading width |
| a specific width | `--width <pixels>` | accepted only within 720-1600 |
| a specific final PNG path | copy to `<path>` at delivery | this explicit target overrides the default `$HOME/Downloads/` |
| keep the HTML at a path | copy the HTML to `<path>` after acceptance | without an explicit request the HTML stays in `/tmp` |

## Step 6 - Render

Run from the skill root:

```bash
bun Tools/RenderClassic.ts \
  --input "$run_dir/<classic.json>" \
  --output "$run_dir/<classic.candidate.png>" \
  --html "$run_dir/<classic.html>" \
  --width 1080 \
  --slices-dir "$run_dir/qa-slices"
```

On a first run with missing dependencies, use only:

```bash
bun install
bunx playwright install chromium
```

Do not switch to `npm`, `npx`, a Python typesetting script, or a remote screenshot service.

## Step 7 - Acceptance

Run, in order:

```bash
bun Tools/ValidateClassic.ts \
  --input "$run_dir/<classic.json>" \
  --png "$run_dir/<classic.candidate.png>" \
  --manifest "$run_dir/<classic.candidate.manifest.json>"
```

Then read it back visually:

1. Whole image: are the book, chapter, intent image, source, annotations, chapter reading and sources separable at a glance?
2. Top: the intent image sits after the title and before the source; wordless, unwatermarked, not too bright, and does not push the title or the first passage out of the reading rhythm.
3. Middle: interlinear notes do not cover the source, the colours keep their meanings apart, and line breaking does not shatter a note.
4. Reading: warm paper and dark ink read continuously, there is no long blue passage, and no scaffolding labels like "limits of the reading".
5. Bottom: the last paragraph and the sources appear in full, with no large anomalous gap or crop.
6. For a tall image, check overlapping slices covering the full height; a shrunken whole image alone is not enough.

Hard gates:

- Continuous read-back of the black source text = the locked base edition.
- Annotation coverage of non-punctuation tokens = 100%.
- Real PNG width = the requested width; real height > 0.
- The book, the chapter and "Chapter reading" all appear in the visible area of both HTML and PNG.
- When `heroImage` is provided, the image must be embedded in the HTML and visible in the PNG; no remote resources may be loaded.
- The chapter reading must not contain "limits of the reading".
- File hashes and DOM counts agree with the manifest.

## Step 7.5 - Deliver the accepted PNG

Only after every hard gate in Step 7 plus the whole-image and overlapping-slice review has passed do you create the final delivery:

1. The default target is `$HOME/Downloads/{safe-name}.png`; if the user named another final PNG path, use that.
2. If the default target exists and the user did not explicitly ask to overwrite, use `$HOME/Downloads/{safe-name}-{timestamp}.png`; never overwrite silently.
3. Copy the candidate PNG to the final path; the JSON, HTML, manifest, intent image and QA slices stay in `$run_dir`.
4. Run `shasum -a 256` on both the candidate and the final PNG - they must match - then read back the final PNG's real pixel dimensions. A hash or dimension mismatch is a failed delivery.
5. Do not delete `$run_dir` automatically. It is the temporary container for this run's verification attachments, governed by the system temp directory's lifecycle; never present it as a permanent output directory.

## Step 8 - Report

The final report gives: the absolute path of the final PNG in Downloads, its pixel dimensions, the source token and annotation coverage, the length of the chapter reading, the conclusions of the visual read-back, and the SHA-256 match between candidate and final PNG. Put the PNG first; then list `$run_dir` and the JSON, HTML and manifest inside it as temporary verification attachments.
