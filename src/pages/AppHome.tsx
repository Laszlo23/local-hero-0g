import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Flame, Gift, GraduationCap, MapPin, ScanLine, Shield, Sparkles, Star, TreePine, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroLogo from "@/assets/hero-logo-glow.png";
import arChest from "@/assets/ar-chest.png";
import ogLogo from "@/assets/0g-logo.png";
import treegenHero from "@/assets/treegen-hero.png";
import ReferralWidget from "@/components/ReferralWidget";
import { StaggerContainer, FadeUpItem, BreathingGlow, PulseRing, FloatingParticle } from "@/components/Animations";
import DailyQuestsCard from "@/components/DailyQuestsCard";
import StreakNotification from "@/components/StreakNotification";
import MilestoneProximity from "@/components/MilestoneProximity";
import WelcomeGuide from "@/components/WelcomeGuide";
import HelpBubble from "@/components/HelpBubble";
import ProfileQuest from "@/components/ProfileQuest";
import TrustScoreCard from "@/components/TrustScoreCard";
import { useUserStats } from "@/hooks/use-user-stats";
import { useDailyQuests } from "@/hooks/use-daily-quests";
import { calculateTrustScore } from "@/hooks/use-trust-score";

const AppHome = () => {
  const navigate = useNavigate();
  const { stats, refetch } = useUserStats();
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const avatarUrl = stats.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(stats.display_name)}`;
  const levelProgress = stats.total_points > 0 ? Math.min(100, Math.round(((stats.total_points - (stats.level - 1) * (stats.level - 1) * 50) / ((stats.level * stats.level * 50) - (stats.level - 1) * (stats.level - 1) * 50)) * 100)) : 0;

  const profileComplete = stats.onboarding_completed || stats.profile_quest_step >= 5;
  const trustScore = calculateTrustScore(stats);

  // Soft unlock: features are visible but dimmed
  const SoftLock = ({ children }: { children: React.ReactNode }) => {
    if (profileComplete) return <>{children}</>;
    return (
      <div className="relative">
        <div className="opacity-40 pointer-events-none select-none blur-[1px]">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glass rounded-full px-3 py-1.5 text-[10px] font-bold text-muted-foreground flex items-center gap-1.5">
            <Shield size={12} className="text-primary" />
            Complete your first quest to unlock
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
    <WelcomeGuide />
    <StaggerContainer className="px-5 pt-12 space-y-5 pb-28" delay={0.1}>
      {/* Ambient particles */}
      <FloatingParticle x={85} y={5} size={6} delay={0} duration={5} />
      <FloatingParticle x={10} y={15} size={4} delay={1.5} duration={4} />
      <FloatingParticle x={70} y={45} size={5} delay={2} duration={6} />
      <FloatingParticle x={25} y={70} size={3} delay={0.8} duration={4.5} />

      {/* Streak Warning */}
      <StreakNotification />

      {/* Header */}
      <FadeUpItem>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{greeting} 👋</p>
            <h1 className="font-display text-2xl font-bold text-foreground">{stats.display_name}</h1>
          </div>
          <motion.div className="relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <img src={avatarUrl} alt="Avatar" className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/40" />
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-accent rounded-full flex items-center justify-center glow-yellow"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame size={10} className="text-accent-foreground" />
            </motion.div>
          </motion.div>
        </div>
      </FadeUpItem>

      {/* Profile Quest — shown if not complete */}
      {!profileComplete && (
        <FadeUpItem>
          <ProfileQuest
            onComplete={refetch}
            currentStep={stats.profile_quest_step}
            stats={{
              display_name: stats.display_name,
              avatar_url: stats.avatar_url,
              location: stats.location,
            }}
          />
        </FadeUpItem>
      )}

      {/* Trust Score Card */}
      <FadeUpItem>
        <TrustScoreCard score={trustScore} />
      </FadeUpItem>

      {/* Hero Card */}
      <FadeUpItem>
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
            <motion.img
              src={heroLogo}
              alt=""
              className="w-full h-full object-contain"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <BreathingGlow className="w-40 h-40 -top-10 -right-10" color="hero-green-glow" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Shield size={14} className="text-primary" />
              </motion.div>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">Hero Journey</span>
              <HelpBubble tip="This is your hero dashboard! Complete quests, grow your streak, and level up to unlock rewards." emoji="🦸" size={12} />
            </div>
            <h2 className="font-display text-xl font-bold text-gradient-hero mb-1">Become a Local Hero</h2>
            <p className="text-sm text-muted-foreground mb-4">Play daily. Help locally. Earn HERO.</p>

            <div className="flex gap-2.5 mb-4">
              <GlassPill icon={<Star size={12} className="text-hero-yellow icon-sparkle" />} label="HERO" value={stats.total_points.toLocaleString()} help="HERO points are earned by completing quests and challenges. They unlock badges and level-ups!" helpEmoji="⭐" />
              <GlassPill icon={<TrendingUp size={12} className="text-primary" />} label="Level" value={String(stats.level)} />
              <GlassPill icon={<Flame size={12} className="text-hero-orange icon-heartbeat" />} label="Streak" value={`${stats.streak}🔥`} help="Your streak counts consecutive days active. Higher streak = bigger point bonus!" helpEmoji="🔥" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-medium">Level {stats.level} → {stats.level + 1}</span>
                <span className="font-semibold text-primary">{levelProgress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-hero-glow rounded-full glow-green"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </FadeUpItem>

      {/* Daily AI-Generated Quests */}
      <SoftLock>
        <FadeUpItem>
          <DailyQuestsCard />
        </FadeUpItem>
      </SoftLock>

      {/* Milestone Proximity */}
      <SoftLock>
        <FadeUpItem>
          <MilestoneProximity
            currentPoints={stats.total_points}
            questsCompleted={stats.quests_completed}
            level={stats.level}
          />
        </FadeUpItem>
      </SoftLock>

      {/* AR Quest Banner */}
      <SoftLock>
        <FadeUpItem>
          <motion.button
            onClick={() => navigate("/app/ar")}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:border-primary/30 transition-all relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <PulseRing />
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-hero-green-glow/20 blur-[12px] rounded-full" />
              <motion.img
                src={arChest}
                alt=""
                className="w-14 h-14 relative z-10"
                animate={{ y: [0, -4, 0], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-display font-bold text-foreground text-sm">AR Quest Mode</h3>
              <p className="text-xs text-muted-foreground">Open camera to explore nearby</p>
            </div>
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-hero-glow flex items-center justify-center glow-green"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ScanLine size={18} className="text-primary-foreground" />
            </motion.div>
          </motion.button>
        </FadeUpItem>
      </SoftLock>

      {/* NFT Drop Card */}
      <SoftLock>
        <FadeUpItem>
          <motion.button
            onClick={() => navigate("/app/drop")}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:border-accent/30 transition-all relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/5 blur-[30px] rounded-full" />
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-hero-orange/10 flex items-center justify-center shrink-0"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Gift size={22} className="text-accent" />
            </motion.div>
            <div className="flex-1 text-left relative z-10">
              <h3 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
                Treasure Drop
                <motion.img src={ogLogo} alt="0G" className="w-4 h-4 opacity-60" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
              </h3>
              <p className="text-xs text-muted-foreground">Leave rewards and surprises for others to find</p>
            </div>
            <div className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">New</div>
          </motion.button>
        </FadeUpItem>
      </SoftLock>

      {/* Genesis Campaign Banner */}
      <SoftLock>
        <FadeUpItem>
          <motion.button
            onClick={() => navigate("/app/campaign")}
            className="w-full rounded-2xl p-4 flex items-center gap-4 group cursor-pointer transition-all relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.1))" }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <BreathingGlow className="w-32 h-32 -top-8 -left-8" />
            <BreathingGlow className="w-24 h-24 -bottom-8 -right-8" color="accent" />
            <div className="relative shrink-0">
              <motion.img
                src={treegenHero}
                alt="Treegen"
                className="w-14 h-14 drop-shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
                animate={{ y: [0, -6, 0], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="flex-1 text-left relative z-10">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="font-display font-bold text-foreground text-sm">Genesis Campaign</h3>
                <motion.span
                  className="text-[7px] font-bold text-accent bg-accent/20 px-1.5 py-0.5 rounded-full"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  LIVE
                </motion.span>
              </div>
              <p className="text-[10px] text-muted-foreground">Earn points, grow your tree badge, unlock early adopter perks</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-bold text-primary flex items-center gap-0.5"><Crown size={8} /> Founding Badges</span>
                <span className="text-[9px] font-bold text-accent flex items-center gap-0.5"><TreePine size={8} /> Growing Rewards</span>
              </div>
            </div>
          </motion.button>
        </FadeUpItem>
      </SoftLock>

      {/* 777 Agents Card */}
      <SoftLock>
        <FadeUpItem>
          <motion.button
            onClick={() => navigate("/app/agents")}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:border-accent/30 transition-all relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <BreathingGlow className="w-20 h-20 -bottom-6 -left-6" color="accent" />
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-hero-yellow/10 flex items-center justify-center shrink-0"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Shield size={22} className="text-accent" />
            </motion.div>
            <div className="flex-1 text-left relative z-10">
              <h3 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
                777 Agents
                <motion.img src={ogLogo} alt="0G" className="w-4 h-4 opacity-60" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity }} />
              </h3>
              <p className="text-xs text-muted-foreground">Monetize, create quests & earn revenue</p>
            </div>
            <motion.div
              className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-1 rounded-full"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Earn $
            </motion.div>
          </motion.button>
        </FadeUpItem>
      </SoftLock>

      {/* Schools Section */}
      <SoftLock>
        <FadeUpItem>
          <motion.button
            onClick={() => navigate("/app/schools")}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:border-hero-purple/30 transition-all"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-hero-purple/20 to-hero-green-light flex items-center justify-center shrink-0"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <GraduationCap size={22} className="text-hero-purple" />
            </motion.div>
            <div className="flex-1 text-left">
              <h3 className="font-display font-bold text-foreground text-sm">Schools & Learning</h3>
              <p className="text-xs text-muted-foreground">Learn through real-world quests</p>
            </div>
            <motion.div
              className="text-[10px] font-bold text-hero-purple bg-hero-purple/10 px-2 py-1 rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              New
            </motion.div>
          </motion.button>
        </FadeUpItem>
      </SoftLock>

      {/* Impact */}
      <FadeUpItem>
        <div>
          <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-1.5">Your Impact <HelpBubble tip="These numbers show the real-world difference you've made — trees planted, neighbors helped, and local shops supported!" emoji="🌍" size={14} /></h3>
          <div className="grid grid-cols-3 gap-2.5">
            <ImpactCard icon="🌳" value={String(stats.trees_planted)} label="Trees" delay={0} />
            <ImpactCard icon="🤝" value={String(stats.neighbors_helped)} label="Helped" delay={0.1} />
            <ImpactCard icon="🏪" value={String(stats.businesses_supported)} label="Locals" delay={0.2} />
          </div>
        </div>
      </FadeUpItem>

      {/* Nearby */}
      <SoftLock>
        <FadeUpItem>
          <NearbyQuests />
        </FadeUpItem>
      </SoftLock>

      {/* Referral Widget */}
      <FadeUpItem>
        <ReferralWidget />
      </FadeUpItem>
    </StaggerContainer>
    </>
  );
};

const GlassPill = ({ icon, label, value, help, helpEmoji }: { icon: React.ReactNode; label: string; value: string; help?: string; helpEmoji?: string }) => (
  <motion.div
    className="flex items-center gap-1.5 glass rounded-lg px-2.5 py-1.5"
    whileHover={{ scale: 1.05 }}
  >
    {icon}
    <div className="flex flex-col">
      <span className="text-[9px] text-muted-foreground font-medium leading-none flex items-center gap-0.5">
        {label}
        {help && <HelpBubble tip={help} emoji={helpEmoji} size={10} position="bottom" />}
      </span>
      <span className="text-sm font-bold text-foreground leading-tight">{value}</span>
    </div>
  </motion.div>
);

const ImpactCard = ({ icon, value, label, delay = 0 }: { icon: string; value: string; label: string; delay?: number }) => (
  <motion.div
    className="glass-card rounded-xl p-3 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.8 + delay, duration: 0.4 }}
    whileHover={{ scale: 1.05, y: -2 }}
  >
    <motion.span
      className="text-xl block"
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 3, repeat: Infinity, delay }}
    >
      {icon}
    </motion.span>
    <p className="text-lg font-bold text-foreground mt-1">{value}</p>
    <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
  </motion.div>
);

const NearbyCard = ({ title, distance, points, emoji }: { title: string; distance: string; points: number; emoji: string }) => (
  <motion.div
    className="glass-card-hover rounded-xl p-4 flex items-center gap-3 cursor-pointer"
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
  >
    <motion.div
      className="w-11 h-11 rounded-xl bg-hero-green-light flex items-center justify-center text-xl shrink-0"
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      {emoji}
    </motion.div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-sm text-foreground truncate">{title}</h4>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><MapPin size={10} /> {distance}</span>
        <span className="text-xs font-bold text-primary">+{points}</span>
      </div>
    </div>
  </motion.div>
);

const NearbyQuests = () => {
  const { quests, loading } = useDailyQuests();
  const incomplete = quests.filter((q) => !q.completed).slice(0, 2);

  if (loading || incomplete.length === 0) return null;

  return (
    <div>
      <h3 className="font-display text-lg font-bold text-foreground mb-3">Near You</h3>
      <div className="space-y-2.5">
        {incomplete.map((q) => (
          <NearbyCard key={q.id} title={q.title} distance="Nearby" points={q.points} emoji={q.emoji} />
        ))}
      </div>
    </div>
  );
};

export default AppHome;
