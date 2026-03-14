
-- Activity feed table
CREATE TABLE public.activity_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  display_name text NOT NULL DEFAULT 'Hero',
  avatar_url text,
  event_type text NOT NULL DEFAULT 'quest_completed',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  emoji text NOT NULL DEFAULT '🌟',
  points integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read feed" ON public.activity_feed FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can post to feed" ON public.activity_feed FOR INSERT TO public WITH CHECK (true);

-- Activity reactions table
CREATE TABLE public.activity_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES public.activity_feed(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  reaction text NOT NULL DEFAULT '🔥',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(activity_id, device_id, reaction)
);

ALTER TABLE public.activity_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reactions" ON public.activity_reactions FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can add reactions" ON public.activity_reactions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can remove own reactions" ON public.activity_reactions FOR DELETE TO public USING (true);

-- Enable realtime for activity feed
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_reactions;

-- Index for fast feed queries
CREATE INDEX idx_activity_feed_created ON public.activity_feed(created_at DESC);
CREATE INDEX idx_activity_reactions_activity ON public.activity_reactions(activity_id);
