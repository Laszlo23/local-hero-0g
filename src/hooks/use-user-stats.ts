import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getDeviceId } from "@/lib/profile";

export interface UserStats {
  display_name: string;
  avatar_url: string;
  bio: string;
  location: string;
  total_points: number;
  level: number;
  streak: number;
  quests_completed: number;
  trees_planted: number;
  neighbors_helped: number;
  businesses_supported: number;
  miles_biked: number;
  referral_count: number;
  onboarding_completed: boolean;
  hero_pledge_signed: boolean;
  profile_quest_step: number;
  trust_score: number;
  socials: Record<string, string>;
}

const defaults: UserStats = {
  display_name: "Hero",
  avatar_url: "",
  bio: "",
  location: "",
  total_points: 0,
  level: 1,
  streak: 0,
  quests_completed: 0,
  trees_planted: 0,
  neighbors_helped: 0,
  businesses_supported: 0,
  miles_biked: 0,
  referral_count: 0,
  onboarding_completed: false,
  hero_pledge_signed: false,
  profile_quest_step: 0,
  trust_score: 0,
  socials: {},
};

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>(defaults);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const deviceId = getDeviceId();
    const { data } = await supabase
      .from("user_profiles")
      .select("display_name, avatar_url, bio, location, total_points, level, streak, quests_completed, trees_planted, neighbors_helped, businesses_supported, miles_biked, referral_count, onboarding_completed, hero_pledge_signed, profile_quest_step, trust_score, socials")
      .eq("device_id", deviceId)
      .maybeSingle();

    if (data) {
      setStats({
        display_name: data.display_name || user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Hero",
        avatar_url: data.avatar_url || user?.user_metadata?.avatar_url || "",
        bio: data.bio || "",
        location: data.location || "",
        total_points: data.total_points || 0,
        level: data.level || 1,
        streak: data.streak || 0,
        quests_completed: data.quests_completed || 0,
        trees_planted: data.trees_planted || 0,
        neighbors_helped: data.neighbors_helped || 0,
        businesses_supported: data.businesses_supported || 0,
        miles_biked: data.miles_biked || 0,
        referral_count: data.referral_count || 0,
        onboarding_completed: data.onboarding_completed || false,
        hero_pledge_signed: data.hero_pledge_signed || false,
        profile_quest_step: data.profile_quest_step || 0,
        trust_score: data.trust_score || 0,
        socials: (data.socials as Record<string, string>) || {},
      });
    } else {
      setStats({
        ...defaults,
        display_name: user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Hero",
        avatar_url: user?.user_metadata?.avatar_url || "",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel("user-stats")
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "user_profiles",
        filter: `device_id=eq.${getDeviceId()}`,
      }, () => fetchStats())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return { stats, loading, refetch: fetchStats };
}
