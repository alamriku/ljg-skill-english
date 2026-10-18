# Knowledge explanation: connecting object, concept and result

For knowledge explanation in `-l` and `-w`. The goal is that when the reader meets a new situation, they know how to discriminate, when it applies and what follows. Literary, narrative and aesthetic material is not forced down this route, and `-f` adds no teaching material at all.

Borrowing the lower/upper structure from learning theory: the lower layer is the concrete object and problem at hand, the upper layer the concepts and conditional relations that can guide it. The layers are relative; the object may be a thing, an action, a piece of text or a mathematical object. Where they sit on the page, and whether the example or the rule comes first, follow what reading requires.

## Write the connection into the actual explanation

From one stretch of explanation the reader should be able to point out: what the object is, what action or change of state occurred, which feature supports the classification, on which condition the relation holds, and what result follows. The concept's name gathers up a shared relation that is already visible; the body makes that relation recognizable. For an unfamiliar concept you may move from the situation to the name, or give the judgment first and then unfold the correspondence; the order follows understanding.

Unfold the load-bearing sentences in plain language. "Demand is aggregated" can become "the customer tells the assistant what to buy, and the assistant sends the order to one shop"; "rate limiting" can be spelled out where needed as "you cannot fetch too much in a short time". Keep the terms that do work, let actions, conditions and results carry the explanation, and avoid explaining one abstract word with another.

One case may continue toward the same goal, or change to an object that discriminates better; whenever the scene changes, say which relation was preserved. Once the reader can retell the story, they should also know what will let them recognize the next instance. Necessary examples, transitions and derivations may be unfolded, and a long image may grow taller - never delete a connection understanding needs in order to look concise.

## Fix the reader's task before choosing material

In the production notes, write one sentence: "faced with which new situation should the target reader recognize what, on which grounds, and derive what?" Avoid writing only "understand concept X". Choose which connections genuinely need explaining from what the reader already knows; do not define every familiar word.

Check the following material against the core task, reusing whatever already exists - no extra fixed table or new ledger is required:

| Element | The concrete question to answer |
|---|---|
| Object and problem | What is known, and what has to be judged or predicted? |
| Discrimination criteria | Why does this object fall under the concept? How does a confusable neighbour differ? |
| Relation and conditions | From which inputs does what follow, and on which conditions? |
| Instance and result | Within one case, how does the input pass through the rule to the output? Is the result observed, derived or assumed? |
| Change of case and feedback | With a different object or a changed key condition, how should the reader judge? Which grounds would change the original answer? |

Only the elements that change understanding have to be covered; there is no required number of examples, nodes or exercises per concept. Grounds for classification and conditions of application are explained where they belong, and the artifact adds no reading tips or boundary box at the end.

## The boundary between the source and additions

- Prefer the source's own examples, contrasts, counterexamples and evidence. When compressing, weigh both the argumentative load and the learning load.
- A concrete object in a picture may be only an analogy. An analogy must state which relations correspond and where it cannot be carried over; it never poses as an instance or evidence in the target domain.
- When the source lacks discrimination criteria, instances or a way to verify, state the gap in the production notes and the delivery message. A request to make a card is not authorization to add facts; when the user explicitly asks for a teaching adaptation or added examples, you may include a checkable derivation or a clearly labelled hypothetical example, without changing the source file. "Rewrite it plainly" and "re-explain it with the lower/upper structure" are teaching adaptations, and the additions still must not pose as the source or as real observation.
- A added example is visibly labelled "added hypothetical example" or "added derivation" and kept apart from the author's statements; never fabricate a source paragraph, an observation or a citation for it. The outcome of a hypothetical follows the stated conditions and never turns around to prove a real-world regularity.
- When the source supports only a tendency, a correlation or a local conclusion, the card keeps that strength. An unobserved result is never written as fact.

## How the two molds carry it

`-l` weaves the discrimination criteria and the relation through a continuous scene, keeping one case while explaining; the close may change the case, keeping the key relation or changing exactly one decisive condition. The overall judgment may appear early, but transferability cannot be claimed by an aphorism at the end.

`-w` keeps the vertical spine of the argument and connects object to rule locally wherever an unfamiliar concept first appears, misjudgment is likely, or a condition changes. Learning material belongs to the step it serves and keeps its real source; do not create a separate reasoning node for every example, and do not promote one automatically into evidence.

Both templates provide optional `.learning-material` / `.learning-label` and `.transfer-check` / `.transfer-feedback`. A label states the identity or action the reader needs - "example from the source", "what makes it this kind", "a different situation", "added hypothetical example" - and never puts an internal production field name on the card. A key discrimination uses the main type size and may add height rather than being squeezed into a small footnote.

A practice question in a static PNG gives the situation and the question first, with feedback in a separate area further down and a prompt to judge before scrolling. It cannot force the answer to stay hidden and cannot collect reader behaviour; claiming a learning effect needs real answers to a new situation.

A change of conditions can change whether the relation applies, how strongly it acts, or where the result belongs. Feedback says which condition changed and why that affects the original judgment; when the original relation still partly applies, keep it rather than forcing the change into all-or-nothing.

## Four same-material comparisons

All of the following are teaching material written for this purpose, to calibrate the trade-offs; they do not prescribe the subject or structure of future cards.

### 1. The metaphor is clear and the discrimination is still missing

Material: a result counts as feedback in this task only when it is used to adjust the next round of action.

Failing version: "feedback makes a system improve", with a hand turning a valve. The reader sees an adjustment but cannot tell whether bookmarking a report counts as feedback.

Repaired version: an editor sees that last issue's readers all misread one term, so the next issue adds a concrete example; the neighbouring contrast is bookmarking the same report and writing exactly as before. The criterion is whether the result enters the next round of adjustment - "having looked at the data" is not enough to classify it. The valve may stay as an analogy, but these two task situations carry the recognition of the concept.

### 2. The proof is intact and the way in has been deleted

Material: in a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides. A vertical flagpole has a taut 13-metre guy line to its top, the ground is flat, and the foot of the line is 5 metres from the foot of the pole.

Failing version: keeping only the formula and "the pole is 12 metres", deleting the perpendicularity, the tautness and the correspondence of the sides as "just an example".

Repaired version: the pole is perpendicular to the ground, forming the right angle; the taut line corresponds to the hypotenuse c = 13, the horizontal distance to the leg b = 5; the height a = sqrt(13^2 - 5^2) = 12 metres. That explanation of the correspondence does no work in proving the theorem, yet it does the work of getting from the scene into the formula. Change the ground to a slope and the angle has to be re-judged before the same computation can be used.

### 3. The answer can be repeated and transfer is still untested

Material: the flagpole example above has already been explained.

Failing test: change 13 to another number and have the reader copy the square-root computation; or ask them to restate the theorem. Neither tests classification of the object or recognition of the conditions.

Repaired test: a 10-metre straight ladder leans against a vertical wall on flat ground, with its foot 6 metres from the wall; ask which side is the hypotenuse, whether the conditions hold, and how high the top reaches. The feedback should include the ladder as the hypotenuse, the wall perpendicular to the ground, and the derivation of 8 metres. Then ask whether the same approach applies when the ground slopes; the answer should say the right-angle condition must be rechecked. This small check covers only those recognitions and derivations and cannot claim general mastery.

### 4. There is a case and there are terms, and the reader still cannot see the relation

Material: suppose a customer asks an assistant to buy all the groceries, and the assistant may compare shops and place the order with one of them. If many customers shop through that assistant, shops will compete to be chosen; if the assistant only hands over links, the final choice and the order stay with the customer.

Failing version: "the assistant aggregates demand, merchants retreat to execution, and control of the entry point rises." The reader has bought groceries before and still cannot tell who each clause is about or what happened.

Repaired version: "You keep telling the assistant what to buy, and the assistant picks one shop and places the order. The shop receives the order it forwarded; to win those customers, it has to be the one chosen. The customer goes to the assistant first, and the assistant carries the demand to the merchants - that is where the relation called aggregation becomes visible." The concrete correspondences are: the customer states the demand, the assistant influences which shop is chosen, the merchant fulfils the order; many demands passing through one assistant is the condition under which merchants begin to depend on it.

Condition contrast: "Now the assistant only gives you links to three shops. It still influences which shops you see, but which one you choose and who places the order stay with you." This tests how the degree of control changes with the condition, and prevents "it does not order for you" from being written as "it has no influence at all".

## Acceptance is reported in the delivery message

The items below belong to production and delivery; they never enter the card's body or get appended at the end. The artifact ends where the content itself closes, keeping only the byline and the source.

1. **Source and rendering**: use the existing ledger, screenshots and pixel checks to verify fidelity, structure and readability.
2. **Content review**: look at the actual words and images, and check the discrimination criteria, the input-output correspondence, the conditions of application, the identity of the material, and whether a change of case exposes misuse. With the concept's name covered, the explanation should still carry the object, action or state, condition and result that support the key judgment; put the name back, and you can point to where each piece of material corresponds to the concept. Filling in a field does not satisfy this.
3. **Reader test**: get an independent answer on a situation that was not used in the explanation, and check both the grounds and the result; without this step, report "no reader test was run". Self-review by the model, or a simulated answer, can only suggest where content problems may be.

When the source material is insufficient, report the specific gaps; the task can still deliver a faithful content card, but it must not be called complete teaching material. Exercises are not a required section on every card; whether one is needed follows the user's purpose and the source's boundaries.

When a user says it is "hard to read" or "not plain enough", put the original wording next to the rewrite and check which connection was missing and what judgment the repaired version supports. Revising the same material and drafting a different subject provide separate evidence; a text rule, a structural check, a model draft and real reader feedback each prove only their own scope.
