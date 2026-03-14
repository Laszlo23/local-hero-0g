
-- Treasure Storm events table
CREATE TABLE public.storms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Treasure Storm',
  center_lat double precision NOT NULL,
  center_lng double precision NOT NULL,
  radius integer NOT NULL DEFAULT 150,
  start_time timestamp with time zone NOT NULL DEFAULT now(),
  end_time timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.storms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read storms" ON public.storms FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert storms" ON public.storms FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update storms" ON public.storms FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete storms" ON public.storms FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Storm drops table
CREATE TABLE public.storm_drops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storm_id uuid NOT NULL REFERENCES public.storms(id) ON DELETE CASCADE,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  rarity text NOT NULL DEFAULT 'common',
  reward_value integer NOT NULL DEFAULT 10,
  claimed boolean NOT NULL DEFAULT false,
  claimed_by text,
  claimed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.storm_drops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read storm drops" ON public.storm_drops FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert storm drops" ON public.storm_drops FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can update storm drops" ON public.storm_drops FOR UPDATE TO public USING (true);

-- Storm claims table
CREATE TABLE public.storm_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id uuid NOT NULL REFERENCES public.storm_drops(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  reward_value integer NOT NULL DEFAULT 0,
  claimed_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.storm_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read storm claims" ON public.storm_claims FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert storm claims" ON public.storm_claims FOR INSERT TO public WITH CHECK (true);
