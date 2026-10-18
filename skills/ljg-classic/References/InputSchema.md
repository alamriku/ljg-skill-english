# Input Schema

The renderer reads UTF-8 JSON. Minimal structure:

```json
{
  "book": "Book title",
  "chapter": "Chapter 16",
  "heroImage": "assets/chapter-16-intent.png",
  "heroAlt": "Morning mist in a valley, things emerging from stillness and returning",
  "original": "<the full source text of the chapter>",
  "source": "Base edition used; punctuation added in this edition",
  "passages": [
    {
      "tokens": [
        {
          "text": "<source token>",
          "note": "what this word means here",
          "tone": "word"
        },
        {
          "text": ",",
          "punctuation": true
        },
        {
          "text": "<source token>",
          "note": "what this clause does",
          "tone": "clause"
        },
        {
          "text": ".",
          "punctuation": true
        }
      ]
    }
  ],
  "interpretation": [
    "First paragraph of the chapter reading: the main relation, stated plainly.",
    "Second paragraph: how the condition produces the result, and where it stops holding."
  ]
}
```

## Fields

| Field | Type | Requirement |
|---|---|---|
| `book` | string | required, non-empty; shown at the top of the page |
| `chapter` | string | required, non-empty; shown under the book title |
| `heroImage` | string | optional; a local PNG/JPEG/WebP, absolute or relative to the JSON; URLs and data URIs are rejected |
| `heroAlt` | string | required when `heroImage` is present; one sentence describing what is visible and the chapter's intent, without repeating the book and chapter |
| `original` | string | required; the complete source text of the base edition, which must match the concatenation of all tokens in order exactly |
| `source` | string | optional; shown in the footer; never infer edition information that does not exist |
| `passages` | array | required, at least one passage |
| `passages[].tokens` | array | required, in source order |
| `text` | string | required; must preserve the base edition's characters |
| `punctuation` | boolean | true for punctuation; when true, no note is required |
| `note` | string | required for every non-punctuation token |
| `tone` | enum | required for non-punctuation: `word`, `clause`, `variant` |
| `pinyin` | string | optional; only for readings that matter |
| `interpretation` | string[] | required, at least one natural paragraph |

## Content invariants

1. Concatenating `text` in token order must match `original` character for character.
2. Every token with `punctuation !== true` has a non-empty `note` and a valid `tone`.
3. `interpretation` is a complete chapter reading, not a list of line-by-line translations.
4. No HTML in the JSON; the renderer escapes everything and controls the styling.
5. `heroImage` and `heroAlt` appear together; the image is encoded as a data URL at render time, so the HTML keeps no local hot link.
6. `interpretation` must not contain a heading such as "limits of the reading"; boundary conditions are written into the prose, never shown as writing scaffolding.
