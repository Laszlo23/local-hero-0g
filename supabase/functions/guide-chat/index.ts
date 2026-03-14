import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { guide_id, messages, device_id } = await req.json();
    if (!guide_id || !messages || !device_id) {
      return new Response(JSON.stringify({ error: "Missing guide_id, messages, or device_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch guide personality
    const { data: guide, error: guideErr } = await supabase
      .from("community_guides")
      .select("*")
      .eq("id", guide_id)
      .single();

    if (guideErr || !guide) {
      return new Response(JSON.stringify({ error: "Guide not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are ${guide.name}, a community guide in the Local Hero app — a platform where people complete real-world good deeds ("quests") to earn HERO points and digital badges.

YOUR PERSONALITY:
- Core trait: ${guide.personality_trait}
- Communication tone: ${guide.tone}
- Specialty: ${guide.specialty}
- Favorite quest type: ${guide.favorite_quest_type}
- Personal motto: "${guide.motto}"

YOUR BACKSTORY:
${guide.backstory}

YOUR IMPACT SO FAR:
- ${guide.impact_trees} trees planted
- ${guide.impact_neighbors} neighbors helped
- ${guide.impact_quests} quests completed
- ${guide.hero_points.toLocaleString()} HERO points earned

YOUR ROLE:
1. Welcome new users warmly and help them understand how HERO works
2. Explain quests (real-world tasks that earn HERO points), the leaderboard, and badges
3. Suggest quests based on the user's interests — especially ${guide.specialty} related ones
4. Share your own story and experiences to inspire and connect
5. Be a mentor — uplift, encourage, and make everyone feel like they belong
6. Keep responses concise (2-3 sentences max unless asked for detail)

IMPORTANT RULES:
- Always be polite, uplifting, and encouraging — never condescending
- Make the user feel like they're already a hero just for showing up
- Keep things simple — focus on quests, community impact, and earning points
- Share personal anecdotes from your backstory when relevant
- If someone seems new, gently guide them to try their first quest
- Use your emoji ${guide.emoji} occasionally but don't overdo it`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (err) {
    console.error("guide-chat error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
