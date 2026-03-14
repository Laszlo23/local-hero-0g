-- Remove duplicate trigger on completed_quests (keep update_stats_on_quest_complete)
DROP TRIGGER IF EXISTS update_stats_on_quest ON completed_quests;