# Framework Vs Agent

Status: active  
Updated: 2026-04-25  
Links: [ETHGlobal 0G prize fit](../hackathon/ethglobal-0g-prize-fit.md), [MVP scope](../project/mvp-scope.md)

## Decision

Target the 0G "Best Agent Framework, Tooling & Core Extensions" track rather than the autonomous-agent track.

## Reasoning

OpenGap is primarily infrastructure for building better developer-support agents:

- plugin architecture for ecosystem docs
- memory and trace storage layer
- failure detection and reflection loop
- generated docs/examples pipeline
- validation and publication flow
- example agent built with the framework

The required demo agent should be the proof that the framework works, not the entire product.

## Risk

If the demo only looks like a 0G docs chatbot, it will read as an autonomous agent rather than framework-level tooling. The demo needs to show reusable primitives: plugin config, trace schema, generator pipeline, storage adapter, and example output.

