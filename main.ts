// The One-Line Laugh: a single funny line, delivered as a program.
// The grader executes this file and the sealed scorer reads whatever
// it leaves at /output/entry.txt, so this script only copies one
// trimmed line from line.txt into that location, nothing else.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 200;
const SOURCE = join(import.meta.dirname, "line.txt");

function main(): void {
  if (!existsSync(SOURCE)) {
    throw new Error("line.txt is missing next to main.ts");
  }
  const line = readFileSync(SOURCE, "utf8").trim();
  if (line.length === 0) {
    throw new Error("the line must not be empty");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(`the line is ${line.length} characters, over the ${MAX_CHARS} limit`);
  }
  if (/\r|\n/.test(line)) {
    throw new Error("the entry must be exactly one line");
  }
  const target = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, "entry.txt"), line, "utf8");
  console.log(`wrote ${line.length} characters to ${join(target, "entry.txt")}`);
}

main();
