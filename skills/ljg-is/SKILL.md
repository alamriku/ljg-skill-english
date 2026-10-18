---
name: ljg-is
version: "5.0.0"
description: Turns a noun or concept into usable understanding: first plain language on what it is and how it differs from its neighbours, then how it works and which judgments it rewrites, and finally the handle for acting when you meet it. USE WHEN the user asks what X is, how to understand it, what it means, why it matters, or how to judge and use it later; especially for technical concepts, institutions, products, roles, methods, standards and practices. NOT FOR plain fact lookups, formal proofs, step-by-step how-to guides, vertical causal drilling (use ljg-think), or motif structure (use ljg-structure).
user_invocable: true
---

# Explain a noun until it is usable

Give only a definition and the reader may remember the word while still not knowing how to recognize it. Give only the verb and the reader may know what it does without knowing what kind of thing it is or where its boundaries lie.

`ljg-is` joins the two: the noun answers "what it is", so the concept stands in the reader's map; the verb answers "how it acts", so the concept moves in the real world. Finished understanding takes one more step: which of the reader's earlier judgments it rewrites, and how to act the next time they meet it.

```text
What is it, and what is it not?
Through which action does it produce its result?
Knowing this, what do I stop believing?
Next time I meet it, what do I look at first, and what do I do?
```

These four questions are a path of understanding, not four sections of the text. The piece should read like a person working through a confusion, not like answers dropped into a table.

The "verb" view still matters here, but it is a conditional lens. For an institution, a platform, a role or a standard, you can keep asking who chose this arrangement and how it changes the participants; for a technical concept such as an objective function or recursion, the verb is first of all the object's own computation and effect. Where the material shows no social counter-pressure, do not drag a technical explanation into institutional critique.

## Workflow routing

| Workflow | Trigger | File |
|---|---|---|
| **UnderstandInUse** | Join "what it is" and "how it works" into an Org reading that can be recognized, judged and acted on | `Workflows/TraceCreation.md` |

## Standard for the finished piece

A good reading produces four consecutive changes in the reader:

- They can say in one plain sentence what kind of thing X is, and how it differs from whatever is most easily confused with it. A definition gives boundaries, not just a metaphor or a use.

- They can walk through a real example showing how X acts. For a technical concept, make the input, the key action and the result clear; for an institutional one, make the participants, how the rule enters action, and the actual consequences clear. Write only the mechanism the object really has.

- They can name the view of their own that now needs revising. The cognitive change must follow from the definition and the mechanism already given, not start fresh in pursuit of profundity.

- They can use the understanding in a concrete situation. Guidance for action says what to look at first, how to judge, when to adjust, and why.

Enter the body through a confusion, a misconception or a use case an ordinary reader would really have; do not manufacture a character story. The concept should appear early, and examples exist to test the explanation, not to create drama.

The ending may land on a judgment, a principle for acting, or a genuinely open question. Which one is natural is decided by what came before; a question mark is not proof of depth.

Default output:

```text
~/Context/{timestamp}--understanding-{target}__is.org
```

New artifacts use the `ljg-is-v5` schema. The body uses two to four headings that grow out of the content and four to ten paragraphs; never use "what it is / how it works / cognitive change / guidance" as four literal sections.

## Where this applies

- **A definition is not understanding.** If the user wants only a formal definition, a proof, or a translation of a term, just answer; enter this skill only when they want to understand how the concept works, what it means, or how to use it.

- **A verb is not the same as a social act.** A technical object can act through computation, mapping, comparison, compression or recursion, with no invented creator story. Only institutional objects call for asking about the choosers, the rules and the counter-pressures.

- **Guidance is not a manual.** This skill gives handles for judgment; it does not replace a step-by-step tutorial for a particular piece of software, process or industry.

- **Reasons cannot be faked.** Separate what the material supports from the analyst's inference. When you do not know, narrow the claim; do not invent motives for people, and do not pass a general mechanism off as a fact about a specific case.

## Gotchas

- **Do not turn the new contract into a new checklist.** If "definition, mechanism, insight, advice" each take a section, the piece is still stiff. They should read as one line of reasoning: because X works this way, the earlier judgment was imprecise, so next time do this instead.

- **Do not give a use as a definition.** "An objective function is for optimizing" says nothing about what it is; add how it makes candidate solutions comparable, and only then can the reader tell it apart from a constraint, a metric or a reward.

- **Do not force a concrete scenario.** A real confusion is usually more natural than an invented engineer or driver. Use a story only when the character's actions genuinely carry the mechanism.

- **Do not manufacture a philosophical turn.** Unchosen possibilities, counter-pressure, origins and futures are not mandatory. They enter the body only when they explain the object and have real grounds.

- **Do not escalate the scale at the end.** Explaining an algorithm and then suddenly demanding social justice in the last paragraph is usually not depth; it is a change of subject. The cognitive change and the guidance must trace sentence by sentence back to a mechanism already explained.

- **Do not give universal advice.** "Stay aware", "consider it holistically", "it depends on the case" still hold with the concept's name removed, which shows they use nothing from the explanation.

- **Do not let the metadata speak for the body.** `definition`, `operation`, `recognition` and `guidance` are backstage index fields; the body may say it more naturally, but reading the whole piece must find the same content.

## Examples

**Objective function**

```text
Do not write: the objective function is the soul of optimization, and in the end it
comes to dominate its designer.
Do write: an objective function is a ruler the solver uses to compare candidates. It
gives each candidate a comparable result, so the program knows which way to improve.
So when you see "optimal", ask one more question: optimal by which ruler?
```

**Performance review**

```text
First make it clear: it is a formal practice by which an organization periodically
judges work and connects that judgment to later decisions.
Then show how it enters bonuses and opportunities through metrics, narratives or
panels. From there it follows naturally: a review does not only record work, it
changes which work people choose next; so when designing one, check which behaviour
it is currently rewarding, not just whether the form is complete.
```

**Boundary cases**

```text
User: Give the formal definition of a recursive function and prove this theorem.
-> do not invoke ljg-is; this is a formal definition and proof task.

User: I know recursion means a function calling itself, but I still do not get what it
really is, or how to decide when to use it.
-> invoke ljg-is; this needs the definition, the mechanism, the correction and the
usage judgment joined together.
```
