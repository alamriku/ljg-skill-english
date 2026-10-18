#!/usr/bin/env bun

import { readFileSync } from "node:fs";
import { basename } from "node:path";

export type Result = {
  /** ok only reports the structural checks below, never reading quality. */
  ok: boolean;
  assessment_scope: "structure and record completeness; it does not establish source accuracy, reading continuity or understanding";
  semantic_assessment: "not_performed";
  file: string;
  errors: string[];
  warnings: string[];
  checks: Record<string, number | string | boolean>;
};

const validMaterialGrades = ["complete breakdown", "partial breakdown", "provisional"] as const;
const essenceHeading = "What stays with you afterwards";

const wholeBookFields = [
  "What kind or form of book this is",
  "Starting point, main change and endpoint",
  "The core understanding",
  "How the parts connect",
  "What the author most wants to correct or preserve",
  "Whole-book anchors that must appear in the body",
];

const genericWholeBookAnchors = new Set([
  "question", "relation", "change", "result", "understanding", "judgment",
  "conclusion", "theme", "author", "this book", "reader", "evidence",
  "boundary", "method", "concept",
]);

const threadFields = [
  "Name", "Starting point", "Key advance", "Change before and after",
  "Reason for the switch", "Grounds and boundary",
];

const reviewFields = [
  "Counter-evidence and selection",
  "Whole-book paraphrase and reconstruction of relations",
  "Reading breaks and revisions",
  "With the final section covered, is the author's concern understandable",
  "Which two widely separated turns in the body jointly support it",
];

const generatorFields = [
  "The whole-book generator",
  "How the generator runs through at least two widely separated turns",
  "Where the generator fails",
];

const candidateFields = [
  "Name", "Location", "Problem it solves", "Relation to the other parts",
  "Decision", "Deletion test",
];

const candidateDecisions = ["keep", "merge", "delete"];

function displayWidth(line: string): number {
  return [...line].reduce((width, char) => width + (char.codePointAt(0)! > 127 ? 2 : 1), 0);
}

function lineField(content: string, field: string): string {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return content.match(new RegExp(`^- ${escaped}[：:][ \\t]*([^\\n]*)$`, "m"))?.[1]?.trim() ?? "";
}

function substantive(value: string): boolean {
  return Boolean(value) && !/^not found$/i.test(value) && !/[{}]/.test(value);
}

function yesNoDecision(value: string): boolean {
  return /^(?:yes|no)(?:\b|[-:,.\s]|$)/i.test(value.trim());
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function parseWholeBookAnchors(value: string): string[] {
  return [...new Set(value.split(/[｜|]/).map((anchor) => anchor.trim()).filter(Boolean))];
}

function segmentField(line: string, field: string): string {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return line.match(new RegExp(`${escaped}[：:]\\s*([^｜|\\n]*)`))?.[1]?.trim() ?? "";
}

function locationForZone(content: string, zone: string): string {
  const line = content.match(new RegExp(`^- \\[${zone}\\][^\\n]*$`, "m"))?.[0] ?? "";
  return line.match(/Location[：:]\s*([^｜|\n]*)/)?.[1]?.trim() ?? "";
}

export function validate(content: string, file: string, coverage?: string): Result {
  const errors: string[] = [];
  const warnings: string[] = [];
  const markdownMode = file.toLowerCase().endsWith(".md");
  const requiredHeaders = markdownMode
    ? ["title", "subtitle", "description", "date", "tags", "identifier"]
    : ["TITLE", "SUBTITLE", "DESCRIPTION", "DATE", "FILETAGS", "IDENTIFIER"];

  for (const header of requiredHeaders) {
    const pattern = markdownMode
      ? new RegExp(`^${header}:\\s*\\S`, "mi")
      : new RegExp(`^#\\+${header}:\\s*\\S`, "mi");
    if (!pattern.test(content)) {
      errors.push(`missing or empty ${markdownMode ? header : `#+${header}`}`);
    }
  }

  const identifier = markdownMode
    ? content.match(/^identifier:\s*(\S+)/mi)?.[1] ?? ""
    : content.match(/^#\+IDENTIFIER:\s*(\S+)/mi)?.[1] ?? "";
  const filenameIdentifier = basename(file).match(/^(\d{8}T\d{6})--/)?.[1] ?? "";
  if (!filenameIdentifier) {
    errors.push("the filename is not in the Denote timestamp format");
  } else if (identifier !== filenameIdentifier) {
    errors.push(`IDENTIFIER ${identifier || "(empty)"} does not match the filename ${filenameIdentifier}`);
  }

  const headingPattern = markdownMode ? /^# ([^#].*)$/gm : /^\* ([^*].*)$/gm;
  const headingMatches = [...content.matchAll(headingPattern)];
  const allHeadings = headingMatches.map((match) => match[1].trim());
  const essenceHeadingIndexes = allHeadings
    .map((heading, index) => heading === essenceHeading ? index : -1)
    .filter((index) => index >= 0);
  const essenceHeadingIndex = essenceHeadingIndexes[0] ?? -1;
  const essenceHeadingMatch = essenceHeadingIndex >= 0 ? headingMatches[essenceHeadingIndex] : undefined;
  const essenceSection = essenceHeadingMatch?.index !== undefined
    ? content.slice(essenceHeadingMatch.index + essenceHeadingMatch[0].length).trim()
    : "";
  const headings = allHeadings.filter((heading) => heading !== essenceHeading);
  if (headings.length < 1) {
    errors.push("at least 1 top-level body heading is required before the final section");
  }

  if (essenceHeadingIndexes.length === 0) {
    errors.push(`the artifact must end with the top-level heading "${essenceHeading}"`);
  } else if (essenceHeadingIndexes.length > 1) {
    errors.push(`the top-level heading "${essenceHeading}" may appear only once`);
  } else if (essenceHeadingIndex !== allHeadings.length - 1) {
    errors.push(`"${essenceHeading}" must be the last top-level heading`);
  }

  const essenceParagraphs = essenceSection
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const essenceText = essenceParagraphs.join(" ").replace(/\s+/g, " ").trim();
  const essenceWords = wordCount(essenceText);
  const essenceSentenceCount = essenceText
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean).length;
  const essenceFormatLineHits = [...essenceSection.matchAll(/^(?:[-+] |\d+[.)] |(?:\*{2,}|#{2,}) )/gm)].length;
  if (essenceHeadingIndexes.length === 1) {
    if (essenceParagraphs.length !== 1) {
      errors.push(`"${essenceHeading}" takes exactly one paragraph; found ${essenceParagraphs.length}`);
    }
    if (essenceFormatLineHits > 0) {
      errors.push(`"${essenceHeading}" must not be written as a categorized list or with sub-headings; structure, insight and models only help find it backstage`);
    }
    if (essenceWords === 0) errors.push(`"${essenceHeading}" must not be empty`);
  }

  const legacyTriadPattern = markdownMode
    ? /^- \*\*(?:x|R|f|E|f\(x\))\*\*[：:].+$/gmi
    : /^- \*(?:x|R|f|E|f\(x\))\*[：:].+$/gmi;
  const legacyTriadHits = [...content.matchAll(legacyTriadPattern)];
  const internalHeadingPattern = markdownMode
    ? /^# (?:x|R|f|E|f\(x\))[：:].+$/gmi
    : /^\* (?:x|R|f|E|f\(x\))[：:].+$/gmi;
  const internalHeadingHits = [...content.matchAll(internalHeadingPattern)];
  if (legacyTriadHits.length > 0 || internalHeadingHits.length > 0) {
    errors.push("the artifact must not expose x/R/f/E or the old x/f/f(x) analysis labels");
  }

  const calibrationHits = [...content.matchAll(/source calibration/gi)].length;
  if (calibrationHits > 0) {
    errors.push("the artifact must not contain a separate research-calibration section or label");
  }
  const visibleMaterialGradeHits = [...content.matchAll(/Material grade[：:]/gi)].length;
  if (visibleMaterialGradeHits > 0) {
    errors.push("the material grade belongs in the backstage coverage record, never in the artifact");
  }

  const bodyStart = headingMatches[0]?.index ?? -1;
  const narrativeBody = bodyStart >= 0 ? content.slice(bodyStart) : "";
  const beforeEssence = bodyStart >= 0 ? content.slice(bodyStart, essenceHeadingMatch?.index ?? content.length) : "";
  const bodyText = beforeEssence.replace(markdownMode ? /^#{1,6} .*$/gm : /^\*+ .*$/gm, "").trim();
  if (!bodyText) errors.push("there must be non-empty body text before the final section");
  // Only explicit run/accounting language is checked. Ordinary author attribution,
  // source structure, model descriptions and limitations require human reading.
  const backstageAccountingPatterns = [
    /\bthis round[^.!?\n]{0,40}\b(?:verified|checked|re-?read|extracted|confirmed|could not verify|did not verify)[^.!?\n]*/gi,
    /\b(?:the )?material(?:s)? (?:were|was) (?:verified|checked|extracted|read) this round[^.!?\n]*/gi,
  ];
  const backstageAccountingHits = backstageAccountingPatterns.flatMap((pattern) =>
    [...narrativeBody.matchAll(pattern)].map((match) => match[0]),
  );
  if (backstageAccountingHits.length > 0) {
    errors.push(`the body contains backstage verification language: ${[...new Set(backstageAccountingHits)].join(", ")}; move this round's verification record back into the coverage file`);
  }

  const proseParagraphs = narrativeBody
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph && !/^(?:\*|#|\+|- )/.test(paragraph));
  const paragraphSizes = proseParagraphs.map((paragraph) => wordCount(paragraph));
  const maxParagraphWords = paragraphSizes.length ? Math.max(...paragraphSizes) : 0;
  const denseParagraphHits = paragraphSizes.filter((size) => size > 160).length;

  const sentenceSizes = proseParagraphs.flatMap((paragraph) =>
    paragraph.split(/[.!?;]/).map((sentence) => wordCount(sentence)).filter(Boolean),
  );
  const maxSentenceWords = sentenceSizes.length ? Math.max(...sentenceSizes) : 0;
  const longSentenceHits = sentenceSizes.filter((size) => size > 60).length;

  let materialGrade = "";
  let understandingPathSupport = "";
  let coverageZones = 0;
  let coverageWholeBookFields = 0;
  let requiredWholeBookAnchors: string[] = [];
  let requiredWholeBookAnchorHits = 0;
  let missingWholeBookAnchors: string[] = [];
  let genericWholeBookAnchorHits: string[] = [];
  let coverageCandidateCount = 0;
  let coverageContractVersion = "";
  let generatorExists = "";
  let coverageGeneratorFields = 0;
  let representationRequired = "";
  let representationPurpose = "";
  let threadCount = 0;
  let threadCompleteCount = 0;
  let threadMissingInBody: string[] = [];

  if (!coverage) {
    errors.push("every book breakdown must supply the --coverage backstage record");
  } else {
    coverageContractVersion = lineField(coverage, "Coverage contract version");
    if (coverageContractVersion !== "3") {
      errors.push(`coverage record version ${coverageContractVersion || "(empty)"} is not supported; this edition uses version 3`);
    }

    materialGrade = lineField(coverage, "Material grade");
    if (!validMaterialGrades.includes(materialGrade as (typeof validMaterialGrades)[number])) {
      errors.push("the coverage record's material grade must be one of: complete breakdown / partial breakdown / provisional");
    }

    const sourceBoundaryFields = ["Primary material", "What it supports"].filter((field) => substantive(lineField(coverage, field))).length;
    if (sourceBoundaryFields !== 2) {
      errors.push("the coverage record must state the primary material and what it supports");
    }

    const requireFields = (fields: string[]) => {
      for (const field of fields) {
        if (!substantive(lineField(coverage, field))) errors.push(`the coverage record is missing or has an empty field: ${field}`);
      }
    };

    understandingPathSupport = lineField(coverage, "Does the material support the path of changing understanding");
    if (!yesNoDecision(understandingPathSupport)) {
      errors.push('"Does the material support the path of changing understanding" must answer yes or no, with grounds');
    }
    const supported = /^yes/i.test(understandingPathSupport);
    const complete = materialGrade === "complete breakdown";
    if (!supported && complete) errors.push("a complete breakdown cannot pass: the material does not support the path of changing understanding");
    if (/^no/i.test(understandingPathSupport) && !complete) {
      warnings.push("the material does not support the path of changing understanding; only the records the material supports are checked, unsupported understanding may be written as undetermined, and no experience may be invented");
    }

    // Partial unsupported records still identify the book and state the core's uncertainty.
    requireFields(supported || complete
      ? wholeBookFields
      : ["What kind or form of book this is", "The core understanding", "Whole-book anchors that must appear in the body"]);
    coverageWholeBookFields = wholeBookFields.filter((field) => substantive(lineField(coverage, field))).length;

    requiredWholeBookAnchors = parseWholeBookAnchors(lineField(coverage, "Whole-book anchors that must appear in the body"));
    missingWholeBookAnchors = requiredWholeBookAnchors.filter((anchor) => !narrativeBody.includes(anchor));
    requiredWholeBookAnchorHits = requiredWholeBookAnchors.length - missingWholeBookAnchors.length;
    genericWholeBookAnchorHits = requiredWholeBookAnchors.filter((anchor) => genericWholeBookAnchors.has(anchor.toLowerCase()));
    if (genericWholeBookAnchorHits.length) errors.push(`these whole-book anchors are too generic: ${genericWholeBookAnchorHits.join(", ")}`);
    const minimumAnchors = complete ? 3 : 1;
    if (requiredWholeBookAnchors.length < minimumAnchors) {
      errors.push(`a ${materialGrade || "book breakdown"} must declare at least ${minimumAnchors} whole-book anchor(s) for the body`);
    }
    if (missingWholeBookAnchors.length) errors.push(`these whole-book anchors do not appear in the body: ${missingWholeBookAnchors.join(", ")}`);

    const threads = [...coverage.matchAll(/^- \[thread\]\s*.*$/gm)];
    threadCount = threads.length;
    threadCompleteCount = threads.filter((entry) => threadFields.every((field) => substantive(segmentField(entry[0], field)))).length;
    threadMissingInBody = threads.map((entry) => segmentField(entry[0], "Name")).filter(substantive).filter((name) => !narrativeBody.includes(name));
    if (supported && threadCount < 1) errors.push("the coverage record must declare at least 1 [thread]");
    if (threadCompleteCount !== threadCount) {
      errors.push("every [thread] must fill in Name, Starting point, Key advance, Change before and after, Reason for the switch, and Grounds and boundary");
    }
    if (threadMissingInBody.length) errors.push(`these thread names do not appear in the body: ${threadMissingInBody.join(", ")}`);

    generatorExists = lineField(coverage, "Is there a whole-book generator");
    representationRequired = lineField(coverage, "Are visual representations needed");
    representationPurpose = lineField(coverage, "Where and why diagrams are used");
    for (const [field, value] of [
      ["Is there a whole-book generator", generatorExists],
      ["Are visual representations needed", representationRequired],
    ]) {
      if ((supported || complete || substantive(value)) && !yesNoDecision(value)) errors.push(`"${field}" must answer yes or no`);
    }
    if (/^yes/i.test(generatorExists)) requireFields(generatorFields);
    coverageGeneratorFields = generatorFields.filter((field) => substantive(lineField(coverage, field))).length;
    if (/^yes/i.test(representationRequired)) requireFields(["Where and why diagrams are used"]);

    const zones = ["starting-point", "pressure", "revision", "boundary"];
    coverageZones = zones.filter((zone) => substantive(locationForZone(coverage, zone))).length;
    const evidenceRows = [...coverage.matchAll(/^- \[(?:starting-point|pressure|revision|boundary)\][^\n]*$/gm)];
    if (evidenceRows.some((entry) => !substantive(segmentField(entry[0], "Location")))) {
      errors.push("every declared source-evidence row must state its location; delete rows the material does not support");
    }

    if (supported || complete) {
      requireFields(reviewFields);
      if (complete && coverageZones !== zones.length) {
        errors.push("the coverage record has not filled in the locations for all four kinds of evidence: starting point, pressure, revision and boundary");
      }
    }

    const candidates = [...coverage.matchAll(/^- \[candidate\]\s*.*$/gm)];
    coverageCandidateCount = candidates.length;
    if (complete && coverageCandidateCount < 5) {
      errors.push(`a complete breakdown's coverage record needs at least 5 candidate parts; found ${coverageCandidateCount}`);
    }
    for (const candidate of candidates) {
      const decision = segmentField(candidate[0], "Decision").toLowerCase();
      if (!candidateFields.every((field) => substantive(segmentField(candidate[0], field))) || !candidateDecisions.includes(decision)) {
        errors.push("every candidate part must fill in Name, Location, Problem it solves, Relation to the other parts, Decision and Deletion test, with the decision being keep/merge/delete");
      }
    }
  }

  const examplePattern = markdownMode
    ? /^```(?:text)?[ \t]*\r?\n([\s\S]*?)^```[ \t]*$/gmi
    : /^#\+begin_example[ \t]*\r?\n([\s\S]*?)^#\+end_example[ \t]*$/gmi;
  const exampleBlocks = [...narrativeBody.matchAll(examplePattern)].filter((block) => block[1].trim());
  // Quoted source/code is not a rendered table. Keep offsets irrelevant here by
  // masking complete fences before looking for actual table rows.
  const tableBody = markdownMode
    ? narrativeBody.replace(/^(`{3,}|~{3,})[^\n]*\r?\n[\s\S]*?^\1[ \t]*$/gm, "")
    : narrativeBody.replace(/^#\+begin_\S+[^\n]*\r?\n[\s\S]*?^#\+end_\S+[ \t]*$/gmi, "");
  const tableBlocks = [...tableBody.matchAll(/(?:^\|[^\n]*\|[ \t]*(?:\r?\n|$)){2,}/gm)]
    .filter((match) => markdownMode
      ? match[0].split(/\r?\n/).some((line) => /^\|(?:[ \t]*:?-{3,}:?[ \t]*\|)+[ \t]*$/.test(line))
      : true);
  const diagramWidths = exampleBlocks.map((block) => Math.max(0, ...block[1].split(/\r?\n/).map(displayWidth)));
  const tableWidths = tableBlocks.map((block) => Math.max(0, ...block[0].split(/\r?\n/).map(displayWidth)));
  const maxDiagramWidth = Math.max(0, ...diagramWidths);
  const maxTableWidth = Math.max(0, ...tableWidths);
  diagramWidths.forEach((width, index) => {
    if (width > 80) errors.push(`ASCII diagram ${index + 1} is ${width} columns wide, over 80`);
  });
  tableWidths.forEach((width, index) => {
    if (width > 80) errors.push(`table ${index + 1} is ${width} columns wide, over 80`);
  });
  if (coverageContractVersion === "3" && /^yes/i.test(representationRequired)) {
    if (exampleBlocks.length + tableBlocks.length === 0) {
      errors.push("the coverage record declares that a visual representation is needed, so the body must contain at least 1 actual example block or table");
    }
  }

  const bodyWords = wordCount(narrativeBody);

  return {
    ok: errors.length === 0,
    assessment_scope: "structure and record completeness; it does not establish source accuracy, reading continuity or understanding",
    semantic_assessment: "not_performed",
    file,
    errors,
    warnings,
    checks: {
      identifier,
      material_grade: materialGrade,
      top_headings: headings.length,
      generic_heading_hits: "not_assessed",
      internal_framework_hits: legacyTriadHits.length + internalHeadingHits.length,
      calibration_hits: calibrationHits,
      visible_material_grade_hits: visibleMaterialGradeHits,
      backstage_accounting_hits: backstageAccountingHits.length,
      dense_paragraph_hits: denseParagraphHits,
      max_paragraph_words: maxParagraphWords,
      long_sentence_hits: longSentenceHits,
      max_sentence_words: maxSentenceWords,
      example_blocks: exampleBlocks.length,
      table_blocks: tableBlocks.length,
      max_table_width: maxTableWidth,
      max_diagram_width: maxDiagramWidth,
      thread_count: threadCount,
      thread_complete_count: threadCompleteCount,
      thread_missing_in_body: threadMissingInBody.join("|"),
      representation_required: representationRequired,
      representation_purpose: representationPurpose,
      body_words: bodyWords,
      coverage_supplied: Boolean(coverage),
      coverage_zones: coverageZones,
      coverage_whole_book_fields: coverageWholeBookFields,
      required_whole_book_anchor_count: requiredWholeBookAnchors.length,
      required_whole_book_anchor_hits: requiredWholeBookAnchorHits,
      missing_whole_book_anchors: missingWholeBookAnchors.join("|"),
      generic_whole_book_anchors: genericWholeBookAnchorHits.join("|"),
      essence_heading_count: essenceHeadingIndexes.length,
      essence_is_last_heading: essenceHeadingIndex >= 0 && essenceHeadingIndex === allHeadings.length - 1,
      essence_paragraph_count: essenceParagraphs.length,
      essence_sentence_count: essenceSentenceCount,
      essence_format_line_hits: essenceFormatLineHits,
      essence_words: essenceWords,
      coverage_candidate_count: coverageCandidateCount,
      coverage_contract_version: coverageContractVersion,
      generator_exists: generatorExists,
      coverage_generator_fields: coverageGeneratorFields,
      understanding_path_support: understandingPathSupport,
      format: markdownMode ? "markdown" : "org",
    },
  };
}

function main(): never {
  const args = process.argv.slice(2);
  const stdinMode = args[0] === "--stdin";
  const file = stdinMode ? args[1] ?? "19700101T000000--stdin__book.org" : args[0];
  const coverageFlag = args.indexOf("--coverage");
  const coveragePath = coverageFlag >= 0 ? args[coverageFlag + 1] : undefined;

  if (!file) {
    console.error("Usage: bun scripts/validate_note.ts <note.org|note.md> --coverage <coverage-map.md>");
    console.error("or:    bun scripts/validate_note.ts --stdin <denote-filename> --coverage <coverage-map.md>");
    process.exit(2);
  }

  if (coverageFlag >= 0 && !coveragePath) {
    console.error("--coverage must be followed by the path to the coverage record");
    process.exit(2);
  }

  const content = stdinMode ? readFileSync(0, "utf8") : readFileSync(file, "utf8");
  const coverage = coveragePath ? readFileSync(coveragePath, "utf8") : undefined;
  const result = validate(content, file, coverage);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

if (import.meta.main) {
  main();
}
