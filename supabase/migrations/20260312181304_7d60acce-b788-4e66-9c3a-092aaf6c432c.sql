
ALTER TABLE public.user_profiles 
  ADD COLUMN IF NOT EXISTS trust_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS profile_quest_step integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hero_pledge_signed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS hero_pledge_signed_at timestamp with time zone;
