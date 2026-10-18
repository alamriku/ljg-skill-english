---
name: ljg-mechanism
description: For a phenomenon the user brings, generates a mechanism hypothesis through "spot the anomaly - trace the process - separate the explanations - transfer with conditions", then checks the phenomenon, the key causal links and the competing explanations against online sources, and delivers the mechanism the evidence best supports along with its boundary. USE WHEN the user invokes ljg-mechanism, says 'find the mechanism', 'mechanism research', 'walk this through the four-step framework', 'verify this explanation against sources', or wants to study how a phenomenon comes about. NOT FOR pure definitions, ordinary summaries, procedural questions with a single known answer, or drawing a map only.
metadata:
  version: "1.0.0"
---

# ljg-mechanism - Mechanism research

Find the relations that actually do the work in the phenomenon in front of you. Once you have an explanation, put it and its competitors through a reality check; revise the objects, the relations or the conditions according to the evidence, and give the most solid mechanism judgment currently available.

"Solid" means the key relations have checkable grounds, can separate the competing explanations, imply new observations, and leave a door open for revising themselves. Being complete, fluent, or heavily cited does not meet that standard. When public evidence is insufficient, deliver the leading hypothesis and the specific gaps.

## Workflow routing

| Request | What to do |
|---|---|
| A phenomenon is given, with a wish to explain how it comes about and verify it | Read [Workflows/DiscoverMechanism.md](Workflows/DiscoverMechanism.md) |
| A wish to see it demonstrated, learn it, or "walk through it" | Use the same research framework and unfold all four stages and the shifts in judgment in the deliverable |
| New facts, a counterexample, or a change of scope | Return to the affected observation or causal link and update the judgment; do not replay the unaffected parts |

## Research conventions

- The original phenomenon also needs checking. Keep the observation that has value, and pin down the object, the metric, the comparison baseline and the time window; generalizations like "everyone", "more and more", "it has no effect" cannot be taken as universal facts.
- A mechanism says "who or what, under which conditions, through which intermediate changes, produces which result". Names like "supply and demand", "incentives", "culture", "the system" must be unfolded into an observable process.
- Keep the competing explanations that could account for the same thing, and write down the different observations each would produce. A different direction, a different timing, or a different set of people affected can all make a distinguishing prediction.
- By default use whatever web search and page-fetching capability is available to check both the phenomenon and the mechanism. Keep what the sources actually support separate from your own inference, teaching hypotheticals and unknowns.
- New material may overturn, rewrite or narrow the mechanism. A counterexample that appears after the claim cannot be dissolved by piling on exceptions; say why the original prediction failed and what different result the new relation implies.

## Deliverable

By default, deliver directly in the conversation. Lead with the mechanism judgment and the strength of the evidence, then explain the process through concrete objects, showing the competing explanations, the evidence and the boundaries most likely to change the judgment. The four steps are a research framework; they do not require printing every search or every thought.

Where a key causal claim is involved, put the source link next to that judgment and say whether the source actually supports the phenomenon, one link of the mechanism, or the causal relation. The body should let the reader see: what you currently believe, why, which observation would make you change your mind, and which conditions must be preserved to carry it to a different setting.

When the user asks for a full demonstration, unfold it as "spot the anomaly / trace the process / separate the explanations / transfer with conditions". Use a short table where a comparison genuinely helps, and a simple diagram where a load-bearing relation is hard to see otherwise; do not bolt a diagram, a formula, or a fixed number of hypotheses onto every simple question.

Research is read-only by default: do not create notes, report files, logs, rules or memories automatically. If the user asks for it to be saved, follow the location and format they specify. When the network is unavailable or the user asks you to stay offline, say that only reasoning was done and never claim it was verified online.

## Gotchas

- An anomaly includes both "the expected condition is absent yet the result appears" and "the condition is present yet the expected result does not appear". An ordinary phenomenon can also become a research object by re-asking how it comes about.
- Capacity, output, accepted deliveries, closed deals, revenue, profit and return per unit of time are different metrics; average change, individual change and change in the composition of the group also have to be kept apart.
- One source establishing that a phenomenon occurred does not establish the candidate mechanism. Counting several retellings of the same paper as independent evidence inflates the support.
- Finding no counterexample is not passing verification; not significant is not the same as no effect; where distinguishing evidence is missing, several explanations may be kept at once.
- A cross-domain analogy can generate a hypothesis but cannot replace evidence in the current domain. When transferring, keep the relation and also check the key conditions and the mismatches.
- Whether a counterexample changes the overall judgment depends on how the original claim was scoped. One winner does not refute average stagnation, and average stagnation does not refute individual gains.

## Examples

- `/ljg-mechanism AI made creation easier — why has income not grown with it?`: separate capacity, delivery, closed deals, price and net income; compare candidate explanations such as a demand bottleneck, competitive substitution, and a sped-up intermediate link; then search for material that distinguishes them. Do not assume one mechanism dominates every field.
- `Nobody is coordinating the group, so why do questions still find answerers? Walk this through the framework.`: contrast members self-selecting against a few people doing the matchmaking, and find the different predictions when a key participant is absent; without process evidence for that group, keep it as an explanation still to be tested.
- `Everyone online says this technology has no real effect — find the mechanism and verify it.`: first check the metric, the period and the population behind "effect"; when the original generalization does not hold, rewrite the research question and explain which links improved and which are still stuck.
