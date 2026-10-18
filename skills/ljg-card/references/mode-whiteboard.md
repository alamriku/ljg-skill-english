# Mold: whiteboard (-w)

The whiteboard lays open how the author walked, step by step, to the conclusion. The 1080px tall card reads like a dive: the question at the top, then premises, evidence, contradictions, turns and local branches going deeper layer by layer, ending where the content itself closes. From the artifact alone the reader should be able to restate "why the next step follows from the one before".

Natural flow comes from the pressure the previous step left behind, not from captions announcing "let us press further". The spine is always explicit in the ledger; on stage, only the hinges that really change the direction of the argument speak, while ordinary continuation, explanation and progression stay silent.

When used for knowledge explanation, the reader must also learn why a real object falls under a concept and how a rule produces a concrete result. Read `references/learning-design.md` first and pin down the target reader's judgment task. The vertical spine shows the order of the author's argument; the lower/upper structure shows the correspondence between object and concept. They are independent - never force the whole whiteboard into two stacked columns.

When running, read `references/image-generation.md` and `assets/whiteboard_template.html` first. The shared protocol decides asset identity and source boundaries; this file decides argument extraction, the vertical spine and local structures.

## 1. Build the argument ledger first

Before any visual motif, build the ledger in the source's reading order. Never go from a summary straight into layout; a summary keeps the conclusion and is exactly what deletes the author's route to it.

Save the locked body as an exact source snapshot with its original paragraphs, separated by a blank line. Generate the independent source inventory with the deterministic tool:

```bash
bun assets/prepare-whiteboard-source.ts /tmp/<task>/source.txt /tmp/<task>/whiteboard-source-inventory.json
```

The tool locks the file's SHA-256 and assigns `src-01`, `src-02`, ... plus a paragraph hash to each non-empty paragraph in order. The ledger's `source_sections` must match that independent inventory in IDs and order, so a paragraph cannot be dropped first and then have a self-written ledger and the DOM vouch for each other.

Each source paragraph is registered in `source_sections`:

- `id`: a stable source anchor, e.g. `src-01`;
- `disposition: rendered`: it enters the whiteboard, listing the matching `step_ids`;
- `disposition: omitted`: it carries neither a necessary argument nor learning material the target reader needs, with an explicit `omission_reason`;
- every source section must be one or the other - none may vanish silently.

Run two deletion tests on candidate material, and keep it if either holds:

- **Argumentative load**: deleting it leaves a later judgment without its premise, turn, evidence or boundary.
- **Learning load**: deleting it leaves the target reader unable to recognize the concept for the first time, tell confusable objects apart, or connect the rule to a concrete result. An example that proves nothing can be load-bearing here.

Learning material goes first into its step's `support` or a local `.learning-material`; never manufacture a reasoning turn just to keep an example, and its source paragraph still maps to that step as `rendered`. Create a new step only when a genuinely new judgment is added. In the final ledger, every step's `must_render` is `true`; an `omission_reason` must say why the deleted material's function is no longer needed, not merely "it was only an example". Do not pad to a fixed node count.

Complete ledger fields and references only prove the material was registered. A node's actual explanation must still connect the object, the action or state, the grounds for classification and the result; a correspondence invisible in the body cannot be reconstructed from arrows or field names. Review the wording against the same-material comparisons in `references/learning-design.md`, and never mistake a structural gate for an explanatory effect.

Each step registers:

| Field | Meaning |
|---|---|
| `id` | stable step ID, matching the DOM's `data-step-id` |
| `role` | `question` / `premise` / `evidence` / `tension` / `inference` / `turn` / `synthesis` / `conclusion` / `boundary` |
| `source_refs` | one or more source section IDs |
| `claim` | the judgment this step adds, not a restatement of the title |
| `support` | the facts, explanation or qualification the source gives; empty string when there is none |
| `residue` | the unresolved pressure this step naturally leaves that drives what follows; empty string when there is none - never manufacture a problem for depth |
| `must_render` | fixed to `true` in the final ledger |
| `presentation` | `text` / `typography` / `image` / `chain` / `branch` / `timeline` / `matrix` / `radial` |

`role` describes the argumentative function; do not label every teaching example `evidence`. `support` and local learning material may present the object, the discrimination criteria, the relation and the result, with no requirement to split them into five fields. An example from the source binds to its real `source_refs`; an authorized added example sits inside the step it explains, visibly labelled "added hypothetical example", and the source reference for its rule must never imply the example came from the source. When material is missing and no addition was authorized, state the gap in the production notes and the delivery message.

Relations are registered separately in `relations`, each with `id`, `from`, `to`, `kind`, `visibility`, `bridge`:

- `kind`: `continue` / `deepen` / `contrast` / `question` / `branch` / `return` / `boundary`;
- `visibility: implicit`: ordinary continuation, explanation, illustration or natural progression. `bridge` stays empty and the spine simply continues visually;
- `visibility: visible`: a contradiction appears, the question is rewritten, a condition changes, a branch opens, a branch returns, or a boundary is reached. `bridge` carries one complete, specific sentence - no longer split into a relation label plus an explanation.

One edge has exactly one visible carrier: if the current step already left the pressure in `residue`, the following relation is `implicit`; if the turn needs its own pause, leave that step's `residue` empty and let the relation's `bridge` carry it. Never write both. Adjacency is not automatically causation.

The final ledger uses the structure below and is written into the template's `{{LOGIC_LEDGER_JSON}}`:

```json
{
  "version": 2,
  "source_sha256": "the 64-character SHA-256 of the locked source",
  "source_sections": [
    {"id": "src-01", "disposition": "rendered", "step_ids": ["step-01", "step-02"]},
    {"id": "src-02", "disposition": "omitted", "omission_reason": "author bio, plays no part in the argument"}
  ],
  "steps": [
    {
      "id": "step-01",
      "role": "question",
      "source_refs": ["src-01"],
      "claim": "the question the source is really trying to answer",
      "support": "the concrete situation in which the question arises",
      "residue": "this only shows the experience disappears; it does not yet say where it should be written down.",
      "must_render": true,
      "presentation": "typography"
    }
  ],
  "relations": [
    {"id": "rel-01", "from": "step-01", "to": "step-02", "kind": "deepen", "visibility": "implicit", "bridge": ""}
  ]
}
```

Serialize `<` as `<` inside the JSON, and never copy source HTML or executable content into `<script type="application/json">`.

## 2. One spine, local variation

Each whiteboard has exactly one `.reasoning-spine`. It is both the reading direction and the visual dive line. The old whole-card `data-whiteboard-layout` is retired: a real article may progress as a chain, branch in the middle, compare in a matrix, and then converge into the conclusion.

The opening uses:

- `.whiteboard-title`: the article's subject, without standing in for the whole derivation;
- `.whiteboard-question`: the question the reader carries downward;
- optional `.whiteboard-orientation`: the source situation, not a summary of the conclusion.

Each load-bearing step uses:

```html
<article class="logic-step"
         data-step-id="step-02"
         data-role="tension"
         data-source-refs="src-01 src-02">
  <div class="step-marker" aria-hidden="true">
    <span class="step-depth">02</span><span class="step-dot"></span>
  </div>
  <div class="step-panel">
    <span class="step-role">tension</span>
    <h2 class="step-claim">Remembering it briefly is not the same as learning it</h2>
    <p class="step-support">Once the context ends, the experience never stably enters the next task.</p>
    <p class="step-residue">This only shows the experience disappears; it does not yet say where it should be written down.</p>
  </div>
</article>
```

An ordinary progression still registers its endpoints but stays silent:

```html
<div class="logic-relation"
     data-relation-id="rel-02"
     data-from="step-02"
     data-to="step-03"
     data-kind="deepen"
     data-visibility="implicit"
     aria-hidden="true"></div>
```

A visible turn is used only when the direction really changes, and one sentence carries both the relation and the reason:

```html
<div class="logic-relation"
     data-relation-id="rel-03"
     data-from="step-03"
     data-to="step-04"
     data-kind="branch"
     data-visibility="visible"
     aria-label="A single memory layer cannot both update quickly and retain stably, so the question splits into two routes.">
  <span class="relation-rail" aria-hidden="true">
    <span class="relation-stem"></span><span class="relation-arrowhead"></span>
  </span>
  <div class="transition-copy">
    <p class="transition-sentence">A single memory layer cannot both update quickly and retain stably, so the question splits into two routes.</p>
  </div>
</div>
```

Ledger steps, DOM steps, ledger relations and DOM relations must agree on IDs, order, kind, visibility and text. The first step is a `question`, and there is real derivation before the conclusion; the ending follows the source's own conclusion, question or lingering note and is not forced to close on a `boundary`. `boundary` marks only a condition or limit that really changes the judgment in the source - never invent a disclaimer for it, and never let one headline judgment at the top replace the whole path.

### The deletion test for flowing connection

Read the headings, the supporting text and any `residue` aloud as one piece, then check each relation:

- Delete this transition and the reader still moves from the previous step to the next: make it `implicit`;
- Deleting it loses a contradiction, a rewritten question, a branch, a return or a boundary: keep it `visible`;
- A transition that only says "pressing further" or "one step more" without naming the specific unresolved thing in the source is an announcement: rewrite or delete it;
- The next node's heading already answers the previous step's residual pressure: add no relation copy.

The number of visible turns follows the deletion test, with no quota. The goal is not to write less but to write only where the logic actually changes gear.

## 3. The five topologies become local tools

Local structures use `data-logic-shape` and may be combined within one spine:

| Local structure | When it fits | Semantic surfaces that must appear |
|---|---|---|
| `chain` | a short progression still needs unfolding inside one node | `.local-chain` with ordered children |
| `branch` | one question splits into different conditions, mechanisms or routes | `.local-branch`, two or more `.branch-path`, plus a return or an open statement |
| `timeline` | the same object moves through states | `.local-timeline` with time/state labels |
| `matrix` | two independent axes form a comparison space | `.local-matrix` with two axes and four regions |
| `radial` | several independent mechanisms act on one place | `.local-radial` with a centre and independent spokes |

A branch must say where it goes:

```html
<section class="local-shape local-branch"
         data-logic-shape="branch"
         data-branch-state="converged"
         data-entry-step="step-04"
         data-return-step="step-07">
  <div class="branch-grid">
    <div class="branch-path" data-branch-id="route-a">...</div>
    <div class="branch-path" data-branch-id="route-b">...</div>
  </div>
  <p class="branch-return">The two routes converge again at step-07.</p>
</section>
```

Every path of a `converged` branch must reach `data-return-step` through a relation; when convergence is genuinely not possible, use `data-branch-state="open"` and write a visible `.branch-open` - never draw two columns and then forget them.

## 4. Images enter only load-bearing steps

Before deciding whether to use an image, check both the argument and the discrimination: omit it only when deleting it damages neither. Concrete lower-layer material can be carried by text, a source image or a generated scene, and 0 generated images is still legitimate; keeping an image requires saying which feature or result it makes easier to recognize.

The generated image budget is `0-4`. The whiteboard has no top hero slot; an image is embedded only in the `.logic-step` it explains, with `data-source-claim` equal to that step's ID:

```html
<figure class="generated-art generated-art--whiteboard"
        data-asset-kind="generated"
        data-asset-id="g02"
        data-source-claim="step-05">
  <img src="/absolute/path.png" alt="with the valve tightened, noticeably less water flows into the container">
</figure>
```

Images draw only visible actions: people, hands, objects, containers, ropes, valves, terrain. Arrows, axes, matrix boundaries, labels, formulas, titles and numbering all stay in HTML/CSS. Append to the prompt:

```text
minimal hand-drawn whiteboard vignette, warm paper-compatible flat background,
one object and one visible action, loose marker line, low detail, generous clean margin
```

Mode-specific negatives: no arrows, axes, labels, paper texture, sticky-note chrome, shadows or new saturated colours inside the image. When a transparent background is unreliable, the flat colour must match `--board` exactly.

## 5. Tall reading rhythm

- The 1080px width is fixed and the height follows the depth of the reasoning; never cut nodes to approach some template height.
- A continuous dive line runs through the spine; each step carries its depth number, role, claim and support, and `residue` is added only for real unresolved pressure.
- Tighten the setup, and give room to contradictions, turns, branch returns and the conclusion; do not build a wall of equally weighted cards.
- Add vertical space after every real turn in the reasoning; evidence and examples at the same level stay tight around their step.
- A handwriting face is used only for genuine visible turns, depth markers and short annotations; the body uses a local sans face.
- Conditions of application and evidence qualifications go into their step's `.logic-evidence` or `.step-support`; where the source genuinely carries an independent load-bearing limit, present it as an ordinary `.logic-step` along the spine. The ending adds no reading tips, production notes or acceptance statements.
- Material that carries a first recognition, a confusable contrast, or an input-output correspondence uses `.learning-material`, with its identity stated in `.learning-label`, and keeps the main reading size and deep ink colour. Never hide a key discrimination in small pale marginalia; when a narrow branch cannot hold it, move it to a full-width position near its step rather than shrinking the type.
- A change-of-case question goes after the explanation where the content calls for it, using `.transfer-check`; the later `.transfer-feedback` explains the grounds for the answer and may end the body naturally. A prompt to judge before scrolling offers a chance to self-test but cannot guarantee the answer was not seen; state that limit in the delivery message.
- Reduced to a thumbnail, the card should first show one continuous downward line, a few clear turns and the close; at full pixels, the body must be comfortably readable.

Write the final ledger into `{{LOGIC_LEDGER_JSON}}`, the semantic content into `{{CONTENT_HTML}}`, use `{{CUSTOM_CSS}}` only for necessary local adjustments, and replace `{{LOGO}}` and `{{SOURCE_LINE}}`. All intermediate files go into this task's exclusive `/tmp` directory.

## 6. Screenshot and acceptance

```bash
bun assets/capture.ts /tmp/<task>/whiteboard.html ~/Downloads/{name}.png 1080 1600 fullpage /tmp/<task>/whiteboard-source-inventory.json /tmp/<task>/source.txt
```

The screenshot tool blocks on: leftover placeholders, a missing source inventory or source snapshot, source hash drift, a mismatch between the inventory and the ledger's paragraphs, a missing single spine, the old whole-card topology, malformed ledger JSON, a source section with no disposition, a missing or misordered load-bearing step, a node not bound to a source, a dangling relation endpoint or drifting text, a silent relation that still carries copy or an arrow, a visible relation without a complete bridge, an edge using both residue and bridge, a branch that neither returns nor declares itself open, more than 4 generated images or one not bound to a step, broken images or empty alt, horizontal or hidden overflow, and exceeding the supported height.

Final acceptance checks, separately:

1. **Source coverage**: go through `source_sections` item by item - every section has either a step or a specific reason for omission.
2. **Restating the argument**: from the PNG alone, you can state the source's question, the load-bearing premises, how each step follows naturally from the last, how a local branch returns, and the conclusion and its boundary; if you can only recite the conclusion's category without explaining the derivation, it fails.
3. **Reading aloud**: hide the role names, depth numbers and relation data, then read the headings and body straight through; if it sounds like an outline announcing itself, or deleting a visible turn costs nothing, it fails.
4. **Pixel check**: the whole image once; for a long image, overlapping top/middle/bottom slices covering the full height, confirming the dive line is continuous, relation directions are right, pauses occur only at real turns, text is not cropped, and the source has not drifted.
5. **Lower/upper connection (knowledge explanation)**: from the artifact alone, you can point to the key object, the grounds for classification, the conditions of the relation and the concrete result, and judge in a change of case whether it applies. Review first whether the material is sufficient, then distinguish whether a reader test was actually run. Agreement between the source reconciliation and the ledger verifies structure only; it does not decide whether an example is enough to teach, whether a deletion was reasonable, or whether an added example is real.
