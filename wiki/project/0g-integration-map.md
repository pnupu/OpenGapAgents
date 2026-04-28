# 0G Integration Map

Status: active  
Updated: 2026-04-25  
Links: [0G stack overview](../0g/stack-overview.md), [Architecture](architecture.md)

## Integration Priority

| 0G Component | MVP Use | Why It Matters |
|---|---|---|
| 0G Compute | answer, reflect, generate, critique | Shows decentralized AI inference in the actual agent loop |
| 0G Storage | traces, generated docs/examples, validation reports | Makes agent memory and improvements persistent |
| 0G Chain | registry and proof commitments | Provides deployment address and visible onchain proof |
| 0G DA | optional/future | Useful later for large trace batches or appchain-style availability |

## Minimal Proof Points

- A generated artifact uploaded to 0G Storage.
- A chain transaction recording the artifact hash/root.
- A visible 0G Compute reflection/generation/review step with provider/model metadata when available.
- A demo screen showing the trace -> gap -> artifact lifecycle.

## Fallback Strategy

Because hackathon infra can be unstable, implement adapters:

- `ComputeProvider`: live 0G Compute or mock/local provider.
- `StorageProvider`: live 0G Storage or local file adapter.
- `RegistryProvider`: 0G Chain contract or dry-run event log.

The demo should prefer live 0G, but the framework should remain runnable without credentials.

## Current Implementation Status

- Compute: local 0G-shaped provider, writes compute events with provider/model metadata.
- Storage: live 0G Storage provider is implemented behind `OPENGAP_STORAGE_PROVIDER=0g`; local provider remains available for tests.
- Chain: live 0G Galileo registry provider is implemented behind `OPENGAP_REGISTRY_PROVIDER=0g`; local provider remains the default for tests.
- Contract: `OpenGapRegistry` compiles with Foundry using Cancun EVM settings.

## Demo Rule

0G should be visibly in-path:

- `0G Compute`: reflect/generate/critique
- `0G Storage`: store artifact bundle
- `0G Chain`: commit artifact record

Avoid making 0G look like a storage upload tacked onto a normal docs bot.
