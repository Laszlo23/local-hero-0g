import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "./profile";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  goal_type: string;
  goal_target: number;
  goal_current: number;
  reward_points: number;
  reward_badge: string | null;
  starts_at: string;
  ends_at: string;
  status: string;
  participant_count: number;
}

export async function getActiveChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from("community_challenges")
    .select("*")
    .eq("status", "active")
    .order("ends_at", { ascending: true });

  if (error) {
    console.error("Failed to load challenges:", error);
    return [];
  }
  return (data || []) as Challenge[];
}

export async function contributeToChallenge(
  challengeId: string,
  amount: number,
  questTitle: string
): Promise<boolean> {
  const deviceId = getDeviceId();

  const { error } = await supabase.rpc("contribute_to_challenge", {
    _challenge_id: challengeId,
    _device_id: deviceId,
    _amount: amount,
    _quest_title: questTitle,
  });

  if (error) {
    console.error("Failed to contribute:", error);
    return false;
  }

  return true;
}

export async function getUserContributions(challengeId: string): Promise<number> {
  const deviceId = getDeviceId();
  const { data } = await supabase
    .from("challenge_contributions")
    .select("amount")
    .eq("challenge_id", challengeId)
    .eq("device_id", deviceId);

  return (data || []).reduce((sum, c) => sum + c.amount, 0);
}

export function getTimeRemaining(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m left`;
}
