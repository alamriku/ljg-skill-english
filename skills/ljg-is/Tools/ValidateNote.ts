#!/usr/bin/env bun

import { basename } from "node:path";

export type NoteSchema = "ljg-is-v5";

export type ValidationResult = {
  ok: boolean;
  errors: string[];
  identifier?: string;
  schema?: NoteSchema;
  definition?: string;
  operation?: string;
  recognition?: string;
  guidance?: string;
};

type NoteFormat = "org" | "md";

const V5_SCHEMA = "ljg-is-v5";

// Field labels leaking from the backstage checklist into the body.
const EXPOSED_FRAMEWORK_LABEL =
  /^(?:definition|what it is|operation|how it works|mechanism|cognitive change|cognitive correction|recognition|guidance|action|advice|grounds|basis|boundary|falsifier)\s*:/imu;

// Remnants of older contracts that must not survive into a v5 note.
const OLD_CONTRACT = /(?:^|\n)(?:core|complete|easily mistaken|real question|structural form|variables|transfer)\s*:|The One/mu;

function metadataValue(content: string, key: string, format: NoteFormat): string | undefined {
  const prefix = format === "org" ? "#\\+" : "";
  return content.match(new RegExp(`^${prefix}${key}:\\s*(.+?)\\s*$`, "mi"))?.[1]?.trim();
}

function sectionBody(content: string, heading: string, format: NoteFormat): string | undefined {
  const lines = content.split(/\r?\n/u);
  const headingLine = `${format === "org" ? "*" : "#"} ${heading}`;
  const start = lines.findIndex((line) => line.trimEnd() === headingLine);
  if (start < 0) return undefined;
  const nextHeading = format === "org" ? /^\* /u : /^# /u;
  const offset = lines.slice(start + 1).findIndex((line) => nextHeading.test(line));
  const end = offset < 0 ? lines.length : start + 1 + offset;
  return lines.slice(start + 1, end).join("\n").trim();
}

function paragraphs(body: string): string[] {
  return body
    .split(/\r?\n\s*\r?\n/u)
    .map((part) => part.replace(/\s*\r?\n\s*/gu, " ").trim())
    .filter(Boolean);
}

function wordCount(text: string): number {
  return text.split(/\s+/u).filter(Boolean).length;
}

function validateSyntax(content: string, format: NoteFormat, errors: string[]): void {
  if (/\b(?:TODO|TBD)\b|\{[^}\n]+\}/iu.test(content)) {
    errors.push("the file must not keep TODO, TBD or template placeholders");
  }
  if (format === "org") {
    if (/^#{1,6}\s|^```/mu.test(content)) {
      errors.push("an Org file must not contain Markdown headings or code fences");
    }
    if (/\[[^\]]+\]\([^)]+\)/u.test(content)) {
      errors.push("an Org file must not contain Markdown link syntax");
    }
  } else if (/^#\+[a-z_]+:/imu.test(content) || /^\*{1,3} /mu.test(content)) {
    errors.push("a Markdown file must not contain Org metadata or Org headings");
  }
}

type V5Fields = {
  definition?: string;
  operation?: string;
  recognition?: string;
  guidance?: string;
};

function validateV5(
  fileName: string,
  content: string,
  format: NoteFormat,
  identifier: string | undefined,
  title: string | undefined,
  tags: string[],
  headings: string[],
  errors: string[],
): V5Fields {
  const fileMatch = fileName.match(/^(\d{8}T\d{6})--understanding-(.+)__is\.(org|md)$/u);
  if (!fileMatch || !fileMatch[2]?.trim()) {
    errors.push("the v5 filename must match YYYYMMDDTHHMMSS--understanding-<target>__is.org or __is.md");
  } else if (identifier && identifier !== fileMatch[1]) {
    errors.push("identifier must match the timestamp in the filename");
  }
  if (!title?.startsWith("Understanding:") || !title.slice("Understanding:".length).trim()) {
    errors.push('title must be a non-empty "Understanding: <target>"');
  }
  if (!tags.includes("is") || !tags.includes("act")) {
    errors.push("v5 tags must contain both is and act");
  }

  if (headings.length < 2 || headings.length > 4) {
    errors.push("a v5 body uses two to four top-level headings grown from the content");
  }
  const fixedHeading =
    /^(?:what it is|definition|how it works|operation|mechanism|cognitive change|cognitive correction|guidance|advice|opening|development|conclusion|introduction|analysis|summary|body|part one|part two|part three)$/iu;
  const headingsAreDistinct = new Set(headings).size === headings.length;
  if (
    !headingsAreDistinct ||
    headings.some((heading) => wordCount(heading) < 2 || heading.length > 80 || fixedHeading.test(heading.trim()))
  ) {
    errors.push("v5 headings must be specific, distinct and grown from the content, never the steps of understanding used as section names");
  }

  const bodies = headings.map((heading) => sectionBody(content, heading, format) ?? "");
  if (bodies.some((body) => /^\s*(?:[-+] |\d+[.)]\s+)/mu.test(body))) {
    errors.push("a v5 body must not use bullets or numbered lists; the understanding is written as continuous prose");
  }
  if (bodies.some((body) => EXPOSED_FRAMEWORK_LABEL.test(body))) {
    errors.push('a v5 body must not expose field labels such as "definition / operation / cognitive change / guidance"');
  }

  const paragraphsBySection = bodies.map(paragraphs);
  const paragraphCount = paragraphsBySection.reduce((sum, items) => sum + items.length, 0);
  if (paragraphsBySection.some((items) => items.length < 1) || paragraphCount < 4 || paragraphCount > 10) {
    errors.push("each v5 section needs at least one paragraph, with four to ten in the whole piece");
  }

  const visibleBody = bodies.join("\n\n");
  if (wordCount(visibleBody) < 220) {
    errors.push("the v5 body is too short to cover the definition, the operation, the correction and the judgment for action");
  }

  const definition = metadataValue(content, "definition", format);
  if (!definition) {
    errors.push("v5 requires definition metadata recording what X is and its key boundary");
  } else if (
    wordCount(definition) < 8 ||
    wordCount(definition) > 45 ||
    /^(?:a kind of thing|something that|as the name suggests|simply put, it is)/iu.test(definition)
  ) {
    errors.push("v5 definition must give the parent category and the key difference in plain language, not an empty tautology");
  }

  const operation = metadataValue(content, "operation", format);
  const operationVerb =
    /\b(?:takes?|input|output|maps?|compares?|selects?|computes?|organi[sz]es?|connects?|limits?|decides?|adjusts?|keeps?|excludes?|generates?|changes?|turns?|lets?|makes?|through|according to)\b/iu;
  if (!operation) {
    errors.push("v5 requires operation metadata recording how X acts");
  } else if (wordCount(operation) < 8 || wordCount(operation) > 60 || !operationVerb.test(operation)) {
    errors.push("v5 operation must state the key action and what changes as a result, not repeat the use or the effect");
  }

  const recognition = metadataValue(content, "recognition", format);
  const recognitionShift =
    /\b(?:not|no longer|used to|thought|means|changes?|cannot only|should now|the point is not|what matters|really)\b/iu;
  if (!recognition) {
    errors.push("v5 requires recognition metadata recording which old judgment this understanding corrects");
  } else if (wordCount(recognition) < 8 || wordCount(recognition) > 60 || !recognitionShift.test(recognition)) {
    errors.push("v5 recognition must state the difference in judgment before and after, not a separate abstract reflection");
  }

  const guidance = metadataValue(content, "guidance", format);
  const guidanceAction =
    /\b(?:first|check|compare|distinguish|confirm|judge|test|verify|ask|identify|choose|record|adjust|revise|avoid|look|watch)\b/iu;
  const genericGuidance =
    /^(?:from now on\s*,?\s*)?(?:stay aware|stay alert|raise awareness|consider it holistically|be careful|it depends on the case)/iu;
  if (!guidance) {
    errors.push("v5 requires guidance metadata recording how to observe, judge or act when facing X");
  } else if (
    wordCount(guidance) < 8 ||
    wordCount(guidance) > 65 ||
    !guidanceAction.test(guidance) ||
    genericGuidance.test(guidance)
  ) {
    errors.push("v5 guidance must give a concrete handle that uses the mechanism just explained, not universal advice");
  }

  const basis = metadataValue(content, "basis", format);
  if (!basis) {
    errors.push("v5 requires basis metadata recording the factual grounds");
  } else if (/\b(?:reportedly|i heard|rumou?r|some say|probably|maybe|i feel|i think)\b/iu.test(basis)) {
    errors.push("v5 basis must not pass hearsay, impressions or unmarked possibilities off as factual grounds");
  }

  const falsifier = metadataValue(content, "falsifier", format);
  if (!falsifier) {
    errors.push("v5 requires falsifier metadata recording which fact would overturn the current explanation");
  } else if (!/\bif\b/iu.test(falsifier) || !/\b(?:fails?|does not hold|collapse|rewrite|overturn|wrong)\b/iu.test(falsifier)) {
    errors.push("v5 falsifier must state explicitly under which fact the current explanation fails or needs rewriting");
  }

  const semicolons = visibleBody.match(/;/gu)?.length ?? 0;
  const listCommas = visibleBody.match(/,/gu)?.length ?? 0;
  if (semicolons > 4 || listCommas > 60) {
    errors.push("the v5 body still reads as a list of elements: cut the semicolons and comma chains so a sentence advances one main change");
  }
  const longSentence = visibleBody
    .split(/[.!?\n]/u)
    .map((part) => part.trim())
    .find((part) => wordCount(part) > 60);
  if (longSentence) {
    errors.push("v5 contains a sentence over 60 words; break the chain of abstract nouns so understanding happens step by step");
  }

  if (OLD_CONTRACT.test(content)) {
    errors.push("v5 must not keep remnants of the old essence/The One/structural transfer contract");
  }
  return { definition, operation, recognition, guidance };
}

export function validateNoteText(filePath: string, content: string): ValidationResult {
  const errors: string[] = [];
  const fileName = basename(filePath);
  const extension = fileName.match(/\.(org|md)$/u)?.[1] as NoteFormat | undefined;
  const format = extension ?? "org";
  if (!extension) errors.push("the file extension must be .org or .md");

  const declaredSchema = metadataValue(content, "schema", format);
  const schema: NoteSchema | undefined = declaredSchema === V5_SCHEMA ? V5_SCHEMA : undefined;
  if (!schema) errors.push(`schema must be ${V5_SCHEMA}`);

  const title = metadataValue(content, "title", format);
  const date = metadataValue(content, "date", format);
  const identifier = metadataValue(content, "identifier", format);
  const rawTags = metadataValue(content, format === "org" ? "filetags" : "tags", format);
  const tags = rawTags?.replace(/[\[\],:]/gu, " ").split(/\s+/u).filter(Boolean) ?? [];
  const headingPattern = format === "org" ? /^\* ([^\n]+?)\s*$/gmu : /^# ([^\n]+?)\s*$/gmu;
  const headings = [...content.matchAll(headingPattern)].map((match) => match[1] ?? "");

  if (!date || (format === "org" && !/^\[[^\]]+\]$/u.test(date))) errors.push("date is missing or malformed");
  if (!identifier || !/^\d{8}T\d{6}$/u.test(identifier)) errors.push("identifier must be YYYYMMDDTHHMMSS");
  validateSyntax(content, format, errors);

  let definition: string | undefined;
  let operation: string | undefined;
  let recognition: string | undefined;
  let guidance: string | undefined;
  if (schema === V5_SCHEMA) {
    ({ definition, operation, recognition, guidance } = validateV5(
      fileName,
      content,
      format,
      identifier,
      title,
      tags,
      headings,
      errors,
    ));
  }
  return { ok: errors.length === 0, errors, identifier, schema, definition, operation, recognition, guidance };
}

export async function validateNoteFile(filePath: string): Promise<ValidationResult> {
  const file = Bun.file(filePath);
  if (!(await file.exists())) return { ok: false, errors: [`file not found: ${filePath}`] };
  return validateNoteText(filePath, await file.text());
}

if (import.meta.main) {
  const filePath = Bun.argv[2];
  if (filePath === "--help" || filePath === "-h") {
    console.log("Usage: bun ValidateNote.ts <note-file>");
    console.log("Validates a ljg-is-v5 usable-understanding note (Org or Markdown).");
    process.exit(0);
  }
  if (!filePath) {
    console.error(JSON.stringify({ status: "error", errors: ["Usage: bun ValidateNote.ts <note-file>"] }));
    process.exit(2);
  }
  const result = await validateNoteFile(filePath);
  if (!result.ok) {
    console.error(JSON.stringify({ status: "error", ...result }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ status: "ok", path: filePath, ...result }, null, 2));
}
