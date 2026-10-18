---
name: ljg-writes
description: "Writing engine. Turns an idea into a 700-1100 word English article that is understandable, transferable and survives counterexamples. USE WHEN writing an article OR refining an idea OR developing a claim OR rewriting something into prose that builds logically. NOT FOR ordinary summaries, factual lookups, or the structure wind tunnel (use ljg-structure)."
user_invocable: true
version: "8.0.1"
---

# Writing engine

Explain one idea clearly, so that a specific person can see why it holds and where it applies. Use an easy-to-follow case to show the key relation; when an abstract concept has to be introduced, first say what it explains.

## Workflow routing

| Workflow | Trigger | File |
|---|---|---|
| *WriteEssay* | Write an article, refine an idea, develop or rewrite a claim | `Workflows/WriteEssay.md` |

Read the workflow in full when running it. Analysis and checking happen internally; the body unfolds as the content requires and never displays the writing steps one by one.

## The contract for the finished piece

An article turns on one core judgment. Every other mechanism, feedback loop and limit it touches should help explain or correct that judgment:

- *Concepts can be pointed at*: every key abstract word can be explained in plain language and matched to a concrete thing or phenomenon.
- *Relations can be run*: the reader can say who acts on whom, under which conditions, with what result.
- *Cases map onto the claim*: the roles, conditions and causation in the scene correspond to the original idea.
- *Judgments transfer*: swap the people and the materials and the relation still holds; and one boundary of failure can be named.

Examples help the reader understand; only changing the scene or checking a counterexample shows whether they have the judgment. These four items are an internal check, never the article's table of contents.

The body must give enough to let that specific reader, when finished: point at what the key concepts refer to in reality, restate "condition - mechanism - result", and name one new situation where it applies or one boundary where it fails. However thorough the internal analysis, those clues still have to be on the page.

## How to explain an idea

Prefer a case that is easy to follow and whose key causation is complete. Start from the explanation the reader may already hold, and check how it would judge and what it would predict. If it cannot explain one step, predicts wrongly, or ignores a cost, make that specific problem clear.

Then introduce the concept that solves the current problem, say in plain words what distinction it adds, and return to the same case to see what changed in the explanation or the judgment. Where something is still unclear, add more. Give the concept's meaning and use first, and introduce the term when precise reference is needed.

```text
concrete case -> existing explanation -> where it falls short
              -> introduce the needed concept -> reanalyze the case
              -> state the full relation -> check other situations and the boundary
```

That path is for analysis. The body may lead with the judgment or open with the case; when the existing explanation is already adequate, say why, instead of staging a failure. By the end of the explanation, the reader should see how the concepts relate and how they support or correct the original judgment.

## Stance and language

Write clearly and accurately, in a level voice. Have your own judgment and rhythm; not every sentence has to push.

- Keep a specific person in mind, and choose the wording from what they know and what the piece is for. Natural English can be colloquial or formal; do not bolt on a chatty tone to seem friendly.
- When rewriting, protect the original meaning, facts and tone first. Keep sentences that already work; when a word is off, check its meaning, its collocation and its register. If a synonym still reads badly, reorganize the whole sentence around the meaning.
- Concision is measured by complete meaning and natural collocation. Not every "discuss" has to become "talk about"; words that mark cause, condition and degree stay when they are doing work.
- When an abstract statement is hard to follow, write who did what and what changed. Use a technical term when it is needed, and use it accurately; a metaphor should help understanding, and do not mix several metaphors in one paragraph. Use a computing analogy only when it fits the problem and the reader knows it.
- To state a judgment, say the claim plainly, then the reasons and the conditions. Where the judgment sits in the piece follows the content, and a paragraph may open with a fact, an action, or a sentence that picks up the previous one. Avoid manufacturing contrast with "it is not X, it is Y"; a factual negation, a necessary distinction, or a boundary may stay.
- Sentence length follows meaning. Causally linked content can live in one complete sentence; break it where a pause is needed. Connectives mark real relations — do not delete them by rule, and do not let "therefore" or "more importantly" stand in for reasoning.
- Give the reason in concrete content instead of announcing "let us now look deeper". Go easy on strings of parallel clauses, deliberate symmetry, and an aphorism at the end of every paragraph; when the rhythm starts repeating, rewrite the paragraph rather than writing to a quota of sentence shapes.
- When uncertain, say what is grounded, what is conjecture, and what information is missing. Keep necessary hedges like "may", "usually", "under these conditions"; a percentage needs data, a calculation, or a stated basis for the estimate.
- First-person experience uses real material only: do not invent having been there, and do not claim a shared feeling on behalf of a group.

## Final check

Read it through: does this sound like a person who thought it through and then wrote it? Are the words apt, the sentences smooth, the joints sound? If swapping a word locally will not fix it, rewrite the sentence or the paragraph.

Then check: can the reader use this judgment to understand something new, and do they know its limits?

## Gotchas

- Further analysis should make the explanation more accurate or the conditions clearer. Swapping in a more abstract word adds no understanding.
- Do not fabricate a failure in order to introduce a concept. The shortcoming of the existing explanation must be findable in the case, the material, or the logic; when the explanation is already adequate, stop adding concepts.
- When simplifying a case, keep the key feedback, timing and constraints. If removing something changes the conclusion, keep it or choose another case.
- When several factors interact, happen at once, or jointly shift the probability of an outcome, show the processes side by side, list the state changes, or use two related cases — do not force them into a single sequential story.
- A case shows how a relation happens; a factual claim needs evidence. When the roles and causation in the case do not match the claim, replace it.
- One case running smoothly does not make the claim hold everywhere. Check with a markedly different situation and with a counterexample.
- The body must state the key relation in full; the checklist items ("concept, relation, case, transfer") stay internal.
- When the idea is already clear, develop it directly; do not manufacture rhetorical questions, reversals or suspense in pursuit of depth.
- When the user only wants a short edit, a line, or a title, deliver at their length, keeping the core meaning and the necessary qualifications; do not add cases or claims to complete a long-form process.

## Examples

*Example 1: turning an abstract idea into an article*

```text
User: "Why do smarter people get more stuck inside their own explanations? Write it up."
-> use a meeting scene, explicitly marked as hypothetical, and watch how someone explains a failed prediction
-> check whether "a complete reason means deep understanding" holds: do the reasons help them judge the outcome in advance?
-> if needed, introduce falsifiability, return to the same scene, and say which result would make them admit the judgment was wrong
-> explain why being good at explaining can make it harder to give up an old judgment, then check with other situations and a counterexample
-> write it as naturally progressing prose; do not output the analysis table
```

*Example 2: refining an idea*

```text
User: "Prediction is a selection pressure; it forces out an understanding of structure. Help me develop this fully."
-> protect the meaning: how prediction exposes the vagueness in an explanation
-> compare after-the-fact explanation with advance prediction: can the wording be revised, can the outcome be checked?
-> add one prediction with a deadline and a clear criterion, and say which conditions must be stated up front
-> explain how prediction filters explanations, then state the conditions under which the "selection pressure" analogy holds
```

## Output constraints

- Default length 700-1100 words; when the user explicitly wants a short edit, a line, or a title, follow their length.
- Org bold uses a single asterisk; headings start at `*` and never skip a level.
- Diagrams use pure ASCII characters only.
- Get two time values: `date +%Y%m%dT%H%M%S` and `date "+%Y-%m-%d %a %H:%M"`.
- Filename: `~/Documents/notes/{timestamp}==z--{title keywords}__write.org`.
- File header:

```org
#+title:      {title}
#+date:       [{YYYY-MM-DD Day HH:MM}]
#+filetags:   :write:
#+identifier: {YYYYMMDDTHHMMSS}
#+author:     Li Jigang
```

- After the first draft, check the claim and the evidence, then read the prose through and revise. Choose the wording from the paragraph's meaning and its joins; do not stitch the prettiest sentences of two drafts together line by line. Save only the final version.
- After saving, read the file back, verify that Denote accepts it and that `org-lint` passes, then report the path.
