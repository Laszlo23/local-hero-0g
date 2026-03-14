import { supabase } from "@/integrations/supabase/client";

// Mock VAPID key for development — replace with real key later
const MOCK_VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkOs-OLy-tBVhGPJPQcTzGz7JQmqnQPEbnrdXiVz2s";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return "denied";
  }
  return await Notification.requestPermission();
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(MOCK_VAPID_PUBLIC_KEY) as BufferSource,
    });

    const subJson = subscription.toJSON();

    // Store subscription in database
    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        endpoint: subscription.endpoint,
        p256dh: subJson.keys?.p256dh ?? "",
        auth: subJson.keys?.auth ?? "",
        user_agent: navigator.userAgent,
      },
      { onConflict: "endpoint" }
    );

    if (error) console.error("Failed to save subscription:", error);
    return subscription;
  } catch (err) {
    console.error("Push subscription failed:", err);
    return null;
  }
}

export async function unsubscribeFromPush(): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await supabase.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint);
      await subscription.unsubscribe();
    }
  } catch (err) {
    console.error("Unsubscribe failed:", err);
  }
}

export async function updatePreferences(endpoint: string, prefs: {
  quest_reminders?: boolean;
  community_updates?: boolean;
  achievements?: boolean;
}): Promise<void> {
  const { error } = await supabase
    .from("push_subscriptions")
    .update({ ...prefs, updated_at: new Date().toISOString() })
    .eq("endpoint", endpoint);
  if (error) console.error("Failed to update preferences:", error);
}

export function getNotificationPermission(): NotificationPermission {
  if (!("Notification" in window)) return "denied";
  return Notification.permission;
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}
