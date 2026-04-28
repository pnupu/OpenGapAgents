# 0G Compute

Status: active  
Updated: 2026-04-25  
Links: [0G Compute source](../sources/0g-compute-inference.md), [0G integration map](../project/0g-integration-map.md)

## What It Does

0G Compute lets applications request AI inference from decentralized providers. For developers, it exposes CLI and SDK flows that retrieve provider metadata, generate request headers, call model endpoints, and optionally verify responses.

## OpenGap Roles

- `answerer`: answer developer questions using docs context.
- `reflector`: decide whether the answer exposed a documentation gap.
- `generator`: create missing docs/examples.
- `critic`: review generated artifacts for correctness, specificity, and completeness.
- `clusterer`: group repeated gaps into durable issues.

## Demo Requirement

Show at least one 0G Compute call or a clean adapter interface that can swap between mocked/local generation and live 0G Compute. If live compute is available, show provider/model metadata and verification status.

