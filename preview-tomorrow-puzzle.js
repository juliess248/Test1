#!/usr/bin/env node

const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("public/index.html", "utf8");
const date = new Date();
date.setDate(date.getDate() + 1);
const tomorrow = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(date);

function section(start, end) {
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end, startIndex);
  if (startIndex < 0 || endIndex < 0) {
    throw new Error(`Could not find puzzle source section: ${start}`);
  }
  return html.slice(startIndex, endIndex);
}

const source = [
  section("const FOLD =", "/* =========================================================\n   2. GAME CONSTANTS"),
  section("const MIN_LENGTH =", "/* =========================================================\n   3. RANKS"),
  section("const PALABRANAN =", "/* =========================================================\n   5d. ENGLISH"),
  section("const PANGRAM_SIZE =", "/* =========================================================\n   7. PUZZLE CLASS"),
  "const GAME_DATE = '';",
  `result = getPuzzleData(${JSON.stringify(tomorrow)});`,
].join("\n");

const context = {};
vm.createContext(context);
vm.runInContext(source, context);

const definitions = Object.fromEntries(
  context.result.answers.map((word) => [
    word,
    "",
  ])
);

console.log(`Tomorrow's puzzle: ${tomorrow}`);
console.log(`Letters: ${[context.result.centre, ...context.result.letters].join(" ").toUpperCase()}`);
console.log(`Center letter: ${context.result.centre.toUpperCase()}`);
console.log(`Words: ${context.result.answers.length}`);
console.log(`Pangrams: ${context.result.pangrams.map((word) => context.result.display[word]).join(", ")}`);
console.log("\nPaste the completed entries into DEFINITIONS in public/index.html:");
console.log(JSON.stringify(definitions, null, 2));