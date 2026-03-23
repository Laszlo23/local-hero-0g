import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { EducationalQuestDraft } from "./api";

export type EducationalQuest = Database["public"]["Tables"]["educational_quests"]["Row"];
export type EducationalQuestStep = Database["public"]["Tables"]["educational_quest_steps"]["Row"];
export type EducationalQuestProgress = Database["public"]["Tables"]["educational_quest_progress"]["Row"];
export type EducationalQuestVisibility = "draft" | "published" | "archived";

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

export async function listRecentEducationalQuests(
  limit = 20,
  creatorDeviceId?: string
): Promise<EducationalQuest[]> {
  let query = supabase
    .from("educational_quests")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (creatorDeviceId) {
    query = query.eq("creator_device_id", creatorDeviceId);
  }
  const { data, error } = await query;
  if (error) {
    console.error("listRecentEducationalQuests:", error);
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

function normalizeSlug(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Saves generated draft as `draft` visibility to Supabase.
 * Returns created quest id.
 */
export async function saveEducationalQuestDraft(
  draft: EducationalQuestDraft,
  creatorDeviceId: string
): Promise<string> {
  const baseSlug = normalizeSlug(draft.slug || draft.title);
  const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

  const { data: insertedQuest, error: questErr } = await supabase
    .from("educational_quests")
    .insert({
      slug: uniqueSlug,
      title: draft.title,
      summary: draft.summary,
      age_min: draft.ageMin,
      age_max: draft.ageMax,
      learning_objectives: draft.learningObjectives,
      subject_tags: draft.subjectTags,
      quest_type: draft.questType,
      points_per_step: draft.pointsPerStep,
      bonus_complete: draft.bonusComplete,
      visibility: "draft",
      creator_device_id: creatorDeviceId,
    })
    .select("id")
    .single();

  if (questErr || !insertedQuest) {
    throw new Error(questErr?.message || "Failed to save draft quest");
  }

  const questId = insertedQuest.id;
  const steps = draft.steps.map((s, idx) => ({
    quest_id: questId,
    step_index: idx,
    title: s.title,
    instruction: s.instruction,
    evidence_type: s.evidenceType,
    ar_visual: s.arVisual,
    ar_emoji: s.arEmoji,
    ar_x: s.arX,
    ar_y: s.arY,
    qr_expected: s.qrExpected ?? null,
    quiz_prompt: s.quizPrompt ?? null,
    quiz_option_a: s.quizOptionA ?? null,
    quiz_option_b: s.quizOptionB ?? null,
    quiz_correct: s.quizCorrect ?? null,
    points_override: s.pointsOverride ?? null,
  }));

  const { error: stepsErr } = await supabase.from("educational_quest_steps").insert(steps);
  if (stepsErr) {
    throw new Error(stepsErr.message || "Failed to save draft steps");
  }
  return questId;
}

export async function setEducationalQuestVisibility(
  questId: string,
  visibility: EducationalQuestVisibility
): Promise<boolean> {
  const { error } = await supabase
    .from("educational_quests")
    .update({ visibility, updated_at: new Date().toISOString() })
    .eq("id", questId);
  if (error) {
    console.error("setEducationalQuestVisibility:", error);
    return false;
  }
  return true;
}
