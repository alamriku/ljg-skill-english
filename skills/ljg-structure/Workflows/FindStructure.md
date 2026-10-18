# FindStructure

Put a piece of information through the structure wind tunnel. The tunnel runs internally; by default only what genuinely changes understanding is output: the motif, the structural relations, and the pressure-tested conclusion.

## Step 0 - Sufficiency check

Read the input and the recent context first. If a concrete difficulty is identifiable, go straight ahead; if it is ambiguous but still analyzable, state in one sentence which reading you adopted. If there is only a domain name and no phenomenon or tension, ask at most three questions; once the user says `proceed`, state the assumption explicitly and continue.

## Step 1 - Compress the input

Restate in one short paragraph: what happened, what is wanted, what is blocking it. Keep only the facts that determine the structure; do not re-copy the user's text in different words.

If the input holds several phenomena, first ask whether one mechanism generates them all. Merge where you can, so one problem does not become a heavy list.

Keep at least one observable anchor: what someone did, what changed in the system, the moment a judgment failed. If the input has only abstract propositions and no phenomenon, you must later add an illustrative case to run the structure, and note in the evidence boundary that it is not empirical.

## Step 2 - Find the motif

The goal of a motif is not to raise the level of abstraction but to lower the difficulty of the vocabulary while keeping the relation transferable. Strip the names, industry and materials from the original scene, then write a concrete question in plain words:

> Under `{key constraint}`, how does the system handle the relation or tension between `{A}` and `{B}`?

That template is for internal positioning only; it need not be output verbatim. In the text:

1. replace `{key constraint}`, `{A}` and `{B}` with words explainable in everyday language;
2. the first sentence of the motif raises exactly one relational question, with no pile of concepts;
3. follow it immediately with a one-or-two-sentence minimal example that runs the relation for the first time, and make that the default example anchor for the whole piece.

Prefer the concrete phenomenon in the original question. Only when the original has nothing but abstract propositions should you add a familiar illustrative case. The example must say who corresponds to A, who to B, and how they act on each other; "this is like that thing" is not enough.

The motif passes two gates:

- **Cross-domain substitution**: swap the roles and materials, and the question still stands;
- **Explains the original**: put the original scene back, and it still explains why things jam.

Then run an understanding check: could someone who has not read the source restate the relation from the motif and the example alone? If not, cut abstract words or change the example.

By default choose the one motif with the most reach. If there genuinely are several, do not rush to combine them; first decide whether they are hierarchical, causally sequential, mutually balancing, or different faces of one motif, and say so in the text.

## Step 3 - Internal cross-domain search, then extract the structure

Internally, search for similar mechanisms in human institutions, natural systems, technology or science, and use them to correct and enrich the candidate structures. Sources are scaffolding: by default output no list of sources; where one genuinely helps understanding, give it one sentence with the single most fitting example.

Unfold sources only when the user explicitly asks for "sources", "cross-domain examples", or "how humans or nature solve it". Even then, return quickly to the transferable causal skeleton; do not write an interdisciplinary encyclopedia.

After merging isomorphic items, keep one or two of the most essential structures by default; keep a third only when it cannot be a step, condition, result or feedback loop of the first two. Write the structure's name directly in the card's title. Every card must pass three semantic checks, without being forced into fixed fields:

- **Concept**: explain only one or two load-bearing words. "What it refers to here" plus one visible marker — not a dictionary entry;
- **Relation**: in one or two sentences, `condition -> who affects whom how -> first change -> result`;
- **Example**: preferably point to the moment in the motif's example anchor where this relation shows, with the roles and direction matching. Add a new example only when the anchor cannot carry that structure.

In the text, two or three natural sentences may carry this, or, for complex input, you may explicitly label "concept / relation / example". Choose whichever lets the reader restate the model; never create a template for the sake of tidiness.

Examples are not decoration. If deleting the abstract words from a structure card leaves an anchor from which nobody could say "who affects whom how", the relation has not been unfolded. Conversely, if the anchor only conveys a similar atmosphere without keeping the roles and causal direction, replace it.

Boundaries and predictions no longer go into every structure card; they belong in the internal wind-tunnel comparison, so the reader is not sent to verify a model they have not yet understood. If one structure is merely a step, condition or result of another, do not give it a card.

## Step 4 - Judge the relations between structures and draw the diagram

With more than one structure, judge the relation before organizing the text:

- **In series**: one structure's output triggers the next;
- **In parallel**: several structures handle different signals or goals;
- **Nested**: one structure sets the boundary, another runs inside it;
- **Balancing**: the structures limit each other, preventing one-sided runaway;
- **Feedback**: the result strengthens or weakens the original mechanism.

Relations may be mixed; do not force them into a chain. Then draw a minimal relation diagram. Connectors, arrows and boxes use ASCII characters only — no Unicode graphic characters. For example:

```text
[independent judgment] --balances--> [public convergence]
      ^                                    |
      |-------------- feedback ------------|
```

The diagram must express a real causal relation; do not add empty nodes for looks.

After the diagram, add one plain sentence: in the example anchor, who is who, which action is which, and what happened in what order. Do not re-copy the structure cards node by node or retell the story — add only the overall relation the cards did not show.

## Step 5 - Wind-tunnel calibration

The wind tunnel is an internal discriminating step and is never output as a visible section. It puts the same model under different conditions: if the relation is real, the prediction should change with direction as the conditions change, and where the prediction stops holding is the model's boundary. When it is done, hand the conclusion only the most discriminating condition change, the first difference, and the change-of-mind signal.

### 5.1 Fix the baseline prediction

Using the example anchor from earlier, fix the baseline prediction of the key relation in one line:

```text
trigger -> key effect -> first observable change -> final result
```

Use only concepts the structure cards already explained. This step answers only "what does the model predict under the original conditions"; it does not restate the scene, the definitions or the full causal chain.

### 5.2 Change one condition

Pick the condition most critical to the result that can also change naturally — how early information appears, how strong the feedback is, whether participants are independent, how much resource there is, how long the effect lasts. Make it stronger, weaker, earlier, later, or push it into a different range, then write clearly:

1. how the condition changes;
2. what difference the model predicts will appear first;
3. how that change propagates to the final result;
4. which relation needs rewriting if the result does not change in the predicted direction.

No need to manufacture a catastrophic ending. The wind tunnel's value is in comparing adjacent conditions so that the causal direction and the range of validity become visible.

### 5.3 Find the boundary and the change-of-mind condition

State the conditions under which the model applies, then choose a matching test:

- **Conceptual or explanatory questions**: compare one case inside the range with one boundary case. Write the prediction that differs from the alternative explanation in advance; if the conditions hold and the prediction does not appear, or the alternative explanation hits where this structure misses, revise the judgment. A case outside the boundary only marks the range — it neither supports nor refutes.
- **Action or system questions**: give a minimal reversible experiment only when the user needs to act. Change exactly one condition, and state the observation signal, the supporting signal, the refuting signal and the stopping condition.

When the internal wind tunnel is done, it should answer:

1. How does the model run in the baseline scene?
2. How does the prediction change when one key condition changes?
3. At which boundary, or faced with which observation, must we revise the judgment?

If any of these cannot be answered, add a concrete action, a contrasting scene or a change-of-mind signal rather than more abstract concepts. Do not move the full pressure test into the text; the conclusion keeps only what makes the abstract rule visible, discriminable and revisable.

Expand combinations only when the user explicitly asks for "combining motifs", "combining structures", or "enumerate the solutions". Even then, first draw the relation diagram of motifs and structures and identify series, parallel, nesting, balancing and feedback; compute combination counts only if the user further asks for the combinatorics, the search space, or an enumeration.

Cross-domain sources and combination expansions live as second-level content under the four default top-level headings; they never add a top-level heading.

## Step 6 - Write the org note and self-check

By default write to the org path specified in SKILL.md; when the user says "analysis only", "do not write a file", or `read-only`, output the same structure in the conversation and create no file.

The only top-level headings are:

```org
* Input
* Motif
* Structure
* Conclusion
```

Default length roughly 600-1100 words. Check: the motif is not the topic renamed, and it runs the relation in plain words with one minimal example; the piece has one example anchor by default; every structure card passes the concept, relation and example checks without fields forced on for tidiness; multiple structures have had their relation judged and have a pure-ASCII diagram, with only the overall mapping added after it; there is no default source list, Cartesian product or combination count; the internal wind tunnel covered the baseline prediction, one condition change, the difference in prediction, the boundary and the change-of-mind signal, and the text has no separate wind-tunnel heading. Only action questions require a minimal reversible experiment.

### 6.1 Closing the conclusion

The conclusion does not summarize the piece; it compresses the internal wind tunnel into two paragraphs that build on each other:

1. **Concrete pressure test**: return to the same example anchor, change exactly one key condition, and write the first difference to appear; then say which observation would make this explanation fail. Do not retell the whole story and do not introduce a new example.
2. **Abstraction and return**: abstract one transferable relation from that difference and answer the motif directly; then point back at the decisive moment in the original phenomenon and say what this abstract rule lets the reader see that they did not see before.

The two paragraphs must form the derivation "difference in the phenomenon -> general relation". If the abstract rule cannot explain the concrete difference in the first paragraph, the example is not carrying the relation; if the first paragraph merely restates the abstract rule in colloquial words, the concrete handle is still missing. Action recommendations appear only when the user's question actually called for action.

Write the evidence boundary once, at the very end, stating together which cases only illustrate the relation, which parts are structural reasoning, which already have support in the field, and which still need an experiment. Do not repeat evidence labels on every structure card.

Finally, run an understanding check:

- Reading only the concrete pressure test, can you see the condition, the direction of change, and the change-of-mind signal?
- Reading only the abstract rule, can you transfer it beyond the original scene?
- Reading both together, can you say why this phenomenon supports this relation, rather than merely feeling the example is similar?

When saving, read the file back to check it and report the path; when analysis only, note that nothing was written to disk.
