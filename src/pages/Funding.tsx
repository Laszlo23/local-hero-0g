import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Heart, Rocket, Shield, Server, Cpu, Users, Zap,
  ArrowRight, CheckCircle2, Sparkles, Crown, Star,
  Globe, TreePine, ChevronRight
} from "lucide-react";
import heroLogo from "@/assets/hero-logo-glow.png";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

/* ─── PRESET AMOUNTS ─── */
const presets = [5, 10, 25, 50, 100, 250];

/* ─── WHERE IT GOES ─── */
const fundingUses = [
  { icon: <Server size={18} />, label: "Servers & Hosting", pct: 30, desc: "Keep the app fast, reliable, and always online for every hero" },
  { icon: <Cpu size={18} />, label: "AI & Smart Features", pct: 25, desc: "Power the quest engine, community guides, and intelligent matching" },
  { icon: <Users size={18} />, label: "Community Growth", pct: 20, desc: "Onboard new cities, schools, and neighborhoods onto the platform" },
  { icon: <Shield size={18} />, label: "Safety & Moderation", pct: 15, desc: "Keep the platform safe, fair, and free from abuse" },
  { icon: <Globe size={18} />, label: "Open Source & Transparency", pct: 10, desc: "Publish impact reports and keep the codebase community-driven" },
];

/* ─── OG TIERS ─── */
const ogTiers = [
  { min: 5, title: "Seed Planter", emoji: "🌱", color: "text-primary", desc: "You helped it start" },
  { min: 25, title: "Block Captain", emoji: "🏘️", color: "text-hero-yellow", desc: "You own a piece of the story" },
  { min: 100, title: "Founding Hero", emoji: "🦸", color: "text-hero-orange", desc: "Your name lives in the code" },
  { min: 250, title: "Legend", emoji: "👑", color: "text-hero-purple", desc: "You made Local Hero possible" },
];

const FundingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const effectiveAmount = amount ?? (parseFloat(customAmount) || 0);

  const currentTier = [...ogTiers].reverse().find(t => effectiveAmount >= t.min) || null;

  const handleFund = async () => {
    if (effectiveAmount < 1) {
      toast.error("Minimum contribution is $1");
      return;
    }
    if (effectiveAmount > 10000) {
      toast.error("Maximum contribution is $10,000");
      return;
    }

    if (!user) {
      toast.info("Please sign in first to contribute.");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-funding-checkout", {
        body: { amount: Math.round(effectiveAmount * 100) },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <img src={heroLogo} alt="" className="w-7 h-7" />
            <span className="font-display font-bold text-base text-foreground">Local<span className="text-gradient-hero">Hero</span></span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/business")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Business</button>
            <button onClick={() => navigate("/auth")} className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-hero-glow text-primary-foreground glow-green">
              Join
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[500px] h-[400px] bg-hero-yellow/8 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6">
              <Heart size={14} className="text-hero-orange" />
              <span className="text-xs font-bold text-hero-orange">OG Supporters</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-6">
              <span className="text-gradient-white">Help Us Build</span><br />
              <span className="text-gradient-hero">Something Real</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-3">
              Local Hero is built by a tiny team with a big mission. Every dollar goes directly to keeping the lights on and the quests running.
            </p>
            <p className="text-sm text-muted-foreground/80 max-w-xl mx-auto mb-10">
              No VC bloat. No ad revenue. Just <span className="text-foreground font-medium">real people funding a real movement.</span> Pay what you want — every contribution matters.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FUNDING CARD ═══ */}
      <section className="px-6 pb-20 -mt-4">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-hero-yellow/5 via-transparent to-primary/5" />
              <div className="relative z-10">
                {/* Amount presets */}
                <p className="text-sm font-bold text-foreground mb-4">Choose an amount</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                  {presets.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setAmount(p); setCustomAmount(""); }}
                      className={`py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.96] ${
                        amount === p
                          ? "bg-gradient-hero-glow text-primary-foreground glow-green"
                          : "glass hover:bg-secondary/50 text-foreground"
                      }`}
                    >
                      ${p}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount(null);
                    }}
                    className="w-full pl-8 pr-4 py-3 rounded-xl glass bg-secondary/30 text-foreground font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
                  />
                </div>

                {/* Current tier preview */}
                {currentTier && (
                  <motion.div
                    key={currentTier.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-xl p-4 mb-6 flex items-center gap-4"
                  >
                    <span className="text-3xl">{currentTier.emoji}</span>
                    <div>
                      <p className={`text-sm font-bold ${currentTier.color}`}>{currentTier.title}</p>
                      <p className="text-xs text-muted-foreground">{currentTier.desc}</p>
                    </div>
                    <Crown size={16} className={`ml-auto ${currentTier.color}`} />
                  </motion.div>
                )}

                {/* CTA */}
                <button
                  onClick={handleFund}
                  disabled={loading || effectiveAmount < 1}
                  className="w-full py-4 rounded-xl font-bold text-base bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Opening checkout…" : (
                    <>
                      Fund Local Hero — ${effectiveAmount > 0 ? effectiveAmount.toFixed(0) : "…"}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-muted-foreground text-center mt-3">
                  Secure payment via Stripe · One-time contribution · No recurring charges
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ OG TIERS ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4">
                <Star size={12} className="text-hero-yellow" />
                <span className="text-[10px] font-bold text-hero-yellow uppercase tracking-widest">OG Tiers</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Every OG Gets <span className="text-gradient-hero">Remembered</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Early supporters get recognized forever. The bigger your contribution, the bigger your legacy.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ogTiers.map((tier, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="glass-card rounded-2xl p-6 text-center h-full group hover:border-primary/20 transition-all">
                  <span className="text-4xl mb-3 block">{tier.emoji}</span>
                  <p className={`text-sm font-bold ${tier.color} mb-1`}>{tier.title}</p>
                  <p className="text-xs text-muted-foreground mb-3">{tier.desc}</p>
                  <p className="text-lg font-extrabold text-foreground">${tier.min}+</p>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                      <CheckCircle2 size={10} className={tier.color} /> OG Badge in-app
                    </div>
                    {tier.min >= 25 && (
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                        <CheckCircle2 size={10} className={tier.color} /> Name on supporters wall
                      </div>
                    )}
                    {tier.min >= 100 && (
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                        <CheckCircle2 size={10} className={tier.color} /> Early access to features
                      </div>
                    )}
                    {tier.min >= 250 && (
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                        <CheckCircle2 size={10} className={tier.color} /> Direct line to the team
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHERE MONEY GOES ═══ */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Where Every <span className="text-gradient-hero">Dollar Goes</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Full transparency. No mystery. Here's exactly what your contribution powers.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-hero-yellow/3" />
              <div className="relative z-10">
                {/* Animated bar */}
                <div className="flex h-5 rounded-full overflow-hidden mb-8 gap-0.5">
                  {fundingUses.map((f, i) => {
                    const colors = ["bg-primary", "bg-hero-yellow", "bg-hero-purple", "bg-hero-orange", "bg-muted-foreground"];
                    return (
                      <motion.div
                        key={i}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${f.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.12 }}
                        className={`${colors[i]} rounded-full relative`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-primary-foreground">
                          {f.pct}%
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  {fundingUses.map((f, i) => {
                    const colors = ["text-primary", "text-hero-yellow", "text-hero-purple", "text-hero-orange", "text-muted-foreground"];
                    const bgColors = ["bg-primary", "bg-hero-yellow", "bg-hero-purple", "bg-hero-orange", "bg-muted-foreground"];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center ${colors[i]} shrink-0`}>
                          {f.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-foreground">{f.label}</h4>
                            <span className={`text-xs font-bold ${colors[i]}`}>{f.pct}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{f.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ WHY NOW ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="glass-card rounded-2xl p-8 lg:p-10 relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-hero-orange/5 via-transparent to-primary/5" />
              <div className="relative z-10">
                <Sparkles size={28} className="text-hero-yellow mx-auto mb-4" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Why Fund Now?
                </h2>
                <div className="space-y-4 text-left max-w-lg mx-auto mb-8">
                  {[
                    "We're pre-revenue — your dollar has 10x the impact right now",
                    "Early supporters shape the product roadmap directly",
                    "OG status is permanent — you can never get it later",
                    "You're not donating to a corporation — you're fueling a community tool",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <ChevronRight size={14} className="text-primary mt-1 shrink-0" />
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all inline-flex items-center gap-2"
                >
                  Back to Top — Fund Now <Heart size={14} />
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={heroLogo} alt="" className="w-6 h-6" />
            <span className="font-display font-bold text-sm text-foreground">Local<span className="text-gradient-hero">Hero</span></span>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</button>
            <button onClick={() => navigate("/business")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Business</button>
            <button onClick={() => navigate("/heropaper")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">HeroPaper</button>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Local Hero · Built with ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default FundingPage;
