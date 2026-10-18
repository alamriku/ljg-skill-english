import { describe, expect, test } from "bun:test";
import { validateNoteText } from "./ValidateNote";

const ORG_PATH = "/tmp/20260823T010203--understanding-objective-function__is.org";
const MD_PATH = "/tmp/20260823T010203--understanding-objective-function__is.md";

const META = {
  definition:
    "An objective function is a ruler a solver uses to compare candidate solutions, which separates it from a constraint that only rules options out.",
  operation:
    "It takes each candidate, computes one comparable score from the chosen measure, and the search then changes direction toward the better score.",
  recognition:
    "An optimum is not an absolute best; it is the best under this particular ruler, so the question becomes which ruler was used.",
  guidance:
    "When you read the word optimal, first check which measure produced it, compare it with the measure you actually care about, and adjust the objective before tuning the search.",
  basis: "The definitions and worked examples in standard optimization textbooks.",
  falsifier:
    "If a solver improved its result without any comparable score over candidates, this explanation of the objective function fails and needs rewriting.",
};

const SECTION_ONE = [
  "Most people meet the phrase optimal result long before they meet the thing that produced it. The word sounds absolute, as if one answer had beaten every other answer in every respect.",
  "An objective function is narrower than that. It is a rule that turns each candidate solution into one comparable number, and a constraint is something else entirely: a constraint says which candidates are allowed at all.",
].join("\n\n");

const SECTION_TWO = [
  "Picture a delivery schedule. Each possible route becomes a number of minutes, and the search keeps whichever change lowers that number. Nothing in the procedure knows about fuel, fairness or driver fatigue unless those enter the same number.",
  "That is the whole operation: candidates in, one comparable score out, and a direction to move next. Change the score and the same search walks toward a different answer, even though the code never changed.",
].join("\n\n");

const SECTION_THREE = [
  "So the old judgment has to give way. An optimum is not a verdict about the world; it is a verdict under one ruler, and the ruler was chosen by a person.",
  "Next time a report says a result is optimal, ask which measure produced it before you ask how good the number is. If the measure leaves out what you care about, improving the search will only get you to the wrong place faster.",
].join("\n\n");

function orgNote(overrides: Partial<Record<string, string>> = {}): string {
  const meta = { ...META, ...overrides };
  return [
    "#+title: Understanding: the objective function",
    "#+date: [2026-08-23 Sun 01:02]",
    "#+identifier: 20260823T010203",
    "#+filetags: :is:act:",
    "#+schema: ljg-is-v5",
    `#+definition: ${meta.definition}`,
    `#+operation: ${meta.operation}`,
    `#+recognition: ${meta.recognition}`,
    `#+guidance: ${meta.guidance}`,
    `#+basis: ${meta.basis}`,
    `#+falsifier: ${meta.falsifier}`,
    "",
    "* Why optimal sounds bigger than it is",
    "",
    SECTION_ONE,
    "",
    "* One number, and the direction it pulls",
    "",
    SECTION_TWO,
    "",
    "* Reading the word optimal from now on",
    "",
    SECTION_THREE,
    "",
  ].join("\n");
}

function mdNote(): string {
  return orgNote()
    .replace(/^#\+/gmu, "")
    .replace(/^filetags: :is:act:$/mu, "tags: is act")
    .replace(/^\* /gmu, "# ");
}

describe("ljg-is v5 note validation", () => {
  test("accepts a complete v5 Org note", () => {
    const result = validateNoteText(ORG_PATH, orgNote());
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.schema).toBe("ljg-is-v5");
    expect(result.identifier).toBe("20260823T010203");
    expect(result.definition).toContain("ruler");
  });

  test("accepts the Markdown form of the same note", () => {
    const result = validateNoteText(MD_PATH, mdNote());
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  test("rejects a filename that does not follow the denote contract", () => {
    const result = validateNoteText("/tmp/20260823T010203--note__is.org", orgNote());
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toContain("filename");
  });

  test("rejects an identifier that disagrees with the filename", () => {
    const content = orgNote().replace("#+identifier: 20260823T010203", "#+identifier: 20260101T000000");
    const result = validateNoteText(ORG_PATH, content);
    expect(result.errors.join(" ")).toContain("identifier must match");
  });

  test("rejects a wrong or missing schema", () => {
    const content = orgNote().replace("#+schema: ljg-is-v5", "#+schema: ljg-is-v4");
    const result = validateNoteText(ORG_PATH, content);
    expect(result.errors.join(" ")).toContain("schema must be ljg-is-v5");
  });

  test("requires both the is and act tags", () => {
    const content = orgNote().replace("#+filetags: :is:act:", "#+filetags: :is:");
    const result = validateNoteText(ORG_PATH, content);
    expect(result.errors.join(" ")).toContain("is and act");
  });

  test("rejects field-style headings", () => {
    const content = orgNote().replace("* Why optimal sounds bigger than it is", "* Definition");
    const result = validateNoteText(ORG_PATH, content);
    expect(result.errors.join(" ")).toContain("headings must be specific");
  });

  test("rejects bullet lists in the body", () => {
    const content = orgNote().replace(
      "Most people meet the phrase",
      "- a list item that should not be here\n\nMost people meet the phrase",
    );
    const result = validateNoteText(ORG_PATH, content);
    expect(result.errors.join(" ")).toContain("bullets");
  });

  test("rejects exposed field labels inside the body", () => {
    const content = orgNote().replace(
      "So the old judgment has to give way.",
      "Guidance: check the measure first. So the old judgment has to give way.",
    );
    const result = validateNoteText(ORG_PATH, content);
    expect(result.errors.join(" ")).toContain("field labels");
  });

  test("rejects an empty tautology as the definition", () => {
    const result = validateNoteText(ORG_PATH, orgNote({ definition: "As the name suggests, it is the function of the objective." }));
    expect(result.errors.join(" ")).toContain("definition must give");
  });

  test("rejects an operation that only restates the use", () => {
    const result = validateNoteText(ORG_PATH, orgNote({ operation: "It is important." }));
    expect(result.errors.join(" ")).toContain("operation must state");
  });

  test("rejects universal advice as guidance", () => {
    const result = validateNoteText(ORG_PATH, orgNote({ guidance: "Stay aware of this topic and consider it holistically in future work." }));
    expect(result.errors.join(" ")).toContain("universal advice");
  });

  test("rejects hearsay as the factual basis", () => {
    const result = validateNoteText(ORG_PATH, orgNote({ basis: "Some say this is how solvers work, probably." }));
    expect(result.errors.join(" ")).toContain("hearsay");
  });

  test("rejects a falsifier with no failing condition", () => {
    const result = validateNoteText(ORG_PATH, orgNote({ falsifier: "More research would help here." }));
    expect(result.errors.join(" ")).toContain("falsifier");
  });

  test("rejects template placeholders left in the file", () => {
    const content = orgNote().replace("#+basis: " + META.basis, "#+basis: {the factual basis}");
    const result = validateNoteText(ORG_PATH, content);
    expect(result.errors.join(" ")).toContain("placeholders");
  });

  test("rejects Markdown syntax inside an Org note", () => {
    const content = orgNote().replace("* Why optimal sounds bigger than it is", "## Why optimal sounds bigger than it is");
    const result = validateNoteText(ORG_PATH, content);
    expect(result.errors.join(" ")).toContain("Markdown headings");
  });

  test("rejects a body that is too short", () => {
    const content = orgNote()
      .replace(SECTION_ONE, "Short.")
      .replace(SECTION_TWO, "Also short.")
      .replace(SECTION_THREE, "Still short.");
    const result = validateNoteText(ORG_PATH, content);
    expect(result.errors.join(" ")).toContain("too short");
  });

  test("reports a missing file path as an error rather than throwing", () => {
    const result = validateNoteText("/tmp/note.txt", orgNote());
    expect(result.errors.join(" ")).toContain("extension");
  });
});
