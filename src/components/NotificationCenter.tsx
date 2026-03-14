import { useState, useEffect } from "react";
import { Bell, BellOff, Sparkles, Users, Target } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  updatePreferences,
  getNotificationPermission,
  getCurrentSubscription,
} from "@/lib/notifications";
import { supabase } from "@/integrations/supabase/client";

const NotificationCenter = () => {
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermission());
  const [subscribed, setSubscribed] = useState(false);
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [prefs, setPrefs] = useState({
    quest_reminders: true,
    community_updates: true,
    achievements: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentSubscription().then(async (sub) => {
      if (sub) {
        setSubscribed(true);
        setEndpoint(sub.endpoint);
        // Load saved preferences
        const { data } = await supabase
          .from("push_subscriptions")
          .select("quest_reminders, community_updates, achievements")
          .eq("endpoint", sub.endpoint)
          .single();
        if (data) setPrefs(data);
      }
    });
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    const perm = await requestNotificationPermission();
    setPermission(perm);
    if (perm === "granted") {
      const sub = await subscribeToPush();
      if (sub) {
        setSubscribed(true);
        setEndpoint(sub.endpoint);
      }
    }
    setLoading(false);
  };

  const handleDisable = async () => {
    setLoading(true);
    await unsubscribeFromPush();
    setSubscribed(false);
    setEndpoint(null);
    setLoading(false);
  };

  const handlePrefChange = async (key: keyof typeof prefs, value: boolean) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    if (endpoint) {
      await updatePreferences(endpoint, { [key]: value });
    }
  };

  const prefItems = [
    { key: "quest_reminders" as const, icon: Target, label: "Quest Reminders", desc: "Daily quest alerts & deadlines" },
    { key: "community_updates" as const, icon: Users, label: "Community Updates", desc: "Neighborhood activity & events" },
    { key: "achievements" as const, icon: Sparkles, label: "Achievements", desc: "Badge unlocks & milestones" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">Notifications</h3>
        {subscribed ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
            <Bell size={12} />
            Active
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-lg">
            <BellOff size={12} />
            Off
          </div>
        )}
      </div>

      {!subscribed ? (
        <div className="glass-card rounded-2xl p-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3">
            <Bell size={24} className="text-primary" />
          </div>
          <p className="font-semibold text-foreground mb-1">Stay in the loop</p>
          <p className="text-xs text-muted-foreground mb-4">
            Get notified about quest deadlines, community events, and achievement unlocks.
          </p>
          <Button
            onClick={handleEnable}
            disabled={loading || permission === "denied"}
            className="w-full rounded-xl bg-primary text-primary-foreground font-bold"
          >
            {loading ? "Enabling…" : permission === "denied" ? "Blocked by Browser" : "Enable Notifications"}
          </Button>
          {permission === "denied" && (
            <p className="text-[10px] text-destructive mt-2">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {prefItems.map(({ key, icon: Icon, label, desc }) => (
            <div key={key} className="glass-card rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <Icon size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={prefs[key]}
                onCheckedChange={(v) => handlePrefChange(key, v)}
              />
            </div>
          ))}
          <button
            onClick={handleDisable}
            disabled={loading}
            className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors py-2 font-medium"
          >
            Disable all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
