# MVP Scope

Status: active  
Updated: 2026-04-25  
Links: [Project thesis](project-thesis.md), [Architecture](architecture.md), [Submission checklist](../hackathon/submission-checklist.md)

## Hackathon MVP Cut

Build one complete vertical proof loop:

1. CLI commands: `ask`, `report`, `generate-example`, `validate`, `publish`
2. Local wiki/docs retriever
3. Structured trace, execution, gap, artifact, and validation JSON
4. One deterministic coding-agent failure scenario
5. One generated or templated TypeScript example
6. One deterministic validation command
7. One Compute event for reflection/generation
8. One 0G Storage upload of the artifact bundle
9. One 0G Chain registry event recording the storage root/hash
10. One provenance record tying trace, source snapshot, artifact, validation, storage, and registry together

## Example Agent

The required example agent should help coding agents build on 0G. It should know:

- 0G Compute inference flow
- 0G Storage upload/download concepts
- 0G Chain deployment basics
- ETHGlobal 0G submission requirements
- how Codex/Claude Code can call OpenGap through MCP or CLI

For the demo, it is acceptable for Codex/Claude integration to be represented by repo-local `.opengap/` trace files and CLI calls. Build MCP only after the CLI loop is stable.

## Keep Out Of MVP

- full no-code visual builder
- multi-agent swarm UI
- 0G DA integration
- iNFT minting
- multi-ecosystem plugin marketplace
- fully automated GitHub PR flow
- dashboard
- full MCP server
- passive browser telemetry
- automatic PR generation
- gap clustering
- multi-agent review

## Demo Target

One complete loop matters more than many incomplete features:

```text
failed agent execution -> trace -> gap -> generated example -> validation -> 0G Storage -> 0G Chain event
```

## Feedback Assumption

Do not rely on developers clicking feedback buttons. For the MVP, use explicit structured execution events:

- `answer_returned`
- `command_failed`
- `validation_passed`
- `artifact_accepted`

Passive human signals are future scoring inputs, not a hackathon dependency.
