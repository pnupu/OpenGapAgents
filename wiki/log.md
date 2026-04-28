# Wiki Log

## [2026-04-25] ingest | Karpathy LLM Wiki gist

Created source note and concept page for the persistent markdown wiki pattern. Adapted the pattern into this repo via `AGENTS.md`, `wiki/index.md`, and an append-only log.

## [2026-04-25] ingest | 0G docs and ETHGlobal 0G prize context

Created source notes for 0G Developer Hub, Compute, Storage, Chain, DA, and ETHGlobal 0G prize page. Added project thesis, MVP scope, architecture, and 0G integration map.

## [2026-04-25] ingest | Competitive landscape for AI docs agents

Added source notes and competitive landscape for Kapa.ai, Mintlify, Inkeep, DocsHound, GitBook, and DocAgent research. Updated positioning: OpenGap should not claim docs-gap detection is novel; it should emphasize open framework-level tooling, 0G-native memory/provenance, validation, and generated artifacts.

## [2026-04-25] decision | Feedback loop must not depend on explicit developer feedback

Added feedback loop and Codex/Claude Code workflow pages. Decision: explicit developer feedback is optional and high-signal, but the core loop should learn from passive user behavior and coding-agent execution traces.

## [2026-04-25] decision | Narrow OpenGap around execution-verified examples

Reviewed the product idea from judge/product, technical, and competitive perspectives. Updated thesis, MVP scope, architecture, 0G integration, competitive positioning, and prize fit. Decision: the hackathon wedge is not docs gap analytics; it is converting failed coding-agent SDK/API executions into validated examples with 0G-backed provenance.

## [2026-04-26] definition | Failed execution, docs fetching, and outcome change

Defined failed agent execution as an observable task failure with intent, docs/context used, attempted action, expected outcome, and observed failure. Added docs fetching model and outcome-change loop. Decision: OpenGap changes outcomes by updating retrieval priority toward validated artifacts that pass the previously failing case.

## [2026-04-26] build | CLI-first OpenGap MVP scaffold

Implemented TypeScript CLI with `ask`, `report`, `generate-example`, `validate`, `publish`, and `demo` commands. Added core data types, local wiki retriever, deterministic fixture validation, local 0G-shaped Storage/Registry providers, and minimal `OpenGapRegistry.sol`. Verified `npm run demo` produces a passed validation plus local storage root and registry event.

## [2026-04-26] test | CLI loop regression test

Added `tests/cli-loop.test.mjs` and `npm test`. The test builds the CLI, runs the full demo loop from a clean `.opengap` state, and asserts trace, execution, gap, artifact, validation, storage, and registry outputs exist with expected statuses.

## [2026-04-26] build | Compute provider and provenance records

Added explicit `ComputeProvider` abstraction and local 0G-shaped compute provider. `generate-example` now writes `.opengap/compute/*.json` and attaches provider/model metadata to artifacts. `publish` now writes `.opengap/improvements/*.json` provenance records tying trace hash, source snapshot hash, artifact hash, validation hash, storage root, and registry transaction together.

## [2026-04-26] build | 0G Galileo chain deployment path

Added Foundry config for 0G Galileo testnet, `.env.example`, npm scripts for contract build/deploy, and a script for recording an OpenGap improvement against a deployed `OpenGapRegistry`. Official docs checked: Galileo chain ID `16602`, RPC `https://evmrpc-testnet.0g.ai`, explorer `https://chainscan-galileo.0g.ai`, faucet `https://faucet.0g.ai`.

## [2026-04-26] deploy | OpenGapRegistry on 0G Galileo

Deployed `OpenGapRegistry` to 0G Galileo at `0x59001ae38098a1ba05cc2121554eAa163DF08994`. Explorer: `https://chainscan-galileo.0g.ai/address/0x59001ae38098a1ba05cc2121554eAa163DF08994`. Ran the OpenGap demo with `OPENGAP_REGISTRY_PROVIDER=0g`; validation passed and the improvement was recorded onchain in tx `0x913f645478b44aa52106e7d9613f55fccd2a6413d8a334bb6b0ffc49865fe39f`.

## [2026-04-26] deploy | Live 0G Storage + Chain publish

Added live 0G Storage provider using `@0gfoundation/0g-ts-sdk`, `Indexer`, and `MemData`, selected with `OPENGAP_STORAGE_PROVIDER=0g`. Ran the full demo with live 0G Storage and live 0G Chain. Validation passed, artifact bundle uploaded to Storage root `0x7fc93fba9913ecb1062f7920b686e23f969a684150a499eea2189f2fdb5614e7`, and registry event recorded in tx `0x7be692106cf3db20b27301a75ea93fb543d5fedd7c1f695f36950343e2575114`.

## [2026-04-26] build | Validated artifact retrieval

Added `.opengap/validated/<artifactId>/` index and `validated` CLI command. `publish` now indexes validated artifacts, and `ask` can surface validated examples before future agents fall back to raw docs. Live demo with 0G Storage + Chain produced Storage root `0x264ae742571bdb0896a9af2d0f2d1eacd48b2ba0c0d129c5358b07cf8ad66edc`, registry tx `0x30ff703e0ac441a4ab8674ef308fa87c36e08e86e64926084732880d31692127`, and future-agent retrieval returned `artifact_98a16f04`.

## [2026-04-28] build | Submission docs and demo UI

Added `SUBMISSION.md`, `docs/architecture.md`, `examples/README.md`, and a dependency-free local demo UI served by `npm run demo:ui`. The UI reads `.opengap` state and displays the failed execution -> gap -> artifact -> validation -> 0G publish -> future reuse loop. Added generated Foundry/cache outputs to `.gitignore`. Verified typecheck, local CLI regression test, and `/api/state` UI endpoint.
