
CREATE TABLE public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL DEFAULT '',
  total_points integer NOT NULL DEFAULT 0,
  student_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read schools" ON public.schools FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert schools" ON public.schools FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update schools" ON public.schools FOR UPDATE TO public USING (true);

CREATE TABLE public.cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL DEFAULT '🏙️',
  total_points integer NOT NULL DEFAULT 0,
  hero_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cities" ON public.cities FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert cities" ON public.cities FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update cities" ON public.cities FOR UPDATE TO public USING (true);
