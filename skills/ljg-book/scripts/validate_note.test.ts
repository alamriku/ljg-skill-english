import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { validate } from "./validate_note";

const filename = "20260812T120000--book-example__book.org";

const defaultHeadings = [
  "Four sentences in front of you - would you nod",
  "Cover the last sentence and a piece of the evidence disappears",
  "Read the same sentence again and you start waiting for something",
];

function note(options: {
  identifier?: string;
  opening?: string;
  firstBody?: string;
  headings?: string[];
  diagram?: string;
  description?: string;
  tail?: string;
  essenceHeading?: string;
  essenceBody?: string;
  omitEssence?: boolean;
  afterEssence?: string;
  markdown?: boolean;
} = {}): string {
  const md = options.markdown ?? false;
  const h = md ? "#" : "*";
  const headings = options.headings ?? defaultHeadings;
  const bodies = headings.map((heading, index) => {
    const body = index === 0
      ? options.firstBody ?? "Four sentences sit in front of Lee. He nods along with the alarm in the first three. Cover the last one and he sees that the first three only establish that the problem is serious. That is a reason that has not yet reached the conclusion."
      : index === headings.length - 1
        ? "Back at the same sentence, Lee is in no hurry to agree or object. He now asks first which comparison would establish that the heavier penalty actually works."
        : "A regional comparison is set beside the original judgment. After the penalty was raised, the accident rate did not fall, and the nod stops. A serious problem does not mean this remedy works.";
    return `${h} ${heading}\n\n${body}\n`;
  }).join("\n");
  const essence = options.omitEssence ? "" : `
${h} ${options.essenceHeading ?? "What stays with you afterwards"}

${options.essenceBody ?? "A serious problem does not by itself establish that the penalty works; what the book really leaves you with is the habit of finding the missing step between a reason and its conclusion, and then waiting for the comparison that could supply it."}
`;

  const header = md
    ? [
      "title: Book breakdown: Example",
      "subtitle: An Author | why one conclusion starts waiting for evidence",
      options.description === "" ? "" : `description: ${options.description ?? "Four sentences carry you into a nod; cover the last one and the gap between reason and conclusion appears."}`,
      "date: [2026-08-12 Wed 12:00]",
      "tags: book test",
      `identifier: ${options.identifier ?? "20260812T120000"}`,
    ].filter(Boolean).join("\n")
    : [
      "#+TITLE: Book breakdown: Example",
      "#+SUBTITLE: An Author | why one conclusion starts waiting for evidence",
      options.description === "" ? "" : `#+DESCRIPTION: ${options.description ?? "Four sentences carry you into a nod; cover the last one and the gap between reason and conclusion appears."}`,
      "#+DATE: [2026-08-12 Wed 12:00]",
      "#+FILETAGS: :book:test:",
      `#+IDENTIFIER: ${options.identifier ?? "20260812T120000"}`,
    ].filter(Boolean).join("\n");

  return `${header}\n\n${options.opening ?? ""}${bodies}\n${options.diagram ?? ""}${options.tail ?? ""}${essence}${options.afterEssence ?? ""}`;
}

function coverage(options: {
  grade?: "complete breakdown" | "partial breakdown" | "provisional";
  support?: string;
  version?: string;
  anchors?: string;
  generator?: string;
  representation?: string;
  threads?: string;
  candidates?: number;
  zones?: string[];
  omit?: string[];
} = {}): string {
  const grade = options.grade ?? "complete breakdown";
  const support = options.support ?? "yes - the book is enough to reconstruct how the judgment was changed by evidence";
  const version = options.version ?? "3";
  const anchors = options.anchors ?? "Four sentences sit in front of Lee|A regional comparison|which comparison would establish";
  const generator = options.generator ?? "yes - the gap between reason and conclusion generates every later question";
  const representation = options.representation ?? "no - the relation is already carried by the sentences";
  const zones = options.zones ?? ["starting-point", "pressure", "revision", "boundary"];
  const threadRows = options.threads ?? "- [thread] Name: Four sentences sit in front of Lee | Starting point: he nods along with the alarm | Key advance: the last sentence is covered | Change before and after: from \"the problem is serious, so punish harder\" to \"serious does not mean this works\" | Reason for the switch: the same object carries every stage | Grounds and boundary: the book's own worked case; no survey data invented";

  const candidateRow = (n: number) =>
    `- [candidate] Name: part ${n} | Location: chapter ${n} | Problem it solves: it supplies step ${n} of the support | Relation to the other parts: it feeds the comparison that follows | Decision: keep | Deletion test: removing it leaves the conclusion unsupported`;
  const candidates = Array.from({ length: options.candidates ?? 5 }, (_, i) => candidateRow(i + 1)).join("\n");

  const lines = [
    `- Coverage contract version: ${version}`,
    `- Material grade: ${grade}`,
    "- Primary material: the full text, read end to end",
    "- What it supports: the whole argument and its ending; it does not support claims about the author's biography",
    `- Does the material support the path of changing understanding: ${support}`,
    "- What kind or form of book this is: a short handbook of rules for supporting a conclusion",
    "- Starting point, main change and endpoint: a confident nod, then the covered sentence, ending with a demand for comparison",
    "- The core understanding: at first severity seemed to justify the remedy; the book shows the step in between is missing",
    "- How the parts connect: the examples supply the gap, the rules name it, and the final chapters hand it to a reader",
    "- What the author most wants to correct or preserve: correct winning by restatement, preserve the demand for a checkable reason",
    `- Whole-book anchors that must appear in the body: ${anchors}`,
    threadRows,
    `- Is there a whole-book generator: ${generator}`,
    "- The whole-book generator: nod -> cover the conclusion -> expose the gap -> wait for the comparison",
    "- How the generator runs through at least two widely separated turns: it explains the opening nod and the closing demand for a comparison; it transfers to the pool example",
    "- Where the generator fails: where no comparison is possible at all, the demand cannot be met and the book only narrows the claim",
    `- Are visual representations needed: ${representation}`,
    "- Where and why diagrams are used: not used; the relation is short enough to carry in prose",
    ...zones.map((zone) => `- [${zone}] Location: chapter 2 | Evidence: the worked case in the text`),
    candidates,
    "- Counter-evidence and selection: a reader could argue severity alone justifies action; that is kept and answered rather than dropped",
    "- Whole-book paraphrase and reconstruction of relations: the evaluator restated the nod, the covered sentence and the comparison demand from the body",
    "- Reading breaks and revisions: the evaluator had to supply the link at the second heading; the paragraph was rewritten and reread",
    "- With the final section covered, is the author's concern understandable: yes, the first and third sections already show it",
    "- Which two widely separated turns in the body jointly support it: the opening nod and the closing demand for a comparison",
  ];
  const omit = options.omit ?? [];
  return lines
    .filter((line) => !omit.some((field) => line.startsWith(`- ${field}:`)))
    .join("\n") + "\n";
}

describe("validate ljg-book note", () => {
  test("accepts a complete version 3 record", () => {
    const result = validate(note(), filename, coverage());
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.checks.coverage_contract_version).toBe("3");
    expect(result.checks.material_grade).toBe("complete breakdown");
    expect(result.checks.thread_count).toBe(1);
    expect(result.checks.coverage_zones).toBe(4);
    expect(result.checks.coverage_candidate_count).toBe(5);
    expect(result.semantic_assessment).toBe("not_performed");
  });

  test("keeps Markdown notes on the same contract", () => {
    const result = validate(note({ markdown: true }), "20260812T120000--book-example__book.md", coverage());
    expect(result.errors).toEqual([]);
    expect(result.checks.format).toBe("markdown");
  });

  for (const count of [1, 2, 5]) {
    test(`accepts ${count} content-led heading(s)`, () => {
      const headings = Array.from({ length: count }, (_, i) => `A turn the body actually takes, number ${i + 1}`);
      expect(validate(note({ headings }), filename, coverage({ anchors: "A turn the body actually takes" })).errors).toEqual([]);
    });
  }

  test("requires a body heading before the final section", () => {
    const result = validate(note({ headings: [] }), filename, coverage());
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("before the final section");
  });

  test("requires the final section to exist, be last and hold one paragraph", () => {
    expect(validate(note({ omitEssence: true }), filename, coverage()).errors.join("\n"))
      .toContain("must end with the top-level heading");
    expect(validate(note({ afterEssence: "\n* A later heading\n\nBody.\n" }), filename, coverage()).errors.join("\n"))
      .toContain("must be the last top-level heading");
    expect(validate(note({ essenceBody: "First paragraph.\n\nSecond paragraph." }), filename, coverage()).errors.join("\n"))
      .toContain("exactly one paragraph");
  });

  test("rejects a categorized list in the final section", () => {
    const result = validate(note({ essenceBody: "- structure: ...\n- insight: ..." }), filename, coverage());
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("categorized list");
  });

  test("records final-section length without judging concision", () => {
    const long = "This is a deliberately long closing paragraph that keeps going well past any comfortable length so that the checks can record its size without ever deciding whether the writing is good, concise or worth keeping as it stands today.";
    const result = validate(note({ essenceBody: long }), filename, coverage());
    expect(result.errors).toEqual([]);
    expect(Number(result.checks.essence_words)).toBeGreaterThan(30);
  });

  test("rejects identifier mismatch and missing coverage", () => {
    const mismatch = validate(note({ identifier: "20260101T000000" }), filename, coverage());
    expect(mismatch.errors.join("\n")).toContain("IDENTIFIER");
    const noCoverage = validate(note(), filename);
    expect(noCoverage.errors.join("\n")).toContain("--coverage");
  });

  test("requires the note metadata", () => {
    const result = validate(note({ description: "" }), filename, coverage());
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("#+DESCRIPTION");
  });

  test("rejects exposed x/R/f/E labels", () => {
    const result = validate(note({ tail: "\n- *x*: the object\n" }), filename, coverage());
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("x/R/f/E");
  });

  test("rejects a visible material grade and a calibration section", () => {
    expect(validate(note({ tail: "\nMaterial grade: complete breakdown\n" }), filename, coverage()).errors.join("\n"))
      .toContain("material grade belongs in the backstage");
    expect(validate(note({ tail: "\nSource calibration follows.\n" }), filename, coverage()).errors.join("\n"))
      .toContain("research-calibration");
  });

  test("rejects backstage verification language in the body", () => {
    const result = validate(note({ tail: "\nThis round verified the appendix against the original.\n" }), filename, coverage());
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("backstage verification language");
  });

  test("allows ordinary prose that merely mentions rounds of reading", () => {
    const result = validate(note({ tail: "\nThe argument goes around once more before the chapter ends.\n" }), filename, coverage());
    expect(result.errors).toEqual([]);
  });
});

describe("coverage version 3 structure and record integrity", () => {
  test("rejects an unsupported contract version", () => {
    const result = validate(note(), filename, coverage({ version: "2" }));
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("not supported");
  });

  test("requires a valid material grade and the source boundary", () => {
    expect(validate(note(), filename, coverage({ grade: "full" as never })).errors.join("\n"))
      .toContain("material grade must be one of");
    expect(validate(note(), filename, coverage({ omit: ["Primary material"] })).errors.join("\n"))
      .toContain("primary material");
  });

  test("requires yes or no for the understanding-path gate", () => {
    const result = validate(note(), filename, coverage({ support: "probably, the material is quite good" }));
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("must answer yes or no");
  });

  test("rejects a complete breakdown whose material does not support the path", () => {
    const result = validate(note(), filename, coverage({ support: "no - only the table of contents was available" }));
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("complete breakdown cannot pass");
  });

  test("allows an honest no on a partial record, with a warning", () => {
    const result = validate(note(), filename, coverage({
      grade: "partial breakdown",
      support: "no - only the table of contents was available",
      anchors: "Four sentences sit in front of Lee",
      threads: "",
    }));
    expect(result.ok).toBe(true);
    expect(result.warnings.join("\n")).toContain("does not support the path");
  });

  for (const field of [
    "What kind or form of book this is",
    "How the parts connect",
    "What the author most wants to correct or preserve",
  ]) {
    test(`rejects a missing whole-book field: ${field}`, () => {
      const result = validate(note(), filename, coverage({ omit: [field] }));
      expect(result.ok).toBe(false);
      expect(result.errors.join("\n")).toContain(field);
    });
  }

  test("rejects generic, missing or too-few whole-book anchors", () => {
    expect(validate(note(), filename, coverage({ anchors: "question|relation|change" })).errors.join("\n"))
      .toContain("too generic");
    expect(validate(note(), filename, coverage({ anchors: "a phrase that is absent|A regional comparison|which comparison would establish" })).errors.join("\n"))
      .toContain("do not appear in the body");
    expect(validate(note(), filename, coverage({ anchors: "Four sentences sit in front of Lee" })).errors.join("\n"))
      .toContain("at least 3");
  });

  test("requires complete thread fields and thread names present in the body", () => {
    const incomplete = coverage({ threads: "- [thread] Name: Four sentences sit in front of Lee | Starting point: he nods" });
    expect(validate(note(), filename, incomplete).errors.join("\n")).toContain("every [thread] must fill in");
    const absent = coverage({ threads: "- [thread] Name: a thread never mentioned | Starting point: x | Key advance: y | Change before and after: z | Reason for the switch: w | Grounds and boundary: v" });
    expect(validate(note(), filename, absent).errors.join("\n")).toContain("do not appear in the body");
  });

  test("requires at least one thread when the material supports the path", () => {
    const result = validate(note(), filename, coverage({ threads: "" }));
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("at least 1 [thread]");
  });

  test("requires the generator fields when a generator is declared", () => {
    const result = validate(note(), filename, coverage({ omit: ["The whole-book generator"] }));
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("The whole-book generator");
  });

  test("accepts an explicit no-generator path without forcing a formula", () => {
    const result = validate(note(), filename, coverage({
      generator: "no - the two positions in the book cannot be unified",
      omit: ["The whole-book generator", "How the generator runs through at least two widely separated turns", "Where the generator fails"],
    }));
    expect(result.errors).toEqual([]);
    expect(result.checks.generator_exists).toContain("no");
  });

  test("requires an actual visual when the record elects one", () => {
    const elected = coverage({ representation: "yes - the branches are hard to hold in prose" });
    expect(validate(note(), filename, elected).errors.join("\n")).toContain("at least 1 actual example block or table");
    const withDiagram = note({ diagram: "#+begin_example\nreason -> conclusion\n#+end_example\n" });
    expect(validate(withDiagram, filename, elected).errors).toEqual([]);
  });

  test("rejects an over-wide ASCII diagram", () => {
    const wide = `#+begin_example\n${"x".repeat(90)}\n#+end_example\n`;
    const result = validate(note({ diagram: wide }), filename, coverage());
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("over 80");
  });

  test("requires the four evidence zones and five candidates for a complete breakdown", () => {
    expect(validate(note(), filename, coverage({ zones: ["starting-point", "pressure"] })).errors.join("\n"))
      .toContain("all four kinds of evidence");
    expect(validate(note(), filename, coverage({ candidates: 3 })).errors.join("\n"))
      .toContain("at least 5 candidate parts");
  });

  test("rejects an invalid candidate decision", () => {
    const bad = coverage().replace("Decision: keep | Deletion test: removing it leaves the conclusion unsupported", "Decision: maybe | Deletion test: removing it leaves the conclusion unsupported");
    const result = validate(note(), filename, bad);
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("keep/merge/delete");
  });

  test("requires the reading-check review fields", () => {
    const result = validate(note(), filename, coverage({ omit: ["Reading breaks and revisions"] }));
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("Reading breaks and revisions");
  });

  test("a supported partial record needs neither four zones nor five candidates", () => {
    const result = validate(note(), filename, coverage({
      grade: "partial breakdown",
      zones: ["starting-point"],
      candidates: 1,
      anchors: "Four sentences sit in front of Lee",
    }));
    expect(result.errors).toEqual([]);
  });

  test("the shipped template is not accepted while still unfilled", () => {
    const template = readFileSync(new URL("../references/coverage-map.md", import.meta.url), "utf8");
    const result = validate(note(), filename, template);
    expect(result.ok).toBe(false);
  });
});
