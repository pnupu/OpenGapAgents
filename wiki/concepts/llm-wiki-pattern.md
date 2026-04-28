# LLM Wiki Pattern

Status: active  
Updated: 2026-04-25  
Links: [Karpathy gist source](../sources/karpathy-llm-wiki.md), [Self-improving docs agent](self-improving-docs-agent.md)

## Summary

The LLM wiki pattern is a persistent knowledge-base workflow where an agent maintains a structured markdown wiki from source material. The wiki becomes a compounding synthesis layer: each source and useful query can update the persistent artifact.

## Layers

- Raw sources: immutable documents, URLs, specs, transcripts, examples, and source snippets.
- Wiki: generated markdown pages with summaries, entities, concepts, comparisons, and project decisions.
- Schema: operating instructions that tell the agent how to ingest, query, lint, and update the wiki.

## Why It Matters For OpenGap

Most developer-support bots answer a question and discard the learning. OpenGap should do the opposite: every failed or weak support interaction should update an ecosystem-maintained knowledge layer.

For the hackathon, this means our agent framework should demonstrate that:

- support interactions are durable signals
- missing examples can be generated from repeated pain points
- generated docs/examples can become first-class artifacts
- the knowledge layer can be stored and verified with 0G

