import { supabase } from "@/integrations/supabase/client";

const DEVICE_ID_KEY = "hero_device_id";

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export type SocialKey = "twitter" | "instagram" | "github" | "linkedin" | "website" | "discord";

export interface UserProfile {
  device_id: string;
  display_name: string;
  bio: string;
  socials: Record<SocialKey, string>;
  avatar_url: string;
  location: string;
}

const defaultSocials: Record<SocialKey, string> = {
  twitter: "",
  instagram: "",
  github: "",
  linkedin: "",
  website: "",
  discord: "",
};

const defaultProfile: UserProfile = {
  device_id: "",
  display_name: "Alex Martinez",
  bio: "",
  socials: defaultSocials,
  avatar_url: "",
  location: "Portland, OR",
};

export async function loadProfile(): Promise<UserProfile> {
  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load profile:", error);
    return { ...defaultProfile, device_id: deviceId };
  }

  if (!data) {
    return { ...defaultProfile, device_id: deviceId };
  }

  return {
    device_id: data.device_id,
    display_name: data.display_name || defaultProfile.display_name,
    bio: data.bio || "",
    socials: { ...defaultSocials, ...(data.socials as Record<string, string>) },
    avatar_url: data.avatar_url || "",
    location: data.location || defaultProfile.location,
  };
}

export async function saveProfile(profile: Partial<UserProfile>): Promise<void> {
  const deviceId = getDeviceId();

  const { error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        device_id: deviceId,
        ...profile,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "device_id" }
    );

  if (error) console.error("Failed to save profile:", error);
}
