import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "./profile";

export async function awardPoints(amount: number, reason: string, questId?: string): Promise<boolean> {
  const deviceId = getDeviceId();

  const { error } = await supabase.from("hero_points").insert({
    device_id: deviceId,
    amount,
    reason,
    quest_id: questId,
  });

  if (error) {
    console.error("Failed to award points:", error);
    return false;
  }

  // Profile stats (total_points, level, streak) are auto-updated by DB trigger
  return true;
}

export async function getPoints(): Promise<number> {
  const deviceId = getDeviceId();
  const { data } = await supabase
    .from("hero_points")
    .select("amount")
    .eq("device_id", deviceId);

  return (data || []).reduce((sum, p) => sum + p.amount, 0);
}

export async function getPointsHistory() {
  const deviceId = getDeviceId();
  const { data } = await supabase
    .from("hero_points")
    .select("*")
    .eq("device_id", deviceId)
    .order("created_at", { ascending: false })
    .limit(50);

  return data || [];
}
