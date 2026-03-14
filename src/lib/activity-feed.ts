import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "./profile";

export type ActivityEvent = {
  id: string;
  device_id: string;
  display_name: string;
  avatar_url: string | null;
  event_type: string;
  title: string;
  description: string;
  emoji: string;
  points: number;
  metadata: Record<string, any>;
  created_at: string;
};

export type Reaction = {
  id: string;
  activity_id: string;
  device_id: string;
  reaction: string;
  created_at: string;
};

const REACTION_EMOJIS = ["🔥", "❤️", "👏", "🌳", "💪"] as const;
export { REACTION_EMOJIS };

export async function postToFeed(params: {
  event_type: string;
  title: string;
  description?: string;
  emoji?: string;
  points?: number;
  metadata?: Record<string, any>;
}) {
  const deviceId = getDeviceId();

  // Get user display name
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name, avatar_url")
    .eq("device_id", deviceId)
    .maybeSingle();

  const { error } = await supabase.from("activity_feed").insert({
    device_id: deviceId,
    display_name: profile?.display_name || "Anonymous Hero",
    avatar_url: profile?.avatar_url || null,
    event_type: params.event_type,
    title: params.title,
    description: params.description || "",
    emoji: params.emoji || "🌟",
    points: params.points || 0,
    metadata: params.metadata || {},
  });

  if (error) console.error("Failed to post to feed:", error);
}

export async function getFeed(limit = 30, offset = 0) {
  const { data, error } = await supabase
    .from("activity_feed")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Failed to load feed:", error);
    return [];
  }
  return data as ActivityEvent[];
}

export async function getReactionsForActivities(activityIds: string[]) {
  if (activityIds.length === 0) return {};

  const { data, error } = await supabase
    .from("activity_reactions")
    .select("*")
    .in("activity_id", activityIds);

  if (error) {
    console.error("Failed to load reactions:", error);
    return {};
  }

  const grouped: Record<string, Reaction[]> = {};
  for (const r of data || []) {
    if (!grouped[r.activity_id]) grouped[r.activity_id] = [];
    grouped[r.activity_id].push(r as Reaction);
  }
  return grouped;
}

export async function toggleReaction(activityId: string, emoji: string) {
  const deviceId = getDeviceId();

  // Check if already reacted
  const { data: existing } = await supabase
    .from("activity_reactions")
    .select("id")
    .eq("activity_id", activityId)
    .eq("device_id", deviceId)
    .eq("reaction", emoji)
    .maybeSingle();

  if (existing) {
    await supabase.from("activity_reactions").delete().eq("id", existing.id);
    return false;
  } else {
    await supabase.from("activity_reactions").insert({
      activity_id: activityId,
      device_id: deviceId,
      reaction: emoji,
    });
    return true;
  }
}
