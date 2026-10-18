---
name: ljg-roundtable
description: >-
  One topic, one roundtable: the moderator invites 3-5 real figures, settles the
  definitions, runs round after round of argument, closes each round with an ASCII
  structure diagram, and lets the user control the pace with commands
  (continue / stop / deepen / add figure). The full transcript is archived to an
  org note at the end. Use when user says "roundtable discussion", "roundtable",
  "debate this", or wants to explore a topic through multi-perspective
  structured debate.
---

## Usage

<example>
User: roundtable discussion - does AI have real creativity?
Assistant: [Moderator opens, brings in the figures, starts from the definitions]
</example>

<example>
User: roundtable - does free will exist?
Assistant: [Runs the roundtable on free will]
</example>

## Instructions

Read `references/original-prompt.org` first. The original design of this framework is there, and the moderator's character and the whole flow come from it.

### 1. Settle the topic

If the user gave a topic, use it. If they only said "roundtable" with no topic, ask.

### 2. Invite the figures

Pick 3-5 real figures for the topic, historical or contemporary — never fictional. Give four things for each:

- Name
- MBTI
- Position, in one line
- Why they are here: the angle on this topic that nobody else can supply

Three rules for picking:

- The positions must be able to grind against each other; splitting into "for" and "against" is not enough
- Prefer people who wrote something canonical or said something famous on this topic
- At least one outsider to the field

### 3. Opening

The moderator opens, presents the list of figures and the reason each was invited, then puts the definitional question:

> "Before we begin, let us be clear about the core concept of this topic: what does it refer to? Which elements are indispensable?"

Each person speaks on the definition in turn. One format for every speech in the session:

```
[Name] [action tag]: what they say

**In short**: one-line summary
```

Six action tags: `states`, `questions`, `adds`, `rebuts`, `revises`, `synthesizes`.

### 4. The discussion loop

Three steps per round.

**Speeches.** Who speaks follows where the discussion is going; there is no rota. Every speech must pick up what came before — questioning, adding, rebutting — never a monologue in its own corner. Each ends with its **In short** line.

**Synthesis.** When the round is done, the moderator does three things:

- Name the core point of contention in this round. Pick the deepest one; do not try to cover everything.
- Draw an ASCII diagram: a 2x2 matrix, a spectrum axis, a causal loop, a hierarchy tree — whichever fits this round's structure. The diagram shows the structure of the discussion: how the positions are distributed, how the causation loops, where the positive and negative feedback sit. Do not use a diagram to restate content.
- Draw the next-level question out of the point of contention.

**Wait for the command.** After the synthesis, show the menu:

```
[Moderator]: (commands: continue / stop / deepen / add figure)
```

- `continue`: accept the next-level question and go on
- `stop`: wrap up and move to the conclusion
- `deepen`: do not advance; dig further around the current point of contention
- `add figure`: the user names a new figure; the moderator introduces them and asks them to state their position on the current question first

### 5. Closing

Once the user says `stop`:

- The moderator gives an overall summary
- Draws one complete ASCII knowledge-network diagram: the key concepts of this discussion, each side's position, the points of contention, and how they all connect
- Lists the open questions: directions that surfaced but were never worked through

### 6. Archive

Write the entire discussion to an org file, word for word. Speeches, ASCII diagrams, syntheses — all verbatim. No summarizing, no compressing, no rewriting.

1. `date +%Y%m%dT%H%M%S` for the timestamp
2. Write to `~/Context/{timestamp}--roundtable-{topic keywords}__roundtable.org`
3. File structure:

   ```org
   #+title: Roundtable: {topic}
   #+date: [{date}]
   #+filetags: :roundtable:
   * Topic and participants
   [the list: name, MBTI, position, why they were chosen]
   * Opening: definitions
   [the moderator's opening + each person's definitional speech]
   * Round-by-round transcript
   ** Round N: {guiding question}
   *** Speeches
   [every speech of the round verbatim, with action tags and In short lines]
   *** Moderator's synthesis
   [point of contention + ASCII diagram + next-level question]
   * Knowledge network (overall)
   [overall summary + the network diagram]
   * Open questions
   [directions left unfinished]
   ```

4. Report the file path to the user when done.

### How to moderate

- Take no side.
- Chase one point of contention per round, all the way down. No spreading thin.
- Force the clash. When participants are polite and skirt the disagreement, the moderator calls it out and puts the disagreement back on the table. Surface consensus means no discussion happened.
- In the synthesis, lay out everyone's hand: which assumption they stand on, what their premises are, where the chains of reasoning diverge. Restating who said what is not enough.

### How the participants speak

- Stay faithful to the person's real body of thought; say what they would actually say, and draw on what they wrote and what they are known for.
- No vague, agreeable nothings. To question is to point at which premise does not hold; to add is to push the argument one step further.
