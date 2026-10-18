---
name: ljg-structure
description: Finds the motif-level structure inside a piece of information, unfolds the abstract relations back into visible concrete phenomena, then uses a wind tunnel to test the key causal links and boundaries. USE WHEN user says 'find the structure', 'what is the motif', 'structure wind tunnel', 'the structure behind this', 'do not just A/B test it', or wants the generative mechanism beneath a problem. Unfold cross-domain sources or combinations of several motifs only when the user explicitly asks. NOT FOR ordinary summaries, a single analogy, factual lookups, or execution questions that already have one clear answer.
user_invocable: true
---

# Motif structure wind tunnel

Take a piece of information, cut through the surface to the motif it keeps replaying, draw the few structures that actually do the work, and run them through the wind tunnel for calibration. The default result stays light: the reader leaves with one motif they can state, one relation diagram they can run, and one conclusion that both transfers and can be overturned.

## Four concepts that must not blur

- **Topic**: the object the information is about — "team discussion", "AI attention". It only marks off the semantic range.
- **Motif**: the same fundamental difficulty that recurs across different fields. It is not the original question swapped for a bigger abstract word; it keeps the transferable relation in plainer language.
- **Analogy**: two cases that look alike — "a team is like a jury". It is only a way in.
- **Structure**: the causal skeleton that still holds after the domain nouns are deleted. It says which relation generates which result.

In one line: the topic is the name, the motif is the difficulty, the analogy is the clue, the structure is the causal machine.

## Understanding contract

Structural analysis is not about making the reader memorize abstract nouns; it is about letting them run the relations in their head. A finished reading must achieve:

- **Clear concepts**: every load-bearing concept can be stated in plain words — "what it refers to here" — with one visible marker.
- **Clear relations**: the reader can restate "under which conditions, who affects whom how, which change appears first, and what the final result is".
- **Examples that carry the relation**: the example does not merely feel similar; its roles, direction of effect and outcome all map onto the abstract relation.
- **Judgeable boundaries**: when a condition changes, the reader can predict how the relation shifts, and knows which observation would force them to revise the judgment.

The case makes the model run; it does not prove the model generally true. The wind tunnel changes conditions internally, looks for the boundary and calibrates the judgment, and only the informative results of that pressure test reach the conclusion.

### How the wind tunnel enters the conclusion

- **The wind tunnel is an internal method**: keep the same example, change one key condition, watch how the prediction shifts, and find when the model fails and what signal would change your mind. It is no longer a visible section of its own.
- **The conclusion is the calibrated deliverable**: first show the key difference the changed condition makes in the same example, giving the reader a concrete handle; then compress that difference into one transferable abstract rule, and return to the original phenomenon to say what should now be visible.

The full wind-tunnel reasoning stays internal; the conclusion carries out only the condition change, boundary or change-of-mind signal that best discriminates between models. Those must build on the abstract rule rather than restating the same causal chain twice.

## Where this applies

Good for: the mechanism of the problem is unclear, ready-made solutions are thin, several phenomena pull on each other, or the exploration needs to go beyond ordinary A/B testing.

Not for: pure factual lookups, execution questions with one definite step, or input with no identifiable difficulty in it. In high-stakes domains such as medicine, law and safety, structure can generate hypotheses, but an analogy must never substitute for evidence from that field.

## Workflow routing

| Workflow | Trigger | File |
|---|---|---|
| **FindStructure** | Find the motif, structural relations and wind-tunnel experiments inside the information | `Workflows/FindStructure.md` |

## Gotchas

- "Team communication" and "AI cognition" are still topics; "how to do it better" is so wide it constrains nothing. A motif must preserve a real relation or tension.
- A motif is not a more abstract headline. If a motif sentence still contains two or more load-bearing words that cannot be explained in plain language, decode them before outputting.
- Put only one minimal example under the motif, to run the relation for the first time; do not unfold a list of cross-domain cases.
- By default use a single example anchor running through the whole piece. The structure cards point back to specific moments in it, the relation diagram ties it together, and the wind tunnel changes its conditions; do not retell the same story in four places.
- "It is like the immune system", "run it double-blind" are only source names or solution names. Only when the causation still holds with the source name removed is it a structure.
- Cross-domain search is internal craft, not a default section. Laying out three fields item by item usually buries the real motif.
- Keep one or two structure cards by default; a third has to prove it cannot be merged into the first two. Each card must achieve clear concepts, clear relations and an example mapping — without being forced into three visible fields.
- Examples must map roles and causation. Saying "this is like X" creates familiarity, not clarity about the relation.
- When there are several structures, decide first whether they are in series, in parallel, nested, balancing each other, or feeding back, and only then draw the diagram; do not line up every multi-structure case as a chain.
- No Cartesian products, no counting combinations by default. With several motifs, still look for the structural relation first; expand combinations only when the user explicitly asks.
- The wind tunnel is a method, not a section. It fixes the baseline prediction, changes one condition, compares which difference appears first, and ends with the boundary of application and the rule for updating the judgment; only the single most illuminating pressure test survives into the text.
- The conclusion is not a summary of the whole piece. It runs "concrete pressure test -> abstract rule -> back to the phenomenon", so the example gives a handle and the abstract relation gains transfer power.
- The concrete pressure test and the abstract rule must build on each other: the first answers "what happens when the condition changes", the second answers "which more general relation does that show". If the two paragraphs only reword each other, delete the weaker one.
- The minimal reversible experiment is only for action questions. A conceptual reading gives a discrimination test by default; do not convert every intellectual question into an action recommendation.
- A conceptual model must not dodge counterexamples by narrowing its boundary after the fact. State the conditions of application and the distinguishing prediction first; a case outside the boundary only draws the boundary, it neither supports nor refutes.
- The wind tunnel introduces no new vocabulary. If explaining a pressure-test result requires inventing a new concept, go back to the structure card and decode again.
- State the evidence boundary once, at the end. Do not insert repeated warnings into every structure card and break the reasoning.
- When a fact is uncertain, keep it in the internal candidate layer; if it has to be output, mark it clearly as unverified, and never treat a half-remembered story as fact.

## Output requirements

Default length roughly 600-1100 words. The only top-level headings allowed are: `Input`, `Motif`, `Structure`, `Conclusion`. The wind tunnel is an internal reasoning step and is never a top-level heading. The motif uses one question plus one example to get the relation running; structure cards do clear concepts, clear relations and the example mapping in natural short paragraphs, with no mandatory visible fields. Cross-domain sources get no default heading; usually they are not output at all, and when genuinely helpful they take one sentence with one example. When there is more than one structure, draw the relation diagram with pure ASCII connectors — no Unicode arrows or box-drawing characters. After the diagram, one plain sentence on "how this diagram runs in the example".

By default get two time values: `date +%Y%m%dT%H%M%S` and `date "+%Y-%m-%d %a %H:%M"`. Write to:

`~/Context/{timestamp}--structure-{topic}__structure.org`

If the user explicitly says "analysis only", "do not write a file", or `read-only`, deliver an equally complete analysis in the conversation and create no file.

The file must be org-mode, no Markdown. Minimal structure:

```org
#+title: Structure: {topic}
#+date: [{human-readable time}]
#+identifier: {timestamp}
#+filetags: :structure:

* Input
* Motif
* Structure
* Conclusion
```

Close the conclusion in two natural paragraphs. The first returns to the same example anchor, changes exactly one key condition, and writes the first difference to appear plus the result that would force the model to change its mind. The second abstracts a transferable relation from that difference, answers the motif directly, and points back at the original phenomenon to say how it should now be understood. The evidence boundary appears exactly once at the end, separating illustrative cases, structural reasoning, existing support in the field, and what still needs an experiment. After saving, read the file back and report the path.

## Examples

**Example 1: the first speaker locks the team**

```text
User: "Why does team discussion always get pulled off course by whoever speaks first? Find the structure."
-> the motif, asked in plain words: why does information that appears earlier become the reference point for later judgments?
-> run the relation once with a single line from the meeting
-> the structure card says what "reference point" means here and how it affects latecomers, with a concrete example
-> internally, the wind tunnel changes the speaking order or the source of information and compares how the prediction shifts
-> the conclusion gives the concrete difference under the changed condition first, then abstracts "information that arrives first captures the right to interpret"
```

**Example 2: AI depth versus anomaly detection**

```text
User: "This AI is great at drilling into a local area but keeps missing the anomaly that changes the whole picture. Analyze it with the structure wind tunnel."
-> motif: how does limited attention balance local exploitation against exploration of the unknown
-> extract the skeleton relating deep local work to patrolling the periphery
-> internally, use the wind tunnel to find the minimal anomaly-escalation experiment and fold the pressure-test result into the conclusion
```

**Example 3: the user explicitly asks for the expansion**

```text
User: "Give me the cross-domain sources for this motif and analyze how three motifs combine."
-> only now unfold sources or handle multiple motifs
-> still decide first whether the structures are in series, in parallel, nested, balancing or feeding back, then draw the diagram
-> compute the combination space only if the user keeps asking for the combinatorics
```
