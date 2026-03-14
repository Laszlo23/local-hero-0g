
-- Completed quests table
CREATE TABLE public.completed_quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_title text NOT NULL,
  quest_category text NOT NULL DEFAULT 'Community',
  quest_emoji text NOT NULL DEFAULT '🌟',
  points_awarded integer NOT NULL DEFAULT 0,
  completed_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.completed_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert completed quests" ON public.completed_quests
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can read completed quests" ON public.completed_quests
  FOR SELECT TO public USING (true);

-- Add level, streak, xp columns to user_profiles
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS level integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS streak integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_date date DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS quests_completed integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS trees_planted integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS neighbors_helped integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS businesses_supported integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS miles_biked numeric DEFAULT 0;

-- Function to calculate level from points
CREATE OR REPLACE FUNCTION public.calculate_level(points integer)
RETURNS integer
LANGUAGE sql IMMUTABLE
AS $$
  SELECT GREATEST(1, FLOOR(SQRT(points::numeric / 50))::integer + 1);
$$;

-- Function to update streak on quest completion
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _device_id text;
  _last_active date;
  _current_streak integer;
  _total_points integer;
BEGIN
  _device_id := NEW.device_id;

  -- Get current profile
  SELECT last_active_date, streak INTO _last_active, _current_streak
  FROM user_profiles WHERE device_id = _device_id;

  -- Calculate new streak
  IF _last_active = CURRENT_DATE THEN
    -- Same day, no streak change
    NULL;
  ELSIF _last_active = CURRENT_DATE - 1 THEN
    _current_streak := COALESCE(_current_streak, 0) + 1;
  ELSE
    _current_streak := 1;
  END IF;

  -- Get total points
  SELECT COALESCE(SUM(amount), 0) INTO _total_points
  FROM hero_points WHERE device_id = _device_id;

  -- Update profile
  UPDATE user_profiles SET
    streak = _current_streak,
    last_active_date = CURRENT_DATE,
    total_points = _total_points,
    level = public.calculate_level(_total_points),
    quests_completed = (SELECT COUNT(*) FROM completed_quests WHERE device_id = _device_id),
    updated_at = now()
  WHERE device_id = _device_id;

  RETURN NEW;
END;
$$;

-- Trigger on completed_quests insert
CREATE TRIGGER update_stats_on_quest
  AFTER INSERT ON public.completed_quests
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats();

-- Trigger on hero_points insert to keep level/total synced
CREATE TRIGGER update_stats_on_points
  AFTER INSERT ON public.hero_points
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats();

-- Enable realtime for completed_quests
ALTER PUBLICATION supabase_realtime ADD TABLE public.completed_quests;
