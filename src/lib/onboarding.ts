import { supabase } from "@/integrations/supabase/client";

interface OnboardingStatusParams {
  userId?: string | null;
  deviceId: string;
}

export async function hasCompletedOnboarding({ userId, deviceId }: OnboardingStatusParams): Promise<boolean> {
  if (userId) {
    const { data: userRecord, error: userError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", userId)
      .eq("onboarding_completed", true)
      .limit(1)
      .maybeSingle();

    if (!userError && userRecord) {
      return true;
    }
  }

  const { data: deviceRecord, error: deviceError } = await supabase
    .from("user_profiles")
    .select("onboarding_completed")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (deviceError) {
    console.error("Failed to check onboarding status:", deviceError);
    return false;
  }

  return !!deviceRecord?.onboarding_completed;
}
