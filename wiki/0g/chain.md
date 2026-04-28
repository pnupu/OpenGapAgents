# 0G Chain

Status: active  
Updated: 2026-04-25  
Links: [0G Chain source](../sources/0g-chain-contracts.md), [Architecture](../project/architecture.md)

## What It Does

0G Chain is an EVM-compatible blockchain. Solidity contracts can be deployed with familiar Ethereum tooling.

## OpenGap Role

The chain should not carry large content. It should record commitments:

- framework deployment metadata
- agent registration
- generated artifact hash
- 0G Storage root
- trace ID
- timestamped improvement events

## Minimal Demo Contract

The MVP only needs a small registry contract. The demo should show at least one deployed contract address and one recorded improvement event.

