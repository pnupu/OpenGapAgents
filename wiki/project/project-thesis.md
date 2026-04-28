# Project Thesis

Status: active  
Updated: 2026-04-25  
Links: [Self-improving docs agent](../concepts/self-improving-docs-agent.md), [ETHGlobal prize fit](../hackathon/ethglobal-0g-prize-fit.md)

## Working Name

OpenGap Agents

## One-Liner

OpenGap is an open framework that turns failed coding-agent executions into validated, reusable SDK examples with 0G-backed provenance.

## Problem

Developer ecosystems increasingly deploy AI docs agents, but most of those agents are disposable Q&A layers. When a coding agent tries to use the docs and fails, the ecosystem rarely captures the execution trace, error, generated workaround, or validation result. The same missing runnable example keeps blocking future developers and future agents.

## Product

OpenGap turns coding-agent failures into a self-improving documentation loop:

- capture failed SDK/API execution traces
- identify the missing doc, example, or agent skill
- generate a runnable artifact
- validate the artifact with a deterministic command
- store trace, artifact, and validation evidence on 0G
- register the improvement commitment onchain

## Why 0G

The product naturally maps to 0G's stack:

- 0G Compute: reflection, generation, review, and evaluation in the actual loop.
- 0G Storage: persistent memory, traces, generated artifacts.
- 0G Chain: public registry/proof of improvements.

## Hackathon Demo Story

A coding agent attempts a 0G SDK task and fails. OpenGap records the execution trace, uses 0G Compute to reflect on the missing example, generates a TypeScript example, validates it in a fixture repo, uploads the artifact bundle to 0G Storage, and records the improvement commitment on 0G Chain. Future agents can retrieve the validated example instead of rediscovering the failure.

## Subtitle

OpenGap: a 0G memory, reflection, and validation layer for self-improving developer agents.
