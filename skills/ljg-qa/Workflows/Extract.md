# Extract Workflow

Turn a piece of material into a Q-A chain.

## Voice Notification

```bash
curl -s -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Running Extract in ljg-qa"}' \
  > /dev/null 2>&1 &
```

Output text: `Running **Extract** in **ljg-qa**...`

## Step 1: Get the content

Route by input type:

| Input | Tool | Notes |
|-------|------|-------|
| URL (ordinary web page) | WebFetch | use a markdown proxy for pages behind a login |
| arXiv link | WebFetch (HTML version) | take the abstract + method + experiments |
| PDF / local file | Read | for a large PDF, read in chunks with the pages parameter |
| Raw text | skip | go straight to Step 2 |
| Paper or book title | WebSearch | get the URL, then WebFetch |

Make sure you have: the core claim / the argument chain / the key examples / the discussion of limits.

## Step 2: Find the argument skeleton

After reading, sit in silence for 30 seconds and answer one question:

> What is the core claim of this piece? How does it hold that claim up? Which few steps are the real turning points?

Write down:

- *Core claim*: one sentence
- *3-5 key turns*: one sentence each

This is the spine of the Q chain. If the spine will not stand, every Q below it floats — go back and reread.

## Step 3: Design the Q chain

Each key turn grows one Q or a cluster of Qs. A Q must satisfy:

1. A one-line definition cannot answer it — it cuts to the crux
2. Its answer can be grounded in the source material
3. It inherits from the previous Q (Q2 is what surfaces once Q1 is answered)

The four Q kinds (action / contrast / cause / boundary) and their patterns are in `../References/QuestionDesign.md`. A good Q chain mixes at least three kinds.

*Ordering rule*: by argument dependency, not by chapter order. The original puts background before method because narrative demands it, but the Q chain should run "root question first, then the solution, then the cost".

*Count*: 5-10 Qs. Fewer leaves gaps; more tires the reader.

## Step 4: Write the A

Every A keeps the four parts, in order, none omitted:

```
*Conclusion*: (one sentence — it must survive being copied out of context)

*Formalization*: (words plus simple symbols compressing the idea into one visible relation — see "How to write the formalization" below)

*How we got there*:
- step 1 (short line, exactly one step of reasoning)
- step 2
- step 3

*Boundary*: (under what conditions this conclusion stops holding / what the argument does not cover)
```

Hard requirements:

- *Conclusion*: still works copied out of context. The reader sends it to a friend and the friend gets it
- *Formalization*: words plus simple symbols (-> = != + x etc.) compressing the idea into one visible relation — "the geometry of the idea", not "a mathematical formula". The reader should see the correspondence at a glance. Details in "How to write the formalization" in `../References/QuestionDesign.md`
- *Reasoning steps*: one step per line, each opening the door to the next
- *Boundary*: write the "condition under which it fails", not "future work" — the first is honesty, the second is PR

### How to write the formalization (essentials)

Four common patterns:

- *Equation*: `generalist = coordinator; specialist = doer`
- *Contrast*: `old: big model = full stack; new: big model = coordinator`
- *Flow*: `data -> tokens -> answer = loss + waste`
- *Descent*: `call -> interface -> bilingual hotline`

ASCII and plain words only. No LaTeX, no elaborate mathematical notation. It has to fit on one line.

## Step 5: Check the chain has direction

Read the Q order straight through:

- *Inheritance*: once Q1 is answered, does Q2 surface naturally?
- *Dependency*: delete Q3 — does Q4 still stand?

If the Qs are parallel (deleting one changes nothing), reorder or merge them. The Q chain is a path, not a checklist.

You can sketch it out (scaffolding for yourself, it does not go into the org file):

```
Q1 -+-> Q2
    +-> Q3
Q2 ---> Q4
Q4 ---> Q5 (the closing counter-question)
```

## Step 6: Red lines

Scan line by line:

- [ ] No Q can be disposed of by a one-line definition
- [ ] Every A has all four parts (conclusion / formalization / steps / boundary)
- [ ] The formalization shows the relation at a glance — not a maths formula, not a pile of jargon
- [ ] The Q chain has direction (it is not a parallel list)
- [ ] No "what is X" Qs
- [ ] Qs are 15 words or fewer (scannable at a glance)
- [ ] No academic voice ("it is worth noting that", "in summary", "in the context of...")
- [ ] No A hides behind jargon — every term is translated into a concrete action or object
- [ ] 5-10 Qs

Any line that fails, go back and fix it.

## Step 7: Write the file

Get the timestamps:

```bash
date +%Y%m%dT%H%M%S         # -> identifier
date "+%Y-%m-%d %a %H:%M"   # -> the date field
```

Denote-schema filename: `{YYYYMMDDTHHMMSS}--qa-{topic}__qa.org`

- `qa-` prefix: marks the Q-A type (parallel to ljg-paper's `paper-`)
- topic: the core claim distilled to 3-6 words, no punctuation. Prefer the method name, concept name, or the keyword of the central line
- `__qa` suffix: keyword tag, so denote can find it

Output path: `~/Documents/notes/`

Report the path to the user after writing.

## File structure

```org
#+title:      {the core claim in one tight line — 8-18 words}
#+subtitle:   {original title}
#+date:       [{YYYY-MM-DD Day HH:MM}]
#+filetags:   :qa:
#+identifier: {YYYYMMDDTHHMMSS}
#+source:     {URL or source}

* Opening

(one paragraph, 3-5 sentences: what this piece is about and why it is worth questioning. Land the reader somewhere concrete; this is not a survey)

* Q1: {one sharp question, 15 words or fewer}

  *Conclusion*: ...

  *Formalization*: ... (e.g. `A = B + C` / `old: X -> new: Y`)

  *How we got there*:
  - ...
  - ...
  - ...

  *Boundary*: ...

* Q2: ...

  ...

* Closing

(one sentence that pins down the whole chain: what the author actually contributed. Not a summary — a naming)
```

Notes:

- Bold with `*bold*` (org-mode), not `**bold**` (markdown)
- Lists use `- item`, not `* item` (`*` starts a heading in org)
- Separate with blank lines or heading levels, not `---`
- Code uses `~code~` or `=code=`, not backticks

## Acceptance

- *The Q cuts to the crux*: no Q can be disposed of by a one-line definition
- *The A closes with a formalization*: all four parts present — the conclusion survives being copied, the formalization shows the relation at a glance
- *The chain has direction*: delete one Q and the rest collapses
- *No paraphrase of the source*: this is skeleton reconstruction, not paragraph rewriting
- *Natural English*: read each sentence back — verb-driven, no jargon piles, no academic voice
