import { describe, expect, test } from "bun:test";
import { convertEmbeddedOrgTemplates } from "./MdizeEmbeddedOrg";

describe("convertEmbeddedOrgTemplates", () => {
  test("converts a full Org document template into fenced Markdown with YAML", () => {
    const source = [
      "```org",
      "#+title: Blind-spot scan",
      "#+date: [2026-08-17]",
      "#+filetags: :blind:weread:",
      "",
      "* What you were thinking about yesterday",
      "- Link: [[https://example.com][read it]]",
      "```",
      "",
    ].join("\n");

    const converted = convertEmbeddedOrgTemplates(source);
    expect(converted).toContain("```markdown\n---\ntitle: Blind-spot scan");
    expect(converted).toContain("tags: blind weread\n---\n# What you were thinking about yesterday");
    expect(converted).toContain("- Link: [read it](https://example.com)");
    expect(converted).not.toContain("#+");
  });

  test("preserves indentation for a nested full-document example", () => {
    const source = [
      "3. File structure:",
      "",
      "   ```org",
      "   #+title: Roundtable",
      "   #+filetags: :roundtable:",
      "   * Topic and participants",
      "   ** Round N",
      "   ```",
    ].join("\n");

    const converted = convertEmbeddedOrgTemplates(source);
    expect(converted).toContain("   ```markdown\n   ---\n   title: Roundtable");
    expect(converted).toContain("   tags: roundtable\n   ---\n   # Topic and participants");
    expect(converted).toContain("   ## Round N");
  });

  test("converts Org fragments without inventing frontmatter", () => {
    const source = [
      "```org",
      "- *subject/boundary*: the qualifier",
      "- *state form*: A -> B",
      "```",
    ].join("\n");

    const converted = convertEmbeddedOrgTemplates(source);
    expect(converted).toBe([
      "```markdown",
      "- **subject/boundary**: the qualifier",
      "- **state form**: A -> B",
      "```",
    ].join("\n"));
    expect(converted).not.toContain("---");
  });

  test("leaves non-Org fences untouched", () => {
    const source = "```text\n* literal\n```\n";
    expect(convertEmbeddedOrgTemplates(source)).toBe(source);
  });

  test("preserves CRLF line endings while converting an Org template", () => {
    const source = "```org\r\n#+title: Roundtable\r\n* Round one\r\n```\r\n";
    const converted = convertEmbeddedOrgTemplates(source);
    expect(converted).toBe("```markdown\r\n---\r\ntitle: Roundtable\r\n---\r\n# Round one\r\n```\r\n");
    expect(converted.replace(/\r\n/g, "")).not.toContain("\n");
  });

  test("recognizes an unlabeled fence whose first line is an Org header", () => {
    const source = [
      "File header:",
      "```",
      "#+title: plain-example",
      "#+filetags: :plain:atom:",
      "```",
    ].join("\n");
    expect(convertEmbeddedOrgTemplates(source)).toContain(
      "```markdown\n---\ntitle: plain-example\ntags: plain atom\n---\n```",
    );
  });
});
