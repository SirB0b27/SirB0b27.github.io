#!/usr/bin/env node
/**
 * Convert the existing GitHub JS data objects into JSON files for PRIVATE Drive.
 * Usage: node tools/export-private-models.cjs /path/OUTSIDE/this/repository
 * No generated JSON is committed or written into the repository by this tool.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const out = process.argv[2] ? path.resolve(process.argv[2]) : '';
if (!out || (out === root || out.startsWith(root + path.sep))) {
  console.error('Supply a destination folder OUTSIDE the GitHub repository.');
  process.exit(1);
}
const models = [
  ['data/portfolio-data.js', 'PORTFOLIO_DATA', 'portfolio-model.json'],
  ['data/education-catalog.js', 'EDUCATION_CATALOG', 'education-model.json'],
  ['data/personal-analytics.js', 'PERSONAL_ANALYTICS', 'personal-analytics-model.json']
];
fs.mkdirSync(out, { recursive: true });
for (const [source, variable, filename] of models) {
  const window = Object.create(null);
  const sandbox = vm.createContext({ window });
  // Evaluate only known source files already part of this repository.
  vm.runInContext(fs.readFileSync(path.join(root, source), 'utf8'), sandbox, { timeout: 5000, filename: source });
  const data = window[variable];
  if (!data || typeof data !== 'object') throw Error(source + ' did not define ' + variable);
  const output = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(path.join(out, filename), output, { encoding: 'utf8', flag: 'w', mode: 0o600 });
  console.log('Exported ' + filename + ' (' + Buffer.byteLength(output) + ' bytes)');
}
console.log('Review these files, then upload to Restricted Google Drive folders. Do NOT commit them.');
