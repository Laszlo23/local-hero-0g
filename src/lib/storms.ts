import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "./profile";
import { awardPoints } from "./points";

export type StormDropRarity = "common" | "rare" | "legendary";

export interface Storm {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
  radius: number;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
}

export interface StormDrop {
  id: string;
  storm_id: string;
  lat: number;
  lng: number;
  rarity: StormDropRarity;
  reward_value: number;
  claimed: boolean;
  claimed_by: string | null;
  claimed_at: string | null;
}

const CLAIM_RADIUS_METERS = 30;

function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isWithinStormZone(userLat: number, userLng: number, storm: Storm): boolean {
  return getDistanceMeters(userLat, userLng, storm.center_lat, storm.center_lng) <= storm.radius;
}

export function isStormActive(storm: Storm): boolean {
  const now = new Date();
  return new Date(storm.start_time) <= now && new Date(storm.end_time) >= now && storm.status === "active";
}

export async function getActiveStorms(): Promise<Storm[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("storms")
    .select("*")
    .eq("status", "active")
    .lte("start_time", now)
    .gte("end_time", now)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch storms:", error);
    return [];
  }
  return (data || []) as unknown as Storm[];
}

export async function getStormDrops(stormId: string): Promise<StormDrop[]> {
  const { data, error } = await supabase
    .from("storm_drops")
    .select("*")
    .eq("storm_id", stormId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch storm drops:", error);
    return [];
  }
  return (data || []) as unknown as StormDrop[];
}

export async function claimStormDrop(
  drop: StormDrop,
  userLat: number,
  userLng: number,
  storm: Storm
): Promise<{ success: boolean; message: string }> {
  // Check storm still active
  if (!isStormActive(storm)) {
    return { success: false, message: "Storm has ended!" };
  }

  // Check distance
  const dist = getDistanceMeters(userLat, userLng, drop.lat, drop.lng);
  if (dist > CLAIM_RADIUS_METERS) {
    return { success: false, message: `Too far (${Math.round(dist)}m). Get within ${CLAIM_RADIUS_METERS}m.` };
  }

  // Check not already claimed
  if (drop.claimed) {
    return { success: false, message: "Already claimed!" };
  }

  const deviceId = getDeviceId();

  // Mark drop as claimed
  const { error: updateError } = await supabase
    .from("storm_drops")
    .update({
      claimed: true,
      claimed_by: deviceId,
      claimed_at: new Date().toISOString(),
    })
    .eq("id", drop.id)
    .eq("claimed", false);

  if (updateError) {
    return { success: false, message: "Failed to claim." };
  }

  // Insert claim record
  await supabase.from("storm_claims").insert({
    drop_id: drop.id,
    device_id: deviceId,
    reward_value: drop.reward_value,
  });

  // Award points
  await awardPoints(drop.reward_value, `Storm Drop: ${drop.rarity}`);

  return { success: true, message: `🎉 +${drop.reward_value} HERO` };
}

export function getRarityConfig(rarity: StormDropRarity) {
  switch (rarity) {
    case "legendary":
      return { color: "text-hero-yellow", bg: "bg-hero-yellow/20", glow: "shadow-[0_0_20px_hsl(var(--hero-yellow)/0.5)]", emoji: "👑", label: "Legendary", value: 200 };
    case "rare":
      return { color: "text-purple-400", bg: "bg-purple-500/20", glow: "shadow-[0_0_16px_rgba(168,85,247,0.4)]", emoji: "💎", label: "Rare", value: 50 };
    default:
      return { color: "text-primary", bg: "bg-primary/20", glow: "shadow-[0_0_12px_hsl(var(--primary)/0.3)]", emoji: "📦", label: "Common", value: 10 };
  }
}

// Generate random drops within a storm radius
function randomPointInCircle(centerLat: number, centerLng: number, radiusMeters: number) {
  const r = radiusMeters * Math.sqrt(Math.random());
  const theta = Math.random() * 2 * Math.PI;
  const dLat = (r * Math.cos(theta)) / 111320;
  const dLng = (r * Math.sin(theta)) / (111320 * Math.cos((centerLat * Math.PI) / 180));
  return { lat: centerLat + dLat, lng: centerLng + dLng };
}

export function generateDropPositions(storm: Storm, count: number = 30): Array<{ lat: number; lng: number; rarity: StormDropRarity; reward_value: number }> {
  const drops: Array<{ lat: number; lng: number; rarity: StormDropRarity; reward_value: number }> = [];
  for (let i = 0; i < count; i++) {
    const pos = randomPointInCircle(storm.center_lat, storm.center_lng, storm.radius);
    const roll = Math.random();
    let rarity: StormDropRarity = "common";
    let reward_value = 10;
    if (roll > 0.95) {
      rarity = "legendary";
      reward_value = 200;
    } else if (roll > 0.75) {
      rarity = "rare";
      reward_value = 50;
    }
    drops.push({ ...pos, rarity, reward_value });
  }
  return drops;
}
