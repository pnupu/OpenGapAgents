#!/usr/bin/env node
import "dotenv/config";
import { ask, generateExample, getValidatedExamples, publishArtifact, reportFailure, validateArtifact } from "./core.js";
import { ensureFixture } from "./fixture.js";

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === "help") {
    printHelp();
    return;
  }

  if (command === "ask") {
    const trace = await ask(args.join(" "));
    console.log(JSON.stringify(trace, null, 2));
    return;
  }

  if (command === "report") {
    const trace = requiredArg(args, "--trace");
    const result = await reportFailure(trace, {
      task: valueArg(args, "--task", "Complete a 0G SDK integration"),
      command: valueArg(args, "--command", "npx tsc -p examples/fixture/tsconfig.json --noEmit"),
      expected: valueArg(args, "--expected", "TypeScript example compiles"),
      actual: valueArg(args, "--actual", "Compilation failed"),
      exitCode: Number(valueArg(args, "--exit-code", "1")),
      stderr: valueArg(args, "--stderr", "TypeScript compilation failed")
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === "generate-example") {
    const gap = requiredArg(args, "--gap");
    console.log(JSON.stringify(await generateExample(gap), null, 2));
    return;
  }

  if (command === "validate") {
    await ensureFixture();
    const artifact = requiredArg(args, "--artifact");
    console.log(JSON.stringify(await validateArtifact(artifact), null, 2));
    return;
  }

  if (command === "publish") {
    const artifact = requiredArg(args, "--artifact");
    console.log(JSON.stringify(await publishArtifact(artifact), null, 2));
    return;
  }

  if (command === "validated") {
    const matches = await getValidatedExamples(args.join(" "));
    console.log(JSON.stringify(matches, null, 2));
    return;
  }

  if (command === "demo") {
    await runDemo();
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

async function runDemo(): Promise<void> {
  await ensureFixture();
  console.log("1. ask");
  const trace = await ask("How do I upload a generated agent artifact to 0G Storage from TypeScript?");
  console.log(`trace: ${trace.traceId}`);

  console.log("2. report failed coding-agent execution");
  const { execution, gap } = await reportFailure(trace.traceId, {
    task: "Upload a generated agent artifact to 0G Storage from TypeScript",
    command: "npx tsc -p examples/fixture/tsconfig.json --noEmit",
    expected: "TypeScript example compiles",
    actual: "The attempted example called a method that does not exist in the fixture SDK.",
    exitCode: 2,
    stderr: "Property 'uploadFileTo0G' does not exist on type 'MockZeroGStorageClient'."
  });
  console.log(`execution: ${execution.executionId}`);
  console.log(`gap: ${gap.gapId}`);

  console.log("3. generate corrected example");
  const artifact = await generateExample(gap.gapId);
  console.log(`artifact: ${artifact.artifactId} -> ${artifact.path}`);

  console.log("4. validate generated example");
  const validated = await validateArtifact(artifact.artifactId);
  console.log(`validation: ${validated.validation.validationId} (${validated.validation.status})`);

  console.log("5. publish artifact bundle");
  const published = await publishArtifact(artifact.artifactId);
  console.log(`storageRoot: ${published.storageRoot}`);
  console.log(`registryTx: ${published.chainTxHash}`);

  console.log("6. future agent retrieves validated example");
  const matches = await getValidatedExamples("upload generated agent artifact to 0G Storage from TypeScript");
  console.log(`validatedExamples: ${matches.map((match) => match.entry.artifactId).join(", ")}`);
}

function requiredArg(args: string[], name: string): string {
  const value = valueArg(args, name, "");
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function valueArg(args: string[], name: string, fallback: string): string {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function printHelp(): void {
  console.log(`OpenGap CLI

Commands:
  ask <question>
  report --trace <traceId> [--task ... --command ... --expected ... --actual ... --exit-code ... --stderr ...]
  generate-example --gap <gapId>
  validate --artifact <artifactId>
  publish --artifact <artifactId>
  validated <query>
  demo
`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
