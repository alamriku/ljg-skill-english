---
name: ljg-teach
version: "1.0.0"
description: "Teaches a concept, a principle, or tests a claim through experience instead of definitions: first give a situation matched to the learner's level and let them choose, then use a fair surprise to expose the knowledge gap, make the structure visible, name it only afterwards, and retest in a loop with transfer situations. USE WHEN the user invokes '/ljg-teach', says 'teach me with a scenario', 'do not give me the answer first', 'let me learn it through a case', or wants to understand a concept or claim through choices and feedback. NOT FOR straight definition lookups (use ljg-is/ljg-word), eight-dimension concept dissection (use ljg-learn), or reading a text alongside the user (use ljg-read)."
user_invocable: true
---

# ljg-teach: experience-first learning

Do not explain the concept first. Put the learner into a situation and let them make the choice that is reasonable inside their current model; then let the situation move forward until the old model cannot explain the result. Only once the structure is visible does it get a name.

```text
situation -> choice -> surprise -> structure -> naming -> transfer situation
 ^                                                        |
 +-------------------- "oh, I see" ----------------------+
```

## Workflow routing

| Current state | Next step |
|---|---|
| The user offers a new concept, principle, model or claim | Go to "Situation"; do not explain or name the target concept |
| The user has made a choice and given their reason | Let a fair "surprise" happen in the situation |
| The user responds to the surprise, naming or exposing an assumption | Make their cognitive structure visible, then "name" it, then give a transfer situation |
| The user keeps answering in transfer situations | Update the difficulty based on their reasoning; loop or close |
| The user says "reveal it", "stop", "summarize" | Respect their control: give the minimum necessary explanation, or close |

## The ideal end state

When a round of teaching works, the learner has not memorized a sentence — they can see:

- which decision rule they just relied on;
- why that rule looked reasonable in the original situation;
- which variable, feedback loop, constraint or time scale it left out;
- which part of the old rule the new concept actually corrects;
- that with a different surface, they can still judge using the updated model.

## The experience loop

### Situation

Estimate from the conversation what the learner already knows, and pick the most load-bearing knowledge gap inside the target concept. Without enough evidence, start at an everyday, concrete, but not childish level; do not stall the experience with a self-assessment questionnaire.

The situation must give the learner a role, a goal, a few constraints that genuinely affect the choice, and enough information to judge. The first round contains no name, definition, jargon hint, or outline of the answer for the target concept.

Pose exactly one judgment that forces a trade-off. Allow answers outside the options, and allow "not enough information" — that is itself a judgment. End with "what would you choose? one sentence on why", or an equally concrete question, then stop and wait.

### Choice

Treat the learner's reasoning as evidence about their current model rather than rushing to mark it right or wrong. Notice what they are optimizing, what they are ignoring, what they assume will not change, and which local regularity they are treating as a global law.

If the choice already shows a stable grasp of the target concept, do not manufacture a failure. Raise the difficulty with a narrower boundary condition, a longer time scale, or a neighbouring concept; if there is still no real gap, say plainly that this layer is already mastered.

### Surprise

Move the situation forward by exactly one step, producing a consequence the old model did not predict but which can be explained back from the existing structure. The surprise exists to expose the model's boundary, not to prove the learner foolish.

The surprise must be fair:

- do not punish missing information by arbitrarily hiding a key fact; if the new information was genuinely unknowable, what you can teach is how to act under uncertainty, not that the original choice was wrong;
- do not pass off a riddle, a wording trap or a rare exception as a knowledge gap;
- do not fabricate failure. If the learner's choice holds under the given constraints, say so, then change one variable that genuinely triggers the boundary;
- if an empirical fact carries the surprise, verify the source first; when you cannot, say clearly that this is a simplified hypothetical.

After presenting it, ask one diagnostic question — e.g. "which assumption in your original judgment now needs to change?" — then stop.

### Structure

Using both of the learner's answers, mirror their old model back to them before inserting any theory:

- "The rule you just used was ..."
- "It holds under ..., which is why the original choice was reasonable."
- "What this surprise exposes is: it does not handle ..."

Where evidence is thin, mark it as "my tentative read" instead of inventing motives for the learner. When the claim involves value trade-offs, separate factual judgments, value weights and constraints; a surprise can test a prediction or a cost, but it cannot dress one value preference up as the only correct answer.

### Naming

Only after the structure is clear: "the structure you just ran into is called ..."

Introduce one concept, principle or model per round — the one that best compresses this surprise. Three things are enough: what it sees that the old model missed, what it predicts, and outside which boundaries it fails. Where schools of thought use the term differently, note the source or the common alternative names; never pass off an ad hoc label as an established concept.

### Transfer

Immediately give a new situation with a different surface and the same deep structure, without hinting that the concept just named applies. Again ask exactly one choice, then stop.

- if both judgment and reasoning transfer, change one variable and test again;
- if the answer happens to be right but the reasoning is still the old model, that is not mastery;
- if the old model persists, narrow the conflict so the gap is clearer — do not pile on more terminology;
- when the learner reasons correctly across two transfer situations with different surfaces and can state the boundary of application in their own words, the round can close; if the user says stop at any point, close immediately.

The closing keeps only four items: the original rule, the surprise that happened, the updated model, and the transfer evidence. Then ask whether to move to the next concept.

## Interaction rhythm

- Advance one cognitive break at a time; one load-bearing question per message.
- Never complete a whole round in the first reply; between the choice and the surprise you must actually wait for the learner's answer.
- Short paragraphs, plain words, no schoolteacher voice, and no "wrong", "obviously" or "this is actually simple" to shame the learner.
- The learner can say "different situation", "give me a hint", "reveal it", "continue", "stop" at any time. When changing the situation, keep the target structure and change the surface story; a hint removes exactly one degree of freedom.
- Without a request, write no files, generate no notes, assign no curriculum, and do not inflate one interaction into an encyclopedia.

## Gotchas

- The cheapest failure is explaining the concept first and then asking the user to fit the definition back onto the case. That is a worked exercise, not an experience; naming must come after choice, surprise and structure.
- A "surprise" is not a plot twist. If the outcome only works by adding arbitrary facts after the fact, what it exposes is the question-setter hiding information, not a gap in the learner's thinking.
- Do not insist on the learner making the mistake you planned. Avoiding the trap is itself evidence of understanding — upgrade the boundary immediately rather than rewording until they fail.
- Do not introduce a string of frameworks in one round. The more concepts, the harder it is for the learner to tell which variable corrected the prediction.
- Do not turn teaching a claim into training a position. For value disagreements, only make the costs, constraints and differences in prediction visible, and leave the choice of value weights to the learner.

## Examples

**Example 1: learning a concept**
```text
User: /ljg-teach opportunity cost
-> first round gives only a resource trade-off situation; ask for a choice and the reasoning
-> after the answer, let the real cost of the abandoned option show up
-> first surface the old rule ("count only what was already paid"), then name "opportunity cost"
-> retest with a time-allocation situation, with no advance hint of the concept
```

**Example 2: testing a claim**
```text
User: /ljg-teach "transparency always builds trust"
-> give a situation about publishing a team's decision records; let the user decide how transparent to be
-> the surprise shows how transparency changes participants' incentive to perform, rather than declaring transparency wrong
-> separate factual prediction, value weights and institutional constraints, then name the matching structure
-> retest the boundary with an odd-shaped situation from family life or a market
```

**Example 3: the learner does not fall into the planned gap**
```text
User: /ljg-teach sunk cost
-> in the first round the user already ignores unrecoverable spending and compares only future returns
-> do not fake a failure, and do not repeat the definition
-> acknowledge that this layer is mastered; test an adjacent boundary such as identity commitment or the value of information
-> if there is still no real gap, close and ask the user to pick the next concept
```
