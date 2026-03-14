
CREATE TABLE public.community_guides (
  id serial PRIMARY KEY,
  name text NOT NULL,
  emoji text NOT NULL DEFAULT '🌟',
  personality_trait text NOT NULL,
  specialty text NOT NULL,
  backstory text NOT NULL DEFAULT '',
  tone text NOT NULL DEFAULT 'warm',
  favorite_quest_type text NOT NULL DEFAULT 'Community',
  impact_trees integer NOT NULL DEFAULT 0,
  impact_neighbors integer NOT NULL DEFAULT 0,
  impact_quests integer NOT NULL DEFAULT 0,
  hero_points integer NOT NULL DEFAULT 0,
  motto text NOT NULL DEFAULT '',
  avatar_seed integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.community_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guides" ON public.community_guides
  FOR SELECT USING (true);

CREATE POLICY "Service can manage guides" ON public.community_guides
  FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.guide_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id integer REFERENCES public.community_guides(id) NOT NULL,
  device_id text NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.guide_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read own conversations" ON public.guide_conversations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create conversations" ON public.guide_conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update conversations" ON public.guide_conversations
  FOR UPDATE USING (true);
