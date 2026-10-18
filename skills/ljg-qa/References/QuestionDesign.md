# Question Design

How to make the Q cut to the crux and keep the A from falling apart.

## Four kinds of Q (action - contrast - cause - boundary)

Each kind corresponds to one pivot of the author's argument. A good Q chain mixes at least three kinds.

| Kind | Pattern | Example |
|------|---------|---------|
| *Action* | "How did they pull it off?" | "How do they turn X into Y?" |
| *Contrast* | "Why A and not B?" | "Why iterate instead of running in parallel?" |
| *Cause* | "Why does this solution hold?" | "Why does chain-of-thought reasoning emerge at all?" |
| *Boundary* | "When does it stop working?" | "Does this still hold when the data is sparse?" |

Why mixing matters:

- Only action questions = a tutorial
- Only contrast = a debate brief
- Only cause = a paper
- Only boundary = a postmortem

Only a mix reproduces the real tension of the original: method + cost + limit.

## Forbidden Qs

- "What is X?" — one definition disposes of it; carries no weight
- "How many steps does X have?" — not a question, that is asking for a table of contents
- "Is X important?" — the answer is presupposed; no tension
- "How should we think about X?" — academic voice, no concrete action
- "What are the pros and cons of X?" — business-school boilerplate
- "What does X mean for the future?" — nothing to land on

## The tone of a Q

No wrapping paper. No "so then", no "let us now turn to". Hit it directly:

| Before | After |
|--------|-------|
| How should we think about token economics? | Which step is the money actually worth spending on? |
| In AI engineering practice, is parallel processing appropriate? | What is wrong with spraying work across parallel agents? |
| What is the core mechanism of this method? | What makes it work at all? |
| What are the limitations of this approach? | Where does it crash? |

Spoken register beats academic register. Under 15 words beats a long compound sentence.

## The four parts of an A

```
*Conclusion*: (one sentence — it must survive being copied out of context)
*Formalization*: (one visible relation written in words and symbols)
*How we got there*: (2-4 short reasoning steps)
*Boundary*: (when it stops holding / what it does not cover)
```

### Hard requirement for the conclusion

One sentence, able to be copied out of context. If the reader sends it to a friend, the friend should get the point.

- Yes: "Depth costs more than breadth, but only depth buys insight."
- Yes: "The reward signal locks the model into trajectories it already knows."
- No: "On the whole, tokens should be used with some care."
- No: "The method demonstrates certain advantages across multiple dimensions."

### Hard requirement for the formalization

Use words plus simple symbols to compress the idea into one visible relation. It is "the geometry of the idea", not "a mathematical formula".

Allowed symbols: `= != -> <- + - x / < > and or` plus plain words and ASCII. No LaTeX, no elaborate expressions.

Four common patterns:

| Pattern | Example | Use for |
|---------|---------|---------|
| *Equation* | `generalist = coordinator; specialist = doer` | assigning roles to concepts |
| *Contrast* | `old: big model = full stack; new: big model = coordinator` | flipping the default frame |
| *Flow* | `data -> tokens -> answer = loss + waste` | exposing pipeline leakage |
| *Descent* | `call -> interface -> bilingual hotline` | tracing to a root cause |

It can also be a short formula or a small ASCII sketch (basic characters only, no Unicode box-drawing):

```
deep = 1 agent x 100 steps > 100 agents x 1 step
```

or:

```
broad: -- -- -- --  (skimming)
deep:  |
       v            (drilling through)
```

Test for the formalization: show it alone to someone who has not read the A. Do they roughly get it? Yes -> it passes. Needs explaining -> rewrite.

### Hard requirement for the reasoning steps

Each short line takes exactly one step. The previous step must open the door to the next.

- Yes:
  - 100 agents each thinking 1 step: expected hit rate about 1/50
  - 1 agent thinking 100 steps: each step's output feeds the next
  - Same total token spend, different hit rate

- No: "In multi-agent collaboration scenarios, an increase in concurrency does not necessarily yield an improvement in quality, as quality is closely tied to the depth of reasoning, which in turn requires iteration over a temporal sequence..."

  (one lump = never broken down = impossible to trace)

### Hard requirement for the boundary

This is the honesty test. Every conclusion has a place where it stops holding. Say it.

- Yes: "This assumes the task goal is stable and can be verified repeatedly. Open-ended exploration (say, 'write a poem') does not necessarily call for the depth route."
- Yes: "Does not hold for small models — their returns from iteration decay fast."
- No: "(left blank)" — makes the A look like a truth while it is actually brittle
- No: "Future work may explore additional dimensions." — PR language, not a boundary

Boundary is not the same as drawback. A boundary is a *condition*; a drawback is a *verdict*. We write boundaries.

## The topology of the Q-A chain

It is a path, not a list. Sketch it before writing:

```
Q1 -+-> Q2 (goes deeper into Q1's answer)
    +-> Q3 (the contrast Q1 raises)
Q2 ---> Q4 (what Q2's boundary hints at)
Q4 ---> Q5 (the closing counter-question)
```

Walking from Q1 to Q5, the reader reproduces the author's reasoning path.

*Arbitrary order = FAQ. Dependency = reasoning path.*

## Keep the count down

5-10 Qs is the sweet spot.

- Fewer than 5: coverage is thin, the reader leaves hungry
- More than 10: fatigue, the tension dissipates
- 7 ± 2 is the comfortable range — enough for the author's core argument without padding

If the source is dense (a book, a deep paper), do not cram it in — split by theme into several Q-A sets of 5-10 Qs each.

## Self-check list

After finishing, go through every line:

- [ ] Every Q survives "could one definition dispose of this?"
- [ ] Every A keeps the four parts (conclusion / formalization / steps / boundary)
- [ ] The conclusion sentence still works copied out of context
- [ ] The formalization is one visible line — someone who has not read the A still gets it
- [ ] Each reasoning step takes exactly one step
- [ ] The boundary states a "condition where it fails", not "future work"
- [ ] The Q chain has direction (delete one and the rest collapses)
- [ ] At least three of the four Q kinds appear
- [ ] No "what is X" Qs
- [ ] Qs are 15 words or fewer
- [ ] 5-10 Qs total
- [ ] Natural English, no academic voice

Any line that fails -> go back and fix it.
