# Architecture

OpenGap is a framework loop for turning failed coding-agent executions into validated, reusable artifacts with 0G provenance.

```mermaid
flowchart TD
  A[Codex / Claude Code / CLI agent] --> B[OpenGap CLI]
  B --> C[Docs retriever]
  C --> D[Trace JSON]
  A --> E[Execution report]
  E --> F[Gap detector]
  F --> G[Compute provider]
  G --> H[Generated example]
  H --> I[Validator]
  I --> J[Artifact bundle]
  J --> K[0G Storage]
  J --> L[0G Chain registry]
  K --> M[Storage root]
  L --> N[Registry tx]
  M --> O[Validated artifact index]
  N --> O
  O --> P[Future agent retrieves validated example first]
```

## Core Objects

- `Trace`: question, retrieved docs, source snapshot hash, answer, model metadata.
- `Execution`: command/action attempted by the coding agent and the observed failure.
- `Gap`: the inferred missing doc, example, error decoder, or agent skill.
- `ComputeEvent`: reflection/generation provider metadata and input/output hashes.
- `Artifact`: generated example or doc patch.
- `Validation`: deterministic command output proving the artifact works.
- `ImprovementRecord`: provenance record tying trace, source snapshot, artifact, validation, 0G Storage root, and 0G Chain tx together.
- `ValidatedArtifactIndex`: retrieval layer future agents use before raw docs.

## 0G Usage

- 0G Storage: stores artifact bundles and validation evidence.
- 0G Chain: records improvement commitments through `OpenGapRegistry`.
- 0G Compute: implemented as a provider interface; the current demo uses a local 0G-shaped stub and records compute events.

