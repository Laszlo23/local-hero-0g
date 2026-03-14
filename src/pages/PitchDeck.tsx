import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Maximize, Minimize, Grid, ChevronLeft, Shield, Target, Coins, Lock, Users, Zap, CheckCircle2, TreePine, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import investorHero from "@/assets/investor-hero.jpg";
import ogLogo from "@/assets/0g-logo.png";
import heroLogo from "@/assets/hero-logo-glow.png";

/* ═══════════ CONSTANTS ═══════════ */
const SLIDE_W = 1920;
const SLIDE_H = 1080;
const TOTAL_SLIDES = 14;

/* ═══════════ SCALED SLIDE WRAPPER ═══════════ */
const ScaledSlide = ({ children, containerRef }: { children: React.ReactNode; containerRef: React.RefObject<HTMLDivElement> }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setScale(Math.min(width / SLIDE_W, height / SLIDE_H));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [containerRef]);

  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
      <div
        className="absolute"
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          left: "50%",
          top: "50%",
          marginLeft: -SLIDE_W / 2,
          marginTop: -SLIDE_H / 2,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ═══════════ SLIDE LAYOUT ═══════════ */
const SlideLayout = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full h-full relative overflow-hidden ${className}`} style={{ width: SLIDE_W, height: SLIDE_H, background: "hsl(160 10% 6%)" }}>
    {children}
  </div>
);

/* ═══════════ COMMON COMPONENTS ═══════════ */
const SlideTag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block px-6 py-2 rounded-full text-base font-semibold tracking-widest uppercase" style={{ background: "hsl(152 70% 45% / 0.1)", color: "hsl(152 70% 45%)", border: "1px solid hsl(152 70% 45% / 0.2)" }}>
    {children}
  </span>
);

const SlideTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`font-display font-bold leading-tight ${className}`} style={{ color: "hsl(0 0% 95%)" }}>
    {children}
  </h2>
);

const SlideText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`leading-relaxed ${className}`} style={{ color: "hsl(160 5% 55%)" }}>
    {children}
  </p>
);

const GlassCard = ({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`rounded-3xl ${className}`} style={{ background: "hsl(160 10% 12% / 0.5)", backdropFilter: "blur(16px)", border: "1px solid hsl(0 0% 100% / 0.06)", boxShadow: "0 4px 24px -4px hsl(0 0% 0% / 0.3)", ...style }}>
    {children}
  </div>
);

const GradientOrb = ({ color, size, x, y }: { color: string; size: number; x: string; y: string }) => (
  <div className="absolute rounded-full pointer-events-none" style={{ width: size, height: size, left: x, top: y, background: `radial-gradient(circle, ${color}, transparent 70%)`, filter: "blur(40px)" }} />
);

const PageNum = ({ num }: { num: number }) => (
  <div className="absolute bottom-10 right-14 flex items-center gap-2" style={{ color: "hsl(160 5% 35%)" }}>
    <span className="text-sm font-mono">{String(num).padStart(2, "0")}</span>
    <span className="text-xs">/</span>
    <span className="text-xs font-mono">{TOTAL_SLIDES}</span>
  </div>
);

const LogoMark = () => (
  <div className="absolute bottom-10 left-14 flex items-center gap-3">
    <img src={heroLogo} alt="" className="w-8 h-8 opacity-40" />
    <span className="text-sm font-display font-semibold" style={{ color: "hsl(160 5% 35%)" }}>Local Hero</span>
  </div>
);

/* ═══════════ SLIDES ═══════════ */

// 1. Title
const SlideCover = () => (
  <SlideLayout>
    <img src={investorHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(160 10% 6% / 0.88), hsl(160 10% 6% / 0.65))" }} />
    <GradientOrb color="hsl(152 70% 45% / 0.08)" size={800} x="-5%" y="10%" />
    <GradientOrb color="hsl(45 100% 58% / 0.05)" size={600} x="70%" y="50%" />
    <div className="absolute inset-0 flex flex-col justify-center px-[140px]">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <img src={heroLogo} alt="Local Hero" className="w-24 h-24 mb-10" />
        <h1 className="font-display text-[92px] font-bold leading-[0.95] mb-8" style={{ color: "hsl(0 0% 95%)" }}>
          Invest in<br />
          <span style={{ backgroundImage: "linear-gradient(135deg, hsl(152 80% 50%), hsl(45 100% 58%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Real-World Impact
          </span>
        </h1>
        <p className="text-[28px] max-w-[800px] leading-relaxed mb-10" style={{ color: "hsl(160 5% 55%)" }}>
          A decentralized platform turning real-world actions into verifiable on-chain rewards.
        </p>
        <p className="text-lg font-semibold tracking-wider uppercase" style={{ color: "hsl(152 70% 45%)" }}>
          Quests · Carbon Credits · Bitcoin Mining
        </p>
      </motion.div>
    </div>
    <PageNum num={1} />
  </SlideLayout>
);

// 2. Problem
const SlideProblem = () => {
  const problems = [
    { emoji: "💸", stat: "$300B+", text: "Global volunteer economy — unpaid" },
    { emoji: "🔍", stat: "80%", text: "Donors unsure where their money goes" },
    { emoji: "📱", stat: "0", text: "Digital ownership for real-world impact" },
    { emoji: "🌍", stat: "$2T", text: "Carbon market by 2030 — fragmented" },
    { emoji: "❌", stat: "∞", text: "Social media rewards influence, not impact" },
  ];
  return (
    <SlideLayout>
      <GradientOrb color="hsl(0 72% 51% / 0.04)" size={600} x="70%" y="20%" />
      <div className="absolute inset-0 flex px-[140px] items-center">
        <div className="flex-1">
          <SlideTag>The Problem</SlideTag>
          <SlideTitle className="text-[64px] mt-8 mb-6">Impact Without<br />Infrastructure</SlideTitle>
          <SlideText className="text-[22px] max-w-[600px]">
            Billions of hours of volunteer work go unpaid. Charity systems lack transparency. Real-world action has no digital ownership.
          </SlideText>
        </div>
        <div className="flex-1 flex flex-col gap-5">
          {problems.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
              <GlassCard className="px-8 py-5 flex items-center gap-6">
                <span className="text-4xl">{p.emoji}</span>
                <div>
                  <p className="font-display text-3xl font-bold" style={{ color: "hsl(0 0% 95%)" }}>{p.stat}</p>
                  <p className="text-base" style={{ color: "hsl(160 5% 55%)" }}>{p.text}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
      <PageNum num={2} /><LogoMark />
    </SlideLayout>
  );
};

// 3. Solution
const SlideSolution = () => {
  const pillars = [
    { icon: "🎯", title: "Real-World Quests", desc: "Location-verified missions — plant trees, clean parks, teach kids." },
    { icon: "🛡️", title: "On-Chain Verification", desc: "QR codes, GPS, photo proof — every action is cryptographically verified." },
    { icon: "💰", title: "Tokenized Rewards", desc: "Earn $HERO tokens, reputation NFTs, and Bitcoin rewards." },
  ];
  return (
    <SlideLayout>
      <GradientOrb color="hsl(152 70% 45% / 0.06)" size={700} x="50%" y="50%" />
      <div className="absolute inset-0 flex flex-col justify-center px-[140px]">
        <SlideTag>The Solution</SlideTag>
        <SlideTitle className="text-[64px] mt-8 mb-16">Three Pillars of Impact</SlideTitle>
        <div className="grid grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
              <GlassCard className="p-10 h-full">
                <span className="text-5xl mb-6 block">{p.icon}</span>
                <h3 className="font-display text-2xl font-bold mb-3" style={{ color: "hsl(0 0% 95%)" }}>{p.title}</h3>
                <p className="text-lg leading-relaxed" style={{ color: "hsl(160 5% 55%)" }}>{p.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
      <PageNum num={3} /><LogoMark />
    </SlideLayout>
  );
};

// 4. How It Works Flow
const SlideFlow = () => {
  const steps = ["Creator", "Quest", "Community", "Rewards", "Reputation"];
  return (
    <SlideLayout>
      <GradientOrb color="hsl(152 70% 45% / 0.05)" size={500} x="10%" y="60%" />
      <div className="absolute inset-0 flex flex-col justify-center items-center px-[140px]">
        <SlideTag>Platform Flow</SlideTag>
        <SlideTitle className="text-[58px] mt-8 mb-20 text-center">How It Works</SlideTitle>
        <div className="flex items-center gap-6">
          {steps.map((s, i) => (
            <motion.div key={i} className="flex items-center gap-6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.15 }}>
              <div className="px-10 py-6 rounded-2xl text-center" style={{ background: "hsl(152 70% 45% / 0.1)", border: "1px solid hsl(152 70% 45% / 0.25)" }}>
                <p className="font-display text-2xl font-bold" style={{ color: "hsl(152 70% 45%)" }}>{s}</p>
              </div>
              {i < 4 && <ArrowRight size={28} style={{ color: "hsl(160 5% 35%)" }} />}
            </motion.div>
          ))}
        </div>
      </div>
      <PageNum num={4} /><LogoMark />
    </SlideLayout>
  );
};

// 5. Economic Engine
const SlideEngine = () => {
  const steps = [
    { icon: "🌱", text: "Creators fund quests with carbon credits" },
    { icon: "⛏️", text: "Credits power green BTC mining" },
    { icon: "₿", text: "Bitcoin rewards are generated" },
    { icon: "🎯", text: "Users complete quests" },
    { icon: "💰", text: "Rewards distributed in BTC + $HERO" },
  ];
  return (
    <SlideLayout>
      <GradientOrb color="hsl(45 100% 58% / 0.04)" size={600} x="70%" y="30%" />
      <div className="absolute inset-0 flex px-[140px] items-center">
        <div className="flex-1">
          <SlideTag>Economic Engine</SlideTag>
          <SlideTitle className="text-[58px] mt-8 mb-6">
            The Carbon →<br />Bitcoin → Rewards<br />
            <span style={{ backgroundImage: "linear-gradient(135deg, hsl(152 80% 50%), hsl(45 100% 58%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Loop</span>
          </SlideTitle>
          <SlideText className="text-[20px] max-w-[500px]">Real economic value flows through the system — not speculation.</SlideText>
        </div>
        <div className="flex-1">
          <GlassCard className="p-10">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12 }}>
                <div className="flex items-center gap-5 py-4">
                  <span className="text-3xl">{s.icon}</span>
                  <p className="text-xl font-medium" style={{ color: "hsl(0 0% 95%)" }}>{s.text}</p>
                </div>
                {i < 4 && <div className="ml-5 w-px h-6" style={{ background: "linear-gradient(to bottom, hsl(152 70% 45% / 0.4), hsl(152 70% 45% / 0.1))" }} />}
              </motion.div>
            ))}
          </GlassCard>
        </div>
      </div>
      <PageNum num={5} /><LogoMark />
    </SlideLayout>
  );
};

// 6. Market Opportunity
const SlideMarket = () => {
  const markets = [
    { title: "Impact Economy", value: "$300B", sub: "Growing 12% YoY" },
    { title: "Carbon Markets", value: "$2T", sub: "By 2030" },
    { title: "Web3 Gaming", value: "$65B", sub: "Rapidly expanding" },
    { title: "Creator Economy", value: "200M+", sub: "Creators worldwide" },
  ];
  return (
    <SlideLayout>
      <GradientOrb color="hsl(152 70% 45% / 0.05)" size={500} x="50%" y="70%" />
      <div className="absolute inset-0 flex flex-col justify-center px-[140px]">
        <SlideTag>Market Opportunity</SlideTag>
        <SlideTitle className="text-[58px] mt-8 mb-6">Four Mega-Trends<br />Converging</SlideTitle>
        <SlideText className="text-[22px] max-w-[700px] mb-16">Local Hero sits at the intersection of these rapidly growing markets.</SlideText>
        <div className="grid grid-cols-4 gap-8">
          {markets.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.12 }}>
              <GlassCard className="p-8 text-center">
                <p className="font-display text-5xl font-bold mb-3" style={{ backgroundImage: "linear-gradient(135deg, hsl(152 80% 50%), hsl(45 100% 58%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{m.value}</p>
                <p className="font-display text-xl font-semibold mb-1" style={{ color: "hsl(0 0% 95%)" }}>{m.title}</p>
                <p className="text-base" style={{ color: "hsl(160 5% 55%)" }}>{m.sub}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
      <PageNum num={6} /><LogoMark />
    </SlideLayout>
  );
};

// 7. Tokenomics
const SlideTokenomics = () => {
  const dist = [
    { label: "Community Rewards", pct: 60, color: "hsl(152 70% 45%)" },
    { label: "Ecosystem Dev", pct: 15, color: "hsl(152 80% 50%)" },
    { label: "Liquidity", pct: 10, color: "hsl(45 100% 58%)" },
    { label: "Partnerships", pct: 10, color: "hsl(25 95% 55%)" },
    { label: "DAO Treasury", pct: 5, color: "hsl(260 60% 55%)" },
  ];
  return (
    <SlideLayout>
      <div className="absolute inset-0 flex px-[140px] items-center">
        <div className="flex-1">
          <SlideTag>Tokenomics</SlideTag>
          <SlideTitle className="text-[58px] mt-8 mb-4">$HERO Token</SlideTitle>
          <SlideText className="text-[22px] mb-12">Total Supply: 1,000,000,000 HERO</SlideText>
          <div className="space-y-5 max-w-[550px]">
            {dist.map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-medium" style={{ color: "hsl(0 0% 95%)" }}>{d.label}</span>
                  <span className="text-lg font-bold" style={{ color: d.color }}>{d.pct}%</span>
                </div>
                <div className="w-full h-4 rounded-full" style={{ background: "hsl(160 8% 15%)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: d.color }} initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6 pl-16">
          <GlassCard className="p-8 flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "hsl(152 70% 45% / 0.1)" }}>
              <Shield size={24} style={{ color: "hsl(152 70% 45%)" }} />
            </div>
            <div>
              <p className="text-xl font-bold mb-1" style={{ color: "hsl(0 0% 95%)" }}>No Insider Allocation</p>
              <p className="text-base" style={{ color: "hsl(160 5% 55%)" }}>No hidden team tokens. Full transparency from day one.</p>
            </div>
          </GlassCard>
          <GlassCard className="p-8 flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "hsl(152 70% 45% / 0.1)" }}>
              <Lock size={24} style={{ color: "hsl(152 70% 45%)" }} />
            </div>
            <div>
              <p className="text-xl font-bold mb-1" style={{ color: "hsl(0 0% 95%)" }}>Liquidity Locked</p>
              <p className="text-base" style={{ color: "hsl(160 5% 55%)" }}>Smart-contract enforced lockup periods.</p>
            </div>
          </GlassCard>
          <GlassCard className="p-8 flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "hsl(152 70% 45% / 0.1)" }}>
              <Users size={24} style={{ color: "hsl(152 70% 45%)" }} />
            </div>
            <div>
              <p className="text-xl font-bold mb-1" style={{ color: "hsl(0 0% 95%)" }}>Governance DAO</p>
              <p className="text-base" style={{ color: "hsl(160 5% 55%)" }}>Token holders govern the protocol direction.</p>
            </div>
          </GlassCard>
        </div>
      </div>
      <PageNum num={7} /><LogoMark />
    </SlideLayout>
  );
};

// 8. Growth Flywheel
const SlideFlywheel = () => {
  const steps = [
    { step: "1", text: "Creators launch quests", icon: "🚀" },
    { step: "2", text: "Users complete quests", icon: "✅" },
    { step: "3", text: "Impact + rewards", icon: "💎" },
    { step: "4", text: "Reputation NFTs", icon: "🛡️" },
    { step: "5", text: "More creators join", icon: "👥" },
    { step: "6", text: "More quests launched", icon: "♻️" },
  ];
  return (
    <SlideLayout>
      <GradientOrb color="hsl(152 70% 45% / 0.06)" size={700} x="50%" y="50%" />
      <div className="absolute inset-0 flex flex-col justify-center items-center px-[140px]">
        <SlideTag>Growth Flywheel</SlideTag>
        <SlideTitle className="text-[58px] mt-8 mb-6 text-center">Self-Reinforcing<br /><span style={{ backgroundImage: "linear-gradient(135deg, hsl(152 80% 50%), hsl(45 100% 58%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Impact Economy</span></SlideTitle>
        <SlideText className="text-[20px] text-center mb-16">Every action strengthens the network, creating compounding value.</SlideText>
        <div className="grid grid-cols-6 gap-6 w-full max-w-[1400px]">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <GlassCard className="p-6 text-center h-full flex flex-col items-center justify-center">
                <span className="text-4xl mb-3">{s.icon}</span>
                <span className="text-xs font-bold tracking-wider uppercase mb-2" style={{ color: "hsl(152 70% 45%)" }}>Step {s.step}</span>
                <p className="text-base font-medium" style={{ color: "hsl(0 0% 95%)" }}>{s.text}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
      <PageNum num={8} /><LogoMark />
    </SlideLayout>
  );
};

// 9. Technology
const SlideTech = () => {
  const stack = [
    { name: "0G.ai Infrastructure", desc: "Decentralized AI compute", icon: "🤖" },
    { name: "Smart Contracts", desc: "Automated rewards & governance", icon: "📜" },
    { name: "Soulbound NFTs", desc: "Non-transferable reputation", icon: "🛡️" },
    { name: "QR + GPS Verification", desc: "Multi-layer proof of action", icon: "📍" },
    { name: "Cross-Chain NFTs", desc: "ERC-721, ERC-1155 standards", icon: "🔗" },
    { name: "0G Chain", desc: "Data availability layer", icon: "" },
  ];
  return (
    <SlideLayout>
      <div className="absolute inset-0 flex px-[140px] items-center">
        <div className="w-[500px] flex-shrink-0">
          <SlideTag>Technology</SlideTag>
          <SlideTitle className="text-[58px] mt-8 mb-6">Built for Scale<br />and Trust</SlideTitle>
          <SlideText className="text-[20px]">Enterprise-grade infrastructure with decentralized verification and AI-powered validation.</SlideText>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-5 pl-16">
          {stack.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <GlassCard className="p-7 flex items-start gap-4">
                {t.icon ? <span className="text-3xl">{t.icon}</span> : <img src={ogLogo} alt="0G" className="w-8 h-8 mt-1" />}
                <div>
                  <p className="text-lg font-bold mb-1" style={{ color: "hsl(0 0% 95%)" }}>{t.name}</p>
                  <p className="text-base" style={{ color: "hsl(160 5% 55%)" }}>{t.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
      <PageNum num={9} /><LogoMark />
    </SlideLayout>
  );
};

// 10. Roadmap
const SlideRoadmap = () => {
  const phases = [
    { phase: "Foundation", items: ["Core app launch", "Quest engine v1", "Community beta", "NFT drops"], active: true },
    { phase: "Growth", items: ["Carbon credits", "BTC mining partners", "100K users", "Creator marketplace"], active: false },
    { phase: "Scale", items: ["DAO governance", "Cross-chain", "Enterprise partners", "1M heroes"], active: false },
    { phase: "Ecosystem", items: ["Protocol SDK", "3rd-party integrations", "Global network", "Self-sustaining"], active: false },
  ];
  return (
    <SlideLayout>
      <GradientOrb color="hsl(152 70% 45% / 0.04)" size={600} x="50%" y="80%" />
      <div className="absolute inset-0 flex flex-col justify-center px-[140px]">
        <SlideTag>Roadmap</SlideTag>
        <SlideTitle className="text-[58px] mt-8 mb-16">The Path Forward</SlideTitle>
        <div className="grid grid-cols-4 gap-8">
          {phases.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
              <GlassCard className={`p-8 h-full relative overflow-hidden ${p.active ? "" : ""}`} style={p.active ? { borderColor: "hsl(152 70% 45% / 0.3)" } : {}}>
                {p.active && <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, hsl(152 70% 45%), hsl(152 60% 32%))" }} />}
                <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: "hsl(152 70% 45%)" }}>Phase {i + 1}</span>
                <h3 className="font-display text-2xl font-bold mb-5" style={{ color: "hsl(0 0% 95%)" }}>{p.phase}</h3>
                <ul className="space-y-3">
                  {p.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: p.active ? "hsl(152 70% 45%)" : "hsl(160 5% 30%)" }} />
                      <span className="text-base" style={{ color: "hsl(160 5% 55%)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
      <PageNum num={10} /><LogoMark />
    </SlideLayout>
  );
};

// 11. Governance
const SlideGovernance = () => {
  const items = [
    { title: "Treasury Allocation", desc: "Community decides fund deployment", icon: "🏦" },
    { title: "Feature Upgrades", desc: "Vote on protocol improvements", icon: "⚡" },
    { title: "Partnerships", desc: "Approve strategic collaborations", icon: "🤝" },
    { title: "Protocol Rules", desc: "Shape the rules of the economy", icon: "📋" },
  ];
  return (
    <SlideLayout>
      <GradientOrb color="hsl(260 60% 55% / 0.04)" size={500} x="70%" y="30%" />
      <div className="absolute inset-0 flex px-[140px] items-center">
        <div className="w-[500px] flex-shrink-0">
          <SlideTag>Governance</SlideTag>
          <SlideTitle className="text-[58px] mt-8 mb-6">Community-<br />Governed<br />Protocol</SlideTitle>
          <SlideText className="text-[20px]">Token holders shape the future of the impact economy through decentralized governance.</SlideText>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-6 pl-16">
          {items.map((g, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.12 }}>
              <GlassCard className="p-8 text-center h-full flex flex-col items-center justify-center">
                <span className="text-5xl mb-4">{g.icon}</span>
                <p className="text-xl font-bold mb-2" style={{ color: "hsl(0 0% 95%)" }}>{g.title}</p>
                <p className="text-base" style={{ color: "hsl(160 5% 55%)" }}>{g.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
      <PageNum num={11} /><LogoMark />
    </SlideLayout>
  );
};

// 12. Traction / Why Now
const SlideWhyNow = () => (
  <SlideLayout>
    <GradientOrb color="hsl(45 100% 58% / 0.04)" size={500} x="20%" y="60%" />
    <div className="absolute inset-0 flex flex-col justify-center px-[140px]">
      <SlideTag>Why Now</SlideTag>
      <SlideTitle className="text-[58px] mt-8 mb-16">The Perfect Convergence</SlideTitle>
      <div className="grid grid-cols-3 gap-8">
        {[
          { icon: <Globe size={36} />, title: "Climate Urgency", desc: "Global push for carbon accountability creates massive demand for verification infrastructure." },
          { icon: <Zap size={36} />, title: "Web3 Maturity", desc: "L2 scaling, account abstraction, and mobile wallets make crypto accessible to mainstream users." },
          { icon: <TreePine size={36} />, title: "Impact Generation", desc: "Gen Z demands purpose-driven platforms. 73% willing to pay more for sustainable brands." },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
            <GlassCard className="p-10 h-full">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: "hsl(152 70% 45% / 0.1)", color: "hsl(152 70% 45%)" }}>
                {item.icon}
              </div>
              <h3 className="font-display text-2xl font-bold mb-3" style={{ color: "hsl(0 0% 95%)" }}>{item.title}</h3>
              <p className="text-lg leading-relaxed" style={{ color: "hsl(160 5% 55%)" }}>{item.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
    <PageNum num={12} /><LogoMark />
  </SlideLayout>
);

// 13. The Ask
const SlideAsk = () => (
  <SlideLayout>
    <GradientOrb color="hsl(152 70% 45% / 0.06)" size={600} x="50%" y="50%" />
    <div className="absolute inset-0 flex flex-col justify-center items-center px-[140px] text-center">
      <SlideTag>The Ask</SlideTag>
      <SlideTitle className="text-[58px] mt-8 mb-6">Seed Round</SlideTitle>
      <SlideText className="text-[22px] max-w-[700px] mb-16">We're raising to accelerate development, launch carbon credit integration, and onboard the first 100K heroes.</SlideText>
      <div className="grid grid-cols-3 gap-8 w-full max-w-[1200px]">
        {[
          { title: "Use of Funds", items: ["Engineering & product (50%)", "Growth & community (25%)", "Partnerships (15%)", "Operations (10%)"] },
          { title: "Key Milestones", items: ["100K active users", "Carbon credit launch", "BTC mining partnerships", "DAO governance live"] },
          { title: "Investor Benefits", items: ["Early token allocation", "Strategic advisory role", "Network effect exposure", "Impact-aligned portfolio"] },
        ].map((col, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.12 }}>
            <GlassCard className="p-8 text-left h-full">
              <h3 className="font-display text-xl font-bold mb-5" style={{ color: "hsl(152 70% 45%)" }}>{col.title}</h3>
              <ul className="space-y-3">
                {col.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-1 flex-shrink-0" style={{ color: "hsl(152 70% 45%)" }} />
                    <span className="text-base" style={{ color: "hsl(160 5% 55%)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
    <PageNum num={13} /><LogoMark />
  </SlideLayout>
);

// 14. Closing CTA
const SlideClosing = () => (
  <SlideLayout>
    <img src={investorHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(160 10% 6% / 0.92), hsl(160 10% 6% / 0.75))" }} />
    <GradientOrb color="hsl(152 70% 45% / 0.1)" size={800} x="40%" y="40%" />
    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-[140px]">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <img src={heroLogo} alt="" className="w-20 h-20 mx-auto mb-10" />
        <h2 className="font-display text-[80px] font-bold leading-[0.95] mb-8" style={{ color: "hsl(0 0% 95%)" }}>
          Build the<br />
          <span style={{ backgroundImage: "linear-gradient(135deg, hsl(152 80% 50%), hsl(45 100% 58%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Impact Economy
          </span>
        </h2>
        <p className="text-[24px] max-w-[700px] mx-auto mb-12" style={{ color: "hsl(160 5% 55%)" }}>
          Partner with Local Hero to create a world where every good action has real, verifiable, and lasting value.
        </p>
        <div className="flex gap-6 justify-center">
          <div className="px-10 py-5 rounded-2xl text-xl font-bold" style={{ background: "hsl(152 70% 45%)", color: "hsl(0 0% 100%)" }}>
            Request Investor Deck
          </div>
          <div className="px-10 py-5 rounded-2xl text-xl font-bold" style={{ background: "hsl(160 10% 12% / 0.6)", border: "1px solid hsl(0 0% 100% / 0.1)", color: "hsl(0 0% 95%)" }}>
            Partner With Us
          </div>
        </div>
        <div className="mt-14 flex items-center gap-3 justify-center">
          <img src={ogLogo} alt="" className="w-6 h-6 opacity-50" />
          <span className="text-base" style={{ color: "hsl(160 5% 35%)" }}>Powered by 0G Chain</span>
        </div>
      </motion.div>
    </div>
    <PageNum num={14} />
  </SlideLayout>
);

/* ═══════════ ALL SLIDES ═══════════ */
const slides = [
  SlideCover, SlideProblem, SlideSolution, SlideFlow, SlideEngine,
  SlideMarket, SlideTokenomics, SlideFlywheel, SlideTech, SlideRoadmap,
  SlideGovernance, SlideWhyNow, SlideAsk, SlideClosing,
];

/* ═══════════ PITCH DECK PAGE ═══════════ */
const PitchDeck = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number>();

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, TOTAL_SLIDES - 1)), []);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape") { setIsFullscreen(false); setShowGrid(false); document.exitFullscreen?.().catch(() => {}); }
      if (e.key === "f" || e.key === "F5") { e.preventDefault(); toggleFullscreen(); }
      if (e.key === "g") { setShowGrid(g => !g); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  // Auto-hide controls
  useEffect(() => {
    const move = () => {
      setShowControls(true);
      clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener("mousemove", move);
    return () => { window.removeEventListener("mousemove", move); clearTimeout(hideTimer.current); };
  }, []);

  // Fullscreen change
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const CurrentSlide = slides[current];

  // Grid view
  if (showGrid) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold text-foreground">Pitch Deck — All Slides</h2>
          <button onClick={() => setShowGrid(false)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
            Close Grid
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {slides.map((Slide, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setShowGrid(false); }}
              className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${current === i ? "border-primary" : "border-border hover:border-primary/50"}`}
            >
              <div className="absolute inset-0" style={{ transform: `scale(${1 / 5})`, transformOrigin: "top left", width: SLIDE_W, height: SLIDE_H }}>
                <Slide />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur-sm px-3 py-1.5">
                <span className="text-xs font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background overflow-hidden relative" ref={containerRef}>
      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ScaledSlide containerRef={containerRef as React.RefObject<HTMLDivElement>}>
            <CurrentSlide />
          </ScaledSlide>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <motion.div
        className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4"
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: showControls ? "auto" : "none" }}
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowGrid(true)} className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Grid size={16} />
          </button>
          <button onClick={toggleFullscreen} className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </motion.div>

      {/* Bottom nav */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-50 flex items-center justify-center gap-4 pb-6"
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: showControls ? "auto" : "none" }}
      >
        <button onClick={prev} disabled={current === 0} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${current === i ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
            />
          ))}
        </div>
        <button onClick={next} disabled={current === TOTAL_SLIDES - 1} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
};

export default PitchDeck;
