import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type EducationalQuest = Database["public"]["Tables"]["educational_quests"]["Row"];
export type EducationalQuestStep = Database["public"]["Tables"]["educational_quest_steps"]["Row"];
export type EducationalQuestProgress = Database["public"]["Tables"]["educational_quest_progress"]["Row"];

export async function listPublishedEducationalQuests(): Promise<EducationalQuest[]> {
  const { data, error } = await supabase
    .from("educational_quests")
    .select("*")
    .eq("visibility", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("listPublishedEducationalQuests:", error);
    return [];
  }
  return data ?? [];
}

export async function fetchEducationalQuestWithSteps(
  slug: string
): Promise<{ quest: EducationalQuest; steps: EducationalQuestStep[] } | null> {
  const { data: quest, error: qe } = await supabase
    .from("educational_quests")
    .select("*")
    .eq("slug", slug)
    .eq("visibility", "published")
    .maybeSingle();

  if (qe || !quest) {
    if (qe) console.error("fetchEducationalQuestWithSteps quest:", qe);
    return null;
  }

  const { data: steps, error: se } = await supabase
    .from("educational_quest_steps")
    .select("*")
    .eq("quest_id", quest.id)
    .order("step_index", { ascending: true });

  if (se) {
    console.error("fetchEducationalQuestWithSteps steps:", se);
    return null;
  }

  return { quest, steps: steps ?? [] };
}

export async function fetchEducationalProgress(
  deviceId: string,
  questId: string
): Promise<EducationalQuestProgress | null> {
  const { data } = await supabase
    .from("educational_quest_progress")
    .select("*")
    .eq("device_id", deviceId)
    .eq("quest_id", questId)
    .maybeSingle();

  return data ?? null;
}

export async function upsertEducationalProgress(row: {
  device_id: string;
  quest_id: string;
  current_step_index: number;
  completed_step_indices: number[];
  completed_at?: string | null;
}): Promise<boolean> {
  const { error } = await supabase.from("educational_quest_progress").upsert(
    {
      device_id: row.device_id,
      quest_id: row.quest_id,
      current_step_index: row.current_step_index,
      completed_step_indices: row.completed_step_indices,
      completed_at: row.completed_at ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "device_id,quest_id" }
  );

  if (error) {
    console.error("upsertEducationalProgress:", error);
    return false;
  }
  return true;
}
