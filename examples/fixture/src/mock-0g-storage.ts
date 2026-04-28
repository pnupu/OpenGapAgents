import { createHash } from "node:crypto";

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
