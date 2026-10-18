---
name: ljg-business-model
description: Turns a project description, interview, product material or business plan into a nine-block Business Model Canvas card, delivering a PNG plus editable HTML. USE WHEN the user invokes ljg-business-model, asks for a business model canvas, a nine-block business model, or wants business information turned into a canvas card. NOT FOR general business analysis, investment valuation, Lean Canvas, or merely explaining what a business model is.
metadata:
  version: 1.0.0
---

# ljg-business-model

Turn the user's information into a canvas that makes clear who value is created for, how it is delivered, and how money comes in and goes out. The main artifact is a landscape PNG; the HTML and structured JSON are kept alongside it so the canvas can be edited, traced and redrawn.

## Workflow routing

| Input | Handling and delivery |
|---|---|
| Project description, interview, documents, scattered notes | Organize under the contract below, run `Tools/Render.ts`, verify, deliver the canvas |
| An existing canvas plus new material | Update the named model with the new material; keep the unaffected content and regenerate |
| Several independent businesses / business models | One canvas per model; multi-sided customers of the same platform stay on one canvas, linked as C1, C2 |

## Content contract

- Confirm the subject and scope before starting. If only a company name is given with no business material, ask for a description, or research it with the user's permission; if there is enough to draw a first pass, draw it and mark gaps as "to be supplied". When several possible subjects would change the canvas, ask one focused question first.
- Read [CanvasGuide.md](CanvasGuide.md) to calibrate the definitions, relations and classical layout of the nine blocks. Build from the user's material; do not quietly fill gaps with industry assumptions presented as fact.
- Mark every point `given` (from the material), `inferred`, or `unknown` (to be supplied). "From the material" is not the same as externally verified. Link `given` points to a source number and attach the basis for `inferred` ones; a plan the user stated clearly stays written as planned or intended, never as already happening.
- Prefer 2-4 concrete points per block. Keep the distinguishing information: who the customer is, what they buy, who pays, the unit of pricing. Write points as "object + action/result" where possible; keep price and billing period in revenue, and the cost drivers in costs. Never invent amounts, scale, partners or conclusions the material does not support.
- All nine blocks live on one canvas. Keep the classical spatial relations, with costs and revenue along the bottom; do not draw an even 3x3 grid, and do not switch to a Lean Canvas on your own. Colour serves the zones and the customer mapping; anything inferred also carries a text label, so colour is never the only cue.

## Generation and acceptance

Prepare the input JSON in a single temporary directory; its structure is in [Tools/Render.help.md](Tools/Render.help.md), a complete fictional example is in [Example.json](Example.json), and a layout reference is in [Example.png](Example.png) (rendered from the original edition, so its labels are in Chinese - use it for the geometry only). Call this skill's real directory `SKILL_DIR` and run from any working directory:

```sh
bun "$SKILL_DIR/Tools/Render.ts" --input "$WORK_DIR/model.json" --output "$WORK_DIR/model.html"
```

| User intent | Flag or behaviour |
|---|---|
| Default card | Default width 1600 CSS px; export the final PNG |
| Specified width | `--width 1200` through `--width 2400`; still check readability |
| Save to a specific location | After acceptance, put the final PNG, HTML and JSON into that directory |

Open the HTML in a real local browser, wait for the fonts to load, and check the order of the nine blocks, all text, and any overflow. If an interceptor is available in this environment, follow its isolation and screenshot contract; otherwise use whatever real browser tooling is available. `window.businessModelAudit()` reports block counts, gaps, inferences and geometric overflow. Export the whole `#canvas` as a PNG, ideally at 2x pixel density; if no screenshot capability exists, keep the HTML and say plainly that the PNG was not produced - never pass an HTML link off as the image.

Open the final PNG and look at the whole thing, then zoom into the dense areas. If the text is too tight, first trim repetition or make the canvas taller; keep the key conditions, and never crop, hide overflow, or shrink the type to force a fit. If the renderer rejects entries that are too long or too numerous, clean up the input and rerun rather than bypassing validation.

Finally, show the PNG directly in the conversation and give file links to the HTML and JSON; briefly note any missing information that affects understanding. Keep drafts and screenshots in the temporary directory; only accepted artifacts go to the delivery directory.

## Gotchas

- Customer segments are who is served; the payer may not be the user. On a multi-sided platform, keep that mapping visible across value, channels and revenue.
- Channels describe how customers are reached, won and served; customer relationships describe how the interaction is built and maintained. Resources are what you own or can call on, activities are what you do repeatedly, partners are outside participants.
- Revenue streams are how you charge - funding is not revenue; cost structure is the logic of spending, which cannot be used to compute profit or to add up figures whose periods are unstated.
- Clean classification does not mean the business model works. Contradictory material, unvalidated demand and a missing payment logic must leave a trace rather than being smoothed away by a tidy summary.
- Keep the footer attribution to the Business Model Canvas, Strategyzer.com and CC BY-SA 3.0; this is an adapted layout, not the official original or a restatement of the book. The licence covers the canvas template; it does not change the rights in the user's own business material.

## Examples

- "ljg-business-model: we provide purchasing services for small restaurants and charge on transaction value ..." -> draw a card from what is given; mark the missing partners and costs as to be supplied.
- "Turn this two-sided platform interview into a business model canvas" -> mark users and payers separately, tracking each one's value and revenue path.
- "Here is yesterday's canvas; we are switching to an annual subscription" -> update the charging model and check, from the new material, whether customer relationships and costs change too; mark unevidenced changes as inferred.
