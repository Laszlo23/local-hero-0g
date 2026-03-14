
-- Points ledger table
CREATE TABLE public.hero_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  amount integer NOT NULL,
  reason text NOT NULL,
  quest_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert points" ON public.hero_points FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read points" ON public.hero_points FOR SELECT USING (true);

-- Referrals table
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_device_id text NOT NULL,
  referred_device_id text NOT NULL,
  referral_code text NOT NULL,
  points_awarded boolean NOT NULL DEFAULT false,
  badge_unlocked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(referred_device_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert referrals" ON public.referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read referrals" ON public.referrals FOR SELECT USING (true);
CREATE POLICY "Anyone can update referrals" ON public.referrals FOR UPDATE USING (true);

-- Extend user_profiles
ALTER TABLE public.user_profiles 
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS total_points integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS session_start timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS referral_count integer DEFAULT 0;

-- Enable realtime for hero_points
ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_points;
