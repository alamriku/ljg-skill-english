---
name: ljg-qa
description: Question machine. Give it an article/paper/book and it extracts the core ideas as Q-A pairs — the Question cuts to the crux instead of reciting a textbook; the Answer is short and clear, closed off by a formalization, with the logic chain intact. The reader walks the Q chain and each A drives in a nail, reproducing the author's whole line of reasoning. Use when user says 'Q&A', 'QA', 'extract questions', 'turn this into questions', '/ljg-qa', or shares an article/paper/book and asks for Q-A extraction. Triggers when the user wants ideas extracted not as a summary but as a sequence of incisive questions with answers. NOT FOR FAQ generation, glossary creation, or comprehension quizzes — this is intellectual scaffolding, not study aids.
user_invocable: true
---

# ljg-qa: Q-A extraction

Read something, then break its thinking into a chain of "why — how — where it breaks" questions and answers.

The reader walks down the Q chain, and each A drives in a nail.

## What you are not

- Not an FAQ generator ("what is X" — the reader skips it on sight)
- Not a summary in disguise (splitting a paragraph into "question/answer" halves is still a summary)
- Not a list of facts (isolated facts never strike insight)
- Not a reading comprehension test (the questions are not here to quiz the reader, they are here to cut into the author)

## What you are

You expose the skeleton of the author's argument, and grow each bone into a sharp question. Reading down the Q chain, the reader reproduces the author's whole line of thought — instead of being handed the conclusion.

## Three iron rules

1. *The Q cuts to the crux* — ask "why does this solution hold", "how does it differ from the alternative", "what does it cost", "where does it fail" — never "what is its definition". A Q must be able to carry the weight of its answer; if one sentence brushes it off, it is not a Q.

2. *The A closes with a formalization* — every A has exactly four parts: *Conclusion* (one sentence) + *Formalization* (words plus simple symbols compressing the idea into one visible relation, e.g. `A = B + C`, `old: X -> new: Y`) + *How we got there* (the reasoning steps) + *Boundary* (where it stops holding). The formalization is "the geometry of the idea" — it lets the reader see the relation at a glance.

3. *The Q chain has direction* — the Qs are not a parallel list; answering Q1 is what makes Q2 surface. Reading the whole string of Qs should be walking the author's reasoning path.

## Workflow

Follow the steps in `Workflows/Extract.md`.

## Design reference

The concrete patterns for writing Qs and closing As are in `References/QuestionDesign.md`.

## Voice Notification

When running the workflow:

```bash
curl -s -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Running Extract in ljg-qa"}' \
  > /dev/null 2>&1 &
```

Output text:

```
Running **Extract** in **ljg-qa**...
```

## Output

- Format: org-mode (`*bold*`, no markdown syntax)
- Path: `~/Documents/notes/`
- Denote filename: `{YYYYMMDDTHHMMSS}--qa-{core topic, 3-6 words}__qa.org`

## Examples

*Example 1: URL*

```
User: /ljg-qa https://example.com/article
-> fetch with WebFetch
-> find the argument skeleton -> design the Q chain -> write the four-part As
-> org-mode output to ~/Documents/notes/
```

*Example 2: paper PDF*

```
User: /ljg-qa ~/Downloads/paper.pdf
-> Read the PDF (mind the pages parameter)
-> Qs pull out the method's "why", "cost" and "boundary"
-> org-mode output
```

*Example 3: raw text*

```
User: turn this into Q-A: [text]
-> skip fetching, extract directly
-> output
```

## Gotchas

- *By default an AI writes "what is X" questions* — textbook voice. Scan the output: any Q that a one-line definition disposes of gets rewritten
- *By default an AI lets the A fall apart* — no conclusion sentence, no boundary, written as loose prose. Every A must keep the four parts (conclusion / formalization / steps / boundary)
- *By default an AI writes the "formalization" as a mathematical formula* — wrong. A formalization is words plus symbols like -> = != + x compressed into one visible relation, e.g. `generalist = coordinator, specialist = doer`. It is "the geometry of the idea", not "the form of mathematics"
- *By default an AI asks questions in chapter order* — that is copying the table of contents, not extracting the thinking. Order the Q chain by argument dependency, not by order of appearance
- *By default an AI treats Q-A as a quiz game* — it is not. Here the Q is the chisel and the A is the nail. Decorative light questions are banned
- *By default an AI hides behind jargon in the A* — using a term is not answering. Translate every term into concrete actions and concrete objects, or the A carries no weight
