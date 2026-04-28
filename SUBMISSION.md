# ETHGlobal Open Agents Submission Draft

## Project Name

OpenGap Agents

## Short Description

OpenGap is an open framework that turns failed coding-agent executions into validated, reusable SDK examples with 0G-backed provenance.

## Prize Track

0G: Best Agent Framework, Tooling & Core Extensions

## Contract Deployment

- Network: 0G Galileo Testnet
- Registry: `0x59001ae38098a1ba05cc2121554eAa163DF08994`
- Explorer: `https://chainscan-galileo.0g.ai/address/0x59001ae38098a1ba05cc2121554eAa163DF08994`

## Live 0G Proof

- Storage root: `0x264ae742571bdb0896a9af2d0f2d1eacd48b2ba0c0d129c5358b07cf8ad66edc`
- Registry tx: `0x30ff703e0ac441a4ab8674ef308fa87c36e08e86e64926084732880d31692127`

## 0G Features Used

- 0G Storage via `@0gfoundation/0g-ts-sdk` for artifact bundles.
- 0G Chain for improvement commitments.
- Compute provider interface for reflection/generation events; current demo uses a local 0G-shaped provider.

## Working Example Agent

The repo includes a 0G Builder Agent example loop:

```bash
npm run demo
```

It demonstrates:

1. failed coding-agent execution
2. gap detection
3. generated TypeScript example
4. deterministic validation
5. 0G Storage upload
6. 0G Chain registry event
7. future-agent retrieval of the validated artifact

## Setup

```bash
npm install
npm run check
OPENGAP_REGISTRY_PROVIDER=local OPENGAP_STORAGE_PROVIDER=local npm test
npm run demo
```

## Links To Fill

- Public GitHub repo: TODO
- Live demo link: TODO
- Demo video: TODO
- Team members/contact: TODO

