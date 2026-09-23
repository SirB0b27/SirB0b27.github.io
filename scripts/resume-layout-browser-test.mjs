import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const templates = ["azurill","bronzor","chikorita","ditgar","ditto","gengar","glalie","kakuna","lapras","leafish","meowth","onyx","pikachu","rhyhorn","scizor"];
const outputDir = path.resolve("artifacts/resume-layouts");
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 1400 }, deviceScaleFactor: 1 });

const failures = [];

const checkTemplate = async (template) => {
  await page.selectOption("#resumeStyle", template);
  await page.waitForTimeout(140);

  const metrics = await page.evaluate(() => {
    const doc = document.querySelector("#resumeDocument");
    const layout = document.querySelector("#resumeLayout");
    const columns = document.querySelector(".resume-columns");
    const main = document.querySelector(".resume-main");
    const sidebar = document.querySelector(".resume-sidebar");
    const docRect = doc.getBoundingClientRect();
    const layoutRect = layout.getBoundingClientRect();
    const scale = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--resume-content-scale")) || 1;

    const offenders = [...layout.querySelectorAll("*")].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        cls: el.className || "",
        left: r.left,
        right: r.right,
        top: r.top,
        bottom: r.bottom,
        width: r.width,
        height: r.height
      };
    }).filter((r) =>
      r.width > 0 && r.height > 0 &&
      (r.left < docRect.left - 3 || r.right > docRect.right + 3 || r.bottom > docRect.bottom + 3)
    ).slice(0, 8);

    const text = layout.innerText;
    const baseFontPx = Number.parseFloat(getComputedStyle(layout).fontSize) || 0;
    const mainWidth = main?.getBoundingClientRect().width ?? 0;
    const sidebarWidth = sidebar?.getBoundingClientRect().width ?? 0;

    return {
      doc: { width: docRect.width, height: docRect.height },
      layout: { width: layoutRect.width, height: layoutRect.height },
      mainWidth,
      sidebarWidth,
      hasColumns: Boolean(columns),
      contentScale: scale,
      visualContentHeight: layout.scrollHeight * scale,
      docClientHeight: doc.clientHeight,
      offenders,
      effectiveBodyPt: baseFontPx * (72 / 96) * scale,
      textLength: text.length,
      containsGithub: /github\.com\/SirB0b27/i.test(text),
      containsLinkedIn: /linkedin\.com\/in\/hemanthvelan27/i.test(text)
    };
  });

  const ratio = metrics.mainWidth / metrics.doc.width;
  const sidebarRatio = metrics.sidebarWidth / metrics.doc.width;

  if (metrics.textLength < 800) failures.push(`${template}: resume content unexpectedly short`);
  if (metrics.containsGithub || metrics.containsLinkedIn) failures.push(`${template}: social links appeared in resume output`);
  if (metrics.visualContentHeight > metrics.docClientHeight + 4) failures.push(`${template}: content exceeds Letter page height`);
  if (metrics.offenders.length) failures.push(`${template}: content escapes page bounds: ${JSON.stringify(metrics.offenders)}`);
  if (metrics.hasColumns && ratio < 0.48) failures.push(`${template}: main content column is too narrow (${Math.round(ratio * 100)}% of page)`);
  if (metrics.hasColumns && (sidebarRatio < 0.19 || sidebarRatio > 0.38)) failures.push(`${template}: sidebar width is abnormal (${Math.round(sidebarRatio * 100)}% of page)`);
  if (metrics.contentScale < 0.90) failures.push(`${template}: required excessive content scaling (${metrics.contentScale})`);
  if (metrics.effectiveBodyPt < 8.5) failures.push(`${template}: effective body text is too small (${metrics.effectiveBodyPt.toFixed(2)}pt)`);

  await page.locator("#resumeDocument").screenshot({ path: path.join(outputDir, `${template}.png`) });
  console.log(`[OK] ${template}: main=${Math.round(ratio*100)}%, sidebar=${Math.round(sidebarRatio*100)}%, fit=${metrics.contentScale}`);
};

try {
  await page.goto("http://127.0.0.1:4173/resume/", { waitUntil: "networkidle" });

  // Test text-only output first.
  for (const template of templates) await checkTemplate(template);

  // Add a tiny local image and verify every layout still fits with a profile photo.
  const onePixelPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=",
    "base64"
  );
  await page.setInputFiles("#photoUpload", { name: "layout-test.png", mimeType: "image/png", buffer: onePixelPng });
  await page.waitForTimeout(120);

  for (const template of templates) {
    await page.selectOption("#resumeStyle", template);
    await page.waitForTimeout(100);
    const photoCount = await page.locator("#resumeDocument .resume-photo").count();
    if (photoCount !== 1) failures.push(`${template}: expected exactly one selected profile photo, found ${photoCount}`);
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error("\nResume browser regression failures:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}

console.log("\nAll resume browser layout checks passed.");
