import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Crown, Gift, Sparkles, Star, TreePine, Trophy, Users, Zap, Shield, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ogLogo from "@/assets/0g-logo.png";
import treegenHero from "@/assets/treegen-hero.png";
import { CAMPAIGN_TASKS, completeTask, getCompletedTasks, getFounderBadges, PLATFORM_COLORS, PLATFORM_LABELS, type CampaignTask } from "@/lib/campaign";
import { getOrCreateTreegen, getStageInfo, getSpeciesInfo, STAGES, RARITY_COLORS, type Treegen } from "@/lib/treegens";
import { shareTemplates } from "@/lib/sharing";

const PERKS = [
  { icon: "🎖️", title: "Founding Member Badge", desc: "A permanent badge proving you were here from Day 1", tier: "Genesis" },
  { icon: "🚀", title: "5x Reward Multiplier", desc: "Early users get 5x more rewards during special events", tier: "Confirmed" },
  { icon: "🗳️", title: "Community Voice", desc: "Help shape the future of Local Hero with your vote", tier: "Diamond" },
  { icon: "💰", title: "Revenue Share", desc: "Top early contributors share in platform rewards forever", tier: "Top 100" },
  { icon: "🌳", title: "Living Tree Badge", desc: "Your tree badge grows and evolves with your actions", tier: "Everyone" },
  { icon: "👑", title: "OG Pioneer Badge", desc: "Exclusive badge for the first 777 heroes", tier: "First 777" },
];

const Campaign = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"tasks" | "tree" | "perks">("tasks");
  const [platform, setPlatform] = useState<string>("all");
  const [completed, setCompleted] = useState<string[]>([]);
  const [treegen, setTreegen] = useState<Treegen | null>(null);
  const [badges, setBadges] = useState<Array<{ badge_type: string; tier: string }>>([]);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getCompletedTasks().then(setCompleted);
    getOrCreateTreegen().then(setTreegen);
    getFounderBadges().then(setBadges);
  }, []);

  const filteredTasks = platform === "all" ? CAMPAIGN_TASKS : CAMPAIGN_TASKS.filter((t) => t.platform === platform);
  const totalPoints = CAMPAIGN_TASKS.reduce((s, t) => s + t.points, 0);
  const earnedPoints = CAMPAIGN_TASKS.filter((t) => completed.includes(t.id)).reduce((s, t) => s + t.points, 0);
  const progress = CAMPAIGN_TASKS.length > 0 ? (completed.length / CAMPAIGN_TASKS.length) * 100 : 0;

  const handleComplete = async (task: CampaignTask) => {
    if (completed.includes(task.id) || claiming) return;
    
    // For share/post tasks, trigger native sharing first
    if (["share", "post", "story", "video", "duet", "tag"].includes(task.type)) {
      await shareTemplates.campaignTask(task.title, PLATFORM_LABELS[task.platform]);
    }
    
    if (task.actionUrl) window.open(task.actionUrl, "_blank");

    setClaiming(task.id);
    const result = await completeTask(task.id);
    setClaiming(null);

    if (result.success) {
      setCompleted((prev) => [...prev, task.id]);
      setToast(result.message);
      // Refresh treegen
      getOrCreateTreegen().then(setTreegen);
      getFounderBadges().then(setBadges);
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast(result.message);
      setTimeout(() => setToast(null), 2000);
    }
  };

  const stageInfo = treegen ? getStageInfo(treegen.stage) : STAGES[0];
  const speciesInfo = treegen ? getSpeciesInfo(treegen.species) : null;
  const xpProgress = treegen ? ((treegen.xp - (STAGES[treegen.stage - 1]?.xpRequired || 0)) / Math.max(1, treegen.xp_next_level - (STAGES[treegen.stage - 1]?.xpRequired || 0))) * 100 : 0;

  return (
    <div className="min-h-screen bg-background max-w-[430px] mx-auto relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] glass-card rounded-2xl px-5 py-3 flex items-center gap-2 max-w-[360px]"
          >
            <Sparkles size={14} className="text-accent shrink-0" />
            <span className="text-xs font-bold text-foreground">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <div className="relative overflow-hidden px-5 pt-6 pb-5">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 blur-[80px] rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/5 blur-[60px] rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-foreground">
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold text-foreground">Genesis Campaign</h1>
              <p className="text-[10px] text-muted-foreground">Earn points, grow your tree, unlock perks</p>
            </div>
            <img src={ogLogo} alt="0G" className="w-7 h-7 opacity-60" />
          </div>

          {/* Progress Bar */}
          <div className="glass-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Trophy size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{completed.length}/{CAMPAIGN_TASKS.length} Tasks</p>
                  <p className="text-[9px] text-muted-foreground">{earnedPoints.toLocaleString()} / {totalPoints.toLocaleString()} HERO</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {badges.map((b) => (
                  <div key={b.badge_type} className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center" title={b.badge_type}>
                    <Star size={10} className="text-accent" />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-2">
          {([
            { id: "tasks" as const, label: "Tasks", icon: <Zap size={12} /> },
            { id: "tree" as const, label: "Treegen", icon: <TreePine size={12} /> },
            { id: "perks" as const, label: "Perks", icon: <Crown size={12} /> },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-24">
        <AnimatePresence mode="wait">
          {/* TASKS TAB */}
          {tab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              {/* Platform Filter */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {[{ id: "all", label: "All" }, ...Object.entries(PLATFORM_LABELS).map(([id, label]) => ({ id, label }))].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                      platform === p.id ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Task List */}
              <div className="space-y-2.5">
                {filteredTasks.map((task, i) => {
                  const done = completed.includes(task.id);
                  const loading = claiming === task.id;
                  const colors = PLATFORM_COLORS[task.platform];
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`glass-card rounded-2xl p-4 flex items-center gap-3 transition-all ${done ? "opacity-60" : ""}`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center text-lg shrink-0 ${done ? "grayscale" : ""}`}>
                        {done ? <Check size={18} className="text-primary" /> : task.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-foreground truncate">{task.title}</h4>
                          <span className={`text-[8px] font-bold ${colors.text} ${colors.bg} px-1.5 py-0.5 rounded-full shrink-0`}>
                            {PLATFORM_LABELS[task.platform]}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{task.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold text-primary">+{task.points} HERO</span>
                          <span className="text-[9px] font-bold text-accent">+{task.xp} XP</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleComplete(task)}
                        disabled={done || loading}
                        className={`shrink-0 px-3 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 ${
                          done
                            ? "bg-primary/10 text-primary"
                            : loading
                            ? "bg-secondary text-muted-foreground"
                            : "bg-gradient-hero-glow text-primary-foreground active:scale-95"
                        }`}
                      >
                        {done ? (
                          <><Check size={10} /> Done</>
                        ) : loading ? (
                          "..."
                        ) : (
                          <>{task.actionLabel} {task.actionUrl && <ExternalLink size={8} />}</>
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TREEGEN TAB */}
          {tab === "tree" && treegen && (
            <motion.div key="tree" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
              {/* Tree Card */}
              <div className="glass-card rounded-3xl p-6 text-center relative overflow-hidden">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 blur-[60px] rounded-full" />
                <div className="relative z-10">
                  <motion.img
                    src={treegenHero}
                    alt={treegen.name}
                    className="w-32 h-32 mx-auto mb-4 drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl">{stageInfo.emoji}</span>
                    <h2 className="font-display text-xl font-bold text-foreground">{treegen.name}</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{stageInfo.description}</p>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className={`text-[10px] font-bold uppercase ${RARITY_COLORS[treegen.rarity]}`}>{treegen.rarity}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] font-bold text-foreground">{speciesInfo?.name} · {speciesInfo?.trait}</span>
                  </div>

                  {/* XP Bar */}
                  <div className="space-y-1.5 max-w-[260px] mx-auto">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Stage {treegen.stage} → {treegen.stage + 1}</span>
                      <span className="font-bold text-primary">{treegen.xp} XP</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, xpProgress)}%` }}
                        className={`h-full rounded-full bg-gradient-to-r ${speciesInfo?.color || "from-primary to-accent"}`}
                      />
                    </div>
                    <p className="text-[9px] text-muted-foreground text-center">
                      {treegen.xp_next_level - treegen.xp} XP to next evolution
                    </p>
                  </div>
                </div>
              </div>

              {/* Evolution Stages */}
              <div>
                <h3 className="font-display font-bold text-sm text-foreground mb-3">Evolution Path</h3>
                <div className="space-y-2">
                  {STAGES.map((stage) => {
                    const reached = treegen.stage >= stage.stage;
                    const current = treegen.stage === stage.stage;
                    return (
                      <div
                        key={stage.stage}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          current ? "glass-card border border-primary/20" : reached ? "opacity-60" : "opacity-30"
                        }`}
                      >
                        <span className="text-xl w-8 text-center">{stage.emoji}</span>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-foreground">{stage.name}</p>
                          <p className="text-[9px] text-muted-foreground">{stage.xpRequired} XP required</p>
                        </div>
                        {reached && <Check size={14} className="text-primary" />}
                        {current && <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Current</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 0G Chain info */}
              <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
                <img src={ogLogo} alt="0G" className="w-8 h-8" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground">Ready for Rewards</p>
                  <p className="text-[9px] text-muted-foreground">Your tree will become a permanent collectible badge on your profile</p>
                </div>
                <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">Coming Soon</span>
              </div>
            </motion.div>
          )}

          {/* PERKS TAB */}
          {tab === "perks" && (
            <motion.div key="perks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              {/* Early Adopter Banner */}
              <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 blur-[40px] rounded-full" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-hero-orange/20 flex items-center justify-center text-2xl">
                    👑
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Genesis Hero Perks</h3>
                    <p className="text-xs text-muted-foreground">Exclusive rewards for early believers</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <img src={ogLogo} alt="0G" className="w-3.5 h-3.5" />
                      <span className="text-[9px] text-primary font-bold">Backed by 0G Chain</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perks Grid */}
              <div className="space-y-2.5">
                {PERKS.map((perk, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card rounded-2xl p-4 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">
                      {perk.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-foreground">{perk.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{perk.desc}</p>
                    </div>
                    <span className="text-[8px] font-bold text-accent bg-accent/10 px-2 py-1 rounded-full shrink-0">
                      {perk.tier}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="glass rounded-xl p-3 flex items-start gap-2">
                <Shield size={12} className="text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[9px] text-muted-foreground leading-relaxed">
                  All perks are locked to your Soulbound ID. Founding badges are non-transferable. Airdrop multipliers snapshot at TGE. Revenue share is proportional to total contribution score.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Campaign;
