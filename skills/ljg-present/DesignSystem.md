# Unix Editorial - Design System

## The design judgment

Cleanliness comes from a clear hierarchy. Each slide picks one protagonist: a claim, a comparison, a relation, evidence, or a chapter question. Anything beyond the protagonist stays only if it has a concrete purpose; titles, rules and closing lines are not fixed decoration.

Dark grounds, hairlines and monospace code are the visual vocabulary. They serve the talk; they do not replace composition.

## Stage and scale

Landscape slides are composed on a fixed 1920x1080 logical canvas, scaled as a whole to the viewport, with the main content area about 81% of the canvas width. Relative positions and type ratios hold as the viewport changes. Portrait switches to a single-column reading layout; complex relation diagrams keep readable labels and may scroll horizontally.

Latin text, variables, numbers and Unicode connector lines use the embedded IBM Plex Mono; text in other scripts uses a system sans stack with natural letter spacing, positioned by phrase and by node. Ordinary prose never imitates a terminal character grid.

White space may gather on one side, along a single reading path, or around the claim. Keep the safe margins and baselines consistent; claims are centred, while chapter questions, evidence and explanation are left-aligned according to their reading logic.

## Five main layouts

Real samples and reproducible data are in [CompositionReference.md](CompositionReference.md). These are semantic prototypes, not styles to rotate slide by slide.

| Prototype | Protagonist and composition | What can be dropped |
|---|---|---|
| statement | One judgment standing alone at large scale; the original sentence may break into two lines | a repeated title, a summary at the foot, ornament |
| chart/compare | Two objects share a starting point and dimensions, expressing the difference through position and distance | extra frames, a separate summary line |
| chart/diagram | The relation occupies most of the area; nodes are labelled in place and Unicode connectors close | the same gloss inside and outside the diagram, purposeless node boxes |
| evidence | A table, code or source material organizes the information itself; the claim sits next to the evidence | fake windows, borders on every cell, decorative tabs |
| chapter | A new question or turn gets a pause, with a scale and space distinct from the body | body charts, a long lead-in, a repeated chapter explanation |

The cover uses the statement scale; a closing slide can simply be a claim. Progressive lists use sequence and quotations use quotation; both are chosen by intent, never by line count.

## Hierarchy

The protagonist is seen first. Secondary information recedes through position, size, weight and lightness; it never occupies a block of equal weight beside the protagonist.

- When one sentence already contains the judgment, it is the protagonist - do not add a synonymous title above it.
- When labels and the conclusion in a diagram say it directly, keep the explanation next to its object; a separate caption stays short.
- A key qualification is part of the claim and must not be demoted to an unreadable footnote. Supporting background may move into the notes.
- An explicit comparison can take columns; a continuous argument keeps one stable reading axis. Geometric centring is not a substitute for semantic organization.

## Colour and line

| Use | Dark | Light |
|---|---|---|
| Body ground | #18191C | #F2F0EB |
| Cover / chapter | #101113 | pale paper |
| Primary text | #E8E5DF | #18191C |
| Secondary information | #99958E | #64615D |
| Necessary emphasis | #D7AF74 | #825B25 |

Warm white or ink black carries the content by default. Amber marks one emphasis, a chapter boundary, or a definite state - never colour every category at once. Lines express relation, boundary, scale or separation only; a statement slide may have no line at all.

Keep flat colour fields, hard edges and crisp letterforms. Scanlines, noise, glow, shadows, glass effects, fake terminal chrome and meaningless decorative labels are not part of this system.

## Rhythm across the deck

The chapter boundaries, turns, examples and closes in the outline set the rhythm. Converting source nodes mechanically into slides of equal rank destroys those relations.

A chapter question provides the pause; development slides carry the necessary information; a relation or evidence slide concentrates attention; an existing short judgment can close. The number of slides and diagrams follows the content; there is no rotation order and no quota. If a source heading is only an internal planning label, keep its turning function without copying the internal jargon.

## The reviewer's eye

Look at the thumbnail set first, then at full size: the protagonist is unmistakable at first glance; chapters have a perceptible pause; density and sparseness come from the content; spacing looks natural; supporting text has not set up a second focus. Judge the composition against the matching sample.

Runtime measurement covers type size, boundaries, text and interaction. Screenshots cover proportion, visual weight, line joins and reading order. Neither replaces the other.
