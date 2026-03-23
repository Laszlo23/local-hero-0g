import { ArrowRight, BookOpen, Compass, GraduationCap, Heart, MapPin, Menu, ScanLine, Sparkles, Star, Trophy, Users, X, Zap, ChevronDown, Flame, Shield, TrendingUp, Target, Clock, Gift, CheckCircle2, Globe, Lock, QrCode, Coins, Gem, Layers, Link2, TreePine, CircleDot, Fingerprint, Gamepad2, ExternalLink, Crosshair, Timer, Crown, Swords } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import heroLogo from "@/assets/hero-logo-glow.png";
import ogLogo from "@/assets/0g-logo.png";
import heroCommunity from "@/assets/hero-community.jpg";
import heroParallaxCta from "@/assets/hero-parallax-cta.jpg";
import heroVideo from "@/assets/hero-video.mp4";
import storyCleanup from "@/assets/story-cleanup.jpg";
import storyStudents from "@/assets/story-students.jpg";
import storyCafe from "@/assets/story-cafe.jpg";
import schoolsOutdoor from "@/assets/schools-outdoor.jpg";
import communityGarden from "@/assets/community-garden.jpg";
import arChest from "@/assets/ar-chest.png";
import arTree from "@/assets/ar-tree.png";
import arBook from "@/assets/ar-book.png";
import CoinCollectorGame from "@/components/CoinCollectorGame";
import LiveActivityFeed from "@/components/landing/LiveActivityFeed";
import ExitIntentPopup from "@/components/landing/ExitIntentPopup";
import ImpactCalculator from "@/components/landing/ImpactCalculator";
import DiscoveryDropsSection from "@/components/landing/DiscoveryDropsSection";
import CtaSection from "@/components/landing/CtaSection";

const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
];

const navLinks = [
  { href: "#how-it-works", label: "How It Works", icon: <Zap size={14} /> },
  { href: "#app-preview", label: "App Preview", icon: <Compass size={14} /> },
  { href: "#discovery-drops", label: "Drops", icon: <Crosshair size={14} /> },
  { href: "#ar", label: "Explore Quests", icon: <ScanLine size={14} /> },
  { href: "#schools", label: "Schools", icon: <GraduationCap size={14} /> },
  { href: "#impact", label: "Impact", icon: <Trophy size={14} /> },
];

const FadeIn = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
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
    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ═══════════ 3D TILT CARD ═══════════ */
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════ ANIMATED COUNTER ═══════════ */
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(false);
  const [urgencyDismissed, setUrgencyDismissed] = useState(false);

  // Typewriter hook lines
  const typewriterLines = [
    "What if your daily walk earned you free coffee? ☕",
    "Your neighbor planted 47 trees last month. You? 🌳",
    "The average hero earns 340 points in their first week 🏆",
    "12 quests expire in your area today. Will you catch them? ⏰",
  ];
  const [twIndex, setTwIndex] = useState(0);
  const [twText, setTwText] = useState("");
  const [twTyping, setTwTyping] = useState(true);

  useEffect(() => {
    const line = typewriterLines[twIndex];
    if (twTyping) {
      if (twText.length < line.length) {
        const timer = setTimeout(() => setTwText(line.slice(0, twText.length + 1)), 45);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setTwTyping(false), 2500);
        return () => clearTimeout(timer);
      }
    } else {
      if (twText.length > 0) {
        const timer = setTimeout(() => setTwText(twText.slice(0, -1)), 25);
        return () => clearTimeout(timer);
      } else {
        setTwIndex((twIndex + 1) % typewriterLines.length);
        setTwTyping(true);
      }
    }
  }, [twText, twTyping, twIndex]);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const arY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const arY2 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const arY3 = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      // Urgency banner at ~40% scroll
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPct > 0.25 && !urgencyDismissed) setShowUrgencyBanner(true);
      const sections = navLinks.map(l => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScroll = useCallback((href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const [activeScreen, setActiveScreen] = useState(0);
  const screens = [
    { title: "Home Dashboard", desc: "Track your hero journey, daily quests, and impact stats at a glance." },
    { title: "AR Quest Mode", desc: "Point your camera and discover hidden quests, treasures, and learning checkpoints." },
    { title: "Leaderboard", desc: "Compete with heroes in your city and climb the ranks." },
  ];

  // "What's in it for me" interactive tabs
  const [activePersona, setActivePersona] = useState(0);
  const personas = [
    { label: "🧑 Individual", title: "Your daily life becomes an adventure", benefits: [
      { icon: <Target size={18} />, text: "Get fun daily quests that fit your routine" },
      { icon: <Star size={18} />, text: "Earn HERO points redeemable at local shops" },
      { icon: <Users size={18} />, text: "Meet like-minded people in your neighborhood" },
      { icon: <Heart size={18} />, text: "Actually feel good about your screen time" },
    ]},
    { label: "👨‍👩‍👧 Family", title: "Weekend adventures the whole family loves", benefits: [
      { icon: <MapPin size={18} />, text: "Family treasure hunts in your own city" },
      { icon: <Gift size={18} />, text: "Kids earn rewards for helping out" },
      { icon: <Globe size={18} />, text: "Discover hidden gems in your neighborhood" },
      { icon: <CheckCircle2 size={18} />, text: "Screen time that builds real-world skills" },
    ]},
    { label: "🏫 School", title: "Curriculum meets real-world discovery", benefits: [
      { icon: <BookOpen size={18} />, text: "Standards-aligned outdoor learning quests" },
      { icon: <Trophy size={18} />, text: "Inter-school competitions that motivate" },
      { icon: <TrendingUp size={18} />, text: "Track student engagement & outcomes" },
      { icon: <Sparkles size={18} />, text: "Students actually excited to learn" },
    ]},
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden" style={{ perspective: "1200px" }} id="main-content" role="main">

      {/* ═══════════ NAVBAR ═══════════ */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="fixed top-4 left-4 right-4 z-50 max-w-5xl mx-auto"
        aria-label="Main navigation"
      >
        <div className={`rounded-2xl px-5 h-14 flex items-center justify-between transition-all duration-500 ${
          scrolled ? "glass-strong shadow-lg shadow-background/50" : "glass"
        }`}>
          <div className="flex items-center gap-2">
            <motion.img
              src={heroLogo}
              alt="Local Hero logo"
              className="w-7 h-7"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              width={28}
              height={28}
            />
            <span className="font-display font-bold text-base text-foreground">
              Local<span className="text-gradient-hero">Hero</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <motion.button
                  key={link.href}
                  onClick={() => smoothScroll(link.href)}
                  className={`group relative flex items-center gap-0 rounded-xl py-1.5 px-2 transition-all duration-300 overflow-hidden ${
                    isActive
                      ? "text-primary bg-hero-green-light"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                >
                  <span className={`shrink-0 transition-colors duration-300 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {link.icon}
                  </span>
                  <motion.span
                    variants={{
                      rest: { width: 0, opacity: 0, marginLeft: 0 },
                      hover: { width: "auto", opacity: 1, marginLeft: 6 },
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="text-[12px] font-semibold whitespace-nowrap overflow-hidden"
                  >
                    {link.label}
                  </motion.span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/treegens")}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-hero-yellow/20 text-hero-yellow hover:bg-hero-yellow/30 transition-all"
            >
              <TreePine size={16} />
              Sponsor World Record
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="bg-gradient-hero-glow text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all active:scale-95 hidden sm:block"
            >
              Become a Hero
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl glass flex items-center justify-center text-foreground"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="mt-2 glass-strong rounded-2xl p-3 lg:hidden"
            >
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => smoothScroll(link.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                >
                  <span className="text-primary">{link.icon}</span>
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/treegens"); }}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-hero-yellow/20 text-hero-yellow py-3 rounded-xl text-sm font-bold hover:bg-hero-yellow/30 transition-all"
              >
                <TreePine size={16} />
                Sponsor World Record
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/auth"); }}
                className="w-full mt-2 bg-gradient-hero-glow text-primary-foreground py-3 rounded-xl text-sm font-bold"
              >
                Become a Hero
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ═══════════ HERO ═══════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden" aria-label="Hero">
        <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
          <video
            autoPlay muted loop playsInline
            poster={heroCommunity}
            className="w-full h-full object-cover"
            style={{ animation: "ken-burns 20s ease-in-out infinite alternate" }}
            aria-hidden="true"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/40" />

        {/* Floating game emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {[
            { emoji: "🌱", x: 8, delay: 0, dur: 9 },
            { emoji: "⭐", x: 22, delay: 2, dur: 7 },
            { emoji: "🏆", x: 78, delay: 1, dur: 8 },
            { emoji: "💚", x: 88, delay: 3, dur: 6 },
            { emoji: "🎯", x: 55, delay: 4, dur: 10 },
            { emoji: "🎮", x: 42, delay: 5, dur: 7 },
            { emoji: "🌍", x: 68, delay: 1.5, dur: 9 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute text-lg sm:text-xl"
              style={{ left: `${p.x}%` }}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "-10%", opacity: [0, 0.7, 0.7, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear" }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </div>

        <motion.div className="absolute top-[20%] right-[12%] hidden lg:block" style={{ y: arY1, animation: "float 4s ease-in-out infinite" }} aria-hidden="true">
          <img src={arChest} alt="" className="w-20 h-20 drop-shadow-[0_0_20px_hsl(var(--hero-yellow)/0.4)] opacity-80" loading="lazy" width={80} height={80} />
        </motion.div>
        <motion.div className="absolute top-[35%] right-[28%] hidden lg:block" style={{ y: arY2, animation: "float 5s ease-in-out infinite 0.5s" }} aria-hidden="true">
          <img src={arTree} alt="" className="w-14 h-14 drop-shadow-[0_0_16px_hsl(var(--hero-green-glow)/0.4)] opacity-70" loading="lazy" width={56} height={56} />
        </motion.div>
        <motion.div className="absolute bottom-[30%] right-[18%] hidden lg:block" style={{ y: arY3, animation: "float 3.5s ease-in-out infinite 1s" }} aria-hidden="true">
          <img src={arBook} alt="" className="w-12 h-12 drop-shadow-[0_0_14px_hsl(200_80%_60%/0.4)] opacity-60" loading="lazy" width={48} height={48} />
        </motion.div>

        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-hero-green-glow/8 blur-[120px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <button onClick={() => navigate("/auth")} className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6 hover:border-primary/30 transition-all cursor-pointer">
                <Gamepad2 size={13} className="text-hero-yellow icon-bounce-pop" />
                <span className="text-xs font-bold text-primary">The Game That Does Good</span>
                <span className="text-[9px] text-muted-foreground/60">·</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-[9px] font-bold text-hero-yellow"
                >
                  ⚡ LIVE
                </motion.span>
              </button>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
              className="font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] mb-4 tracking-tight"
            >
              <span className="text-gradient-white">Like Pokémon GO.</span><br />
              <span className="text-gradient-white">But For </span>
              <span className="text-gradient-hero">Real Impact.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-lg mb-6 leading-relaxed"
            >
              Catch quests, not creatures. Earn real rewards for planting trees, helping neighbors, and exploring your city. 
              <span className="text-foreground font-semibold"> Every action makes the world better.</span>
            </motion.p>

            {/* Typewriter curiosity hook */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              className="mb-6 h-8 flex items-center"
            >
              <span className="text-sm sm:text-base text-hero-yellow font-semibold italic">
                {twText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-[2px] h-4 bg-hero-yellow ml-0.5 align-middle"
                />
              </span>
            </motion.div>

            {/* Quick VS comparison — playful inline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {[
                { old: "Shoot stuff", now: "Plant trees 🌳", href: "/app/quests" },
                { old: "Sit inside", now: "Explore outside 🗺️", href: "#ar" },
                { old: "Virtual loot", now: "Real rewards 🎁", href: "#discovery-drops" },
              ].map((v, i) => (
                <motion.button
                  key={i}
                  onClick={() => v.href.startsWith("#") ? smoothScroll(v.href) : navigate(v.href)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.12 }}
                  className="glass-card rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs hover:border-primary/30 transition-all cursor-pointer"
                >
                  <span className="text-muted-foreground/50 line-through">{v.old}</span>
                  <span className="text-primary font-bold">→</span>
                  <span className="text-foreground font-semibold">{v.now}</span>
                </motion.button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <button onClick={() => navigate("/auth")} className="group bg-gradient-hero-glow text-primary-foreground px-8 py-4 rounded-2xl text-base font-bold hover:opacity-90 transition-all active:scale-[0.97] glow-green flex items-center justify-center gap-2.5">
                🎮 Start Playing <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => smoothScroll("#whats-in-it")} className="glass-card px-8 py-4 rounded-2xl text-base font-semibold text-foreground hover:border-primary/30 transition-all flex items-center justify-center gap-2.5">
                <ChevronDown size={18} className="text-primary animate-bounce" /> What's in it for me?
              </button>
            </motion.div>

            <motion.button
              onClick={() => navigate("/auth")}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1 }}
              className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="flex -space-x-2.5">
                {avatars.map((src, i) => (
                  <img key={i} src={src} alt={`Hero community member ${i + 1}`} className="w-9 h-9 rounded-full border-[2.5px] border-background object-cover" loading="lazy" width={36} height={36} />
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">12,000+ Heroes playing</p>
                <p className="text-xs text-muted-foreground">real quests across 340 cities 🌍</p>
              </div>
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ WHAT'S IN IT FOR ME — HOOK ═══════════ */}
      <FadeIn>
        <section id="whats-in-it" className="py-28 lg:py-36 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-hero-green-light/8 to-transparent" />
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-hero-yellow mb-4 block">The Real Question</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-bold text-gradient-white leading-tight mb-4">
                "OK but what's in it for <span className="text-gradient-hero">me</span>?"
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Fair question. Here's why 12,000 people already play every day.
              </p>
            </div>

            {/* Persona tabs */}
            <div className="flex justify-center gap-2 mb-10">
              {personas.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePersona(i)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activePersona === i
                      ? "bg-gradient-hero-glow text-primary-foreground shadow-lg glow-green"
                      : "glass-card text-muted-foreground hover:text-foreground hover:border-primary/20"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePersona}
                initial={{ opacity: 0, y: 20, rotateX: -5 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -20, rotateX: 5 }}
                transition={{ duration: 0.4 }}
              >
                <TiltCard className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-60 h-60 bg-hero-green-glow/8 blur-[80px] rounded-full" />
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-8 relative z-10">
                    {personas[activePersona].title}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                    {personas[activePersona].benefits.map((b, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 glass rounded-xl p-4 group hover:border-primary/20 transition-all"
                      >
                        <div className="w-9 h-9 rounded-xl bg-hero-green-light flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                          {b.icon}
                        </div>
                        <p className="text-sm text-foreground font-medium leading-relaxed pt-1.5">{b.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <FadeIn>
        <section id="how-it-works" className="py-28 lg:py-36">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-20">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">How It Works</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-bold text-gradient-white leading-tight">
                Three steps to hero status
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                { step: "01", title: "Discover a Quest", description: "Open the app and find missions near you — from park cleanups to helping a local business.", icon: <MapPin size={24} /> },
                { step: "02", title: "Complete It IRL", description: "Do the real-world action. Help a neighbor, clean a park, visit a landmark, learn something new.", icon: <Heart size={24} /> },
                { step: "03", title: "Level Up & Share", description: "Earn HERO points, unlock badges, climb leaderboards, and share your impact.", icon: <Star size={24} /> },
              ].map((item, i) => (
                <FadeInStagger key={i} delay={i * 0.15} className="text-center group">
                  <TiltCard className="cursor-default">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-hero-glow rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="relative z-10 w-full h-full rounded-2xl glass-card flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        {item.icon}
                      </div>
                    </div>
                    <span className="font-display text-4xl font-bold text-primary/10 block mb-2">{item.step}</span>
                    <h3 className="font-display font-bold text-xl text-foreground mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{item.description}</p>
                  </TiltCard>
                </FadeInStagger>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════ WHY IT MAKES SENSE — HOOK 2 ═══════════ */}
      <FadeIn>
        <section className="py-28 lg:py-36 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-hero-green-light/10 to-transparent" />
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-hero-orange mb-4 block">Think About It</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-bold text-gradient-white leading-tight mb-4">
                Why this actually makes sense
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              {/* Left: image + stat */}
              <FadeInStagger delay={0.1}>
                <TiltCard className="glass-card rounded-3xl overflow-hidden h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img src={communityGarden} alt="Community members volunteering in a garden" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="glass rounded-xl p-3">
                        <p className="text-[11px] font-bold text-foreground">📱 Average screen time: <span className="text-hero-orange">7 hours/day</span></p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">What if just 30 minutes of that actually helped someone?</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-display text-xl font-bold text-foreground">We're all glued to our phones anyway</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Local Hero doesn't fight screen time — it <span className="text-foreground font-medium">redirects</span> it. 
                      Instead of doom-scrolling, you're discovering your neighborhood, helping neighbors, and earning real rewards.
                    </p>
                  </div>
                </TiltCard>
              </FadeInStagger>

              {/* Right: compelling stats */}
              <div className="space-y-4">
                {[
                  { stat: "93%", desc: "of users say they discovered a place they didn't know existed in their own city", icon: <Globe size={20} />, color: "text-primary" },
                  { stat: "4.2x", desc: "more likely to volunteer again after completing their first quest", icon: <Heart size={20} />, color: "text-hero-yellow" },
                  { stat: "30 min", desc: "average daily outdoor time increase after joining Local Hero", icon: <Clock size={20} />, color: "text-hero-orange" },
                ].map((item, i) => (
                  <FadeInStagger key={i} delay={i * 0.12}>
                    <TiltCard className="glass-card-hover rounded-2xl p-5 flex items-start gap-4 cursor-default">
                      <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                        <span className={item.color}>{item.icon}</span>
                      </div>
                      <div>
                        <span className={`font-display text-2xl font-bold ${item.color}`}>{item.stat}</span>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </TiltCard>
                  </FadeInStagger>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════ APP PREVIEW ═══════════ */}
      <FadeIn>
        <section id="app-preview" className="py-28 lg:py-36 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-hero-green-light/8 to-transparent" />
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">App Preview</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-bold text-gradient-white leading-tight mb-4">
                Your pocket-sized hero HQ
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Everything you need to explore, complete quests, and track your impact — right in your pocket.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Phone Mockup with 3D tilt */}
              <FadeInStagger delay={0.1} className="flex justify-center">
                <div className="relative">
                  <TiltCard className="relative w-[280px] sm:w-[300px]">
                    <div className="glass-card rounded-[2.5rem] p-3 relative overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-background rounded-b-2xl z-20" />
                      <div className="rounded-[2rem] overflow-hidden bg-background aspect-[9/19.5] relative">
                        <AnimatePresence mode="wait">
                          {activeScreen === 0 && (
                            <motion.div key="s0" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="absolute inset-0 p-4 pt-10 space-y-3 overflow-hidden">
                              <div className="flex items-center justify-between">
                                <div><p className="text-[8px] text-muted-foreground">Good morning 👋</p><p className="text-[11px] font-bold font-display text-foreground">Alex</p></div>
                                <div className="w-7 h-7 rounded-full bg-secondary overflow-hidden"><img src={avatars[3]} alt="" className="w-full h-full object-cover" /></div>
                              </div>
                              <div className="glass-card rounded-xl p-3 relative overflow-hidden">
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-hero-green-glow/15 blur-[15px] rounded-full" />
                                <div className="flex items-center gap-1.5 mb-1.5"><Shield size={8} className="text-primary" /><span className="text-[7px] font-bold text-primary uppercase tracking-wider">Hero Journey</span></div>
                                <p className="text-[10px] font-bold font-display text-gradient-hero mb-2">Become a Local Hero</p>
                                <div className="flex gap-1.5 mb-2">
                                  <div className="glass rounded px-1.5 py-0.5 flex items-center gap-1"><Star size={7} className="text-hero-yellow fill-hero-yellow" /><span className="text-[7px] font-bold text-foreground">2,450</span></div>
                                  <div className="glass rounded px-1.5 py-0.5 flex items-center gap-1"><TrendingUp size={7} className="text-primary" /><span className="text-[7px] font-bold text-foreground">Lv 12</span></div>
                                  <div className="glass rounded px-1.5 py-0.5 flex items-center gap-1"><Flame size={7} className="text-hero-orange" /><span className="text-[7px] font-bold text-foreground">7🔥</span></div>
                                </div>
                                <div className="h-1.5 bg-secondary rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-hero-glow rounded-full" initial={{ width: "0%" }} whileInView={{ width: "72%" }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5 }} /></div>
                              </div>
                              <div className="glass-card rounded-xl p-2.5 flex items-center gap-2">
                                <img src={arChest} alt="" className="w-8 h-8" style={{ animation: "float 3s ease-in-out infinite" }} />
                                <div className="flex-1"><p className="text-[9px] font-bold font-display text-foreground">AR Quest Mode</p><p className="text-[7px] text-muted-foreground">3 quests nearby</p></div>
                                <div className="w-6 h-6 rounded-lg bg-gradient-hero-glow flex items-center justify-center"><ScanLine size={10} className="text-primary-foreground" /></div>
                              </div>
                              <div className="glass-card rounded-xl p-2.5">
                                <div className="flex items-center justify-between mb-1.5"><p className="text-[9px] font-bold font-display text-foreground">Daily Quest</p><span className="text-[6px] font-bold text-primary bg-hero-green-light px-1.5 py-0.5 rounded-full">+50 HERO</span></div>
                                <div className="flex items-center gap-2 mb-2"><div className="w-6 h-6 rounded-lg bg-hero-yellow-light flex items-center justify-center"><Zap size={10} className="text-hero-yellow" /></div><div><p className="text-[8px] font-bold text-foreground">Community Connection</p><p className="text-[6px] text-muted-foreground">Help an elderly neighbor</p></div></div>
                                <div className="bg-gradient-hero-glow rounded-lg py-1.5 text-center"><span className="text-[8px] font-bold text-primary-foreground">Start Daily Quest</span></div>
                              </div>
                              <div className="grid grid-cols-3 gap-1.5">
                                {[{ emoji: "🌳", val: "24", label: "Trees" }, { emoji: "🤝", val: "67", label: "Helped" }, { emoji: "🏪", val: "12", label: "Locals" }].map((s, i) => (
                                  <div key={i} className="glass-card rounded-lg p-1.5 text-center"><span className="text-xs">{s.emoji}</span><p className="text-[9px] font-bold text-foreground">{s.val}</p><p className="text-[6px] text-muted-foreground">{s.label}</p></div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                          {activeScreen === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="absolute inset-0 overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-background/20 to-background" />
                              <div className="relative p-4 pt-10 space-y-3 h-full flex flex-col">
                                <div className="flex items-center justify-between">
                                  <div className="glass rounded-lg px-2 py-1 flex items-center gap-1"><ScanLine size={8} className="text-primary" /><span className="text-[8px] font-bold text-primary">AR MODE</span></div>
                                  <div className="glass rounded-lg px-2 py-1 flex items-center gap-1"><MapPin size={8} className="text-hero-yellow" /><span className="text-[8px] font-bold text-foreground">3 nearby</span></div>
                                </div>
                                <div className="flex-1 flex items-center justify-center relative">
                                  <motion.div className="w-28 h-28 border-2 border-primary/40 rounded-2xl relative" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-lg" />
                                    <motion.div className="absolute left-2 right-2 h-0.5 bg-primary/60" animate={{ top: ["10%", "90%", "10%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
                                  </motion.div>
                                  <motion.img src={arChest} alt="" className="absolute w-12 h-12 right-2 top-4" animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }} transition={{ duration: 3, repeat: Infinity }} />
                                  <motion.img src={arTree} alt="" className="absolute w-10 h-10 left-4 bottom-8" animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} />
                                  <motion.img src={arBook} alt="" className="absolute w-8 h-8 right-8 bottom-4" animate={{ y: [0, -5, 0], rotate: [0, -3, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }} />
                                </div>
                                <motion.div className="glass-card rounded-xl p-3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-hero-yellow-light flex items-center justify-center text-sm">🏆</div>
                                    <div className="flex-1"><p className="text-[9px] font-bold text-foreground">Hidden Treasure Found!</p><p className="text-[7px] text-muted-foreground">Community Garden • 50m away</p></div>
                                    <div className="px-2 py-1 rounded-lg bg-gradient-hero-glow"><span className="text-[7px] font-bold text-primary-foreground">Claim</span></div>
                                  </div>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                          {activeScreen === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="absolute inset-0 p-4 pt-10 space-y-2 overflow-hidden">
                              <div className="flex items-center justify-between">
                                <div><p className="text-[8px] text-muted-foreground">This Week</p><p className="text-[11px] font-bold font-display text-foreground">🏆 Leaderboard</p></div>
                                <div className="glass rounded-lg px-2 py-1"><span className="text-[7px] font-bold text-primary">Your City</span></div>
                              </div>
                              <div className="flex items-end justify-center gap-2 py-2">
                                {[{ rank: 2, name: "Maya", pts: "4.2k", av: avatars[0], h: "h-14" }, { rank: 1, name: "Jordan", pts: "5.8k", av: avatars[1], h: "h-[4.5rem]" }, { rank: 3, name: "Sam", pts: "3.9k", av: avatars[4], h: "h-10" }].map((u, i) => (
                                  <motion.div key={u.rank} className="flex flex-col items-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.15 }}>
                                    <img src={u.av} alt="" className="w-7 h-7 rounded-full border-2 border-primary/30 mb-1" />
                                    <p className="text-[7px] font-bold text-foreground">{u.name}</p>
                                    <p className="text-[6px] text-primary font-bold">{u.pts}</p>
                                    <div className={`w-12 ${u.h} rounded-t-lg mt-1 flex items-start justify-center pt-1 ${u.rank === 1 ? "bg-gradient-to-t from-primary/30 to-primary/10" : "bg-secondary/60"}`}>
                                      <span className="text-[9px] font-bold text-foreground">{u.rank === 1 ? "👑" : `#${u.rank}`}</span>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                              {[{ rank: 4, name: "Alex (You)", pts: "2,450", av: avatars[3], hl: true }, { rank: 5, name: "Riley", pts: "2,100", av: avatars[2], hl: false }, { rank: 6, name: "Casey", pts: "1,890", av: avatars[0], hl: false }, { rank: 7, name: "Morgan", pts: "1,650", av: avatars[4], hl: false }].map((u, i) => (
                                <motion.div key={u.rank} className={`flex items-center gap-2 p-2 rounded-xl ${u.hl ? "glass-card border-primary/20" : ""}`} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
                                  <span className="text-[8px] font-bold text-muted-foreground w-4 text-center">#{u.rank}</span>
                                  <img src={u.av} alt="" className="w-5 h-5 rounded-full" />
                                  <p className={`text-[8px] font-bold flex-1 ${u.hl ? "text-primary" : "text-foreground"}`}>{u.name}</p>
                                  <span className="text-[7px] font-bold text-primary">{u.pts}</span>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* Bottom nav */}
                        <div className="absolute bottom-0 left-0 right-0 glass-strong py-2 px-3 z-10">
                          <div className="flex items-center justify-around">
                            {[{ icon: <MapPin size={12} />, active: activeScreen === 0 }, { icon: <Compass size={12} />, active: false }, { icon: <ScanLine size={12} />, special: true }, { icon: <Trophy size={12} />, active: activeScreen === 2 }, { icon: <Users size={12} />, active: false }].map((tab, i) => (
                              <div key={i} className={`flex flex-col items-center ${tab.special ? "-mt-2" : ""}`}>
                                {tab.special ? (
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeScreen === 1 ? "bg-gradient-hero-glow ring-2 ring-primary/30" : "bg-gradient-hero-glow"}`}>{tab.icon}</div>
                                ) : (
                                  <div className={`p-1 transition-colors ${tab.active ? "text-primary" : "text-muted-foreground"}`}>{tab.icon}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -inset-8 bg-hero-green-glow/8 blur-[60px] rounded-full -z-10" />
                  </TiltCard>

                  {/* Floating badges */}
                  <motion.div
                    className="absolute -right-6 top-[15%] glass-card rounded-xl px-3 py-2 hidden sm:flex items-center gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    style={{ animation: "float 4s ease-in-out infinite" }}
                  >
                    <div className="w-6 h-6 rounded-lg bg-hero-yellow-light flex items-center justify-center">
                      <Star size={12} className="text-hero-yellow fill-hero-yellow" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-foreground">+100 HERO</p>
                      <p className="text-[7px] text-muted-foreground">Quest Complete!</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -left-4 bottom-[25%] glass-card rounded-xl px-3 py-2 hidden sm:flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    style={{ animation: "float 3.5s ease-in-out infinite 1s" }}
                  >
                    <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Sparkles size={12} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-foreground">Level Up!</p>
                      <p className="text-[7px] text-muted-foreground">Now Level 13</p>
                    </div>
                  </motion.div>
                </div>
              </FadeInStagger>

              {/* Feature list */}
              <div className="space-y-4">
                {screens.map((screen, i) => (
                  <FadeInStagger key={i} delay={i * 0.12}>
                    <button
                      onClick={() => setActiveScreen(i)}
                      className={`w-full text-left glass-card rounded-2xl p-5 transition-all duration-300 ${
                        activeScreen === i
                          ? "border-primary/30 shadow-[0_0_20px_-4px_hsl(var(--hero-green-glow)/0.15)]"
                          : "hover:border-muted-foreground/20"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          activeScreen === i ? "bg-gradient-hero-glow text-primary-foreground" : "bg-secondary text-muted-foreground"
                        }`}>
                          {i === 0 && <Zap size={18} />}
                          {i === 1 && <ScanLine size={18} />}
                          {i === 2 && <Trophy size={18} />}
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-base text-foreground mb-1">{screen.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{screen.desc}</p>
                        </div>
                      </div>
                    </button>
                  </FadeInStagger>
                ))}

                <FadeInStagger delay={0.4}>
                  <button
                    onClick={() => navigate("/auth")}
                    className="group w-full bg-gradient-hero-glow text-primary-foreground py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 hover:opacity-90 transition-all active:scale-[0.97] glow-green mt-6"
                  >
                    Try the App Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </FadeInStagger>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════ AR SECTION ═══════════ */}
      <FadeIn>
        <section id="ar" className="py-28 lg:py-36">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">Augmented Reality</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-bold text-gradient-white leading-tight mb-4">
                Your city becomes the game map
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Open your camera and see a world of quests, treasures, and learning checkpoints — all around you.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <FadeInStagger delay={0.1} className="flex justify-center order-2 lg:order-1">
                <TiltCard className="relative w-72 sm:w-80">
                  <div className="glass-card rounded-[2.5rem] p-3 relative overflow-hidden">
                    <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-[hsl(160_20%_8%)] via-[hsl(200_15%_12%)] to-[hsl(160_10%_6%)] aspect-[9/19] relative">
                      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                      <div className="absolute inset-8">
                        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/40 rounded-tl" />
                        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary/40 rounded-tr" />
                        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary/40 rounded-bl" />
                        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/40 rounded-br" />
                      </div>
                      <img src={arChest} alt="AR treasure chest quest" className="absolute top-[22%] left-[12%] w-16 h-16 drop-shadow-[0_0_12px_hsl(var(--hero-yellow)/0.5)]" style={{ animation: "float 3s ease-in-out infinite" }} loading="lazy" width={64} height={64} />
                      <img src={arTree} alt="AR tree planting mission" className="absolute top-[48%] right-[8%] w-14 h-14 drop-shadow-[0_0_12px_hsl(var(--hero-green-glow)/0.5)]" style={{ animation: "float 3.5s ease-in-out infinite 0.5s" }} loading="lazy" width={56} height={56} />
                      <img src={arBook} alt="AR learning checkpoint" className="absolute bottom-[28%] left-[28%] w-12 h-12 drop-shadow-[0_0_12px_hsl(200_80%_60%/0.5)]" style={{ animation: "float 4s ease-in-out infinite 1s" }} loading="lazy" width={48} height={48} />
                      <div className="absolute top-4 left-4 right-4 flex justify-between">
                        <div className="glass rounded-lg px-2 py-1 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          <span className="text-[9px] font-semibold text-foreground">AR Active</span>
                        </div>
                        <div className="glass rounded-lg px-2 py-1">
                          <span className="text-[9px] font-bold text-hero-yellow">3 found</span>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-3 right-3">
                        <div className="glass rounded-xl p-2.5 text-center">
                          <span className="text-[10px] font-bold text-primary">Scan to collect 🎯</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -inset-6 bg-hero-green-glow/8 blur-[50px] rounded-full -z-10" />
                </TiltCard>
              </FadeInStagger>

              <div className="order-1 lg:order-2 space-y-6">
                {[
                  { img: arChest, title: "Treasure Hunts", desc: "Find hidden HERO treasures in parks, plazas, and public spaces. Each chest unlocks rewards and new quests.", points: "+100 HERO" },
                  { img: arTree, title: "Plant & Grow Missions", desc: "Plant virtual trees that track real environmental impact. Watch your forest grow as your community improves.", points: "+75 HERO" },
                  { img: arBook, title: "Learning Checkpoints", desc: "Discover educational AR content at real-world locations. Science, history, sustainability — learn by exploring.", points: "+50 XP" },
                ].map((item, i) => (
                  <FadeInStagger key={i} delay={i * 0.12}>
                    <TiltCard className="glass-card-hover rounded-2xl p-5 flex items-start gap-4 cursor-pointer">
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-hero-green-glow/15 blur-[10px] rounded-full" />
                        <img src={item.img} alt="" className="w-14 h-14 relative z-10" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-display font-bold text-base text-foreground">{item.title}</h3>
                          <span className="text-[10px] font-bold text-primary bg-hero-green-light px-2 py-0.5 rounded-full">{item.points}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </TiltCard>
                  </FadeInStagger>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════ COMMUNITY / HEROES ═══════════ */}
      <FadeIn>
        <section id="community" className="py-28 lg:py-36 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-hero-green-light/10 to-transparent" />
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">Community</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-bold text-gradient-white leading-tight mb-4">
                Heroes Are Everywhere
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Real people. Real actions. Real impact. Meet some of our heroes.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { image: storyCleanup, name: "Sarah K.", location: "Portland, OR", avatar: avatars[0], quote: "Picked up trash in my neighborhood park and earned 50 HERO points. Small actions, big feeling. 🌿", points: 1240 },
                { image: communityGarden, name: "The Green Crew", location: "Austin, TX", avatar: avatars[2], quote: "Started a community garden quest and now 20 neighbors are growing food together! 🌱", points: 2850 },
                { image: storyCafe, name: "Marcus D.", location: "Brooklyn, NY", avatar: avatars[1], quote: "Helped a local café owner set up for their community event and unlocked the Neighbor Hero badge. ☕", points: 980 },
              ].map((card, i) => (
                <FadeInStagger key={i} delay={i * 0.12}>
                  <TiltCard>
                    <HeroStoryCard {...card} />
                  </TiltCard>
                </FadeInStagger>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════ SCHOOLS ═══════════ */}
      <FadeIn>
        <section id="schools" className="py-28 lg:py-36">
          <div className="max-w-6xl mx-auto px-6">
            <TiltCard className="glass-card rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-hero-purple/8 blur-[100px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/8 blur-[80px] rounded-full" />

              <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-6">
                    <GraduationCap size={14} className="text-hero-purple" />
                    <span className="text-xs font-semibold text-hero-purple">For Schools & Educators</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient-white mb-5 leading-tight">
                    Learning that actually sticks
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    Students complete real-world learning quests. Science through plant identification. History at real landmarks. Sustainability through action.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {[
                      { emoji: "🔬", label: "Science Quests" },
                      { emoji: "🏛️", label: "History Tours" },
                      { emoji: "♻️", label: "Eco Missions" },
                      { emoji: "📐", label: "Math Challenges" },
                    ].map((s, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="glass-card rounded-xl p-3.5 text-center cursor-default"
                      >
                        <span className="text-2xl">{s.emoji}</span>
                        <p className="text-xs font-semibold text-foreground mt-1.5">{s.label}</p>
                      </motion.div>
                    ))}
                  </div>
                  <button onClick={() => navigate("/app/schools")} className="glass-card px-6 py-3 rounded-xl font-semibold text-sm text-foreground hover:border-hero-purple/30 transition-all inline-flex items-center gap-2">
                    <BookOpen size={16} className="text-hero-purple" /> Explore Schools Mode
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <img src={schoolsOutdoor} alt="Students learning outdoors with tablets and nature" className="w-full h-80 lg:h-96 object-cover rounded-2xl" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="glass rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-hero-purple/20 flex items-center justify-center">
                        <GraduationCap size={16} className="text-hero-purple" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">500+ schools active</p>
                        <p className="text-[10px] text-muted-foreground">28,000 students learning through quests</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════ DISCOVERY DROPS — GAME-LIKE ═══════════ */}
      <DiscoveryDropsSection />


      {/* ═══════════ GAME-LIKE LEVEL PROGRESS ═══════════ */}
      <FadeIn>
        <section className="py-20 lg:py-28 relative">
          <div className="max-w-4xl mx-auto px-6">
            <TiltCard className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-hero-yellow/8 blur-[60px] rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Swords size={20} className="text-hero-yellow" />
                  <span className="text-xs font-bold text-hero-yellow uppercase tracking-[0.15em]">Your Hero Journey</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-gradient-white mb-8">Level up with every action</h3>

                {/* XP Progress visualization */}
                <div className="space-y-4 mb-8">
                  {[
                    { level: 1, title: "Newcomer", xp: "0", icon: "🌱", width: "10%", desc: "Complete your first quest" },
                    { level: 5, title: "Explorer", xp: "500", icon: "🧭", width: "30%", desc: "Discover 10 locations" },
                    { level: 15, title: "Champion", xp: "2,500", icon: "⚔️", width: "55%", desc: "Help 50 neighbors" },
                    { level: 30, title: "Legend", xp: "10,000", icon: "👑", width: "80%", desc: "Lead your city's movement" },
                    { level: 50, title: "Mythic Hero", xp: "50,000", icon: "🌟", width: "100%", desc: "Shape the ecosystem" },
                  ].map((tier, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-10 text-center shrink-0">
                        <motion.span
                          className="text-xl"
                          whileHover={{ scale: 1.3 }}
                        >
                          {tier.icon}
                        </motion.span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-foreground font-display">Lv {tier.level} · {tier.title}</span>
                          <span className="text-[10px] text-muted-foreground">{tier.xp} XP</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-hero-glow rounded-full"
                            initial={{ width: "0%" }}
                            whileInView={{ width: tier.width }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{tier.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  {["🏅 Daily Streaks", "🎖️ Achievement Badges", "🏆 City Leaderboards", "⚡ Combo Multipliers"].map((feat, i) => (
                    <motion.span
                      key={i}
                      className="glass rounded-full px-4 py-2 text-xs font-semibold text-foreground cursor-default"
                      whileHover={{ scale: 1.08, y: -2 }}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      {feat}
                    </motion.span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </div>
        </section>
      </FadeIn>


      <FadeIn>
        <section id="impact" className="py-28 lg:py-36 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-hero-green-light/10 to-transparent" />
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">Real Impact</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-bold text-gradient-white leading-tight mb-4">
                Numbers that matter
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Every quest completed creates real, measurable impact in communities around the world.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto mb-12">
              {[
                { emoji: "🌳", value: 45000, label: "trees planted by heroes", color: "primary", suffix: "" },
                { emoji: "🤝", value: 120000, label: "neighbors helped", color: "yellow", suffix: "" },
                { emoji: "🏫", value: 500, label: "schools teaching through quests", color: "purple", suffix: "+" },
                { emoji: "🚴", value: 1200000, label: "miles biked instead of driven", color: "green", suffix: "" },
              ].map((card, i) => (
                <FadeInStagger key={i} delay={i * 0.1}>
                  <TiltCard>
                    <ImpactCounterCard {...card} />
                  </TiltCard>
                </FadeInStagger>
              ))}
            </div>

            {/* Interactive Impact Calculator */}
            <FadeInStagger delay={0.3}>
              <div className="max-w-xl mx-auto">
                <ImpactCalculator />
              </div>
            </FadeInStagger>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════ WORLD RECORD PARTNER ═══════════ */}
      <FadeIn>
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden cursor-pointer group border-2 border-transparent hover:border-primary/20 transition-all"
              onClick={() => navigate("/treegens")}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--hero-green-glow) / 0.15), hsl(var(--hero-yellow) / 0.1), hsl(var(--primary) / 0.15))",
                  backgroundSize: "200% 200%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Glowing orbs */}
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/20 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-hero-yellow/15 blur-[70px] rounded-full group-hover:scale-120 transition-transform duration-700" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-hero-green-glow/5 blur-[100px] rounded-full" />
              
              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary/40"
                  style={{
                    left: `${15 + i * 14}%`,
                    top: `${20 + (i % 3) * 30}%`,
                  }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 60%)",
                }}
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1">
                  <motion.div
                    className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <TreePine size={14} className="text-primary" />
                    </motion.div>
                    <span className="text-xs font-bold text-foreground tracking-wide">🌟 World Record Partner</span>
                  </motion.div>
                  
                  <h3 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
                    <span className="text-gradient-hero">1 Billion Trees</span>
                    <br />
                    <span className="text-foreground/80">One World Record</span>
                  </h3>
                  
                  <p className="text-lg text-muted-foreground mb-5 max-w-lg leading-relaxed">
                    TreeGens DAO × HubCast Media × <span className="text-primary font-semibold">Richard Lukens</span> (Live Aid). 
                    Aiming for Live Aid–scale viewership. Get your brand in front of billions.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="inline-flex items-center gap-1.5 text-xs glass rounded-full px-3 py-1.5 text-muted-foreground">
                      <Trophy size={12} className="text-hero-yellow" /> Guinness 2026
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs glass rounded-full px-3 py-1.5 text-muted-foreground">
                      <Users size={12} className="text-primary" /> 1.9B Viewer Target
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs glass rounded-full px-3 py-1.5 text-muted-foreground">
                      <Shield size={12} className="text-hero-purple" /> Verified Impact
                    </span>
                  </div>
                  
                  <motion.button
                    className="group/btn inline-flex items-center gap-2 bg-gradient-hero-glow text-primary-foreground px-6 py-3 rounded-xl font-bold group-hover:gap-3 transition-all shadow-lg shadow-primary/20"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Become a Sponsor <ArrowRight size={18} />
                  </motion.button>
                </div>
                
                <div className="flex flex-col gap-3 shrink-0">
                  {[
                    { val: "1B", label: "Trees", color: "text-primary" },
                    { val: "1.9B", label: "Viewer Goal", color: "text-hero-yellow" },
                    { val: "2026", label: "World Record", color: "text-hero-purple" },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      className="glass rounded-2xl px-6 py-4 text-center min-w-[120px] border border-transparent hover:border-primary/20 transition-all"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <p className={`font-display text-2xl font-bold ${s.color}`}>{s.val}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </FadeIn>

      <CtaSection smoothScroll={smoothScroll} />

      {/* ═══════════ WEB3 ECOSYSTEM FOOTER ═══════════ */}
      <footer className="relative border-t border-border overflow-hidden" aria-label="Site footer">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-hero-purple/5 blur-[120px] rounded-full pointer-events-none" />

        {/* ── TOKENOMICS HERO ── */}
        <div className="relative py-24 lg:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 glass-card rounded-full px-5 py-2.5 mb-6">
                  <img src={ogLogo} alt="0G Chain" className="w-6 h-6" />
                  <span className="text-xs font-bold text-primary">Built on 0G Chain</span>
                  <span className="text-[9px] text-muted-foreground px-2 py-0.5 rounded-full bg-primary/10">Apollo Ready</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-bold leading-tight mb-4">
                  <span className="text-gradient-white">Transparent. Fair.</span>{" "}
                  <span className="text-gradient-hero">Community-Owned.</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Every action is verified, every reward is earned, and your achievements are permanent. No middlemen, no hidden fees.
                </p>
              </div>
            </FadeIn>

            {/* ── CORE PILLARS ── */}
            <div className="grid md:grid-cols-3 gap-5 mb-20">
              {[
                {
                  icon: <Lock size={22} />,
                  color: "text-primary",
                  glow: "bg-primary/10",
                  title: "Built to Last",
                  points: [
                    "Your rewards are locked in — they can't be taken away",
                    "No insider advantages or special treatment",
                    "Community-governed decisions",
                    "Fully transparent and audited",
                  ],
                },
                {
                  icon: <Coins size={22} />,
                  color: "text-hero-yellow",
                  glow: "bg-hero-yellow/10",
                  title: "Fair Rewards",
                  points: [
                    "Everyone's contribution counts equally",
                    "Rewards based on real actions, not popularity",
                    "Real-world impact funds real rewards",
                    "No bots, no gaming the system",
                  ],
                },
                {
                  icon: <Gem size={22} />,
                  color: "text-hero-purple",
                  glow: "bg-hero-purple/10",
                  title: "Permanent Achievements",
                  points: [
                    "Your badges prove your real-world impact",
                    "Unlock exclusive perks and rewards",
                    "Special benefits with partner apps",
                    "A reputation you actually earned",
                  ],
                },
              ].map((pillar, i) => (
                <FadeInStagger key={i} delay={i * 0.12}>
                  <TiltCard>
                    <div className="glass-card rounded-2xl p-7 h-full relative overflow-hidden group hover:border-primary/20 transition-all">
                      <div className={`absolute -top-6 -right-6 w-20 h-20 ${pillar.glow} blur-[25px] rounded-full group-hover:scale-150 transition-transform`} />
                      <div className="relative z-10">
                        <div className={`w-11 h-11 rounded-xl ${pillar.glow} flex items-center justify-center mb-5 ${pillar.color}`}>
                          {pillar.icon}
                        </div>
                        <h3 className="font-display text-lg font-bold text-foreground mb-4">{pillar.title}</h3>
                        <ul className="space-y-2.5">
                          {pillar.points.map((p, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                              <CheckCircle2 size={14} className={`${pillar.color} mt-0.5 shrink-0`} />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TiltCard>
                </FadeInStagger>
              ))}
            </div>

            {/* ── HOW IT FLOWS ── */}
            <FadeIn>
              <div className="mb-20">
                <h3 className="font-display text-2xl font-bold text-foreground text-center mb-10">How the Ecosystem Works</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: <QrCode size={20} />, label: "Discover a Quest", desc: "Scan a QR code or find quests near you on the map", color: "text-primary", bg: "bg-primary/10" },
                    { icon: <TreePine size={20} />, label: "Complete Real Tasks", desc: "Plant, clean, help, teach — verified by the community", color: "text-hero-green-glow", bg: "bg-hero-green-glow/10" },
                    { icon: <Coins size={20} />, label: "Earn Rewards", desc: "Get HERO points redeemable for real perks and prizes", color: "text-hero-yellow", bg: "bg-hero-yellow/10" },
                    { icon: <Fingerprint size={20} />, label: "Build Your Reputation", desc: "Earn permanent badges that prove your impact", color: "text-hero-purple", bg: "bg-hero-purple/10" },
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      className="glass-card rounded-xl p-5 text-center relative group hover:border-primary/20 transition-all"
                      whileHover={{ y: -4 }}
                    >
                      {i < 3 && (
                        <div className="hidden lg:block absolute top-1/2 -right-3 text-muted-foreground/30 z-20">
                          <ArrowRight size={14} />
                        </div>
                      )}
                      <div className={`w-10 h-10 rounded-lg ${step.bg} flex items-center justify-center mx-auto mb-3 ${step.color}`}>
                        {step.icon}
                      </div>
                      <p className="font-display text-sm font-bold text-foreground mb-1">{step.label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* ── CREATOR ECONOMY + QUEST FUNDING ── */}
            <FadeIn>
              <div className="grid md:grid-cols-2 gap-5 mb-20">
                <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-hero-orange/8 blur-[40px] rounded-full" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-hero-orange/10 flex items-center justify-center text-hero-orange">
                        <Layers size={20} />
                      </div>
                      <h3 className="font-display text-lg font-bold text-foreground">Creator Economy</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      Anyone can create a tour, quest, or community challenge. Your good deeds generate real rewards — 
                      the more people complete quests, the more value flows back to the community. <span className="text-foreground font-medium">Real actions, real rewards.</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["QR Quests", "Treasure Drops", "Tours", "Challenges", "Community-funded"].map((tag) => (
                        <span key={tag} className="glass rounded-full px-3 py-1 text-xs font-medium text-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/8 blur-[40px] rounded-full" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Gamepad2 size={20} />
                      </div>
                      <h3 className="font-display text-lg font-bold text-foreground">Achievement Perks</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      Your achievements aren't just badges — they unlock <span className="text-foreground font-medium">exclusive perks and rewards</span> across
                      partner apps and experiences. The more you do, the more you unlock.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Exclusive Perks", "Partner Rewards", "Special Access", "Unique Experiences", "Community Benefits"].map((tag) => (
                        <span key={tag} className="glass rounded-full px-3 py-1 text-xs font-medium text-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ── FAIRNESS MANIFESTO ── */}
            <FadeIn>
              <div className="glass-card rounded-2xl p-8 lg:p-10 mb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-hero-purple/5" />
                <div className="relative z-10 text-center max-w-3xl mx-auto">
                  <Shield size={28} className="text-hero-yellow mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Fairness Promise</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-left mb-6">
                    {[
                      { icon: <Users size={14} />, text: "Everyone's contribution counts equally — follower count doesn't matter" },
                      { icon: <Globe size={14} />, text: "Help remotely or in person — flexible ways to contribute" },
                      { icon: <CircleDot size={14} />, text: "No special advantages — fair for everyone" },
                      { icon: <Lock size={14} />, text: "Rules are transparent and can't be changed unfairly" },
                      { icon: <Link2 size={14} />, text: "Delegate tasks — as long as the job gets done" },
                      { icon: <Fingerprint size={14} />, text: "Your reputation is earned, never bought" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5 shrink-0">{item.icon}</span>
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ── TECH STACK BAR ── */}
            <FadeIn>
              <div className="flex flex-wrap justify-center gap-3 mb-16">
                {[
                  { label: "0G Chain", desc: "Secure Infrastructure" },
                  { label: "Verified Impact", desc: "Proof of Action" },
                  { label: "Green Rewards", desc: "Eco-Friendly" },
                  { label: "QR Quests", desc: "Location-Based" },
                  { label: "HERO Points", desc: "Community Rewards" },
                ].map((tech, i) => (
                  <motion.div
                    key={i}
                    className="glass rounded-xl px-5 py-3 text-center cursor-default"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <p className="text-xs font-bold text-foreground">{tech.label}</p>
                    <p className="text-[10px] text-muted-foreground">{tech.desc}</p>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ── STRUCTURED FOOTER ── */}
        <div className="border-t border-border">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
              {/* Brand Column */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <img src={heroLogo} alt="" className="w-8 h-8" />
                  <span className="font-display font-bold text-lg text-foreground">Local<span className="text-gradient-hero">Hero</span></span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  The game that turns your neighborhood into a playground for good. 🌍
                </p>
                <div className="flex items-center gap-2">
                  <img src={ogLogo} alt="0G Chain" className="w-5 h-5 opacity-60" />
                  <span className="text-[11px] text-muted-foreground">Powered by 0G Chain</span>
                </div>
              </div>

              {/* Explore Column */}
              <div>
                <h4 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Compass size={14} className="text-primary" /> Explore
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { label: "How It Works", action: () => smoothScroll("#how-it-works") },
                    { label: "AR Quests", action: () => smoothScroll("#ar") },
                    { label: "Discovery Drops", action: () => smoothScroll("#discovery-drops") },
                    { label: "Schools", action: () => smoothScroll("#schools") },
                    { label: "Impact", action: () => smoothScroll("#impact") },
                  ].map((link) => (
                    <li key={link.label}>
                      <button onClick={link.action} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp size={14} className="text-hero-yellow" /> Company
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { label: "For Business", action: () => navigate("/business") },
                    { label: "Investors", action: () => navigate("/investors") },
                    { label: "Pitch Deck", action: () => navigate("/pitch") },
                    { label: "The idea", action: () => navigate("/the-idea") },
                    { label: "HeroPaper", action: () => navigate("/heropaper") },
                    { label: "HERO Token (technical)", action: () => navigate("/hero-token") },
                    { label: "Build in Public", action: () => navigate("/build-in-public") },
                    { label: "Roadmap & FAQ", action: () => navigate("/roadmap") },
                  ].map((link) => (
                    <li key={link.label}>
                      <button onClick={link.action} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Get Involved Column */}
              <div>
                <h4 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Heart size={14} className="text-hero-orange" /> Get Involved
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <button onClick={() => navigate("/report-spot")} className="text-sm text-hero-green-glow hover:text-primary transition-colors font-medium">
                      Report a spot 🌿
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate("/fund")} className="text-sm text-hero-orange hover:text-hero-yellow transition-colors font-medium">
                      Fund Us 💛
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate("/auth")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Join as Hero
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate("/install")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Install App
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate("/treegens")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      🌳 TreeGens World Record
                    </button>
                  </li>
                </ul>

                {/* Mini CTA */}
                <motion.button
                  onClick={() => navigate("/auth")}
                  className="mt-5 w-full bg-gradient-hero text-primary-foreground font-display font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Gamepad2 size={14} /> Start Playing
                </motion.button>
              </div>
            </div>

            {/* Bottom Strip */}
            <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">© 2026 Local Hero · Fair by design</p>
              <div className="flex flex-wrap items-center justify-center gap-5">
                <Link to="/the-idea" className="text-[10px] text-muted-foreground/60 hover:text-primary transition-colors">
                  The idea
                </Link>
                <Link to="/hero-token" className="text-[10px] text-muted-foreground/60 hover:text-primary transition-colors">
                  HERO Token paper
                </Link>
                <Link to="/report-spot" className="text-[10px] text-muted-foreground/60 hover:text-primary transition-colors">
                  Report a spot
                </Link>
                <Link to="/build-in-public" className="text-[10px] text-muted-foreground/60 hover:text-primary transition-colors">
                  Build in Public
                </Link>
                <Link to="/privacy" className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors">Privacy</Link>
                <Link to="/terms" className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors">Terms</Link>
                <a href="mailto:hello@localhero.space" className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <CoinCollectorGame />
      <LiveActivityFeed />
      <ExitIntentPopup />

      {/* Urgency Banner */}
      <AnimatePresence>
        {showUrgencyBanner && !urgencyDismissed && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 left-0 right-0 z-[60] glass-strong border-b border-primary/20"
          >
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-foreground font-medium flex items-center gap-2">
                <Flame size={16} className="text-hero-yellow" />
                <span><strong className="text-primary">237 quests</strong> available near you — <strong className="text-hero-yellow">12 expire today</strong></span>
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setUrgencyDismissed(true); setShowUrgencyBanner(false); navigate("/auth"); }}
                  className="bg-gradient-hero-glow text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-90 transition-all hidden sm:block"
                >
                  Start Now
                </button>
                <button
                  onClick={() => { setUrgencyDismissed(true); setShowUrgencyBanner(false); }}
                  className="text-muted-foreground/50 hover:text-foreground transition-colors"
                  aria-label="Dismiss banner"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════ COMPONENTS ═══════════ */

const HeroStoryCard = ({ image, name, location, avatar, quote, points }: {
  image: string; name: string; location: string; avatar: string; quote: string; points: number;
}) => (
  <div className="glass-card-hover rounded-2xl overflow-hidden group cursor-pointer">
    <div className="relative h-48 overflow-hidden">
      <img src={image} alt={`${name} from ${location} completing a hero quest`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <img src={avatar} alt={`${name} avatar`} className="w-8 h-8 rounded-full object-cover ring-2 ring-background" loading="lazy" width={32} height={32} />
        <div>
          <p className="text-xs font-bold text-foreground">{name}</p>
          <p className="text-[10px] text-muted-foreground">{location}</p>
        </div>
      </div>
    </div>
    <div className="p-5">
      <p className="text-sm text-foreground leading-relaxed mb-3">"{quote}"</p>
      <div className="flex items-center gap-1.5">
        <Star size={12} className="text-hero-yellow fill-hero-yellow" />
        <span className="text-xs font-bold text-primary">{points.toLocaleString()} HERO earned</span>
      </div>
    </div>
  </div>
);

const ImpactCounterCard = ({ emoji, value, label, color, suffix }: { emoji: string; value: number; label: string; color: string; suffix: string }) => {
  const glowMap: Record<string, string> = {
    primary: "bg-hero-green-glow/5",
    yellow: "bg-hero-yellow/5",
    purple: "bg-hero-purple/5",
    green: "bg-hero-green-glow/5",
  };
  return (
    <div className={`glass-card rounded-2xl p-7 relative overflow-hidden group hover:border-primary/20 transition-all`}>
      <div className={`absolute -top-8 -right-8 w-24 h-24 ${glowMap[color]} blur-[30px] rounded-full group-hover:scale-150 transition-transform`} />
      <div className="relative z-10">
        <span className="text-3xl">{emoji}</span>
        <p className="font-display text-3xl font-bold text-foreground mt-3 mb-1">
          <AnimatedCounter target={value} suffix={suffix} />
        </p>
        <p className="text-base text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export default Landing;