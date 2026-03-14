import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Find users whose last_active_date is before yesterday (streak broken)
    const { data: staleUsers } = await supabase
      .from("user_profiles")
      .select("device_id, display_name, streak, last_active_date")
      .lt("last_active_date", yesterdayStr)
      .gt("streak", 0);

    if (!staleUsers || staleUsers.length === 0) {
      return new Response(JSON.stringify({ message: "No broken streaks", count: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const notifications = [];
    const updates = [];

    for (const user of staleUsers) {
      const oldStreak = user.streak || 0;
      // Halve the streak (forgiving penalty)
      const newStreak = Math.floor(oldStreak / 2);

      updates.push(
        supabase
          .from("user_profiles")
          .update({ streak: newStreak, updated_at: new Date().toISOString() })
          .eq("device_id", user.device_id)
      );

      const message =
        newStreak > 0
          ? `Your ${oldStreak}-day streak dropped to ${newStreak} 😢 Complete a quest today to rebuild it!`
          : `You lost your ${oldStreak}-day streak! 💔 Start fresh — complete a quest today!`;

      notifications.push({
        device_id: user.device_id,
        message,
      });
    }

    // Execute updates
    await Promise.all(updates);

    // Insert notifications
    if (notifications.length > 0) {
      await supabase.from("streak_notifications").insert(notifications);
    }

    return new Response(
      JSON.stringify({ message: "Streaks checked", count: staleUsers.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("check-streaks error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
