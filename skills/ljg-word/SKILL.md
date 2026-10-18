---
name: ljg-word
description: Deep-dive English word mastery tool. Deconstructs a single English word into core semantics and epiphany. Use when user asks to explain/master a specific English word.
version: "1.0.1"
user_invocable: true
---

## Usage

<example>
User: Deeply explain the word "Serendipity".
Assistant: [Runs the word deep-dive on "Serendipity"]
</example>

## Instructions

The goal is not translation. The goal is for the user to own the word — its deep meaning and its use.

For the given `word` (lowercase it, then capitalize the first letter), run the analysis below and deliver it directly in the conversation as Markdown.

### Output structure

#### 1. Title line

```
## {Word}  /{IPA}/  {one-line gloss}
```

#### 2. Core semantics

- **Original image**: one sentence describing the most physical picture at the word's root (e.g. Incubate: a hen sitting on her eggs).
- **Core image**: distil it into a formula (e.g. warmth + time + protection = incubation).
- **Explanation**: lay out the deep meaning and modern usage with real insight. Clear paragraphs, **bold** the key terms. It must cut through — show the inner connection between the etymology and the senses the word carries across different fields.

#### 3. The line that nails it

One aphorism that captures the soul of the word, with philosophical weight. Use a quote block:

```
> "English sentence that captures the word's soul."
```
