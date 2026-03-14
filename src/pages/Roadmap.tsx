import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, MapPin, Sparkles, Trophy, Users, Zap, ChevronDown,
  Globe, Target, Clock, Gift, CheckCircle2, Crown, Gem, Store,
  Rocket, Map, Share2, BarChart3, Bot, Building2, Compass,
  HelpCircle, Mail, ExternalLink, Heart, TreePine, Bike, Star,
  Gamepad2, Swords, Shield, Award,
} from "lucide-react";
import heroLogo from "@/assets/hero-logo-glow.png";

/* ── Fade helpers ── */
const FadeIn = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.6 }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ── Floating emoji particle ── */
const FloatingEmoji = ({ emoji, delay, x, size = 20, duration = 6 }: { emoji: string; delay: number; x: number; size?: number; duration?: number }) => (
  <motion.div
    className="absolute pointer-events-none select-none"
    style={{ left: `${x}%`, fontSize: size }}
    initial={{ y: "100%", opacity: 0, rotate: 0 }}
    animate={{ y: "-100%", opacity: [0, 1, 1, 0], rotate: [0, 15, -10, 20] }}
    transition={{ duration, repeat: Infinity, delay, ease: "easeOut" }}
  >
    {emoji}
  </motion.div>
);

/* ── XP Progress bar ── */
const XPBar = ({ label, current, max, color }: { label: string; current: number; max: number; color: string }) => {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(current), 300);
    return () => clearTimeout(timer);
  }, [current]);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold">
        <span className="text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className={color}>{current}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full`}
          style={{ background: `hsl(var(--${color.replace("text-", "")}))` }}
          initial={{ width: 0 }}
          animate={{ width: `${(animated / max) * 100}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

/* ── Tappable coin ── */
const TapCoin = ({ emoji, onTap }: { emoji: string; onTap: () => void }) => (
  <motion.button
    onClick={onTap}
    whileTap={{ scale: 0.8, rotate: -15 }}
    whileHover={{ scale: 1.15, rotate: 5 }}
    className="text-3xl sm:text-4xl cursor-pointer select-none active:outline-none focus:outline-none"
    aria-label="Tap for fun"
  >
    {emoji}
  </motion.button>
);

/* ── Achievement badge ── */
const AchievementBadge = ({ emoji, label, unlocked, delay = 0 }: { emoji: string; label: string; unlocked: boolean; delay?: number }) => (
  <motion.div
    initial={{ scale: 0, rotate: -20 }}
    whileInView={{ scale: 1, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ type: "spring", stiffness: 200, delay }}
    className={`flex flex-col items-center gap-1 ${unlocked ? "" : "opacity-40 grayscale"}`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${unlocked ? "glass-card border border-hero-yellow/30 icon-heartbeat" : "glass-card"}`}>
      {emoji}
    </div>
    <span className="text-[9px] font-bold text-muted-foreground uppercase">{label}</span>
  </motion.div>
);

/* ── Roadmap data ── */
const phases = [
  {
    phase: "Phase 1",
    title: "MVP — Foundation",
    status: "current" as const,
    icon: <Zap size={18} />,
    color: "text-primary",
    bg: "bg-primary/15",
    border: "border-primary/40",
    xp: 100,
    items: [
      "Location-based quests & QR scanning",
      "User profiles with streaks & levels",
      "Community challenges & leaderboards",
      "HERO points reward system",
      "School program integration",
    ],
  },
  {
    phase: "Phase 2",
    title: "Discovery Drops",
    status: "next" as const,
    icon: <Gift size={18} />,
    color: "text-hero-yellow",
    bg: "bg-hero-yellow/15",
    border: "border-hero-yellow/40",
    xp: 250,
    items: [
      "Time-limited location-based rewards",
      "Common, Rare & Legendary drop tiers",
      "Social sharing & viral mechanics",
      "Business-sponsored drops",
      "Real-time map exploration",
    ],
  },
  {
    phase: "Phase 3",
    title: "Local Economy",
    status: "upcoming" as const,
    icon: <Store size={18} />,
    color: "text-hero-orange",
    bg: "bg-hero-orange/15",
    border: "border-hero-orange/40",
    xp: 500,
    items: [
      "Sponsored quests from local businesses",
      "Creator-generated content & tours",
      "Business dashboard & analytics",
      "Partner reward redemption",
      "Community-funded quests",
    ],
  },
  {
    phase: "Phase 4",
    title: "Platform Scale",
    status: "upcoming" as const,
    icon: <Globe size={18} />,
    color: "text-hero-purple",
    bg: "bg-hero-purple/15",
    border: "border-hero-purple/40",
    xp: 1000,
    items: [
      "Multi-city expansion",
      "AI quest agents & personalization",
      "Global quest network",
      "Cross-city challenges & events",
      "Full creator ecosystem marketplace",
    ],
  },
];

/* ── FAQ data ── */
const faqCategories = [
  {
    label: "Users",
    icon: <Users size={16} />,
    color: "text-primary",
    questions: [
      { q: "What is a Discovery Drop?", a: "A Discovery Drop is a time-limited, location-based reward that appears on the map. Walk to the drop location within the time window to claim HERO points, badges, or partner rewards. Drops come in Common, Rare, and Legendary tiers with increasing rewards." },
      { q: "How do I claim a reward?", a: "Open the app, navigate to the Discovery Drops map, and find an active drop near you. Walk within 50 meters of the drop location and tap 'Claim' before it expires. Your reward is added to your account instantly." },
      { q: "What are HERO points?", a: "HERO points are the in-app reward currency earned by completing quests, claiming drops, and participating in community challenges. Points contribute to your level, unlock badges, and can be redeemed for partner perks." },
      { q: "Do I need to create an account?", a: "Yes — signing up lets you track your progress, maintain streaks, earn badges, and appear on leaderboards. Sign up with email to get started in seconds." },
      { q: "What cities are currently supported?", a: "We're currently live in our launch city with plans for multi-city expansion in Phase 4. Join the waitlist to bring Local Hero to your city!" },
    ],
  },
  {
    label: "Businesses",
    icon: <Building2 size={16} />,
    color: "text-hero-yellow",
    questions: [
      { q: "Can businesses create their own drops?", a: "Yes! In Phase 2 and beyond, businesses can sponsor Discovery Drops near their locations. This drives foot traffic, brand awareness, and customer engagement with measurable analytics." },
      { q: "What are the benefits for sponsors?", a: "Sponsors get targeted foot traffic to their location, branded reward experiences, real-time analytics on engagement, and association with positive community impact." },
      { q: "How does reporting work?", a: "Business sponsors receive a dashboard with claim analytics, engagement metrics, foot traffic data, and ROI tracking for every sponsored drop or quest campaign." },
      { q: "How do I get started as a business partner?", a: "Visit our Business page or contact us directly. We'll set you up with a sponsor account and help design your first campaign." },
    ],
  },
  {
    label: "Investors",
    icon: <BarChart3 size={16} />,
    color: "text-hero-purple",
    questions: [
      { q: "What is Local Hero's growth strategy?", a: "We grow city-by-city with viral loops: Discovery Drops encourage social sharing, referral bonuses drive organic growth, and school programs create institutional adoption. Each city becomes a self-reinforcing network." },
      { q: "How does Local Hero generate revenue?", a: "Revenue streams include business sponsorships (drops & quests), premium creator tools, partner reward commissions, and enterprise programs for schools and organizations." },
      { q: "How does Local Hero scale globally?", a: "Our platform is city-agnostic — quests, drops, and challenges work anywhere with GPS. We expand through local community ambassadors, school partnerships, and business sponsors who bring the platform to their city." },
      { q: "What makes this defensible?", a: "Network effects at the city level (more users = more quests = more businesses), verified achievements, a growing creator ecosystem, and deep community engagement create strong moats." },
    ],
  },
];

/* ── Accordion item ── */
const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left glass-card rounded-xl p-4 sm:p-5 hover:border-primary/20 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-display text-sm sm:text-base font-semibold text-foreground leading-snug">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-0.5">
          <ChevronDown size={16} className="text-muted-foreground" />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-muted-foreground leading-relaxed mt-3 overflow-hidden"
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </button>
  );
};

/* ── VS comparison row ── */
const VSRow = ({ left, right, leftEmoji, rightEmoji }: { left: string; right: string; leftEmoji: string; rightEmoji: string }) => (
  <div className="flex items-center gap-2 sm:gap-4">
    <div className="flex-1 text-right">
      <span className="text-xs sm:text-sm text-muted-foreground/60 line-through">{left}</span>
      <span className="ml-1 text-sm">{leftEmoji}</span>
    </div>
    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">VS</div>
    <div className="flex-1 text-left">
      <span className="text-sm mr-1">{rightEmoji}</span>
      <span className="text-xs sm:text-sm font-bold text-foreground">{right}</span>
    </div>
  </div>
);

export default function Roadmap() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Users");
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subMessage, setSubMessage] = useState("");
  const [tapCount, setTapCount] = useState(0);
  const [flyingPoints, setFlyingPoints] = useState<{ id: number; emoji: string }[]>([]);

  const handleTap = (emoji: string) => {
    setTapCount((c) => c + 1);
    const id = Date.now();
    setFlyingPoints((prev) => [...prev, { id, emoji }]);
    setTimeout(() => setFlyingPoints((prev) => prev.filter((p) => p.id !== id)), 800);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setSubStatus("error");
      setSubMessage("Please enter a valid email address.");
      return;
    }
    setSubStatus("loading");
    const { error } = await supabase.from("newsletter_subscribers" as any).insert({ email: trimmed, source: "roadmap" } as any);
    if (error) {
      if (error.code === "23505") {
        setSubStatus("success");
        setSubMessage("You're already subscribed! 🎉");
      } else {
        setSubStatus("error");
        setSubMessage("Something went wrong. Try again.");
      }
    } else {
      setSubStatus("success");
      setSubMessage("Welcome aboard! 🎉 We'll keep you posted.");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <img src={heroLogo} alt="" className="w-6 h-6" />
            <span className="font-display font-bold text-sm text-foreground">Local<span className="text-gradient-hero">Hero</span></span>
          </button>
          <div className="flex items-center gap-3">
            <a href="#faq" className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block">FAQ</a>
            <button onClick={() => navigate("/auth")} className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════ HERO — "GAME FOR GOOD" ═══════ */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        {/* Ambient floating emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingEmoji emoji="🌱" delay={0} x={10} duration={8} />
          <FloatingEmoji emoji="⭐" delay={1.5} x={25} size={16} duration={7} />
          <FloatingEmoji emoji="🏆" delay={3} x={75} duration={9} />
          <FloatingEmoji emoji="💚" delay={2} x={85} size={14} duration={6} />
          <FloatingEmoji emoji="🎯" delay={4} x={50} duration={10} />
          <FloatingEmoji emoji="🌍" delay={5} x={40} size={18} duration={8} />
          <FloatingEmoji emoji="🎮" delay={1} x={65} size={16} duration={7} />
        </div>

        <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-primary/8 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-hero-purple/6 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-8">
              {/* Game badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2.5 mb-6 border border-primary/30"
              >
                <Gamepad2 size={16} className="text-primary icon-bounce-pop" />
                <span className="text-xs font-bold text-primary">The Game That Does Good</span>
                <span className="text-xs">🌍</span>
              </motion.div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                <span className="text-gradient-white">Not Another Shooter.</span><br />
                <span className="text-gradient-hero">A Real-World Adventure.</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
                Think Pokémon GO meets community impact. Complete quests, discover hidden rewards, and level up — 
                <span className="text-foreground font-semibold"> while actually making your neighborhood better.</span>
              </p>

              {/* Tappable emoji row */}
              <div className="relative inline-flex items-center gap-3 sm:gap-5 mb-4">
                <TapCoin emoji="🌱" onTap={() => handleTap("🌱")} />
                <TapCoin emoji="⭐" onTap={() => handleTap("⭐")} />
                <TapCoin emoji="🏆" onTap={() => handleTap("🏆")} />
                <TapCoin emoji="💚" onTap={() => handleTap("💚")} />
                <TapCoin emoji="🎯" onTap={() => handleTap("🎯")} />

                {/* Flying point indicators */}
                <AnimatePresence>
                  {flyingPoints.map((fp) => (
                    <motion.div
                      key={fp.id}
                      initial={{ opacity: 1, y: 0, scale: 1 }}
                      animate={{ opacity: 0, y: -60, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 text-hero-yellow font-extrabold text-sm pointer-events-none"
                    >
                      +10 {fp.emoji}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {tapCount > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11px] text-muted-foreground"
                >
                  {tapCount < 5 ? "Tap to collect! 👆" : tapCount < 15 ? "You're a natural! 🔥" : "Hero instincts detected! 🦸"}
                </motion.p>
              )}
              {tapCount === 0 && (
                <p className="text-[11px] text-muted-foreground animate-pulse">👆 Tap the icons above!</p>
              )}
            </div>
          </FadeIn>

          {/* "VS" comparison — game for good vs traditional */}
          <FadeIn>
            <div className="glass-card rounded-2xl p-5 sm:p-6 max-w-lg mx-auto mb-10 space-y-3">
              <h3 className="text-center font-display text-sm font-bold text-foreground mb-4">
                <span className="text-muted-foreground">Other Games</span> <span className="text-primary">vs</span> <span className="text-gradient-hero">Local Hero</span>
              </h3>
              <VSRow left="Shoot enemies" right="Plant trees" leftEmoji="💀" rightEmoji="🌳" />
              <VSRow left="Sit on couch" right="Explore your city" leftEmoji="🛋️" rightEmoji="🗺️" />
              <VSRow left="Virtual loot" right="Real rewards" leftEmoji="👻" rightEmoji="🎁" />
              <VSRow left="Toxic chat" right="Help neighbors" leftEmoji="🤬" rightEmoji="🤝" />
              <VSRow left="Wasted hours" right="Impact hours" leftEmoji="⏰" rightEmoji="💪" />
            </div>
          </FadeIn>

          {/* Core features grid with game stats */}
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
              {[
                { icon: <MapPin size={20} />, label: "Quest Map", stat: "50+ Quests", color: "text-primary", bg: "bg-primary/10", anim: "icon-bounce-pop" },
                { icon: <Users size={20} />, label: "Party Up", stat: "Join Crews", color: "text-hero-yellow", bg: "bg-hero-yellow/10", anim: "icon-wiggle" },
                { icon: <Trophy size={20} />, label: "Earn Loot", stat: "Real Rewards", color: "text-hero-orange", bg: "bg-hero-orange/10", anim: "icon-heartbeat" },
                { icon: <Heart size={20} />, label: "Do Good", stat: "Real Impact", color: "text-hero-purple", bg: "bg-hero-purple/10", anim: "icon-sparkle" },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  className="glass-card rounded-xl p-4 text-center group cursor-default"
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center mx-auto mb-2 ${f.color} ${f.anim}`}>
                    {f.icon}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground">{f.label}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{f.stat}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Achievement badges row */}
          <FadeIn>
            <div className="mt-8 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">🏅 Unlockable Achievements</p>
              <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
                <AchievementBadge emoji="🌱" label="First Quest" unlocked delay={0} />
                <AchievementBadge emoji="🔥" label="7-Day Streak" unlocked delay={0.1} />
                <AchievementBadge emoji="🏆" label="Top 10" unlocked delay={0.2} />
                <AchievementBadge emoji="💎" label="Rare Drop" unlocked={false} delay={0.3} />
                <AchievementBadge emoji="👑" label="Legendary" unlocked={false} delay={0.4} />
                <AchievementBadge emoji="🌍" label="City Hero" unlocked={false} delay={0.5} />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ ROADMAP ═══════ */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-5xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-5">
                <Rocket size={14} className="text-hero-yellow icon-bounce-pop" />
                <span className="text-xs font-bold text-hero-yellow">Quest Log — Roadmap</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                Our <span className="text-gradient-hero">Adventure Map</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                Every great game has a roadmap. Here's ours — unlocking new features like game expansions. 🎮
              </p>
            </div>
          </FadeIn>

          {/* Overall progress XP bar */}
          <FadeIn>
            <div className="glass-card rounded-2xl p-5 mb-8 max-w-lg mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Star size={18} className="text-primary icon-sparkle" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Platform Level: 1</p>
                  <p className="text-[10px] text-muted-foreground">Phase 1 of 4 unlocked</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-lg font-extrabold text-primary font-mono">100</p>
                  <p className="text-[9px] text-muted-foreground uppercase">XP</p>
                </div>
              </div>
              <XPBar label="Progress to Phase 2" current={100} max={250} color="text-primary" />
            </div>
          </FadeIn>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-5 sm:left-8 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
              {phases.map((p, i) => (
                <FadeIn key={i}>
                  <div className="relative pl-14 sm:pl-20">
                    {/* Dot */}
                    <div className={`absolute left-3 sm:left-6 top-5 w-4 h-4 rounded-full border-2 ${p.border} ${p.status === "current" ? p.bg : "bg-background"} ${p.status === "current" ? "animate-pulse-glow" : ""}`}>
                      {p.status === "current" && (
                        <div className={`absolute inset-0 rounded-full ${p.bg} animate-ping`} />
                      )}
                    </div>

                    <div className={`glass-card rounded-2xl p-5 sm:p-6 ${p.status === "current" ? `border ${p.border}` : ""}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-lg ${p.bg} flex items-center justify-center ${p.color}`}>
                          {p.icon}
                        </div>
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${p.color}`}>{p.phase}</span>
                          <h3 className="font-display text-base sm:text-lg font-bold text-foreground leading-tight">{p.title}</h3>
                        </div>
                        {p.status === "current" && (
                          <span className="ml-auto text-[10px] font-bold text-primary bg-primary/15 rounded-full px-3 py-1 icon-sparkle">⚡ LIVE</span>
                        )}
                        {p.status === "next" && (
                          <span className="ml-auto text-[10px] font-bold text-hero-yellow bg-hero-yellow/15 rounded-full px-3 py-1">🔓 NEXT</span>
                        )}
                        {p.status === "upcoming" && (
                          <span className="ml-auto text-[10px] font-bold text-muted-foreground bg-secondary rounded-full px-3 py-1">🔒 LOCKED</span>
                        )}
                      </div>

                      {/* XP unlock bar */}
                      <div className="mb-3">
                        <XPBar
                          label={`${p.xp} XP to unlock`}
                          current={p.status === "current" ? p.xp : p.status === "next" ? 100 : 0}
                          max={p.xp}
                          color={p.color}
                        />
                      </div>

                      <ul className="space-y-2">
                        {p.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 size={14} className={`${p.color} mt-0.5 shrink-0 ${p.status === "current" ? "" : "opacity-40"}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ DISCOVERY DROPS — GAME LOOT ═══════ */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-hero-yellow/6 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

        {/* Floating loot emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingEmoji emoji="📦" delay={0} x={8} duration={9} />
          <FloatingEmoji emoji="💎" delay={2} x={92} duration={7} />
          <FloatingEmoji emoji="👑" delay={4} x={50} size={22} duration={11} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-5">
                <Target size={14} className="text-hero-orange icon-heartbeat" />
                <span className="text-xs font-bold text-hero-orange">Loot System — Coming Soon</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                Discovery <span className="text-gradient-hero">Drops</span> 🎁
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                Like finding treasure chests in real life. Walk, discover, collect — every drop makes your city more fun.
              </p>
            </div>
          </FadeIn>

          {/* Rarity tiers — styled like game loot cards */}
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { emoji: "📦", tier: "Common", rarity: "★", color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30", desc: "Frequent drops with standard HERO point rewards. Great for daily XP grinding!", chance: "60%" },
                { emoji: "💎", tier: "Rare", rarity: "★★★", color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30", desc: "Less frequent, higher rewards. Unlock exclusive badges and partner perks.", chance: "30%" },
                { emoji: "👑", tier: "Legendary", rarity: "★★★★★", color: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/30", desc: "Ultra-rare drops with massive XP, unique collectibles, and bragging rights!", chance: "10%" },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  className={`glass-card rounded-2xl p-5 sm:p-6 border ${t.border} text-center relative overflow-hidden`}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Rarity stars */}
                  <p className={`text-xs ${t.color} mb-2 tracking-wider`}>{t.rarity}</p>
                  <motion.span
                    className="text-4xl mb-3 block"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {t.emoji}
                  </motion.span>
                  <h3 className={`font-display text-lg font-bold ${t.color} mb-1`}>{t.tier}</h3>
                  <span className={`text-[10px] font-bold ${t.color}/70 mb-2 block`}>{t.chance} drop rate</span>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Mechanics — quest-style */}
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: <Map size={18} />, label: "🗺️ Explore", desc: "Open the map & find glowing drops", step: "1" },
                { icon: <Clock size={18} />, label: "⏱️ Race", desc: "Timer's ticking — move fast!", step: "2" },
                { icon: <Gem size={18} />, label: "🎁 Collect", desc: "Walk close to claim the loot", step: "3" },
                { icon: <Share2 size={18} />, label: "📸 Flex", desc: "Share your rare finds!", step: "4" },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  className="glass-card rounded-xl p-4 text-center relative"
                  whileHover={{ y: -3 }}
                >
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {m.step}
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
                    {m.icon}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground mb-1">{m.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* UX goals */}
          <FadeIn>
            <div className="mt-10 glass-card rounded-2xl p-6 sm:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4 text-center">🎮 Why It's Addictive (In a Good Way)</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: <Sparkles size={14} />, text: "Daily login loop — new drops every day like daily loot boxes" },
                  { icon: <Share2 size={14} />, text: "FOMO mechanics — friends see your rare claims and want in" },
                  { icon: <Store size={14} />, text: "Local business quests fund real rewards in your neighborhood" },
                  { icon: <Globe size={14} />, text: "Your whole city becomes a game world to explore 🌆" },
                ].map((g, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 shrink-0">{g.icon}</span>
                    {g.text}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ IMPACT STATS — gamified ═══════ */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <FadeIn>
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-primary/20">
              <h3 className="font-display text-lg sm:text-xl font-bold text-center text-foreground mb-6">
                🌍 Community Impact Score
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: <TreePine size={20} />, value: "1,200+", label: "Trees Planted", color: "text-primary", emoji: "🌳" },
                  { icon: <Users size={20} />, value: "5,000+", label: "Active Heroes", color: "text-hero-yellow", emoji: "🦸" },
                  { icon: <MapPin size={20} />, value: "10k+", label: "Quests Done", color: "text-hero-orange", emoji: "✅" },
                  { icon: <Heart size={20} />, value: "100+", label: "Communities", color: "text-hero-purple", emoji: "💜" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    className="text-center"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", delay: i * 0.1 }}
                  >
                    <span className="text-2xl block mb-1">{s.emoji}</span>
                    <p className={`font-display text-2xl sm:text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section id="faq" className="py-16 sm:py-24 relative">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-5">
                <HelpCircle size={14} className="text-primary" />
                <span className="text-xs font-bold text-primary">Help Desk 💬</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                Got <span className="text-gradient-hero">Questions?</span>
              </h2>
            </div>
          </FadeIn>

          {/* Tabs */}
          <FadeIn>
            <div className="flex justify-center gap-2 mb-8">
              {faqCategories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveTab(cat.label)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    activeTab === cat.label
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Questions */}
          <AnimatePresence mode="wait">
            {faqCategories
              .filter((c) => c.label === activeTab)
              .map((cat) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  {cat.questions.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} />
                  ))}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="glass-card rounded-3xl p-8 sm:p-12 border border-primary/20 relative overflow-hidden">
              {/* Ambient particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <FloatingEmoji emoji="⭐" delay={0} x={15} size={14} duration={6} />
                <FloatingEmoji emoji="🌱" delay={2} x={85} size={14} duration={8} />
              </div>

              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-block"
              >
                <Crown size={32} className="text-hero-yellow mx-auto mb-4" />
              </motion.div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Ready to Be a <span className="text-gradient-hero">Local Hero</span>? 🦸
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
                Your adventure starts now. Join the game, do good, earn real rewards.
              </p>

              {/* Newsletter signup */}
              <div className="mb-8 max-w-sm mx-auto">
                <p className="text-xs text-muted-foreground mb-3">📬 Get updates on new features & drops</p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (subStatus !== "idle") setSubStatus("idle"); }}
                    maxLength={255}
                    className="flex-1 min-w-0 bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={subStatus === "loading"}
                  />
                  <button
                    type="submit"
                    disabled={subStatus === "loading"}
                    className="shrink-0 bg-gradient-hero text-primary-foreground font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
                  >
                    {subStatus === "loading" ? "..." : "Subscribe"}
                  </button>
                </form>
                {subStatus !== "idle" && subStatus !== "loading" && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs mt-2 ${subStatus === "success" ? "text-primary" : "text-destructive"}`}
                  >
                    {subMessage}
                  </motion.p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate("/auth")}
                  className="w-full sm:w-auto bg-gradient-hero text-primary-foreground font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-sm"
                >
                  🎮 Start Playing
                </button>
                <button
                  onClick={() => navigate("/investors")}
                  className="w-full sm:w-auto glass font-bold px-8 py-3 rounded-full text-foreground hover:border-primary/30 transition-colors text-sm"
                >
                  📊 Investor Info
                </button>
                <button
                  onClick={() => navigate("/business")}
                  className="w-full sm:w-auto glass font-bold px-8 py-3 rounded-full text-foreground hover:border-hero-yellow/30 transition-colors text-sm"
                >
                  🏪 For Business
                </button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-4">
                <a href="mailto:hello@localhero.app" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Mail size={12} /> Contact Us
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={heroLogo} alt="" className="w-6 h-6" />
              <span className="font-display font-bold text-sm text-foreground">Local<span className="text-gradient-hero">Hero</span></span>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button onClick={() => navigate("/")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Home</button>
              <button onClick={() => navigate("/business")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Business</button>
              <button onClick={() => navigate("/investors")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Investors</button>
              <button onClick={() => navigate("/heropaper")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">HeroPaper</button>
            </div>
            <p className="text-[11px] text-muted-foreground">© 2026 Local Hero 🌍</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
