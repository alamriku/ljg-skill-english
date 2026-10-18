import { afterEach, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pushPath = fileURLToPath(new URL("./Push.sh", import.meta.url));
const embeddedConverterPath = fileURLToPath(
  new URL("./MdizeEmbeddedOrg.ts", import.meta.url),
);
const temporaryRoots: string[] = [];

function writeFixture(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("ljg-push Markdown branch conversion", () => {
  test("converts standalone Org example blocks while preserving their literal diagram text and references", () => {
    const root = mkdtempSync(join(tmpdir(), "ljg-push-example-test-"));
    temporaryRoots.push(root);
    const localRoot = join(root, "local");
    const repoRoot = join(root, "repo");
    writeFixture(join(localRoot, "ljg-push", "Tools", "MdizeEmbeddedOrg.ts"), readFileSync(embeddedConverterPath, "utf8"));
    const diagram = "* literal node\n  A --> B\n# literal comment";
    writeFixture(join(localRoot, "ljg-book", "evals", "reading.org"),
      "#+title: Reading\n\n* Diagram\n#+BEGIN_EXAMPLE\n" + diagram + "\n#+END_EXAMPLE\n\n* After\nText\n");
    writeFixture(join(localRoot, "ljg-book", "evals", "pair.json"), JSON.stringify({ files: ["reading.org"], expected_output: "produce the source-bounded Org and coverage; accepts Org input." }));
    const result = Bun.spawnSync(["bash", "-c", [
      'task_push_path="$1"', 'task_local_root="$2"', 'task_repo_root="$3"',
      "set --", "export LJG_PUSH_LIBRARY_ONLY=1", 'source "$task_push_path"',
      'SKILLS_LOCAL="$task_local_root"', 'SKILLS_REPO="$task_repo_root"',
      'mkdir -p "$SKILLS_REPO/skills"', 'sync_skill ljg-book 1',
      'audit_md_skill "$SKILLS_REPO/skills/ljg-book"',
    ].join("\n"), "bash", pushPath, localRoot, repoRoot], { stdout: "pipe", stderr: "pipe" });
    expect(result.exitCode, new TextDecoder().decode(result.stderr)).toBe(0);
    const generated = join(repoRoot, "skills", "ljg-book", "evals");
    expect(readFileSync(join(generated, "reading.md"), "utf8")).toBe(
      "---\ntitle: Reading\n---\n\n# Diagram\n```text\n" + diagram + "\n```\n\n# After\nText\n");
    expect(JSON.parse(readFileSync(join(generated, "pair.json"), "utf8"))).toEqual({ files: ["reading.md"], expected_output: "produce the source-bounded Markdown and coverage; accepts Org input." });
    expect(existsSync(join(generated, "reading.org"))).toBe(false);
    expect(readFileSync(join(localRoot, "ljg-book", "evals", "reading.org"), "utf8")).toContain("#+BEGIN_EXAMPLE");
  });

  test("converts revised book and paper delivery checks without changing Org input support", () => {
    const root = mkdtempSync(join(tmpdir(), "ljg-push-delivery-test-"));
    temporaryRoots.push(root);
    const localRoot = join(root, "local");
    const repoRoot = join(root, "repo");
    writeFixture(join(localRoot, "ljg-push", "Tools", "MdizeEmbeddedOrg.ts"), readFileSync(embeddedConverterPath, "utf8"));
    const bookText = [
      "- Read the finished note back in real Emacs: confirm the identifier, the filename, Denote and consult-notes, and actually run `org-lint`. Report the lint results honestly; when the validator is unavailable, defer explicitly instead of reporting an unrun check as a pass.",
      "After saving, read it back in real Emacs, and actually run `org-lint`. If no Emacs server is available, use a batch Emacs that can load Denote, consult, consult-notes and Org; when the validator is unavailable, defer explicitly.",
      "Accepts Org input.",
    ].join("\n");
    writeFixture(join(localRoot, "ljg-book", "SKILL.md"), bookText);
    writeFixture(join(localRoot, "ljg-paper", "SKILL.md"), "| title only | fetch the source | Org note and paper-map |\nAccepts Org input.\n");
    writeFixture(join(localRoot, "ljg-paper", "references", "paper-map.md"), "This field means an Org example diagram; the table is documented separately in the case record.\n");
    writeFixture(join(localRoot, "ljg-paper", "references", "template.org"), "#+title: Test\n\n* Body\n{Before delivery: check Denote and org-lint in real Emacs, then finish the independent reading check. Report every failed or unrunnable item honestly.}\n");
    writeFixture(join(localRoot, "ljg-paper", "evals", "evals.json"), JSON.stringify({ expected: "does not require generating the Org or the paper-map", input: "accepts Org input" }));
    const command = [
      'task_push_path="$1"', 'task_local_root="$2"', 'task_repo_root="$3"',
      "set --", "export LJG_PUSH_LIBRARY_ONLY=1", 'source "$task_push_path"',
      'SKILLS_LOCAL="$task_local_root"', 'SKILLS_REPO="$task_repo_root"',
      'mkdir -p "$SKILLS_REPO/skills"',
      'for name in ljg-book ljg-paper; do sync_skill "$name" 1; audit_md_skill "$SKILLS_REPO/skills/$name"; done',
    ].join("\n");
    const result = Bun.spawnSync(["bash", "-c", command, "bash", pushPath, localRoot, repoRoot], { stdout: "pipe", stderr: "pipe" });
    expect(result.exitCode, new TextDecoder().decode(result.stderr)).toBe(0);
    const generated = (skill: string, path: string) => readFileSync(join(repoRoot, "skills", skill, path), "utf8");
    const book = generated("ljg-book", "SKILL.md");
    expect(book).not.toContain("org-lint");
    expect(book).not.toContain("lint results");
    expect(book).not.toContain("consult-notes and Org");
    expect(book).toContain("Denote and consult-notes");
    expect(book).toContain("Report the check results honestly");
    expect(book).toContain("when the validator is unavailable, defer explicitly");
    expect(book).toContain("Accepts Org input");
    expect(generated("ljg-paper", "SKILL.md")).toContain("Markdown note and paper-map");
    expect(generated("ljg-paper", "references/paper-map.md")).toContain("a Markdown fenced diagram");
    const template = generated("ljg-paper", "references/template.md");
    expect(template).not.toContain("org-lint");
    expect(template).toContain("check Denote");
    expect(template).toContain("Report every failed or unrunnable item honestly");
    expect(JSON.parse(generated("ljg-paper", "evals/evals.json"))).toEqual({ expected: "does not require generating the Markdown or the paper-map", input: "accepts Org input" });
    expect(readFileSync(join(localRoot, "ljg-book", "SKILL.md"), "utf8")).toBe(bookText);
    expect(existsSync(join(localRoot, "ljg-paper", "references/template.org"))).toBe(true);
  });

  test("converts ljg-is output contracts all the way to Markdown semantics", () => {
    const root = mkdtempSync(join(tmpdir(), "ljg-push-is-test-"));
    temporaryRoots.push(root);
    const localRoot = join(root, "local");
    const repoRoot = join(root, "repo");
    const isRoot = join(localRoot, "ljg-is");

    writeFixture(
      join(localRoot, "ljg-push", "Tools", "MdizeEmbeddedOrg.ts"),
      readFileSync(embeddedConverterPath, "utf8"),
    );
    writeFixture(
      join(isRoot, "SKILL.md"),
      [
        "---",
        "name: ljg-is",
        "---",
        "Connect it into an Org reading that can be recognized, judged and acted on.",
      ].join("\n"),
    );
    writeFixture(
      join(isRoot, "Workflows", "TraceCreation.md"),
      [
        "`#+basis` records the factual basis.",
        "## Org output contract",
        "schema is fixed as `ljg-is-v5`, and the filetags contain `:is:act:`.",
        "- `#+definition` records the definition.",
        "- `#+operation` records how it works.",
        "- `#+recognition` records the cognitive correction.",
        "- `#+guidance` records the actionable judgment.",
        "- `#+falsifier` records the falsifier.",
        'bun ValidateNote.ts "<Org file path>"',
        "Do not copy the Org background checks back into a chat list.",
      ].join("\n"),
    );
    writeFixture(
      join(isRoot, "Template.org"),
      "#+title: Understanding: Test\n#+schema: ljg-is-v5\n* Test heading\nBody.\n",
    );

    const command = [
      'task_push_path="$1"',
      'task_local_root="$2"',
      'task_repo_root="$3"',
      "set --",
      "export LJG_PUSH_LIBRARY_ONLY=1",
      'source "$task_push_path"',
      'SKILLS_LOCAL="$task_local_root"',
      'SKILLS_REPO="$task_repo_root"',
      'mkdir -p "$SKILLS_REPO/skills"',
      'sync_skill "ljg-is" 1',
      'audit_md_skill "$SKILLS_REPO/skills/ljg-is"',
    ].join("\n");
    const result = Bun.spawnSync(
      ["bash", "-c", command, "bash", pushPath, localRoot, repoRoot],
      { stdout: "pipe", stderr: "pipe" },
    );
    const stderr = new TextDecoder().decode(result.stderr);
    expect(result.exitCode, stderr).toBe(0);

    const generatedRoot = join(repoRoot, "skills", "ljg-is");
    const skill = readFileSync(join(generatedRoot, "SKILL.md"), "utf8");
    const workflow = readFileSync(
      join(generatedRoot, "Workflows", "TraceCreation.md"),
      "utf8",
    );
    expect(skill).toContain("a Markdown reading");
    expect(workflow).toContain("## Markdown output contract");
    expect(workflow).toContain("tags contain both `is` and `act`");
    expect(workflow).toContain('"<Markdown file path>"');
    expect(workflow).toContain("Markdown background checks");
    expect(workflow).not.toMatch(/`#\+(definition|operation|recognition|guidance|basis|falsifier)`/);
  });

  test("converts paper output contracts while retaining explicit Org input fixtures", () => {
    const root = mkdtempSync(join(tmpdir(), "ljg-push-test-"));
    temporaryRoots.push(root);
    const localRoot = join(root, "local");
    const repoRoot = join(root, "repo");
    const paperRoot = join(localRoot, "ljg-paper");

    writeFixture(
      join(localRoot, "ljg-push", "Tools", "MdizeEmbeddedOrg.ts"),
      readFileSync(embeddedConverterPath, "utf8"),
    );
    writeFixture(
      join(paperRoot, "SKILL.md"),
      [
        "---",
        "name: ljg-paper",
        "---",
        "| input | output |",
        "|---|---|",
        "| PDF | save an Org named after the paper and a background paper-map |",
        "| title | save the Org and the paper-map |",
        "The Org is saved by default to `~/Context/`.",
        "Delivery passes Denote/consult-notes/Org lint and the deterministic validator.",
        "Then confirm the directory index, consult-notes and `org-lint`.",
      ].join("\n"),
    );
    writeFixture(
      join(paperRoot, "ReadingGuide.md"),
      "Confirm `denote-directory-files`, consult-notes and `org-lint`.\n",
    );
    writeFixture(
      join(paperRoot, "references", "template.org"),
      "#+title: Test\n* Main\nAdd an Org example diagram.\n",
    );
    writeFixture(
      join(paperRoot, "evals", "evals.json"),
      JSON.stringify(
        [
          { prompt: "save the Org and the paper-map." },
          { prompt: "save the same Org and paper-map." },
        ],
        null,
        2,
      ),
    );
    writeFixture(
      join(paperRoot, "scripts", "validate_note.ts"),
      [
        'const message = "at most one Org example block";',
        'const usage = "<note.org> --map <paper-map.md>";',
      ].join("\n"),
    );
    writeFixture(
      join(paperRoot, "scripts", "validate_note.test.ts"),
      [
        'const fixture = "20260820T000000--paper-test__paper.org";',
        'const header = "#+title: fixture";',
      ].join("\n"),
    );

    const command = [
      'task_push_path="$1"',
      'task_local_root="$2"',
      'task_repo_root="$3"',
      "set --",
      "export LJG_PUSH_LIBRARY_ONLY=1",
      'source "$task_push_path"',
      'SKILLS_LOCAL="$task_local_root"',
      'SKILLS_REPO="$task_repo_root"',
      'mkdir -p "$SKILLS_REPO/skills"',
      'sync_skill "ljg-paper" 1',
      'audit_md_skill "$SKILLS_REPO/skills/ljg-paper"',
    ].join("\n");
    const result = Bun.spawnSync(
      ["bash", "-c", command, "bash", pushPath, localRoot, repoRoot],
      { stdout: "pipe", stderr: "pipe" },
    );
    const stderr = new TextDecoder().decode(result.stderr);
    expect(result.exitCode, stderr).toBe(0);

    const generatedRoot = join(repoRoot, "skills", "ljg-paper");
    const skill = readFileSync(join(generatedRoot, "SKILL.md"), "utf8");
    const guide = readFileSync(join(generatedRoot, "ReadingGuide.md"), "utf8");
    const template = readFileSync(
      join(generatedRoot, "references", "template.md"),
      "utf8",
    );
    const evals = readFileSync(join(generatedRoot, "evals", "evals.json"), "utf8");
    const validator = readFileSync(
      join(generatedRoot, "scripts", "validate_note.ts"),
      "utf8",
    );
    const compatibilityFixture = readFileSync(
      join(generatedRoot, "scripts", "validate_note.test.ts"),
      "utf8",
    );

    expect(existsSync(join(generatedRoot, "references", "template.org"))).toBe(false);
    expect(skill).toContain("save a Markdown named after the paper and a background paper-map");
    expect(skill).toContain("The Markdown is saved by default to");
    expect(skill).not.toMatch(/Org lint|org-lint/);
    expect(guide).not.toContain("org-lint");
    expect(template).toContain("a Markdown fenced diagram");
    expect(evals).toContain("save the Markdown and the paper-map");
    expect(evals).toContain("save the same Markdown and paper-map");
    expect(evals).not.toContain("save the Org and the paper-map");
    expect(validator).toContain("at most one Markdown fenced block");
    expect(validator).toContain("<note.md> --map <paper-map.md>");
    expect(compatibilityFixture).toContain("__paper.org");
    expect(compatibilityFixture).toContain("#+title: fixture");

    writeFixture(
      join(generatedRoot, "evals", "evals.json"),
      JSON.stringify(
        [
          { prompt: "save the Org and the paper-map." },
          { prompt: "save the same Org and paper-map." },
        ],
        null,
        2,
      ),
    );
    const auditOnlyCommand = [
      'task_push_path="$1"',
      'task_skill_root="$2"',
      "set --",
      "export LJG_PUSH_LIBRARY_ONLY=1",
      'source "$task_push_path"',
      'audit_md_skill "$task_skill_root"',
    ].join("\n");
    const auditOnlyResult = Bun.spawnSync(
      ["bash", "-c", auditOnlyCommand, "bash", pushPath, generatedRoot],
      { stdout: "pipe", stderr: "pipe" },
    );
    const auditOnlyStderr = new TextDecoder().decode(auditOnlyResult.stderr);
    expect(auditOnlyResult.exitCode).toBe(1);
    expect(auditOnlyStderr).toContain("save the Org and the paper-map");
    expect(auditOnlyStderr).toContain("save the same Org and paper-map");
  });

  test("does not rewrite the publisher's own runtime audit literals", () => {
    const root = mkdtempSync(join(tmpdir(), "ljg-push-meta-test-"));
    temporaryRoots.push(root);
    const localRoot = join(root, "local");
    const repoRoot = join(root, "repo");
    const publisherRoot = join(localRoot, "ljg-push");
    const publisherFixture = [
      "at most one Org example block",
      "stdin__paper.org",
      "save the Org and the paper-map",
    ].join("\n");
    writeFixture(join(publisherRoot, "SKILL.md"), "---\nname: ljg-push\n---\n");
    writeFixture(join(publisherRoot, "Tools", "Push.sh"), publisherFixture);

    const command = [
      'task_push_path="$1"',
      'task_local_root="$2"',
      'task_repo_root="$3"',
      "set --",
      "export LJG_PUSH_LIBRARY_ONLY=1",
      'source "$task_push_path"',
      'SKILLS_LOCAL="$task_local_root"',
      'SKILLS_REPO="$task_repo_root"',
      'mkdir -p "$SKILLS_REPO/skills"',
      'sync_skill "ljg-push" 1',
      'audit_md_skill "$SKILLS_REPO/skills/ljg-push"',
    ].join("\n");
    const result = Bun.spawnSync(
      ["bash", "-c", command, "bash", pushPath, localRoot, repoRoot],
      { stdout: "pipe", stderr: "pipe" },
    );
    const stderr = new TextDecoder().decode(result.stderr);
    expect(result.exitCode, stderr).toBe(0);
    expect(
      readFileSync(join(repoRoot, "skills", "ljg-push", "Tools", "Push.sh"), "utf8"),
    ).toBe(publisherFixture);
  });
});
