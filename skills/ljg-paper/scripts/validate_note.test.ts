import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { validate } from "./validate_note";

const filename = "20260820T091641--paper-skills-keep-action-relations__paper.org";

const validNote = `#+title: Skills keep the action relations, not the guarantee
#+subtitle: Demystifying Skills
#+description: The old benchmark only read the final score; the authors compare representations of the same experience and find that a skill mainly stabilises action relations, bounded by a full usage lifecycle.
#+date: [2026-08-20 Thu 09:16]
#+filetags: :paper:
#+identifier: 20260820T091641
#+source: https://arxiv.org/abs/2608.14036
#+authors: A. Author, B. Author
#+venue: arXiv, 2026

* Why the checkout request still fails

A checkout request has to reach an external service. With no prior experience the agent skips that service; handed a working record, it makes the call but orders the steps wrongly. Both runs end with the same failure label, and the old benchmark cannot see that the reasons differ.

* The same experience leads to different results

The authors hold the task and the old trajectory fixed and change only how the experience reaches the agent. A standardised skill compresses the record into a procedural anchor, and compress - retrieve - adapt - verify becomes one chain of effect. The central comparison shows six more completions in every hundred attempts, which supports the claim that the representation changes how usable the experience is.

* Once the skill library grows

A larger library brings retrieval into the chain. Hitting the right card and finishing the task stop being the same ruler; the card still has to fit the current conditions and survive a real run.

Skills preserve the action relations, not the right of those actions to stay correct.
`;

const validMap = `# ljg-paper research record

## Source and scope of material
- Format version: 3
- Location in the source: https://arxiv.org/abs/2608.14036
- Paper information: 2608.14036 | Demystifying Skills | A. Author | v1
- Source hash: sha256:abcdef0123456789
- What the material supports: the skill mechanism for terminal agents; it does not generalise to every agent
- External-instruction scan: none found

## Research question and contribution
- Contribution type: measurement/benchmark - a mechanism benchmark
- Object of study: how an agent skill changes execution behaviour
- What existing methods lack: an overall success rate cannot show the behavioural path behind success or failure
- Main contribution: a same-source three-way comparison plus a trajectory classification framework
- Input, processing and output: one old trajectory -> three representations -> paired execution -> divergent behaviour
- Research questions or threads that cannot be dropped: representation of experience | outcome labels | transfer across tools | retrieval from a skill library
- Why the threads belong to one paper: together the four threads locate where a skill breaks between old experience and task outcome
- Evidential support per thread: representation: supported - paired experiment | outcome labels: partly supported - mixed results | transfer across tools: partly supported - only a figure | retrieval: supported - separate experiment
- Claims the paper does not make: it invents no stronger skill and proves no general capability gain
- Paper-specific statements in the body: checkout request | procedural anchor
- Question and contribution statements in the first two sections: checkout request | procedural anchor
- Paper in brief: an overall score hides the mechanism, so the authors use a same-source comparison to find evidence and limits for how a skill stabilises action relations
- How it differs from other papers: an ordinary memory paper would lack both the same-source three-way comparison and the trajectory classification

## The reader's change of understanding
- The concrete question it starts from: a checkout request has to make a real call and finish in time
- How it would have been understood or handled before: if the run finally passes, the skill must be working
- What evidence requires adding to or correcting that understanding: the same failure label comes from skipping the call and from ordering the steps wrongly
- What relation, practice or criterion the authors added: compare where execution diverges instead of reading only the endpoint
- Back at the original question, what changed in the judgment: you start looking for which stretch of behaviour was stabilised
- What still needs answering: how a skill travels from experience to outcome
- The question or relation running through the piece: the skill usage lifecycle
- How the cases are chosen and connected: checkout explains representation and the library explains retrieval, so the earlier result forces the change of scene
- Where the ending returns to: how to judge whether a skill is useful
- Three-sentence paraphrase by an unfamiliar reader: the old benchmark read only outcomes; the authors compare behavioural paths; a skill stabilises actions but carries lifecycle limits
- Grounding and simplification limits of the illustrations: checkout comes from the appendix trajectories and the library from a separate retrieval experiment, and the body never writes them as one causal experiment

## Mechanism and explanation of results
- Is there a unified mechanism: yes - the value of a skill is produced by the whole lifecycle together
- The unified mechanism: compress - retrieve - adapt - verify
- Input, starting point or current state: old execution trajectories containing both successes and failures
- Key acting relation: compression keeps the action relations, and the current situation decides whether they apply
- Direction of the result or endpoint: the task completes and real verification passes
- How it explains two different findings: it yields both the advantage of a skill over a working record and the failure of a correct skill that is misapplied
- Prediction after changing a relevant condition, and its grounds: as similar skills multiply, precise retrieval degrades first
- Boundary of failure: a procedural anchor cannot rescue a wrong algorithm or incompatible conditions
- Mechanism statements in the body: compress - retrieve - adapt - verify
- Does the mechanism need explaining in the first two sections: yes - every later experiment is organised by this chain
- Are diagrams needed: no - one line naming the chain keeps the relation visible
- Which example explains each diagram: the body runs the checkout request and the skill library directly

## Central experiment or argument
- What the experiment asks: whether changing the representation of the same experience changes execution
- What was held fixed: the task, the agent, the budget and the old trajectory
- What was changed: no experience, a working record, a standardised skill
- What it was compared against: the skill against the working record, keeping the no-experience baseline
- Main result and exceptions: the skill improves steadily over the working record and more weakly over no experience
- What the result means in practice: about six more completions in every hundred attempts than the working record
- Which judgment this result changes: the representation of experience, not its mere presence, decides usability
- What this result cannot establish: it cannot prove that skills generally beat no experience
- Core evidence statements in the body: six more completions in every hundred attempts
- Main result statement in the body: six more completions in every hundred attempts
- Is a supplementary quantitative comparison included: no - the central comparison already changes the judgment and the remaining exact figures stay for reference
- What the supplementary comparison does: no supplementary comparison; the cases explain the difference in execution

## Evidence record
- [evidence] Name: paired success gap | Role: core | Location: Table 10 | Direct result in the paper: the skill improves over the working record | Judgment supported: compressing experience changes usability | Matching statement in the body: six more completions in every hundred attempts | Decision: into the body | Reason: without it the skill cannot be told apart from the working record
- [evidence] Name: three checkout trajectories | Role: supporting | Location: Appendix A3 | Direct result in the paper: the three paths diverge at different actions | Judgment supported: the overall label hides the mechanism | Matching statement in the body: skips that service | Decision: into the body | Reason: without it there is no visible pressure from the old blind spot
- [evidence] Name: full retrieval matrix | Role: reference | Location: Table 15 | Direct result in the paper: full metrics across pool sizes and distractors | Judgment supported: retrieval is an independent bottleneck | Matching statement in the body: none | Decision: reference only | Reason: it does not affect the main line but it does affect completeness of verification

## Cases and experiments in the body
- [frontstage] Name: checkout request | Main job: expose the behavioural path the overall score hides | Setup or starting point: a real call under a time limit | Result or consequence: three runs end for different reasons | What it helps understand: look at the divergence, not the endpoint | Connection to what follows: what the representation changed
- [frontstage] Name: skill library | Main job: expose the limits of retrieval and adaptation | Setup or starting point: the pool of candidate skills grows | Result or consequence: a hit and a completion stop moving together | What it helps understand: a file existing is not the effect succeeding | Connection to what follows: where the lifecycle breaks

## Section organization and connections
- The question the opening answers: why the same failure label comes from different reasons
- Order of explanation: the score hides the path -> same-source three-way comparison -> action relations are stabilised -> retrieval and adaptation become the new limit
- Connections between cases: only after representation is shown to change behaviour is there a reason to enter retrieval
- Section-swap check: if the library came first the reader would not yet know why the representation is worth tracking
- Explanation with the numbers removed: with the figures dropped, the central comparison still answers whether representation changes usability
- What would be lost if only conclusions were kept: keeping only checkout loses the lifecycle, and keeping only conclusions loses the attribution from the comparison

## Ending check
- What understanding the paper finally adds or corrects: a skill file existing, or an overall score rising, does not mean the skill mechanism is reliable
- Which earlier findings the ending rests on: the three-way checkout divergence and the retrieval limits of the library
- Matching statement at the end of the body: Skills preserve the action relations
- How the ending connects to this paper: an ordinary prompting paper has neither same-source representations nor a library lifecycle
- Does the ending add new evidence, terms or recommendations: no - it only compresses relations the body already ran

## Independent reading-check record
- Missing premises and how they were handled: this fixture only checks that the record can be filled in; it claims no real reading check
- Score-free paraphrase of the whole piece: the old benchmark read only endpoints, the same-source comparison makes the divergence visible, and a skill stabilises actions while remaining bound by retrieval, adaptation and verification
- The explanation the reader remembers first: how experience becomes action through compression, retrieval, adaptation and verification
- The reader's account of how the sections connect: the library cannot come first, because the reader would not yet know why representation changes action
- Whole-text verdict: NARRATIVE_PASS
- Research question: an overall success rate cannot show when or how a skill acts
- The authors' main contribution: the same-source paired experiment and the trajectory classification framework
- Input -> components/relations -> output: old trajectory -> representation -> retrieval -> adaptation -> verification -> outcome
- Central experiment: question / fixed / comparison / result / meaning: with the task and trajectory fixed, the working record is compared with the skill, and the skill proves easier to use
- Scope and limits of the evidence: terminal tasks, limited models and samples; it cannot prove a general capability gain
- Question-and-contribution verdict: PAPER_IDENTITY_PASS
- Three-sentence paraphrase of the change in understanding: the old benchmark read only endpoints; the authors make the path visible; a skill mainly stabilises actions and is bound by a lifecycle
- Understanding verdict: UNDERSTANDING_PASS
- Explanation of results: the lifecycle yields both the representation advantage and misapplication failures, and predicts that multiplying similar skills hurts retrieval first
- Reconstruction verdict: RECONSTRUCTION_PASS
`;

describe("validate ljg-paper note", () => {
  test("accepts a complete version 3 record", () => {
    const result = validate(validNote, filename, validMap);
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.stats.frontstage_count).toBe(2);
    expect(result.stats.background_evidence_count).toBe(1);
    expect(result.stats.numeric_tokens).toBe(0);
    expect(result.stats.numeric_paragraphs).toBe(0);
  });

  test("requires the paper-map research record", () => {
    const result = validate(validNote, filename);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("--map");
  });

  test("rejects a polished record that lost the paper's identity", () => {
    const broken = validMap
      .replace(/^- Main contribution: .*$/m, "- Main contribution: ")
      .replace(/^- Paper in brief: .*$/m, "- Paper in brief: growth and change");
    const result = validate(validNote, filename, broken);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("Main contribution");
  });

  test("requires the indispensable threads and their evidential support", () => {
    const broken = validMap.replace(/^- Evidential support per thread: .*$/m, "- Evidential support per thread: ");
    const result = validate(validNote, filename, broken);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("Evidential support per thread");
  });

  test("requires orientation by the end of the second heading", () => {
    const lateNote = validNote.replace("a procedural anchor, and compress", "an operating rule, and compress");
    const result = validate(lateNote, filename, validMap);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("first two top-level headings");
  });

  test("accepts an explicit no-mechanism path without forcing a formula", () => {
    const noMechanism = validMap
      .replace(/^- Is there a unified mechanism: .*$/m, "- Is there a unified mechanism: no - the paper offers two measurement relations that cannot be merged")
      .replace(/^- The unified mechanism: .*$/m, "- The unified mechanism: not found");
    const result = validate(validNote, filename, noMechanism);
    expect(result.errors).toEqual([]);
  });

  test("rejects a declared mechanism that appears too late", () => {
    const lateNote = validNote
      .replace("and compress - retrieve - adapt - verify becomes one chain of effect", "and handling the experience becomes one chain of effect")
      .replace("A larger library brings retrieval into the chain.", "A larger library brings compress - retrieve - adapt - verify into the chain.");
    const result = validate(lateNote, filename, validMap);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("appear too late");
  });

  test("rejects backstage language and generic headings in the visible note", () => {
    const broken = validNote
      .replace("* Once the skill library grows", "* Experimental results")
      .replace("Skills preserve the action relations", "The evidence ledger says Decision: into the body");
    const result = validate(broken, filename, validMap);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("generic section labels");
    expect(result.errors.join("\n")).toContain("research-record");
  });

  test("warns when a paragraph becomes a pile of metrics", () => {
    const metricPile = validNote.replace(
      "shows six more completions in every hundred attempts",
      "shows 61.9%, 55.9%, 59.1%, 65.7% and 4.5%",
    );
    const map = validMap.replaceAll("six more completions in every hundred attempts", "The central comparison shows");
    const result = validate(metricPile, filename, map);
    expect(result.warnings.join("\n")).toContain("5-6 numbers");
  });

  test("flags a severe metric pile for review under version 3", () => {
    const metricPile = validNote.replace(
      "shows six more completions in every hundred attempts",
      "shows 61.9%, 55.9%, 59.1%, 65.7%, 4.5%, 23.5% and 10.0%",
    );
    const map = validMap.replaceAll("six more completions in every hundred attempts", "The central comparison shows");
    const result = validate(metricPile, filename, map);
    expect(result.errors).toEqual([]);
    expect(result.warnings.join("\n")).toContain("at least 7 numbers");
  });

  test("applies the old numeric limit when the record declares version 2", () => {
    const metricPile = validNote.replace(
      "shows six more completions in every hundred attempts",
      "shows 61.9%, 55.9%, 59.1%, 65.7%, 4.5%, 23.5% and 10.0%",
    );
    const map = validMap
      .replace("- Format version: 3", "- Format version: 2")
      .replaceAll("six more completions in every hundred attempts", "The central comparison shows");
    const result = validate(metricPile, filename, map);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("old-version numeric limit");
    expect(result.warnings.join("\n")).toContain("compatibility mode");
  });

  test("requires the main result statement declared in the paper-map", () => {
    const broken = validMap.replace(/^- Main result statement in the body: .*\n/m, "");
    const result = validate(validNote, filename, broken);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("Main result statement in the body");
  });

  test("requires the whole-text reading pass", () => {
    const failed = validMap.replace("- Whole-text verdict: NARRATIVE_PASS", "- Whole-text verdict: FAIL");
    const result = validate(validNote, filename, failed);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("NARRATIVE_PASS");
  });

  test("rejects digits in the score-free paraphrase", () => {
    const failed = validMap.replace(
      /^- Score-free paraphrase of the whole piece: .*$/m,
      "- Score-free paraphrase of the whole piece: the old benchmark read only endpoints, and 61.9% against 55.9% proves the skill is better",
    );
    const map = failed.replace("- Format version: 3", "- Format version: 2");
    const result = validate(validNote, filename, map);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("score-free paraphrase");
  });

  test("every reader verdict still blocks delivery", () => {
    for (const pass of ["NARRATIVE_PASS", "PAPER_IDENTITY_PASS", "UNDERSTANDING_PASS", "RECONSTRUCTION_PASS"]) {
      expect(validate(validNote, filename, validMap.replace(pass, "FAIL")).ok).toBe(false);
    }
  });

  test("requires a diagram only when the record elects one", () => {
    const needsVisual = validMap
      .replace(/^- Are diagrams needed: .*$/m, "- Are diagrams needed: yes - the order needs a figure")
      .replace(/^- Which example explains each diagram: .*$/m, "- Which example explains each diagram: skill library");
    const result = validate(validNote, filename, needsVisual);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("no example block");
  });

  test("rejects source and identifier drift", () => {
    const broken = validNote
      .replace("#+identifier: 20260820T091641", "#+identifier: 20260820T000000")
      .replace("#+source: https://", "#+source: paper at https://");
    const result = validate(broken, filename, validMap);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("IDENTIFIER");
    expect(result.errors.join("\n")).toContain("bare original URL");
  });

  test("accepts one bare absolute local source path", () => {
    const local = validNote.replace("#+source: https://arxiv.org/abs/2608.14036", "#+source: /tmp/papers/source paper.pdf");
    const map = validMap.replace("- Location in the source: https://arxiv.org/abs/2608.14036", "- Location in the source: /tmp/papers/source paper.pdf");
    const result = validate(local, filename, map);
    expect(result.errors).toEqual([]);
  });
});

describe("version 3 evidence-based writing rules", () => {
  test("does not force supporting or reference-only evidence", () => {
    const map = validMap.replace(/^- \[evidence\].*Role: (?:supporting|reference).*\n/gm, "");
    expect(validate(validNote, filename, map).errors).toEqual([]);
    const noCore = map.replace(/^- \[evidence\].*\n/gm, "");
    expect(validate(validNote, filename, noCore).ok).toBe(false);
  });

  test("allows complementary quantitative results in a method paper", () => {
    const note = validNote.replace(
      "A larger library brings retrieval into the chain.",
      "A larger library brings retrieval into the chain.\n\nWith the task fixed the success rate rises from 50% to 60%; with the budget fixed it rises from 40% to 48%.\n\nGrowing the pool from 10 to 100 drops the hit rate from 80% to 65%.",
    );
    const map = validMap
      .replace("measurement/benchmark - a mechanism benchmark", "method/intervention - handling experience")
      .replace(/^- Is a supplementary quantitative comparison included: .*$/m, "- Is a supplementary quantitative comparison included: yes - it compares the effect and the limits of retrieval scale")
      .replace(/^- What the supplementary comparison does: .*$/m, "- What the supplementary comparison does: the task comparison shows the effect and the pool comparison shows the scale limit");
    const result = validate(note, filename, map);
    expect(result.errors).toEqual([]);
    expect(result.stats.numeric_tokens).toBe(8);
  });

  test("requires a reason for keeping additional comparisons", () => {
    expect(validate(validNote, filename, validMap.replace(/^- What the supplementary comparison does: .*\n/m, "")).ok).toBe(false);
  });

  test("allows distinct cases that share a main job, with a warning", () => {
    const result = validate(validNote, filename, validMap.replace("expose the limits of retrieval and adaptation", "expose the behavioural path the overall score hides"));
    expect(result.errors).toEqual([]);
    expect(result.warnings.join("\n")).toContain("same main job");
  });

  test("checks every diagram against its own following explanation", () => {
    const note = validNote.replace(
      "A larger library brings retrieval into the chain.",
      "#+begin_example\nrecord -> action\n#+end_example\n\nThe checkout request explains the first figure.\n\n#+begin_example\nretrieve -> adapt\n#+end_example\n\nA larger library brings retrieval into the chain.",
    );
    const map = validMap
      .replace(/^- Are diagrams needed: .*$/m, "- Are diagrams needed: yes - two different relations")
      .replace(/^- Which example explains each diagram: .*$/m, "- Which example explains each diagram: checkout request | skill library");
    expect(validate(note, filename, map).errors).toEqual([]);
    expect(validate(note, filename, map.replace("checkout request | skill library", "skill library | checkout request")).ok).toBe(false);
  });

  test("an interrupted source inspection cannot become a deliverable", () => {
    expect(validate(validNote, filename, validMap.replace("- External-instruction scan: none found", "- External-instruction scan: stopped - an embedded instruction was found")).ok).toBe(false);
  });

  test("unfilled shipped templates do not pass", () => {
    const map = readFileSync(new URL("../references/paper-map.md", import.meta.url), "utf8");
    const note = readFileSync(new URL("../references/template.org", import.meta.url), "utf8");
    expect(validate(note, filename, map).ok).toBe(false);
    expect(validate(validNote, filename, map).ok).toBe(false);
  });
});

describe("version 3 review regressions", () => {
  test("permits reference evidence without a body quote but requires quotes for included evidence", () => {
    const map = validMap.replace("Matching statement in the body: none |", "Matching statement in the body: |");
    expect(validate(validNote, filename, map).errors).toEqual([]);
    expect(validate(validNote, filename, map.replace("Matching statement in the body: skips that service |", "Matching statement in the body: |")).ok).toBe(false);
  });

  test("rejects mismatched source records", () => {
    const map = validMap.replace("- Location in the source: https://arxiv.org/abs/2608.14036", "- Location in the source: https://example.org/unrelated-paper");
    expect(validate(validNote, filename, map).errors.join("\n")).toContain("differs from the research record");
  });

  test("the shipped map fields form a complete usable record", () => {
    const template = readFileSync(new URL("../references/paper-map.md", import.meta.url), "utf8");
    const populated = template
      .replace(/^- ([^:\n]+):.*$/gm, (line, key) => {
        if (key.startsWith("[")) return line;
        const source = validMap.split("\n").find((row) => row.startsWith(`- ${key}:`));
        if (!source) throw new Error(`Template field missing from fixture: ${key}`);
        return source;
      })
      .replace(/^- \[evidence\].*$/m, validMap.match(/^- \[evidence\].*$/gm)!.join("\n"))
      .replace(/^- \[frontstage\].*$/m, validMap.match(/^- \[frontstage\].*$/gm)!.join("\n"));
    expect(validate(validNote, filename, populated).errors).toEqual([]);
  });
});
