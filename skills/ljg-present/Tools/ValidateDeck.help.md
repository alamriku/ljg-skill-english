# ValidateDeck - 4.8

    bun Tools/ValidateDeck.ts deck.html --json
    bun Tools/ValidateDeck.ts deck.html --theme hacker-dark
    bun Tools/ValidateDeck.ts deck.html --browser-report probe.json
    bun Tools/ValidateDeck.ts SloganTemplate.html --template
    bun Tools/ValidateDeck.ts --self-test

## Static checks

- Agreement with the current canonical template: any renderer/CSS/DOM change beyond the data, the restricted font slots and the licences is rejected. Keeping old function names or validation tokens is no substitute for the actual template.
- The syntax of the final RAW_SLIDES and DECK_META, the semantic roles, body exclusivity and the source manifest.
- faithful mode: field-by-field content, order and continuation reconstruction; editorial mode: the record of the authorization basis, citation coverage and chart data validity.
- The data, the metadata and the canonical template together bind the buildId.
- Offline assets, font signatures, licence slots, absence of animation and runtime syntax.

## Browser report

--browser-report checks a real page probe report with the same buildId. ProbeDeck.js checks the rendered text, roles, bodies, type sizes, boundaries and interaction. Without such a report, a static pass is never described as visual acceptance.

## Self-test

Covers the canonical template, extra CSS, branches that skip rendering, extra scripts, external resources, font spoofing, purpose tags, two-line claims, fidelity drift, diagram endpoints, prices and formulas. The real renderer for native charts is checked in a minimal DOM fixture for a shared zero point, positive and negative bars, real time spacing, the original point count, the mobile data list and text safety.

## Return values and boundaries

Exits 0 on success, non-zero on validation failure. --json reports each failure and the browser verification status.

The source manifest still has to be checked independently against the complete original; the tool cannot judge whether a model's own transcription of a source is faithful. A font file signature is not proof of complete decoding, and a screenshot tool can miss details of the browser's native interface. A limited test supports only the conditions it actually ran; aesthetics and the meaning of relations need the source and a visual review.
