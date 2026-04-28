# Outcome Change Loop

Status: active  
Updated: 2026-04-26  
Links: [Failed agent execution](failed-execution-definition.md), [Docs fetching](docs-fetching.md), [MVP scope](mvp-scope.md)

## Goal

The system changes the outcome by making the next agent attempt more likely to succeed than the failed one.

## Loop

```text
failed execution
  -> classify failure
  -> decide whether it is a docs/example/skill gap
  -> generate a targeted artifact
  -> validate artifact against the failure case
  -> store artifact + validation evidence
  -> register provenance onchain
  -> update retrieval priority
  -> future agent uses validated artifact first
```

## Artifact Types

- runnable SDK example
- corrected command sequence
- error decoder entry
- troubleshooting page
- minimal fixture repo
- agent skill/tool instruction
- docs patch

## Success Criteria

An artifact changes the outcome if:

- the previous failure is reproducible
- the generated artifact targets the failure
- the validation command passes
- the future retrieval path prefers the validated artifact
- a later agent can complete the task using it

## MVP Outcome Change

The demo should show two attempts:

1. Attempt A fails and produces `.opengap/execution.json`.
2. OpenGap generates and validates `example.ts`.
3. Attempt B uses the validated example and passes.

That before/after contrast is the clearest proof that OpenGap is more than analytics.

## Current Implementation

`publish` now indexes validated artifacts under `.opengap/validated/<artifactId>/`. Future agents can retrieve them with:

```bash
node dist/cli.js validated "upload generated agent artifact to 0G Storage from TypeScript"
```

`ask` also checks validated artifacts and includes the best match in the traceable answer when one exists.
