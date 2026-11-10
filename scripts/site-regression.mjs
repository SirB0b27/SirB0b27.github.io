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
const dnd = read("dnd/index.html");
const dndConfig = read("dnd/config.js");
const dndApp = read("dnd/app.js");
const dndEngine = read("dnd/engine.js");
const dndStyles = read("dnd/styles.css");

if (!index.includes('href="dnd/"') || !index.includes("D&amp;D Character Vault")) {
  fail("Workspace homepage is missing the D&D Character Vault entry.");
}
if (!dnd.includes('<script src="config.js"></script>') || !dnd.includes('<script src="engine.js') || !dnd.includes('<script src="app.js')) {
  fail("D&D frontend scripts are missing or loaded in the wrong order.");
}
for (const marker of ["applyLevelUp", "acBreakdown", "spellSlots", "Order of the Lycan"]) {
  if (!dndEngine.includes(marker)) fail(`D&D rules engine marker missing: ${marker}`);
}
if (!dndConfig.includes("https://dnd-character-vault-api.hemanth2355.workers.dev")) {
  fail("D&D frontend is not connected to the production Worker.");
}
for (const action of ["login", "listCharacters", "getCharacter", "referenceData", "createPublicSession", "publicSave", "mergePublicChanges"]) {
  if (!dndApp.includes(action)) fail(`D&D frontend action missing: ${action}`);
}
if (!dndApp.includes("JSON.stringify({...payload,action,token:state.token})")) fail("API action must override descriptive payload fields.");
if (dndApp.includes("confirm(" ) || dndApp.includes("alert(")) fail("D&D UI must use themed in-app confirmations, not browser dialogs.");
if (!dnd.includes('id="confirmDialog"') || !dndApp.includes("askConfirm(")) fail("D&D in-app confirmation dialog is missing.");
if (dndApp.includes("if(e.target===dialog)dialog.close()")) fail("D&D data-entry dialogs must not close when their backdrop is clicked.");
if (!dndApp.includes('class="portrait-initials"') || !dndStyles.includes('.portrait-initials')) fail("D&D character portraits must use initials.");
if (dndApp.includes('class="portrait-svg')) fail("D&D character portraits must not render generated icons.");
if (!dndApp.includes("setViewerExpanded") || !dndStyles.includes(".sheet-preview.viewer-expanded{position:fixed")) fail("D&D sheet maximize must use the full viewport.");
if (!dndStyles.includes(".proficiency-grid{display:grid;grid-template-columns:1fr") || !dndStyles.includes("grid-template-columns:auto minmax(0,1fr) auto")) fail("D&D proficiency rows must keep one skill and modifier on each line.");
if (!dndApp.includes("data-armor-equipped") || !dndEngine.includes("setEquipped") || !dndEngine.includes("armorRows")) fail("D&D armor inventory must be selectable with live calculations.");
if (!dndApp.includes("['notes','Notes']") || !dndApp.includes("case'notes':html=renderNotes(c)") || dnd.includes('id="notesDrawer"')) fail("D&D notes must use the full Notes tab instead of a pinned drawer.");
for (const marker of ["commitLive", "data-weapon-equipped", "data-weapon-rite", "hybrid_crimson_rite", "changeAction"]) {
  if (!dndApp.includes(marker)) fail(`D&D live interaction marker missing: ${marker}`);
}
for (const marker of ["weaponRows", "hybridActive", "skill_expertise", "legacyVirtualItem"]) {
  if (!dndEngine.includes(marker)) fail(`D&D reactive calculation marker missing: ${marker}`);
}
for (const theme of ["crimson", "bloodmoon", "obsidian", "oled", "contrast-dark", "contrast-light"]) {
  if (!dnd.includes(`value="${theme}"`) || !dndStyles.includes(`data-theme=${theme}`)) fail(`D&D theme is incomplete: ${theme}`);
}
for (const id of ["newCharacter","batchCharacters","openCharacter","downloadCharacter","shareButton","preferencesButton","menuButton"]) {
  if (!dnd.includes(`id="${id}"`) || !dndApp.includes(`$('${id}')`)) fail(`D&D control is not wired: ${id}`);
}
if (/script\.google\.com|DND_BRIDGE_KEY|bridgeKey/.test(dndConfig)) {
  fail("D&D public configuration exposes a backend URL or bridge secret.");
}

// The public homepage is a workspace chooser, not the Portfolio sidebar.
if (!index.includes('workspace=Portfolio') || !index.includes('workspace=Personal') || !index.includes('href="birthdays/"')) {
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
if (!index.includes("script.google.com/macros/s/") || !index.includes("?workspace=Portfolio") || !index.includes("?workspace=Personal")) {
  fail("Homepage must route Portfolio and Personal through the protected Apps Script gateway.");
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

for (const path of ["index.html","portfolio/index.html","birthdays/index.html","games/index.html","personal/index.html","admin/index.html"]) {
  const html=read(path);
  if (!html.includes("workspace-nav.css") || !html.includes("workspace-nav.js")) fail(`Shared side navigation is missing: ${path}`);
}

if (!process.exitCode) console.log("Static regression checks passed.");
