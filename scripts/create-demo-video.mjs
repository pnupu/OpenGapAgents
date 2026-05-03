import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { chromium } from "playwright";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const outDir = path.join(root, "assets", "video");
const slidesDir = path.join(outDir, "slides");
const narrationPath = path.join(outDir, "narration.txt");
const audioPath = path.join(outDir, "narration.aiff");
const concatPath = path.join(outDir, "slides.txt");
const videoPath = path.join(outDir, "opengap-demo.mp4");
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const ffprobe = process.env.FFPROBE ?? "ffprobe";

await mkdir(slidesDir, { recursive: true });

const narration = `OpenGap Agents is a framework for making coding agents learn from execution failures.

Today, developer ecosystems increasingly add AI docs assistants. But when a coding agent follows documentation and fails, that failure usually disappears. The agent may hit a missing SDK example, call a method that does not exist, or fail to compile. The next agent repeats the same mistake.

OpenGap turns that failure into a reusable improvement. The loop starts with a trace: what task the agent tried, which docs it used, what command it ran, and what error it saw. OpenGap classifies the failure as a gap when a clearer doc, runnable example, or agent skill would have prevented it.

Then OpenGap generates a targeted artifact. In this demo, the artifact is a TypeScript example for uploading an agent artifact to 0G Storage. The generated example is not accepted on faith. OpenGap validates it with a deterministic TypeScript compile step and records the validation result.

After validation passes, OpenGap publishes the artifact bundle to 0G Storage. The bundle includes the trace, gap, generated example, compute metadata, and validation proof. OpenGap also records a provenance commitment on 0G Galileo through the OpenGapRegistry contract.

The important part is what happens next. OpenGap indexes the validated artifact, so future coding agents retrieve the working example before falling back to raw docs. That changes the outcome: a failed execution becomes a validated example future agents can reuse.

The project is built as a TypeScript CLI-first framework with provider adapters. 0G Storage and 0G Chain are live on Galileo testnet. Compute is represented by a provider interface and local compute event in this demo, ready to swap to live 0G Compute.

OpenGap is not just another docs chatbot. It is a feedback layer between coding agents and developer docs: failed execution, generated fix, validation, 0G provenance, and future reuse.`;

await writeFile(narrationPath, narration, "utf8");
await execFileAsync("say", ["-r", "158", "-o", audioPath, "-f", narrationPath]);

const slides = [
  {
    title: "OpenGap Agents",
    kicker: "0G Open Agents Framework",
    body: "Failed coding-agent executions become validated, reusable SDK examples with 0G-backed provenance.",
    image: "assets/submission/cover-1280x720.png"
  },
  {
    title: "The failure signal",
    kicker: "Trace",
    body: "A coding agent tries a 0G SDK task, uses docs, runs a command, and fails with observable evidence.",
    bullets: ["task intent", "docs used", "command", "expected outcome", "actual error"]
  },
  {
    title: "From failure to gap",
    kicker: "Gap detection",
    body: "OpenGap only generates a docs/example gap when a clearer artifact would likely have prevented the failure.",
    image: "assets/submission/screenshot-2-loop.png"
  },
  {
    title: "Generate and validate",
    kicker: "Artifact",
    body: "The framework generates a runnable TypeScript example and validates it with a deterministic compile step.",
    bullets: ["generated example.ts", "tsc validation", "validation.json", "content hash"]
  },
  {
    title: "Publish on 0G",
    kicker: "Storage + Chain",
    body: "Validated artifact bundles are uploaded to 0G Storage and committed through OpenGapRegistry on 0G Galileo.",
    bullets: [
      "Storage root: 0x264a...6edc",
      "Registry: 0x5900...8994",
      "Tx: 0x30ff...2127"
    ]
  },
  {
    title: "Provenance record",
    kicker: "Verifiable loop",
    body: "Each improvement links the trace hash, source snapshot, generated artifact, validation result, storage root, and registry transaction.",
    image: "assets/submission/screenshot-3-provenance.png"
  },
  {
    title: "Future reuse",
    kicker: "Changed outcome",
    body: "After publishing, future agents retrieve the validated artifact before falling back to raw docs.",
    image: "assets/submission/screenshot-1-demo-ui.png"
  },
  {
    title: "Framework primitives",
    kicker: "Reusable tooling",
    body: "TraceLogger, GapDetector, ArtifactGenerator, Validator, StorageProvider, RegistryProvider, and a validated artifact index.",
    bullets: ["TypeScript CLI", "0G Storage", "0G Chain", "Solidity registry", "local demo UI"]
  }
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

for (let index = 0; index < slides.length; index += 1) {
  await page.setContent(renderSlide(slides[index]), { waitUntil: "load" });
  await page.screenshot({ path: path.join(slidesDir, `slide-${String(index + 1).padStart(2, "0")}.png`) });
}

await browser.close();

const duration = await audioDuration(audioPath);
const slideDuration = Math.max(12, Math.ceil(duration / slides.length));
const lines = [];
for (let index = 0; index < slides.length; index += 1) {
  const slidePath = path.join(slidesDir, `slide-${String(index + 1).padStart(2, "0")}.png`);
  lines.push(`file '${slidePath.replaceAll("'", "'\\''")}'`);
  lines.push(`duration ${slideDuration}`);
}
lines.push(`file '${path.join(slidesDir, `slide-${String(slides.length).padStart(2, "0")}.png`).replaceAll("'", "'\\''")}'`);
await writeFile(concatPath, `${lines.join("\n")}\n`, "utf8");

await execFileAsync(ffmpeg, [
  "-y",
  "-f", "concat",
  "-safe", "0",
  "-i", concatPath,
  "-i", audioPath,
  "-t", String(duration + 0.5),
  "-r", "30",
  "-vf", "scale=1280:720,format=yuv420p",
  "-c:v", "libx264",
  "-preset", "medium",
  "-crf", "18",
  "-c:a", "aac",
  "-b:a", "160k",
  "-shortest",
  videoPath
]);

console.log(videoPath);
console.log(`audio seconds: ${duration.toFixed(1)}`);
console.log(`slide seconds: ${slideDuration}`);

async function audioDuration(file) {
  const { stdout } = await execFileAsync(ffprobe, [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    file
  ]);
  return Number(stdout.trim());
}

function renderSlide(slide) {
  const bullets = slide.bullets?.map((item) => `<li>${escapeHtml(item)}</li>`).join("") ?? "";
  const image = slide.image ? `<div class="image"><img src="file://${path.join(root, slide.image)}" /></div>` : "";
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
* { box-sizing: border-box; }
body {
  width: 1280px;
  height: 720px;
  margin: 0;
  color: #f4f1e8;
  background:
    radial-gradient(circle at 18% 10%, rgba(184,255,92,.18), transparent 360px),
    radial-gradient(circle at 86% 42%, rgba(109,240,194,.12), transparent 320px),
    linear-gradient(135deg, #0d0f0b, #10160f 52%, #07100d);
  font-family: "Avenir Next", "Segoe UI", sans-serif;
}
.slide {
  width: 100%;
  height: 100%;
  padding: 70px;
  display: grid;
  grid-template-columns: 1fr ${slide.image ? "500px" : "0px"};
  gap: ${slide.image ? "44px" : "0"};
  align-items: center;
}
.kicker {
  margin: 0 0 18px;
  color: #b8ff5c;
  font-size: 20px;
  font-weight: 850;
  text-transform: uppercase;
}
h1 {
  margin: 0;
  max-width: 760px;
  font-size: 78px;
  line-height: .94;
  letter-spacing: 0;
}
p {
  max-width: 780px;
  margin: 26px 0 0;
  color: #a9b19d;
  font-size: 29px;
  line-height: 1.35;
}
ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  max-width: 840px;
  margin: 34px 0 0;
  padding: 0;
  list-style: none;
}
li {
  border: 1px solid #38412d;
  border-radius: 8px;
  padding: 18px;
  color: #dcebd1;
  background: #171a13;
  font-size: 23px;
}
.image {
  border: 1px solid #38412d;
  border-radius: 10px;
  overflow: hidden;
  background: #171a13;
  box-shadow: 0 30px 80px rgba(0,0,0,.35);
}
img {
  display: block;
  width: 100%;
  height: 360px;
  object-fit: cover;
}
.footer {
  position: fixed;
  left: 70px;
  bottom: 36px;
  color: #6df0c2;
  font: 700 18px ui-monospace, SFMono-Regular, Menlo, monospace;
}
</style>
</head>
<body>
<main class="slide">
  <section>
    <div class="kicker">${escapeHtml(slide.kicker)}</div>
    <h1>${escapeHtml(slide.title)}</h1>
    <p>${escapeHtml(slide.body)}</p>
    ${bullets ? `<ul>${bullets}</ul>` : ""}
  </section>
  ${image}
</main>
<div class="footer">OpenGap Agents · 0G Galileo</div>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
