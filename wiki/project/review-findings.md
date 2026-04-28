# Review Findings

Status: active  
Updated: 2026-04-25  
Links: [Project thesis](project-thesis.md), [MVP scope](mvp-scope.md), [Competitive landscape](competitive-landscape.md)

## Summary

Three independent reviews converged on the same critique:

- the idea fits the 0G framework/tooling prize
- the original scope was too broad
- "AI docs gap detector" is not differentiated enough
- the strongest wedge is failed coding-agent execution traces
- the demo must prove validated artifacts and 0G provenance

## Main Flaws

### 1. Scope Was Too Large

The earlier MVP included passive signals, coding-agent telemetry, generation, validation, Storage, Chain, dashboard, CLI, and possible MCP. That is too much for a credible hackathon demo.

Fix: build one vertical path:

```text
failed agent execution -> trace -> gap -> generated example -> validation -> 0G Storage -> 0G Chain event
```

### 2. The Product Sounded Too Much Like Existing Docs Platforms

Kapa, Mintlify, Inkeep, DocsHound, and GitBook already cover docs Q&A, analytics, gap detection, suggestions, or generated docs updates.

Fix: do not pitch "better docs analytics." Pitch "validated examples from failed coding-agent executions."

### 3. 0G Could Look Decorative

If 0G is only used after the artifact is generated, judges may see it as a normal docs bot with a storage upload.

Fix: make 0G visibly in-path:

- Compute: reflection/generation/review
- Storage: artifact bundle persistence
- Chain: improvement commitment

### 4. Framework Claim Needed Evidence

"Framework-level" is only credible if the repo exposes reusable primitives.

Fix: ship small interfaces/classes:

- `TraceLogger`
- `ExecutionReporter`
- `GapDetector`
- `ArtifactGenerator`
- `Validator`
- `StorageProvider`
- `RegistryProvider`

### 5. Validation Needed To Be Concrete

"Validated examples" is empty unless a judge sees a command pass.

Fix: validate one generated TypeScript example in a fixture repo with a deterministic command. Store `validation.json` as a first-class artifact.

## Revised Wedge

OpenGap is the missing feedback layer between coding agents and developer docs: it captures failed SDK/API execution traces, generates the missing runnable artifact, validates it, and publishes a provenance-backed improvement on 0G.

