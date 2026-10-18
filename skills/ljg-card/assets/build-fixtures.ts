import { mkdir, unlink } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = join(import.meta.dir, "..");
const output = resolve(process.env.LJG_CARD_FIXTURE_DIR ?? "/tmp/ljg-card-v7-fixtures");
const logoPath = join(import.meta.dir, "logo.png");
const logo = pathToFileURL(logoPath).href;
const fixtureImagePath = process.env.LJG_CARD_FIXTURE_IMAGE;
const fixtureImage = pathToFileURL(resolve(fixtureImagePath ?? logoPath)).href;
const fixtureImageAlt = fixtureImagePath
  ? "a figure facing a set of work tasks; a single-line scene used to verify the long-image narrative anchor"
  : "a black circular brand image, used only to verify that the local bitmap slot loads";

await mkdir(output, { recursive: true });

function fill(template: string, values: Record<string, string>): string {
  let rendered = template;
  for (const [key, value] of Object.entries(values)) {
    rendered = rendered.replaceAll(`{{${key}}}`, value);
  }
  const leftovers = rendered.match(/\{\{[A-Z_]+\}\}/g) ?? [];
  if (leftovers.length > 0) throw new Error(`Unreplaced placeholders: ${leftovers.join(", ")}`);
  return rendered;
}

function sha256(bytes: Uint8Array): string {
  return new Bun.CryptoHasher("sha256").update(bytes).digest("hex");
}

async function run(command: string[]): Promise<void> {
  const process = Bun.spawn(command, {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ]);
  if (stdout.trim()) console.log(stdout.trim());
  if (exitCode !== 0) {
    throw new Error(`${command.join(" ")} failed (${exitCode}): ${stderr.trim()}`);
  }
}

async function runExpectFailure(command: string[], expectedText: string): Promise<void> {
  const process = Bun.spawn(command, {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ]);
  const combined = `${stdout}\n${stderr}`;
  if (exitCode === 0) throw new Error(`${command.join(" ")} unexpectedly passed`);
  if (!combined.includes(expectedText)) {
    throw new Error(`${command.join(" ")} failed without expected text ${JSON.stringify(expectedText)}: ${combined.trim()}`);
  }
  console.log(`expected-failure: ${expectedText}`);
}

async function readPngWidth(path: string): Promise<number> {
  const bytes = new Uint8Array(await Bun.file(path).arrayBuffer());
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (bytes.length < 24 || signature.some((byte, index) => bytes[index] !== byte)) {
    throw new Error(`Invalid PNG: ${path}`);
  }
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(16);
}

function contrastRatio(foreground: string, background: string): number {
  const channels = (value: string): number[] => {
    const matches = value.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
    if (matches.length !== 3) throw new Error(`Unsupported color for contrast check: ${value}`);
    return matches;
  };
  const luminance = (value: string): number => {
    const linear = channels(value).map(channel => {
      const normalized = channel / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

async function inspectBodyFonts(path: string): Promise<{
  computed_stack: string;
  title_computed_stack: string;
  headline_computed_stack: string;
  platform_fonts: Array<{ familyName: string; postScriptName: string; glyphCount: number }>;
  title_platform_fonts: Array<{ familyName: string; postScriptName: string; glyphCount: number }>;
  headline_platform_fonts: Array<{ familyName: string; postScriptName: string; glyphCount: number }>;
  remote_resources: string[];
  visual_metrics: {
    canvas_background: string;
    card_background: string;
    text_color: string;
    font_size_px: number;
    line_height_px: number;
    line_height_ratio: number;
    document_width_px: number;
    contrast_ratio: number;
  };
}> {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path).href, { waitUntil: "load" });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });
    const selector = ".full-document > p:not(.opening):not(.full-key)";
    const computed = await page.$eval(selector, element => {
      const style = getComputedStyle(element);
      const fontSize = Number.parseFloat(style.fontSize);
      const lineHeight = Number.parseFloat(style.lineHeight);
      const card = document.querySelector<HTMLElement>(".full-card");
      const documentRoot = document.querySelector<HTMLElement>(".full-document");
      return {
        stack: style.fontFamily,
        canvasBackground: getComputedStyle(document.documentElement).backgroundColor,
        cardBackground: card ? getComputedStyle(card).backgroundColor : "",
        textColor: style.color,
        fontSize,
        lineHeight,
        lineHeightRatio: lineHeight / fontSize,
        documentWidth: documentRoot?.getBoundingClientRect().width ?? 0,
      };
    });
    const remoteResources = await page.evaluate(() =>
      performance.getEntriesByType("resource")
        .map(entry => entry.name)
        .filter(name => /^https?:/i.test(name)),
    );
    const titleComputedStack = await page.$eval(".full-document h1", element => getComputedStyle(element).fontFamily);
    const headlineComputedStack = await page.$eval(".full-document h2", element => getComputedStyle(element).fontFamily);
    const session = await page.context().newCDPSession(page);
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const documentNode = await session.send("DOM.getDocument") as { root: { nodeId: number } };
    const platformFonts = async (surfaceSelector: string) => {
      const node = await session.send("DOM.querySelector", {
        nodeId: documentNode.root.nodeId,
        selector: surfaceSelector,
      }) as { nodeId: number };
      const result = await session.send("CSS.getPlatformFontsForNode", {
        nodeId: node.nodeId,
      }) as { fonts: Array<{ familyName: string; postScriptName: string; glyphCount: number }> };
      return result.fonts;
    };
    return {
      computed_stack: computed.stack,
      title_computed_stack: titleComputedStack,
      headline_computed_stack: headlineComputedStack,
      platform_fonts: await platformFonts(selector),
      title_platform_fonts: await platformFonts(".full-document h1"),
      headline_platform_fonts: await platformFonts(".full-document h2"),
      remote_resources: remoteResources,
      visual_metrics: {
        canvas_background: computed.canvasBackground,
        card_background: computed.cardBackground,
        text_color: computed.textColor,
        font_size_px: computed.fontSize,
        line_height_px: computed.lineHeight,
        line_height_ratio: computed.lineHeightRatio,
        document_width_px: computed.documentWidth,
        contrast_ratio: contrastRatio(computed.textColor, computed.cardBackground),
      },
    };
  } finally {
    await browser.close();
  }
}

async function inspectWhiteboardFonts(path: string): Promise<{
  title: Array<{ familyName: string; postScriptName: string; glyphCount: number }>;
  relation: Array<{ familyName: string; postScriptName: string; glyphCount: number }>;
  body: Array<{ familyName: string; postScriptName: string; glyphCount: number }>;
  remote_resources: string[];
}> {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path).href, { waitUntil: "load" });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });
    const session = await page.context().newCDPSession(page);
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const documentNode = await session.send("DOM.getDocument") as { root: { nodeId: number } };
    const platformFonts = async (selector: string) => {
      const node = await session.send("DOM.querySelector", {
        nodeId: documentNode.root.nodeId,
        selector,
      }) as { nodeId: number };
      const result = await session.send("CSS.getPlatformFontsForNode", {
        nodeId: node.nodeId,
      }) as { fonts: Array<{ familyName: string; postScriptName: string; glyphCount: number }> };
      return result.fonts;
    };
    return {
      title: await platformFonts(".whiteboard-title"),
      relation: await platformFonts(".transition-sentence"),
      body: await platformFonts(".step-support"),
      remote_resources: await page.evaluate(() =>
        performance.getEntriesByType("resource")
          .map(entry => entry.name)
          .filter(name => /^https?:/i.test(name)),
      ),
    };
  } finally {
    await browser.close();
  }
}

const common = {
  IMAGE_STATE: "ready",
  IMAGE_SRC: logo,
  IMAGE_ALT: "a black circular brand image, used only to verify that the local bitmap slot loads",
  IMAGE_CLAIM: "claim-anchor",
  LOGO: logo,
  SOURCE_LINE: '<span class="info-source">structural acceptance sample</span>',
};

const fullBlocks = [
  { id: "b001", text: "Design begins only when the content stays untouched" },
  { id: "b002", text: "Neither a single word in the source nor A & B may be rewritten." },
  { id: "b003", text: "What typesetting is responsible for" },
  { id: "b004", text: "Emphasis can change the order things are seen in, never the order of the source." },
  { id: "b005", text: "Headings establish hierarchy." },
  { id: "b006", text: "The body keeps breathing room." },
  { id: "b007", text: "The author's sentence appears exactly once." },
  { id: "b008", text: "Structural sample" },
  { id: "b009", text: "The inline code const answer still belongs to the source." },
  { id: "b010", text: "const answer = 42;" },
  { id: "b011", text: "Table 1  Design and boundary" },
  { id: "b012", text: "Action" },
  { id: "b013", text: "Boundary" },
  { id: "b014", text: "Typesetting" },
  { id: "b015", text: "changes presentation only" },
  { id: "b016", text: "The source image enters faithfully and carries no new interpretation." },
  { id: "b017", text: "Note: footnotes are set smaller but stay fully readable." },
];

const fullDocumentHtml = [
  '<h1 data-source-block="b001">Design begins only when the content stays untouched</h1>',
  '<p class="opening" data-source-block="b002">Neither a single <strong>word</strong> in the source nor A &amp; B may be rewritten.</p>',
  '<h2 data-source-block="b003">What typesetting is responsible for</h2>',
  '<p class="full-key" data-source-block="b004">Emphasis can change the order things are seen in, never the order of the source.</p>',
  '<ul><li data-source-block="b005">Headings establish hierarchy.</li><li data-source-block="b006">The body keeps breathing room.</li></ul>',
  '<blockquote><p data-source-block="b007">The author's sentence appears exactly once.</p></blockquote>',
  '<h3 data-source-block="b008">Structural sample</h3>',
  '<p data-source-block="b009">The inline code <code>const answer</code> still belongs to the source.</p>',
  '<pre data-source-block="b010"><code>const answer = 42;</code></pre>',
  '<table><caption data-source-block="b011">Table 1  Design and boundary</caption><thead><tr><th data-source-block="b012">Action</th><th data-source-block="b013">Boundary</th></tr></thead><tbody><tr><td data-source-block="b014">Typesetting</td><td data-source-block="b015">changes presentation only</td></tr></tbody></table>',
  `<figure class="source-figure"><img src="${fixtureImage}" alt="a source image used to verify the local source asset in full-text mode"><figcaption data-source-block="b016">The source image enters faithfully and carries no new interpretation.</figcaption></figure>`,
  '<hr class="section-break" aria-hidden="true">',
  '<section class="footnotes"><p class="footnote" data-source-block="b017">Note: footnotes are set smaller but stay fully readable.</p></section>',
].join("");

const sourceSnapshot = `${fullBlocks.map(block => block.text).join("\n\n")}\n`;
const sourcePath = join(output, "full-source.txt");
const ledgerPath = join(output, "full-source-ledger.json");
await Bun.write(sourcePath, sourceSnapshot);
await Bun.write(
  ledgerPath,
  `${JSON.stringify({
    version: 1,
    source_sha256: sha256(new TextEncoder().encode(sourceSnapshot)),
    blocks: fullBlocks,
  }, null, 2)}\n`,
);

type FixtureRole = "question" | "premise" | "evidence" | "tension" | "inference" | "turn" | "synthesis" | "conclusion" | "boundary";
type FixturePresentation = "text" | "typography" | "image" | "chain" | "branch" | "timeline" | "matrix" | "radial";

interface FixtureStep {
  id: string;
  role: FixtureRole;
  source_refs: string[];
  claim: string;
  support: string;
  residue: string;
  must_render: true;
  presentation: FixturePresentation;
}

interface FixtureRelation {
  id: string;
  from: string;
  to: string;
  kind: "continue" | "deepen" | "contrast" | "question" | "branch" | "return" | "boundary";
  visibility: "implicit" | "visible";
  bridge: string;
}

const roleLabels: Record<FixtureRole, string> = {
  question: "question",
  premise: "premise",
  evidence: "evidence",
  tension: "tension",
  inference: "inference",
  turn: "turn",
  synthesis: "synthesis",
  conclusion: "conclusion",
  boundary: "Boundary",
};

const whiteboardParagraphs = [
  "The experience left plenty of trajectory, but the model's capability did not change when the task ended.",
  "Context can only hold experience temporarily; it cannot guarantee the next task can call on it.",
  "Write depth, update frequency and recall cost constrain each other across memory layers.",
  "One route cannot optimize stable retention and fast updating at once, so the argument branches.",
  "The world-model route learns how the environment changes from complete trajectories.",
  "The LoRA and policy route selects high-value trajectories and writes them into isolated capability.",
  "Both routes end at the same trade-off between write depth and recall cost.",
  "Continual learning depends on experience entering a carrier that the next round can still call.",
  "Forgetting, online updating and interference between old and new capabilities remain open problems.",
];
const whiteboardSource = `${whiteboardParagraphs.join("\n\n")}\n`;
const whiteboardSourceHash = sha256(new TextEncoder().encode(whiteboardSource));
const whiteboardSourcePath = join(output, "whiteboard-source.txt");
const whiteboardSourceInventoryPath = join(output, "whiteboard-source-inventory.json");
await Bun.write(whiteboardSourcePath, whiteboardSource);
await run([
  "bun",
  join(root, "assets", "prepare-whiteboard-source.ts"),
  whiteboardSourcePath,
  whiteboardSourceInventoryPath,
]);

const logicStep = (step: FixtureStep, depth: string): string => [
  `<article class="logic-step" data-step-id="${step.id}" data-role="${step.role}" data-source-refs="${step.source_refs.join(" ")}">`,
  `<div class="step-marker" aria-hidden="true"><span class="step-depth">${depth}</span><span class="step-dot"></span></div>`,
  '<div class="step-panel">',
  `<span class="step-role">${roleLabels[step.role]}</span>`,
  `<h2 class="step-claim">${step.claim}</h2>`,
  `<p class="step-support">${step.support}</p>`,
  `<p class="step-residue">${step.residue}</p>`,
  "</div></article>",
].join("");

const logicRelation = (relation: FixtureRelation): string => relation.visibility === "implicit"
  ? `<div class="logic-relation" data-relation-id="${relation.id}" data-from="${relation.from}" data-to="${relation.to}" data-kind="${relation.kind}" data-visibility="implicit" aria-hidden="true"></div>`
  : [
    `<div class="logic-relation" data-relation-id="${relation.id}" data-from="${relation.from}" data-to="${relation.to}" data-kind="${relation.kind}" data-visibility="visible" aria-label="${relation.bridge}">`,
    '<span class="relation-rail" aria-hidden="true"><span class="relation-stem"></span><span class="relation-arrowhead"></span></span>',
    `<div class="transition-copy"><p class="transition-sentence">${relation.bridge}</p></div>`,
    "</div>",
  ].join("");

const sourceSectionsFor = (steps: FixtureStep[]) => whiteboardParagraphs.map((_, index) => {
  const id = `src-${String(index + 1).padStart(2, "0")}`;
  const stepIds = steps.filter(step => step.source_refs.includes(id)).map(step => step.id);
  return stepIds.length > 0
    ? { id, disposition: "rendered" as const, step_ids: stepIds }
    : { id, disposition: "omitted" as const, omission_reason: "The local-structure fixture verifies only the listed steps and does not unfold the other branch routes." };
});

const logicLedger = (steps: FixtureStep[], relations: FixtureRelation[]): string => JSON.stringify({
  version: 2,
  source_sha256: whiteboardSourceHash,
  source_sections: sourceSectionsFor(steps),
  steps,
  relations,
}).replaceAll("<", "\\u003c");

const whiteboardShell = (title: string, question: string, orientation: string, spine: string): string => [
  '<main class="whiteboard-content">',
  '<header class="whiteboard-header"><span class="whiteboard-kicker">LOGIC DIVE</span>',
  `<h1 class="whiteboard-title">${title}</h1>`,
  `<p class="whiteboard-question">${question}</p>`,
  `<p class="whiteboard-orientation">${orientation}</p></header>`,
  '<section class="reasoning-spine"><span class="spine-rail" aria-hidden="true"><span class="spine-line"></span></span>',
  spine,
  "</section></main>",
].join("");

const matrixShape = '<section class="local-shape local-matrix" data-logic-shape="matrix"><h3 class="local-shape-title">Both routes back on one set of axes</h3><div class="matrix-frame"><div class="matrix-axis-x"><span>recall cost: low -&gt; high</span><span class="axis-line"></span><span class="axis-arrowhead" aria-hidden="true"></span></div><div class="matrix-axis-y"><span>write depth: shallow -&gt; deep</span><span class="axis-line"></span><span class="axis-arrowhead" aria-hidden="true"></span></div><div class="matrix-grid"><article class="quadrant"><h3>context</h3><p>shallow write, light recall.</p></article><article class="quadrant"><h3>state</h3><p>partly retained, retrievable again.</p></article><article class="quadrant"><h3>adapter</h3><p>capability isolated, loaded on demand.</p></article><article class="quadrant"><h3>parameters</h3><p>deep write, expensive updates.</p></article></div></div></section>';

const compositeSteps: FixtureStep[] = [
  { id: "step-01", role: "question", source_refs: ["src-01"], claim: "Why did the experience never become capability?", support: "The agent finished the task and left plenty of trajectory behind.", residue: "When the task ended, the model itself still had not changed.", must_render: true, presentation: "typography" },
  { id: "step-02", role: "premise", source_refs: ["src-02"], claim: "Remembering briefly is not learning", support: "Context holds experience temporarily but cannot guarantee it is called across tasks.", residue: "", must_render: true, presentation: "text" },
  { id: "step-03", role: "tension", source_refs: ["src-03"], claim: "The deeper the write, the steadier the capability and the higher the cost", support: "Context, state, adapters and parameters are memory layers at different depths.", residue: "", must_render: true, presentation: "text" },
  { id: "step-04", role: "turn", source_refs: ["src-04"], claim: "The question therefore splits into two technical routes", support: "One learns how the environment changes first; the other selects which experience is worth writing down.", residue: "", must_render: true, presentation: "branch" },
  { id: "step-05", role: "inference", source_refs: ["src-05"], claim: "The world-model route", support: "Learns state transitions from successful, failed and unlabelled trajectories.", residue: "More experience becomes learnable, and the model and training costs rise with it.", must_render: true, presentation: "branch" },
  { id: "step-06", role: "inference", source_refs: ["src-06"], claim: "The LoRA / policy route", support: "A strong encoder agent selects trajectories and writes the change into an isolated adapter.", residue: "The scope of rewriting shrinks, but the routing and coordination burden stays.", must_render: true, presentation: "branch" },
  { id: "step-07", role: "synthesis", source_refs: ["src-07"], claim: "Both routes land on the same trade-off", support: "The axes they really share are update frequency, write depth and recall cost.", residue: "", must_render: true, presentation: "matrix" },
  { id: "step-08", role: "conclusion", source_refs: ["src-08"], claim: "Capability comes from sustainable writing, not more conversation", support: "Experience has to enter a carrier the next round can retrieve, route or train on.", residue: "", must_render: true, presentation: "typography" },
  { id: "step-09", role: "boundary", source_refs: ["src-09"], claim: "Human-level continual learning is not finished", support: "Forgetting, non-i.i.d. online updates and interference between old and new capabilities remain open problems.", residue: "", must_render: true, presentation: "text" },
];

const compositeRelations: FixtureRelation[] = [
  { id: "rel-01", from: "step-01", to: "step-02", kind: "deepen", visibility: "implicit", bridge: "" },
  { id: "rel-02", from: "step-02", to: "step-03", kind: "question", visibility: "visible", bridge: "If experience is to persist across tasks, we first have to see how deep it can be written and how often it updates." },
  { id: "rel-03", from: "step-03", to: "step-04", kind: "branch", visibility: "visible", bridge: "A single memory layer cannot both update quickly and retain stably, so the question splits into two routes." },
  { id: "rel-04a", from: "step-04", to: "step-05", kind: "branch", visibility: "implicit", bridge: "" },
  { id: "rel-05a", from: "step-05", to: "step-07", kind: "return", visibility: "implicit", bridge: "" },
  { id: "rel-04b", from: "step-04", to: "step-06", kind: "branch", visibility: "implicit", bridge: "" },
  { id: "rel-05b", from: "step-06", to: "step-07", kind: "return", visibility: "implicit", bridge: "" },
  { id: "rel-06", from: "step-07", to: "step-08", kind: "deepen", visibility: "implicit", bridge: "" },
  { id: "rel-07", from: "step-08", to: "step-09", kind: "boundary", visibility: "visible", bridge: "Even once experience can be written down, forgetting and online updates still limit whether it accumulates stably." },
];

const compositeSpine = [
  logicStep(compositeSteps[0], "00"), logicRelation(compositeRelations[0]),
  logicStep(compositeSteps[1], "20"), logicRelation(compositeRelations[1]),
  logicStep(compositeSteps[2], "40"), logicRelation(compositeRelations[2]),
  logicStep(compositeSteps[3], "60"),
  '<section class="local-shape local-branch" data-logic-shape="branch" data-branch-state="converged" data-entry-step="step-04" data-return-step="step-07"><h3 class="local-shape-title">One gap, two routes for writing it down</h3><div class="branch-grid">',
  `<div class="branch-path" data-branch-id="world-model">${logicRelation(compositeRelations[3])}${logicStep(compositeSteps[4], "A")}${logicRelation(compositeRelations[4])}</div>`,
  `<div class="branch-path" data-branch-id="policy-lora">${logicRelation(compositeRelations[5])}${logicStep(compositeSteps[5], "B")}${logicRelation(compositeRelations[6])}</div>`,
  '</div><p class="branch-return">The two routes converge again one layer down: the comparison is no longer which is more advanced, but how deep each writes the experience, how often it updates, and what recall costs.</p></section>',
  logicStep(compositeSteps[6], "80"), matrixShape, logicRelation(compositeRelations[7]),
  logicStep(compositeSteps[7], "100"), logicRelation(compositeRelations[8]),
  logicStep(compositeSteps[8], "120"),
].join("");

const whiteboardComposite = whiteboardShell(
  "How does experience become capability?",
  "How does experience from one task become capability the next task can still call?",
  "Diving along the place things are written until the two technical routes converge under the same cost constraints.",
  compositeSpine,
);

const buildLinearWhiteboard = (shape: "chain" | "timeline" | "matrix" | "radial", shapeHtml: string) => {
  const steps: FixtureStep[] = [
    { id: "step-01", role: "question", source_refs: ["src-01"], claim: "Where does this change begin?", support: "First find the concrete situation the source is trying to explain.", residue: "An unexplained gap still sits between the current state and the goal.", must_render: true, presentation: "typography" },
    { id: "step-02", role: "premise", source_refs: ["src-02"], claim: "The old approach only solved the surface", support: "A local result appeared while the load-bearing mechanism stayed unchanged.", residue: "", must_render: true, presentation: "text" },
    { id: "step-03", role: "inference", source_refs: ["src-03"], claim: "The key mechanism becomes visible", support: "A local structure explains this layer only; it never replaces the spine.", residue: "", must_render: true, presentation: shape },
    { id: "step-04", role: "conclusion", source_refs: ["src-08", "src-09"], claim: "Experience must be callable in the next task", support: "After the carrier is written, forgetting and interference between old and new capability still have to be handled.", residue: "", must_render: true, presentation: "typography" },
  ];
  const relations: FixtureRelation[] = [
    { id: "rel-01", from: "step-01", to: "step-02", kind: "deepen", visibility: "implicit", bridge: "" },
    { id: "rel-02", from: "step-02", to: "step-03", kind: "question", visibility: "visible", bridge: "The surface result has appeared, but the internal mechanism that decides whether it lasts is still unseen." },
    { id: "rel-03", from: "step-03", to: "step-04", kind: "continue", visibility: "implicit", bridge: "" },
  ];
  const spine = [
    logicStep(steps[0], "00"), logicRelation(relations[0]),
    logicStep(steps[1], "25"), logicRelation(relations[1]),
    logicStep(steps[2], "50"), shapeHtml, logicRelation(relations[2]),
    logicStep(steps[3], "100"),
  ].join("");
  return {
    html: whiteboardShell("The logic keeps diving along the spine", "How do local structures serve the whole article's derivation?", "The spine keeps the reading direction; local tools appear only when the argument changes shape.", spine),
    ledger: logicLedger(steps, relations),
  };
};

const chainShape = '<section class="local-shape local-chain" data-logic-shape="chain"><h3 class="local-shape-title">A short progression inside one node</h3><p class="local-chain-item">recognize the condition first</p><p class="local-chain-item">then watch the mechanism change</p><p class="local-chain-item">finally observe the result</p></section>';
const timelineShape = '<section class="local-shape local-timeline" data-logic-shape="timeline"><h3 class="local-shape-title">State transitions of one object</h3><div class="timeline-track"><article class="timeline-event"><time class="timeline-time">T0</time><div><h3>manual work</h3><p>attention is filled by repeated actions.</p></div></article><article class="timeline-event"><time class="timeline-time">T1</time><div><h3>judgment moves earlier</h3><p>the tool takes the steps and the person manages exceptions.</p></div></article></div></section>';
const radialShape = '<section class="local-shape local-radial" data-logic-shape="radial"><h3 class="local-shape-title">Several mechanisms acting together</h3><div class="radial-grid"><article class="radial-center"><h3>feedback changes the next round</h3><p>the result must enter the next allocation.</p></article><article class="radial-spoke"><h3>changing information</h3><p>the bias becomes visible.</p></article><article class="radial-spoke"><h3>changing incentives</h3><p>the effective path gets resources.</p></article></div></section>';

const linearWhiteboards = {
  "whiteboard-chain": buildLinearWhiteboard("chain", chainShape),
  "whiteboard-timeline": buildLinearWhiteboard("timeline", timelineShape),
  "whiteboard-matrix": buildLinearWhiteboard("matrix", matrixShape),
  "whiteboard-radial": buildLinearWhiteboard("radial", radialShape),
};

// Authored teaching input shared by both molds. These are layout/content samples,
// not evidence of reader learning and not production long cards with generated art.
const learningParagraphs = [
  "A taut 13-metre guy line runs to the top of a vertical flagpole. The ground is level and the foot of the line is 5 metres from the foot of the pole. How tall is the pole?",
  "The pole is perpendicular to the ground, forming the right angle; the taut line is the hypotenuse c=13 and the horizontal distance is the leg b=5. A right triangle satisfies a^2+b^2=c^2.",
  "The pole height is a=sqrt(13^2-5^2)=12 metres. Only after recognizing the right angle and each side does the formula have definite inputs.",
  "Now take a 10-metre straight ladder leaning against a vertical wall on level ground, its foot 6 metres from the wall. Which side is the hypotenuse, and how high does the top reach? If the ground slopes, can the same computation still be used directly?",
  "The ladder is the hypotenuse; the wall is perpendicular to the level ground, so the height is sqrt(10^2-6^2)=8 metres. If the ground slopes, the angle between wall and ground has to be re-judged and the right-angle condition cannot simply be carried over.",
];
const learningSourcePath = join(output, "learning-source.txt");
const learningInventoryPath = join(output, "learning-source-inventory.json");
const learningSource = `${learningParagraphs.join("\n\n")}\n`;
await Bun.write(learningSourcePath, learningSource);
await run(["bun", join(root, "assets", "prepare-whiteboard-source.ts"), learningSourcePath, learningInventoryPath]);

const learningPanel = (body: string, label: string, className = "learning-material") =>
  `<section class="${className}"><span class="learning-label">${label}</span><p>${body}</p></section>`;
const transferHtml = learningPanel(learningParagraphs[3], "a different situation - judge before scrolling", "transfer-check") +
  learningPanel(learningParagraphs[4], "check the grounds", "transfer-feedback");
const learningSteps: FixtureStep[] = [
  { id: "step-01", role: "question", source_refs: ["src-01"], claim: "How is the flagpole height computed?", support: learningParagraphs[0], residue: "", must_render: true, presentation: "text" },
  { id: "step-02", role: "premise", source_refs: ["src-02"], claim: "Recognize the right angle and the hypotenuse first", support: learningParagraphs[1], residue: "", must_render: true, presentation: "text" },
  { id: "step-03", role: "conclusion", source_refs: ["src-03"], claim: "Compute only once the correspondence is clear", support: learningParagraphs[2], residue: "", must_render: true, presentation: "text" },
  { id: "step-04", role: "conclusion", source_refs: ["src-04", "src-05"], claim: "Change the object, recheck the conditions", support: `a different situation - judge before scrolling ${learningParagraphs[3]} check the grounds ${learningParagraphs[4]}`, residue: "", must_render: true, presentation: "text" },
];
const learningRelations: FixtureRelation[] = learningSteps.slice(0, -1).map((step, index) => ({
  id: `rel-0${index + 1}`, from: step.id, to: learningSteps[index + 1].id,
  kind: "continue", visibility: "implicit", bridge: "",
}));
const learningSpine = learningSteps.map((step, index) => {
  let html = logicStep(step, String(index + 1).padStart(2, "0"));
  if (index === 1) {
    html = html.replace(`<p class="step-support">${step.support}</p>`,
      `<section class="learning-material"><span class="learning-label">what makes it this kind</span><p class="step-support">${step.support}</p></section>`);
  }
  if (index === 3) {
    // Keep one complete support surface for the existing ledger/DOM contract.
    html = html.replace(`<p class="step-support">${step.support}</p>`,
      `<div class="step-support">${transferHtml}</div>`);
  }
  return html + (learningRelations[index] ? logicRelation(learningRelations[index]) : "");
}).join("");
const learningLedger = JSON.stringify({
  version: 2,
  source_sha256: sha256(new TextEncoder().encode(learningSource)),
  source_sections: learningParagraphs.map((_, index) => {
    const id = `src-${String(index + 1).padStart(2, "0")}`;
    return { id, disposition: "rendered", step_ids: learningSteps.filter(step => step.source_refs.includes(id)).map(step => step.id) };
  }),
  steps: learningSteps,
  relations: learningRelations,
}).replaceAll("<", "\\u003c");

const fixtures: Record<string, Record<string, string>> = {
  "long-learning": {
    LOGO: logo, SOURCE_LINE: '<span class="info-source">teaching material written for this test - layout check</span>',
    IMAGE_STATE: "empty", IMAGE_SRC: "", IMAGE_ALT: "",
    BG_COLOR: "#FAF6EC", ACCENT_COLOR: "#B6533F",
    TITLE_BLOCK: '<div class="title-area"><div class="eyebrow">knowledge explanation - discrimination and application</div><h1>Reciting the formula is not enough; you must identify the object</h1><p class="deck">How does one relation travel from a flagpole to a ladder?</p></div>',
    BODY_HTML: `<p>${learningParagraphs[0]}</p>${learningPanel(learningParagraphs[1], "what makes it this kind")}<p>${learningParagraphs[2]}</p>${transferHtml}`,
  },
  "whiteboard-learning": {
    LOGO: logo, SOURCE_LINE: '<span class="info-source">teaching material written for this test - source and layout check</span>',
    CUSTOM_CSS: "", LOGIC_LEDGER_JSON: learningLedger,
    CONTENT_HTML: whiteboardShell("From the scene into the formula", "Which concrete conditions let this problem use the Pythagorean theorem?", "From flagpole to ladder: recognize the right angle and the hypotenuse, then compute the height.", learningSpine),
  },
  long: {
    ...common,
    IMAGE_SRC: fixtureImage,
    IMAGE_ALT: fixtureImageAlt,
    BG_COLOR: "#FAF6EC",
    ACCENT_COLOR: "#B6533F",
    TITLE_BLOCK: '<div class="title-area"><div class="eyebrow">paper reading - decision boundary</div><h1>AI is not only saving time</h1><p class="deck">The real productivity question is how control moves through the workflow.</p></div>',
    BODY_HTML: '<p class="dropcap">One person faces the same set of tasks: first doing all of it by hand, then letting a tool take over the repeated steps. The scene draws only the change in action; the conclusion is still stated exactly in words.</p><p class="highlight">The key change is not speed; it is attention moving from execution to judgment.</p><section class="narrative-beat"><span class="beat-index">01</span><div><h2>The pressure appears</h2><p>The number of tasks has not fallen, and repetition eats the time meant for judgment first.</p></div></section><section class="narrative-beat"><span class="beat-index">02</span><div><h2>Control moves</h2><p>The tool takes the describable steps; the person keeps the goal, the exceptions and the acceptance.</p></div></section><div class="metric-row"><div class="metric"><strong>1</strong><span>stable character carrying the change</span></div><div class="metric"><strong>2 beats</strong><span>enough for one causal chain</span></div></div><p>Efficiency numbers describe local task performance; they do not imply total organizational output or long-term welfare.</p><div class="prompt"><strong>Reading question:</strong> what did the tool do for you, and which judgment did it hand back?</div><div class="closing-judgment">When putting AI into a workflow, map control first and discuss speed second.</div>',
  },
  full: {
    ...common,
    CUSTOM_CSS: "",
    DOCUMENT_HTML: fullDocumentHtml,
  },
  comic: {
    ...common,
    CUSTOM_CSS: '.fixture { margin: 24px 60px 42px; padding: 32px; border: 4px solid var(--ink); } .fixture h1 { font: 900 68px/1 var(--serif); } .fixture p { margin-top: 18px; font: 400 28px/1.5 var(--sans); }',
    CONTENT_HTML: '<main class="fixture"><h1>The action enters the panel</h1><p>Dialogue, captions and panel borders are still carried by the layout layer.</p></main>',
  },
  whiteboard: {
    LOGO: logo,
    SOURCE_LINE: '<span class="info-source">vertical argument acceptance sample</span>',
    CUSTOM_CSS: "",
    LOGIC_LEDGER_JSON: logicLedger(compositeSteps, compositeRelations),
    CONTENT_HTML: whiteboardComposite,
  },
  ...Object.fromEntries(Object.entries(linearWhiteboards).map(([name, fixture]) => [name, {
    LOGO: logo,
    SOURCE_LINE: '<span class="info-source">local structure acceptance sample</span>',
    CUSTOM_CSS: "",
    LOGIC_LEDGER_JSON: fixture.ledger,
    CONTENT_HTML: fixture.html,
  }])),
};

for (const [name, values] of Object.entries(fixtures)) {
  const templateName = name.startsWith("whiteboard") ? "whiteboard" : name.startsWith("long") ? "long" : name;
  const template = await Bun.file(join(root, "assets", `${templateName}_template.html`)).text();
  const path = join(output, `${name}.html`);
  await Bun.write(path, fill(template, values));
  console.log(path);
}

const whiteboardTemplate = await Bun.file(join(root, "assets", "whiteboard_template.html")).text();
const validWhiteboardHtml = fill(whiteboardTemplate, fixtures.whiteboard);
const implicitCopyRelations = structuredClone(compositeRelations);
implicitCopyRelations[0].bridge = "Pressing further.";
const implicitCopyHtml = fill(whiteboardTemplate, {
  ...fixtures.whiteboard,
  LOGIC_LEDGER_JSON: logicLedger(compositeSteps, implicitCopyRelations),
});
const duplicateTransitionSteps = structuredClone(compositeSteps);
duplicateTransitionSteps[1].residue = "If experience is to persist across tasks, a mechanism that keeps writing it down has to be found.";
const duplicateTransitionHtml = fill(whiteboardTemplate, {
  ...fixtures.whiteboard,
  LOGIC_LEDGER_JSON: logicLedger(duplicateTransitionSteps, compositeRelations),
  CONTENT_HTML: whiteboardComposite.replace(
    '<p class="step-residue"></p>',
    '<p class="step-residue">If experience is to persist across tasks, a mechanism that keeps writing it down has to be found.</p>',
  ),
});
const invalidWhiteboards = [
  {
    name: "whiteboard-invalid-placeholder",
    expected: "Unreplaced placeholders",
    html: validWhiteboardHtml.replace('data-step-id="step-01"', 'data-step-id="{{UNRESOLVED_STEP}}"'),
  },
  {
    name: "whiteboard-invalid-summary-collapse",
    expected: "Ledger/DOM step mismatch",
    html: validWhiteboardHtml.replace(
      '<article class="logic-step" data-step-id="step-02"',
      '<article class="logic-step omitted-step" data-removed-step-id="step-02"',
    ),
  },
  {
    name: "whiteboard-invalid-source-anchor",
    expected: "missing source refs",
    html: validWhiteboardHtml.replace('data-source-refs="src-03"', 'data-source-refs=""'),
  },
  {
    name: "whiteboard-invalid-relation-endpoint",
    expected: "Relation endpoint not found",
    html: validWhiteboardHtml
      .replace('"to":"step-03"', '"to":"missing-step"')
      .replace('data-to="step-03"', 'data-to="missing-step"'),
  },
  {
    name: "whiteboard-invalid-branch-return",
    expected: "must return",
    html: validWhiteboardHtml.replace('class="branch-return"', 'class="branch-return-missing"'),
  },
  {
    name: "whiteboard-invalid-implicit-copy",
    expected: "must keep bridge empty",
    html: implicitCopyHtml,
  },
  {
    name: "whiteboard-invalid-duplicate-transition",
    expected: "duplicates the visible transition",
    html: duplicateTransitionHtml,
  },
  {
    name: "whiteboard-invalid-overflow",
    expected: "Horizontal overflow",
    html: validWhiteboardHtml.replace("</style>", ".whiteboard-content { width: 1320px; }</style>"),
  },
  {
    name: "whiteboard-invalid-height",
    expected: "Full-page height",
    html: validWhiteboardHtml.replace("</style>", ".whiteboard-content { min-height: 31050px; }</style>"),
  },
] as const;

for (const fixture of invalidWhiteboards) {
  const path = join(output, `${fixture.name}.html`);
  await Bun.write(path, fixture.html);
  console.log(path);
}

const fullTemplate = await Bun.file(join(root, "assets", "full_template.html")).text();
const missingPreferredTemplate = fullTemplate.replaceAll(
  "'KingHwa_OldSong'",
  "'DefinitelyMissingKingHwaOldSong'",
);
if (missingPreferredTemplate === fullTemplate) {
  throw new Error("Full template does not expose the KingHwa_OldSong preferred-font slot");
}
const fallbackHtmlPath = join(output, "full-fallback.html");
await Bun.write(fallbackHtmlPath, fill(missingPreferredTemplate, fixtures.full));
console.log(fallbackHtmlPath);

const longTemplate = await Bun.file(join(root, "assets", "long_template.html")).text();
const longBase = fixtures.long;

for (const [name, imageValues] of Object.entries({
  "long-empty": { IMAGE_STATE: "empty", IMAGE_SRC: "", IMAGE_ALT: "" },
  "long-broken": {
    IMAGE_STATE: "ready",
    IMAGE_SRC: pathToFileURL(join(output, "does-not-exist.png")).href,
    IMAGE_ALT: "used to verify that a broken image is rejected by the screenshot gate",
  },
})) {
  const path = join(output, `${name}.html`);
  await Bun.write(path, fill(longTemplate, { ...longBase, ...imageValues }));
  console.log(path);
}

await run([
  "bun",
  join(root, "assets", "verify-full-text.ts"),
  ledgerPath,
  join(output, "full.html"),
  sourcePath,
]);

const preferredFontReport = await inspectBodyFonts(join(output, "full.html"));
const fallbackFontReport = await inspectBodyFonts(fallbackHtmlPath);
if (preferredFontReport.platform_fonts.length === 0) {
  throw new Error("Preferred full-text body resolved to no platform font");
}
if (preferredFontReport.title_platform_fonts.length === 0 || preferredFontReport.headline_platform_fonts.length === 0) {
  throw new Error("Preferred full-text title or headline resolved to no platform font");
}
if (fallbackFontReport.platform_fonts.length === 0) {
  throw new Error("Missing-preferred-font simulation resolved to no fallback platform font");
}
if (fallbackFontReport.title_platform_fonts.length === 0 || fallbackFontReport.headline_platform_fonts.length === 0) {
  throw new Error("Missing-preferred-font simulation resolved title or headline to no fallback font");
}
if (preferredFontReport.remote_resources.length > 0 || fallbackFontReport.remote_resources.length > 0) {
  throw new Error("Full-text font path loaded a remote resource");
}
const preferredSurfaces = [
  preferredFontReport.platform_fonts,
  preferredFontReport.title_platform_fonts,
  preferredFontReport.headline_platform_fonts,
];
if (preferredSurfaces.some(fonts => !fonts.some(font => font.familyName === "KingHwa_OldSong"))) {
  throw new Error("Installed KingHwa_OldSong did not unify body, title, and headline");
}
const fallbackSurfaces = [
  fallbackFontReport.platform_fonts,
  fallbackFontReport.title_platform_fonts,
  fallbackFontReport.headline_platform_fonts,
];
if (fallbackSurfaces.some(fonts => fonts.some(font => font.familyName === "KingHwa_OldSong"))) {
  throw new Error("Missing-preferred-font simulation did not fall through the local stack");
}
if (!fallbackFontReport.platform_fonts.some(font => font.familyName === "Songti SC")) {
  throw new Error("Missing-preferred-font body did not resolve to Songti SC on this machine");
}
if (!fallbackFontReport.title_platform_fonts.some(font => font.familyName === "PingFang SC") ||
    !fallbackFontReport.headline_platform_fonts.some(font => font.familyName === "PingFang SC")) {
  throw new Error("Missing-preferred-font title or headline did not resolve to PingFang SC on this machine");
}
for (const report of [preferredFontReport, fallbackFontReport]) {
  const metrics = report.visual_metrics;
  if (metrics.canvas_background !== "rgb(255, 255, 255)" || metrics.card_background !== "rgb(255, 255, 255)") {
    throw new Error("Full-text reading surface is not pure white");
  }
  if (metrics.text_color !== "rgb(23, 23, 23)") {
    throw new Error("Full-text body is not deep neutral black");
  }
  if (metrics.font_size_px < 40 || metrics.line_height_ratio < 1.9) {
    throw new Error("Full-text body size or line-height fell below the reading threshold");
  }
  if (metrics.document_width_px < 890 || metrics.document_width_px > 900) {
    throw new Error("Full-text measure escaped the 890–900px reading range");
  }
  if (metrics.contrast_ratio < 15) {
    throw new Error("Full-text body contrast fell below 15:1");
  }
}
console.log(JSON.stringify({
  "font-readback": "pass",
  "readability-readback": "pass",
  preferred: preferredFontReport,
  missing_preferred_fallback: fallbackFontReport,
}, null, 2));

const whiteboardFontReport = await inspectWhiteboardFonts(join(output, "whiteboard.html"));
if (whiteboardFontReport.remote_resources.length > 0) {
  throw new Error("Whiteboard font path loaded a remote resource");
}
if (!whiteboardFontReport.title.some(font => font.familyName === "Kaiti SC") ||
    !whiteboardFontReport.relation.some(font => font.familyName === "Kaiti SC")) {
  throw new Error("Whiteboard title or visible transition did not resolve to local Kaiti SC");
}
if (!whiteboardFontReport.body.some(font => font.familyName === "PingFang SC")) {
  throw new Error("Whiteboard body did not resolve to local PingFang SC");
}
console.log(JSON.stringify({
  "whiteboard-font-readback": "pass",
  ...whiteboardFontReport,
}, null, 2));

for (const name of Object.keys(fixtures)) {
  const pngPath = join(output, `${name}.png`);
  const captureCommand = [
    "bun",
    join(root, "assets", "capture.ts"),
    join(output, `${name}.html`),
    pngPath,
    "1080",
    "1600",
    "fullpage",
  ];
  if (name.startsWith("whiteboard")) {
    captureCommand.push(...(name === "whiteboard-learning"
      ? [learningInventoryPath, learningSourcePath]
      : [whiteboardSourceInventoryPath, whiteboardSourcePath]));
  }
  await run(captureCommand);
  const width = await readPngWidth(pngPath);
  if (width !== 1080) throw new Error(`Fixture width mismatch for ${name}: ${width}`);
  console.log(`fixture-readback: ${name} width=${width}`);
}

for (const fixture of invalidWhiteboards) {
  const invalidPng = join(output, `${fixture.name}.png`);
  await unlink(invalidPng).catch(error => {
    if ((error as { code?: string }).code !== "ENOENT") throw error;
  });
  await runExpectFailure([
    "bun",
    join(root, "assets", "capture.ts"),
    join(output, `${fixture.name}.html`),
    invalidPng,
    "1080",
    "1600",
    "fullpage",
    whiteboardSourceInventoryPath,
    whiteboardSourcePath,
  ], fixture.expected);
}
