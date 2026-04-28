# Source: 0G Chain Contract Deployment Docs

Status: active  
Updated: 2026-04-25  
Source URL: https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts

## Key Points

0G Chain is EVM-compatible and can use normal Ethereum tooling such as Hardhat, Foundry, Remix, ethers.js, and web3.js. The docs list Galileo testnet with chain ID `16602` and RPC `https://evmrpc-testnet.0g.ai`.

The deployment docs recommend compiling with Cancun-compatible EVM settings for modern Solidity tooling.

## Relevance To OpenGap

Use 0G Chain for a small registry contract:

- register an agent framework deployment
- record generated artifact hashes
- record 0G Storage roots
- emit events for improvement proposals

## Minimal Contract Idea

`OpenGapRegistry`:

- `registerAgent(string name, string metadataRoot)`
- `recordImprovement(bytes32 traceId, string artifactRoot, string artifactType, bytes32 contentHash)`
- event `ImprovementRecorded(...)`

