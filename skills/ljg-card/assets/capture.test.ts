import { describe, expect, test } from "bun:test";
import {
  findUnresolvedPlaceholders,
  MAX_FULLPAGE_HEIGHT,
  validateWhiteboardSnapshot,
  WHITEBOARD_LOCAL_SHAPES,
  WHITEBOARD_RELATION_KINDS,
  WHITEBOARD_RELATION_VISIBILITIES,
  WHITEBOARD_STEP_ROLES,
  type WhiteboardValidationSnapshot,
} from "./capture";

const ledger = {
  version: 2,
  source_sha256: "a".repeat(64),
  source_sections: [
    { id: "src-01", disposition: "rendered", step_ids: ["step-01", "step-02"] },
    { id: "src-02", disposition: "rendered", step_ids: ["step-03", "step-04"] },
  ],
  steps: [
    {
      id: "step-01",
      role: "question",
      source_refs: ["src-01"],
      claim: "Why did the experience not change the model?",
      support: "The agent accumulated a trajectory inside the context.",
      residue: "When the task ended, the model parameters had not changed with it.",
      must_render: true,
      presentation: "typography",
    },
    {
      id: "step-02",
      role: "tension",
      source_refs: ["src-01"],
      claim: "Remembering briefly is not the same as learning.",
      support: "Once the context ends, the experience never stably enters the next task.",
      residue: "",
      must_render: true,
      presentation: "text",
    },
    {
      id: "step-03",
      role: "conclusion",
      source_refs: ["src-02"],
      claim: "Continual learning needs a memory layer that can be updated and recalled.",
      support: "Different write depths carry different update costs.",
      residue: "",
      must_render: true,
      presentation: "matrix",
    },
    {
      id: "step-04",
      role: "boundary",
      source_refs: ["src-02"],
      claim: "The engineering route is not yet human-level continual learning.",
      support: "Forgetting and non-i.i.d. updates remain unsolved.",
      residue: "",
      must_render: true,
      presentation: "text",
    },
  ],
  relations: [
    { id: "rel-01", from: "step-01", to: "step-02", kind: "deepen", visibility: "implicit", bridge: "" },
    { id: "rel-02", from: "step-02", to: "step-03", kind: "question", visibility: "visible", bridge: "If experience is to persist across tasks, there must be a mechanism that writes it down and recalls it." },
    { id: "rel-03", from: "step-03", to: "step-04", kind: "boundary", visibility: "visible", bridge: "Even once experience can be written down, forgetting and online updates still limit whether it accumulates stably." },
  ],
};

const hashText = (value: string): string => new Bun.CryptoHasher("sha256")
  .update(new TextEncoder().encode(value))
  .digest("hex");

const sourceInventory = {
  version: 1,
  source_sha256: ledger.source_sha256,
  section_count: 2,
  sections: [
    { id: "src-01", text: "Question and premise.", text_sha256: hashText("Question and premise.") },
    { id: "src-02", text: "Conclusion and boundary.", text_sha256: hashText("Conclusion and boundary.") },
  ],
};

const validSnapshot = (): WhiteboardValidationSnapshot => ({
  title: "How experience becomes model capability",
  question: "How does experience from one task become capability still callable in the next?",
  spineCount: 1,
  globalLayoutCount: 0,
  ledger: structuredClone(ledger),
  steps: ledger.steps.map(step => ({
    id: step.id,
    role: step.role,
    sourceRefs: step.source_refs,
    claim: step.claim,
    support: step.support,
    residue: step.residue,
  })),
  relations: ledger.relations.map(relation => ({
    ...relation,
    ariaLabel: relation.visibility === "visible" ? relation.bridge : "",
    hasStem: relation.visibility === "visible",
    hasArrowhead: relation.visibility === "visible",
  })),
  branches: [],
  localShapes: ["matrix"],
  sourceInventory: structuredClone(sourceInventory),
  sourceBytesSha256: ledger.source_sha256,
});

describe("whiteboard reasoning-spine contract", () => {
  test("recognizes reasoning roles and composable local shapes", () => {
    expect(WHITEBOARD_STEP_ROLES).toContain("question");
    expect(WHITEBOARD_STEP_ROLES).toContain("conclusion");
    expect(WHITEBOARD_STEP_ROLES).toContain("boundary");
    expect(WHITEBOARD_LOCAL_SHAPES).toEqual(["chain", "branch", "timeline", "matrix", "radial"]);
    expect(WHITEBOARD_RELATION_KINDS).toContain("deepen");
    expect(WHITEBOARD_RELATION_VISIBILITIES).toEqual(["implicit", "visible"]);
  });

  test("accepts a source-bound connected spine", () => {
    expect(validateWhiteboardSnapshot(validSnapshot())).toEqual([]);
  });

  test("accepts a conclusion ending with source qualifications integrated into the argument", () => {
    const snapshot = validSnapshot();
    const edited = structuredClone(ledger);
    const qualification = edited.steps.pop()!;
    edited.steps[2].support += ` ${qualification.claim} ${qualification.support}`;
    edited.relations.pop();
    edited.source_sections[1].step_ids = ["step-03"];
    snapshot.ledger = edited;
    snapshot.steps.pop();
    snapshot.steps[2].support = edited.steps[2].support;
    snapshot.relations.pop();
    expect(validateWhiteboardSnapshot(snapshot)).toEqual([]);
  });

  test("accepts silent continuation without manufactured transition copy", () => {
    const snapshot = validSnapshot();
    const silentRelation = (snapshot.ledger as typeof ledger).relations[0];
    expect(silentRelation.visibility).toBe("implicit");
    expect(silentRelation.bridge).toBe("");
    expect(snapshot.relations[0].hasArrowhead).toBe(false);
    expect(validateWhiteboardSnapshot(snapshot)).toEqual([]);
  });

  test("rejects copy or arrows on an implicit relation", () => {
    const snapshot = validSnapshot();
    const brokenLedger = structuredClone(ledger);
    brokenLedger.relations[0].bridge = "Pressing further.";
    snapshot.ledger = brokenLedger;
    snapshot.relations[0].bridge = "Pressing further.";
    snapshot.relations[0].hasStem = true;
    snapshot.relations[0].hasArrowhead = true;
    expect(validateWhiteboardSnapshot(snapshot).join("\n")).toContain("must keep bridge empty");
    expect(validateWhiteboardSnapshot(snapshot).join("\n")).toContain("must remain visually and accessibly silent");
  });

  test("rejects a visible turn without one complete bridge surface", () => {
    const snapshot = validSnapshot();
    const brokenLedger = structuredClone(ledger);
    brokenLedger.relations[1].bridge = "";
    snapshot.ledger = brokenLedger;
    snapshot.relations[1].bridge = "";
    snapshot.relations[1].ariaLabel = "";
    expect(validateWhiteboardSnapshot(snapshot).join("\n")).toContain("requires one bridge sentence");
  });

  test("rejects duplicate transition copy in both residue and relation bridge", () => {
    const snapshot = validSnapshot();
    const brokenLedger = structuredClone(ledger);
    brokenLedger.steps[1].residue = "A mechanism that can keep writing it down has to be found.";
    snapshot.ledger = brokenLedger;
    snapshot.steps[1].residue = brokenLedger.steps[1].residue;
    expect(validateWhiteboardSnapshot(snapshot).join("\n")).toContain("duplicates the visible transition");
  });

  test("rejects the retired ledger version", () => {
    const snapshot = validSnapshot();
    snapshot.ledger = { ...structuredClone(ledger), version: 1 };
    expect(validateWhiteboardSnapshot(snapshot).join("\n")).toContain("version must be 2");
  });

  test("rejects summary collapse when a load-bearing ledger step is absent", () => {
    const snapshot = validSnapshot();
    snapshot.steps.splice(1, 1);
    expect(validateWhiteboardSnapshot(snapshot).join("\n")).toContain("Ledger/DOM step mismatch");
  });

  test("rejects a logic ledger that silently drops a source paragraph", () => {
    const snapshot = validSnapshot();
    const incompleteLedger = structuredClone(ledger);
    incompleteLedger.source_sections.splice(1, 1);
    snapshot.ledger = incompleteLedger;
    expect(validateWhiteboardSnapshot(snapshot).join("\n")).toContain("Source inventory/logic ledger section mismatch");
  });

  test("rejects a dangling relation endpoint", () => {
    const snapshot = validSnapshot();
    const brokenLedger = structuredClone(ledger);
    brokenLedger.relations[1].to = "missing-step";
    snapshot.ledger = brokenLedger;
    snapshot.relations[1].to = "missing-step";
    expect(validateWhiteboardSnapshot(snapshot).join("\n")).toContain("Relation endpoint not found");
  });

  test("rejects a rendered step without a source reference", () => {
    const snapshot = validSnapshot();
    snapshot.steps[2].sourceRefs = [];
    expect(validateWhiteboardSnapshot(snapshot).join("\n")).toContain("missing source refs");
  });

  test("rejects a converged branch without a real return", () => {
    const snapshot = validSnapshot();
    snapshot.branches = [{
      state: "converged",
      entryStep: "step-01",
      returnStep: "step-03",
      pathStepIds: [["step-02"], ["step-03"]],
      hasReturnNote: false,
      hasOpenNote: false,
    }];
    expect(validateWhiteboardSnapshot(snapshot).join("\n")).toContain("must return");
  });

  test("finds and de-duplicates unresolved placeholders", () => {
    expect(findUnresolvedPlaceholders("{{LOGIC_LEDGER_JSON}} x {{LOGIC_LEDGER_JSON}} {{CONTENT_HTML}}")).toEqual([
      "{{LOGIC_LEDGER_JSON}}",
      "{{CONTENT_HTML}}",
    ]);
  });

  test("does not confuse ordinary braces with placeholders", () => {
    expect(findUnresolvedPlaceholders("body { color: var(--ink); } \u300cjudgment\u300d")).toEqual([]);
  });

  test("keeps the full-page safety ceiling explicit", () => {
    expect(MAX_FULLPAGE_HEIGHT).toBe(30_000);
  });
});
