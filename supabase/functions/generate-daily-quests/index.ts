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
    const { device_id } = await req.json();
    if (!device_id) throw new Error("device_id required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split("T")[0];

    // Check if quests already exist for today
    const { data: existing } = await supabase
      .from("daily_quests")
      .select("id")
      .eq("device_id", device_id)
      .eq("quest_date", today)
      .limit(1);

    if (existing && existing.length > 0) {
      // Return existing quests
      const { data: quests } = await supabase
        .from("daily_quests")
        .select("*")
        .eq("device_id", device_id)
        .eq("quest_date", today)
        .order("created_at");

      return new Response(JSON.stringify({ quests }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user profile for context
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("display_name, location, quests_completed, trees_planted, neighbors_helped")
      .eq("device_id", device_id)
      .maybeSingle();

    // Get recently completed quests to avoid repeats
    const { data: recent } = await supabase
      .from("completed_quests")
      .select("quest_title")
      .eq("device_id", device_id)
      .order("completed_at", { ascending: false })
      .limit(10);

    const recentTitles = recent?.map((r) => r.quest_title).join(", ") || "none";
    const dayOfWeek = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const month = new Date().toLocaleDateString("en-US", { month: "long" });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a quest generator for Local Hero, a community impact app. Generate exactly 3 unique daily quests that encourage real-world community action. Each quest should be specific, achievable in 15-30 minutes, and feel meaningful. Consider the day (${dayOfWeek}), season (${month}), and the user's location (${profile?.location || "a city"}).`,
          },
          {
            role: "user",
            content: `Generate 3 daily quests for ${profile?.display_name || "a hero"} (${profile?.quests_completed || 0} quests completed, ${profile?.trees_planted || 0} trees planted). Avoid these recent quests: ${recentTitles}.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_quests",
              description: "Generate 3 daily community quests",
              parameters: {
                type: "object",
                properties: {
                  quests: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Short quest title (3-6 words)" },
                        description: { type: "string", description: "One sentence describing what to do" },
                        emoji: { type: "string", description: "Single emoji representing the quest" },
                        category: { type: "string", enum: ["Community", "Environment", "Wellness", "Local Business", "Education"] },
                        points: { type: "number", description: "Points reward 20-75" },
                        impact_type: { type: "string", enum: ["trees_planted", "neighbors_helped", "businesses_supported", "miles_biked"] },
                        impact_value: { type: "number", description: "Impact amount, usually 1" },
                      },
                      required: ["title", "description", "emoji", "category", "points", "impact_type", "impact_value"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["quests"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_quests" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits required." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fallback quests if AI fails
      const fallback = [
        { title: "Help a neighbor", description: "Check in on someone nearby", emoji: "🤝", category: "Community", points: 30, impact_type: "neighbors_helped", impact_value: 1 },
        { title: "Pick up litter", description: "Clean up trash in your area", emoji: "🗑️", category: "Environment", points: 25, impact_type: "trees_planted", impact_value: 0 },
        { title: "Support local shop", description: "Buy something from a local business", emoji: "🏪", category: "Local Business", points: 35, impact_type: "businesses_supported", impact_value: 1 },
      ];

      const rows = fallback.map((q) => ({ ...q, device_id, quest_date: today }));
      await supabase.from("daily_quests").insert(rows);
      const { data: quests } = await supabase.from("daily_quests").select("*").eq("device_id", device_id).eq("quest_date", today).order("created_at");
      return new Response(JSON.stringify({ quests }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let generatedQuests: any[];

    try {
      generatedQuests = JSON.parse(toolCall.function.arguments).quests;
    } catch {
      throw new Error("Failed to parse AI response");
    }

    // Insert generated quests
    const rows = generatedQuests.slice(0, 3).map((q: any) => ({
      device_id,
      quest_date: today,
      title: q.title,
      description: q.description,
      emoji: q.emoji,
      category: q.category,
      points: Math.min(75, Math.max(20, q.points)),
      impact_type: q.impact_type,
      impact_value: q.impact_value || 1,
    }));

    await supabase.from("daily_quests").insert(rows);

    const { data: quests } = await supabase
      .from("daily_quests")
      .select("*")
      .eq("device_id", device_id)
      .eq("quest_date", today)
      .order("created_at");

    return new Response(JSON.stringify({ quests }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-daily-quests error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
