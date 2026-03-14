import { ArrowRight, ExternalLink, Shield, Zap, Globe, TreePine, Coins, Users, TrendingUp, Lock, CheckCircle2, Layers, Target, ChevronDown, BookOpen, Github, MessageSquare, FileText, Download, Database, Cpu, Fingerprint, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import investorHero from "@/assets/investor-hero.jpg";
import ogLogo from "@/assets/0g-logo.png";

/* ═══════════ ANIMATION HELPERS ═══════════ */

const FadeIn = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const FadeInStagger = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ═══════════ DIAGRAM COMPONENTS ═══════════ */

// Animated flow diagram with SVG arrows
const FlowDiagram = ({ steps, className = "" }: { steps: { label: string; icon: string; sub?: string }[]; className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center text-center group hover:bg-primary/15 hover:border-primary/30 transition-all">
              <span className="text-2xl mb-1">{step.icon}</span>
              <span className="text-[10px] md:text-xs font-bold text-primary leading-tight">{step.label}</span>
            </div>
            {step.sub && <span className="text-[9px] text-muted-foreground mt-1.5 max-w-[90px] text-center leading-tight">{step.sub}</span>}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div
              className="mx-1 md:mx-3"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 + 0.2, duration: 0.3 }}
            >
              <svg width="40" height="20" viewBox="0 0 40 20" className="hidden md:block">
                <defs>
                  <linearGradient id={`arrow-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(152 70% 45%)" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="hsl(152 70% 45%)" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="10" x2="30" y2="10" stroke={`url(#arrow-grad-${i})`} strokeWidth="2" />
                <polygon points="30,5 40,10 30,15" fill="hsl(152 70% 45%)" fillOpacity="0.5" />
              </svg>
              <ArrowRight size={14} className="text-primary/40 md:hidden" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Circular flywheel diagram
const FlywheelDiagram = ({ steps }: { steps: { label: string; icon: string }[] }) => {
  const radius = 160;
  const centerX = 200;
  const centerY = 200;

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 400 400" className="w-full max-w-[400px]">
        {/* Outer ring */}
        <motion.circle
          cx={centerX} cy={centerY} r={radius + 20}
          fill="none" stroke="hsl(152 70% 45%)" strokeOpacity="0.08" strokeWidth="40"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Animated orbit ring */}
        <motion.circle
          cx={centerX} cy={centerY} r={radius}
          fill="none" stroke="hsl(152 70% 45%)" strokeOpacity="0.2" strokeWidth="1.5"
          strokeDasharray="8 4"
          animate={{ strokeDashoffset: [0, -48] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        {/* Center label */}
        <text x={centerX} y={centerY - 8} textAnchor="middle" fill="hsl(152 70% 45%)" fontSize="13" fontWeight="bold" fontFamily="system-ui">Growth</text>
        <text x={centerX} y={centerY + 10} textAnchor="middle" fill="hsl(152 70% 45%)" fontSize="13" fontWeight="bold" fontFamily="system-ui">Flywheel</text>
        {/* Nodes */}
        {steps.map((step, i) => {
          const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          return (
            <g key={i}>
              <motion.circle
                cx={x} cy={y} r={28}
                fill="hsl(160 10% 10%)" stroke="hsl(152 70% 45%)" strokeOpacity="0.3" strokeWidth="1.5"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
              />
              <text x={x} y={y - 4} textAnchor="middle" fontSize="16">{step.icon}</text>
              <text x={x} y={y + 14} textAnchor="middle" fill="hsl(0 0% 80%)" fontSize="7" fontFamily="system-ui" fontWeight="600">{step.label}</text>
            </g>
          );
        })}
        {/* Arrows between nodes */}
        {steps.map((_, i) => {
          const a1 = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
          const a2 = ((i + 1) / steps.length) * Math.PI * 2 - Math.PI / 2;
          const aMid = (a1 + a2) / 2;
          const ax = centerX + Math.cos(aMid) * (radius - 40);
          const ay = centerY + Math.sin(aMid) * (radius - 40);
          return (
            <motion.circle
              key={`dot-${i}`}
              cx={ax} cy={ay} r={2}
              fill="hsl(152 70% 45%)" fillOpacity="0.4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Donut chart for tokenomics
const TokenDonut = ({ data }: { data: { label: string; pct: number; color: string }[] }) => {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = 90;
  const strokeW = 36;
  const circumference = 2 * Math.PI * r;

  let accumulated = 0;
  const arcs = data.map(d => {
    const start = accumulated;
    accumulated += d.pct;
    return { ...d, start, dashOffset: circumference * (1 - d.pct / 100) };
  });

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px]">
        {arcs.map((arc, i) => (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeW}
            strokeDasharray={`${circumference}`}
            strokeDashoffset={arc.dashOffset}
            strokeLinecap="round"
            transform={`rotate(${(arc.start / 100) * 360 - 90} ${cx} ${cy})`}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: arc.dashOffset }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: "easeOut" }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="hsl(0 0% 95%)" fontSize="20" fontWeight="bold" fontFamily="system-ui">1B</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="hsl(160 5% 55%)" fontSize="10" fontFamily="system-ui">$HERO</text>
      </svg>
    </div>
  );
};

// Architecture diagram
const ArchitectureDiagram = () => (
  <div className="relative">
    <svg viewBox="0 0 800 360" className="w-full">
      <defs>
        <linearGradient id="arch-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(152 70% 45%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(152 70% 45%)" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Layer labels */}
      {[
        { y: 40, label: "APPLICATION LAYER", items: ["Mobile PWA", "Quest Engine", "AR Mode", "NFT Gallery"] },
        { y: 140, label: "PROTOCOL LAYER", items: ["Smart Contracts", "Verification Engine", "Reward Distribution", "DAO Governance"] },
        { y: 240, label: "INFRASTRUCTURE LAYER", items: ["0G Chain", "IPFS Storage", "AI Compute", "Cross-chain Bridge"] },
      ].map((layer, li) => (
        <g key={li}>
          {/* Layer background */}
          <motion.rect
            x={20} y={layer.y} width={760} height={80} rx={12}
            fill="hsl(160 10% 12%)" fillOpacity="0.3"
            stroke="hsl(152 70% 45%)" strokeOpacity={0.08 + li * 0.03} strokeWidth="1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: li * 0.2, duration: 0.5 }}
          />
          {/* Layer label */}
          <text x={40} y={layer.y + 20} fill="hsl(152 70% 45%)" fontSize="9" fontWeight="700" fontFamily="system-ui" letterSpacing="2">{layer.label}</text>
          {/* Items */}
          {layer.items.map((item, ii) => (
            <g key={ii}>
              <motion.rect
                x={40 + ii * 185} y={layer.y + 32} width={170} height={36} rx={8}
                fill="hsl(160 10% 14%)" stroke="hsl(152 70% 45%)" strokeOpacity="0.15" strokeWidth="1"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: li * 0.2 + ii * 0.08, duration: 0.4 }}
              />
              <text x={125 + ii * 185} y={layer.y + 55} textAnchor="middle" fill="hsl(0 0% 85%)" fontSize="11" fontFamily="system-ui" fontWeight="500">{item}</text>
            </g>
          ))}
        </g>
      ))}

      {/* Connecting lines between layers */}
      {[120, 220].map((y, i) => (
        <g key={`conn-${i}`}>
          {[125, 310, 495, 680].map((x, j) => (
            <motion.line
              key={j}
              x1={x} y1={y} x2={x} y2={y + 20}
              stroke="hsl(152 70% 45%)" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 3"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.3 + j * 0.05 }}
            />
          ))}
        </g>
      ))}
    </svg>
  </div>
);

// Market Venn Diagram
const MarketVenn = () => (
  <div className="flex justify-center">
    <svg viewBox="0 0 400 320" className="w-full max-w-[420px]">
      {[
        { cx: 160, cy: 130, label: "Impact", sub: "$300B", color: "hsl(152 70% 45%)" },
        { cx: 240, cy: 130, label: "Carbon", sub: "$2T", color: "hsl(45 100% 58%)" },
        { cx: 160, cy: 210, label: "Web3", sub: "$65B", color: "hsl(260 60% 55%)" },
        { cx: 240, cy: 210, label: "Creator", sub: "200M+", color: "hsl(25 95% 55%)" },
      ].map((circle, i) => (
        <g key={i}>
          <motion.circle
            cx={circle.cx} cy={circle.cy} r={75}
            fill={circle.color} fillOpacity="0.06"
            stroke={circle.color} strokeOpacity="0.2" strokeWidth="1.5"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
          />
          <text x={circle.cx} y={circle.cy - 4} textAnchor="middle" fill={circle.color} fontSize="12" fontWeight="700" fontFamily="system-ui">{circle.label}</text>
          <text x={circle.cx} y={circle.cy + 14} textAnchor="middle" fill={circle.color} fontSize="16" fontWeight="800" fontFamily="system-ui">{circle.sub}</text>
        </g>
      ))}
      {/* Center intersection */}
      <motion.circle
        cx={200} cy={170} r={20}
        fill="hsl(152 70% 45%)" fillOpacity="0.15"
        stroke="hsl(152 70% 45%)" strokeOpacity="0.4" strokeWidth="2"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, type: "spring" }}
      />
      <text x={200} y={167} textAnchor="middle" fill="hsl(152 70% 45%)" fontSize="7" fontWeight="800" fontFamily="system-ui">LOCAL</text>
      <text x={200} y={178} textAnchor="middle" fill="hsl(152 70% 45%)" fontSize="7" fontWeight="800" fontFamily="system-ui">HERO</text>
    </svg>
  </div>
);

/* ═══════════ DATA ═══════════ */

const problemStats = [
  { value: "$300B+", label: "Global volunteer economy — unpaid", emoji: "💸" },
  { value: "80%", label: "Charity donors unsure where funds go", emoji: "🔍" },
  { value: "0", label: "Digital ownership for real-world impact", emoji: "❌" },
  { value: "$2T", label: "Carbon market by 2030 — fragmented", emoji: "🌍" },
];

const pillars = [
  { icon: <Target size={28} />, title: "Real-World Quests", desc: "Location-verified missions — plant trees, clean parks, teach kids, serve neighbors." },
  { icon: <Shield size={28} />, title: "On-Chain Verification", desc: "QR codes, GPS, photo proof — every action is cryptographically verified and permanent." },
  { icon: <Coins size={28} />, title: "Tokenized Rewards", desc: "Earn $HERO tokens, reputation NFTs, and Bitcoin rewards for real-world impact." },
];

const tokenDistribution = [
  { label: "Community Rewards", pct: 60, color: "hsl(152 70% 45%)" },
  { label: "Ecosystem Development", pct: 15, color: "hsl(152 80% 50%)" },
  { label: "Liquidity", pct: 10, color: "hsl(45 100% 58%)" },
  { label: "Strategic Partnerships", pct: 10, color: "hsl(25 95% 55%)" },
  { label: "DAO Treasury", pct: 5, color: "hsl(260 60% 55%)" },
];

const techStack = [
  { name: "0G.ai Infrastructure", desc: "Decentralized AI compute for verification", icon: "🤖" },
  { name: "Smart Contracts", desc: "Automated reward distribution & governance", icon: "📜" },
  { name: "Soulbound NFTs", desc: "Non-transferable reputation badges", icon: "🛡️" },
  { name: "QR + GPS Verification", desc: "Multi-layer proof of action", icon: "📍" },
  { name: "Cross-Chain Standards", desc: "ERC-721, ERC-1155 multi-chain NFTs", icon: "🔗" },
];

const roadmap = [
  { phase: "Foundation", items: ["Core app launch", "Quest engine v1", "Community beta", "Initial NFT drops"], status: "active" },
  { phase: "Growth", items: ["Carbon credit integration", "BTC mining partnerships", "100K active users", "Creator marketplace"], status: "upcoming" },
  { phase: "Scale", items: ["DAO governance launch", "Cross-chain expansion", "Enterprise partnerships", "1M heroes milestone"], status: "upcoming" },
  { phase: "Ecosystem", items: ["Protocol SDK", "Third-party integrations", "Global impact network", "Self-sustaining economy"], status: "upcoming" },
];

const governanceItems = [
  { title: "Treasury Allocation", desc: "Community decides how funds are deployed", icon: "🏦" },
  { title: "Feature Upgrades", desc: "Vote on protocol improvements", icon: "⚡" },
  { title: "Ecosystem Partnerships", desc: "Approve strategic collaborations", icon: "🤝" },
  { title: "Protocol Rules", desc: "Shape the rules of the impact economy", icon: "📋" },
];

/* ═══════════ SECTION HEADER ═══════════ */

const SectionHeader = ({ tag, title, subtitle, sectionNum }: { tag: string; title: string; subtitle?: string; sectionNum?: number }) => (
  <div className="text-center mb-16 max-w-3xl mx-auto">
    {sectionNum && (
      <span className="block text-xs font-mono text-muted-foreground/40 mb-3 tracking-widest">
        SECTION {String(sectionNum).padStart(2, "0")}
      </span>
    )}
    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20 mb-6">
      {tag}
    </span>
    <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">{title}</h2>
    {subtitle && <p className="text-lg text-muted-foreground leading-relaxed">{subtitle}</p>}
  </div>
);

/* ═══════════ WHITEPAPER DOWNLOAD ═══════════ */

const WhitepaperDownloadButton = ({ variant = "primary" }: { variant?: "primary" | "outline" }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/whitepaper-pdf`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "LocalHero-Whitepaper-v1.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  if (variant === "outline") {
    return (
      <button onClick={handleDownload} disabled={downloading} className="group px-8 py-4 rounded-2xl glass border border-border text-foreground font-bold text-base hover:border-primary/30 transition-all flex items-center gap-2 justify-center disabled:opacity-50">
        {downloading ? "Generating..." : "Download Whitepaper"} <Download size={18} />
      </button>
    );
  }

  return (
    <button onClick={handleDownload} disabled={downloading} className="group px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all flex items-center gap-2 justify-center disabled:opacity-50">
      {downloading ? "Generating..." : "Download Whitepaper"} <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
    </button>
  );
};

// Footer-style text link for whitepaper download
const WhitepaperDownloadLink = () => {
  const [downloading, setDownloading] = useState(false);
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/whitepaper-pdf`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "LocalHero-Whitepaper-v1.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };
  return (
    <button onClick={handleDownload} disabled={downloading} className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
      {downloading ? "Downloading..." : "Download Whitepaper"}
    </button>
  );
};


const Investors = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="font-display text-lg font-bold text-foreground hover:text-primary transition-colors">
            Local Hero
          </button>
          <div className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Problem</a>
            <a href="#solution" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Solution</a>
            <a href="#tokenomics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tokenomics</a>
            <a href="#architecture" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Architecture</a>
            <a href="#roadmap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roadmap</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/heropaper")} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:block">
              HeroPaper
            </button>
            <button onClick={() => navigate("/pitch")} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
              View Pitch Deck
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src={investorHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
        </motion.div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.08), transparent 70%)", top: "10%", left: "-10%" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.06), transparent 70%)", bottom: "5%", right: "-5%" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24">
          <FadeInStagger>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary">Whitepaper v1.0</span>
              <span className="w-1 h-1 rounded-full bg-primary/40" />
              <span className="text-xs text-muted-foreground">Investor Overview</span>
            </div>
          </FadeInStagger>
          <FadeInStagger delay={0.1}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6">
              <span className="text-foreground">Invest in</span><br />
              <span className="text-gradient-hero">Real-World Impact</span>
            </h1>
          </FadeInStagger>
          <FadeInStagger delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
              Local Hero is a decentralized platform turning real-world actions — from environmental work to community service — into verifiable on-chain rewards.
            </p>
          </FadeInStagger>
          <FadeInStagger delay={0.3}>
            <p className="text-sm text-primary font-medium tracking-wide uppercase mb-10">
              A global impact economy powered by quests, carbon credits, and Bitcoin mining.
            </p>
          </FadeInStagger>
          <FadeInStagger delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhitepaperDownloadButton />
              <button onClick={() => navigate("/pitch")} className="group px-8 py-4 rounded-2xl glass border border-border text-foreground font-bold text-base hover:border-primary/30 transition-all flex items-center gap-2 justify-center">
                View Pitch Deck <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate("/heropaper")} className="px-8 py-4 rounded-2xl glass border border-border text-foreground font-bold text-base hover:border-primary/30 transition-all flex items-center gap-2 justify-center">
                Read HeroPaper <BookOpen size={18} />
              </button>
            </div>
          </FadeInStagger>

          <motion.div className="mt-20" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown size={24} className="text-muted-foreground mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ TABLE OF CONTENTS ═══ */}
      <section className="py-16 px-6 border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="glass-card rounded-3xl p-8 md:p-10">
              <h3 className="font-display text-lg font-bold text-foreground mb-6 flex items-center gap-3">
                <FileText size={20} className="text-primary" />
                Table of Contents
              </h3>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-3">
                {[
                  { num: "01", title: "The Problem", id: "problem" },
                  { num: "02", title: "The Solution", id: "solution" },
                  { num: "03", title: "Economic Engine", id: "engine" },
                  { num: "04", title: "Market Opportunity", id: "market" },
                  { num: "05", title: "Tokenomics", id: "tokenomics" },
                  { num: "06", title: "Growth Flywheel", id: "flywheel" },
                  { num: "07", title: "System Architecture", id: "architecture" },
                  { num: "08", title: "Roadmap", id: "roadmap" },
                  { num: "09", title: "Governance", id: "governance" },
                  { num: "10", title: "Conclusion", id: "conclusion" },
                ].map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="flex items-center gap-4 py-2 group hover:text-primary transition-colors">
                    <span className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">{item.num}</span>
                    <span className="flex-1 text-sm text-foreground group-hover:text-primary transition-colors">{item.title}</span>
                    <span className="w-0 group-hover:w-4 transition-all overflow-hidden"><ArrowRight size={12} /></span>
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ SECTION 1 — THE PROBLEM ═══ */}
      <section id="problem" className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <SectionHeader
              sectionNum={1}
              tag="The Problem"
              title="Impact Without Infrastructure"
              subtitle="Billions of hours of volunteer work go unpaid. Charity systems lack transparency. Social media rewards influence, not impact. The carbon credit market is fragmented. Real-world action has no digital ownership."
            />
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            {problemStats.map((s, i) => (
              <FadeInStagger key={i} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-6 text-center hover:border-primary/20 transition-all group">
                  <span className="text-3xl mb-3 block">{s.emoji}</span>
                  <p className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">{s.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-snug">{s.label}</p>
                </div>
              </FadeInStagger>
            ))}
          </div>

          {/* Problem breakdown prose */}
          <FadeIn>
            <div className="max-w-3xl mx-auto space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>The global volunteer economy represents over <span className="text-foreground font-semibold">$300 billion</span> in annual value, yet the vast majority of this impact goes unrecognized, unverified, and unrewarded. Traditional systems for tracking community impact rely on self-reporting, manual verification, and centralized databases — all of which are prone to fraud and inefficiency.</p>
              <p>Meanwhile, the carbon credit market is projected to reach <span className="text-foreground font-semibold">$2 trillion by 2030</span>, but remains fragmented across incompatible registries with no unified connection to ground-level environmental action. Social media platforms have trained a generation to seek digital validation, but the incentive structures reward influence over genuine impact.</p>
              <p className="text-foreground font-medium border-l-2 border-primary pl-4">The result: a massive disconnect between real-world value creation and digital recognition. Local Hero bridges this gap.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ SECTION 2 — THE SOLUTION ═══ */}
      <section id="solution" className="py-24 md:py-32 px-6 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.03), transparent 70%)" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <SectionHeader
              sectionNum={2}
              tag="The Solution"
              title="Three Pillars of Impact"
              subtitle="A complete system for creating, verifying, and rewarding real-world action."
            />
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {pillars.map((p, i) => (
              <FadeInStagger key={i} delay={i * 0.12}>
                <div className="glass-card rounded-2xl p-8 hover:border-primary/20 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/20 transition-colors">
                    {p.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </FadeInStagger>
            ))}
          </div>

          {/* Platform Flow Diagram */}
          <FadeIn>
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <h3 className="font-display text-lg font-bold text-foreground mb-2 text-center">Platform Flow</h3>
              <p className="text-sm text-muted-foreground text-center mb-10">How value moves through the Local Hero ecosystem</p>
              <FlowDiagram steps={[
                { label: "Creator", icon: "👤", sub: "Designs quest" },
                { label: "Quest", icon: "📋", sub: "Funded & published" },
                { label: "Community", icon: "👥", sub: "Discovers & acts" },
                { label: "Verify", icon: "✅", sub: "On-chain proof" },
                { label: "Rewards", icon: "💰", sub: "BTC + $HERO" },
                { label: "Reputation", icon: "🛡️", sub: "Soulbound NFT" },
              ]} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ SECTION 3 — ECONOMIC ENGINE ═══ */}
      <section id="engine" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionHeader
              sectionNum={3}
              tag="Economic Engine"
              title="The Carbon → Bitcoin → Rewards Loop"
              subtitle="Real economic value flows through the system — not speculation."
            />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <FadeIn>
              <div className="glass-card rounded-3xl p-8 md:p-10">
                {[
                  { text: "Creators fund quests with carbon credits", icon: "🌱", num: "01" },
                  { text: "Credits power green BTC mining", icon: "⛏️", num: "02" },
                  { text: "Bitcoin rewards are generated", icon: "₿", num: "03" },
                  { text: "Users complete quests", icon: "🎯", num: "04" },
                  { text: "Rewards distributed in BTC + $HERO", icon: "💰", num: "05" },
                ].map((step, i) => (
                  <div key={i}>
                    <motion.div
                      className="flex items-center gap-4 py-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span className="font-mono text-[10px] text-primary/50">{step.num}</span>
                      <span className="text-2xl">{step.icon}</span>
                      <p className="text-foreground font-medium text-sm md:text-base">{step.text}</p>
                    </motion.div>
                    {i < 4 && (
                      <div className="flex justify-start pl-10">
                        <motion.div
                          className="w-px h-8 bg-gradient-to-b from-primary/40 to-primary/10"
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.15, duration: 0.4 }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn>
              <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
                <p>Unlike speculative token models, Local Hero creates <span className="text-foreground font-semibold">genuine economic value</span> through the Carbon-Bitcoin-Rewards loop.</p>
                <p>Carbon credits purchased by quest creators are converted into green Bitcoin mining hashrate. The mined BTC generates real revenue that flows back to quest completers as rewards.</p>
                <p className="text-foreground font-medium border-l-2 border-accent pl-4">Every $HERO token earned represents verified real-world action backed by actual Bitcoin mining revenue.</p>
                <p>This model is <span className="text-foreground font-semibold">self-sustaining</span>: more quests generate more carbon credit demand, funding more mining, creating more rewards, and attracting more participants.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4 — MARKET OPPORTUNITY ═══ */}
      <section id="market" className="py-24 md:py-32 px-6 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 70% 50%, hsl(var(--accent) / 0.03), transparent 60%)" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <SectionHeader
              sectionNum={4}
              tag="Market Opportunity"
              title="Four Mega-Trends Converging"
              subtitle="Local Hero sits at the intersection of four rapidly growing markets."
            />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <MarketVenn />
            </FadeIn>
            <FadeIn>
              <div className="space-y-6">
                {[
                  { title: "Impact Economy", value: "$300B", desc: "Global volunteer economy growing 12% YoY — unpaid and unverified.", color: "text-primary" },
                  { title: "Carbon Credit Markets", value: "$2T by 2030", desc: "Exponential growth driven by corporate net-zero commitments.", color: "text-accent" },
                  { title: "Web3 Gaming", value: "$65B", desc: "Play-to-earn and move-to-earn prove tokenized activities work.", color: "text-hero-purple" },
                  { title: "Creator Economy", value: "200M+", desc: "Creators worldwide need new monetization beyond advertising.", color: "text-hero-orange" },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`font-display text-2xl font-bold ${m.color} min-w-[100px]`}>{m.value}</div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{m.title}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5 — TOKENOMICS ═══ */}
      <section id="tokenomics" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionHeader
              sectionNum={5}
              tag="Tokenomics"
              title="$HERO Token"
              subtitle="Total Supply: 1,000,000,000 HERO — designed for long-term sustainability and community ownership."
            />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <FadeIn>
              <div className="glass-card rounded-3xl p-8">
                <h3 className="font-display text-lg font-bold text-foreground mb-6">Token Distribution</h3>
                <TokenDonut data={tokenDistribution} />
                <div className="mt-6 space-y-3">
                  {tokenDistribution.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.color }} />
                      <span className="text-sm text-foreground flex-1">{t.label}</span>
                      <span className="text-sm font-bold text-muted-foreground">{t.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="glass-card rounded-3xl p-8">
                <h3 className="font-display text-lg font-bold text-foreground mb-6">Key Principles</h3>
                <div className="space-y-5">
                  {[
                    { icon: <Shield size={20} />, title: "No Insider Allocation", desc: "No hidden team tokens. Full transparency from genesis block." },
                    { icon: <Lock size={20} />, title: "Liquidity Locked", desc: "Smart-contract enforced lockup periods. Immutable and audited." },
                    { icon: <Users size={20} />, title: "Governance DAO", desc: "Token holders govern protocol direction through on-chain voting." },
                    { icon: <BarChart3 size={20} />, title: "Fair Distribution", desc: "1 share = 1 share. Follower counts don't determine allocation." },
                  ].map((p, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        {p.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6 — GROWTH FLYWHEEL ═══ */}
      <section id="flywheel" className="py-24 md:py-32 px-6 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, hsl(var(--primary) / 0.04), transparent 60%)" }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <SectionHeader
              sectionNum={6}
              tag="Growth Flywheel"
              title="Self-Reinforcing Impact Economy"
              subtitle="Every action strengthens the network, creating compounding value."
            />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <FadeIn>
              <FlywheelDiagram steps={[
                { label: "Create", icon: "🚀" },
                { label: "Complete", icon: "✅" },
                { label: "Reward", icon: "💎" },
                { label: "Reputation", icon: "🛡️" },
                { label: "Attract", icon: "👥" },
                { label: "Scale", icon: "♻️" },
              ]} />
            </FadeIn>
            <FadeIn>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p><span className="text-foreground font-semibold">Network effects compound over time.</span> Each new quest creator brings their community. Each completed quest builds verifiable reputation. Each reputation NFT increases platform trust.</p>
                <div className="space-y-3 mt-6">
                  {[
                    "Creators launch quests funded by carbon credits",
                    "Users discover and complete real-world missions",
                    "Impact is verified on-chain, rewards distributed",
                    "Soulbound reputation NFTs build permanent trust",
                    "Trust attracts more creators and partners",
                    "The cycle accelerates with each iteration",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="font-mono text-[10px] text-primary mt-1">{String(i + 1).padStart(2, "0")}</span>
                      <p className="text-foreground text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7 — ARCHITECTURE ═══ */}
      <section id="architecture" className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <SectionHeader
              sectionNum={7}
              tag="System Architecture"
              title="Built for Scale and Trust"
              subtitle="Enterprise-grade infrastructure with decentralized verification."
            />
          </FadeIn>

          <FadeIn>
            <div className="glass-card rounded-3xl p-6 md:p-10 mb-12">
              <ArchitectureDiagram />
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((t, i) => (
              <FadeInStagger key={i} delay={i * 0.08}>
                <div className="glass-card rounded-2xl p-6 hover:border-primary/20 transition-all flex items-start gap-4">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                </div>
              </FadeInStagger>
            ))}
            <FadeInStagger delay={0.5}>
              <div className="glass-card rounded-2xl p-6 hover:border-primary/20 transition-all flex items-center gap-4">
                <img src={ogLogo} alt="0G" className="w-8 h-8" />
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">Powered by 0G Chain</p>
                  <p className="text-xs text-muted-foreground">Decentralized AI data availability layer</p>
                </div>
              </div>
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8 — ROADMAP ═══ */}
      <section id="roadmap" className="py-24 md:py-32 px-6 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 30%, hsl(var(--primary) / 0.03), transparent 60%)" }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <SectionHeader sectionNum={8} tag="Roadmap" title="The Path Forward" />
          </FadeIn>

          {/* Timeline style */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/15 to-transparent hidden md:block" />

            <div className="space-y-12">
              {roadmap.map((r, i) => (
                <FadeInStagger key={i} delay={i * 0.15}>
                  <div className={`flex flex-col md:flex-row gap-6 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                    <div className={`flex-1 ${i % 2 === 1 ? "md:text-right" : ""}`}>
                      <div className={`glass-card rounded-2xl p-6 relative overflow-hidden ${r.status === "active" ? "border-primary/30" : ""}`}>
                        {r.status === "active" && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-hero" />}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Phase {i + 1}</span>
                          {r.status === "active" && <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">Active</span>}
                        </div>
                        <h3 className="font-display text-lg font-bold text-foreground mb-4">{r.phase}</h3>
                        <ul className="space-y-2">
                          {r.items.map((item, j) => (
                            <li key={j} className={`flex items-start gap-2 ${i % 2 === 1 ? "md:flex-row-reverse md:text-right" : ""}`}>
                              <CheckCircle2 size={14} className={`mt-0.5 flex-shrink-0 ${r.status === "active" ? "text-primary" : "text-muted-foreground/40"}`} />
                              <span className="text-xs text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center">
                      <motion.div
                        className={`w-4 h-4 rounded-full border-2 ${r.status === "active" ? "bg-primary border-primary" : "bg-background border-muted-foreground/30"}`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15, type: "spring" }}
                      />
                    </div>
                    <div className="flex-1" />
                  </div>
                </FadeInStagger>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 9 — GOVERNANCE ═══ */}
      <section id="governance" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionHeader
              sectionNum={9}
              tag="Governance"
              title="Community-Governed Protocol"
              subtitle="Token holders shape the future of the impact economy through decentralized governance."
            />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <FadeIn>
              <div className="glass-card rounded-3xl p-8">
                <h3 className="font-display text-lg font-bold text-foreground mb-6">DAO Voting Power</h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p><span className="text-foreground font-semibold">1 HERO = 1 vote.</span> Quadratic voting ensures fairness and prevents whale dominance.</p>
                  <p>Time-locked staking required for governance participation. Minimum proposal threshold: <span className="text-foreground font-semibold">100,000 HERO</span>.</p>
                  <p>All votes are executed on-chain through immutable smart contracts. No admin keys, no backdoors.</p>
                </div>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="grid grid-cols-2 gap-4">
                {governanceItems.map((g, i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 text-center hover:border-primary/20 transition-all">
                    <span className="text-2xl mb-2 block">{g.icon}</span>
                    <p className="font-semibold text-foreground text-xs mb-1">{g.title}</p>
                    <p className="text-[10px] text-muted-foreground">{g.desc}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 10 — CTA ═══ */}
      <section id="conclusion" className="py-24 md:py-32 px-6 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, hsl(var(--primary) / 0.06), transparent 50%)" }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeIn>
            <span className="block text-xs font-mono text-muted-foreground/40 mb-3 tracking-widest">SECTION 10</span>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-accent/10 text-accent border border-accent/20 mb-6">
              Conclusion
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Build the <span className="text-gradient-hero">Impact Economy</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Partner with Local Hero to create a world where every good action has real, verifiable, and lasting value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhitepaperDownloadButton />
              <button onClick={() => navigate("/pitch")} className="group px-8 py-4 rounded-2xl glass border border-border text-foreground font-bold text-base hover:border-primary/30 transition-all flex items-center gap-2 justify-center">
                View Pitch Deck <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate("/app/community")} className="px-8 py-4 rounded-2xl glass border border-border text-foreground font-bold text-base hover:border-accent/30 transition-all flex items-center gap-2 justify-center">
                Partner With Us <ExternalLink size={18} />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10">
            <div className="md:col-span-2">
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Local Hero</h3>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Decentralized impact economy protocol. Turning real-world actions into verifiable on-chain rewards.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <img src={ogLogo} alt="0G" className="w-5 h-5 opacity-50" />
                <span className="text-xs text-muted-foreground">Powered by 0G Chain</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate("/heropaper")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">HeroPaper</button></li>
                <li><button onClick={() => navigate("/pitch")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Investor Deck</button></li>
                <li><WhitepaperDownloadLink /></li>
                <li><button onClick={() => navigate("/app/contracts")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Smart Contracts</button></li>
                <li><a href="#tokenomics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tokenomics</a></li>
                <li><a href="#roadmap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate("/app")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Launch App</button></li>
                <li><button onClick={() => navigate("/app/quests")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Explore Quests</button></li>
                <li><button onClick={() => navigate("/app/community")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</button></li>
                <li><button onClick={() => navigate("/app/leaderboard")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Leaderboard</button></li>
                <li><button onClick={() => navigate("/app/agents")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Agents</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2025 Local Hero Protocol. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="text-xs text-muted-foreground">Whitepaper v1.0</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">Built on 0G Chain</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Investors;
