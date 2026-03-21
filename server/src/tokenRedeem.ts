import { ethers } from "ethers";
import { config } from "./config.js";

export function normalizeEvmAddress(addr: string): string {
  return ethers.getAddress(addr);
}

const ERC20_MINT_ABI = ["function mint(address to, uint256 amount) external"];

export function isRedeemConfigured(): boolean {
  return Boolean(
    config.heroTokenAddress &&
      config.heroTokenMinterPrivateKey &&
      config.heroTokenMinterPrivateKey.startsWith("0x")
  );
}

/** Mint HERO ERC-20 to recipient. Minter wallet pays gas. */
export async function mintHeroTokens(recipient: string, amountWei: bigint): Promise<{ txHash: string }> {
  if (!isRedeemConfigured()) {
    throw new Error("Token redeem is not configured");
  }
  const provider = new ethers.JsonRpcProvider(config.heroTokenChainRpc);
  const wallet = new ethers.Wallet(config.heroTokenMinterPrivateKey!, provider);
  const contract = new ethers.Contract(config.heroTokenAddress!, ERC20_MINT_ABI, wallet);
  const tx = await contract.mint(recipient, amountWei);
  const txHash = tx.hash;
  const receipt = await tx.wait();
  if (!receipt || receipt.status !== 1) {
    throw new Error("Mint transaction failed or reverted");
  }
  return { txHash };
}

/** points * 10^18 / pointsPerToken — integer points to wei. */
export function pointsToTokenWei(pointsAmount: number, pointsPerToken: number): bigint {
  if (pointsPerToken <= 0) throw new Error("Invalid pointsPerToken");
  return (BigInt(pointsAmount) * 10n ** 18n) / BigInt(pointsPerToken);
}
