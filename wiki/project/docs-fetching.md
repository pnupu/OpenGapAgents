# Docs Fetching

Status: active  
Updated: 2026-04-26  
Links: [Architecture](architecture.md), [MVP scope](mvp-scope.md), [Failed agent execution](failed-execution-definition.md)

## Principle

Agents should fetch docs through OpenGap, not by independently scraping the web during every task. OpenGap provides versioned, source-linked context and records what the agent actually used.

## Source Registry

Each ecosystem plugin defines:

- docs URLs
- GitHub docs repo, if available
- `llms.txt` or `llms-full.txt`, if available
- sitemap URL, if available
- SDK package names
- canonical examples
- known error-code pages

## Ingestion Flow

```text
source registry
  -> fetch raw docs
  -> normalize markdown/html
  -> split into source documents
  -> hash source snapshots
  -> index for keyword/vector retrieval
  -> expose through CLI/MCP tools
```

## Runtime Retrieval

When a coding agent asks for help:

1. OpenGap receives the task/query.
2. Retriever runs hybrid search over the indexed docs and validated artifacts.
3. OpenGap returns source-linked context, not anonymous chunks.
4. The trace records `sourceIds` and `sourceSnapshotHash`.
5. The agent applies the guidance.
6. The outcome is reported back as execution telemetry.

## Retrieval Priority

Future agents should receive context in this order:

1. validated OpenGap artifacts for the exact task/version
2. official docs source snapshots
3. canonical examples
4. unresolved generated drafts
5. web fallback only when configured

## MVP

For the hackathon, use a local docs/wiki index first. Add 0G docs source snapshots and generated artifacts. The important part is traceability: every answer should know which sources or artifacts it used.

