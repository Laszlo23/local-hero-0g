
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text UNIQUE NOT NULL,
  display_name text DEFAULT '',
  bio text DEFAULT '',
  socials jsonb DEFAULT '{}'::jsonb,
  avatar_url text DEFAULT '',
  location text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert their profile" ON public.user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update their own profile" ON public.user_profiles
  FOR UPDATE USING (true);
