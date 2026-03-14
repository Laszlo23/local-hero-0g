import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "./profile";

export interface Treegen {
  id: string;
  device_id: string;
  name: string;
  species: string;
  stage: number;
  xp: number;
  xp_next_level: number;
  traits: Record<string, any>;
  visual_seed: number;
  rarity: string;
  chain_token_id: string | null;
  chain_tx_hash: string | null;
  created_at: string;
}

export const STAGES = [
  { stage: 1, name: "Seed", emoji: "🌰", xpRequired: 0, description: "A tiny seed with infinite potential" },
  { stage: 2, name: "Sprout", emoji: "🌱", xpRequired: 100, description: "First leaves breaking through the soil" },
  { stage: 3, name: "Sapling", emoji: "🌿", xpRequired: 350, description: "Growing stronger with each passing day" },
  { stage: 4, name: "Young Tree", emoji: "🌳", xpRequired: 800, description: "Providing shade and shelter" },
  { stage: 5, name: "Ancient Tree", emoji: "🏔️", xpRequired: 2000, description: "Wise and deeply rooted" },
  { stage: 6, name: "Mythic Tree", emoji: "✨", xpRequired: 5000, description: "Glowing with otherworldly energy" },
  { stage: 7, name: "Legendary Tree", emoji: "🌟", xpRequired: 10000, description: "A beacon of hope for the entire community" },
];

export const SPECIES = [
  { id: "oak", name: "Oak", trait: "Resilience", color: "from-emerald-500 to-green-700" },
  { id: "sakura", name: "Sakura", trait: "Beauty", color: "from-pink-400 to-rose-600" },
  { id: "baobab", name: "Baobab", trait: "Wisdom", color: "from-amber-500 to-orange-700" },
  { id: "redwood", name: "Redwood", trait: "Strength", color: "from-red-600 to-red-900" },
  { id: "willow", name: "Willow", trait: "Adaptability", color: "from-teal-400 to-cyan-600" },
  { id: "banyan", name: "Banyan", trait: "Community", color: "from-lime-500 to-green-600" },
  { id: "crystal", name: "Crystal Pine", trait: "Clarity", color: "from-cyan-400 to-blue-600" },
];

const RARITY_THRESHOLDS = [
  { min: 0, rarity: "common" },
  { min: 500, rarity: "uncommon" },
  { min: 1500, rarity: "rare" },
  { min: 3500, rarity: "epic" },
  { min: 7000, rarity: "legendary" },
  { min: 10000, rarity: "mythic" },
];

function calculateRarity(xp: number): string {
  for (let i = RARITY_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= RARITY_THRESHOLDS[i].min) return RARITY_THRESHOLDS[i].rarity;
  }
  return "common";
}

function calculateStage(xp: number): { stage: number; xpNext: number } {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (xp >= STAGES[i].xpRequired) {
      const next = STAGES[i + 1]?.xpRequired || STAGES[i].xpRequired;
      return { stage: STAGES[i].stage, xpNext: next };
    }
  }
  return { stage: 1, xpNext: 100 };
}

export async function getOrCreateTreegen(): Promise<Treegen> {
  const deviceId = getDeviceId();

  const { data } = await supabase
    .from("treegens")
    .select("*")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (data) return data as unknown as Treegen;

  // Create new treegen with random species
  const species = SPECIES[Math.floor(Math.random() * SPECIES.length)];
  const visualSeed = Math.floor(Math.random() * 10000);

  const { data: newTree, error } = await supabase
    .from("treegens")
    .insert({
      device_id: deviceId,
      name: `${species.name} Seedling`,
      species: species.id,
      stage: 1,
      xp: 0,
      xp_next_level: 100,
      visual_seed: visualSeed,
      rarity: "common",
      traits: { species_trait: species.trait, born_era: "genesis" },
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create treegen:", error);
    return {
      id: "",
      device_id: deviceId,
      name: "Seedling",
      species: "oak",
      stage: 1,
      xp: 0,
      xp_next_level: 100,
      traits: {},
      visual_seed: 0,
      rarity: "common",
      chain_token_id: null,
      chain_tx_hash: null,
      created_at: new Date().toISOString(),
    };
  }

  return newTree as unknown as Treegen;
}

export async function addTreegenXP(amount: number, reason: string): Promise<Treegen | null> {
  const deviceId = getDeviceId();

  const { data: current } = await supabase
    .from("treegens")
    .select("*")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (!current) return null;

  const newXp = (current.xp || 0) + amount;
  const { stage, xpNext } = calculateStage(newXp);
  const rarity = calculateRarity(newXp);
  const stageInfo = STAGES[stage - 1];
  const speciesInfo = SPECIES.find((s) => s.id === current.species) || SPECIES[0];

  const evolved = stage > current.stage;
  const newName = evolved ? `${speciesInfo.name} ${stageInfo.name}` : current.name;

  const traits = {
    ...(current.traits as Record<string, any>),
    last_xp_reason: reason,
    ...(evolved ? { evolved_at: new Date().toISOString(), evolution_count: ((current.traits as any)?.evolution_count || 0) + 1 } : {}),
  };

  const { data: updated } = await supabase
    .from("treegens")
    .update({
      xp: newXp,
      stage,
      xp_next_level: xpNext,
      rarity,
      name: newName,
      traits,
      updated_at: new Date().toISOString(),
    })
    .eq("device_id", deviceId)
    .select()
    .single();

  return updated as unknown as Treegen;
}

export function getStageInfo(stage: number) {
  return STAGES[stage - 1] || STAGES[0];
}

export function getSpeciesInfo(speciesId: string) {
  return SPECIES.find((s) => s.id === speciesId) || SPECIES[0];
}

export const RARITY_COLORS: Record<string, string> = {
  common: "text-muted-foreground",
  uncommon: "text-primary",
  rare: "text-cyan-400",
  epic: "text-hero-purple",
  legendary: "text-accent",
  mythic: "text-hero-orange",
};
