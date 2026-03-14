import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Timer, Users, Sparkles, Crosshair } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const DiscoveryDropsSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [chestOpened, setChestOpened] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string; delay: number; duration: number; dx: number }[]>([]);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasTriggered.current) {
        hasTriggered.current = true;
        setTimeout(() => {
          setChestOpened(true);
          const newParticles = Array.from({ length: 24 }, (_, i) => ({
            id: i,
            x: 50 + (Math.random() - 0.5) * 30,
            y: 40 + (Math.random() - 0.5) * 20,
            emoji: ["✨", "⭐", "💎", "🪙", "🔮", "👑", "💫", "🌟"][i % 8],
            delay: Math.random() * 0.6,
            duration: 1.5 + Math.random() * 1.5,
            dx: (Math.random() - 0.5) * 60,
          }));
          setParticles(newParticles);
        }, 600);
      }
    }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="discovery-drops" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-hero-yellow-light/8 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-hero-yellow/5 blur-[150px] pointer-events-none" />

      {/* Floating ambient particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`ambient-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{
            left: `${8 + i * 7.5}%`,
            top: `${15 + (i % 4) * 20}%`,
            background: i % 3 === 0 ? "hsl(var(--hero-yellow) / 0.4)" : i % 3 === 1 ? "hsl(var(--primary) / 0.4)" : "hsl(var(--hero-purple) / 0.3)",
          }}
          animate={{
            y: [0, -30 - i * 5, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Burst particles on chest open */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute text-lg pointer-events-none z-20"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.4, 1, 0.5],
              y: [-20, -80 - Math.random() * 120],
              x: [0, p.dx],
            }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          {/* Treasure chest animation */}
          <div className="relative inline-block mb-8">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative"
            >
              <motion.div
                className="absolute inset-0 -m-4 rounded-full"
                animate={chestOpened ? {
                  boxShadow: [
                    "0 0 0px 0px hsl(45 100% 58% / 0)",
                    "0 0 40px 20px hsl(45 100% 58% / 0.3)",
                    "0 0 60px 30px hsl(45 100% 58% / 0.1)",
                    "0 0 20px 10px hsl(45 100% 58% / 0.05)",
                  ],
                } : {}}
                transition={{ duration: 1.5 }}
              />

              <motion.div
                className="text-6xl sm:text-7xl relative z-10 cursor-pointer select-none"
                animate={chestOpened
                  ? { scale: [1, 1.3, 1.1], rotate: [0, -5, 5, 0] }
                  : { y: [0, -6, 0] }
                }
                transition={chestOpened
                  ? { duration: 0.6, ease: "easeOut" }
                  : { duration: 2, repeat: Infinity }
                }
                whileHover={{ scale: 1.15 }}
              >
                {chestOpened ? "👑" : "🎁"}
              </motion.div>

              {chestOpened && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`ray-${i}`}
                      className="absolute top-1/2 left-1/2 h-[2px] origin-left pointer-events-none"
                      style={{
                        rotate: `${i * 45}deg`,
                        background: "linear-gradient(90deg, hsl(45 100% 58% / 0.6), transparent)",
                      }}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: [0, 80, 40], opacity: [0, 0.8, 0] }}
                      transition={{ duration: 1.2, delay: 0.1 + i * 0.05 }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2.5 mb-6"
          >
            <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-lg">👑</motion.span>
            <span className="text-xs font-bold text-hero-yellow uppercase tracking-widest">New Feature</span>
          </motion.div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] font-bold leading-tight mb-4">
            <span className="text-gradient-white">Discovery </span>
            <span className="text-gradient-hero">Drops</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Limited-time rewards hidden across your city. Find them before they vanish. Collect loot. Level up.
          </p>
        </div>

        {/* Drop rarity cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            {
              rarity: "Common",
              emoji: "📦",
              color: "from-blue-500/20 to-blue-600/5",
              border: "border-blue-500/30 hover:border-blue-400/60",
              glow: "shadow-blue-500/20",
              textColor: "text-blue-400",
              reward: "25–50 HERO",
              duration: "4–8 hours",
              claims: "Unlimited",
              xpBar: "w-[30%]",
              xpColor: "bg-blue-500",
            },
            {
              rarity: "Rare",
              emoji: "💎",
              color: "from-purple-500/20 to-purple-600/5",
              border: "border-purple-500/30 hover:border-purple-400/60",
              glow: "shadow-purple-500/20",
              textColor: "text-purple-400",
              reward: "100–250 HERO",
              duration: "1–3 hours",
              claims: "First 50",
              xpBar: "w-[60%]",
              xpColor: "bg-purple-500",
            },
            {
              rarity: "Legendary",
              emoji: "👑",
              color: "from-yellow-500/20 to-amber-600/5",
              border: "border-yellow-500/40 hover:border-yellow-400/70",
              glow: "shadow-yellow-500/30",
              textColor: "text-yellow-400",
              reward: "500+ HERO + NFT",
              duration: "30–60 min",
              claims: "First 10",
              xpBar: "w-full",
              xpColor: "bg-gradient-to-r from-yellow-500 to-amber-400",
            },
          ].map((drop, i) => (
            <FadeInStagger key={i} delay={i * 0.15}>
              <TiltCard>
                <motion.div
                  className={`relative glass-card rounded-2xl p-6 border ${drop.border} transition-all overflow-hidden group cursor-default`}
                  whileHover={{ y: -6 }}
                >
                  {drop.rarity === "Legendary" && (
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: "radial-gradient(circle at 50% 50%, hsl(45 100% 58% / 0.08), transparent 70%)" }}
                    />
                  )}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${drop.color} rounded-t-2xl`} />

                  <div className="flex items-center justify-between mb-4">
                    <motion.span
                      className="text-3xl"
                      animate={drop.rarity === "Legendary" ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {drop.emoji}
                    </motion.span>
                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${drop.textColor} glass rounded-full px-3 py-1`}>
                      {drop.rarity}
                    </span>
                  </div>

                  <h3 className={`font-display text-xl font-bold ${drop.textColor} mb-4`}>{drop.rarity} Drop</h3>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2 text-sm">
                      <Gift size={14} className={drop.textColor} />
                      <span className="text-muted-foreground">Reward:</span>
                      <span className="font-bold text-foreground">{drop.reward}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Timer size={14} className={drop.textColor} />
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-bold text-foreground">{drop.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={14} className={drop.textColor} />
                      <span className="text-muted-foreground">Claims:</span>
                      <span className="font-bold text-foreground">{drop.claims}</span>
                    </div>
                  </div>

                  {/* XP-style rarity bar */}
                  <div className="relative">
                    <div className="text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">Rarity Level</div>
                    <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${drop.xpColor} rounded-full`}
                        initial={{ width: "0%" }}
                        whileInView={{ width: drop.xpBar === "w-[30%]" ? "30%" : drop.xpBar === "w-[60%]" ? "60%" : "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.3 + i * 0.2 }}
                      />
                    </div>
                  </div>

                  {drop.rarity === "Legendary" && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Sparkles size={16} className="text-yellow-400" />
                    </motion.div>
                  )}
                </motion.div>
              </TiltCard>
            </FadeInStagger>
          ))}
        </div>

        {/* Live drop simulation */}
        <FadeIn>
          <TiltCard className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-hero-green-glow/8 blur-[80px] rounded-full" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-hero-yellow/8 blur-[80px] rounded-full" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Crosshair size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Live Drop Zone</h3>
                  <p className="text-xs text-muted-foreground">Active drops appearing in cities right now</p>
                </div>
                <motion.div
                  className="ml-auto flex items-center gap-1.5 glass rounded-full px-3 py-1.5"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                  <span className="text-[10px] font-bold text-primary">LIVE</span>
                </motion.div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { emoji: "📦", title: "Coffee Run Challenge", location: "Main St Cafe", reward: 50, rarity: "Common", color: "border-blue-500/30", textColor: "text-blue-400", time: "3h 24m", claims: "∞" },
                  { emoji: "💎", title: "Sunset Park Cleanup", location: "Central Park", reward: 200, rarity: "Rare", color: "border-purple-500/30", textColor: "text-purple-400", time: "1h 12m", claims: "18/50" },
                  { emoji: "👑", title: "First Snow Explorer", location: "City Center", reward: 500, rarity: "Legendary", color: "border-yellow-500/40", textColor: "text-yellow-400", time: "0h 28m", claims: "3/10" },
                ].map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className={`glass rounded-xl p-4 border ${d.color} cursor-pointer group hover:scale-[1.02] transition-all`}
                    onClick={() => navigate("/app/discovery-drops")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{d.emoji}</span>
                      <span className={`text-[9px] font-black uppercase tracking-wider ${d.textColor}`}>{d.rarity}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground mb-0.5">{d.title}</p>
                    <p className="text-[11px] text-muted-foreground mb-2">📍 {d.location}</p>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">⏱ {d.time} left</span>
                      <span className={`font-bold ${d.textColor}`}>{d.reward} HERO</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/app/discovery-drops")}
                  className="glass-card px-6 py-3 rounded-xl font-semibold text-sm text-foreground hover:border-hero-yellow/30 transition-all inline-flex items-center gap-2 group"
                >
                  <Crosshair size={14} className="text-hero-yellow" />
                  Explore All Drops
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >→</motion.span>
                </button>
              </div>
            </div>
          </TiltCard>
        </FadeIn>
      </div>
    </section>
  );
};

export default DiscoveryDropsSection;
