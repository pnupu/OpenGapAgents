import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const workspaceRoot = process.cwd();
export const opengapDir = path.join(workspaceRoot, ".opengap");

export function nowIso(): string {
  return new Date().toISOString();
}

export function id(prefix: string): string {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

export function sha256(input: string | Buffer): string {
  return createHash("sha256").update(input).digest("hex");
}

export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

export async function writeJson(filePath: string, value: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

export function resolveMaybeId(kind: string, value: string): string {
  if (value.includes("/") || value.endsWith(".json")) return path.resolve(value);
  return path.join(opengapDir, `${kind}s`, `${value}.json`);
}

export function shortHash(input: string | Buffer): string {
  return sha256(input).slice(0, 16);
}

