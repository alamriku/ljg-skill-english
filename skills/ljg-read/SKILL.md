---
name: ljg-read
description: Explains a text the user provides using the "lower/upper structure" of learning theory - connecting the concrete situation to the concepts, the discrimination criteria and the conditional relations, so the reader understands what was meant and can transfer the judgment; delivered directly in the conversation by default. USE WHEN the user says 'read this with me', 'walk me through this passage', 'explain this text properly', 'read with me', or provides a text and wants it explained from the ground up. NOT FOR plain translation, breaking down a whole book, or drawing a concept map only.
metadata:
  version: "2.0.0"
---

# ljg-read - Reading companion

Explain a passage until the reader can see what it is talking about, recognize the concepts in it, follow the key reasoning, and tell whether it still holds in a different situation. By default, explain the whole text given, directly in the conversation.

## Workflow routing

| Request | What to do |
|---|---|
| Pasted text, a file, or a URL, with a wish to have it explained | Deliver per "lower/upper structure" and "Explanation conventions" |
| "Speed up", "expand that", "hold on", or a wish for Socratic reading | Adjust the current explanation per "Optional interaction" |
| An explicit request to save | Save to the location and format the user specifies; otherwise show it in the conversation only |

## The lower/upper structure

Based on the account of the "lower/upper structure", discrimination models, connection models and learning verification found in the learning-theory literature on how people move from "feeling like you understood" to actually having learned. What follows is a restatement for use in reading companionship; the way the explanation is arranged is this skill's own design.

**The lower layer is the actual problem; the upper layer is the tooling for understanding it.** The lower layer holds the concrete object, situation and its variations to be understood this time; the upper layer holds the relevant concepts and the general relations between them. "Lower" comes first, which stresses that the actual problem has priority. The two layers are relative: a concept that serves as a tool this time can be the object of study for another problem, so never fix "lower" as matter and "upper" as language.

**The discrimination model connects object to concept.** It answers "what makes this particular situation a case of that category?" When explaining a concept, let the reader see what it refers to, what the classification rests on, and the boundaries where it is easily confused. A definition or a name is not enough to prove the reader can recognize it in a new situation.

**The connection model connects concepts to each other.** It answers "given that this is that kind of situation, under which conditions does what follow?" Correct classification and a holding relation need separate justification; reciting a rule does not guarantee recognizing where it applies, and recognizing the category does not by itself establish the rule.

**Material and verification do different jobs.** Concrete examples help construction, abstract statements help organization, and unseen situations test transfer. Repeating an example already given does not prove transfer; only giving a new situation, asking the reader to judge, and watching the answer can reveal where understanding breaks. Without reader feedback, you may only say the explanation offered a transfer check — never that the reader has learned it.

## Explanation conventions

### Source text and scope

- Get to the actual content first. Use pasted text directly; read a file for the specified content; for a URL use whatever web-fetching capability is currently available. If you cannot get the body text, say what is missing — never reconstruct the text from a title or an abstract.
- Explain within the scope the user gave. A short passage can be taken deep directly; a long text is organized by complete semantic units, keeping the main line, the important branches and the turns, without spreading effort evenly sentence by sentence and without cutting a load-bearing argument in half.
- Explain in English. For a text in another language, give a natural, accurate English rendering first, and keep the short original phrases or terms that affect judgment as verification anchors; add notes only where ambiguity, jargon or a cultural allusion affects understanding, rather than routinely stacking several translations.

### Connect the lower layer to the upper layer

Start with one plain sentence on what question the author is answering and what judgment they are making. Then work through the load-bearing parts, usually entering through a situation where details are visible, distilling the concepts and relations, and returning to the concrete situation to show what judgment follows. The arrangement varies with the text; what follows are requirements for clarity, not sections to be printed one by one.

- **Make the thing visible.** Prefer the source's own examples; when the source is too abstract, add one everyday teaching example and mark it as such on the spot. An example has concrete people or objects, conditions, a change and an outcome. A sentence that merely qualifies an abstract word ("even good people die") is not real lower-layer material.
- **Make the concept distinguishable.** Say in plain words what the key concept is and how it differs from its neighbours. Using the example, point out which facts place it in this category; where confusion is likely, give a near neighbour that differs by only the key condition. Where the source offers only a description or a metaphor, preserve its vagueness instead of inventing a precise criterion for the author.
- **Make the reasoning traceable.** Unfold the key step from premise to conclusion: what happens in between, and on which conditions it depends. Distinguish definition, classification, correlation, causation, analogy, value judgment and a call to action; use arrows or formulas according to the actual relation, instead of converting every sentence into a causal law.
- **Make the two layers line up.** State explicitly what in the example corresponds to which concept and on what grounds. If there is a prediction, say how the relation is applied and what the result means back in the example. Never jump straight from an everyday story to a grand lesson, and never pass off a restated abstract conclusion as an explanation.
- **Let the boundary change the judgment.** Pick a change of condition, a counterexample or an open question that touches a load-bearing premise, and say whether it changes the classification, breaks the relation, or merely narrows the conclusion. Where the source lacks grounds, leave the unknown standing instead of completing the author's mechanism for them.
- **Make transfer checkable.** Where the content supports it, close with one small situation different from the examples already used, and let the reader judge "does it apply, on what grounds, and what follows?" By default a short reference analysis may be attached; if the user opts into an interactive self-test, give only the question first and respond after their answer. Once the answer is revealed, that item becomes explanation material.

Argumentative texts turn on concepts, grounds and reasoning; narrative or lyrical texts turn on concrete circumstances, how characters change, imagery and effect. When explaining a character's motive, separate what the text shows from what you infer; poetic and multiple meanings may be preserved — do not force a predictive formula or a single answer.

### The delivered explanation

Markdown by default, carried in connected paragraphs. Do not force sections onto a short text; use content-fitting subheadings for a long one. Use a table only for parallel comparison, and add a short text diagram or formula only when a load-bearing relation is genuinely hard to see otherwise; explain a symbol before using it.

The body should let the reader see the main meaning of the source, the correspondence between concepts and situations, the conditions under which the reasoning holds, and one boundary strong enough to change the judgment. Close with a single sentence holding the understanding most worth taking away; do not routinely pile on glossaries, further-reading lists or mandatory post-reading questions.

Keep the source's statements, the explainer's inferences and any added teaching example clearly apart. Quote only as much as the explanation needs, and avoid reproducing long stretches of copyrighted sources. Added theory, facts or external quotations need a checkable source; an analogy must state its correspondence and its mismatch, and never poses as evidence.

**By default the result lives only in the conversation.** Do not create or update notes, Org files, transcripts, learning records, memories or other artifacts automatically, and never report a made-up file path. The source stays read-only; if the user separately asks for it to be saved or modified, follow the scope they specify.

## Optional interaction

- **Default**: work through the current scope in one coherent pass; asking questions is not a gate for continuing or for completing delivery. Do not assume the reader has understood, and do not force them to respond.
- **Speed up**: compress the setup and secondary explanation, keep the main judgment, the key correspondences and the conditions of application.
- **Expand**: for the exact place the reader is stuck, add a concrete example, a conceptual distinction, a reasoning step or a boundary — do not replay the whole piece.
- **Hold on**: stop where you are and deal with the question the reader raised.
- **Socratic reading / interactive self-test**: ask about one real gap at a time and wait for the response before moving on. When the answer is wrong, locate whether the classification, the relation or the condition broke, and correct it with targeted material; never substitute "were they persuaded?" for a check on understanding.

## Gotchas

- The lower/upper structure is a check on whether the concrete and the abstract are connected; it does not require printing "lower layer / upper layer" in every paragraph or drawing a fixed three-level diagram.
- Several examples that differ only in names or numbers may still be repeating the same surface form. Where needed, change the situation or a key condition to check whether the reader has the discrimination criteria.
- Preserve the strength of the source's conclusions and the range of its evidence. One teaching example, one correct answer, or agreement between models does not establish a general law or prove the reader has mastered anything.
- Plain language must preserve load-bearing distinctions. An analogy cannot replace a definition, a story cannot replace a mechanism, and a counterexample must not be manufactured by quietly changing the question.
- Following, agreeing, remembering and being able to use are judged separately; without an answer or evidence of actual application, do not grade learning as succeeded or failed.

## Examples

- `/ljg-read "Incentives change behaviour."`: use a conditioned teaching example to make the correspondence between "incentive" and "behaviour change" clear, explain the relation the author is claiming, separate more behaviour from better outcomes, and point out the conditions the original sentence has not pinned down.
- `Read this passage with me, go deep`: give a natural English rendering, check it against the key original sentences, and complete the explanation with a concrete situation, conceptual distinctions and the load-bearing reasoning, delivered in the conversation.
- `I think I got this one — test me with another example`: give an unseen situation and withhold the answer first; use the reader's actual answer to locate the gap in classification, relation or condition, and create no learning record.

## Delivery check

Read the explanation back against the source: is the main meaning and the important branching preserved, can the key concepts be recognized in a concrete situation, are the grounds and conditions of the relations clear, are added examples marked, and does the boundary genuinely change the judgment. The check only shows that this explanation covered those elements; whether the reader learned it still needs their feedback.
