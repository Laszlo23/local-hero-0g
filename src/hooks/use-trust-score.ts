import { useMemo } from "react";
import { UserStats } from "./use-user-stats";

export interface TrustScore {
  total: number;
  tier: "seedling" | "sprout" | "guardian" | "champion" | "legend";
  tierLabel: string;
  tierEmoji: string;
  tierColor: string;
  signals: { label: string; value: number; max: number; emoji: string }[];
  nextTier: string | null;
  pointsToNext: number;
}

const TIERS = [
  { min: 0, tier: "seedling" as const, label: "Seedling", emoji: "🌱", color: "text-muted-foreground" },
  { min: 50, tier: "sprout" as const, label: "Sprout", emoji: "🌿", color: "text-primary" },
  { min: 150, tier: "guardian" as const, label: "Guardian", emoji: "🛡️", color: "text-hero-yellow" },
  { min: 350, tier: "champion" as const, label: "Champion", emoji: "⚔️", color: "text-hero-orange" },
  { min: 700, tier: "legend" as const, label: "Legend", emoji: "👑", color: "text-hero-purple" },
];

export function calculateTrustScore(stats: UserStats & { 
  referral_count?: number; 
  socials?: Record<string, string>;
  onboarding_completed?: boolean;
  hero_pledge_signed?: boolean;
}): TrustScore {
  // Signal: Quest completion (max 200)
  const questScore = Math.min(200, (stats.quests_completed || 0) * 4);

  // Signal: Streak consistency (max 150)
  const streakScore = Math.min(150, (stats.streak || 0) * 10);

  // Signal: Community impact (max 200)
  const impactScore = Math.min(200,
    (stats.trees_planted || 0) * 5 +
    (stats.neighbors_helped || 0) * 8 +
    (stats.businesses_supported || 0) * 10
  );

  // Signal: Referrals (max 100)
  const referralScore = Math.min(100, (stats.referral_count || 0) * 20);

  // Signal: Profile & verification (max 100)
  let profileScore = 0;
  if (stats.display_name && stats.display_name !== "Hero") profileScore += 15;
  if (stats.avatar_url) profileScore += 15;
  if (stats.location) profileScore += 10;
  if (stats.bio) profileScore += 10;
  if (stats.onboarding_completed) profileScore += 20;
  if (stats.hero_pledge_signed) profileScore += 15;
  const socialCount = stats.socials 
    ? Object.values(stats.socials).filter(v => v && String(v).trim()).length 
    : 0;
  profileScore += Math.min(15, socialCount * 5);
  profileScore = Math.min(100, profileScore);

  // Signal: Level / XP (max 250)
  const levelScore = Math.min(250, (stats.level || 1) * 15 + Math.floor((stats.total_points || 0) / 100));

  const total = questScore + streakScore + impactScore + referralScore + profileScore + levelScore;

  const signals = [
    { label: "Quests", value: questScore, max: 200, emoji: "⚡" },
    { label: "Streak", value: streakScore, max: 150, emoji: "🔥" },
    { label: "Impact", value: impactScore, max: 200, emoji: "🌍" },
    { label: "Referrals", value: referralScore, max: 100, emoji: "🤝" },
    { label: "Profile", value: profileScore, max: 100, emoji: "✅" },
    { label: "Level", value: levelScore, max: 250, emoji: "⭐" },
  ];

  // Determine tier
  let currentTier = TIERS[0];
  for (const t of TIERS) {
    if (total >= t.min) currentTier = t;
  }

  const nextTierObj = TIERS[TIERS.indexOf(currentTier) + 1] || null;

  return {
    total,
    tier: currentTier.tier,
    tierLabel: currentTier.label,
    tierEmoji: currentTier.emoji,
    tierColor: currentTier.color,
    signals,
    nextTier: nextTierObj?.label || null,
    pointsToNext: nextTierObj ? nextTierObj.min - total : 0,
  };
}
