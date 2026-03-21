import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { Navigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import {
  Brain, Zap, Users, Handshake, Coins, TreePine,
  Send, Loader2, Activity, TrendingUp, Target, Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ECOSYSTEM_AGENTS, type EcosystemAgentId } from "@/lib/agents";

const AGENT_ICONS: Record<EcosystemAgentId, LucideIcon> = {
  quest: Target,
  growth: TrendingUp,
  partner: Handshake,
  reward: Coins,
  community: Users,
  impact: TreePine,
};

const AGENT_COLORS: Record<EcosystemAgentId, string> = {
  quest: "text-emerald-400",
  growth: "text-blue-400",
  partner: "text-amber-400",
  reward: "text-yellow-400",
  community: "text-pink-400",
  impact: "text-green-400",
};

const AGENTS = ECOSYSTEM_AGENTS.map((a) => ({
  ...a,
  icon: AGENT_ICONS[a.id],
  color: AGENT_COLORS[a.id],
  desc: a.shortDesc,
}));

interface Metrics {
  totalUsers: number;
  totalQuests: number;
  totalPoints: number;
  treesPlanted: number;
  neighborsHelped: number;
  businessesSupported: number;
  activeChallenges: number;
  questsToday: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Overmind = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMetrics = async () => {
    const [profiles, quests, challenges, dailyToday] = await Promise.all([
      supabase.from("user_profiles").select("total_points, trees_planted, neighbors_helped, businesses_supported", { count: "exact" }),
      supabase.from("completed_quests").select("id", { count: "exact" }),
      supabase.from("community_challenges").select("id", { count: "exact" }).eq("status", "active"),
      supabase.from("daily_quests").select("id", { count: "exact" }).eq("quest_date", new Date().toISOString().split("T")[0]),
    ]);

    const users = profiles.data || [];
    setMetrics({
      totalUsers: profiles.count || 0,
      totalQuests: quests.count || 0,
      totalPoints: users.reduce((s, u) => s + (u.total_points || 0), 0),
      treesPlanted: users.reduce((s, u) => s + (u.trees_planted || 0), 0),
      neighborsHelped: users.reduce((s, u) => s + (u.neighbors_helped || 0), 0),
      businessesSupported: users.reduce((s, u) => s + (u.businesses_supported || 0), 0),
      activeChallenges: challenges.count || 0,
      questsToday: dailyToday.count || 0,
    });
  };

  const sendCommand = async () => {
    if (!input.trim() || streaming) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setStreaming(true);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/overmind-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: allMessages, metrics }),
        }
      );

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantSoFar = "";

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      let done = false;
      while (!done) {
        const { done: rd, value } = await reader.read();
        if (rd) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      toast({ title: "Overmind error", description: e.message, variant: "destructive" });
    } finally {
      setStreaming(false);
    }
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/app" replace />;

  const statCards = metrics
    ? [
        { label: "Heroes", value: metrics.totalUsers, icon: Users },
        { label: "Quests Done", value: metrics.totalQuests, icon: Zap },
        { label: "Today's Quests", value: metrics.questsToday, icon: Activity },
        { label: "HERO Points", value: metrics.totalPoints.toLocaleString(), icon: Coins },
        { label: "Trees Planted", value: metrics.treesPlanted, icon: TreePine },
        { label: "Neighbors Helped", value: metrics.neighborsHelped, icon: Handshake },
        { label: "Businesses", value: metrics.businessesSupported, icon: Globe },
        { label: "Active Challenges", value: metrics.activeChallenges, icon: Target },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Brain className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">OMD – Overmind</h1>
          <p className="text-sm text-muted-foreground">LocalHero Autonomous Ecosystem Agent</p>
        </div>
        <Badge variant="outline" className="ml-auto border-primary/40 text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-1.5 inline-block" />
          Online
        </Badge>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <Card key={s.label} className="bg-card/60 backdrop-blur border-border/40">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="command" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="command">Command Center</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="vision">Vision</TabsTrigger>
        </TabsList>

        {/* Command Center */}
        <TabsContent value="command" className="space-y-4">
          <Card className="bg-card/60 backdrop-blur border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> Founder Terminal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-[400px] overflow-y-auto space-y-3 p-3 rounded-lg bg-background/60 border border-border/30">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-16 space-y-3">
                    <Brain className="w-10 h-10 mx-auto opacity-30" />
                    <p>Issue commands to the Overmind</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "Launch a city challenge in Berlin",
                        "Create quests for schools",
                        "Design a viral campaign",
                        "Ecosystem health report",
                      ].map((ex) => (
                        <button
                          key={ex}
                          onClick={() => setInput(ex)}
                          className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition"
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/60 text-foreground"
                      }`}
                    >
                      {m.role === "assistant" ? (
                        <div className="prose prose-sm prose-invert max-w-none">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))}
                {streaming && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" /> Overmind thinking…
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. 'recruit 100 partner cafes in Amsterdam'"
                  className="resize-none min-h-[44px] max-h-[120px] bg-background/60"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendCommand();
                    }
                  }}
                />
                <Button onClick={sendCommand} disabled={streaming || !input.trim()} size="icon" className="shrink-0">
                  {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agents */}
        <TabsContent value="agents">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENTS.map((agent) => (
              <Card key={agent.id} className="bg-card/60 backdrop-blur border-border/40 hover:border-primary/30 transition">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <agent.icon className={`w-5 h-5 ${agent.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-muted-foreground">Active</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Vision */}
        <TabsContent value="vision">
          <Card className="bg-card/60 backdrop-blur border-border/40">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-foreground">🚀 Ecosystem Growth Targets</h3>
              {[
                { year: "Year 1", users: "100K", quests: "10K", partners: "1K" },
                { year: "Year 3", users: "1M", quests: "100K", partners: "10K" },
                { year: "Year 5", users: "10M", quests: "Global", partners: "$100M" },
              ].map((m) => (
                <div key={m.year} className="flex items-center gap-4 p-3 rounded-lg bg-background/40 border border-border/20">
                  <Badge variant="outline" className="border-primary/40 text-primary font-bold">{m.year}</Badge>
                  <div className="flex gap-6 text-sm">
                    <span><span className="text-muted-foreground">Users:</span> <span className="text-foreground font-semibold">{m.users}</span></span>
                    <span><span className="text-muted-foreground">Quests:</span> <span className="text-foreground font-semibold">{m.quests}</span></span>
                    <span><span className="text-muted-foreground">Partners:</span> <span className="text-foreground font-semibold">{m.partners}</span></span>
                  </div>
                </div>
              ))}

              <h3 className="text-lg font-bold text-foreground pt-4">🌍 Ecosystem Expansion</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                {[
                  { title: "Quest Marketplace", desc: "Creators launch quests and earn when completed" },
                  { title: "Local Economy", desc: "Redeem HERO for coffee, food, events, perks" },
                  { title: "Community Challenges", desc: "City-wide missions with collective goals" },
                  { title: "Creator Economy", desc: "Launch tours, AR challenges, community missions" },
                ].map((item) => (
                  <div key={item.title} className="p-3 rounded-lg bg-background/40 border border-border/20">
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-muted-foreground text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Overmind;
