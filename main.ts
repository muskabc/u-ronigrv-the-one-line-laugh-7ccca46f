// The One-Line Laugh: a single funny line, delivered as a program.
// The grader runs this file; the sealed scorer reads /output/entry.txt,
// so this script's only job is to carry one trimmed line from line.txt
// into that file, after checking it is a valid single-line entry.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 200;
const SOURCE = join(import.meta.dirname, "line.txt");
const OUTPUT_NAME = "entry.txt";

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function readEntryLine(): string {
  if (!existsSync(SOURCE)) {
    throw new Error("line.txt is missing next to main.ts");
  }
  const raw = stripBom(readFileSync(SOURCE, "utf8"));
  const normalized = raw.replace(/\r\n?/g, "\n");
  const kept = normalized.split("\n").filter((part) => part.trim().length > 0);
  if (kept.length === 0) {
    throw new Error("the line must not be empty");
  }
  if (kept.length > 1) {
    throw new Error("the entry must be exactly one line");
  }
  return kept[0].trim();
}

function checkLength(line: string): void {
  const count = [...line].length;
  if (count > MAX_CHARS) {
    throw new Error(`the line is ${count} characters, over the ${MAX_CHARS} limit`);
  }
}

function deliver(line: string): string {
  const target = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(target, { recursive: true });
  const path = join(target, OUTPUT_NAME);
  writeFileSync(path, line, "utf8");
  return path;
}

function main(): void {
  const line = readEntryLine();
  checkLength(line);
  const path = deliver(line);
  console.log(`wrote ${[...line].length} characters to ${path}`);
}

main();
