import { describe, expect, test } from "bun:test";
import { BLOCKS, renderModel, validateModel } from "./Render";
import example from "../Example.json";

const copy = () => structuredClone(example);
describe("ljg-business-model content and output boundaries", () => {
  test("the full example contains the nine classic blocks, sources and attribution", () => {
    const html = renderModel(copy());
    expect((html.match(/data-block="/g) ?? []).length).toBe(9);
    for (const b of BLOCKS) expect(html).toContain(`data-block="${b.key}"`);
    expect(html).toContain("Strategyzer.com");
    expect(html).toContain("CC BY-SA 3.0");
  });
  test("all nine blocks may be empty and are explicitly marked to be supplied", () => {
    const model = copy();
    for (const b of BLOCKS) (model.blocks[b.key] as unknown[]) = [];
    model.sources = [];
    const html = renderModel(model);
    expect((html.match(/class="item unknown"/g) ?? []).length).toBe(9);
    expect(html).toContain("9 to be supplied");
  });
  test("missing blocks, Lean Canvas substitutions and overlong text are rejected", () => {
    const model: any = copy();
    delete model.blocks.key_resources;
    expect(() => validateModel(model)).toThrow("key_resources");
    const lean: any = copy(); lean.blocks.problem = [];
    expect(() => validateModel(lean)).toThrow("problem");
    const long = copy(); long.blocks.key_partners[0].text = "x".repeat(91);
    expect(() => validateModel(long)).toThrow("90");
  });
  test("source references, the basis for inference and segment links cannot go missing silently", () => {
    const missingRef: any = copy(); missingRef.blocks.key_partners[0].source_refs = [];
    expect(() => validateModel(missingRef)).toThrow("source_refs");
    const wrongRef: any = copy(); wrongRef.blocks.key_partners[0].source_refs = ["S2"];
    expect(() => validateModel(wrongRef)).toThrow("source");
    const inferred: any = copy(); delete inferred.blocks.value_propositions[1].reason;
    expect(() => validateModel(inferred)).toThrow("reason");
    const segment: any = copy(); segment.blocks.customer_segments[0].segment = "C9";
    expect(() => validateModel(segment)).toThrow("segment id");
  });
  test("input text never becomes executable HTML or an attribute", () => {
    const model = copy(); model.blocks.key_partners[0].text = '<img src=x onerror="alert(1)">';
    const html = renderModel(model);
    expect(html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain("Fictional case: a community coffee shop offers");
  });
  test("several customer segments are supported and keep their markers", () => {
    const model = copy(); model.segments.push({ id: "C2", label: "team buyers" });
    model.blocks.customer_segments[0].segment = "C2";
    const html = renderModel(model);
    expect(html).toContain('class="segment s1">C2</span>');
  });
  test("invalid dates and unreadably small canvases are rejected", () => {
    const model = copy(); model.date = "2026-02-30";
    expect(() => validateModel(model)).toThrow();
    expect(() => renderModel(copy(), 600)).toThrow("width");
  });
});
