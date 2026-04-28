# ETHGlobal 0G Prize Fit

Status: active  
Updated: 2026-04-25  
Links: [ETHGlobal 0G source](../sources/ethglobal-0g-prize.md), [Framework vs agent](../concepts/framework-vs-agent.md)

## Target Track

Best Agent Framework, Tooling & Core Extensions.

## Why OpenGap Fits

OpenGap is framework-level tooling, not just one agent:

- reusable reflection + memory + validation module for OpenClaw-style agents
- reusable docs-agent architecture
- persistent memory and trace format
- failure detection and reflection loop
- generated docs/examples pipeline
- 0G Storage-backed artifact memory
- 0G Compute-backed generation/review
- 0G Chain registry/proof
- example 0G Builder Agent built on top

## Judge-Facing Claim

OpenGap advances how agents are created in 2026 by making agent failures productive. Every failed SDK/API execution trace can become a validated example, docs patch, FAQ entry, or reusable skill with provenance on 0G.

## Avoid This Failure Mode

Do not demo only a chatbot. The demo must show the framework loop and the reusable primitives other builders would use.

## Demo Opening

Open with the lifecycle, not the chatbot:

```text
trace -> gap -> generated artifact -> validation -> 0G Storage -> 0G Chain event
```

Then show that a docs/chat agent or coding agent is only one client of the framework.
