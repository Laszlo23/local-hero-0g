import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/profile";

const StreakNotification = () => {
  const [notification, setNotification] = useState<{ id: string; message: string } | null>(null);

  useEffect(() => {
    const deviceId = getDeviceId();
    supabase
      .from("streak_notifications")
      .select("id, message")
      .eq("device_id", deviceId)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setNotification(data);
      });
  }, []);

  const dismiss = async () => {
    if (notification) {
      await supabase
        .from("streak_notifications")
        .update({ read: true })
        .eq("id", notification.id);
      setNotification(null);
    }
  };

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="rounded-xl p-3.5 flex items-start gap-3 bg-destructive/10 border border-destructive/20"
        >
          <AlertTriangle size={18} className="text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-foreground flex-1 leading-relaxed">{notification.message}</p>
          <button onClick={dismiss} className="text-muted-foreground hover:text-foreground shrink-0">
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StreakNotification;
