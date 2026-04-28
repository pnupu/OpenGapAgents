# 0G Storage

Status: active  
Updated: 2026-04-25  
Links: [0G Storage source](../sources/0g-storage-sdk.md), [0G integration map](../project/0g-integration-map.md)

## What It Does

0G Storage stores and retrieves files through a decentralized storage network. Files can be identified by Merkle roots and downloaded with proof verification.

## OpenGap Roles

- Store interaction traces.
- Store generated docs/examples.
- Store validation outputs.
- Store wiki snapshots or gap reports.
- Store plugin memory for each ecosystem agent.

## MVP Storage Objects

- `trace.json`: developer question, retrieved docs, answer, confidence, feedback.
- `gap.json`: derived gap, reason, severity, repeated count.
- `artifact.md` or `example.ts`: generated fix.
- `validation.json`: lint/test/review status.

