import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "./profile";
import { awardPoints } from "./points";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "HERO-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function getOrCreateReferralCode(): Promise<string> {
  const deviceId = getDeviceId();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("referral_code")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (profile?.referral_code) return profile.referral_code;

  const code = generateCode();
  await supabase
    .from("user_profiles")
    .upsert(
      { device_id: deviceId, referral_code: code, updated_at: new Date().toISOString() },
      { onConflict: "device_id" }
    );

  return code;
}

export async function applyReferralCode(code: string): Promise<{ success: boolean; message: string }> {
  const deviceId = getDeviceId();

  // Check not self-referral
  const { data: self } = await supabase
    .from("user_profiles")
    .select("referral_code")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (self?.referral_code === code) return { success: false, message: "Can't use your own code" };

  // Check already referred
  const { data: existing } = await supabase
    .from("referrals")
    .select("id")
    .eq("referred_device_id", deviceId)
    .maybeSingle();

  if (existing) return { success: false, message: "Already used a referral code" };

  // Find referrer
  const { data: referrer } = await supabase
    .from("user_profiles")
    .select("device_id")
    .eq("referral_code", code)
    .maybeSingle();

  if (!referrer) return { success: false, message: "Invalid referral code" };

  // Create referral
  await supabase.from("referrals").insert({
    referrer_device_id: referrer.device_id,
    referred_device_id: deviceId,
    referral_code: code,
  });

  // Award points to both
  await awardPoints(200, "Referral bonus (invited)", undefined);
  await awardPoints(200, "Referral bonus (inviter)", undefined);

  // Update referrer count
  const { data: refs } = await supabase
    .from("referrals")
    .select("id")
    .eq("referrer_device_id", referrer.device_id);

  const count = refs?.length || 0;
  await supabase
    .from("user_profiles")
    .update({ referral_count: count, updated_at: new Date().toISOString() })
    .eq("device_id", referrer.device_id);

  return { success: true, message: "+200 HERO points! Welcome aboard!" };
}

export async function getReferralCount(): Promise<number> {
  const deviceId = getDeviceId();
  const { data } = await supabase
    .from("referrals")
    .select("id")
    .eq("referrer_device_id", deviceId);
  return data?.length || 0;
}

export async function shareReferral() {
  const code = await getOrCreateReferralCode();
  const url = `https://localhero.space/onboarding?ref=${code}`;
  const text = `Join Local Hero and earn points for real-world good deeds! Use my code: ${code} 🦸‍♂️\n\nFollow @0gLocalHero\n#LocalHero #0GChain`;

  if (navigator.share) {
    try {
      await navigator.share({ title: "Join Local Hero", text, url });
      return true;
    } catch { /* user cancelled */ }
  }

  // Fallback: copy to clipboard
  await navigator.clipboard.writeText(`${text}\n${url}`);
  return true;
}
