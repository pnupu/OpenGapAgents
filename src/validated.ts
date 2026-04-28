import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Artifact, Gap, ImprovementRecord, Trace, Validation } from "./types.js";
import { opengapDir, readJson, sha256, writeJson } from "./utils.js";

export interface ValidatedArtifactIndexEntry {
  artifactId: string;
  gapId: string;
  traceId: string;
  task: string;
  queryTerms: string[];
  artifactPath: string;
  contentHash: string;
  validationId: string;
  storageRoot: string;
  registryTx: string;
  createdAt: string;
}

export interface ValidatedArtifactMatch {
  entry: ValidatedArtifactIndexEntry;
  score: number;
  content: string;
}

export async function indexValidatedArtifact(input: {
  artifact: Artifact;
  gap: Gap;
  trace: Trace;
  validation: Validation;
  improvement: ImprovementRecord;
}): Promise<ValidatedArtifactIndexEntry> {
  if (!input.artifact.validationId || !input.artifact.storageRoot || !input.artifact.chainTxHash) {
    throw new Error("artifact must be validated and published before indexing");
  }
  const content = await readFile(path.join(process.cwd(), input.artifact.path), "utf8");
  const dir = path.join(opengapDir, "validated", input.artifact.artifactId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "example.ts"), content, "utf8");

  const entry: ValidatedArtifactIndexEntry = {
    artifactId: input.artifact.artifactId,
    gapId: input.gap.gapId,
    traceId: input.trace.traceId,
    task: input.trace.question,
    queryTerms: tokenize(`${input.trace.question} ${input.gap.title} ${input.gap.reason}`),
    artifactPath: path.join(dir, "example.ts"),
    contentHash: input.artifact.contentHash,
    validationId: input.validation.validationId,
    storageRoot: input.improvement.storageRoot,
    registryTx: input.improvement.registryTx,
    createdAt: input.improvement.createdAt
  };
  await writeJson(path.join(dir, "index.json"), entry);
  return entry;
}

export async function findValidatedArtifacts(query: string, limit = 3): Promise<ValidatedArtifactMatch[]> {
  const root = path.join(opengapDir, "validated");
  const dirs = await readdir(root).catch(() => []);
  const terms = tokenize(query);
  const matches: ValidatedArtifactMatch[] = [];

  for (const dir of dirs) {
    const entryPath = path.join(root, dir, "index.json");
    const contentPath = path.join(root, dir, "example.ts");
    const entry = await readJson<ValidatedArtifactIndexEntry>(entryPath).catch(() => null);
    if (!entry) continue;
    const score = scoreTerms(terms, entry.queryTerms);
    if (score === 0) continue;
    const content = await readFile(contentPath, "utf8");
    if (sha256(content) !== entry.contentHash) continue;
    matches.push({ entry, score, content });
  }

  return matches.sort((a, b) => b.score - a.score).slice(0, limit);
}

function tokenize(input: string): string[] {
  return Array.from(new Set(input.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 2)));
}

function scoreTerms(queryTerms: string[], indexedTerms: string[]): number {
  const indexed = new Set(indexedTerms);
  return queryTerms.reduce((score, term) => score + (indexed.has(term) ? 1 : 0), 0);
}

