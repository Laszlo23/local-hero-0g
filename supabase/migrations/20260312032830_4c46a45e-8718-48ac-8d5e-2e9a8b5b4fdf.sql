
CREATE TABLE public.discovery_drops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  rarity text NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'legendary')),
  reward_type text NOT NULL DEFAULT 'token' CHECK (reward_type IN ('token', 'nft', 'partner_reward')),
  reward_value integer NOT NULL DEFAULT 25,
  max_claims integer NOT NULL DEFAULT 100,
  current_claims integer NOT NULL DEFAULT 0,
  starts_at timestamp with time zone NOT NULL DEFAULT now(),
  ends_at timestamp with time zone NOT NULL,
  image_url text,
  sponsor_name text,
  sponsor_logo text,
  sponsor_reward_description text,
  creator_user_id uuid,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.discovery_drop_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id uuid NOT NULL REFERENCES public.discovery_drops(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  user_id uuid,
  claimed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(drop_id, device_id)
);

ALTER TABLE public.discovery_drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_drop_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active drops" ON public.discovery_drops FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert drops" ON public.discovery_drops FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update drops" ON public.discovery_drops FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete drops" ON public.discovery_drops FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read claims" ON public.discovery_drop_claims FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert claims" ON public.discovery_drop_claims FOR INSERT TO public WITH CHECK (true);
