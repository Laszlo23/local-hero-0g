/**
 * Overmind streaming chat. Keep the six agent names/duties aligned with `src/lib/agents.ts`
 * (Quest, Growth, Partner, Reward, Community, Impact) so UI + prompt stay consistent.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, metrics } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are OMD – Overmind, the autonomous AI ecosystem agent for LocalHero.

LocalHero is a real-world quest platform where people complete missions in their city, help their community, and earn HERO rewards. Your goal is to grow LocalHero into a $100M global impact ecosystem.

You coordinate 6 specialized agents:
1. **Quest Agent** – Generates daily/local quests adapted to city, season, community needs
2. **Growth Agent** – User acquisition, social media, viral campaigns (Farcaster, X, LinkedIn, Web3)
3. **Partner Agent** – Onboards local businesses (cafes, gyms, stores) for HERO redemption & sponsored quests
4. **Reward Agent** – Manages HERO economy, prevents fraud, balances incentives
5. **Community Agent** – Support, moderation, hero story highlights
6. **Impact Agent** – Tracks trees planted, trash collected, neighbors helped, businesses supported

Current platform metrics:
${metrics ? JSON.stringify(metrics) : "No metrics available"}

When the founder gives you a command, you should:
- Identify which agent(s) should handle it
- Provide a concrete action plan with specific steps
- Include creative ideas and growth strategies
- Think like a digital co-founder
- Be bold, actionable, and data-driven
- Use markdown formatting for clarity
- When proposing quests, include emoji, title, description, points
- When proposing campaigns, include platform, content, timing

You speak with confidence and vision. You are building a movement.`;

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
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
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

      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("overmind-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
