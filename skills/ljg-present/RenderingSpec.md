# Rendering Spec - 4.8

## Data entry point

Tools/BuildDeck.ts fills the current SloganTemplate.html with data. The tool handles five placeholders: TITLE, SUBTITLE, THEME, SLIDES_JSON, DECK_META_JSON. Replacement is functional, so dollar signs in the body never take part in the substitution syntax.

Minimal complete input (JSON):

    {
      "title":"Verify first, then use",
      "mode":"faithful",
      "tags":["share"],
      "sources":[
        {"id":"SRC-001","content":{"lines":[{"chunks":[{"t":"The output is generated,"}]},{"chunks":[{"t":"the work is not finished."}]}]}}
      ],
      "slides":[
        {"role":"statement","sourceIds":["SRC-001"],"lines":[{"chunks":[{"t":"The output is generated,"}]},{"chunks":[{"t":"the work is not finished."}]}]}
      ]
    }

With theme omitted, hacker-dark is used. Editorial mode also supplies editingBasis, stating the distillation, reorganization or redrawing the current user has authorized.

## The source manifest

sources follow the order of the original, with stable unique IDs. content is the presentable content transcribed independently from the source, using the body and optional text fields below; it may carry source records such as kind and raw. The generator must still check the manifest against the complete original - a manifest embedded in the output file cannot prove fidelity on its own.

- faithful: slide content matches the corresponding source content field for field; the order of first reference matches the source manifest. Tables keep their structure and pre keeps its whitespace.
- editorial: rewritten within the authorization and citing sourceIds; facts, data, relations and important qualifications are checked back against the original. The original content is never overwritten by the rewrite, and the full narration goes into notes.
- Every source is referenced by at least one slide. Several sources may feed one slide; a source that stays off-screen but enters the notes is still cited. How the source's chapters are preserved or merged is decided explicitly by the speaking intent.
- The document title produces its own cover; merge it with the first content node only when the text is identical and there is no extra heading or annotation.

## Explicit roles

| role | Use | Body |
|---|---|---|
| identity | Cover, only at the start | lines |
| chapter | A new question, a turn, the entry to a stage | lines, optional kicker |
| statement | One judgment, may break across lines | lines |
| sequence | Several items of the same rank, progressive or parallel | lines |
| quotation | A quotation | lines |
| chart | Comparison, quantity, trend or relation | chart or diagram |
| evidence | A table, code, or a source character block | table or pre |

Exactly one body per slide. The role is chosen by speaking function, never inferred from "2-4 lines" or a word count. The template keeps basic display compatibility with older fields; new build input must state the role explicitly.

Shared optional fields:

- headline: a title that genuinely helps locate the slide; never a restatement of the claim.
- kicker: an existing chapter number or a small amount of locating information.
- caption: supporting notes; important arguments and boundaries belong in the body.
- notes: the full speaker narration, shown only with N.
- sourceIds: references to the original content.
- derivedFrom: references for a supplementary diagram, mutually exclusive with sourceIds; in faithful mode it must sit next to the source slide, while editorial may link several sources.

Title, body and annotation are not a fixed set of three. A statement slide may have only lines; a diagram may have no separate caption; evidence needs no frame and no tab.

## Body formats

    {"lines":[{"indent":0,"chunks":[{"t":"source text"},{"t":"emphasis","hl":true}]}]}

    {"table":{"header":true,"rows":[["observation","judgment"],["the file exists","the artifact was saved"]]}}

    {"preTitle":"optional source title","pre":"source code or original character diagram"}

table.header follows the semantics of the source table; never assume the first row is a header. Real code, and source diagrams you are not authorized to redraw, use pre. New relation diagrams use the structured diagram field, drawing Unicode connectors and natural-language labels separately - see ChartSpec.

## Physical continuation

When splitting along a sentence or line boundary in the source, each continuation slide keeps one source ID and records:

    {"sourceParts":[{"id":"SRC-001","index":2,"total":2,"joinBefore":"\n"}]}

Continuations are contiguous and completely numbered, and joinBefore rebuilds the original visible text. A same-rank list drawn from several sources may share a slide; concatenating each source's lines in order must equal that slide's lines. Shared meaning decides the grouping - a uniform item count is no substitute for a semantic judgment.

## Readability

Landscape uses the 1920x1080 logical canvas scaled as a whole; portrait is an independent single column. Effective type size multiplies the stage scale by the local fit, and SVG also counts its viewBox scale. Verify at 1098x648:

| Content | Minimum effective size |
|---|---|
| Claim / chapter sentence | 56px; the reference samples are usually above 80px |
| Body text / in-slide heading | 40px |
| Table | 30px |
| Key labels / numbers in a diagram | 26px |
| Supporting annotation | 20px; never hide a key qualification here |
| Source code / character block | 22px; continue dense blocks along semantic boundaries |

On a phone, key text is at least 20px and supporting annotations and tables at least 16px. Complex diagrams keep their label size and scroll horizontally; ordinary flow and compare diagrams stack vertically, and a trend chart falls back to a list of the same data.

fit is a final micro-adjustment only; below 0.80, repaginate or recompose. ProbeDeck also checks the actual child content, so a compliant outer frame cannot hide clipping inside. Semantic line breaking and orphan protection add no characters.

## Offline and interaction

One HTML file, with fonts and their licences embedded; tables, charts, Unicode diagrams and formulas have no network dependency. The template offers no injection point for arbitrary author HTML/JS, and text goes through textContent or controlled escaping.

Formulas are processed only between closing dollar delimiters, leaving literal prices intact; basic subscripts, superscripts and common operators are supported, and unknown commands are kept verbatim. No animation; resize, font loading and fullscreen changes trigger layout measurement.

Arrow keys, PageUp/PageDown, Space, Enter, j/k, Home/End, F and N are reserved. Editing state, the notes overlay and scrollable diagrams do not steal the paging input.

## Layers of acceptance

1. BuildDeck checks the input contract and embeds the assets.
2. ValidateDeck parses the data back out of the final HTML and checks the source content, the build fingerprint, the canonical template, offline status and the absence of animation. Unused legacy code must not mask a substitute renderer.
3. ProbeDeck checks the actual roles, main objects, text, type sizes, boundaries and interaction in the browser; its report is bound to the buildId.
4. Screenshots compared against the samples check composition and rhythm. Passing the static and runtime checks still does not prove the design works.
