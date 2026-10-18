import { describe, expect, test } from "bun:test";
import { buildWhiteboardSourceInventory } from "./prepare-whiteboard-source";

describe("whiteboard source inventory", () => {
  test("accounts for every non-empty source paragraph in order", () => {
    const source = "Paragraph one raises the question.\n\nParagraph two gives the premise.\n\n\nParagraph three states the boundary.\n";
    const inventory = buildWhiteboardSourceInventory(new TextEncoder().encode(source));
    expect(inventory.section_count).toBe(3);
    expect(inventory.sections.map(section => section.id)).toEqual(["src-01", "src-02", "src-03"]);
    expect(inventory.sections.map(section => section.text)).toEqual([
      "Paragraph one raises the question.",
      "Paragraph two gives the premise.",
      "Paragraph three states the boundary.",
    ]);
  });

  test("binds both the exact source bytes and every section text to SHA-256", () => {
    const bytes = new TextEncoder().encode("A.\r\n\r\nB.\r\n");
    const inventory = buildWhiteboardSourceInventory(bytes);
    expect(inventory.source_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(inventory.sections.every(section => /^[a-f0-9]{64}$/.test(section.text_sha256))).toBe(true);
    expect(new Set(inventory.sections.map(section => section.text_sha256)).size).toBe(2);
  });

  test("rejects a source without readable paragraphs", () => {
    expect(() => buildWhiteboardSourceInventory(new TextEncoder().encode(" \n\n\t"))).toThrow("no readable paragraphs");
  });
});
