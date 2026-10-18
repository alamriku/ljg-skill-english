---
name: ljg-map
description: Reads the user's text through a learning-theory view of knowledge, extracting concepts, discrimination criteria and conditional links, and drawing a plain-language formal knowledge map from the text's own relations; every node carries a plain definition, a short formula and concrete semantics, and the diagram presupposes no hierarchy. USE WHEN the user invokes /ljg-map, or asks to turn an article, notes or a talk into a formal map, a map of the thinking terrain, or a diagram of concepts and their relations. NOT FOR ordinary summaries, paragraph-by-paragraph rewriting, geographic maps, or standalone formula proofs.
metadata:
  version: "1.0.1"
---

# ljg-map - Formal thinking map

Use a learning-theory understanding of concepts, discrimination models and connection models to see the knowledge structure behind a text: which words have a definite referent, on what grounds real objects fall under them, and under which conditions the relations between concepts hold. Draw the structure you see. Formalization is there to reduce ambiguity; plain language and examples are there to make the relations understandable and usable.

## Workflow routing

| Request | What to do |
|---|---|
| Generate a map from a text, or revise an existing map | Read [Workflows/Map.md](Workflows/Map.md) |
| Need to calibrate formula density, node explanations, or how to mark source limits | Read [Examples.md](Examples.md) as needed; learn the register, do not copy the subject matter or the nodes |

## Gotchas

- **The view of knowledge is a lens; the diagram is decided by the material.** The correspondence between concrete objects, concepts and applications helps you check whether the knowledge connects — it does not become three fixed layers, three fixed sections, or a mandatory sequence of steps. If the categories overlap, draw the overlap; if there is feedback, draw the loop; draw a hierarchy only when the material actually has one.
- **Nodes come from this text.** Do not turn every article into "experience - abstraction - concept - memory - learning". Those become content nodes only when the article itself discusses them. Discrimination and verification can live on an edge or in a node's explanation; they need not each occupy a box.
- **A map is not a long essay with formulas swapped in.** The deliverable first lets the reader see the load-bearing relations, then explains the nodes in the diagram. A list of concepts, a long table, or a string of formulas with no map is not acceptable.
- **Formalization is not measured by symbol count.** Prefer "plain name + short formula". Define a symbol before using it, and do not invent a graph-theoretic metalanguage to describe an article that is simple.
- **Keep classification and prediction apart.** "Has a circle in it" can define a class; "this class scores higher" is a separate relation that needs grounds. Meeting the classification conditions does not establish the prediction, and it does not imply that the opposite class gets the opposite outcome.
- **Arrows carry meaning.** Definition, classification, computation, correlation, causation, analogy, inference and feedback are not one relation; distinguish them with short edge labels and the necessary conditions. A conjecture stays marked as a conjecture.
- **Never complete the diagram by inventing.** Where the text lacks a discrimination criterion, an example or a way to verify, mark the gap at that position. Keep added teaching examples, imagined applications and feasibility judgments clearly apart from what the source states.

## Deliverable conventions

By default, deliver Markdown, Mermaid and readable formulas directly in the conversation. If the user asks you to save it, use a specific format, or revise an existing artifact, follow their instruction; this skill does not write notes, overwrite the source, or publish by default.

The main diagram shows the knowledge relations specific to this text, with no preset number of layers, shape, or uniform application flow. Keep the main relations readable; secondary branches can go into a supplementary diagram that connects somewhere, or into an annotation table. Every node in a diagram must appear in the explanations under the same number or name, with its definition, formula, semantics and concrete correspondence.

## Examples

- `/ljg-map <text or file path>`: once you have the actual content, draw that text's knowledge structure, explain every node, and make the key relations clear with a fitting concrete correspondence.
- `Map out the concepts, criteria and links in this article — do not rewrite the article`: keep the author's main reasoning, parallel structures and significant disagreements; mark conditions and the source's own uncertainty at the arrows.
- `This diagram is too hard to read, redraw it`: cut symbols and crowding in the main diagram, and run one fitting example through it; keep the conditions that change the judgment — never trade away an argument for surface simplicity.
