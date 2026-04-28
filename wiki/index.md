# OpenGap Agents Wiki Index

Status: active  
Updated: 2026-04-25

This wiki captures the 0G Open Agents hackathon direction: a self-improving developer-agent framework that learns from failed developer interactions, generates missing docs/examples, tests them, and stores/proves the improvements using 0G infrastructure.

## Start Here

- [Project thesis](project/project-thesis.md): product framing and why this should exist.
- [MVP scope](project/mvp-scope.md): what to build for the hackathon.
- [Architecture](project/architecture.md): system components and data flow.
- [0G integration map](project/0g-integration-map.md): how Storage, Compute, Chain, and DA map to the project.
- [Feedback loop](project/feedback-loop.md): passive, explicit, and coding-agent feedback signals.
- [Codex and Claude Code workflow](project/codex-claude-workflow.md): how coding agents fit into OpenGap.
- [Failed agent execution](project/failed-execution-definition.md): what counts as a failure and what does not.
- [Docs fetching](project/docs-fetching.md): how agents obtain versioned, traceable docs context.
- [Outcome change loop](project/outcome-change-loop.md): how failures become validated improvements.
- [Competitive landscape](project/competitive-landscape.md): adjacent products and research.
- [Review findings](project/review-findings.md): flaws found by product, technical, and competitive review.
- [ETHGlobal 0G prize fit](hackathon/ethglobal-0g-prize-fit.md): prize targeting and qualification checklist.

## Concepts

- [LLM wiki pattern](concepts/llm-wiki-pattern.md): Karpathy-inspired persistent markdown knowledge base pattern.
- [Self-improving docs agent](concepts/self-improving-docs-agent.md): detect gaps, generate fixes, validate examples, publish improvements.
- [Framework vs agent distinction](concepts/framework-vs-agent.md): why we target 0G framework/tooling rather than autonomous-agent track.

## 0G

- [0G stack overview](0g/stack-overview.md): Chain, Compute, Storage, DA, and iNFT/Agentic ID context.
- [0G Compute](0g/compute.md): inference services, models, verification, integration implications.
- [0G Storage](0g/storage.md): durable storage for traces, generated artifacts, and memory.
- [0G Chain](0g/chain.md): EVM-compatible registry/proof layer.
- [0G DA](0g/da.md): likely out of MVP unless blob/data-availability proof becomes useful.

## Sources

- [Karpathy LLM Wiki gist](sources/karpathy-llm-wiki.md)
- [0G Developer Hub](sources/0g-developer-hub.md)
- [0G Compute docs](sources/0g-compute-inference.md)
- [0G Storage docs](sources/0g-storage-sdk.md)
- [0G Chain docs](sources/0g-chain-contracts.md)
- [0G DA docs](sources/0g-da.md)
- [ETHGlobal 0G prize page](sources/ethglobal-0g-prize.md)
- [Kapa.ai](sources/kapa-ai.md)
- [Mintlify AI docs agent](sources/mintlify-ai-docs-agent.md)
- [Inkeep docs agents](sources/inkeep-docs-agents.md)
- [DocsHound gap analysis](sources/docshound-gap-analysis.md)
- [GitBook AI docs insights](sources/gitbook-ai-docs.md)
- [DocAgent research](sources/docagent-research.md)

## Operations

- [Wiki maintenance workflow](operations/wiki-maintenance.md)
- [Source ingestion checklist](operations/source-ingestion-checklist.md)
- [Hackathon submission checklist](hackathon/submission-checklist.md)
