import { readdir, stat } from "node:fs/promises";
import path from "node:path";

export async function globMarkdown(root: string): Promise<string[]> {
  const output: string[] = [];
  await walk(root, output);
  return output;
}

async function walk(current: string, output: string[]): Promise<void> {
  const info = await stat(current).catch(() => null);
  if (!info) return;
  if (info.isFile()) {
    if (current.endsWith(".md")) output.push(current);
    return;
  }
  const entries = await readdir(current);
  for (const entry of entries) {
    await walk(path.join(current, entry), output);
  }
}

