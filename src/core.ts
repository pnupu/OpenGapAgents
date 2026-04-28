import { writeFile } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Artifact, Execution, Gap, ImprovementRecord, Trace, Validation } from "./types.js";
import { retrieveDocs, snapshotHash } from "./retriever.js";
import { ensureDir, id, nowIso, opengapDir, readJson, resolveMaybeId, sha256, writeJson } from "./utils.js";
import { findValidatedArtifacts, indexValidatedArtifact, ValidatedArtifactMatch } from "./validated.js";
import {
  createArtifactBundle,
  createRegistryProvider,
  createStorageProvider,
  LocalZeroGComputeProvider,
} from "./providers.js";

const execFileAsync = promisify(execFile);

export async function ask(question: string): Promise<Trace> {
  const sources = await retrieveDocs(question);
  const validatedMatches = await findValidatedArtifacts(question, 1);
  const sourceHash = snapshotHash(sources);
  const answer = buildAnswer(question, sources, validatedMatches);
  const trace: Trace = {
    traceId: id("trace"),
    actorType: "coding_agent",
    client: "cli",
    question,
    retrievedSources: sources,
    answer,
    sourceSnapshotHash: sourceHash,
    model: "local-retriever+mock-answerer",
    promptHash: sha256(question),
    confidence: sources.length > 0 ? 0.72 : 0.2,
    followUpCount: 0,
    executionEvents: ["answer_returned"],
    createdAt: nowIso()
  };
  await writeJson(path.join(opengapDir, "traces", `${trace.traceId}.json`), trace);
  return trace;
}

export async function reportFailure(traceRef: string, options: {
  task: string;
  command: string;
  expected: string;
  actual: string;
  exitCode: number;
  stderr: string;
}): Promise<{ execution: Execution; gap: Gap }> {
  const trace = await readJson<Trace>(resolveMaybeId("trace", traceRef));
  const execution: Execution = {
    executionId: id("exec"),
    traceId: trace.traceId,
    task: options.task,
    docsSourceIds: trace.retrievedSources.map((source) => source.sourceId),
    sourceSnapshotHash: trace.sourceSnapshotHash,
    attemptedCommand: options.command,
    expectedOutcome: options.expected,
    actualOutcome: options.actual,
    exitCode: options.exitCode,
    stdoutHash: sha256(""),
    stderrHash: sha256(options.stderr),
    failureKind: classifyFailure(options.stderr, options.exitCode),
    classification: "docs_gap",
    status: "failed",
    createdAt: nowIso()
  };
  const gap: Gap = {
    gapId: id("gap"),
    traceId: trace.traceId,
    executionId: execution.executionId,
    title: "Missing runnable 0G SDK example",
    reason: "The coding agent could not complete the task from retrieved docs and needs a validated example artifact.",
    severity: "high",
    suggestedArtifactType: "example",
    evidence: [execution.executionId, execution.stderrHash],
    createdAt: nowIso()
  };
  await writeJson(path.join(opengapDir, "executions", `${execution.executionId}.json`), execution);
  await writeJson(path.join(opengapDir, "gaps", `${gap.gapId}.json`), gap);
  return { execution, gap };
}

export async function generateExample(gapRef: string): Promise<Artifact> {
  const gap = await readJson<Gap>(resolveMaybeId("gap", gapRef));
  const dir = path.join("examples", "fixture", "generated");
  const artifactPath = path.join(dir, "example.ts");
  const computeProvider = new LocalZeroGComputeProvider();
  const { content, computeEvent } = await computeProvider.reflectAndGenerateExample(gap);
  await ensureDir(dir);
  await writeFile(artifactPath, content, "utf8");
  const artifact: Artifact = {
    artifactId: id("artifact"),
    gapId: gap.gapId,
    type: "example",
    path: artifactPath,
    contentHash: sha256(content),
    computeEventId: computeEvent.computeEventId,
    computeProvider: computeEvent.provider,
    computeModel: computeEvent.model,
    validationStatus: "pending",
    createdAt: nowIso()
  };
  await writeJson(path.join(opengapDir, "artifacts", `${artifact.artifactId}.json`), artifact);
  return artifact;
}

export async function validateArtifact(artifactRef: string): Promise<{ artifact: Artifact; validation: Validation }> {
  const artifactPath = resolveMaybeId("artifact", artifactRef);
  const artifact = await readJson<Artifact>(artifactPath);
  const command = "npx tsc -p examples/fixture/tsconfig.json --noEmit";
  let exitCode = 0;
  let stdout = "";
  let stderr = "";
  try {
    const result = await execFileAsync("npx", ["tsc", "-p", "examples/fixture/tsconfig.json", "--noEmit"], {
      cwd: process.cwd(),
      timeout: 30_000
    });
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (error) {
    exitCode = typeof (error as { code?: unknown }).code === "number" ? (error as { code: number }).code : 1;
    stdout = String((error as { stdout?: unknown }).stdout ?? "");
    stderr = String((error as { stderr?: unknown }).stderr ?? error);
  }
  const validation: Validation = {
    validationId: id("validation"),
    artifactId: artifact.artifactId,
    command,
    exitCode,
    stdoutHash: sha256(stdout),
    stderrHash: sha256(stderr),
    status: exitCode === 0 ? "passed" : "failed",
    createdAt: nowIso()
  };
  artifact.validationId = validation.validationId;
  artifact.validationStatus = validation.status;
  await writeJson(path.join(opengapDir, "validations", `${validation.validationId}.json`), validation);
  await writeJson(artifactPath, artifact);
  return { artifact, validation };
}

export async function publishArtifact(artifactRef: string): Promise<Artifact> {
  const artifactPath = resolveMaybeId("artifact", artifactRef);
  const artifact = await readJson<Artifact>(artifactPath);
  if (!artifact.validationId) throw new Error("artifact must be validated before publish");
  if (artifact.validationStatus !== "passed") throw new Error("artifact validation must pass before publish");
  const validation = await readJson<Validation>(path.join(opengapDir, "validations", `${artifact.validationId}.json`));
  const { gap, trace, traceHash } = await traceForArtifact(artifact);
  const storageProvider = createStorageProvider();
  const registryProvider = createRegistryProvider();
  const { storageRoot } = await storageProvider.storeArtifactBundle(await createArtifactBundle(artifact, validation));
  const { registryTx } = await registryProvider.recordImprovement({
    traceHash,
    storageRoot,
    contentHash: artifact.contentHash,
    artifactType: artifact.type
  });
  artifact.storageRoot = storageRoot;
  artifact.chainTxHash = registryTx;
  await writeJson(artifactPath, artifact);
  const improvement = await writeImprovementRecord(artifact, validation, storageRoot, registryTx, trace, traceHash);
  await indexValidatedArtifact({ artifact, gap, trace, validation, improvement });
  return artifact;
}

async function writeImprovementRecord(
  artifact: Artifact,
  validation: Validation,
  storageRoot: string,
  registryTx: string,
  trace: Trace,
  traceHash: string
): Promise<ImprovementRecord> {
  const validationResultHash = sha256(JSON.stringify(validation));
  const record: ImprovementRecord = {
    recordId: id("improvement"),
    traceHash,
    sourceSnapshotHash: trace.sourceSnapshotHash,
    generatedArtifactHash: artifact.contentHash,
    validationResultHash,
    storageRoot,
    registryTx,
    artifactType: artifact.type,
    createdAt: nowIso()
  };
  await writeJson(path.join(opengapDir, "improvements", `${record.recordId}.json`), record);
  return record;
}

export async function getValidatedExamples(query: string): Promise<ValidatedArtifactMatch[]> {
  return findValidatedArtifacts(query);
}

async function traceForArtifact(artifact: Artifact): Promise<{ gap: Gap; trace: Trace; traceHash: string }> {
  const gap = await readJson<Gap>(path.join(opengapDir, "gaps", `${artifact.gapId}.json`));
  const trace = await readJson<Trace>(path.join(opengapDir, "traces", `${gap.traceId}.json`));
  return { gap, trace, traceHash: sha256(JSON.stringify(trace)) };
}

function buildAnswer(
  question: string,
  sources: { title: string; path: string }[],
  validatedMatches: ValidatedArtifactMatch[]
): string {
  const sourceList = sources.map((source) => `- ${source.title} (${source.path})`).join("\n");
  const validated = validatedMatches[0];
  const validatedText = validated
    ? `\n\nValidated example available:\n- artifact: ${validated.entry.artifactId}\n- storageRoot: ${validated.entry.storageRoot}\n- registryTx: ${validated.entry.registryTx}\n`
    : "";
  return `OpenGap found ${sources.length} relevant source(s) for: "${question}".\n\n${sourceList}${validatedText}\n\nFor the MVP, this answer is intentionally traceable and should be followed by an execution report if the coding agent cannot complete the task.`;
}

function classifyFailure(stderr: string, exitCode: number): Execution["failureKind"] {
  const lower = stderr.toLowerCase();
  if (exitCode === 0) return "command_failed";
  if (lower.includes("typescript") || lower.includes("tsc") || lower.includes("type")) return "compile_failed";
  if (lower.includes("test")) return "test_failed";
  if (lower.includes("network") || lower.includes("timeout")) return "network";
  if (lower.includes("api key") || lower.includes("unauthorized")) return "auth";
  return "command_failed";
}
