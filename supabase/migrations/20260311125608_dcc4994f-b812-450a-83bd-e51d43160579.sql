
-- Community challenges table
CREATE TABLE public.community_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  emoji text NOT NULL DEFAULT '🎯',
  goal_type text NOT NULL DEFAULT 'trees_planted',
  goal_target integer NOT NULL DEFAULT 1000,
  goal_current integer NOT NULL DEFAULT 0,
  reward_points integer NOT NULL DEFAULT 100,
  reward_badge text DEFAULT NULL,
  starts_at timestamp with time zone NOT NULL DEFAULT now(),
  ends_at timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'active',
  participant_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Individual contributions
CREATE TABLE public.challenge_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.community_challenges(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  amount integer NOT NULL DEFAULT 1,
  quest_title text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read challenges" ON public.community_challenges FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can read contributions" ON public.challenge_contributions FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can contribute" ON public.challenge_contributions FOR INSERT TO public WITH CHECK (true);

-- Enable realtime for live progress
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_challenges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_contributions;
