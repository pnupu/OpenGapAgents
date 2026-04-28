# Codex And Claude Code Workflow

Status: active  
Updated: 2026-04-25  
Links: [Feedback loop](feedback-loop.md), [Architecture](architecture.md), [MVP scope](mvp-scope.md)

## Role In OpenGap

Codex and Claude Code are not just users of OpenGap. They are high-signal feedback producers.

They fit in three ways:

1. As clients that ask OpenGap for current ecosystem docs.
2. As executors that try the suggested code/commands in a real repo.
3. As reporters that send execution results back into the OpenGap loop.

## Workflow

```text
Codex / Claude Code
  |
  | asks via MCP or CLI:
  | "How do I upload a generated artifact to 0G Storage?"
  v
OpenGap Builder Agent
  |
  | returns answer + sources + runnable example
  v
Coding agent applies example in repo
  |
  | runs install/build/test/script
  v
Execution result
  |-- success: mark docs/example as validated
  |-- failure: send error trace back to OpenGap
  v
Gap detector
  |
  v
Generate improved doc/example/skill
```

## Integration Surfaces

### MCP Server

Expose tools such as:

- `opengap.search_docs`
- `opengap.answer_question`
- `opengap.report_execution`
- `opengap.submit_feedback`
- `opengap.generate_artifact`
- `opengap.get_validated_example`

This makes OpenGap easy to use from Claude Code, Codex, Cursor, and other MCP-aware tools.

### CLI

Provide commands such as:

```bash
opengap ask "How do I call 0G Compute from Node?"
opengap report --trace trace.json --status failed --log build.log
opengap generate-example --gap gap_123
```

The CLI is useful when MCP setup is too slow for the hackathon demo.

### Repo-local Artifacts

Coding agents can write:

- `.opengap/trace.json`
- `.opengap/execution.json`
- `.opengap/generated/example.ts`
- `.opengap/generated/docs.md`

These files become structured feedback for OpenGap.

## Demo Use

The clean hackathon demo:

1. Codex or Claude Code attempts a 0G integration in a tiny repo.
2. A command fails because the docs/example are incomplete, unclear, or stale.
3. The coding agent writes `.opengap/trace.json` and `.opengap/execution.json`.
4. OpenGap turns that failure into a gap record.
5. OpenGap uses 0G Compute to reflect/generate/critique a corrected example.
6. The corrected example validates with a deterministic command.
7. The artifact bundle is uploaded to 0G Storage and recorded on 0G Chain.

## Product Claim

OpenGap closes the loop between docs, developers, and coding agents. It learns from machine execution outcomes first, with human feedback as an additional signal.
