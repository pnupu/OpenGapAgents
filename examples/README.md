# Example Agent

The included example is the **0G Builder Agent** loop.

It simulates a coding agent attempting to use 0G docs to upload a generated artifact. The first attempt fails because the agent used a non-existent SDK method. OpenGap records that failure, generates a corrected TypeScript example, validates the example, publishes the artifact bundle to 0G Storage, records the improvement on 0G Chain, and indexes the validated example for future agents.

Run locally:

```bash
npm run demo
```

Use local providers for deterministic tests:

```bash
OPENGAP_REGISTRY_PROVIDER=local OPENGAP_STORAGE_PROVIDER=local npm test
```

Retrieve the validated example after a demo run:

```bash
node dist/cli.js validated "upload generated agent artifact to 0G Storage from TypeScript"
```

Generated example path:

```text
examples/fixture/generated/example.ts
```

