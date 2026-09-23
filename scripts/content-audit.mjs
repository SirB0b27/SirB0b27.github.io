import fs from "node:fs";

const files = [
  "index.html",
  "assets/app.js",
  "data/portfolio-data.js",
  "data/education-catalog.js",
  "resume/index.html",
  "personal/index.html"
].filter(fs.existsSync);

const reviewPatterns = [
  /\bleverage(?:d|s|ing)?\b/gi,
  /\butilize(?:d|s|ing)?\b/gi,
  /\bsynerg(?:y|ize|ized|izing)\b/gi,
  /\bholistic\b/gi,
  /\bseamless(?:ly)?\b/gi,
  /\btransformative\b/gi,
  /\bcutting[- ]edge\b/gi,
  /\bdynamic landscape\b/gi,
  /\bactionable insights?\b/gi,
  /\belevate(?:d|s|ing)?\b/gi
];

const hardPatterns = [
  /lorem ipsum/gi,
  /\{\{\s*(?:full_name|email|phone|linkedin|github|city_state)\s*\}\}/gi
];

let hardFailures = 0;
let warnings = 0;

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");

  for (const pattern of hardPatterns) {
    const matches = text.match(pattern) ?? [];
    if (matches.length) {
      hardFailures += matches.length;
      console.error(`[FAIL] ${file}: ${matches.length} unresolved placeholder/test-text match(es) for ${pattern}`);
    }
  }

  for (const pattern of reviewPatterns) {
    const matches = text.match(pattern) ?? [];
    if (matches.length) {
      warnings += matches.length;
      console.warn(`[REVIEW] ${file}: ${matches.length} wording match(es) for ${pattern}`);
    }
  }
}

console.log(`Content voice audit complete: ${warnings} review item(s), ${hardFailures} hard failure(s).`);

if (hardFailures > 0) process.exit(1);
