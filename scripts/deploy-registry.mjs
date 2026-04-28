import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ethers } from "ethers";
import { walletFromEnv } from "./wallet.mjs";

const root = process.cwd();
const rpcUrl = process.env.ZERO_G_RPC_URL ?? "https://evmrpc-testnet.0g.ai";
const chainId = Number(process.env.ZERO_G_CHAIN_ID ?? "16602");
const artifactPath = path.join(root, "out", "OpenGapRegistry.sol", "OpenGapRegistry.json");

const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
const provider = new ethers.JsonRpcProvider(rpcUrl, chainId);
const wallet = walletFromEnv(provider);
const network = await provider.getNetwork();

if (Number(network.chainId) !== chainId) {
  throw new Error(`Connected to chain ${network.chainId}, expected ${chainId}`);
}

const balance = await provider.getBalance(wallet.address);
if (balance === 0n) {
  throw new Error(`Wallet ${wallet.address} has zero balance on 0G Galileo. Fund it from https://faucet.0g.ai`);
}

const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode.object ?? artifact.bytecode, wallet);
const contract = await factory.deploy();
console.log(`submitted: ${contract.deploymentTransaction()?.hash}`);
await contract.waitForDeployment();
const address = await contract.getAddress();
console.log(`deployed: ${address}`);
console.log(`explorer: https://chainscan-galileo.0g.ai/address/${address}`);

await writeFile(
  path.join(root, ".opengap-registry-address"),
  `${address}\n`,
  "utf8"
);

