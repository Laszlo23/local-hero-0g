import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Coins, Crown, DollarSign, Gift, Leaf, Megaphone, Shield, Sparkles, Star, Store, Target, TrendingUp, Users, Zap } from "lucide-react";
import { StaggerContainer, FadeUpItem, BreathingGlow, FloatingParticle } from "@/components/Animations";

const AGENT_TIERS = [
  { tier: "Bronze Agent", range: "1–100", icon: "🥉", commission: "5%", perks: ["Create quests", "Basic analytics", "Community badge"] },
  { tier: "Silver Agent", range: "101–300", icon: "🥈", commission: "8%", perks: ["Sponsored quests", "Revenue share", "Priority support"] },
  { tier: "Gold Agent", range: "301–555", icon: "🥇", commission: "12%", perks: ["Custom branding", "API access", "Governance vote"] },
  { tier: "Diamond Agent", range: "556–777", icon: "💎", commission: "15%", perks: ["All perks", "Exclusive drops", "Founding DAO seat"] },
];

const MONETIZATION_METHODS = [
  { icon: <Target size={20} />, title: "Sponsored Quests", desc: "Create branded quests for local businesses. Earn per completion.", earning: "Per completion", color: "text-primary", bg: "bg-primary/10" },
  { icon: <Store size={20} />, title: "Local Business Onboarding", desc: "Bring shops & restaurants onto the platform. Earn commission on their spend.", earning: "Rev share", color: "text-accent", bg: "bg-accent/10" },
  { icon: <Gift size={20} />, title: "Treasure Drop Creation", desc: "Design & distribute exclusive treasure drops for your community.", earning: "Keep 85%", color: "text-hero-purple", bg: "bg-hero-purple/10" },
  { icon: <Megaphone size={20} />, title: "Community Events", desc: "Organize HERO events. Earn from ticket sales & sponsorships.", earning: "Per event", color: "text-hero-orange", bg: "bg-hero-orange/10" },
  { icon: <Users size={20} />, title: "Referral Network", desc: "Build your agent network. Earn from sub-agent activity.", earning: "Passive", color: "text-hero-yellow", bg: "bg-hero-yellow/10" },
];

const Agents = () => {
  const [tab, setTab] = useState<"earn" | "tiers">("earn");

  return (
    <div className="px-5 pt-12 pb-28 space-y-5 relative">
      <FloatingParticle x={85} y={5} size={5} delay={0} duration={5} />
      <FloatingParticle x={10} y={25} size={4} delay={1.2} duration={4.5} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">777 Agents</h1>
          <p className="text-sm text-muted-foreground">Build & monetize your HERO network</p>
        </div>
        <motion.div className="w-10 h-10 rounded-xl glass flex items-center justify-center" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <Shield size={18} className="text-accent" />
        </motion.div>
      </motion.div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--accent) / 0.08))" }}
      >
        <BreathingGlow className="w-36 h-36 -top-10 -right-10" color="accent" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Crown size={14} className="text-accent" />
            </motion.div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Agent Program</span>
          </div>
          <h3 className="font-display font-bold text-foreground text-lg mb-1">Become a HERO Agent</h3>
          <p className="text-xs text-muted-foreground mb-3">The Agent program is launching soon. Explore the tiers and earning opportunities below.</p>
          <motion.span
            className="inline-flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-full"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={10} /> Coming Soon
          </motion.span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-2xl border border-hero-green-glow/25 bg-hero-green-glow/5 p-4"
      >
        <p className="flex flex-wrap items-center gap-x-1 text-xs leading-relaxed text-muted-foreground">
          <Leaf size={14} className="inline shrink-0 text-hero-green-glow" />
          <span>
            Anyone can flag a park or street for cleanup — no game account required. Share{" "}
            <Link to="/report-spot" className="font-semibold text-primary hover:underline">
              Report a spot
            </Link>
            . Triage reports in Postgres{" "}
            <code className="rounded bg-background/80 px-1 py-0.5 text-[10px]">community_signals</code> — see{" "}
            <code className="text-[10px]">docs/COMMUNITY_SIGNALS.md</code>.
          </span>
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-1 glass rounded-xl p-1">
        {([["earn", "How It Works"], ["tiers", "Agent Tiers"]] as const).map(([key, label]) => (
          <motion.button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab === key ? "bg-gradient-hero-glow text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            whileTap={{ scale: 0.95 }}
          >
            {label}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
          {tab === "earn" && <EarnTab />}
          {tab === "tiers" && <TiersTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const EarnTab = () => (
  <StaggerContainer className="space-y-3">
    <FadeUpItem>
      <div className="flex items-center gap-2">
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
          <DollarSign size={16} className="text-primary" />
        </motion.div>
        <h3 className="font-display font-bold text-foreground">Ways to Earn</h3>
      </div>
    </FadeUpItem>

    {MONETIZATION_METHODS.map((m, i) => (
      <FadeUpItem key={i}>
        <motion.div className="glass-card-hover rounded-2xl p-4 cursor-pointer" whileHover={{ x: 4, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <div className="flex items-start gap-3">
            <motion.div
              className={`w-11 h-11 rounded-xl ${m.bg} flex items-center justify-center shrink-0 ${m.color}`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
            >
              {m.icon}
            </motion.div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-foreground">{m.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Coins size={8} /> {m.earning}
                </span>
              </div>
            </div>
            <ArrowRight size={14} className="text-muted-foreground mt-1 shrink-0" />
          </div>
        </motion.div>
      </FadeUpItem>
    ))}
  </StaggerContainer>
);

const TiersTab = () => (
  <StaggerContainer className="space-y-3">
    {AGENT_TIERS.map((t, i) => (
      <FadeUpItem key={i}>
        <motion.div className="glass-card rounded-2xl p-4" whileHover={{ scale: 1.01 }}>
          <div className="flex items-center gap-3 mb-3">
            <motion.span className="text-3xl" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>{t.icon}</motion.span>
            <div className="flex-1">
              <h4 className="font-bold text-foreground">{t.tier}</h4>
              <p className="text-[10px] text-muted-foreground">Spots #{t.range}</p>
            </div>
            <motion.span className="text-sm font-bold text-primary" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>{t.commission}</motion.span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {t.perks.map((p, j) => (
              <motion.span
                key={j}
                className="text-[9px] font-semibold px-2 py-1 rounded-full bg-secondary text-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + j * 0.1 }}
              >
                {p}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </FadeUpItem>
    ))}
  </StaggerContainer>
);

export default Agents;
