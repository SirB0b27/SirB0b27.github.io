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

// The public homepage is a workspace chooser, not the Portfolio sidebar.
if (!index.includes('data-space="portfolio"') || !index.includes('data-space="personal"') || !index.includes('href="birthdays/"')) {
  fail("Workspace homepage must show Portfolio, Personal, and Birthdays.");
}
if (index.includes("Personal Analytics</span>") || index.includes("College Projects</span>")) {
  fail("Public workspace chooser must not expose private Personal child links.");
}
const portfolio = read("portfolio/index.html");
const portfolioApp = read("portfolio/app.js");
if (!portfolio.includes('sessionStorage.getItem("portfolioSpaceAuth")') || !portfolio.includes('href="../"')) {
  fail("Portfolio page is missing its access gate or workspace-home link.");
}
if (!portfolio.includes('id="personalNavTrigger"')) fail("Portfolio workspace Personal entry is missing.");
if (!portfolioApp.includes("personalNavTrigger")) fail("Portfolio workspace Personal navigation handler is missing.");
if (!index.includes("sessionStorage.setItem('portfolioSpaceAuth','1')") || !index.includes("sessionStorage.setItem('personalSpaceAuth','1')")) {
  fail("Homepage must unlock both Portfolio and Personal workspaces.");
}

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
if (resume.includes("github.com/SirB0b27") || resume.includes("linkedin.com/in/hemanthvelan27")) fail("Resume should not expose GitHub or LinkedIn contact text.");
if (!resume.includes("function autoFitContent()")) fail("Resume auto-fit function is missing.");
if (!resume.includes("--resume-content-scale")) fail("Resume content fit scale is missing.");
if (!resume.includes("@media print")) fail("Resume print CSS is missing.");

for (const id of ["projectPaginationTop","projectPaginationBottom","educationPaginationTop","educationPaginationBottom"]) {
  if (!app.includes(id)) fail(`Pagination hook missing: ${id}`);
}

if (!personal.includes("Personal Analytics") || !personal.includes("College Projects")) {
  fail("Personal workspace navigation is incomplete.");
}

if (!process.exitCode) console.log("Static regression checks passed.");
