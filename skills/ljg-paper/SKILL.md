---
name: ljg-paper
description: "Explain research papers to readers without a specialist background: what the paper studies, what the authors contribute, how the findings follow, and what the evidence does not establish. USE WHEN the user shares an arXiv link, paper URL, PDF, local paper, or paper title, or asks to read, explain, analyze, or understand a paper. Defaults to a saved Org note. NOT FOR reproduction, formal peer review, benchmark tables, or literature surveys."
---

# ljg-paper: explain the paper so the reader sees how the conclusion was reached

Assume a reader with ordinary life experience and ordinary comprehension who does not know the paper's field, nor the objects, tools and working habits that field takes for granted. When the user specifies the reader's background, follow that instead.

Start from something the reader can understand directly: who did what under which conditions, why they ran into trouble, which link the authors changed, and how the result shifted. Introduce a technical name when it helps identify the paper's contribution; the reader should understand the thing before they are asked to remember its name.

By the end the reader can explain the paper's idea in plain language and also say what the authors actually studied and contributed. When an everyday case carries the explanation, map it explicitly onto the roles and relations in the paper, and keep hypothetical illustrations apart from real experiments.

The whole piece should develop around a clear question, letting the reader follow the observations, doubts and checks that show how the research happened. Concrete objects and actions keep carrying the explanation; as it deepens you may change the case or the scene, but say what the new one adds. The sense of being there comes from details that aid understanding, never from invented psychology or inflated conclusions.

When a key relation would otherwise have to be assembled in the reader's head, consider an ASCII diagram showing the flow of information, the before-and-after states, or the different dimensions, and then read the diagram through a concrete example. Whether to use a diagram, and how many, is decided by whether it reduces the reader's load - there is no fixed number of stories or figures.

## Workflow routing

| Input | Required reading | Output |
|---|---|---|
| arXiv, PDF, a paper link, a local paper | `ReadingGuide.md`, `references/template.org`, `references/paper-map.md` | one Org reading note and one paper-map research record |
| A paper title only | After finding a reliable source, read the same set of files | the Org note and the paper-map |
| An explicit request for a spoken explanation only | `ReadingGuide.md` | explain directly, save no file; still meet the three goals below |

The Org note is saved to `~/Context/` by default. The filename follows Denote: `{YYYYMMDDTHHMMSS}--paper-{method name or paper keyword}__paper.org`, with the timestamp from `date +%Y%m%dT%H%M%S`. When revising an existing note, keep the original file and identifier, check it against the source, and do not create a duplicate note.

## The three goals of a reading

- **Say what the paper did.** The reader can state the research question, the authors' main contribution, how the method or relation works, and the scope of the key evidence. By the end of the first two sections they should already know what the paper studies and what the authors did. A research question the paper cannot do without must be covered too.
- **Let the reader see why an earlier understanding needs correcting.** Start from a concrete problem, say how it is usually understood, then use the paper's evidence to show where that falls short, what the authors added, and how the judgment changed. The change may be a correction, an addition, a distinction or a narrowing of scope - no dramatic reversal need be manufactured.
- **Let the reader explain the results themselves.** If the paper offers a mechanism that explains several findings, the reader should be able to use it on at least two different findings and predict what happens when a relevant condition changes. Keep conclusions the paper validated apart from predictions made from the mechanism. Where the paper offers no unified explanation, say honestly how the findings relate and what remains open.

Check the three goals separately. Reading fluently, being accurate, and enabling the reader to explain results each have their own requirements and cannot substitute for one another.

## Where this goes wrong

- **A clear case does not mean a clear paper.** When the reader cannot state the research question or the main contribution, go back to the source and reorganize the explanation. Fixing sentences cannot supply missing content.
- **What is obvious inside the field may still be foreign outside it.** The examples themselves must match the reader's starting point. Swapping one set of jargon for another, or returning to a technical overview the moment the example ends, hands the translation work back to the reader; let concrete actions keep explaining the relations that follow.
- **Do not force one example to carry the whole paper.** When one case cannot cover every research question, change the example while keeping the link between question and explanation.
- **State the contribution concretely.** Write down what the authors' method, theory, benchmark, resource or system actually adds. Finding a difference in a benchmark is not the same as explaining its cause.
- **Keep the focus, and keep the important branches.** The paper-map records every necessary research thread and its evidence; the body explains how they jointly answer the paper's question, and never shrinks the whole paper into one central experiment.
- **Select evidence by what it tells us.** Explain the most representative result first. Additional results should add different information, limit the conclusion or explain an exception; do not divide space evenly by experiment count, and do not insist on one kind of result throughout.
- **Numbers need context.** Say what the experiment asked, what was held fixed, what it was compared against, and which judgment the result changed. Splitting numbers into short lines, or writing them all out in words, is not an explanation.
- **Sections may progress or sit side by side.** Reordering them is a check on whether the links are clear. Two independent experiments may be swapped, but say what each supports and why both are needed.
- **A checking tool can only check format and records.** It cannot prove the writing is understandable. The comprehension check is done in a fresh context by someone who did not write it; that evaluator reads only the final note and, following `ReadingGuide.md`, points out where they had to reread, needed background, or had to build the picture themselves. Where there are diagrams, check what the diagram says; being able to paraphrase is not proof of readability.

## Examples

**A method paper:** use a small task to show where the old approach gets stuck, then explain how the new method handles the input, which key steps it goes through, and what result it produces. The central experiment explains the comparison conditions and the difference in behaviour, and the ending says at which step the improvement happens and what remains unvalidated.

**A benchmark paper:** two systems score alike on the old metric, and the new benchmark finds a difference nothing had separated before. Explain what the new benchmark measures, what the representative comparison shows, and which judgments those differences support. Never write a measurement straight into a real-world causal claim.

## Saving and checking

The concrete writing method is in `ReadingGuide.md`. The body uses `references/template.org`, and the research and selection record uses `references/paper-map.md`. New records use format version 3; the validation script still accepts versions 1 and 2, and old records need not be rewritten in bulk for this upgrade.

After writing, run:

```sh
bun {skill_dir}/scripts/validate_note.ts /absolute/path/to/note.org \
  --map /absolute/path/to/paper-map.md
```

Read the identifier, the filename, the directory index, consult-notes and `org-lint` back in a real Emacs. Then complete the independent reading check per the guide, recording the four results: overall paraphrase, research question and contribution, change of understanding, and explanation of results. Once everything passes, rerun the script and confirm the final file agrees with the check record.

The validation script will accept a record whose reading-check results are not yet filled in, for diagnosis, but it returns a failure; never write PASS first and ask for the check afterwards. When the validator or the independent evaluation is unavailable, report clearly which part was not completed.
