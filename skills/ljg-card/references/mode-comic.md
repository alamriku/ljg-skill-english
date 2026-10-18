# Mold: comic (-c)

Casts content into black-and-white comic panels. Generated bitmaps make the characters, scene, action and result visible; HTML/CSS write the concept names, dialogue, captions, sound effects, the precision of the evidence, and the source.

## 1. Turn the explanation into cognitive cause-and-effect beats

Read `references/image-generation.md` and `assets/comic_template.html`. Confirm the title, author, source and factual boundaries; if the input is an accepted Org note, lock its path and SHA-256 first and confirm the source is unchanged after casting.

Find the smallest runnable case that can carry the core mechanism. It must let the reader see the input, the action and the result; if removing a key feedback loop, sequence or constraint would change the conclusion, that element stays. Prefer one character, one set of props and one space running through the whole piece, because a comic's power to explain comes from comparability across panels, not from a beautiful new metaphor in each one.

Panels grow along this causal engine:

```text
minimal case -> naive model runs -> one observable gap
             -> one concept fills it -> rerun the same case -> the next gap
             -> rerun the complete model -> transfer or boundary of failure
```

Every step must change what the reader can explain at that moment:

1. **Minimal case**: establish the concrete situation, bringing the goal and the constraints into frame.
2. **Naive model**: let the reader's most natural old explanation or habit actually act once.
3. **Observable gap**: prove the current model is insufficient through a failed result, a wrong prediction, a confusion or a cost.
4. **One concept fills it**: introduce only the one thing the current gap requires, and let it become an action, a choice or a structural change.
5. **Rerun the same case**: return to the same task and draw the first result that changes once it is included.
6. **Continue or stop**: go to the next round only when a load-bearing gap remains; stop adding concepts once the current model is enough.
7. **Overall recapitulation**: rerun the complete mechanism from the original input so the parts collected along the way reconnect into one machine.
8. **Boundary beat**: where needed, change one condition and draw where the model transfers successfully or first breaks.

There is no fixed panel count. Short content may merge non-load-bearing setup; a long article, paper or whole book selects beats along the complete causal line. If deleting a panel still leaves the reader able to make the same cognitive jump, that panel is decoration and should be merged or deleted. Never inherit an old five- or six-panel template and stuff the content into it.

Each panel carries one visible action or one comparable result. A concept first shows its necessity through action, and the term is named in the next HTML caption, line of dialogue or heading; never serve the complete answer in panel one and then restate it in the pictures that follow.

A tightly coupled, concurrent or probabilistically emergent mechanism must not be faked as a single-line upgrade. Use side-by-side panels, two viewpoints at the same moment, or a state contrast so several forces appear at once; the reader should still see "what changes first if one of them is missing".

## 2. The comic series bible

Before generating in bulk, lock four kinds of continuity:

1. **Character sheet**: age, face shape, hair, clothing, height difference, key props, handedness.
2. **Line and screentone**: line weight, proportion of ink mass, tone grain, background density.
3. **Camera grammar**: main shot size, eye level, how strong perspective may get, rules for reaction shots.
4. **Black-and-white relation**: paper white, ink black, how many greys, and when high contrast appears.

Do not ask to imitate a real comics artist. Choose a descriptive style family by content:

| Style family | Suits | Visual features |
|---|---|---|
| Precise mechanical line art | technology, systems, devices | clear structure, fine lines, restrained tone |
| Ink and space | philosophy, introspection, history | generous space, brush feel, quiet shot sizes |
| High-contrast dark | risk, power, predicament | large ink masses, hard light, pressing composition |
| Heavy-line motion | conflict, action, speed | thick lines, exaggerated perspective, strong direction of movement |
| Quiet cinematic line | people, relationships, daily life | mid to long shots, environmental storytelling, light tone |

## 3. The panel causality table

Write the panel causality table before generating. Every main comic image must be a locally generated bitmap; an important beat may add a detail or reaction panel, but it has to help the reader see the current action or result, never just set a mood.

| panel_id | cognitive role | reader knows before | visible action | observable result | gap / new relation | continuity anchors | ratio | safe zone |
|---|---|---|---|---|---|---|---|---|
| `p01` | minimal case | only the goal | the character starts the task on instinct | the old model begins running | not yet named | clothing, props, space | 16:9 | top |
| `p02` | observable gap | believes the old model suffices | the action hits a constraint | the result departs from expectation | the current gap | same character, same task | 4:3 | left |
| `p03` | concept fills it | feels something is missing | the character adds one new distinction | the first result changes | the new relation, term later | same props, same camera | 1:1 | right |
| `p04` | rerun the same case | understands the new relation | the same task is run again | before and after are comparable | whether a gap remains | same character, same space | 16:9 | top |

Every panel in the table must pass three questions:

1. Remove it: does the reader lose a necessary cognitive change?
2. Does it share enough character, action or result with its neighbours to be compared directly?
3. Can the action in the image stand on its own, instead of relying on a caption to assert "something changed here"?

If any answer is no, rewrite the beat before generating any image.

## 4. Generating the panels

Append to the prompt:

```text
black-and-white manga panel art, clean paper background, coherent recurring character,
single readable action, visible cause-and-effect result, intentional camera angle,
controlled screentone and ink mass
```

Mode-specific negatives: no speech bubbles, panel borders, caption boxes, sound-effect lettering, page numbers or colour inside the image; no photographic feel, glossy 3D or extra characters. Key subjects must be complete so CSS can crop safely.

Generate the panel that best calibrates character, space and the core action first - it need not be `p01`. Once the sample passes, generate the rest; every time, write the continuity anchors, the current action, the observable result and the safe zone back into the prompt, never just "same character".

Check panel by panel: looking at the bitmap alone, the reader should be able to say who did what and which result changed; the concept name, the conclusion, the numbers and the strength of the evidence still belong to HTML. If a generated image draws a term, an interface label or dialogue into the picture, regenerate in a targeted way.

## 5. Routing the sources

- A photo, screenshot or chart from the source is a `source` asset, placed faithfully into its own evidence panel with the source noted.
- A new comic image is `generated` and must never be described as "the original" or implied to come from the original author.
- A brand logo appears only in the footer.
- Never collage a source image and a generated image into fake evidence inside one panel without saying so.
- A case makes the mechanism visible; it does not prove generality. Factual claims and a paper's conclusions advance only as far as the neighbouring source evidence allows.

## 6. HTML/CSS division of labour

How images are written:

```html
<figure class="generated-art generated-art--panel panel-wide" data-panel-id="p01">
  <img src="/absolute/path.png" alt="the protagonist pushes the machine the old way and the gear jams at the second coupling">
</figure>
```

Overlaid with HTML/CSS:

- `.panel` for panel borders and an uneven grid
- `.bubble` for speech bubbles and their tails
- `.narration` for caption boxes
- `.sfx` for sound-effect lettering
- `.caption` for source or time

Captions and dialogue do only three jobs: name the gap the reader just saw, name the concept once its necessity has appeared, and calibrate the evidence and its boundary. If the text has to explain "who did what and how the result changed", the action panel is not finished.

An image's `object-fit` may be `cover`, but eyes, hands, key props and the point of conflict must stay inside the safe zone. Decide `cover` or `contain` per panel by its ratio; never apply one cropping rule to every panel unchecked.

The top image slot uses `.generated-visual--comic` and may serve as a cover hero; set it to empty when unused. Put the layout CSS into `{{CUSTOM_CSS}}` and the panels into `{{CONTENT_HTML}}`, and replace `{{LOGO}}`, `{{SOURCE_LINE}}` and the image slot. Write to `/tmp/ljg_cast_comic_{name}.html`.

## 7. Screenshot

```bash
bun assets/capture.ts /tmp/ljg_cast_comic_{name}.html ~/Downloads/{name}.png 1080 1500 fullpage
```

## 8. Self-check

- [ ] The panel count comes from cognitive beats, not an inherited fixed count or padding for layout
- [ ] The minimal case, naive model, observable gap, single-concept fill, same-case rerun and recapitulation can all be located
- [ ] Every new concept is pulled in by the previous panel's gap, with the term arriving after the necessity
- [ ] Each panel has one visible action or one comparable result, and the sequence reads without the explanation
- [ ] Where a mechanism is tightly coupled, it uses a side-by-side relation rather than a false linear order
- [ ] Long content covers the complete causal line; the deletion test finds no decorative panel and no missing load-bearing beat
- [ ] Every main comic image comes from a generated bitmap; no empty panels, placeholders or duplicate hashes
- [ ] Character sheet, line, camera, space, props and tone style stay continuous throughout
- [ ] Panel borders, dialogue, captions, terms, sound effects and sources are all carried by HTML/CSS
- [ ] No readable text, bubbles, borders, logos, watermarks or colour contamination inside an image
- [ ] Source images and generated images are clearly labelled, and no claim outruns the source evidence
- [ ] Every generated asset was visually checked at full size before entering the HTML
- [ ] Every panel passed the DOM class sweep; key faces, hands, props and actions are not cropped
- [ ] The PNG is 1080 wide, and the whole-image plus full-height overlapping slice checks pass
