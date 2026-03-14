import { ArrowRight, ArrowLeft, Shield, Lock, Coins, Gem, QrCode, TreePine, Fingerprint, Gamepad2, Users, Globe, CircleDot, Link2, Layers, CheckCircle2, Zap, Heart, Star, Sparkles, ChevronDown, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import heroLogo from "@/assets/hero-logo-glow.png";
import heropaperHero from "@/assets/heropaper-hero.jpg";
import heropaperQuest from "@/assets/heropaper-quest.jpg";
import heropaperToken from "@/assets/heropaper-token.jpg";

/* ═══════════ REUSABLE ANIMATIONS ═══════════ */
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

/* ═══════════ CHAPTER DIVIDER ═══════════ */
const ChapterDivider = ({ number, title, subtitle }: { number: string; title: string; subtitle: string }) => (
  <FadeIn className="py-20 md:py-28 text-center relative">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span className="text-[12rem] md:text-[16rem] font-display font-bold text-primary/[0.03] select-none">{number}</span>
    </div>
    <div className="relative z-10">
      <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block">Chapter {number}</span>
      <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-lg text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
    </div>
  </FadeIn>
);

/* ═══════════ HERO STORY BLOCK ═══════════ */
const StoryBlock = ({ image, name, role, quote, context, isReversed = false }: {
  image: string; name: string; role: string; quote: string; context: string; isReversed?: boolean;
}) => (
  <FadeIn>
    <div className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center mb-20`}>
      <div className="w-full md:w-5/12 relative group">
        <div className="rounded-2xl overflow-hidden relative">
          <img src={image} alt={name} className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
        <motion.div 
          className="absolute -bottom-4 left-6 right-6 glass-card rounded-xl px-5 py-3"
          whileHover={{ y: -4 }}
        >
          <p className="text-sm font-bold text-foreground">{name}</p>
          <p className="text-xs text-primary">{role}</p>
        </motion.div>
      </div>
      <div className="w-full md:w-7/12 pt-4 md:pt-0">
        <div className="relative">
          <span className="text-6xl text-primary/20 font-display absolute -top-6 -left-2">"</span>
          <blockquote className="text-xl md:text-2xl font-display text-foreground leading-relaxed pl-6 border-l-2 border-primary/30 mb-4">
            {quote}
          </blockquote>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed pl-6">{context}</p>
      </div>
    </div>
  </FadeIn>
);

/* ═══════════ FLOW STEP ═══════════ */
const FlowStep = ({ number, icon, title, description, color, delay }: {
  number: string; icon: React.ReactNode; title: string; description: string; color: string; delay: number;
}) => (
  <FadeInStagger delay={delay}>
    <motion.div 
      className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:border-primary/20 transition-all"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={`absolute -top-8 -right-8 w-24 h-24 ${color} blur-[30px] rounded-full opacity-40 group-hover:opacity-70 group-hover:scale-150 transition-all`} />
      <div className="relative z-10">
        <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4 block">Step {number}</span>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">{icon}</div>
        <h4 className="font-display text-lg font-bold text-foreground mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  </FadeInStagger>
);

/* ═══════════ MAIN PAGE ═══════════ */
const HeroPaper = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const [activeChapter, setActiveChapter] = useState(0);
  const chapters = ["The Problem", "The Solution", "QR & GeoDrops", "Tokenomics", "NFTs & Perks", "Fairness", "The Future"];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Animated growing grass background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Ground gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-hero-green/[0.06] to-transparent" />
        {/* Grass blades SVG */}
        <svg className="absolute bottom-0 left-0 w-full" style={{ height: '220px' }} viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 80 }).map((_, i) => {
            const x = (i / 80) * 1440 + Math.sin(i * 7) * 12;
            const h = 60 + Math.sin(i * 3.7) * 40 + Math.cos(i * 2.1) * 20;
            const sway = Math.sin(i * 1.3) * 15;
            const delay = (i * 0.08) % 3;
            const hue = 140 + Math.sin(i * 0.5) * 20;
            const opacity = 0.15 + Math.sin(i * 2) * 0.08;
            return (
              <motion.path
                key={i}
                d={`M${x},220 Q${x + sway},${220 - h * 0.6} ${x + sway * 0.5},${220 - h}`}
                stroke={`hsla(${hue}, 60%, 40%, ${opacity})`}
                strokeWidth={2 + Math.sin(i * 4) * 1.2}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1],
                  opacity: [0, opacity],
                }}
                transition={{
                  pathLength: { duration: 2.5 + Math.random(), delay, ease: "easeOut" },
                  opacity: { duration: 1.5, delay, ease: "easeOut" },
                }}
                style={{
                  animation: `sway-grass ${3 + Math.random() * 2}s ease-in-out ${delay}s infinite alternate`,
                }}
              />
            );
          })}
          {/* Taller accent grass */}
          {Array.from({ length: 25 }).map((_, i) => {
            const x = (i / 25) * 1440 + Math.cos(i * 5) * 20;
            const h = 100 + Math.sin(i * 2.3) * 50;
            const sway = Math.cos(i * 1.7) * 20;
            const delay = 1.5 + (i * 0.12) % 2;
            return (
              <motion.path
                key={`tall-${i}`}
                d={`M${x},220 C${x + sway * 0.3},${220 - h * 0.3} ${x + sway},${220 - h * 0.7} ${x + sway * 0.6},${220 - h}`}
                stroke={`hsla(152, 70%, 45%, ${0.1 + Math.sin(i) * 0.05})`}
                strokeWidth={1.5}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.12 }}
                transition={{ duration: 3, delay, ease: "easeOut" }}
                style={{
                  animation: `sway-grass ${4 + Math.random() * 2}s ease-in-out ${delay}s infinite alternate`,
                }}
              />
            );
          })}
          {/* Tiny firefly dots */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.circle
              key={`dot-${i}`}
              cx={120 + i * 110 + Math.sin(i * 3) * 40}
              cy={180 - Math.random() * 120}
              r={1.5}
              fill="hsl(var(--hero-green-glow))"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0], y: [0, -30, -60] }}
              transition={{ duration: 4 + Math.random() * 3, delay: 3 + i * 0.5, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        </svg>
        <style>{`
          @keyframes sway-grass {
            0% { transform: translateX(0) rotate(0deg); }
            100% { transform: translateX(3px) rotate(1.5deg); }
          }
        `}</style>
      </div>

      {/* ═══════════ STICKY NAV ═══════════ */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50"
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
            <ArrowLeft size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            <img src={heroLogo} alt="" className="w-6 h-6" />
            <span className="font-display font-bold text-sm text-foreground">Hero<span className="text-gradient-hero">Paper</span></span>
          </button>
          <div className="hidden md:flex items-center gap-1">
            {chapters.map((ch, i) => (
              <button 
                key={ch}
                onClick={() => document.getElementById(`ch-${i}`)?.scrollIntoView({ behavior: "smooth" })}
                className="text-[11px] text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-full hover:bg-secondary transition-all"
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ═══════════ HERO PARALLAX ═══════════ */}
      <div ref={heroRef} className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <img src={heropaperHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        </motion.div>

        <motion.div className="relative z-10 text-center px-6 max-w-4xl" style={{ opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-primary mb-6">
              <Sparkles size={12} /> The Local Hero Manifesto
            </span>
          </motion.div>
          
          <motion.h1 
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Every Action Matters.{" "}
            <span className="text-gradient-hero">Every Hero Earns.</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            How we're building a fair, community-owned platform where planting a tree, cleaning a river, or teaching a child earns you real rewards — permanently recorded and truly yours.
          </motion.p>

          <motion.div 
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ChevronDown size={24} className="text-primary" />
            </motion.div>
            <span className="text-xs text-muted-foreground">Scroll to read the full story</span>
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════ CHAPTER 0: THE PROBLEM ═══════════ */}
      <div id="ch-0" className="max-w-5xl mx-auto px-6">
        <ChapterDivider number="01" title="The Broken System" subtitle="Why traditional volunteering and social impact fails — and how technology can fix it." />
        
        <StoryBlock
          image={heropaperQuest}
          name="Maria, 24"
          role="Environmental Volunteer, Costa Rica"
          quote="I spent 3 years planting trees for free. My Instagram posts got likes, but the organization's CEO bought a Porsche. Where was my share?"
          context="Maria's story isn't unique. Billions of hours of volunteer work go unrewarded while middlemen profit. Traditional impact models are broken: no transparency, no fair compensation, no proof that work was done."
        />

        <FadeIn>
          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {[
              { emoji: "🏦", stat: "73%", desc: "of charity donations never reach the intended cause due to overhead and mismanagement" },
              { emoji: "📱", stat: "0", desc: "volunteers receive permanent, verifiable proof of their real-world contributions" },
              { emoji: "⚖️", stat: "10x", desc: "more income for influencers vs actual doers sharing the same content" },
            ].map((item, i) => (
              <FadeInStagger key={i} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-7 text-center group hover:border-primary/20 transition-all">
                  <span className="text-3xl block mb-3">{item.emoji}</span>
                  <p className="font-display text-3xl font-bold text-foreground mb-2">{item.stat}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </FadeInStagger>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ═══════════ CHAPTER 1: THE SOLUTION ═══════════ */}
      <div id="ch-1" className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <ChapterDivider number="02" title="Local Hero: The Fix" subtitle="A platform where every real action earns real, verifiable rewards." />

          <FadeIn>
            <div className="glass-card rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 blur-[60px] rounded-full" />
              <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">
                    Imagine if every time you helped someone, <span className="text-gradient-hero">the system remembered.</span>
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Local Hero turns real-world actions into verified, permanent achievements. Using secure technology, every quest completion, every tree planted, every community cleanup is permanently recorded — and rewarded.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["0G Chain Technology", "Verified Actions", "Fair Rewards", "Environmental Impact"].map(tag => (
                      <span key={tag} className="glass rounded-full px-3 py-1 text-xs font-medium text-foreground">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <img src={heropaperToken} alt="" className="rounded-2xl w-full object-cover h-72" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/50 to-transparent" />
                </div>
              </div>
            </div>
          </FadeIn>

          <StoryBlock
            image={heropaperQuest}
            name="James, 31"
            role="Quest Creator, Portland OR"
            quote="I created a nature trail quest and funded it with $50. 140 people completed it. They earned rewards, I earned reputation, and the environment got cleaner."
            context="James didn't need 10K followers. He needed a good idea. The platform doesn't care about popularity — it cares about completed quests and real-world impact."
            isReversed
          />
        </div>
      </div>

      {/* ═══════════ CHAPTER 2: QR & GEODROPS ═══════════ */}
      <div id="ch-2" className="max-w-5xl mx-auto px-6">
        <ChapterDivider number="03" title="QR Codes & GeoDrops" subtitle="How creators turn the real world into a treasure map." />

        <FadeIn>
          <div className="mb-16">
            <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-hero-yellow/5 blur-[50px] rounded-full" />
              <div className="relative z-10">
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                  <span className="text-foreground font-medium">Any creator — a café owner, a school teacher, a park ranger</span> — can create a quest or tour. 
                  Place QR codes at checkpoints or drop geo-located rewards on the map. When someone scans or arrives, 
                  the quest activates. Complete it, and your reward is instant, verified, and <span className="text-primary font-medium">yours forever</span>.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FlowStep number="01" icon={<QrCode size={22} />} title="Create & Place" description="Design a quest, print a QR code, or drop a location pin anywhere on earth." color="bg-primary" delay={0} />
                  <FlowStep number="02" icon={<Coins size={22} />} title="Fund the Reward" description="Add rewards that participants earn when they complete your quest." color="bg-hero-yellow" delay={0.1} />
                  <FlowStep number="03" icon={<TreePine size={22} />} title="Heroes Complete" description="People scan, explore, clean, plant, teach — verified by photo, GPS, or peer review." color="bg-hero-green-glow" delay={0.2} />
                  <FlowStep number="04" icon={<Gem size={22} />} title="Rewards Flow" description="Participants earn HERO points and permanent achievement badges. Everyone wins." color="bg-hero-purple" delay={0.3} />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <StoryBlock
          image={heropaperHero}
          name="Park Ranger Ana"
          role="National Forest Service, Oregon"
          quote="I placed 12 QR codes along our hiking trail. Hikers clean up trash at each stop, scan, and earn tokens. Our trail has never been cleaner."
          context="Ana didn't need to be tech-savvy. She printed QR codes from the app, laminated them, and stuck them to trail markers. The platform handled everything else — verification, rewards, and impact tracking."
        />
      </div>

      {/* ═══════════ CHAPTER 3: TOKENOMICS ═══════════ */}
      <div id="ch-3" className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-hero-yellow/[0.015] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <ChapterDivider number="04" title="HERO Rewards" subtitle="Community-centered. Completely fair. Built to last." />

          <FadeIn>
            <div className="glass-card rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-hero-yellow/5 blur-[50px] rounded-full" />
              <div className="relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                      The <span className="text-hero-yellow">Reward</span> System
                    </h3>
                    <div className="space-y-6">
                      {[
                        { step: "1", title: "Creators fund quests with rewards", desc: "Quest creators set up rewards — these can be points, prizes, or partner-sponsored perks." },
                        { step: "2", title: "Your actions generate real value", desc: "Completed quests create measurable impact — cleaner parks, helped neighbors, planted trees." },
                        { step: "3", title: "Rewards flow to participants", desc: "Quest completers receive HERO points alongside special rewards. Real value for real work." },
                        { step: "4", title: "HERO points unlock more perks", desc: "Accumulate points to unlock special features, exclusive access, and community governance." },
                      ].map((item) => (
                        <div key={item.step} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-hero-yellow/10 flex items-center justify-center text-hero-yellow text-xs font-bold shrink-0 mt-0.5">{item.step}</div>
                          <div>
                            <p className="text-sm font-bold text-foreground mb-1">{item.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                      Why It's <span className="text-primary">Built to Last</span>
                    </h3>
                    <div className="space-y-4">
                      {[
                        { icon: <Lock size={16} />, title: "Rewards locked in", desc: "Your earned rewards can never be taken away or reversed. They're yours permanently." },
                        { icon: <Users size={16} />, title: "No special insiders", desc: "The team earns like everyone else — by contributing. No special treatment." },
                        { icon: <Shield size={16} />, title: "Transparent rules", desc: "All platform rules are public and can't be changed unfairly. What you see is what you get." },
                        { icon: <Globe size={16} />, title: "Open & audited", desc: "The platform is transparent and regularly reviewed by independent security experts." },
                      ].map((item, i) => (
                        <div key={i} className="glass rounded-xl p-4 flex gap-3 group hover:border-primary/20 transition-all">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">{item.icon}</div>
                          <div>
                            <p className="text-sm font-bold text-foreground mb-0.5">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <StoryBlock
            image={heropaperToken}
            name="Skeptic turned Hero"
            role="Community Member"
            quote="I've been burned by online platforms before. When I saw how Local Hero works — transparent rules, no insider advantages, rewards you actually keep — I finally found something real."
            context="We built Local Hero for the skeptics. Every claim is verifiable. No trust required — just look at the results."
            isReversed
          />
        </div>
      </div>

      {/* ═══════════ CHAPTER 4: NFTs & PERKS ═══════════ */}
      <div id="ch-4" className="max-w-5xl mx-auto px-6">
        <ChapterDivider number="05" title="Permanent Achievements" subtitle="Your reputation can't be faked or bought. Your achievements unlock real perks." />

        <FadeIn>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Soulbound */}
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden group hover:border-primary/20 transition-all">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-hero-purple/8 blur-[40px] rounded-full" />
              <div className="relative z-10">
                <Fingerprint size={28} className="text-hero-purple mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Your Permanent Identity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Your reputation badge is <span className="text-foreground font-medium">uniquely yours</span>. It can't be bought, sold, or faked. 
                  It's a permanent record of every quest completed, every tree planted, every community you've uplifted. 
                  Think of it as your verified track record — proof that you're a real hero.
                </p>
                <div className="space-y-2">
                  {["Can't be faked or gamed", "Builds over time like XP", "Works across platforms", "Unlocks exclusive quests"].map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 size={12} className="text-hero-purple shrink-0" />
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievement */}
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden group hover:border-primary/20 transition-all">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-hero-yellow/8 blur-[40px] rounded-full" />
              <div className="relative z-10">
                <Gamepad2 size={28} className="text-hero-yellow mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Achievement Badges → Real Perks</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Complete epic quests? Earn special achievement badges. These aren't just trophies — they unlock 
                  <span className="text-foreground font-medium"> exclusive perks with partner apps and experiences</span>.
                  A "River Guardian" badge might give you discounts at eco-friendly brands. A "City Healer" badge unlocks exclusive events.
                </p>
                <div className="space-y-2">
                  {["Tradeable & collectible", "Partner app perks", "Real-world rewards", "Rarity based on impact"].map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 size={12} className="text-hero-yellow shrink-0" />
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <StoryBlock
          image={heropaperQuest}
          name="Kai, 19"
          role="Student & Gamer, Tokyo"
            quote="I earned a 'Forest Guardian' badge for planting 50 trees. Then I got invited to an exclusive eco-brand event because of my badge. My friends couldn't believe it."
            context="This is the crossover nobody expected: real-world environmental action giving you exclusive access and real perks."
        />
      </div>

      {/* ═══════════ CHAPTER 5: FAIRNESS ═══════════ */}
      <div id="ch-5" className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <ChapterDivider number="06" title="The Fairness Protocol" subtitle="A share is a share. 10 followers or 10 million." />

          <FadeIn>
            <div className="glass-card rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-hero-purple/[0.03]" />
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <Shield size={36} className="text-hero-yellow mx-auto mb-4" />
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                    We reject the influencer economy.
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    In the old world, a celebrity sharing your project matters 1000x more than you doing the actual work. That ends here.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { icon: <Users size={18} />, title: "Equal Social Weight", desc: "Whether you have 10 or 10M followers, a share earns the same. Organic engagement is the only metric." },
                    { icon: <Heart size={18} />, title: "Impact > Influence", desc: "Rewards scale with completed tasks and verified impact — not likes, retweets, or follower count." },
                    { icon: <Globe size={18} />, title: "Remote Tasks Welcome", desc: "Not every help needs physical presence. Outsource, delegate, coordinate — as long as it gets done." },
                    { icon: <CircleDot size={18} />, title: "No Whale Advantage", desc: "Holding more tokens doesn't multiply your rewards. Governance voting is capped per wallet." },
                    { icon: <Link2 size={18} />, title: "Outsource & Delegate", desc: "Create a quest in Tokyo, someone in Portland completes it. Global impact, local action." },
                    { icon: <Lock size={18} />, title: "Code is Law", desc: "Smart contract guarantees every rule. No admin can override, change terms, or take your earnings." },
                  ].map((item, i) => (
                    <FadeInStagger key={i} delay={i * 0.08}>
                      <div className="glass rounded-xl p-5 group hover:border-primary/20 transition-all h-full">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">{item.icon}</div>
                        <p className="text-sm font-bold text-foreground mb-1.5">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </FadeInStagger>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <StoryBlock
            image={heropaperHero}
            name="Aisha, 28"
            role="Community Organizer, Nairobi"
            quote="On Instagram, my cleanup posts got 40 likes. An influencer reposted one and got 50K likes plus a brand deal. On Local Hero, my actual cleanups earned me 3x more $HERO than their repost."
            context="Aisha organized 12 river cleanups. Each one was GPS-verified, photo-documented, and peer-reviewed. Her permanent profile proves she's the real deal — no algorithm can take that away."
            isReversed
          />
        </div>
      </div>

      {/* ═══════════ CHAPTER 6: THE FUTURE ═══════════ */}
      <div id="ch-6" className="max-w-5xl mx-auto px-6">
        <ChapterDivider number="07" title="The Future We're Building" subtitle="Not a promise. A protocol." />

        <FadeIn>
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/5 blur-[60px] rounded-full" />
            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-6">Roadmap</h3>
                  <div className="space-y-6">
                    {[
                      { phase: "Phase 1", title: "Foundation", items: ["Core app launch", "QR quest system", "Reward system", "Achievement badges"], status: "active" },
                      { phase: "Phase 2", title: "Growth", items: ["Treasure drops worldwide", "Environmental partnerships", "Reward partnerships", "Partner app integrations"], status: "upcoming" },
                      { phase: "Phase 3", title: "Scale", items: ["Community governance", "Expanded perks system", "Enterprise partnerships", "100K active heroes"], status: "upcoming" },
                      { phase: "Phase 4", title: "Ecosystem", items: ["Developer tools", "White-label quests", "Impact marketplace", "1M heroes milestone"], status: "future" },
                    ].map((phase, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${phase.status === "active" ? "bg-primary glow-green" : "bg-muted"}`} />
                          {i < 3 && <div className="w-px h-full bg-border mt-1" />}
                        </div>
                        <div className="pb-2">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">{phase.phase}</span>
                          <p className="text-sm font-bold text-foreground mb-1.5">{phase.title}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.items.map((item, j) => (
                              <span key={j} className="glass rounded-full px-2.5 py-0.5 text-[10px] text-muted-foreground">{item}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-6">Tech Stack</h3>
                  <div className="space-y-3">
                    {[
                      { label: "0G Chain", desc: "Secure infrastructure for verifying actions, moderating content, and scoring impact.", color: "text-primary" },
                      { label: "Permanent Badges", desc: "Non-transferable identity badges tied to your account. Can't be bought, only earned through verified actions.", color: "text-hero-purple" },
                      { label: "Green Rewards", desc: "Real-world environmental impact tracked and rewarded through partner programs.", color: "text-hero-green-glow" },
                      { label: "Achievement System", desc: "Achievement badges recognized across partner apps and experiences.", color: "text-hero-yellow" },
                      { label: "QR + GPS Verification", desc: "Dual-layer location verification combining QR scans with GPS for tamper-proof quest completion.", color: "text-hero-orange" },
                    ].map((tech, i) => (
                      <FadeInStagger key={i} delay={i * 0.08}>
                        <div className="glass rounded-xl p-4 group hover:border-primary/20 transition-all">
                          <p className={`text-sm font-bold ${tech.color} mb-1`}>{tech.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
                        </div>
                      </FadeInStagger>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <div className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.04] to-background" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/20"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ repeat: Infinity, duration: 3 + Math.random() * 3, delay: Math.random() * 2 }}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <FadeIn>
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-primary mb-6">
              <Star size={12} className="fill-hero-yellow text-hero-yellow" /> Join the Movement
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              The world doesn't need more <span className="text-muted-foreground line-through">followers</span>.{" "}
              <span className="text-gradient-hero">It needs heroes.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Every quest completed is a step toward a fairer, cleaner, more connected world. Your actions are permanent. Your rewards are real.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button 
                onClick={() => navigate("/app")}
                className="bg-gradient-hero-glow text-primary-foreground font-display font-bold px-8 py-3.5 rounded-xl text-base glow-green"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Become a Hero <ArrowRight size={16} className="inline ml-2" />
              </motion.button>
              <motion.button 
                onClick={() => navigate("/")}
                className="glass rounded-xl px-8 py-3.5 text-sm font-medium text-foreground hover:border-primary/30 transition-all"
                whileHover={{ scale: 1.03 }}
              >
                Back to Home
              </motion.button>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={heroLogo} alt="" className="w-6 h-6" />
            <span className="font-display font-bold text-sm text-foreground">Local<span className="text-gradient-hero">Hero</span></span>
            <span className="text-xs text-muted-foreground ml-2">HeroPaper v1.0</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Local Hero · Built on 0G Chain · Fair by design</p>
        </div>
      </footer>
    </div>
  );
};

export default HeroPaper;
