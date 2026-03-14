
-- Social campaign tasks completed by users
CREATE TABLE public.social_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  task_id text NOT NULL,
  platform text NOT NULL, -- twitter, instagram, tiktok, discord
  task_type text NOT NULL, -- follow, share, post, join, etc.
  points_awarded integer NOT NULL DEFAULT 0,
  proof_url text,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(device_id, task_id)
);

ALTER TABLE public.social_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert social tasks" ON public.social_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read social tasks" ON public.social_tasks FOR SELECT USING (true);

-- Treegens dynamic NFTs
CREATE TABLE public.treegens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  name text NOT NULL DEFAULT 'Seedling',
  species text NOT NULL DEFAULT 'Oak',
  stage integer NOT NULL DEFAULT 1, -- 1=seed, 2=sprout, 3=sapling, 4=tree, 5=ancient, 6=mythic, 7=legendary
  xp integer NOT NULL DEFAULT 0,
  xp_next_level integer NOT NULL DEFAULT 100,
  traits jsonb NOT NULL DEFAULT '{}',
  visual_seed integer NOT NULL DEFAULT 0,
  rarity text NOT NULL DEFAULT 'common', -- common, uncommon, rare, epic, legendary, mythic
  chain_token_id text,
  chain_tx_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(device_id)
);

ALTER TABLE public.treegens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read treegens" ON public.treegens FOR SELECT USING (true);
CREATE POLICY "Anyone can create treegens" ON public.treegens FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update treegens" ON public.treegens FOR UPDATE USING (true);

-- Early adopter badges
CREATE TABLE public.founder_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  badge_type text NOT NULL, -- genesis_hero, founding_member, og_pioneer, social_champion
  tier text NOT NULL DEFAULT 'bronze', -- bronze, silver, gold, diamond
  metadata jsonb NOT NULL DEFAULT '{}',
  minted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(device_id, badge_type)
);

ALTER TABLE public.founder_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read badges" ON public.founder_badges FOR SELECT USING (true);
CREATE POLICY "Anyone can create badges" ON public.founder_badges FOR INSERT WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.treegens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.founder_badges;
