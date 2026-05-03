import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const out = path.join(root, "assets", "submission");
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 512, height: 512 });
await page.goto(fileUrl("assets/submission/source/logo.html"));
await page.screenshot({ path: path.join(out, "logo-512.png") });

await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(fileUrl("assets/submission/source/cover.html"));
await page.screenshot({ path: path.join(out, "cover-1280x720.png") });

await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto("http://localhost:4173");
await page.screenshot({ path: path.join(out, "screenshot-1-demo-ui.png"), fullPage: true });

await page.setViewportSize({ width: 1280, height: 720 });
await page.goto("http://localhost:4173");
await page.locator(".timeline").screenshot({ path: path.join(out, "screenshot-2-loop.png") });
await page.locator(".proof").screenshot({ path: path.join(out, "screenshot-3-provenance.png") });

await browser.close();

function fileUrl(relativePath) {
  return `file://${path.join(root, relativePath)}`;
}

