# BuildDeck

Builds a single-file offline deck on the canonical template from structured data, embedding the fonts and checking the final file.

    bun Tools/BuildDeck.ts input.json output.html
    bun Tools/BuildDeck.ts input.json output.html --theme hacker

The input needs title, sources and slides. mode defaults to faithful; editorial also needs editingBasis. Every slide supplies an explicit role; see References/CompositionDeck.json for an example and RenderingSpec.md for all fields.

An explicit theme beats a theme_* visual tag; purpose tags such as share/talk do not change the hacker-dark default. The output directory is created if missing. An existing target HTML is updated, so use a clear task artifact path.

Build sequence: validate the data -> assemble on the current template -> EmbedAssets -> ValidateDeck. Any failing step exits non-zero. The data and the canonical template both feed the buildId, so changing the content or the rendering implementation invalidates an older browser report.

This tool does not parse arbitrary Org/Markdown, and it does not decide whether the author authorized a distillation. The skill reads the complete source, chooses the content mode and transcribes the independent source manifest; the tool delivers the contract already chosen. Never treat rewritten slides as the source.
