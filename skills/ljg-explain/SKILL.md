---
name: ljg-explain
description: "Explains a concept, formula, mechanism or principle until the reader can recognize it, derive it and transfer it: plain English that connects the concrete situation, the discrimination criteria, the process, and the conditions under which it holds. USE WHEN the user invokes ljg-explain, says 'explain this in plain language', 'explain this concept or formula properly', 'Feynman explanation', 'ELI5', or wants to understand something from zero well enough to use it in a new situation. NOT FOR plain copy-editing or translation, reading a whole text alongside the user, summarizing an entire book or paper, or requests that only want a formal proof or a list of steps."
metadata:
  version: "1.0.2"
---

# ljg-explain: explain it until it is usable

The reader should follow it, recognize new examples on their own, explain how a result comes about, and know how to revise the judgment when conditions change. Treat those as the completion criteria; let the content decide the organization — do not mechanically turn them into five fixed sections.

Connect the knowledge through four questions: purpose, structure, case, justification. Purpose says what question it answers; structure says how the elements relate; the case makes the key relation visible; the justification says why it holds, where it works and where it stops. The four questions organize and check the explanation — they do not fix the output order or its headings. Whether the reader can *use* the knowledge is still judged by the understanding criteria below.

## Reader and delivery

- Start from whatever background, purpose and sticking point this request and the existing context already give you. When nothing is stated, explain for an adult with ordinary life experience and no specialist knowledge; if a prerequisite is missing, supply just enough of it.
- If the meaning can be reasonably determined, go ahead and explain. Only ask for clarification when different readings would change *what* you are explaining; never interrupt the explanation to fill in a background form.
- By default deliver the whole thing in one pass in the conversation and stop where the explanation naturally closes. Do not append self-tests or answer keys at the end. If the user explicitly wants interaction, split it into rounds.
- By default write no notes and no files. If the user asks you to save something, follow the requested format and location; use Markdown for ordinary chat, and Org syntax only for an Org deliverable.

## Understanding criteria

The explanation should let the reader do the following. The material may be interwoven into one narrative:

1. **Know why it is needed.** Go from a real confusion or concrete problem to the core definition: what kind of thing it is, what it helps tell apart, what judgment it supports. "Use" also includes explaining a phenomenon or understanding a work. Keep that question running through the structure and justification that follow; introduce the concept early and keep only the background understanding actually requires.
2. **Recognize it.** Give both a typical example and a near-miss contrast, each with its discrimination criteria: which features decide the classification, and which are only surface resemblance. Prefer examples that differ by very little yet get judged differently. When a single-variable contrast is impossible, say so honestly rather than inventing a fake counterexample.
3. **Explain the result.** Lay out the key elements, how they relate and what each one does, so the reader sees them jointly answer the original question. For a mechanism, give the causal process; for a mathematical relation, give the definitions, the logic and the quantitative relation; for an empirical regularity, give the evidence and the conditions. For a method or a tool, also say how its structure serves its purpose and what it costs. Where an alternative arrangement aids understanding, compare what it would change and why the current choice was made; do not enumerate every option, and do not present one workable construction as the only possible one.
4. **Revise the judgment when conditions change.** Change one key condition inside the original situation, state how the rest is held fixed, and say how the result shifts and when the original judgment fails. The change may flip the conclusion, or only move its magnitude or confidence.
5. **Transfer it.** Use one new situation that looks different on the surface to show how the same key relation is recognized, with the discrimination criteria and the necessary conditions.

Where possible, let a single object or situation carry the definition, the mechanism and the change of conditions, so the reader is not forced to rebuild the scene over and over. New situations are for showing transfer. Literary, narrative and aesthetic material keeps its own meaning — do not force it into a law or an exercise.

When the internal structure is hard to grasp, remove or replace one key part within the same case, say how the other relations hold or shift with it, and point out which capabilities break and which still hold; do not assume that losing one part breaks everything. This test serves understanding of the structure — it does not require an extra example every time.

## Formulas and principles

- Map the symbols to concrete objects, quantities and units; say what the formula takes in and what it computes. Where the distinction is itself the point, be explicit: which way a conditional probability is conditioned, total versus average, stock versus change.
- Say why the operations combine the way they do: why multiply, divide, take a maximum, square or sum, and connect it back to what is being described or solved. Distinguish choices made inside a definition from derivations under given premises; when the same goal allows different constructions, state the properties and trade-offs of the one you are using. Expand only the load-bearing steps of a derivation, enough for the reader to follow; bring the premises, valid ranges and approximation conditions in alongside the formula.
- Run it once with simple numbers, and separate the quantity the formula computes directly from the judgment the user actually cares about. Check that the expression matches the question: whether the observation is an ordered sequence or only a count, whether you are computing an actual probability or a quantity proportional to one. Where it matters, recompute with a calculation tool and check units, ratios, signs and rounding.
- Change one variable within the same situation and show the effect; state which objects, times and conditions the formula applies to, and avoid generalizing a special case to everything.

## Writing

- Land the first sentence on the core judgment or on the confusion the reader actually has. Cut the throat-clearing, the generic background and any commentary on your own writing process.
- Use short familiar words and visible objects. When a technical term has to appear, first land its meaning in a concrete situation, then give the name; keep the terms and formulas accurate understanding requires rather than chasing a cosmetic "zero jargon".
- One main idea per sentence; vary sentence length; let paragraphs move forward along the reader's questions. Build the bridge from one sentence to the next, and cut repeated explanations, softening lead-ins and empty adjectives.
- Keep natural connectives ("so", "but") and drop mechanical ones. Organize with direct statements instead of leaning on the rhetorical "it is not X, it is Y" to deliver conclusions.
- Trust the reader: say it well once. Before delivering, test it against "would I say this to a smart friend?" and fix anything that stumbles, waffles, or collocates badly.
- Use an analogy only when the key relation genuinely corresponds; state the correspondence and where it breaks. A real example, a teaching assumption and an analogy are three different things — never let an analogy stand in for a fact or a proof.

## Evidence and formatting

- Use the sources and context the user gives. When verification, recency, high stakes or an uncertain key fact are involved, follow this environment's search requirements and check primary material first. Keep facts, inferences, simplified models and unknowns clearly apart, and leave the gaps visible.
- State the assumptions of any invented teaching example explicitly; cite the source for real data. Examples make a relation visible — they cannot carry empirical weight they do not have.
- Carry reasoning in connected prose; use lists for parallel items or steps, tables for comparisons. Add a relation diagram or a visualization only when it clearly reduces the reader's load, never to fill out the format.
- Let content and length decide the headings; avoid stamping the same backstage labels ("typical example, mechanism, boundary, transfer") onto every output. Keep your checking process internal — deliver the explanation itself, not a line-by-line revision log.

## Gotchas

- Fluency and paraphrase do not prove understanding. Check whether the explanation gives the discrimination criteria in a new situation, the derivation of the result and the effect of changed conditions. Passing your own review does not entitle you to claim the reader has learned it, or to grade your own explanation "90 out of 100".
- "Purpose" belongs to the question the knowledge answers or to a person's intent in using it; a theory's usefulness is not a goal held by a natural process. Explaining why a structure works is also not proof that it exists or was created for that reason; causation, historical origin and effect each need their own evidence — never write correlation as causation or invent a story for a formula.
- Every number must be readable as one unambiguous sentence. For quantities that are easily confused — likelihood versus posterior probability, exercise value versus trading profit — show inside the same example what question each one answers.
- Any difference in outcome between contrasted cases must be explained by the conditions you gave. Do not withhold important information and manufacture the knowledge gap through a surprise reveal.
- When simplifying, keep the conditions that determine the conclusion; the story the reader sees must connect back to the original concept, so they do not walk away remembering only the metaphor.
- This skill is self-contained: finish the explanation here. Do not automatically call another explanation skill, and do not create notes, cards, reminders or other artifacts because of an explanation task.

## Examples

- "Explain likelihood": hold one dataset fixed and compare hypotheses; make clear what it answers versus what a posterior probability answers; give the conditions and a new situation. Limited data is not confirmation of a hypothesis.
- "Explain the variance formula": connect each operation back to how spread out the data is, explain with numbers and changed conditions; show that avoiding cancellation of positives and negatives does not by itself force squaring, say what squaring emphasizes about large deviations, and distinguish the formulas that correspond to different estimation targets.
- "Explain positive feedback": trace a feedback loop out of one concrete process, separate the direction of the loop from whether its effect is good or bad, give the conditions for amplification and its limits, then transfer it to another situation.
