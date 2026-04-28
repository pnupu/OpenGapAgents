import { readFile } from "node:fs/promises";
import path from "node:path";
import { globMarkdown } from "./walk.js";
import { RetrievedSource } from "./types.js";
import { sha256 } from "./utils.js";

const docsRoots = ["wiki", "README.md", "AGENTS.md"];

export async function retrieveDocs(query: string, limit = 4): Promise<RetrievedSource[]> {
  const files = await collectDocs();
  const terms = tokenize(query);
  const scored: RetrievedSource[] = [];

  for (const file of files) {
    const text = await readFile(file, "utf8");
    const lower = text.toLowerCase();
    const score = terms.reduce((sum, term) => sum + count(lower, term), 0);
    if (score === 0) continue;
    scored.push({
      sourceId: sha256(file).slice(0, 12),
      path: path.relative(process.cwd(), file),
      title: extractTitle(text, file),
      score,
      excerpt: excerpt(text, terms),
      hash: sha256(text)
    });
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function snapshotHash(sources: RetrievedSource[]): string {
  return sha256(sources.map((source) => `${source.path}:${source.hash}`).sort().join("\n"));
}

async function collectDocs(): Promise<string[]> {
  const results: string[] = [];
  for (const root of docsRoots) {
    const absolute = path.join(process.cwd(), root);
    if (root.endsWith(".md")) {
      results.push(absolute);
    } else {
      results.push(...(await globMarkdown(absolute)));
    }
  }
  return results;
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2);
}

function count(text: string, term: string): number {
  return text.split(term).length - 1;
}

function extractTitle(text: string, file: string): string {
  const title = text.match(/^#\s+(.+)$/m)?.[1];
  return title ?? path.basename(file);
}

function excerpt(text: string, terms: string[]): string {
  const lower = text.toLowerCase();
  const first = terms
    .map((term) => lower.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, first - 160);
  const end = Math.min(text.length, first + 360);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

