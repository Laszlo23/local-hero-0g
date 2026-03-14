import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "./profile";
import { awardPoints } from "./points";

export type DropRarity = "common" | "rare" | "legendary";
export type DropRewardType = "token" | "nft" | "partner_reward";

export interface DiscoveryDrop {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  rarity: DropRarity;
  reward_type: DropRewardType;
  reward_value: number;
  max_claims: number;
  current_claims: number;
  starts_at: string;
  ends_at: string;
  image_url: string | null;
  sponsor_name: string | null;
  sponsor_logo: string | null;
  sponsor_reward_description: string | null;
  status: string;
  created_at: string;
}

export interface DropClaim {
  id: string;
  drop_id: string;
  device_id: string;
  claimed_at: string;
}

const CLAIM_RADIUS_METERS = 50;

function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getActiveDrops(): Promise<DiscoveryDrop[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("discovery_drops")
    .select("*")
    .eq("status", "active")
    .lte("starts_at", now)
    .gte("ends_at", now)
    .order("rarity", { ascending: false });

  if (error) {
    console.error("Failed to fetch drops:", error);
    return [];
  }
  return (data || []) as unknown as DiscoveryDrop[];
}

export async function getAllDrops(): Promise<DiscoveryDrop[]> {
  const { data, error } = await supabase
    .from("discovery_drops")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []) as unknown as DiscoveryDrop[];
}

export async function getMyClaimedDropIds(): Promise<string[]> {
  const deviceId = getDeviceId();
  const { data } = await supabase
    .from("discovery_drop_claims")
    .select("drop_id")
    .eq("device_id", deviceId);
  return (data || []).map((c: any) => c.drop_id);
}

export async function claimDrop(
  drop: DiscoveryDrop,
  userLat: number,
  userLon: number
): Promise<{ success: boolean; message: string }> {
  // Check distance
  const dist = getDistanceMeters(userLat, userLon, drop.latitude, drop.longitude);
  if (dist > CLAIM_RADIUS_METERS) {
    return { success: false, message: `Too far away (${Math.round(dist)}m). Get within ${CLAIM_RADIUS_METERS}m to claim.` };
  }

  // Check still active
  const now = new Date();
  if (new Date(drop.ends_at) < now) return { success: false, message: "This drop has expired." };
  if (drop.current_claims >= drop.max_claims) return { success: false, message: "All claims taken!" };

  const deviceId = getDeviceId();

  // Check already claimed
  const { data: existing } = await supabase
    .from("discovery_drop_claims")
    .select("id")
    .eq("drop_id", drop.id)
    .eq("device_id", deviceId)
    .maybeSingle();

  if (existing) return { success: false, message: "You already claimed this drop!" };

  // Insert claim
  const { error: claimError } = await supabase
    .from("discovery_drop_claims")
    .insert({ drop_id: drop.id, device_id: deviceId });

  if (claimError) return { success: false, message: "Failed to claim." };

  // Increment claims on drop
  await supabase
    .from("discovery_drops")
    .update({
      current_claims: drop.current_claims + 1,
      status: drop.current_claims + 1 >= drop.max_claims ? "claimed_out" : "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", drop.id);

  // Award points
  await awardPoints(drop.reward_value, `Discovery Drop: ${drop.title}`);

  return {
    success: true,
    message: `🎉 Claimed! +${drop.reward_value} HERO`,
  };
}

export async function createDrop(params: {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  rarity: DropRarity;
  reward_type: DropRewardType;
  reward_value: number;
  max_claims: number;
  ends_at: string;
  sponsor_name?: string;
  sponsor_reward_description?: string;
}): Promise<boolean> {
  const { error } = await supabase.from("discovery_drops").insert({
    title: params.title,
    description: params.description,
    latitude: params.latitude,
    longitude: params.longitude,
    rarity: params.rarity,
    reward_type: params.reward_type,
    reward_value: params.reward_value,
    max_claims: params.max_claims,
    ends_at: params.ends_at,
    sponsor_name: params.sponsor_name || null,
    sponsor_reward_description: params.sponsor_reward_description || null,
    status: "active",
  });

  if (error) {
    console.error("Failed to create drop:", error);
    return false;
  }
  return true;
}

export async function deleteDrop(id: string): Promise<boolean> {
  const { error } = await supabase.from("discovery_drops").delete().eq("id", id);
  return !error;
}

export function getRarityConfig(rarity: DropRarity) {
  switch (rarity) {
    case "legendary":
      return { color: "text-yellow-400", bg: "bg-yellow-500/20 border-yellow-500/50", glow: "shadow-yellow-500/30", emoji: "👑", label: "Legendary" };
    case "rare":
      return { color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/50", glow: "shadow-purple-500/30", emoji: "💎", label: "Rare" };
    default:
      return { color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/50", glow: "shadow-blue-500/30", emoji: "📦", label: "Common" };
  }
}
