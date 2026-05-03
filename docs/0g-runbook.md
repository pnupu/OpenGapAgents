# 0G Runbook

This project supports local providers for repeatable tests and live 0G providers for hackathon proof.

## Local Mode

Use local mode for CI, tests, and development:

```bash
OPENGAP_REGISTRY_PROVIDER=local OPENGAP_STORAGE_PROVIDER=local npm test
```

Local mode writes 0G-shaped storage roots and registry events under `.opengap/`.

## Live Galileo Mode

Required `.env` values:

```bash
ZERO_G_RPC_URL=https://evmrpc-testnet.0g.ai
ZERO_G_CHAIN_ID=16602
ZERO_G_STORAGE_INDEXER_RPC=https://indexer-storage-testnet-turbo.0g.ai
OPENGAP_REGISTRY_ADDRESS=0x59001ae38098a1ba05cc2121554eAa163DF08994
OPENGAP_REGISTRY_PROVIDER=0g
OPENGAP_STORAGE_PROVIDER=0g
```

Set either `PRIVATE_KEY` or `WALLET_PHRASE`. If using a phrase, set `WALLET_ADDRESS` as a safety check.

## Deploy Registry

```bash
npm run chain:deploy:0g
```

## Run Live Demo

```bash
npm run build
node dist/cli.js demo
```

The live path uploads artifact bundles to 0G Storage and records the resulting storage root on 0G Galileo through `OpenGapRegistry`.

