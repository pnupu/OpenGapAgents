# Failed Agent Execution

Status: active  
Updated: 2026-04-26  
Links: [Feedback loop](feedback-loop.md), [Codex and Claude Code workflow](codex-claude-workflow.md), [MVP scope](mvp-scope.md)

## Definition

A failed agent execution is a coding-agent attempt to complete a developer task using available docs, examples, or generated guidance where the expected outcome is not reached and the failure produces observable evidence.

It is not merely "the answer was bad." It is:

```text
task intent + docs/context used + attempted action + expected outcome + observed failure
```

## MVP Definition

For the hackathon MVP, count an execution as failed when one of these structured events occurs:

- `command_failed`: command exits non-zero.
- `compile_failed`: TypeScript/Solidity/build step fails.
- `test_failed`: deterministic validation test fails.
- `runtime_failed`: SDK/API call throws or returns an error.
- `missing_source`: agent cannot find authoritative docs for the task.
- `unsupported_claim`: answer includes an API/method not present in retrieved sources.

## Non-Failures

Do not count every bad outcome as a docs gap. Some failures are environmental:

- missing API key
- unavailable RPC endpoint
- local dependency cache issue
- network outage
- user typo
- rate limit
- insufficient funds

These should be logged, but classified separately as `environment`, `auth`, `network`, or `user_input`.

## Failure Record

Minimum fields:

- `executionId`
- `traceId`
- `task`
- `docsSourceIds`
- `sourceSnapshotHash`
- `attemptedCommand`
- `expectedOutcome`
- `actualOutcome`
- `exitCode`
- `stderrHash`
- `failureKind`
- `classification`
- `createdAt`

## Gap Conversion Rule

A failed execution becomes a docs/example gap only when the system can say:

> A clearer doc, runnable example, error decoder, or agent skill would likely have prevented or shortened this failure.

If that is not true, store the failure but do not generate a docs artifact.

