export type ActorType = "human" | "coding_agent" | "system";
export type ClientType = "cli" | "mcp" | "codex" | "claude_code" | "web" | "system";
export type ExecutionStatus = "passed" | "failed";
export type FailureKind =
  | "command_failed"
  | "compile_failed"
  | "test_failed"
  | "runtime_failed"
  | "missing_source"
  | "unsupported_claim"
  | "environment"
  | "auth"
  | "network"
  | "user_input";

export interface RetrievedSource {
  sourceId: string;
  path: string;
  title: string;
  score: number;
  excerpt: string;
  hash: string;
}

export interface Trace {
  traceId: string;
  actorType: ActorType;
  client: ClientType;
  question: string;
  retrievedSources: RetrievedSource[];
  answer: string;
  sourceSnapshotHash: string;
  model: string;
  promptHash: string;
  confidence: number;
  feedback?: string;
  followUpCount: number;
  executionEvents: string[];
  acceptedArtifact?: string;
  createdAt: string;
}

export interface Execution {
  executionId: string;
  traceId: string;
  task: string;
  docsSourceIds: string[];
  sourceSnapshotHash: string;
  attemptedCommand: string;
  expectedOutcome: string;
  actualOutcome: string;
  exitCode: number;
  stdoutHash: string;
  stderrHash: string;
  failureKind: FailureKind;
  classification: "docs_gap" | "environment" | "user_input" | "unknown";
  status: ExecutionStatus;
  createdAt: string;
}

export interface Gap {
  gapId: string;
  traceId: string;
  executionId: string;
  title: string;
  reason: string;
  severity: "low" | "medium" | "high";
  suggestedArtifactType: "example" | "docs_patch" | "error_decoder" | "agent_skill";
  evidence: string[];
  createdAt: string;
}

export interface Artifact {
  artifactId: string;
  gapId: string;
  type: "example" | "docs_patch" | "error_decoder" | "agent_skill";
  path: string;
  contentHash: string;
  computeEventId?: string;
  computeProvider?: string;
  computeModel?: string;
  storageRoot?: string;
  validationStatus: "pending" | "passed" | "failed";
  validationId?: string;
  chainTxHash?: string;
  createdAt: string;
}

export interface Validation {
  validationId: string;
  artifactId: string;
  command: string;
  exitCode: number;
  stdoutHash: string;
  stderrHash: string;
  status: ExecutionStatus;
  createdAt: string;
}

export interface ImprovementRecord {
  recordId: string;
  traceHash: string;
  sourceSnapshotHash: string;
  generatedArtifactHash: string;
  validationResultHash: string;
  storageRoot: string;
  registryTx: string;
  artifactType: string;
  createdAt: string;
}

export interface ComputeEvent {
  computeEventId: string;
  provider: string;
  model: string;
  purpose: "reflect_generate_example" | "answer" | "critique";
  inputHash: string;
  outputHash: string;
  verification?: "local_stub" | "tee_verified" | "unverified";
  createdAt: string;
}
