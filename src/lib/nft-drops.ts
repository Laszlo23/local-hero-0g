import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "./profile";
import { awardPoints } from "./points";

export type DropType = "token" | "nft" | "seed_phrase" | "mystery_box";

export interface NftDrop {
  id: string;
  creator_device_id: string;
  claimer_device_id: string | null;
  title: string;
  description: string;
  drop_type: DropType;
  content_encrypted: string;
  token_amount: number;
  nft_metadata: Record<string, any>;
  latitude: number | null;
  longitude: number | null;
  qr_code: string | null;
  chain_tx_hash: string | null;
  chain_contract_address: string | null;
  chain_token_id: string | null;
  chain_network: string;
  status: string;
  expires_at: string | null;
  claimed_at: string | null;
  created_at: string;
}

function generateDropCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "DROP-";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// Simple XOR encryption for demo (in production use AES-256-GCM)
function encryptContent(content: string): string {
  const key = "HERO-0G-CHAIN-777";
  return btoa(
    content
      .split("")
      .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
      .join("")
  );
}

function decryptContent(encrypted: string): string {
  const key = "HERO-0G-CHAIN-777";
  const decoded = atob(encrypted);
  return decoded
    .split("")
    .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
    .join("");
}

export async function createDrop(params: {
  title: string;
  description: string;
  dropType: DropType;
  content: string; // seed phrase, token amount, etc.
  tokenAmount: number;
  nftMetadata?: Record<string, any>;
}): Promise<{ success: boolean; drop?: NftDrop; qrCode?: string }> {
  const deviceId = getDeviceId();
  const qrCode = generateDropCode();
  const encrypted = encryptContent(params.content);

  const { data, error } = await supabase
    .from("nft_drops")
    .insert({
      creator_device_id: deviceId,
      title: params.title,
      description: params.description,
      drop_type: params.dropType,
      content_encrypted: encrypted,
      token_amount: params.tokenAmount,
      nft_metadata: params.nftMetadata || {},
      qr_code: qrCode,
      chain_network: "0g-chain",
      status: "active",
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create drop:", error);
    return { success: false };
  }

  return { success: true, drop: data as unknown as NftDrop, qrCode };
}

export async function claimDrop(qrCode: string): Promise<{
  success: boolean;
  message: string;
  drop?: NftDrop;
  content?: string;
}> {
  const deviceId = getDeviceId();

  // Find the drop
  const { data: drop, error } = await supabase
    .from("nft_drops")
    .select("*")
    .eq("qr_code", qrCode)
    .maybeSingle();

  if (error || !drop) return { success: false, message: "Drop not found" };
  if (drop.status === "claimed") return { success: false, message: "Already claimed!" };
  if (drop.creator_device_id === deviceId) return { success: false, message: "Can't claim your own drop" };
  if (drop.expires_at && new Date(drop.expires_at) < new Date()) return { success: false, message: "Drop expired" };

  // Claim it
  const { error: updateError } = await supabase
    .from("nft_drops")
    .update({
      claimer_device_id: deviceId,
      status: "claimed",
      claimed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", drop.id)
    .eq("status", "active");

  if (updateError) return { success: false, message: "Failed to claim" };

  // Award points
  const points = drop.token_amount || 50;
  await awardPoints(points, `NFT Drop: ${drop.title}`);

  // Decrypt content
  const content = drop.content_encrypted ? decryptContent(drop.content_encrypted) : "";

  return {
    success: true,
    message: `Claimed! +${points} HERO`,
    drop: drop as unknown as NftDrop,
    content,
  };
}

export async function getMyDrops(): Promise<NftDrop[]> {
  const deviceId = getDeviceId();
  const { data } = await supabase
    .from("nft_drops")
    .select("*")
    .eq("creator_device_id", deviceId)
    .order("created_at", { ascending: false });

  return (data || []) as unknown as NftDrop[];
}

export async function getClaimedDrops(): Promise<NftDrop[]> {
  const deviceId = getDeviceId();
  const { data } = await supabase
    .from("nft_drops")
    .select("*")
    .eq("claimer_device_id", deviceId)
    .order("claimed_at", { ascending: false });

  return (data || []) as unknown as NftDrop[];
}

// On-chain ready: generates the mint parameters for 0G Chain
export function generateMintParams(drop: NftDrop) {
  return {
    network: "0G Chain Testnet",
    chainId: 16600,
    rpcUrl: "https://evmrpc-testnet.0g.ai",
    contractStandard: "ERC-721",
    metadata: {
      name: drop.title,
      description: drop.description,
      attributes: [
        { trait_type: "Drop Type", value: drop.drop_type },
        { trait_type: "Token Amount", value: drop.token_amount },
        { trait_type: "Created", value: drop.created_at },
        { trait_type: "Platform", value: "HERO App" },
      ],
    },
    // ABI-compatible mint function signature
    mintFunction: "mint(address to, string memory tokenURI)",
    // Ready for ethers.js / viem integration
    estimatedGas: "250000",
  };
}
