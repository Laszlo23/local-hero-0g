import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "./profile";
import { awardPoints } from "./points";
import { addTreegenXP } from "./treegens";

export interface CampaignTask {
  id: string;
  platform: "twitter" | "instagram" | "tiktok" | "farcaster";
  type: string;
  title: string;
  description: string;
  points: number;
  xp: number;
  icon: string;
  actionUrl?: string;
  actionLabel: string;
}

export const CAMPAIGN_TASKS: CampaignTask[] = [
  // Twitter/X
  { id: "tw-follow", platform: "twitter", type: "follow", title: "Follow @0gLocalHero", description: "Follow our official X account", points: 100, xp: 25, icon: "𝕏", actionUrl: "https://twitter.com/0gLocalHero", actionLabel: "Follow" },
  { id: "tw-retweet", platform: "twitter", type: "share", title: "Retweet Launch Post", description: "Share our pinned launch tweet", points: 150, xp: 35, icon: "🔄", actionUrl: "https://twitter.com/0gLocalHero", actionLabel: "Retweet" },
  { id: "tw-post", platform: "twitter", type: "post", title: "Tweet About HERO", description: "Post about HERO with #LocalHero #0GChain", points: 250, xp: 60, icon: "✍️", actionLabel: "Post" },
  { id: "tw-tag3", platform: "twitter", type: "tag", title: "Tag 3 Friends", description: "Tag 3 friends in our launch post", points: 200, xp: 50, icon: "👥", actionLabel: "Tag Friends" },

  // Instagram
  { id: "ig-follow", platform: "instagram", type: "follow", title: "Follow @0gLocalHero", description: "Follow our Instagram", points: 100, xp: 25, icon: "📸", actionUrl: "https://instagram.com/0gLocalHero", actionLabel: "Follow" },
  { id: "ig-story", platform: "instagram", type: "story", title: "Share to Stories", description: "Share our post to your Instagram Stories", points: 200, xp: 50, icon: "📱", actionLabel: "Share Story" },
  { id: "ig-post", platform: "instagram", type: "post", title: "Create a HERO Post", description: "Post about your hero journey with #LocalHero #0GChain", points: 300, xp: 75, icon: "🎨", actionLabel: "Create Post" },

  // TikTok
  { id: "tt-follow", platform: "tiktok", type: "follow", title: "Follow @0gLocalHero", description: "Follow us on TikTok", points: 100, xp: 25, icon: "🎵", actionUrl: "https://tiktok.com/@0gLocalHero", actionLabel: "Follow" },
  { id: "tt-video", platform: "tiktok", type: "video", title: "Create a Hero Video", description: "Make a TikTok showing your hero quest with #LocalHero #0GChain", points: 500, xp: 120, icon: "🎬", actionLabel: "Create Video" },
  { id: "tt-duet", platform: "tiktok", type: "duet", title: "Duet Our Challenge", description: "Duet our challenge video", points: 350, xp: 80, icon: "🤝", actionLabel: "Duet" },

  // Farcaster
  { id: "fc-follow", platform: "farcaster", type: "follow", title: "Follow @0gLocalHero", description: "Follow us on Farcaster", points: 100, xp: 25, icon: "🟣", actionUrl: "https://warpcast.com/0gLocalHero", actionLabel: "Follow" },
  { id: "fc-cast", platform: "farcaster", type: "post", title: "Cast About HERO", description: "Post about your hero journey on Farcaster", points: 250, xp: 60, icon: "📡", actionLabel: "Cast" },
];

export async function completeTask(taskId: string): Promise<{ success: boolean; message: string }> {
  const deviceId = getDeviceId();
  const task = CAMPAIGN_TASKS.find((t) => t.id === taskId);
  if (!task) return { success: false, message: "Task not found" };

  // Check if already completed
  const { data: existing } = await supabase
    .from("social_tasks")
    .select("id")
    .eq("device_id", deviceId)
    .eq("task_id", taskId)
    .maybeSingle();

  if (existing) return { success: false, message: "Already completed!" };

  // Insert completion
  const { error } = await supabase.from("social_tasks").insert({
    device_id: deviceId,
    task_id: taskId,
    platform: task.platform,
    task_type: task.type,
    points_awarded: task.points,
  });

  if (error) return { success: false, message: "Failed to save" };

  // Award points + Treegen XP
  await awardPoints(task.points, `Campaign: ${task.title}`);
  await addTreegenXP(task.xp, `Campaign: ${task.title}`);

  // Check for badge unlocks
  await checkBadgeUnlocks(deviceId);

  return { success: true, message: `+${task.points} HERO & +${task.xp} Tree XP!` };
}

export async function getCompletedTasks(): Promise<string[]> {
  const deviceId = getDeviceId();
  const { data } = await supabase
    .from("social_tasks")
    .select("task_id")
    .eq("device_id", deviceId);

  return (data || []).map((d) => d.task_id);
}

async function checkBadgeUnlocks(deviceId: string) {
  const { data: tasks } = await supabase
    .from("social_tasks")
    .select("task_id")
    .eq("device_id", deviceId);

  const count = tasks?.length || 0;

  // Social Champion - complete 5+ tasks
  if (count >= 5) {
    await supabase.from("founder_badges").upsert(
      { device_id: deviceId, badge_type: "social_champion", tier: count >= 10 ? "gold" : "silver", metadata: { tasks_completed: count } },
      { onConflict: "device_id,badge_type" }
    );
  }

  // Founding Member - complete at least 1 task
  if (count >= 1) {
    await supabase.from("founder_badges").upsert(
      { device_id: deviceId, badge_type: "founding_member", tier: "bronze", metadata: { joined_era: "genesis" } },
      { onConflict: "device_id,badge_type" }
    );
  }
}

export async function getFounderBadges(): Promise<Array<{ badge_type: string; tier: string }>> {
  const deviceId = getDeviceId();
  const { data } = await supabase
    .from("founder_badges")
    .select("badge_type, tier")
    .eq("device_id", deviceId);
  return data || [];
}

export const PLATFORM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  twitter: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20" },
  instagram: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  tiktok: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-400", border: "border-fuchsia-500/20" },
  discord: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
};

export const PLATFORM_LABELS: Record<string, string> = {
  twitter: "Twitter/X",
  instagram: "Instagram",
  tiktok: "TikTok",
  discord: "Discord",
};
