
-- Daily quests table: AI-generated quests per user per day
CREATE TABLE public.daily_quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  quest_date date NOT NULL DEFAULT CURRENT_DATE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  emoji text NOT NULL DEFAULT '🌟',
  category text NOT NULL DEFAULT 'Community',
  points integer NOT NULL DEFAULT 25,
  impact_type text, -- trees_planted, neighbors_helped, businesses_supported, miles_biked
  impact_value integer DEFAULT 1,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(device_id, quest_date, title)
);

ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read daily quests" ON public.daily_quests
  FOR SELECT TO public USING (true);

CREATE POLICY "Anyone can insert daily quests" ON public.daily_quests
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can update daily quests" ON public.daily_quests
  FOR UPDATE TO public USING (true);

-- Streak notifications table
CREATE TABLE public.streak_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.streak_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read streak notifications" ON public.streak_notifications
  FOR SELECT TO public USING (true);

CREATE POLICY "Anyone can insert streak notifications" ON public.streak_notifications
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can update streak notifications" ON public.streak_notifications
  FOR UPDATE TO public USING (true);

-- Enable realtime for daily_quests
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_quests;
