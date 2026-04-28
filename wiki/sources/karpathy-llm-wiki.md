# Source: Karpathy LLM Wiki Gist

Status: active  
Updated: 2026-04-25  
Source URL: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f  
Raw gist URL: https://gist.githubusercontent.com/karpathy/442a6bf555914893e9891c11519de94f/raw/llm-wiki.md

## What It Contributes

Karpathy's gist describes a pattern for building an LLM-maintained markdown wiki. The important distinction is that the LLM does not merely retrieve raw chunks at query time. It gradually maintains a durable, interlinked synthesis layer between the user and the raw sources.

## Core Takeaways

- A wiki should compound knowledge over time instead of forcing the model to rediscover context on every question.
- Raw sources stay immutable; generated wiki pages are maintained and updated.
- A schema/instructions file tells the agent how to operate as a disciplined wiki maintainer.
- `index.md` is the content map.
- `log.md` is the chronological history.
- Good query results should be filed back into the wiki when they become durable knowledge.
- Periodic linting keeps the wiki healthy by finding contradictions, stale pages, orphan concepts, and missing cross-links.

## Adaptation For This Repo

This repo uses the gist's pattern as the operating model for the 0G hackathon research wiki:

- `AGENTS.md` is the schema.
- `wiki/index.md` is the content map.
- `wiki/log.md` is append-only history.
- `wiki/sources/` contains source notes.
- `wiki/project/` contains evolving product decisions.

## Relevance To OpenGap Agents

The gist is not only a note-taking pattern. It is also the conceptual basis for the project:

> Developer-support agents should not just answer questions. They should maintain a living knowledge base, notice where the knowledge base fails, and generate improvements.

That maps directly to the OpenGap loop:

1. Answer from docs.
2. Detect low-confidence or failed interactions.
3. Generate missing documentation or examples.
4. Validate the generated artifact.
5. Store and prove the improvement using 0G.

