# Architecture

Status: active  
Updated: 2026-04-25  
Links: [MVP scope](mvp-scope.md), [0G integration map](0g-integration-map.md)

## Components

```text
Developer
  |
  v
CLI first / MCP later / Web UI optional
  |
  v
OpenGap Core
  |-- docs retriever
  |-- answer engine
  |-- trace logger
  |-- coding-agent telemetry collector
  |-- failure/gap detector
  |-- reflection engine
  |-- artifact generator
  |-- validator
  |-- compute provider adapter
  |-- storage provider adapter
  |-- chain registry provider adapter
  |
  +--> 0G Compute
  |      answer / reflect / generate / critique
  |
  +--> 0G Storage
  |      traces / generated docs / examples / validation reports
  |
  +--> 0G Chain
         registry / artifact commitments / events
```

## Core Data Types

### Trace

- `traceId`
- `actorType`: `human`, `coding_agent`, or `system`
- `client`: `web`, `cli`, `mcp`, `codex`, `claude_code`, or other client ID
- `question`
- `retrievedSources`
- `answer`
- `sourceSnapshotHash`
- `model`
- `promptHash`
- `confidence`
- `feedback`
- `followUpCount`
- `executionEvents`
- `acceptedArtifact`
- `createdAt`

### Execution

- `executionId`
- `traceId`
- `command`
- `cwd`
- `environment`
- `exitCode`
- `stdoutHash`
- `stderrHash`
- `status`
- `createdAt`

### Gap

- `gapId`
- `traceId`
- `title`
- `reason`
- `severity`
- `suggestedArtifactType`
- `evidence`: passive signals, explicit feedback, validation failures, or agent execution traces

### Artifact

- `artifactId`
- `gapId`
- `type`
- `path`
- `contentHash`
- `computeEventId`
- `computeProvider`
- `computeModel`
- `storageRoot`
- `validationStatus`
- `validationId`
- `chainTxHash`

### Validation

- `validationId`
- `artifactId`
- `command`
- `exitCode`
- `stdoutHash`
- `stderrHash`
- `status`

### ComputeEvent

- `computeEventId`
- `provider`
- `model`
- `purpose`
- `inputHash`
- `outputHash`
- `verification`
- `createdAt`

## Framework Surface

The framework should expose clear extension points:

- docs source plugin
- LLM/0G Compute backend
- memory/storage adapter
- validator adapter
- publication adapter

## MVP Primitive

The product should visibly create one provenance record:

```text
traceHash + sourceSnapshotHash + generatedArtifactHash + validationResultHash + storageRoot + registryTx
```
