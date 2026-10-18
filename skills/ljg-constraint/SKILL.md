---
name: ljg-constraint
description: For a field, profession, role, product or argument, finds the few constraints that actually box it in, sorts them into world / rules / interpretation (hard / soft / self-imposed), and shows how that set of constraints defines the identity, completes the problem statement, frames the solution space and explains the actual behaviour; especially useful for separating disagreements where the goal is shared but the constraints differ, and for spotting old interpretations mistaken for hard facts. USE WHEN the user says 'constraints', 'find the constraints', 'what constrains this field', 'the essential constraints', 'what boxes it in', 'hard constraint or self-imposed', 'where is the boundary', 'why does this industry work this way', 'constraint', '/ljg-constraint', or gives any domain/profession/role/product/debate and wants its defining constraints and solution space mapped. NOT FOR digging down to the generators (use ljg-rank, which looks for generative power, not boundaries), drilling one claim vertically to the bottom (use ljg-think), breaking down a book (use ljg-book), or dissecting a concept (use ljg-learn).
user_invocable: true
---

# Constraint engine

Take a field, a profession, a role. Find the few constraints that box it in, and see the solution space they frame - and how that solution space explains everything it does.

## Workflow routing

| Trigger | Workflow |
|---|---|
| Find the essential constraints of a field, profession, role or product | Run the process below, write it as flowing prose, save as an org file |
| Analyze why an argument about approaches goes nowhere | Find each side's assumed constraints first, then say whether they are even solving the same problem |
| Judge whether a boundary is a real hard constraint or an old interpretation | Work through the three hardness layers and the real/fake test; do not rush to a way around it |

## Gotchas

- Do not write ordinary difficulties, drawbacks or recommendations as constraints. A constraint must change the solution space; remove it and the permitted behaviour changes.
- Do not stare only at the goal. The same goal under different constraints is not the same problem; complete the problem statement before discussing solutions.
- Do not casually file consensus, habits and industry talk as hard constraints. A hard constraint must survive the question "does violating it cause immediate collapse?"
- Do not rush to write "how to break the constraint". First get the real hardness, the identity boundary and the explanatory power right; loosening gets one line at the end.
- Do not mix identity constraints with strategic ones. If the thing is still itself once you remove it, it was not an identity constraint.

## Examples

**Example 1: analyze a role**
```
User: "What are the constraints on an investment manager?"
-> find the constraints: fund duration, LP trust, information asymmetry, the asymmetry between upside and downside
-> show how those constraints force the behaviour: chasing hot sectors, weighting consensus, fear of missing out
-> write the org file into the notes directory
```

**Example 2: analyze an argument**
```
User: "Why do product and growth always fight?"
-> separate each side's assumed constraints: must not disturb the user vs must raise conversion
-> show that while both claim to want a good product, the problem statements differ
-> then explain why each proposal is rational inside its own constraints
```

**Example 3: test an old interpretation**
```
User: "Does this industry really have to be sales-heavy?"
-> ask first: is this a world constraint, a rules constraint, or an industry interpretation?
-> check whether another era, another region, or another player has already crossed it
-> if they crossed it and survived, downgrade it to a soft or self-imposed constraint
```

## What a constraint is

In everyday usage a constraint sounds negative - restriction, unfreedom, things you cannot do. This engine does not see it that way.

Something with no constraints has no shape. Water has no form until a glass gives it one; a problem with no constraints has no solution until constraints make one surface out of the infinite. Constraints do not reduce possibility; they produce specificity out of the infinite. No constraints means anything goes, which means it is nothing in particular. With constraints, only these things are possible - which is to say, the thing is itself.

Problems work the same way. A problem is not made only of its goal; it is made of its constraints too. Everyone says "build a product", but one person assumes complexity must not increase and another assumes growth must be pursued - they are already solving different problems. Same goal, different constraints, different solution space; and when the solution spaces differ, the fight about methods is usually just a mismatch.

So a thing's constraints are its identity. **Constraints are the set of equations that collapse infinite possibility into this one thing.** Once that set is written out in full, the solution space it frames appears - what this role can do, cannot do, and where the optimum sits is pinned by those few constraints. The real payoff of finding constraints is not the list but the solution space: **it explains the role's actual behaviour, one piece at a time.**

**This engine is description first, not reform.** The core question is "what are the current essential constraints, what solution space do they frame, what behaviour do they explain". "What would be better, which one could loosen" comes second, and must never bend the diagnosis that precedes it - rush for the exit and you stop seeing the wall.

**One line to separate it from rank reduction**: rank reduction digs downward for the few generators that produce the phenomena ("what holds it up"); constraint analysis feels sideways for the few boundaries that box it in, and sees what solution space those boundaries squeeze it into ("what shapes it this way and forces these behaviours"). One looks for the floor, the other for the edges.

## Three layers of hardness: which layer is this constraint on?

Constraints are not one kind of thing; they differ in hardness and therefore in weight. Sorting hardness is the first step to describing a constraint accurately.

**Hard constraint (world layer / physics layer)** - cannot be violated; try and the system collapses. People die (time), nothing exceeds the speed of light, a company whose cash flow stops is gone. No negotiation on this layer. It does not punish you; the system simply halts.

**Soft constraint (rules layer)** - can be violated, at a price. Laws, licences, contracts, industry norms. Violating them does not collapse the system physically, but someone fines you or the market punishes you. This layer is a question of price, not possibility.

**Self-imposed constraint (interpretation layer / cognitive layer)** - something you believe exists that can in fact be redefined. "I am not good at this", "this industry has to work this way", "what will people think". This layer lives in the head, not in the world.

What cannot be violated must be acknowledged; what can be violated must be priced; what can be rewritten should never be called fate. **Most predicaments are not blocked by hard constraints, they are trapped by self-imposed ones - something from the interpretation layer treated as the world layer.** The most expensive error in any field is always someone mistaking a chalk line for a stone wall and walking around it for decades. Getting the hardness right is describing a constraint's real weight: how tightly it actually holds.

## How to find them: the process

The criteria can only be checked afterwards; all the work of finding constraints is in the process. Seven steps - run them in your head, do not write them into the piece.

**1. Lay out the candidates.** Interrogate this field or role from many sides, feeling for every edge:

- What is the goal here? Which constraints, together with the goal, make up this problem?
- Swap one constraint out - does it become a different problem?
- In this argument, do the sides assume the same constraints?
- Which thing everyone treats as background might only be an old interpretation?
- What cannot be done? What must be done? What cannot be escaped?
- **Are reward and consequence symmetric - who keeps the gains, who carries the losses?** Asymmetric incentives are the constraint most easily missed and most explanatory: anyone who takes the upside without the downside will drift toward choices others cannot absorb.
- **Who cannot see whom - where is the information stuck?** Information asymmetry is a hard constraint too, and it often decides what this role is really optimizing (the visible signal, or the invisible reality).
- **How fast does the clock run here, how long until something pays off?** Time scale is a constraint: when the review clock and the payoff clock differ, behaviour follows the former.

Put all dozen-odd answers on the table. Just lay them out; no judging yet. This step is necessarily messy, with real walls and fake walls mixed together.

**2. Sort by layer.** Place each candidate as hard / soft / self-imposed. The test question: if you violate it, does the system physically collapse (hard), does someone fine you or make you pay (soft), or does nothing actually happen and nobody has simply tried (self-imposed)? Be deliberately suspicious while sorting - put a question mark on anything casually filed as "hard", because that is the layer impostors sneak into.

**3. Test the real from the fake.** For everything treated as a hard constraint, push once more: who laid this down? Does violating it really collapse anything physically, or has nobody tried, or been fined, or simply got used to it? Then apply the historical gate: has anyone in another place or another era already crossed it? If they crossed it and lived, it is not a hard constraint - it is a soft or self-imposed constraint mistaken for one. **Note that this step describes the constraint's real hardness; it is not an instruction to go pry it loose.** It does explain one thing along the way: why a few players can always play outside the convention - they saw the chalk line for what it is. Stop at the diagnosis; prying comes later and comes second.

**4. Find the constraint mismatch.** When the input contains an argument, a comparison of proposals or a disagreement about direction, do not rush to judge who is right. Write out each side's assumed constraints separately: one assumes "complexity must not increase", the other assumes "growth must be pursued"; one assumes "the user must not be disturbed", the other assumes "conversion must rise". They think they are arguing about solutions; they are arguing about the problem statement. Same goal, different constraints, different solution space.

**5. Find the contradictory pairs.** The genuinely hard problems are not those with constraints but those where several constraints fight, and the space that satisfies all of them at once may be empty. Pick out the mutually exclusive pairs and see where the solution space gets squeezed, and whether it is empty. Where the solution space is empty is usually the root of the awkward, contorted, apparently irrational behaviour this role shows - they are not stupid; there is genuinely no solution there, and all they can do is make a distorted trade-off.

**6. Find the identity constraint.** Ask of all the constraints: which one, if removed, means this thing is no longer itself? That is the identity constraint - the defining boundary of the field. Remove "hand food to a person face to face" from a restaurant and it becomes something else; remove "do no harm" from a doctor and they are not a doctor. Identity constraints are often on the hard layer, but not always; sometimes a soft constraint is the field's real identity.

**7. Close with two lenses.**
   - **The f lens**: a constraint is the domain of f. Which x this role's f can process and which it cannot - that is its constraint. See where the domain fences it in, which x fall beyond reach - those unreachable regions are often exactly the blind spots and gaps in its behaviour.
   - **The evolutionary lens**: a constraint is selection pressure. The environmental constraints a species faces determine its form - without desert drought, no camel's hump. See which few pressures shaped this role into what it is today; what phenotype this environment rewards and what it eliminates sets the direction of behaviour.

Only after all seven steps do the few constraints stand up. Run the process in your head and keep it out of the piece - the reader never sees you feeling for the edges, but they can feel that you touched something solid.

## From constraints to solution space to behaviour

Once the constraints are found, do not stop at the list. All their explanatory power sits in the solution space they frame. This section is the engine's spine; it lands in four moves.

**Complete the problem statement.** Put the goal and the constraints together. Do not write only "what it wants to do" - write "under which conditions it has to do it". Complete the statement and many arguments dissolve on their own: the solutions were not different, the problems were.

**List the constraint set.** Lay out the few constraints, the hardness of each, which one is the identity constraint, and which ones bite each other. This is the system of equations.

**Frame the solution space.** Stack those constraints and the permitted behaviour is squeezed into a narrow range: what is feasible, what is excluded, where the optimum sits. Constraints and solutions are two sides of one thing - write the constraints out fully and the shape of the solution space surfaces by itself.

**Explain the actual practice.** This is the closing move and the most valuable thing this engine does: the rational optimum inside the solution space should be precisely what this role does over and over in reality. Match them one by one - why they do this, why they do not do that, why a whole industry crowds in one direction. With the constraints right, the "strange behaviour" grows out of the solution space on its own, with no need to assume anyone is stupid or malicious.

What the reader walks away with is an interpreter: all that behaviour was never character or morals, it was the necessity of being squeezed into this solution space by these few constraints.

## Internal criteria

Once the process is done, run these gates afterwards - also not written for the reader.

1. **Explanatory power (the main criterion)** - does the rational optimum inside the solution space match the practice actually observed in reality? If it matches, the constraints are right; if not, one is missing or one is filed at the wrong hardness - go back to the process and keep digging. This gate is the counterpart of "regeneration" in rank reduction: if the constraints cannot grow the behaviour back one by one, they are not the right ones.
2. **Complete statement** - did you write "goal + constraints" together? With only the goal, the reader never gets the real problem.
3. **Visible mismatch** - if the input was an argument, did you show where the sides' assumed constraints differ? Without that, the piece slides back into judging proposals.
4. **Completeness** - taken together, do the constraints frame this role's whole solution space? Drop a typical situation in and check that it lands where it should.
5. **Correct layering** - is each constraint really on the right layer, world / rules / interpretation? Re-check the "hard" box especially, since impostors gather there.
6. **Willing to call the fake** - did you dare reclassify something treated as hard into soft or self-imposed? (This describes its real hardness; it is not a solution.)
7. **Identity is unique** - remove the identity constraint: does the role really fall apart and become something else? If it is still itself, you did not find the identity constraint.

Fail any one and go back to the process. The deadly one is the first: without explanatory power, nothing else matters.

## Which one could loosen (secondary, not part of the diagnosis)

The core of constraint work is describing the current essence - what it is, what solution space it frames, what behaviour it explains. "What would be better" is a different matter, it comes afterwards, and it must never bend the diagnosis. **Rush for the exit and you stop seeing the wall** - this is the engine's easiest failure mode, so hold it down.

Once the diagnosis is done you may add a line: which constraint in this set can actually move. When constraints are mutually exclusive and the solution space is squeezed to nothing, there are only three ways out - loosen one, redefine one, or go up a dimension to a solution the current view cannot see. Whatever the real/fake test marked as soft or self-imposed is where the lever fits. A line or two, no more; never let it take over.

Innovation often happens here: not by trying harder inside the old constraints, but by noticing that something everyone treated as a boundary of the world is only an old interpretation. Rewrite "people cannot fly" as "people cannot fly on their bodies alone" and the problem changes, and so does the solution space. If you write about loosening at the end, write that kind of redefinition: which constraint is not fate, only a leftover from an old problem statement.

## Natural English - the anti-collapse gate

Before writing, say it three times: **"would a person who has never read a committee report say it this way?"** Say it again after each paragraph. If the answer is no, do not swap words - knock the paragraph down and think it again.

The easiest bureaucratic habits to fall into (when you hit one, rewrite the paragraph, do not pick at words):

| Stiff | Natural |
|---|---|
| It is predicated upon an assumption | There is an assumption underneath it |
| This constraint defines X | This constraint is what shapes X into what it is |
| This means that... | In other words... / That is why... |
| In the process of ... | While ... |
| With respect to ... | For ... |
| Conduct an analysis of | Analyze |
| Abstract nominalizations ("constrainedness", "boundarization") | A concrete verb or object |

What needs changing is not the word but the frame you think in - move from report prose to plain, concrete writing with a human voice. Read it aloud when finished and listen for where the ear snags. Rewrite those paragraphs whole; do not patch them.

One more rule: this is analysis, not swordplay. Skip the meta-rhetoric of "another cut", "harder this time", "razor-sharp", "nailed down". A constraint's force comes from getting the boundary right and explaining the behaviour fully, never from describing how hard you swung.

## How to write it

One continuous piece of prose that takes the reader on a walk - from "this role is surrounded by rules and some of its behaviour is strange" to "so these few constraints squeeze it into this narrow space, and the strange behaviour was inevitable". No chapters, no subheadings; let the reasoning push itself forward.

Three requirements:

- **Read in one sitting** - even someone unfamiliar with the field cannot stop
- **Memorable** - afterwards they can turn around and tell a friend in one line: this role is boxed in by X, so all it can do is Y
- **A drop** - from "walls everywhere, behaviour inexplicable" to "lay out a few constraints and the behaviour grows by itself"; that contrast is where the beauty of constraint analysis lives

Follow the spine: complete the problem statement (goal plus constraints), then work through the constraint set and its hardness (what they are), then frame the solution space (what is possible, where it is pinned), and finally land on explanatory power (how these constraints force the role's actual practice, one piece at a time) - that last part is the centre of gravity, so give it room. If the subject is an argument, let the reader see that the two sides stood in different constraints from the start. End with at most one line on loosening, touched and left.

## Close with one ASCII structure diagram - the form follows the skeleton

Saying "these few constraints" is not enough; draw their relation to the behaviour. Before drawing, ask: what shape do this constraint set and the behaviour it forces actually have? Then pick the form.

**Hard rule: pure ASCII characters only.** No Unicode symbols of any kind (no arrows, no box-drawing characters, no bullet dots). Allowed: letters, digits, spaces, and `- = | + * / \ < > ^ v [ ] ( ) { } . , : ; _ #`. Arrows are `->` `<-` `^` `v`; borders are `+ - |`.

Three common forms; pick whichever fits the relations the process uncovered. The eye of the diagram is explanatory power - let the reader see at a glance how behaviour is squeezed out of the constraints.

### 1. Explanation chain (default)

For showing how constraints force the behaviour. This is the engine's main diagram: constraints -> solution space -> actual practice.

```
problem / constraint set           solution space        actual practice (observed)
------------------------           --------------        --------------------------
goal: ...
[constraint 1: ...] (hard) --+
[constraint 2: ...] (soft) --+-- squeeze -> [only X works,  -> [the role keeps doing X]
[constraint 3: ...] (hard) --+               optimum at X]      explanatory power: matches
```

**Requirements**: on the left, the concrete constraints with their hardness; in the middle, the solution space those constraints squeeze out (what is feasible, where the optimum falls); on the right, the behaviour actually observed in reality. One chain so the reader sees behaviour as the necessity the constraints forced. **If the right side does not match the left, the constraints are wrong - go back and dig, do not force a chain that does not match.**

### 2. Hardness nesting

For showing the three hardness layers, so one can see what holds this role tight and what merely slows it down. The eye of the diagram is the real distribution of hardness plus the real/fake verdict.

```
+=========================================+
|  self-imposed (cognitive; actually soft) |
|   - the "iron law" that can be redefined |
|   +-----------------------------------+ |
|   |  soft (rules; violate and pay)     | |
|   |   - regulation / contracts / norms | |
|   |   +---------------------------+   | |
|   |   |  hard (physics; violate   |   | |
|   |   |  and it collapses)        |   | |
|   |   |   * identity constraint   |   | |
|   |   |   - time / cash / physics |   | |
|   |   +---------------------------+   | |
|   +-----------------------------------+ |
+=========================================+
```

**Requirements**: fill each layer with concrete constraints; mark the identity constraint in the hard layer with `*` (the one whose removal makes it fall apart); if the real/fake test caught something "treated as hard, actually soft or self-imposed", put it on the layer where it truly belongs and note "often mistaken for a hard constraint". This describes the real distribution of hardness; it is not a route to innovation.

### 3. Constraint conflict

For when several constraints are mutually exclusive and the solution space is squeezed to nothing - used to explain why the role behaves so awkwardly.

```
   constraint A: ...  ----+
                          +---- solution space = intersection (empty here)
   constraint B: ...  ----+     => forced into a distorted trade-off: [the awkward behaviour]
   constraint C: ...  ----+
```

**Requirements**: list the mutually exclusive constraints, say where the intersection falls and whether it is empty; the empty region is exactly where "why does this role do such irrational-looking things" gets explained - mark the forced behaviour there. This uses the conflict to explain behaviour; it does not rush to a way out.

No rigid template. Show the bones - name each constraint, its hardness, where the identity constraint sits, and above all: which behaviour these constraints squeezed out. One look at the diagram and why the role acts this way should stick.

## Output

1. Get the timestamps: `date +%Y%m%dT%H%M%S` and `date "+%Y-%m-%d %a %H:%M"`
2. Write to `~/Documents/notes/{timestamp}--constraints-of-{field}__constraint.org`; the frontmatter is in `references/template.org`
3. Report the file path to the user
