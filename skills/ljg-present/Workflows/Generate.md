# Generate

## Definition of done

Deliver one offline HTML file. Every slide has a clear semantic role and main visual, the chapter rhythm holds and matches the original intent, the text and relations are grounded in sources, it is readable at full size, and the deck speaks one visual language.

Read the complete source, [DesignSystem.md](../DesignSystem.md), [RenderingSpec.md](../RenderingSpec.md) and the matching [composition samples](../CompositionReference.md). When there are diagrams, also read [ChartSpec.md](../ChartSpec.md). State the content mode and the visual direction you are using for this run.

## Content mode and authorization

| The current request | Data mode |
|---|---|
| Lay out the outline, keep the original wording, no authorization to cut or alter | faithful |
| Distil the talk, put the essence on screen, reorganize the deck, redrawing already authorized | editorial, with editingBasis recording the current authorization |

Do not re-confirm work that is already authorized. The scope of rewriting follows the current request; the mode itself grants no permission to expand the content, publish it, or push it anywhere.

The source manifest comes before the presentation data and is transcribed independently from the original - it can never be reconstructed backwards from rewritten slides. faithful checks the original wording, tables and whitespace; editorial checks the claims, facts, numbers, relations and important qualifications, and links the full narration into notes. A source kept only in the notes still has to be cited by the corresponding slide.

Chapter, statement, compare, relation and evidence are chosen by speaking function. A two-line claim stays a statement; a chapter boundary may become its own question slide; titles and closing lines may be dropped. The number of source nodes is not the number of slides. Any rewriting or continuation the mode allows must serve reading and speaking, not fill a fixed template.

## Building the data

Prepare deck.json: document metadata, mode, an independent sources manifest, and slides with explicit roles. The syntax is in RenderingSpec; a complete runnable example is in References/CompositionDeck.json.

The theme is chosen only from an explicit visual intent. Ordinary tags such as share/talk/course do not change the hacker-dark default; only an explicit visual tag such as theme_hacker can serve as a fallback. Legacy flags --hacker/--cyber/-b/-r/-y map to the corresponding theme when generating the input.

## Tool contract

    bun Tools/BuildDeck.ts /tmp/deck.json ~/Downloads/deck-title.html
    bun Tools/ValidateDeck.ts ~/Downloads/deck-title.html --json

BuildDeck assembles from the current template, uses functional placeholder replacement, embeds the fonts and validates the final file. Do not write another renderer, append CSS, or copy an old deck as a new template. New capability belongs in the skill's template and regression samples; the artifact carries only data.

| Intent | Tool option |
|---|---|
| Explicit light theme | BuildDeck --theme hacker |
| Dark default | pass no theme, or --theme hacker-dark |
| Machine-readable static report | ValidateDeck --json |
| Check a real browser report | ValidateDeck --browser-report /tmp/probe.json |

## Browser and visual acceptance

Use the interceptor's isolated context. Execute Tools/ProbeDeck.js as a main-page expression; when viewport response needs verifying, use the interceptor's current viewport verification tool. Save the report and hand it to ValidateDeck - the report must correspond to the same buildId.

ProbeDeck checks the real DOM for roles, main objects, content, type sizes, overflow, diagram labels, and the paging and notes toggles. Cover at least one landscape projection size and one phone size. Then look at the whole deck at 25% thumbnails plus a representative slide of each kind, judging hierarchy and rhythm against CompositionReference; for relation diagrams, check every label and connector.

A static PASS only shows that the template, data and assets match the contract. The browser probe does not replace visual judgment, and it does not prove that a particular clicker works. If the isolated browser is unavailable, keep the artifact and record explicitly that visual re-verification was not completed.

## Delivery note

Give the final HTML path, the mode and theme, the slide count, the scope of the content check, the verification actually completed and its limits. Arrow keys / Space page through, F is fullscreen, N shows the notes. Deliver only the final single file; intermediate JSON, scripts and screenshots stay in the task's temporary directory.
