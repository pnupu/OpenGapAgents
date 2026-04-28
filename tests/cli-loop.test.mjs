import { execFile } from "node:child_process";
import { rm, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import assert from "node:assert/strict";

const execFileAsync = promisify(execFile);
const root = process.cwd();

async function run(command, args = []) {
  const result = await execFileAsync(command, args, {
    cwd: root,
    timeout: 30_000
  });
  return result.stdout;
}

async function json(file) {
  return JSON.parse(await readFile(path.join(root, file), "utf8"));
}

async function oneFile(dir) {
  const files = await readdir(path.join(root, dir));
  assert.equal(files.length, 1, `expected one file in ${dir}`);
  return path.join(dir, files[0]);
}

await rm(path.join(root, ".opengap"), { recursive: true, force: true });
await rm(path.join(root, "examples", "fixture", "generated"), { recursive: true, force: true });

await run("node", ["dist/cli.js", "demo"]);

const trace = await json(await oneFile(".opengap/traces"));
assert.equal(trace.actorType, "coding_agent");
assert.ok(trace.retrievedSources.length > 0);
assert.ok(trace.sourceSnapshotHash);

const execution = await json(await oneFile(".opengap/executions"));
assert.equal(execution.status, "failed");
assert.equal(execution.classification, "docs_gap");

const gap = await json(await oneFile(".opengap/gaps"));
assert.equal(gap.suggestedArtifactType, "example");

const artifact = await json(await oneFile(".opengap/artifacts"));
assert.equal(artifact.validationStatus, "passed");
assert.ok(artifact.computeEventId?.startsWith("compute_"));
assert.equal(artifact.computeProvider, "local-0g-compute-stub");
assert.equal(artifact.computeModel, "mock-qwen3.6-plus");
assert.ok(artifact.storageRoot?.startsWith("0g_local_"));
assert.ok(artifact.chainTxHash?.startsWith("0g_tx_local_"));

const compute = await json(await oneFile(".opengap/compute"));
assert.equal(compute.purpose, "reflect_generate_example");
assert.equal(compute.verification, "local_stub");

const validation = await json(await oneFile(".opengap/validations"));
assert.equal(validation.status, "passed");
assert.equal(validation.exitCode, 0);

const storageDirs = await readdir(path.join(root, ".opengap/storage"));
assert.equal(storageDirs.length, 1);
assert.ok(storageDirs[0].startsWith("0g_local_"));

const registryFiles = await readdir(path.join(root, ".opengap/registry"));
assert.equal(registryFiles.length, 1);
assert.ok(registryFiles[0].startsWith("0g_tx_local_"));

const improvement = await json(await oneFile(".opengap/improvements"));
assert.ok(improvement.traceHash);
assert.ok(improvement.sourceSnapshotHash);
assert.equal(improvement.generatedArtifactHash, artifact.contentHash);
assert.equal(improvement.storageRoot, artifact.storageRoot);
assert.equal(improvement.registryTx, artifact.chainTxHash);
assert.equal(improvement.artifactType, "example");

const validatedDirs = await readdir(path.join(root, ".opengap/validated"));
assert.equal(validatedDirs.length, 1);
const validatedIndex = await json(path.join(".opengap/validated", validatedDirs[0], "index.json"));
assert.equal(validatedIndex.artifactId, artifact.artifactId);
assert.equal(validatedIndex.storageRoot, artifact.storageRoot);

const validatedOutput = await run("node", [
  "dist/cli.js",
  "validated",
  "upload generated agent artifact to 0G Storage from TypeScript"
]);
const validatedMatches = JSON.parse(validatedOutput);
assert.equal(validatedMatches.length, 1);
assert.equal(validatedMatches[0].entry.artifactId, artifact.artifactId);

console.log("cli loop test passed");
