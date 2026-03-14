import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { getPoints } from "@/lib/points";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/profile";

const PointsBadge = () => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    getPoints().then(setPoints);

    // Listen for realtime updates
    const channel = supabase
      .channel("points-badge")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "hero_points", filter: `device_id=eq.${getDeviceId()}` },
        () => getPoints().then(setPoints)
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-md border border-border text-xs font-bold text-accent">
      <Sparkles size={12} />
      <span className="font-mono">{points}</span>
      <span className="text-muted-foreground font-normal">HERO</span>
    </div>
  );
};

export default PointsBadge;
