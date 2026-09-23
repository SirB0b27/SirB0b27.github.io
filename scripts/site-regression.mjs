import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const fail = (message) => {
  console.error("[FAIL] " + message);
  process.exitCode = 1;
};

const index = read("index.html");
const resume = read("resume/index.html");
const app = read("assets/app.js");
const personal = read("personal/index.html");

if (index.includes("Personal Analytics</span>") || index.includes("College Projects</span>")) {
  fail("Public Portfolio sidebar should expose only the Personal entry, not private child links.");
}
if (!index.includes('id="personalNavTrigger"')) fail("Public Personal entry is missing.");

const templates = ["azurill","bronzor","chikorita","ditgar","ditto","gengar","glalie","kakuna","lapras","leafish","meowth","onyx","pikachu","rhyhorn","scizor"];
for (const template of templates) {
  if (!resume.includes(`value="${template}"`)) fail(`Resume template missing: ${template}`);
}

for (const id of ["photoToggle","photoPanel","photoUpload","photoMenu","printResume","resumeStyle","exportPdf","exportWord","exportOdf"]) {
  if (!resume.includes(`id="${id}"`)) fail(`Resume control missing: ${id}`);
}

if (!resume.includes("indexedDB.open('portfolioResumePhotos'")) fail("Resume photo persistence is missing.");
if (!resume.includes("text-align:justify")) fail("Resume justified text rule is missing.");
if (!resume.includes("indexedDB.open('portfolioResumePhotos'")) fail("Resume photo persistence is missing.");
if (!resume.includes("data-photo-delete")) fail("Resume photo delete control is missing.");
if (!resume.includes("OpenDocument (.fodt)")) fail("OpenDocument export is missing.");
if (!resume.includes("@media print")) fail("Resume print CSS is missing.");

for (const id of ["projectPaginationTop","projectPaginationBottom","educationPaginationTop","educationPaginationBottom"]) {
  if (!app.includes(id)) fail(`Pagination hook missing: ${id}`);
}

if (!personal.includes("Personal Analytics") || !personal.includes("College Projects")) {
  fail("Personal workspace navigation is incomplete.");
}

if (!process.exitCode) console.log("Static regression checks passed.");
