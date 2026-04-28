# Self-Improving Docs Agent

Status: active  
Updated: 2026-04-25  
Links: [Project thesis](../project/project-thesis.md), [Architecture](../project/architecture.md), [0G integration map](../project/0g-integration-map.md)

## Definition

A self-improving docs agent is a developer-support agent that does not stop at answering questions. It records where the docs fail, generates missing documentation or examples, validates the output, and makes the improvement available to future users.

## Core Loop

1. A developer asks a question.
2. The agent retrieves relevant docs and answers with sources.
3. The framework scores the interaction for confidence, missing citations, repeated follow-ups, user corrections, command failures, or unresolved tasks.
4. A reflection step identifies what artifact would have prevented the failure.
5. The generator creates a doc patch, FAQ entry, snippet, runnable example, or tutorial.
6. Validation checks the generated artifact where possible.
7. The artifact is stored, indexed, and surfaced in the agent's future answers.

## Artifact Types

- Markdown doc patch
- FAQ entry
- Error decoder entry
- TypeScript example
- CLI recipe
- Minimal working repo
- Architecture diagram source
- Test case for an SDK integration

## Why This Is Better Than A Report

A gap report says where the ecosystem hurts. A self-improving agent produces the fix. The report still exists, but it becomes an audit trail around generated improvements rather than the final deliverable.

