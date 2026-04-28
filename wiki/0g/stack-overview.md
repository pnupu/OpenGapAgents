# 0G Stack Overview

Status: active  
Updated: 2026-04-25  
Links: [0G Developer Hub source](../sources/0g-developer-hub.md), [0G integration map](../project/0g-integration-map.md)

## Summary

0G is a full-stack AI blockchain platform. For the hackathon, the practical pieces are Chain, Compute, Storage, and DA.

## Components

- Chain: EVM-compatible execution layer for contracts and registries.
- Compute: decentralized inference/training marketplace with model providers and optional verification.
- Storage: decentralized storage for large files, artifacts, traces, and memory.
- DA: scalable data availability for blobs and rollup/appchain data.

## OpenGap Usage

The project should primarily use Compute, Storage, and Chain:

- Compute powers answer generation, reflection, and documentation generation.
- Storage persists traces and generated artifacts.
- Chain records provenance and makes generated improvements externally verifiable.
- DA stays optional.

