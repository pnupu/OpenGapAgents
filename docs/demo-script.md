# Demo Script

Target length: 2-4 minutes.

## Flow

1. Open with the problem: coding agents repeat the same SDK and docs failures.
2. Show OpenGap's loop: failed execution -> trace -> gap -> generated example -> validation -> 0G Storage -> 0G Chain -> future reuse.
3. Run or show `npm run demo`.
4. Point out the generated files under `.opengap/`.
5. Show the 0G Storage root and 0G Galileo registry transaction.
6. Show `validated` retrieval proving future agents get the validated example first.

## Commands

```bash
npm install
npm run demo
npm run demo:ui
```

For deterministic local testing without spending testnet tokens:

```bash
OPENGAP_REGISTRY_PROVIDER=local OPENGAP_STORAGE_PROVIDER=local npm test
```

## Live Proof

- Registry: `0x59001ae38098a1ba05cc2121554eAa163DF08994`
- Storage root: `0x264ae742571bdb0896a9af2d0f2d1eacd48b2ba0c0d129c5358b07cf8ad66edc`
- Registry tx: `0x30ff703e0ac441a4ab8674ef308fa87c36e08e86e64926084732880d31692127`

