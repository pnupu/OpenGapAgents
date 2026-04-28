# Wiki Operating Rules

This repo follows the LLM-maintained wiki pattern described by Andrej Karpathy's `llm-wiki` gist:

- Raw sources are immutable references.
- The wiki is synthesized markdown maintained by the agent.
- The index is the first navigation surface.
- The log is append-only.
- New sources should update every affected concept, project, and source page.

## Directory Map

- `wiki/index.md`: content-oriented catalog of wiki pages.
- `wiki/log.md`: chronological record of source ingestion, queries, and decisions.
- `wiki/sources/`: source notes and citations.
- `wiki/concepts/`: reusable ideas and abstractions.
- `wiki/0g/`: 0G protocol/component notes.
- `wiki/project/`: OpenGap product decisions, architecture, MVP.
- `wiki/hackathon/`: ETHGlobal prize and submission context.
- `wiki/operations/`: workflows for maintaining and extending the wiki.

## Page Conventions

Each substantive page should include:

- `Status`: `draft`, `active`, or `superseded`.
- `Updated`: ISO date.
- `Links`: relevant internal wiki links.
- `Sources`: external URLs or source-note pages.

Use wiki links as plain markdown links. Keep claims grounded in a source page or a linked source URL.

## Ingest Workflow

1. Read the new source.
2. Create or update a page under `wiki/sources/`.
3. Update affected concept/project pages.
4. Update `wiki/index.md`.
5. Append an entry to `wiki/log.md`.

## Query Workflow

1. Read `wiki/index.md`.
2. Open the relevant pages.
3. Answer from the wiki first, then from external sources if needed.
4. If the answer adds durable insight, file it back into the wiki.

## Lint Workflow

Periodically check for:

- stale prize assumptions
- uncited protocol claims
- orphan pages
- missing cross-links
- unresolved product decisions
- claims that depend on changing docs, prices, models, chain IDs, or SDK APIs

