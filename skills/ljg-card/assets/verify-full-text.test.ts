import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { compareBlockLedgers, type FullTextBlock } from "./verify-full-text";

const expected: FullTextBlock[] = [
  { id: "b001", text: "The source title" },
  { id: "b002", text: "The first paragraph, with punctuation and spacing kept." },
  { id: "b003", text: "The final sentence." },
];

describe("compareBlockLedgers", () => {
  test("accepts an exact ordered copy", () => {
    expect(compareBlockLedgers(expected, structuredClone(expected))).toEqual([]);
  });

  test("rejects a one-character rewrite", () => {
    const actual = structuredClone(expected);
    actual[1].text = "The first paragraph, with punctuation and spacing preserved.";
    expect(compareBlockLedgers(expected, actual)).toHaveLength(1);
  });

  test("rejects reordered blocks", () => {
    const actual = [expected[0], expected[2], expected[1]];
    expect(compareBlockLedgers(expected, actual).length).toBeGreaterThan(0);
  });

  test("rejects a missing block", () => {
    expect(compareBlockLedgers(expected, expected.slice(0, 2)).length).toBeGreaterThan(0);
  });

  test("rejects a duplicated block", () => {
    const actual = [...expected, expected[2]];
    expect(compareBlockLedgers(expected, actual).length).toBeGreaterThan(0);
  });
});

describe("verify-full-text CLI", () => {
  let fixtureDir = "";
  let ledgerPath = "";
  let sourcePath = "";

  beforeAll(async () => {
    fixtureDir = await mkdtemp(join(tmpdir(), "ljg-card-full-text-test-"));
    sourcePath = join(fixtureDir, "source.txt");
    ledgerPath = join(fixtureDir, "ledger.json");
    const source = "The source title\n\nThe first paragraph.\n";
    const sourceHash = new Bun.CryptoHasher("sha256")
      .update(new TextEncoder().encode(source))
      .digest("hex");

    await Bun.write(sourcePath, source);
    await Bun.write(
      ledgerPath,
      JSON.stringify({
        version: 1,
        source_sha256: sourceHash,
        blocks: [
          { id: "b001", text: "The source title" },
          { id: "b002", text: "The first paragraph." },
        ],
      }),
    );

    const documents: Record<string, string> = {
      exact: '<main class="full-document"><h1 data-source-block="b001">The source title</h1><p data-source-block="b002">The first paragraph.</p></main>',
      rewrite: '<main class="full-document"><h1 data-source-block="b001">The source title</h1><p data-source-block="b002">The rewritten first paragraph.</p></main>',
      reordered: '<main class="full-document"><p data-source-block="b002">The first paragraph.</p><h1 data-source-block="b001">The source title</h1></main>',
      missing: '<main class="full-document"><h1 data-source-block="b001">The source title</h1></main>',
      duplicated: '<main class="full-document"><h1 data-source-block="b001">The source title</h1><p data-source-block="b002">The first paragraph.</p><p data-source-block="b002">The first paragraph.</p></main>',
    };
    for (const [name, body] of Object.entries(documents)) {
      await Bun.write(join(fixtureDir, `${name}.html`), `<!DOCTYPE html><html><body>${body}</body></html>`);
    }
  });

  afterAll(async () => {
    if (fixtureDir) await rm(fixtureDir, { recursive: true, force: true });
  });

  async function exitCodeFor(name: string): Promise<number> {
    const process = Bun.spawn([
      "bun",
      join(import.meta.dir, "verify-full-text.ts"),
      ledgerPath,
      join(fixtureDir, `${name}.html`),
      sourcePath,
    ], {
      stdout: "ignore",
      stderr: "ignore",
    });
    return process.exited;
  }

  test("CLI exits 0 for exact source text", async () => {
    expect(await exitCodeFor("exact")).toBe(0);
  });

  for (const name of ["rewrite", "reordered", "missing", "duplicated"]) {
    test(`CLI exits nonzero for ${name}`, async () => {
      expect(await exitCodeFor(name)).toBe(1);
    });
  }
});
