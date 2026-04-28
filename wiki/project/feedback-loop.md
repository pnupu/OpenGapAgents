# Feedback Loop

Status: active  
Updated: 2026-04-25  
Links: [Architecture](architecture.md), [Codex and Claude Code workflow](codex-claude-workflow.md), [Self-improving docs agent](../concepts/self-improving-docs-agent.md)

## Decision

OpenGap should not depend on developers manually giving feedback. Explicit feedback is useful, but sparse. The core loop should learn from passive behavior and coding-agent execution traces.

## Signal Types

### Passive Human Signals

These require no explicit feedback button:

- repeated query on the same topic
- immediate follow-up after an answer
- query reformulation after an answer
- user opens sources but returns to ask again
- user copies code but later asks about an error
- long session with no accepted artifact
- high retrieval ambiguity
- answer lacked direct source citation

### Explicit Human Signals

These are high-quality but optional:

- thumbs up/down
- "solved it" or "still stuck"
- free-text correction
- selected failure reason: outdated, missing example, wrong API, unclear, incomplete
- accepted generated doc/example

### Coding-Agent Signals

These are the most valuable for developer tooling:

- command failed after following docs
- install/build/test failed
- TypeScript or Solidity compile error
- SDK call failed at runtime
- agent had to search outside the provided docs
- agent generated its own workaround
- agent retried with a different API version
- agent abandoned the docs route
- validation succeeded after generated docs/example patch

## Gap Scoring

Gap score should combine:

- frequency: how often the issue appears
- recency: whether it is happening now
- severity: whether it blocks setup/deployment
- agent reproducibility: whether a coding agent can reproduce the failure
- confidence: whether retrieved docs were weak or contradictory
- artifact potential: whether a generated example/doc patch can fix it

## Why This Matters

Developer feedback buttons are too weak as the primary input. The strongest product signal is behavioral:

> Did a developer or coding agent successfully complete the task after reading the docs?

OpenGap should measure that through traces, validation, and agent execution outcomes.

