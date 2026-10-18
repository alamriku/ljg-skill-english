#!/usr/bin/env bun

import { basename } from "node:path";
import { readFileSync } from "node:fs";
import { normalizeLegacyMap } from "./paper_map_compat";

export interface Result {
  ok: boolean;
  errors: string[];
  warnings: string[];
  stats: Record<string, string | number | boolean>;
}

const requiredHeaders = [
  "title", "subtitle", "description", "date", "filetags",
  "identifier", "source", "authors", "venue",
];

const genericHeadings = new Set([
  "abstract", "background", "problem", "research question", "method", "methods",
  "experiment", "experiments", "experimental results", "results", "findings",
  "key findings", "limitation", "limitations", "conclusion", "conclusions",
  "implications", "takeaways", "what i take away", "what it really solves",
]);

const genericAnchors = new Set([
  "problem", "method", "model", "system", "experiment", "result", "finding",
  "relation", "change", "conclusion", "boundary",
]);

const identityFields = [
  "Contribution type", "Object of study", "What existing methods lack", "Main contribution",
  "Input, processing and output", "Research questions or threads that cannot be dropped",
  "Why the threads belong to one paper", "Evidential support per thread",
  "Claims the paper does not make", "Paper-specific statements in the body",
  "Question and contribution statements in the first two sections", "Paper in brief",
  "How it differs from other papers",
];

const understandingFields = [
  "The concrete question it starts from", "How it would have been understood or handled before",
  "What evidence requires adding to or correcting that understanding",
  "What relation, practice or criterion the authors added",
  "Back at the original question, what changed in the judgment", "What still needs answering",
  "The question or relation running through the piece", "How the cases are chosen and connected",
  "Where the ending returns to", "Three-sentence paraphrase by an unfamiliar reader",
  "Grounding and simplification limits of the illustrations",
];

const generatorFields = [
  "The unified mechanism", "Input, starting point or current state", "Key acting relation",
  "Direction of the result or endpoint", "How it explains two different findings",
  "Prediction after changing a relevant condition, and its grounds", "Boundary of failure",
  "Mechanism statements in the body", "Does the mechanism need explaining in the first two sections",
  "Are diagrams needed", "Which example explains each diagram",
];

const experimentFields = [
  "What the experiment asks", "What was held fixed", "What was changed",
  "What it was compared against", "Main result and exceptions",
  "What the result means in practice", "Which judgment this result changes",
  "What this result cannot establish", "Core evidence statements in the body",
];

const evidenceFields = [
  "Name", "Role", "Location", "Direct result in the paper", "Judgment supported",
  "Matching statement in the body", "Decision", "Reason",
];

const frontstageFields = [
  "Name", "Main job", "Setup or starting point", "Result or consequence",
  "What it helps understand", "Connection to what follows",
];

const continuityFields = [
  "The question the opening answers", "Order of explanation", "Connections between cases",
  "Section-swap check", "Explanation with the numbers removed",
  "What would be lost if only conclusions were kept",
];

const finalFields = [
  "What understanding the paper finally adds or corrects", "Which earlier findings the ending rests on",
  "Matching statement at the end of the body", "How the ending connects to this paper",
  "Does the ending add new evidence, terms or recommendations",
];

const readerFields = [
  "Score-free paraphrase of the whole piece", "The explanation the reader remembers first",
  "The reader's account of how the sections connect", "Research question",
  "The authors' main contribution", "Input -> components/relations -> output",
  "Central experiment: question / fixed / comparison / result / meaning",
  "Scope and limits of the evidence", "Three-sentence paraphrase of the change in understanding",
  "Explanation of results",
];

function substantive(value: string): boolean {
  const cleaned = value.trim();
  return cleaned.length >= 1 && !/^\{.*\}$/.test(cleaned) && !/^[:：|｜\s-]+$/.test(cleaned);
}

function yesNoDecision(value: string): boolean {
  return /^(?:yes|no)(?:\b|[-:,.\s]|$)/i.test(value.trim());
}

function lineField(content: string, field: string): string {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return content.match(new RegExp(`^- ${escaped}[：:][ \\t]*(.*)$`, "m"))?.[1]?.trim() ?? "";
}

function segmentField(line: string, field: string): string {
  const normalized = line.replace(/^- \[[^\]]+\]\s*/, "");
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return normalized.match(new RegExp(`(?:^|[｜|])\\s*${escaped}[：:]\\s*([^｜|]*)`))?.[1]?.trim() ?? "";
}

function parseAnchors(value: string): string[] {
  return value.split(/[｜|]/).map((item) => item.trim()).filter(substantive);
}

function displayWidth(line: string): number {
  return [...line].reduce((sum, char) => sum + (/[^\u0000-\u00ff]/.test(char) ? 2 : 1), 0);
}

function paragraphList(body: string): string[] {
  return body
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph && !/^(?:#\+|\*)/.test(paragraph));
}

export function validate(content: string, file: string, paperMap?: string): Result {
  if (paperMap) paperMap = normalizeLegacyMap(paperMap);
  const currentFormat = paperMap ? lineField(paperMap, "Format version") === "3" : false;
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const header of requiredHeaders) {
    if (!new RegExp(`^#\\+${header}:\\s+\\S`, "im").test(content)) {
      errors.push(`missing or empty #+${header}`);
    }
  }

  const filenameIdentifier = basename(file).match(/^(\d{8}T\d{6})--paper-/)?.[1] ?? "";
  const identifier = content.match(/^#\+identifier:\s*(\d{8}T\d{6})\s*$/im)?.[1] ?? "";
  if (!filenameIdentifier) errors.push("the filename is not in the Denote paper timestamp format");
  if (!identifier || identifier !== filenameIdentifier) {
    errors.push(`IDENTIFIER ${identifier || "(empty)"} does not match the filename ${filenameIdentifier || basename(file)}`);
  }

  const sourceLines = content.match(/^#\+source:.*$/gim) ?? [];
  if (sourceLines.length !== 1) errors.push(`#+source must appear exactly once; found ${sourceLines.length}`);
  if (sourceLines.length === 1 && !/^#\+source:\s+(?:https?:\/\/\S+|\/[^\r\n]+?)\s*$/i.test(sourceLines[0])) {
    errors.push("#+source holds one bare original URL or absolute local path, with no description or reference list");
  }

  const headingMatches = [...content.matchAll(/^\* ([^*\n].*)$/gm)];
  const headings = headingMatches.map((match) => match[1].trim());
  if (headings.length < 2) errors.push(`at least 2 top-level headings named by an event, change or condition are required; found ${headings.length}`);
  const genericHits = headings.filter((heading) => genericHeadings.has(heading.replace(/\s+/g, "")));
  if (genericHits.length) errors.push(`top-level headings must not use generic section labels: ${[...new Set(genericHits)].join(", ")}`);

  const bodyStart = headingMatches[0]?.index ?? content.length;
  const body = content.slice(bodyStart);
  const thirdHeadingStart = headingMatches[2]?.index ?? content.length;
  const earlyBody = content.slice(bodyStart, thirdHeadingStart);
  const lastHeadingStart = headingMatches.at(-1)?.index ?? bodyStart;
  const finalBody = content.slice(lastHeadingStart);

  if (/(?:zero model|FX\s*loop|x\s*\/\s*R\s*\/\s*f\s*\/\s*E|\{\{[^}]+\}\}|\b(?:TODO|TBD|PLACEHOLDER)\b)/i.test(body)) {
    errors.push("the body contains internal analysis labels, template placeholders or unfinished markers");
  }

  const backstagePattern = /(?:paper-map|evidence ledger|this round of verification|took no part in the writing|constructed by the explainer|grounds from the old draft|verification status|Decision: into the body|Decision: reference only)/g;
  const backstageHits = [...body.matchAll(backstagePattern)].map((match) => match[0]);
  if (backstageHits.length) {
    errors.push(`the body leaks research-record or verification language: ${[...new Set(backstageHits)].join(", ")}`);
  }

  const paragraphs = paragraphList(body);
  const denseParagraphs = paragraphs.filter((paragraph) => [...paragraph.replace(/\s/g, "")].length > 240).length;
  if (denseParagraphs) warnings.push(`${denseParagraphs} paragraph(s) exceed 240 words; check whether several important relations were packed into one`);
  const numericCounts = paragraphs.map((paragraph) => (paragraph.match(/\d+(?:\.\d+)?%?/g) ?? []).length);
  const numericTokenCount = numericCounts.reduce((sum, count) => sum + count, 0);
  const numericParagraphCount = numericCounts.filter((count) => count > 0).length;
  const severeNumericPileParagraphs = numericCounts.filter((count) => count >= 7).length;
  const numericPileParagraphs = numericCounts.filter((count) => count >= 5 && count < 7).length;
  if (severeNumericPileParagraphs) {
    const message = `${severeNumericPileParagraphs} paragraph(s) contain at least 7 numbers; check that each comparison has a clear job and an explanation`;
    (currentFormat ? warnings : errors).push(message);
  }
  if (numericPileParagraphs) warnings.push(`${numericPileParagraphs} paragraph(s) contain 5-6 numbers; check that each comparison is necessary and keep the ranges and uncertainty that affect the conclusion`);

  const exampleBlocks = [...content.matchAll(/#\+begin_example\s*\n([\s\S]*?)#\+end_example/gim)];
  if (!currentFormat && exampleBlocks.length > 1) errors.push("at most one Org example block may be kept");
  const maxDiagramWidth = exampleBlocks.reduce((max, block) => {
    const width = block[1].split(/\r?\n/).reduce((lineMax, line) => Math.max(lineMax, displayWidth(line)), 0);
    return Math.max(max, width);
  }, 0);
  if (maxDiagramWidth > 80) errors.push(`the ASCII diagram is ${maxDiagramWidth} columns wide, over the 80-column limit`);

  let identityAnchorCount = 0;
  let orientationAnchorCount = 0;
  let evidenceCount = 0;
  let centralEvidenceCount = 0;
  let necessaryEvidenceCount = 0;
  let backgroundEvidenceCount = 0;
  let frontstageCount = 0;
  let generatorExists = "";
  let quantitativeException = false;
  let paperMapVersion = "";

  if (!paperMap) {
    errors.push("every paper note must supply the --map paper-map research record");
  } else {
    const version = lineField(paperMap, "Format version");
    paperMapVersion = version;
    if (!/^(?:1|2|3)$/.test(version)) errors.push(`the paper-map format version must be 1, 2 or 3; found ${version || "(empty)"}`);
    if (version === "1" || version === "2") warnings.push(`paper-map format version ${version} runs in compatibility mode with the old rules; use version 3 for new notes`);

    for (const field of ["Location in the source", "Paper information", "Source hash", "What the material supports", "External-instruction scan"]) {
      if (!substantive(lineField(paperMap, field))) errors.push(`the paper-map is missing a material field: ${field}`);
    }
    if (currentFormat) {
      const noteSource = content.match(/^#\+source:[ \t]*(.*)$/im)?.[1]?.trim() ?? "";
      if (noteSource !== lineField(paperMap, "Location in the source")) errors.push("the note's #+source differs from the research record's location in the source");
    }
    const injectionScan = lineField(paperMap, "External-instruction scan");
    if (substantive(injectionScan) && !/^(?:none found|stopped)/i.test(injectionScan)) {
      errors.push("the External-instruction scan must start with \"none found\" or \"stopped\"");
    }

    if (currentFormat && /^stopped/i.test(injectionScan)) errors.push("processing of the material was stopped, so it cannot be marked deliverable");

    for (const field of identityFields) {
      if (!substantive(lineField(paperMap, field))) errors.push(`research question and contribution not filled in: ${field}`);
    }
    const contributionType = lineField(paperMap, "Contribution type");
    if (substantive(contributionType) && !/^(?:method|intervention|explanation|theory|measurement|benchmark|resource|system)/i.test(contributionType)) {
      errors.push("the contribution type must pick a main type from method/intervention, explanation/theory, measurement/benchmark, resource/system");
    }

    const uniqueResultShape = lineField(paperMap, "Main result statement in the body");
    const extraQuantitativeForeground = lineField(paperMap, "Is a supplementary quantitative comparison included");
    if (version === "2" || currentFormat) {
      if (!substantive(uniqueResultShape)) errors.push("central experiment or argument not filled in: Main result statement in the body");
      else if (!body.includes(uniqueResultShape)) errors.push(`the main result statement "${uniqueResultShape}" does not appear in the body`);
      if (!yesNoDecision(extraQuantitativeForeground)) errors.push("\"Is a supplementary quantitative comparison included\" must answer yes or no with a reason");
    }
    quantitativeException = /^yes/i.test(extraQuantitativeForeground);
    if (!currentFormat && quantitativeException && !/^(?:measurement|benchmark)/i.test(contributionType)) {
      errors.push("the old version allowed the supplementary-comparison exception only for measurement/benchmark papers; the new version decides by what the comparison actually does");
    }
    const numericTokenLimit = quantitativeException ? 8 : 4;
    const numericParagraphLimit = quantitativeException ? 2 : 1;
    if (currentFormat && !substantive(lineField(paperMap, "What the supplementary comparison does"))) {
      errors.push("central experiment or argument not filled in: What the supplementary comparison does");
    }
    if (numericTokenCount > numericTokenLimit || numericParagraphCount > numericParagraphLimit) {
      if (currentFormat) warnings.push(`the body has ${numericTokenCount} numbers across ${numericParagraphCount} paragraph(s); use the evidence record and the independent reading check to confirm each comparison does a job`);
      else errors.push(
        `old-version numeric limit: the body has ${numericTokenCount} numbers across ${numericParagraphCount} paragraph(s); ` +
        `${quantitativeException ? "the benchmark exception" : "the old default rule"} allows at most ${numericTokenLimit} numbers and ${numericParagraphLimit} quantitative paragraph(s). ` +
        "splitting paragraphs does not turn an evidence list into prose; move the remaining exact figures back into the paper-map",
      );
    }

    const identityAnchors = parseAnchors(lineField(paperMap, "Paper-specific statements in the body"));
    identityAnchorCount = identityAnchors.length;
    if (identityAnchors.length < 2) errors.push(`at least 2 paper-specific statements are required; found ${identityAnchors.length}`);
    const genericIdentityAnchors = identityAnchors.filter((anchor) => genericAnchors.has(anchor));
    if (genericIdentityAnchors.length) errors.push(`these paper-specific statements are too generic: ${genericIdentityAnchors.join(", ")}`);
    const missingIdentityAnchors = identityAnchors.filter((anchor) => !body.includes(anchor));
    if (missingIdentityAnchors.length) errors.push(`these paper-specific statements do not appear in the body: ${missingIdentityAnchors.join(", ")}`);

    const orientationAnchors = parseAnchors(lineField(paperMap, "Question and contribution statements in the first two sections"));
    orientationAnchorCount = orientationAnchors.length;
    if (orientationAnchors.length < 2) errors.push(`at least 2 question-and-contribution statements are required; found ${orientationAnchors.length}`);
    const lateOrientationAnchors = orientationAnchors.filter((anchor) => !earlyBody.includes(anchor));
    if (lateOrientationAnchors.length) errors.push(`these question-and-contribution statements do not appear within the first two top-level headings: ${lateOrientationAnchors.join(", ")}`);

    for (const field of understandingFields) {
      if (!substantive(lineField(paperMap, field))) errors.push(`the reader's change of understanding is not filled in: ${field}`);
    }

    generatorExists = lineField(paperMap, "Is there a unified mechanism");
    if (!yesNoDecision(generatorExists)) {
      errors.push("\"Is there a unified mechanism\" must answer yes or no with a reason");
    } else if (/^yes/i.test(generatorExists)) {
      for (const field of generatorFields) {
        if (!substantive(lineField(paperMap, field))) errors.push(`mechanism and explanation of results not filled in: ${field}`);
      }
      const generatorAnchors = parseAnchors(lineField(paperMap, "Mechanism statements in the body"));
      if (!generatorAnchors.length) errors.push("when a mechanism is declared, at least 1 mechanism statement in the body is required");
      const missingGeneratorAnchors = generatorAnchors.filter((anchor) => !body.includes(anchor));
      if (missingGeneratorAnchors.length) errors.push(`these mechanism statements do not appear in the body: ${missingGeneratorAnchors.join(", ")}`);
      const earlyDecision = lineField(paperMap, "Does the mechanism need explaining in the first two sections");
      if (!yesNoDecision(earlyDecision)) errors.push("\"Does the mechanism need explaining in the first two sections\" must answer yes or no with a reason");
      if (/^yes/i.test(earlyDecision)) {
        const lateGeneratorAnchors = generatorAnchors.filter((anchor) => !earlyBody.includes(anchor));
        if (lateGeneratorAnchors.length) errors.push(`the mechanism was required early, but these statements appear too late: ${lateGeneratorAnchors.join(", ")}`);
      }
    } else if (/^no/i.test(generatorExists)) {
      const generator = lineField(paperMap, "The unified mechanism");
      if (!/not found|does not exist/i.test(generator)) errors.push("when no unified mechanism is declared, \"The unified mechanism\" must say not found or does not exist");
    }

    const visualDecision = lineField(paperMap, "Are diagrams needed");
    if (!yesNoDecision(visualDecision)) errors.push("\"Are diagrams needed\" must answer yes or no with a reason");
    if (/^yes/i.test(visualDecision)) {
      if (!exampleBlocks.length || (!currentFormat && exampleBlocks.length !== 1)) {
        errors.push(currentFormat ? "diagrams were declared necessary, but the body has no example block" : "when the old version declared diagrams necessary, the body had to contain exactly 1 example block");
      }
      const carriers = parseAnchors(lineField(paperMap, "Which example explains each diagram"));
      if (currentFormat && carriers.length !== exampleBlocks.length) errors.push("each diagram needs its explaining example recorded, in order");
      for (let index = 0; index < exampleBlocks.length; index++) {
        const block = exampleBlocks[index];
        const carrier = carriers[index];
        const afterDiagram = content.slice((block.index ?? 0) + block[0].length, exampleBlocks[index + 1]?.index);
        if (!carrier || !afterDiagram.includes(carrier)) errors.push(`no matching example found after the diagram: ${carrier || "(not filled in)"}`);
      }
    } else if (/^no/i.test(visualDecision) && exampleBlocks.length) {
      warnings.push("the record says no diagrams are needed, but the body contains an example block; recheck that decision");
    }

    for (const field of experimentFields) {
      if (!substantive(lineField(paperMap, field))) errors.push(`central experiment or argument not filled in: ${field}`);
    }
    const centralAnchor = lineField(paperMap, "Core evidence statements in the body");
    if (substantive(centralAnchor) && !body.includes(centralAnchor)) errors.push(`the core evidence statement "${centralAnchor}" does not appear in the body`);

    const evidenceLines = [...paperMap.matchAll(/^- \[evidence\]\s+.+$/gm)].map((match) => match[0]);
    evidenceCount = evidenceLines.length;
    for (const line of evidenceLines) {
      const missing = evidenceFields.filter((field) => {
        if (currentFormat && field === "Matching statement in the body" && /^reference$/i.test(segmentField(line, "Role"))) return false;
        return !substantive(segmentField(line, field));
      });
      if (missing.length) errors.push(`the evidence entry is missing fields: ${missing.join(", ")}; entry=${line}`);
      const role = segmentField(line, "Role");
      const decision = segmentField(line, "Decision");
      if (!/^(?:core|supporting|reference)$/i.test(role)) errors.push(`the evidence role must be core/supporting/reference: ${role || "(empty)"}`);
      if (!/^(?:into the body|merged|reference only)$/i.test(decision)) errors.push(`the evidence decision must be into the body/merged/reference only: ${decision || "(empty)"}`);
      if (/^core$/i.test(role)) centralEvidenceCount++;
      if (/^supporting$/i.test(role)) necessaryEvidenceCount++;
      if (/^reference$/i.test(role)) backgroundEvidenceCount++;
      if (/^reference$/i.test(role) && !/^reference only$/i.test(decision)) errors.push("a reference evidence entry must have the decision \"reference only\"");
      if (!/^reference only$/i.test(decision)) {
        const anchor = segmentField(line, "Matching statement in the body");
        if (/^(?:none|not found)$/i.test(anchor) || !body.includes(anchor)) errors.push(`the matching statement for evidence marked into the body or merged does not appear in the body: ${anchor || "(empty)"}`);
      }
    }
    if (!centralEvidenceCount) errors.push("the evidence record needs at least 1 core entry");
    if (!currentFormat && !necessaryEvidenceCount) errors.push("the evidence record needs at least 1 supporting entry");
    if (!currentFormat && !backgroundEvidenceCount) errors.push("the evidence record needs at least 1 reference entry; this category requirement is kept for versions 1 and 2");

    const frontstageLines = [...paperMap.matchAll(/^- \[frontstage\]\s+.+$/gm)].map((match) => match[0]);
    frontstageCount = frontstageLines.length;
    if (!frontstageCount) errors.push("the paper-map needs at least 1 case from the body");
    const responsibilities: string[] = [];
    for (const line of frontstageLines) {
      const missing = frontstageFields.filter((field) => !substantive(segmentField(line, field)));
      if (missing.length) errors.push(`the body-case entry is missing fields: ${missing.join(", ")}; entry=${line}`);
      const name = segmentField(line, "Name");
      const responsibility = segmentField(line, "Main job");
      if (substantive(name) && !body.includes(name)) errors.push(`the body case "${name}" does not appear in the body`);
      if (substantive(responsibility)) responsibilities.push(responsibility);
    }
    const duplicateResponsibilities = [...new Set(responsibilities.filter((item, index, all) => all.indexOf(item) !== index))];
    if (duplicateResponsibilities.length) {
      const message = `cases repeat the same main job: ${duplicateResponsibilities.join(", ")}; check whether they provide different information`;
      (currentFormat ? warnings : errors).push(message);
    }

    for (const field of continuityFields) {
      if (!substantive(lineField(paperMap, field))) errors.push(`section organization and connections not filled in: ${field}`);
    }

    for (const field of finalFields) {
      if (!substantive(lineField(paperMap, field))) errors.push(`ending check not filled in: ${field}`);
    }
    const finalAnchor = lineField(paperMap, "Matching statement at the end of the body");
    if (substantive(finalAnchor) && !finalBody.includes(finalAnchor)) errors.push(`the ending statement "${finalAnchor}" does not appear under the last content heading`);
    const newMaterialDecision = lineField(paperMap, "Does the ending add new evidence, terms or recommendations");
    if (substantive(newMaterialDecision) && !/^no/i.test(newMaterialDecision)) errors.push("the ending must not add new evidence, terms or recommendations; this field must start with \"no\"");

    for (const field of readerFields) {
      if (version === "2" || currentFormat || !["Score-free paraphrase of the whole piece", "The explanation the reader remembers first", "The reader's account of how the sections connect"].includes(field)) {
        if (!substantive(lineField(paperMap, field))) errors.push(`the unfamiliar-reader check is not filled in: ${field}`);
      }
    }
    if (version === "2" || currentFormat) {
      const noNumberRetell = lineField(paperMap, "Score-free paraphrase of the whole piece");
      if (!currentFormat && /\d+(?:\.\d+)?%?/.test(noNumberRetell)) errors.push("the score-free paraphrase still contains digits; explain the process first and answer with experimental figures afterwards");
      if (lineField(paperMap, "Whole-text verdict") !== "NARRATIVE_PASS") errors.push("the whole-text comprehension check must record NARRATIVE_PASS");
    }
    if (lineField(paperMap, "Question-and-contribution verdict") !== "PAPER_IDENTITY_PASS") errors.push("the five unfamiliar-reader questions must reach PAPER_IDENTITY_PASS");
    if (lineField(paperMap, "Understanding verdict") !== "UNDERSTANDING_PASS") errors.push("the three-sentence change of understanding must reach UNDERSTANDING_PASS");
    if (lineField(paperMap, "Reconstruction verdict") !== "RECONSTRUCTION_PASS") errors.push("the explanation of results must reach RECONSTRUCTION_PASS");
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: {
      top_headings: headings.length,
      body_chars: [...body.replace(/\s/g, "")].length,
      identity_anchor_count: identityAnchorCount,
      orientation_anchor_count: orientationAnchorCount,
      evidence_count: evidenceCount,
      central_evidence_count: centralEvidenceCount,
      necessary_evidence_count: necessaryEvidenceCount,
      background_evidence_count: backgroundEvidenceCount,
      frontstage_count: frontstageCount,
      generator_exists: generatorExists,
      example_blocks: exampleBlocks.length,
      max_diagram_width: maxDiagramWidth,
      dense_paragraphs: denseParagraphs,
      numeric_pile_paragraphs: numericPileParagraphs,
      severe_numeric_pile_paragraphs: severeNumericPileParagraphs,
      numeric_tokens: numericTokenCount,
      numeric_paragraphs: numericParagraphCount,
      quantitative_exception: quantitativeException,
      paper_map_version: paperMapVersion,
      map_supplied: Boolean(paperMap),
    },
  };
}

function main(): never {
  const args = Bun.argv.slice(2);
  const mapFlag = args.indexOf("--map");
  const mapPath = mapFlag >= 0 ? args[mapFlag + 1] : undefined;
  const stdinMode = args.includes("--stdin");
  const positional = args.filter((arg, index) => arg !== "--stdin" && arg !== "--map" && index !== mapFlag + 1);
  const file = positional[0];

  if (!file || (mapFlag >= 0 && !mapPath)) {
    console.error("Usage: bun scripts/validate_note.ts <note.org> --map <paper-map.md>");
    console.error("or:    bun scripts/validate_note.ts --stdin <denote-filename> --map <paper-map.md>");
    process.exit(2);
  }

  const content = stdinMode ? readFileSync(0, "utf8") : readFileSync(file, "utf8");
  const paperMap = mapPath ? readFileSync(mapPath, "utf8") : undefined;
  const result = validate(content, file, paperMap);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.ok ? 0 : 1);
}

if (import.meta.main) main();
