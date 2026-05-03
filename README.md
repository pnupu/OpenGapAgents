# OpenGap Agents

OpenGap is an open framework that turns failed coding-agent executions into validated, reusable SDK examples with 0G-backed provenance.

The current build is a CLI-first hackathon MVP. It proves one vertical loop:

```text
failed agent execution -> trace -> gap -> generated example -> validation -> storage root -> registry event
```

Future agents then retrieve the validated artifact before falling back to raw docs.

## Architecture

See [docs/architecture.md](docs/architecture.md).

## Run The Demo

```bash
npm install
npm run demo
```

Open the local demo UI after a demo run:

```bash
npm run demo:ui
```

Then visit `http://localhost:4173`.

## Test

```bash
npm run check
npm test
```

The demo creates:

- `.opengap/traces/*.json`
- `.opengap/executions/*.json`
- `.opengap/gaps/*.json`
- `.opengap/compute/*.json`
- `.opengap/artifacts/*.json`
- `.opengap/validations/*.json`
- `.opengap/improvements/*.json`
- `.opengap/storage/<root>/bundle.json`
- `.opengap/registry/<tx>.json`
- `examples/fixture/generated/example.ts`

## CLI

```bash
npm run build
node dist/cli.js ask "How do I upload an agent artifact to 0G Storage?"
node dist/cli.js report --trace <traceId> --stderr "Property uploadFileTo0G does not exist"
node dist/cli.js generate-example --gap <gapId>
node dist/cli.js validate --artifact <artifactId>
node dist/cli.js publish --artifact <artifactId>
node dist/cli.js validated "upload generated agent artifact to 0G Storage from TypeScript"
```

## Framework Primitives

- `Trace`: what the agent asked and which docs it used.
- `Execution`: what command/action failed.
- `Gap`: why the failure likely indicates a missing doc/example/skill.
- `ComputeEvent`: model/provider metadata for reflection and generation.
- `Artifact`: the generated fix.
- `Validation`: deterministic proof that the artifact works.
- `ImprovementRecord`: provenance record tying trace, source snapshot, artifact, validation, storage, and registry together.
- `ValidatedArtifactIndex`: retrieval index future agents use before falling back to raw docs.
- `StorageProvider`: adapter for 0G Storage.
- `RegistryProvider`: adapter for 0G Chain.

The default Compute, Storage, and Registry providers are local 0G-shaped stubs. Live 0G SDK integration can replace them without changing the core loop.

## Wiki

Start here for product context:

- [Wiki index](wiki/index.md)
- [Project thesis](wiki/project/project-thesis.md)
- [0G integration map](wiki/project/0g-integration-map.md)
- [ETHGlobal prize fit](wiki/hackathon/ethglobal-0g-prize-fit.md)
- [Wiki operating rules](AGENTS.md)
- [Architecture](docs/architecture.md)
- [0G runbook](docs/0g-runbook.md)
- [Demo script](docs/demo-script.md)
- [Example agent](examples/README.md)
- [Submission draft](SUBMISSION.md)

## Contract

The minimal 0G Chain commitment contract is in [contracts/OpenGapRegistry.sol](contracts/OpenGapRegistry.sol).

Current Galileo deployment:

- Registry: `0x59001ae38098a1ba05cc2121554eAa163DF08994`
- Explorer: `https://chainscan-galileo.0g.ai/address/0x59001ae38098a1ba05cc2121554eAa163DF08994`
- First live demo tx: `0x913f645478b44aa52106e7d9613f55fccd2a6413d8a334bb6b0ffc49865fe39f`
- First live Storage + Chain demo:
  - Storage root: `0x7fc93fba9913ecb1062f7920b686e23f969a684150a499eea2189f2fdb5614e7`
  - Registry tx: `0x7be692106cf3db20b27301a75ea93fb543d5fedd7c1f695f36950343e2575114`
- Live changed-outcome demo:
  - Storage root: `0x264ae742571bdb0896a9af2d0f2d1eacd48b2ba0c0d129c5358b07cf8ad66edc`
  - Registry tx: `0x30ff703e0ac441a4ab8674ef308fa87c36e08e86e64926084732880d31692127`
  - Retrieved validated artifact: `artifact_98a16f04`

## 0G Galileo Testnet

Current official testnet settings:

- Network: `0G-Galileo-Testnet`
- Chain ID: `16602`
- RPC: `https://evmrpc-testnet.0g.ai`
- Explorer: `https://chainscan-galileo.0g.ai`
- Faucet: `https://faucet.0g.ai`

Deploy the registry:

```bash
cp .env.example .env
# fill PRIVATE_KEY with a funded testnet wallet
npm run chain:build
npm run chain:deploy:0g
```

After deployment, set `OPENGAP_REGISTRY_ADDRESS` in `.env`.

Record an improvement from a generated local provenance file:

```bash
npm run chain:record -- .opengap/improvements/<record>.json
```

Or make `opengap publish` write the registry event directly to 0G Chain:

```bash
OPENGAP_REGISTRY_PROVIDER=0g node dist/cli.js publish --artifact <artifactId>
```

Required `.env` values:

- `PRIVATE_KEY` or `WALLET_PHRASE`: funded Galileo wallet
- `WALLET_ADDRESS`: optional safety check; deploy fails if the derived wallet differs
- `WALLET_DERIVATION_PATH`: optional explicit derivation path; otherwise common Ethereum paths are scanned
- `OPENGAP_REGISTRY_ADDRESS`: deployed `OpenGapRegistry`
- `ZERO_G_RPC_URL`: defaults to `https://evmrpc-testnet.0g.ai`

Live Compute is still an adapter target. The current implementation supports local 0G-shaped Compute, live 0G Storage when `OPENGAP_STORAGE_PROVIDER=0g`, and live 0G Chain when `OPENGAP_REGISTRY_PROVIDER=0g`.

To also upload artifact bundles to 0G Storage, set:

```bash
OPENGAP_STORAGE_PROVIDER=0g
ZERO_G_STORAGE_INDEXER_RPC=https://indexer-storage-testnet-turbo.0g.ai
```

The Storage SDK currently pulls a vulnerable transitive `axios` through `open-jsonrpc-provider` with no upstream fix available. Keep live Storage as an opt-in hackathon path until the upstream dependency is patched.
