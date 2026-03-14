import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/profile";
import { completeQuest } from "@/lib/quests";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  points: number;
  impact_type: string | null;
  impact_value: number | null;
  completed: boolean;
  completed_at: string | null;
  quest_date: string;
}

export function useDailyQuests() {
  const { user } = useAuth();
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchQuests = useCallback(async () => {
    const deviceId = getDeviceId();
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("daily_quests")
      .select("*")
      .eq("device_id", deviceId)
      .eq("quest_date", today)
      .order("created_at");

    if (data && data.length > 0) {
      setQuests(data as unknown as DailyQuest[]);
      setLoading(false);
      return;
    }

    // No quests for today — generate them
    setGenerating(true);
    try {
      const { data: fnData, error } = await supabase.functions.invoke("generate-daily-quests", {
        body: { device_id: deviceId },
      });

      if (error) {
        console.error("Failed to generate quests:", error);
        toast({ title: "Could not generate daily quests", variant: "destructive" });
      } else if (fnData?.quests) {
        setQuests(fnData.quests as DailyQuest[]);
      }
    } catch (err) {
      console.error("Daily quest error:", err);
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const completeDaily = useCallback(async (quest: DailyQuest) => {
    if (quest.completed) return;

    // Mark as completed in daily_quests
    await supabase
      .from("daily_quests")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", quest.id);

    // Track in completed_quests + award points
    await completeQuest({
      title: quest.title,
      category: quest.category,
      emoji: quest.emoji,
      points: quest.points,
      userId: user?.id,
      impactType: quest.impact_type as any,
      impactValue: quest.impact_value || 1,
    });

    // Update local state
    setQuests((prev) =>
      prev.map((q) =>
        q.id === quest.id ? { ...q, completed: true, completed_at: new Date().toISOString() } : q
      )
    );

    toast({ title: `+${quest.points} HERO ⚡`, description: quest.title });
  }, [user]);

  const completedCount = quests.filter((q) => q.completed).length;

  return { quests, loading, generating, completedCount, completeDaily, refetch: fetchQuests };
}
