# Reading, selecting and developing

The overall requirements for the artifact, the artifact-only reading check and the final-section convention are governed by `SKILL.md`. This file explains how to organize the book's material into a process the reader can follow.

## First establish what the material supports

| Grade | Scope of material | What may be claimed |
|---|---|---|
| Complete breakdown | The full text, or material equivalent enough to follow the book's threads, key turns and ending | You may explain the whole book, while still noting the specific source boundary |
| Partial breakdown | Table of contents, a sample chapter, interviews, reliable reviews or old notes | Explain only what the material supports; old notes are not the full text |
| Provisional | Less than that | Only an explanation explicitly marked as provisional |

Read the actual edition and distinguish the body, the front and back matter, the appendices and the publisher's promotional copy. When you hit missing pages in an extraction, text inside an image, or material of unclear origin, get more material first. A story or figure appearing in a book proves only that the author wrote it; it is not automatically a current medical, legal, scientific or market fact.

A complete breakdown needs four kinds of source evidence: how the original question was established; what makes the earlier understanding insufficient; which relations or conditions were added; and what finally takes shape along with what cannot be resolved. A literary work may instead have a misunderstanding, a relationship or a contradiction emerge gradually, with no improvement plan forced onto the characters.

## Let the book's own relations decide what the body keeps

After reading the whole book, establish the concrete object, the main process and the ending, then work out how the parts connect. Take "these parts all discuss freedom" further: whose choice made which later experience happen? Why do the two kinds of freedom conflict? By placing those two threads side by side, which understanding does the author specifically make difficult?

The same holds for analytical books. A set of methods may divide different work between them, may depend on one another in order, or may differ in scope. One overarching principle may not be enough to explain a system. In a book that explains an argument, generalization answers whom the observation extends to, provenance answers whether the material is trustworthy, and causation answers where the change comes from; all serve the reasons supporting the conclusion, and none substitutes for another.

When choosing the thread for the body, prefer a question, person or model the book already develops fully and that can go through several changes. Where no single thread fits, keep several and let them meet where they must. A history spanning regions need not cling to one merchant, and natural history and family memory must not swallow each other.

Record the candidate material thoroughly and keep the necessary explanatory jobs in the body. If deleting one of the book's cases also deletes the representativeness, the cost of a person's choice, or an independent thread, put that content back; if the same relation is already well explained, a repeated case can go. Completeness is tested by whether the reader understands the book, not proved by names, chapter titles or a count of examples.

Continuity has a cost too: once every method is run through one example, some method may be left as nothing but a direction to check. If the reader can only ask "where is the similarity" and cannot say how that similarity supports the conclusion, an actual explanation is still missing. Supply it within the current content first; where the current object genuinely cannot carry it, one complete and necessary contrast is allowed. Understanding a method means seeing both how it works and when it falls short - not being left with a list of doubts.

## Choose the kind of change by the kind of book

| Kind of book | The process you can develop | The boundary to preserve |
|---|---|---|
| Analysis, method | How the original claim changes under reasons, objections and alternatives | A hypothesis awaiting testing must not be written as a finding |
| Technical, scientific | How conditions, models and results constrain each other | Formal validity is not the same as the real premise holding; units and directions must stay consistent |
| History | How conditions, institutions and actions change later possibilities | Temporal adjacency is not causation; several places and threads are allowed |
| Biography | Why the person chose as they did, and how the consequence enters the next choice | Psychology and motive need material support; a life is not a success manual |
| Literature, philosophy | How the same relation, act or predicament gradually takes on a different meaning | Understanding may change while the character's predicament stays unresolved |

The earlier understanding you explain has to have reasons. A person may be unwilling to give up a way of life, or may simply have made a reasonable guess from the evidence available; there is no need to add emotion to analytical content, and no hurry to diagnose a character as "avoidant" or "prejudiced".

## When concepts, frameworks and diagrams appear

When a concept is needed, let it explain the specific gap in front of the reader. It may arrive promptly or after a set of contrasts; do not delay a necessary explanation for the sake of a strict naming order. A necessary whole-book framework may state directly how the parts depend on, contrast with or limit one another. Author, period and chapter position may be given on the spot when they help attribute a view, mark a change of conditions or bound the material; merely announcing what the book will cover does not advance the question at hand.

Where there is one shared explanation, verify it really accounts for two widely separated changes, then try it on a nearby case and give its boundary. Where there is none, keep the several relations honestly. Do not compress a set of methods into a slogan, and do not convert every work into a function.

A diagram should reduce what the reader has to assemble mentally. An arrow may stand for causation, temporal order or evidential support, and its meaning must be clear. The effect of a proposal, its cost and its alternatives are usually separate reasons; stringing them into one arrow chain can suggest that proving it works has already proved it is worth choosing.

Keep each diagram within 80 display columns; use as many diagrams or tables as needed and none for decoration. Immediately afterwards, let the reader use the object already developed to see the specific position and change. A script can only check that a diagram exists, its width and its format; it cannot establish that a reader can read it.

## Connected prose, and pausing where it matters

Let people, things, choices and consequences carry the narration. A key formulation may repeat while conditions are added to it; do not swap in synonyms endlessly to avoid repetition. One idea may develop across paragraphs, and progress is not measured by how much new knowledge each paragraph adds.

Length follows what the content needs. Watch for a term that appears before it is developed, several relations mixed into one paragraph, and an idea cut off by a grand statement just as it starts. Sentence and paragraph length are typographic guidance only and cannot replace those judgments.

A question keeps what was genuinely unclear at the time; there is no need to announce one at the end of every paragraph or to supply the model answer immediately after each. The return at the end says how the original situation is now understood - it need not re-summarize every section and add another flourish.

Do not add weather, gestures, dialogue or interior monologue for immersion. Handle the book's facts, the author's interpretation and your own invented scenario separately. Introduce the invented parts naturally with "imagine" or "suppose", leaving the detailed sourcing and verification in the coverage record; an actual explanation still has to say what it answers and what conditions it needs.

## Keep re-reading and source checking apart

First do the artifact-only reading per `SKILL.md`: reconstruct the whole book and the relations between its parts from the actual content, then look for specific reading breaks, identify the before-and-after change in understanding, and finally cover the last section to see whether the author's concern has already emerged. Pay particular attention to whether the reading gets pulled out of the current question into a book blurb or a note on how the piece is arranged; a ready-made answer in an overview paragraph is not evidence that the relation holds in the body. The evaluator has no copy of the book and cannot verify the accuracy of cases, figures or events on the author's behalf.

Separately, go back to the material and check the people, events, arguments, hypothetical markers and ending in the body; confirm the selection has not dropped an indispensable thread. Write the actual findings and revisions into the coverage record. Complete fields and a one-word PASS replace none of this work.

## How to test the skill during maintenance

Use the ordinary requests in `evals/evals.json`, giving the executor real material and the current skill, with no preset thread, expected conclusion or evaluation of an old draft. Cases with insufficient sources also test whether the scope holds. Write test artifacts into a task-isolated directory, never into the user's notes.

`evals/reading-pair.json` is the entry point for an anonymized comparison of two real drafts. Give the evaluator both bodies with the order of creation and the feedback hidden, swap the presentation order, and ask them to identify breaks and relations independently before comparing. It tests whether the evaluation method can spot problems; it does not establish that the revised skill will reliably produce the better piece.

Behavioural effect still needs real generation on independent material. Use at least one differently structured source to check whether this change forces a single thread, deletes one of the book's threads, or invents results; then compare the old skill, or no skill, on the same ordinary request and material. Record the real observations, the disagreements and the unverified scope in the test directory; the expected answers in a template are never a test result.
