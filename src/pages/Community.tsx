import { useState, useEffect, useRef } from "react";
import { Search, MessageCircle, Sparkles, TreePine, Users, Heart, Send, ArrowLeft, ChevronRight, Loader2, Activity, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import ActivityFeed from "@/components/ActivityFeed";
import CommunityChallenges from "@/components/CommunityChallenges";

type Guide = {
  id: number;
  name: string;
  emoji: string;
  personality_trait: string;
  specialty: string;
  backstory: string;
  tone: string;
  favorite_quest_type: string;
  impact_trees: number;
  impact_neighbors: number;
  impact_quests: number;
  hero_points: number;
  motto: string;
  avatar_seed: number;
};

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/guide-chat`;

const avatarColors = [
  "from-rose-500 to-pink-500", "from-emerald-500 to-teal-500", "from-violet-500 to-purple-500",
  "from-amber-500 to-orange-500", "from-cyan-500 to-blue-500", "from-fuchsia-500 to-pink-500",
  "from-lime-500 to-green-500", "from-sky-500 to-indigo-500", "from-red-500 to-rose-500",
  "from-teal-500 to-cyan-500",
];

function getAvatarGradient(seed: number) {
  return avatarColors[seed % avatarColors.length];
}

const Community = () => {
  const [tab, setTab] = useState<"challenges" | "feed" | "guides">("challenges");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  if (selectedGuide) {
    return <GuideChat guide={selectedGuide} onBack={() => setSelectedGuide(null)} />;
  }

  return (
    <div className="px-5 pt-12 pb-24 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Community</h1>
        <p className="text-sm text-muted-foreground">
          See what heroes are up to & chat with AI guides
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 glass rounded-xl">
        <button
          onClick={() => setTab("challenges")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            tab === "challenges" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trophy size={14} />
          Challenges
        </button>
        <button
          onClick={() => setTab("feed")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            tab === "feed" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity size={14} />
          Feed
        </button>
        <button
          onClick={() => setTab("guides")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            tab === "guides" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageCircle size={14} />
          Guides
        </button>
      </div>

      {tab === "challenges" && <CommunityChallenges />}
      {tab === "feed" && <ActivityFeed />}
      {tab === "guides" && <GuidesTab onSelect={setSelectedGuide} />}
    </div>
  );
};

/* ──────────────── Guides Tab ──────────────── */

const GuidesTab = ({ onSelect }: { onSelect: (g: Guide) => void }) => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedAttempted, setSeedAttempted] = useState(false);
  const PAGE_SIZE = 20;

  useEffect(() => { loadGuides(0); }, []);

  const loadGuides = async (pageNum: number) => {
    setLoading(true);
    const from = pageNum * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("community_guides")
      .select("*")
      .range(from, to)
      .order("hero_points", { ascending: false });

    if (error) { console.error("Failed to load guides:", error); setLoading(false); return; }

    if (data && data.length === 0 && pageNum === 0 && !seedAttempted) {
      setSeedAttempted(true);
      setSeeding(true);
      try {
        await supabase.functions.invoke("seed-guides");
        setSeeding(false);
        const { data: retryData } = await supabase
          .from("community_guides").select("*").range(0, PAGE_SIZE - 1).order("hero_points", { ascending: false });
        if (retryData && retryData.length > 0) {
          setGuides(retryData);
          setHasMore(retryData.length === PAGE_SIZE);
        }
      } catch (e) { console.error("Seeding failed:", e); setSeeding(false); }
      setLoading(false);
      return;
    }

    if (data) {
      setGuides((prev) => (pageNum === 0 ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
    }
    setLoading(false);
    setPage(pageNum);
  };

  const filteredGuides = search
    ? guides.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.specialty.toLowerCase().includes(search.toLowerCase()) ||
        g.personality_trait.toLowerCase().includes(search.toLowerCase())
      )
    : guides;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search guides by name, trait, or specialty..."
          className="w-full h-11 pl-10 pr-4 glass rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Stats */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
        <StatChip icon={<Users size={12} />} label="777 Guides" />
        <StatChip icon={<Heart size={12} />} label="Always Online" />
        <StatChip icon={<Sparkles size={12} />} label="Powered by 0G" />
        <StatChip icon={<TreePine size={12} />} label="Real Impact" />
      </div>

      {seeding && (
        <div className="glass-card rounded-2xl p-6 text-center">
          <Loader2 size={24} className="animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">Summoning 777 guides...</p>
          <p className="text-xs text-muted-foreground">This only happens once</p>
        </div>
      )}

      <div className="space-y-2.5">
        {filteredGuides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} onSelect={() => onSelect(guide)} />
        ))}
      </div>

      {hasMore && !search && !loading && (
        <button onClick={() => loadGuides(page + 1)} className="w-full py-3 rounded-xl glass text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          Load more guides...
        </button>
      )}

      {loading && !seeding && (
        <div className="flex justify-center py-4">
          <Loader2 size={20} className="animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

/* ──────────────── Shared small components ──────────────── */

const StatChip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-full whitespace-nowrap">
    <span className="text-primary">{icon}</span>
    <span className="text-[10px] font-semibold text-foreground">{label}</span>
  </div>
);

const GuideCard = ({ guide, onSelect }: { guide: Guide; onSelect: () => void }) => (
  <button onClick={onSelect} className="w-full glass-card-hover rounded-2xl p-4 flex items-center gap-3 text-left">
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarGradient(guide.avatar_seed)} flex items-center justify-center text-xl shrink-0`}>
      {guide.emoji}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-bold text-sm text-foreground truncate">{guide.name}</p>
        <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded whitespace-nowrap">
          {guide.hero_points.toLocaleString()} HP
        </span>
      </div>
      <p className="text-xs text-muted-foreground truncate capitalize">{guide.personality_trait} · {guide.specialty}</p>
      <p className="text-[10px] text-muted-foreground/70 italic mt-0.5 truncate">"{guide.motto}"</p>
    </div>
    <ChevronRight size={14} className="text-muted-foreground shrink-0" />
  </button>
);

/* ──────────────── Guide Chat ──────────────── */

const GuideChat = ({ guide, onBack }: { guide: Guide; onBack: () => void }) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const deviceId = getDeviceId();

  // Load existing conversation on mount
  useEffect(() => {
    const loadHistory = async () => {
      const { data } = await supabase
        .from("guide_conversations")
        .select("id, messages")
        .eq("device_id", deviceId)
        .eq("guide_id", guide.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && Array.isArray(data.messages) && data.messages.length > 0) {
        setMessages(data.messages as Msg[]);
        setConversationId(data.id);
        setGreeted(true);
      } else if (!greeted) {
        setGreeted(true);
        sendMessage("Hi! I'm new here. Can you tell me about yourself and how HERO works?", true);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string, isAutoGreet = false) => {
    const userMsg: Msg = { role: "user", content: text };
    const newMessages = isAutoGreet ? [userMsg] : [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ guide_id: guide.id, messages: newMessages, device_id: deviceId }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to connect");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Oops, something went wrong. ${err.message || "Please try again!"}` },
      ]);
    }
    setIsLoading(false);

    // Persist conversation
    const finalMessages = [...newMessages];
    if (assistantSoFar) finalMessages.push({ role: "assistant", content: assistantSoFar });
    const savePayload = { device_id: deviceId, guide_id: guide.id, messages: finalMessages, updated_at: new Date().toISOString() };
    if (conversationId) {
      await supabase.from("guide_conversations").update({ messages: finalMessages, updated_at: new Date().toISOString() }).eq("id", conversationId);
    } else {
      const { data: newConv } = await supabase.from("guide_conversations").insert(savePayload).select("id").single();
      if (newConv) setConversationId(newConv.id);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="px-5 pt-12 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarGradient(guide.avatar_seed)} flex items-center justify-center text-lg shrink-0`}>
          {guide.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground truncate">{guide.name}</p>
          <p className="text-[10px] text-muted-foreground capitalize">{guide.personality_trait} · {guide.specialty}</p>
        </div>
        <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg flex items-center gap-1">
          <Sparkles size={10} /> 0G AI
        </span>
      </div>

      <div className="px-5 mb-2">
        <div className="glass-card rounded-xl p-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground italic">"{guide.motto}"</p>
            <div className="flex gap-3 mt-1.5">
              <span className="text-[9px] text-muted-foreground">🌳 {guide.impact_trees}</span>
              <span className="text-[9px] text-muted-foreground">🤝 {guide.impact_neighbors}</span>
              <span className="text-[9px] text-muted-foreground">⚡ {guide.impact_quests} quests</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 space-y-3 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "glass-card rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none [&>p]:m-0 [&>p]:leading-relaxed text-foreground">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-5 pt-2">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Ask ${guide.name.split(" ")[0]} anything...`}
            className="flex-1 h-11 rounded-xl bg-secondary border-border text-foreground"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="h-11 w-11 rounded-xl bg-primary text-primary-foreground p-0">
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Community;
