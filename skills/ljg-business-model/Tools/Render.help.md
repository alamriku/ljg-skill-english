# Render.ts

No external dependencies; uses Bun to turn JSON into offline HTML. All text is handled as text and escaped automatically; HTML in the input is never executed. The generated HTML contains the canvas and a browser acceptance function, and connects to no external service.

```sh
bun Tools/Render.ts --input model.json --output model.html [--width 1600]
bun Tools/Render.ts --help
```

`--input` and `--output` are required. `--width` is an integer from 1200 to 2400, default 1600. An existing output path is an error, so older versions are never overwritten. On success it prints JSON to stdout; on failure it prints the reason to stderr and exits non-zero.

## Input

Top-level fields:

- `title`: the business or project name, max 32 characters.
- `scope`: the subject's scope and stage, max 60 characters.
- `date`: `YYYY-MM-DD`, in the task's local date.
- `version`: version text, max 24 characters.
- `summary`: one line describing the business model, max 100 characters; write "to be clarified" where the logic is unsupported.
- `sources`: `[{"id":"S1","label":"project description provided by the user"}]`; an optional `detail` can hold the relevant excerpt or locator and is not rendered into the footer. Ids must be unique.
- `segments`: optional `[{"id":"C1","label":"local residents"}]`, max 4; used to link customers across blocks, keeping a fixed colour and a text id.
- `blocks`: must contain the nine keys from CanvasGuide.md, each an array of entries. An empty array renders as "to be supplied"; no other block keys are accepted.

Entry structure:

```json
{
  "text": "C1 residents pay monthly and get 20 coffees per month",
  "status": "given",
  "source_refs": ["S1"],
  "segment": "C1"
}
```

- Max 5 entries per block; each `text` max 90 characters. Exceeding either is an error, never a truncation.
- `status` is `given` / `inferred` / `unknown`. The card shows them as "from material", "inferred", "to be supplied".
- `given` requires at least one valid `source_refs`.
- `inferred` requires `reason` (the basis for the inference, max 240 characters); `source_refs` is optional. The basis is kept in the JSON and in the HTML hover tooltip.
- `unknown` needs no reference. Being specific ("customer acquisition cost to be supplied") beats a vague question mark.
- `segment` is optional and must match an id in `segments`.

A complete input example is in [Example.json](../Example.json); the example is explicitly fictional and must not be applied to a real company.

## Browser and image

After opening the HTML, wait for `document.fonts.ready` and call `window.businessModelAudit()`: it returns `ok`, `blocks`, `items`, `inferred`, `unknown`, `overflow`, `bounds`. This is a geometric check - it does not verify business facts and does not replace looking at the image.

Use a real browser's screenshot capability to capture the whole `#canvas` and save it as PNG, ideally at 2x pixel density. If the browser tool cannot open file URLs, serve that single file from a temporary server bound to 127.0.0.1 only, and shut it down afterwards. Make sure nothing is cut off horizontally before the screenshot; never let the viewport size crop the right-hand side of the canvas.
