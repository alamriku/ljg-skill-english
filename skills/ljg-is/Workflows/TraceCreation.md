# UnderstandInUse Workflow

Turn a "what is X" question into usable understanding. The finished piece lets the reader place X conceptually and see how it works, and then derives the cognitive correction and the judgment for action from that mechanism.

## The ideal artifact

A reader who knows nothing about this framework should be able, afterwards, to do four things in their own words: tell X apart from its neighbours, explain how X produces its result, name the judgment of their own that this understanding changed, and use it to make one better choice in a real situation.

The piece has exactly one path of understanding. The definition makes the object stand still, the mechanism makes it move, the cognitive change explains why the first two matter, and the guidance carries the new judgment back into reality. Each part must use the understanding the previous part built; they cannot be handed in side by side.

## Understand backstage, explain on stage

Before writing, settle five things backstage:

- **Definition.** Which kind of thing X belongs to, and which feature separates it from its nearest neighbour. A formal object may get a formal definition, but it still has to be rendered in plain language.

- **Operation.** What enters X, what X does, and what changes as a result. Technical objects usually show up as input, key operation and result; institutional ones as participants, rules and consequences.

- **Cognitive correction.** What people most easily mistake X for. Once the definition and the mechanism are clear, which old judgment can no longer stand.

- **Judgment for action.** In which real situation this understanding changes the reader's next step: which signal to check, how to choose, and when it says an adjustment is needed.

- **Grounds and boundaries.** Which parts are facts supported by the material or by a general mechanism, which are inference, and what would make the current explanation fail.

These five are the analyst's preparation, not the article's table of contents. The body never uses field-style headings like "definition, operation, cognitive change, guidance, grounds, boundaries", and it does not swap in synonyms and keep filling them in one by one.

The philosophical question chain is a conditional supplement. If X is an institution, a platform, a role or a standard, go on to check who stabilized this arrangement, what the alternatives were, and how repeated use changes the participants. If those questions have no real explanatory power for the object, leave them backstage rather than writing them in for philosophical completeness.

On stage, follow the reader's change in understanding:

- Start from a real confusion, a common misconception or an actual use. A scene with people is allowed, but never invent a protagonist for its own sake.

- Give the plain-language definition early and immediately draw the boundary with a neighbour or a counterexample. Once the reader knows what is being discussed, the rest will not float.

- Walk through the operation with a close enough example. The example must correspond to the key relation in the definition, not merely liven things up.

- Derive the cognitive correction from the mechanism. Say exactly which earlier view was imprecise and why; do not jump to a grander social question.

- Put the new judgment into a real decision. Tell the reader what to look at first, how to judge, when to adjust, and how that connects to the mechanism just explained.

- Close as the content requires: a more precise judgment, a principle for acting, or the open question the material genuinely leaves.

Headings grow out of the content, and the number of paragraphs can flex. After the first draft, delete the mechanism paragraph and reread the guidance: if it still holds completely, it is universal advice that never used X. Then check the final turn: if it still holds with everything before it removed, delete or rewrite it rather than keeping it afloat with a question mark.

## Plain-language contract

- The concept's name appears early. Do not make the reader travel a long way before learning what the piece is explaining.

- The definition gives the parent category and the key difference first, then lands it with an example. A metaphor can help, but it cannot stand in for a boundary.

- One main change per sentence. Three or more abstract nouns in a row, or a pile of commas and semicolons, usually means the backstage checklist leaked on stage.

- Two to four sentences per paragraph. Paragraphs can advance a concept, a cause or a correction; they need not pretend to be a story in time.

- Go easy on "firstly, secondly, furthermore, in summary". They mark arrangement only; they create neither causation nor time.

- Do not chase a high-theoretical register. If "a ruler for comparing candidates" will do, do not open with "a computable order of value".

If a reader unfamiliar with the framework cannot answer "what it is - how it works - how I will use it", the piece is not finished.

## Grounds contract

When the input comes with a file, a book, an article, a URL or conversation material, read the source first. Without material, use only the object's general definition and operating conditions, and say naturally which concrete implementations or case facts were not verified.

`#+basis` records the factual grounds the piece directly relies on. A judgment derived from them but not stated directly in the material is marked in the body with a natural phrase such as "which means" or "from this it follows". Hearsay, impressions and unverified possibilities are never written as grounds.

## Org output contract

Copy `Template.org` from the skill root and produce:

```text
~/Context/{timestamp}--understanding-{target}__is.org
```

- Timestamp from `date +%Y%m%dT%H%M%S`; the human-readable time from `date "+%Y-%m-%d %a %H:%M"`.

- The target keeps 4-24 meaningful characters; when it is too short, add words that really describe the subject rather than filler.

- schema is fixed as `ljg-is-v5`, and the filetags contain `:is:act:`.

- `#+definition` records X's parent category and key difference in plain language.

- `#+operation` records how X acts and what changes as a result.

- `#+recognition` records which old judgment this understanding corrects.

- `#+guidance` records the observation, judgment or choice that can be executed when facing X.

- `#+basis` briefly records the factual basis - no inferences, no hearsay.

- `#+falsifier` records backstage which fact would overturn the current explanation; the body handles it naturally only where understanding requires, never stuffed into the last paragraph.

- The body uses two to four top-level headings that grow out of the content, usually four to ten paragraphs; the body uses no bullet points and no field labels.

- The ending follows the content - a judgment, a principle or a real question; a question mark is not required.

Unless the user explicitly says "analysis only", "do not write a file", or `read-only`, save to `~/Context`.

## Acceptance contract

After saving, run:

```bash
bun ~/.agents/skills/ljg-is/Tools/ValidateNote.ts "<Org file path>"
```

Even when the validator passes, read the whole piece back. A mechanical check can only confirm that the skeleton of understanding exists; it cannot prove the prose is natural. On the read-back, run four tests:

1. **Noun test:** can one sentence separate X from whatever is most easily confused with it?

2. **Verb test:** without copying the definition, can you explain how X changes an input, a choice or a relation?

3. **Cognitive test:** can you say "I used to think ..., now I know ..."?

4. **Action test:** can you give one concrete situation where you will observe or choose differently next time? If the guidance still holds completely with the mechanism paragraph deleted, it is only universal advice.

Check the ending separately: is it merely raising the scale to sound profound? If the turn was not forced by the definition and mechanism before it, delete it instead of substituting a louder question.

Finally, deliver two or three natural paragraphs in the conversation with the definition, the most important cognitive change and the handle for action, then give the file path and the validation result. Do not copy the Org background checks back into a chat list.

## Failure boundaries

- No definition that distinguishes the neighbours: "what it is" has not actually been answered; narrow the object or get more material first.

- No operation anyone could restate: only a label or a use was given, and no understanding formed.

- No cognitive correction that follows from the mechanism: do not manufacture a philosophical turn; stay plain instead.

- Guidance that still applies to anything once the concept's name is removed: it is empty; go back to the mechanism and rewrite.

- The philosophical question chain finds no real foothold in the object: keep the object's own operation and invent no creator, no counter-pressure and no future.

- The validation passes but an ordinary reader still finds it stilted or the turn unearned: reader feedback is the final counter-evidence; rebuild the path of the whole piece rather than swapping words locally.
