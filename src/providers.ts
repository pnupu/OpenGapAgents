import { readFile } from "node:fs/promises";
import path from "node:path";
import { ethers } from "ethers";
import { Artifact, ComputeEvent, Gap, Validation } from "./types.js";
import { id, nowIso, opengapDir, sha256, writeJson } from "./utils.js";

export interface GeneratedExample {
  content: string;
  computeEvent: ComputeEvent;
}

export interface ComputeProvider {
  name: string;
  model: string;
  reflectAndGenerateExample(gap: Gap): Promise<GeneratedExample>;
}

export interface StoredArtifactBundle {
  artifact: Artifact;
  artifactContent: string;
  validation: Validation;
  computeEvent?: ComputeEvent;
}

export interface StorageProvider {
  name: string;
  storeArtifactBundle(bundle: StoredArtifactBundle): Promise<{ storageRoot: string }>;
}

export interface RegistryProvider {
  name: string;
  recordImprovement(input: {
    traceHash: string;
    storageRoot: string;
    contentHash: string;
    artifactType: string;
  }): Promise<{ registryTx: string }>;
}

export class LocalZeroGComputeProvider implements ComputeProvider {
  name = "local-0g-compute-stub";
  model = "mock-qwen3.6-plus";

  async reflectAndGenerateExample(gap: Gap): Promise<GeneratedExample> {
    const content = `import { uploadAgentArtifact } from "../src/mock-0g-storage.js";

async function main() {
  const result = await uploadAgentArtifact({
    name: "validated-0g-example",
    content: "OpenGap generated this example from a failed agent execution."
  });

  if (!result.root.startsWith("0g_local_")) {
    throw new Error("unexpected storage root");
  }

  console.log(result.root);
}

void main();
`;
    const input = JSON.stringify({
      gapId: gap.gapId,
      title: gap.title,
      reason: gap.reason,
      evidence: gap.evidence
    });
    const computeEvent: ComputeEvent = {
      computeEventId: id("compute"),
      provider: this.name,
      model: this.model,
      purpose: "reflect_generate_example",
      inputHash: sha256(input),
      outputHash: sha256(content),
      verification: "local_stub",
      createdAt: nowIso()
    };
    await writeJson(path.join(opengapDir, "compute", `${computeEvent.computeEventId}.json`), computeEvent);
    return { content, computeEvent };
  }
}

export class LocalZeroGStorageProvider implements StorageProvider {
  name = "local-0g-storage-stub";

  async storeArtifactBundle(bundle: StoredArtifactBundle): Promise<{ storageRoot: string }> {
    const bundleHash = sha256(JSON.stringify({ ...bundle, provider: this.name }));
    const storageRoot = `0g_local_${bundleHash.slice(0, 24)}`;
    await writeJson(path.join(opengapDir, "storage", storageRoot, "bundle.json"), {
      ...bundle,
      provider: this.name
    });
    return { storageRoot };
  }
}

export class ZeroGStorageProvider implements StorageProvider {
  name = "0g-storage";

  async storeArtifactBundle(bundle: StoredArtifactBundle): Promise<{ storageRoot: string }> {
    const [{ Indexer, MemData }, { ethers: ethersModule }] = await Promise.all([
      import("@0gfoundation/0g-ts-sdk"),
      import("ethers")
    ]);
    const rpcUrl = process.env.ZERO_G_RPC_URL ?? "https://evmrpc-testnet.0g.ai";
    const indexerRpc = process.env.ZERO_G_STORAGE_INDEXER_RPC ?? "https://indexer-storage-testnet-turbo.0g.ai";
    const provider = new ethersModule.JsonRpcProvider(rpcUrl, 16602);
    const signer = walletFromEnv(provider);
    const indexer = new Indexer(indexerRpc);
    const payload = new TextEncoder().encode(JSON.stringify({ ...bundle, provider: this.name }));
    const memData = new MemData(payload);

    const [, treeErr] = await memData.merkleTree();
    if (treeErr !== null) throw new Error(`0G Storage merkle tree error: ${treeErr}`);

    const [tx, uploadErr] = await indexer.upload(memData, rpcUrl, signer as never);
    if (uploadErr !== null) throw new Error(`0G Storage upload error: ${uploadErr}`);

    if ("rootHash" in tx) {
      await writeJson(path.join(opengapDir, "storage", tx.rootHash, "bundle.json"), {
        ...bundle,
        provider: this.name,
        txHash: tx.txHash
      });
      return { storageRoot: tx.rootHash };
    }

    const rootHash = tx.rootHashes[0];
    await writeJson(path.join(opengapDir, "storage", rootHash, "bundle.json"), {
      ...bundle,
      provider: this.name,
      txHashes: tx.txHashes
    });
    return { storageRoot: rootHash };
  }
}

export class LocalZeroGRegistryProvider implements RegistryProvider {
  name = "local-0g-chain-stub";

  async recordImprovement(input: {
    traceHash: string;
    storageRoot: string;
    contentHash: string;
    artifactType: string;
  }): Promise<{ registryTx: string }> {
    const registryTx = `0g_tx_local_${sha256(`${input.storageRoot}:${input.contentHash}`).slice(0, 24)}`;
    await writeJson(path.join(opengapDir, "registry", `${registryTx}.json`), {
      event: "ImprovementRecorded",
      ...input,
      registryTx,
      createdAt: nowIso(),
      provider: this.name
    });
    return { registryTx };
  }
}

export class EthersZeroGRegistryProvider implements RegistryProvider {
  name = "0g-chain-registry";

  async recordImprovement(input: {
    traceHash: string;
    storageRoot: string;
    contentHash: string;
    artifactType: string;
  }): Promise<{ registryTx: string }> {
    const registryAddress = process.env.OPENGAP_REGISTRY_ADDRESS;
    const rpcUrl = process.env.ZERO_G_RPC_URL ?? "https://evmrpc-testnet.0g.ai";
    if (!registryAddress) throw new Error("OPENGAP_REGISTRY_ADDRESS is required for OPENGAP_REGISTRY_PROVIDER=0g");

    const abi = [
      "function recordImprovement(bytes32 traceHash,string storageRoot,bytes32 contentHash,string artifactType) external"
    ];
    const provider = new ethers.JsonRpcProvider(rpcUrl, 16602);
    const wallet = walletFromEnv(provider);
    const registry = new ethers.Contract(registryAddress, abi, wallet);
    const tx = await registry.recordImprovement(
      toBytes32(input.traceHash),
      input.storageRoot,
      toBytes32(input.contentHash),
      input.artifactType
    );
    const receipt = await tx.wait();
    return { registryTx: receipt?.hash ?? tx.hash };
  }
}

export async function createArtifactBundle(artifact: Artifact, validation: Validation): Promise<StoredArtifactBundle> {
  const computeEvent = artifact.computeEventId
    ? JSON.parse(await readFile(path.join(opengapDir, "compute", `${artifact.computeEventId}.json`), "utf8")) as ComputeEvent
    : undefined;
  return {
    artifact,
    artifactContent: await readFile(path.join(process.cwd(), artifact.path), "utf8"),
    validation,
    computeEvent
  };
}

export function createRegistryProvider(): RegistryProvider {
  return process.env.OPENGAP_REGISTRY_PROVIDER === "0g"
    ? new EthersZeroGRegistryProvider()
    : new LocalZeroGRegistryProvider();
}

export function createStorageProvider(): StorageProvider {
  return process.env.OPENGAP_STORAGE_PROVIDER === "0g"
    ? new ZeroGStorageProvider()
    : new LocalZeroGStorageProvider();
}

function toBytes32(hex: string): string {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (clean.length >= 64) return `0x${clean.slice(0, 64)}`;
  return `0x${clean.padEnd(64, "0")}`;
}

function walletFromEnv(provider: ethers.Provider): ethers.Wallet | ethers.HDNodeWallet {
  const privateKey = process.env.PRIVATE_KEY?.trim();
  const phrase = process.env.WALLET_PHRASE?.trim();
  const expectedAddress = process.env.WALLET_ADDRESS?.trim();
  const wallet = privateKey
    ? new ethers.Wallet(privateKey, provider)
    : phrase
      ? walletFromPhrase(phrase, expectedAddress, provider)
      : undefined;

  if (!wallet) throw new Error("Set PRIVATE_KEY or WALLET_PHRASE for OPENGAP_REGISTRY_PROVIDER=0g");
  if (expectedAddress && wallet.address.toLowerCase() !== expectedAddress.toLowerCase()) {
    throw new Error(`Derived wallet ${wallet.address} does not match WALLET_ADDRESS`);
  }
  return wallet;
}

function walletFromPhrase(
  phrase: string,
  expectedAddress: string | undefined,
  provider: ethers.Provider
): ethers.HDNodeWallet {
  const configuredPath = process.env.WALLET_DERIVATION_PATH?.trim();
  if (configuredPath) return ethers.HDNodeWallet.fromPhrase(phrase, undefined, configuredPath).connect(provider);
  if (!expectedAddress) return ethers.Wallet.fromPhrase(phrase, provider);

  const paths: string[] = [];
  for (let index = 0; index < 25; index += 1) paths.push(`m/44'/60'/0'/0/${index}`);
  for (let account = 0; account < 5; account += 1) paths.push(`m/44'/60'/${account}'/0/0`);

  for (const derivationPath of paths) {
    const candidate = ethers.HDNodeWallet.fromPhrase(phrase, undefined, derivationPath).connect(provider);
    if (candidate.address.toLowerCase() === expectedAddress.toLowerCase()) return candidate;
  }

  return ethers.Wallet.fromPhrase(phrase, provider);
}
