# See and draw the knowledge structure of a text

## Input and scope of delivery

The object is whatever the user supplies: a text, an excerpt, existing notes, or content stated clearly in the conversation. Read the body of a file; get the actual content behind a link. If you only obtain part of the material, the map covers only what you read. If the input cannot be obtained, or it is unclear which material is meant, ask for what is missing — never invent the body from a title.

The task is to extract the thinking structure, not to rewrite the source, verify an entire book, or expand it into a new essay. Where a fact affects a key relation and needs checking, use whatever source tools this environment offers; keep "what the source claims", "a grounded correction" and "an assumption added for understanding" apart.

## The view of knowledge used as a lens

Learning theory supplies a lens for recognizing knowledge: abstraction keeps some properties, a concept marks off objects; the discrimination model connects a concrete object to a concept, and the connection model describes the relations between concepts. Being able to recite a relation does not mean being able to recognize where it applies; an example detached from or wrongly attached to a relation makes apparently complete knowledge fail.

Use these distinctions to understand the text at hand — do not take the theory's own terms as output nodes:

| Where you look | What to establish | Where it lands in the diagram (content decides) |
|---|---|---|
| Concept | What does the name refer to, which properties does it keep, which differences does it ignore? | Usually a content node; continuous variables, states and processes each get the definition that suits them |
| Discrimination | Which conditions must a concrete object meet to fall under the concept, and what if the evidence is thin? | May live in the definition, an example annotation, or a conditional edge; it becomes its own node only when the recognition process itself matters |
| Connection | What relation holds between concepts, in which direction, under which conditions, on what grounds? | Decides the edges, the formulas and the shape of the whole diagram; keep set, quantitative, causal, constraint and tension relations distinct |
| Correspondence and testing | Which instances does the relation match, what follows from it, and what evidence would overturn or narrow it? | Use examples and boundaries to make the relation concrete; draw an application path or a feedback node only when needed |

Concrete layer, concept layer and application layer are background understanding for checking that knowledge connects — they are not a layout requirement. The deliverable may be a crossing-classification diagram, a conservation relation, a conditional branch, a feedback loop, or a network joining several kinds of relation; those are possible shapes, not a menu to work through. Let the structure grow out of the real relations instead of picking a pretty shape and filling in nouns.

Keep one name and one definition per concept. Key concepts need an understandable referent; key relations need the conditions under which they hold. Where those links are missing, leave the gap marked in place. When the source lends itself to demonstrating transfer, run one situation all the way along the relations; purely classificatory or comparative material can be carried by members and boundary cases, with no generic predict-act-verify pipeline forced onto it.

## A readable map

The deliverable is usually one main judgment, a few notes on symbols, the main diagram, node explanations, and whatever boundaries are necessary. Adjust the order and length to the content rather than filling fixed sections.

- The main diagram uses whatever representation shows the relations accurately. Mermaid usually; for intersecting sets, two-dimensional classification or constraint regions, another clear text diagram or a coordinate layout is fine. Grouping, hierarchy and layout follow the content: do not default to three subgraphs, and do not convert every relation into a flowchart. The main diagram carries the main claim and the load-bearing relations; when there are too many side branches, split them out and note where they reconnect.
- Name nodes in plain English, optionally with a stable number and a one-line short definition. Move long formulas into the explanation of the node with the same name. Explain only the symbols that are actually used later; do not presuppose a fixed number of nodes or symbols.
- Label arrows with the real relation: "classified on this basis", "under condition ...", "predicts", "compares with", "corrects". Reading order and temporal sequence must not masquerade as causation. Distinguish definitional edges, the author's assumptions and empirically supported relations as needed.
- Keep the position of independent branches and opposing claims. Never merge different cases into an event that never happened for the sake of one continuous story, and never let one smooth example stand in for the whole argument.

## A usable definition for every node

Every node in the diagram, auxiliary nodes included, has a matching explanation. Short paragraphs usually carry the following; use a table only when the parallel items are very short.

**Plain definition**: what it is and where its boundary lies. For a class, the membership conditions; for a variable, what quantity it measures and its units; for a process, how input becomes output. A use case or a metaphor is not a definition.

**Short formula**: the fewest symbols that pin down the condition, the correspondence or the operation. Every symbol has a meaning given there or earlier, and the whole line can be read back in plain words. Do not force nodes of different kinds into one formula shape.

| Object | Possible form | Meaning |
|---|---|---|
| Class | `C := {x : x satisfies condition Q}` | Which objects the class contains |
| Variable | `waiting time := time processing starts - time of arrival` | What exactly is measured, with consistent units |
| Discrimination | `judge(x) in {belongs, does not belong, uncertain}` | Decide from the evidence whether the conditions are met |
| Established relation | `condition holds => result holds` | Keep the direction and the scope the source commits to |
| Relation still to test | `condition --predicted, untested--> result` | A checkable conjecture, not yet proven |
| Application | `situation -> classify / map to variables -> apply the relation -> conclusion in the situation` | Shows how the lower and upper layers connect |
| Verification | `predicted result ?= independently observed result` | Checks whether the model holds under the tested conditions |

**Concrete semantics**: use an object or scene consistent with the material to explain what each part of the formula corresponds to, and how it takes part in the neighbouring relations. Where the material involves a judgment or an action, say which step of the choice it changes. Prefer reusing a few running cases; add a new example only when an important alternative branch needs its own. Mark any added hypothetical on the spot.

**Necessary boundaries**: exceptions strong enough to change the classification, the relation or the action belong next to that node or edge. "Uncertain" is allowed when there is no evidence; an undefined threshold stays unknown — do not fill in a number for the author. A relation may be merely a correlation, a tendency or a norm; do not upgrade it to necessary causation.

## Distinctions the formalization must preserve

- A definition decides how a word is used; an empirical regularity needs evidence. `C := objects satisfying Q` and `C produces Y` are two different things.
- Human discrimination can be wrong; reciting the conditions does not guarantee recognizing a new instance. Show the correspondence between variables too — "can compute it" is not the same as connected to reality.
- `A => B` does not give `not A => not B` or `B => A`. Treating a necessary condition as sufficient, or similarity as identity, changes the diagram's conclusions.
- Keep units and ranges for continuous variables and numerical relations; do not convert every concept into a black-and-white classification.
- One positive case does not establish a general relation; "verification" in the diagram means a method of checking or limited evidence, not that the check has been passed. A test situation you added stops being an independent unseen test once the answer is revealed.
- A correct conclusion alone does not prove the premises and the correspondence were right. The error can sit in the discrimination, the mapping of variables, the connection, the checking of conditions, or the interpretation of the result.
- Where the source is rhetorical or a vague slogan, give the clearest reading it permits and mark which definition or relation is still missing. Do not decorate it with dimensionless multiplication, addition or spurious probabilities; if "+" stands for composition, say that it is a composition symbol.

## Read-back standard

Before delivering, read the diagram, the node explanations and the source back together: are the main claim and the important branches still there, do nodes and numbers correspond one to one, does every key edge have grounds for its direction and conditions? A reader should be able to explain the core concepts and relations with a concrete object, and identify the conditions of validity or the open questions. Check especially: does the grouping and flow of the diagram come from this text, or have you drawn the lens you used for analysis as if it were the object's own structure?

A diagram that parses is not the same as a diagram that is correct or readable. If you only checked the Mermaid syntax, do not claim a visual review was done. Conversation delivery by default produces no extra images, web pages or notes; when the user asks for such an artifact, produce it in the matching format and verify it for real.
