import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, title, body, url } = await req.json();

    // type: "quest_reminders" | "community_updates" | "achievements"
    if (!type || !title || !body) {
      return new Response(JSON.stringify({ error: "Missing type, title, or body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch subscribers with this notification type enabled
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq(type, true);

    if (error) throw error;

    // Mock: In production, use web-push library with VAPID keys
    // For now, log the notifications that would be sent
    const results = (subscriptions || []).map((sub) => ({
      endpoint: sub.endpoint.substring(0, 40) + "...",
      status: "mock_sent",
    }));

    console.log(`[send-notification] Would send "${title}" to ${results.length} subscriber(s)`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Mock: ${results.length} notification(s) queued`,
        type,
        title,
        body,
        subscribers_count: results.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-notification error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
