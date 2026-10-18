# Chart Contract

A diagram makes a relation directly visible. Draw one only when the source has data, an order or a relation; never invent a value curve, and never promote a parallel or a correlation into a causal arrow on your own.

## Choosing the form

| Material | Body |
|---|---|
| Quantity, trend, simple process, two-way contrast | chart |
| Loops, branching, non-linear node relations | diagram: Unicode connectors + natural-language labels |
| Real code, source ASCII/Unicode that must be preserved character for character | pre |

A supplementary diagram in faithful mode follows the source slide and uses derivedFrom; the source text remains. Once the user authorizes a redraw, or in editorial mode, a new diagram may carry the same relation, tracked back through sourceIds. The representation may change, but what the labels refer to, the direction of the connections, the numbers and the strength of the conclusion must stay grounded.

## Native chart

    {"role":"chart","sourceIds":["SRC-001"],"chart":{"kind":"compare","title":"Two kinds of work","items":[{"label":"generate","text":"produce a candidate"},{"label":"verify","text":"check the grounds"}]}}

- bar: 2-6 `{label,value}` items sharing a zero baseline and the source's unit; negative values allowed; an all-zero set keeps the zero point.
- line: 2-6 `{label,x,value}` items with x strictly increasing and real spacing, the y axis including zero; connect the original points with straight segments - no interpolation, smoothing or extrapolation.
- flow: 2-4 `{label,text?}` items expressing only the order the source states; stacked in portrait.
- compare: two `{label,text}` items sharing dimensions and a baseline; portrait follows the source order.

Shared fields: a non-empty title, items, and an optional note; at most one item may use emphasis:true. bar/line may carry unit, and line may carry xLabel/yLabel. Values must be finite - never use a string, null or a filler zero to represent a missing value. Numbers and labels keep the source order.

## Unicode relation diagram

    {
      "role":"chart",
      "headline":"Feedback returns to the input",
      "sourceIds":["SRC-002"],
      "diagram":{
        "columns":25,"rows":7,
        "nodes":[
          {"id":"input","label":"input","caption":"x","col":3,"row":1},
          {"id":"result","label":"result","caption":"f(x)","col":20,"row":1}
        ],
        "edges":[
          {"from":"input","to":"result"},
          {"from":"result","to":"input","via":[[20,5],[3,5]],"label":"feedback","at":[12,5]}
        ]
      }
    }

Nodes connect by id; label is natural language and caption is an optional gloss placed next to it. col/row are layout anchors only, never data values. Nodes are not required to have boxes.

An edge's from/to sets the semantic direction, and via specifies the turning points of the path. Adjacent points that are not aligned connect with a right-angled path, horizontal then vertical. label annotates the process, and at can place it. Shared paths form junctions, and the arrowhead is drawn at a visible position before the target.

The connector layer uses the box-drawing and arrow characters. Text and lines are layered separately; nodes keep natural letter spacing and make way for the lines - never stretch a label to fit character cells. Diagrams meant for continuous comparison use the same rows/columns, node anchors and label specification.

Check in a real browser: nodes do not overlap, loops close, arrowheads are complete and point the right way, segments are continuous, and labels and glosses sit next to their objects. When a route crosses an unrelated node, adjust via or the position. When there are too many nodes or the explanations run long, split the semantics - do not solve it with smaller type.

## Boundaries

One main relation per diagram; chart/diagram is never mixed with lines/table/pre as a second body. A caption and supporting notes may be dropped, but whatever is needed to understand the diagram must stay.

Unicode is how relation diagrams are drawn; it is not a quota or decoration for every slide. The data contract, the browser measurement and the check against the source each prove only their own part; whether an arrow is grounded still requires a full audit against the original text.
