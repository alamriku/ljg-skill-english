# ProbeDeck

A read-only acceptance expression run in the browser's main page. It pages through the deck and tests the keyboard, restores the original page afterwards, and never modifies the deck file.

Execute Tools/ProbeDeck.js under the interceptor's current isolation and viewport contract. When viewport testing is needed, pass the file as the expression to its verification tool:

    VerifyViewport.ts probe <deck-url> --widths 1098 --height 648 --expr @<skill-dir>/Tools/ProbeDeck.js

Then run it again at a phone size such as 390x844. Do not fake resize or font-loading behaviour by calling layout functions by hand; the viewport tool should keep the page's rendering lifecycle active.

The report contains the buildId, the viewport, each slide's role, its main object, the text check, effective type sizes, overflow, node overlap, and the results of the keyboard and notes toggles. Native bars, comparisons, text, tables, source code and Unicode nodes are checked against the real DOM.

    bun Tools/ValidateDeck.ts output.html --browser-report probe.json

ValidateDeck accepts either the raw report or the results wrapper the viewport tool returns, and checks that it belongs to the same build. One report proves only the viewports, slides and probe scope it recorded; hierarchy, white space, the correctness of relations and the joins in diagrams still need to be looked at in screenshots.
