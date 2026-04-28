import { writeFile } from "node:fs/promises";
import path from "node:path";
import { ensureDir } from "./utils.js";

export async function ensureFixture(): Promise<void> {
  const root = path.join(process.cwd(), "examples", "fixture");
  await ensureDir(path.join(root, "src"));
  await ensureDir(path.join(root, "generated"));
  await writeFile(
    path.join(root, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          strict: true,
          noEmit: true,
          skipLibCheck: true
        },
        include: ["src/**/*.ts", "generated/**/*.ts"]
      },
      null,
      2
    ) + "\n",
    "utf8"
  );
  await writeFile(
    path.join(root, "src", "mock-0g-storage.ts"),
    `import { createHash } from "node:crypto";

export interface AgentArtifactInput {
  name: string;
  content: string;
}

export interface UploadResult {
  root: string;
  bytes: number;
}

export async function uploadAgentArtifact(input: AgentArtifactInput): Promise<UploadResult> {
  const hash = createHash("sha256").update(input.name + ":" + input.content).digest("hex");
  return {
    root: "0g_local_" + hash.slice(0, 24),
    bytes: Buffer.byteLength(input.content)
  };
}
`,
    "utf8"
  );
}

