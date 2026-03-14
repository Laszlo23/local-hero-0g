
-- 1. Trigger to auto-update user stats when a quest is completed
CREATE OR REPLACE TRIGGER update_stats_on_quest_complete
  AFTER INSERT ON public.completed_quests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats();

-- 2. Trigger to auto-update user stats when points are awarded
CREATE OR REPLACE TRIGGER update_stats_on_points
  AFTER INSERT ON public.hero_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats();

-- 3. Atomic challenge contribution function (race-safe)
CREATE OR REPLACE FUNCTION public.contribute_to_challenge(
  _challenge_id uuid,
  _device_id text,
  _amount integer,
  _quest_title text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _is_new_participant boolean;
BEGIN
  -- Insert contribution
  INSERT INTO challenge_contributions (challenge_id, device_id, amount, quest_title)
  VALUES (_challenge_id, _device_id, _amount, _quest_title);

  -- Check if new participant
  SELECT COUNT(*) <= 1 INTO _is_new_participant
  FROM challenge_contributions
  WHERE challenge_id = _challenge_id AND device_id = _device_id;

  -- Atomic update
  UPDATE community_challenges
  SET goal_current = goal_current + _amount,
      participant_count = CASE WHEN _is_new_participant THEN participant_count + 1 ELSE participant_count END,
      updated_at = now(),
      status = CASE WHEN goal_current + _amount >= goal_target THEN 'completed' ELSE status END
  WHERE id = _challenge_id;

  RETURN true;
END;
$$;
