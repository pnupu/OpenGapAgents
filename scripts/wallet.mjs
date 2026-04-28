import { ethers } from "ethers";

export function walletFromEnv(provider) {
  const privateKey = process.env.PRIVATE_KEY?.trim();
  const phrase = process.env.WALLET_PHRASE?.trim();
  const expectedAddress = process.env.WALLET_ADDRESS?.trim();

  let wallet;
  if (privateKey) {
    wallet = new ethers.Wallet(privateKey, provider);
  } else if (phrase) {
    wallet = walletFromPhrase(phrase, expectedAddress, provider);
  } else {
    throw new Error("Set PRIVATE_KEY or WALLET_PHRASE in .env");
  }

  if (expectedAddress && wallet.address.toLowerCase() !== expectedAddress.toLowerCase()) {
    throw new Error(`Derived wallet ${wallet.address} does not match WALLET_ADDRESS`);
  }

  return wallet;
}

function walletFromPhrase(phrase, expectedAddress, provider) {
  const configuredPath = process.env.WALLET_DERIVATION_PATH?.trim();
  if (configuredPath) {
    return ethers.HDNodeWallet.fromPhrase(phrase, undefined, configuredPath).connect(provider);
  }

  if (!expectedAddress) {
    return ethers.Wallet.fromPhrase(phrase, provider);
  }

  const paths = [];
  for (let index = 0; index < 25; index += 1) {
    paths.push(`m/44'/60'/0'/0/${index}`);
  }
  for (let account = 0; account < 5; account += 1) {
    paths.push(`m/44'/60'/${account}'/0/0`);
  }

  for (const derivationPath of paths) {
    const candidate = ethers.HDNodeWallet.fromPhrase(phrase, undefined, derivationPath).connect(provider);
    if (candidate.address.toLowerCase() === expectedAddress.toLowerCase()) {
      console.log(`wallet derivation path: ${derivationPath}`);
      return candidate;
    }
  }

  return ethers.Wallet.fromPhrase(phrase, provider);
}
