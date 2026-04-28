import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ethers } from "ethers";
import { walletFromEnv } from "./wallet.mjs";

const root = process.cwd();
const rpcUrl = process.env.ZERO_G_RPC_URL ?? "https://evmrpc-testnet.0g.ai";
const registryAddress = process.env.OPENGAP_REGISTRY_ADDRESS;

if (!registryAddress) throw new Error("OPENGAP_REGISTRY_ADDRESS is required");

const improvementRef = process.argv[2];
if (!improvementRef) throw new Error("Usage: node scripts/record-improvement.mjs <improvement-json-path>");

const improvement = JSON.parse(await readFile(path.resolve(root, improvementRef), "utf8"));
const abi = [
  "function recordImprovement(bytes32 traceHash,string storageRoot,bytes32 contentHash,string artifactType) external",
  "event ImprovementRecorded(bytes32 indexed traceHash,string storageRoot,bytes32 indexed contentHash,string artifactType,address indexed recorder)"
];

const provider = new ethers.JsonRpcProvider(rpcUrl, 16602);
const wallet = walletFromEnv(provider);
const registry = new ethers.Contract(registryAddress, abi, wallet);

const traceHash = toBytes32(improvement.traceHash);
const contentHash = toBytes32(improvement.generatedArtifactHash);
const artifactType = improvement.artifactType ?? "example";

const tx = await registry.recordImprovement(traceHash, improvement.storageRoot, contentHash, artifactType);
console.log(`submitted: ${tx.hash}`);
const receipt = await tx.wait();
console.log(`confirmed: ${receipt.hash}`);

function toBytes32(hex) {
  const clean = String(hex).startsWith("0x") ? String(hex).slice(2) : String(hex);
  if (clean.length >= 64) return `0x${clean.slice(0, 64)}`;
  return `0x${clean.padEnd(64, "0")}`;
}
