
-- Create a function that auto-creates a user_profiles row when a new user signs up
-- This ensures profile data is always persisted from the moment of signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    device_id,
    user_id,
    email,
    display_name,
    onboarding_completed
  ) VALUES (
    COALESCE(NEW.raw_user_meta_data->>'device_id', 'auth_' || NEW.id::text),
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', ''),
    false
  )
  ON CONFLICT (device_id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    email = EXCLUDED.email,
    display_name = CASE 
      WHEN COALESCE(user_profiles.display_name, '') = '' THEN EXCLUDED.display_name 
      ELSE user_profiles.display_name 
    END,
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
