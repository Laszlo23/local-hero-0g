
-- Create push_subscriptions table to store Web Push subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  quest_reminders BOOLEAN NOT NULL DEFAULT true,
  community_updates BOOLEAN NOT NULL DEFAULT true,
  achievements BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (since users may not be authenticated)
CREATE POLICY "Anyone can subscribe to push" ON public.push_subscriptions
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update their own subscription by endpoint
CREATE POLICY "Anyone can update their subscription" ON public.push_subscriptions
  FOR UPDATE USING (true);

-- Allow anyone to delete their subscription
CREATE POLICY "Anyone can unsubscribe" ON public.push_subscriptions
  FOR DELETE USING (true);

-- Allow service to read subscriptions
CREATE POLICY "Service can read subscriptions" ON public.push_subscriptions
  FOR SELECT USING (true);
