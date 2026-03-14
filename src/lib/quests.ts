import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "./profile";
import { awardPoints } from "./points";
import { postToFeed } from "./activity-feed";
import { contributeToChallenge } from "./challenges";

interface CompleteQuestParams {
  title: string;
  category: string;
  emoji: string;
  points: number;
  userId?: string;
  impactType?: "trees_planted" | "neighbors_helped" | "businesses_supported" | "miles_biked";
  impactValue?: number;
}

export async function completeQuest(params: CompleteQuestParams): Promise<boolean> {
  const deviceId = getDeviceId();

  // Insert completed quest
  const { error } = await supabase.from("completed_quests").insert({
    device_id: deviceId,
    user_id: params.userId || null,
    quest_title: params.title,
    quest_category: params.category,
    quest_emoji: params.emoji,
    points_awarded: params.points,
  });

  if (error) {
    console.error("Failed to complete quest:", error);
    return false;
  }

  // Award points
  await awardPoints(params.points, `Quest: ${params.title}`);

  // Post to activity feed
  await postToFeed({
    event_type: "quest_completed",
    title: `Completed: ${params.title}`,
    description: `${params.emoji} ${params.category} quest`,
    emoji: params.emoji,
    points: params.points,
  });

  // Update impact stats if applicable
  if (params.impactType && params.impactValue) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select(params.impactType)
      .eq("device_id", deviceId)
      .maybeSingle();

    if (profile) {
      const current = (profile as any)[params.impactType] || 0;
      await supabase
        .from("user_profiles")
        .update({ [params.impactType]: current + params.impactValue, updated_at: new Date().toISOString() })
        .eq("device_id", deviceId);
    }

    // Auto-contribute to matching active challenges
    const { data: activeChallenges } = await supabase
      .from("community_challenges")
      .select("id, goal_type")
      .eq("status", "active")
      .eq("goal_type", params.impactType);

    if (activeChallenges && activeChallenges.length > 0) {
      await Promise.all(
        activeChallenges.map((c) =>
          contributeToChallenge(c.id, params.impactValue!, params.title)
        )
      );
    }
  }

  return true;
}

export async function getRecentQuests(limit = 10) {
  const deviceId = getDeviceId();
  const { data } = await supabase
    .from("completed_quests")
    .select("*")
    .eq("device_id", deviceId)
    .order("completed_at", { ascending: false })
    .limit(limit);

  return data || [];
}
