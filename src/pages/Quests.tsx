import { useState, useCallback, useRef, useEffect } from "react";
import { Check, Heart, Video, X, Zap, TreePine, Droplets, BookOpen, UtensilsCrossed, Sparkles, Trophy, Shield, ArrowRight, Share2, Flame, RotateCcw } from "lucide-react";
import ShareMilestoneModal from "@/components/ShareMilestoneModal";
import type { MilestoneCardData } from "@/lib/milestone-card";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { completeQuest, getRecentQuests } from "@/lib/quests";
import { useAuth } from "@/contexts/AuthContext";
import QuestTimer from "@/components/quests/QuestTimer";
import ComboIndicator from "@/components/quests/ComboIndicator";
import FlyingPoints from "@/components/quests/FlyingPoints";
import NextQuestTeaser from "@/components/quests/NextQuestTeaser";
import PointsHUD from "@/components/quests/PointsHUD";
import MysteryReward from "@/components/MysteryReward";

import questGroceries from "@/assets/quest-groceries.jpg";
import questPlanting from "@/assets/quest-planting.jpg";
import questCleanup from "@/assets/quest-cleanup.jpg";
import questTeaching from "@/assets/quest-teaching.jpg";
import questSharing from "@/assets/quest-sharing.jpg";
import nftPatch from "@/assets/nft-first-patch.png";

const iconAnimationMap: Record<string, string> = {
  help: "icon-heartbeat", volunteer: "icon-bounce-pop", clean: "icon-sparkle",
  tutor: "icon-sparkle", organize: "icon-wiggle", ignore: "icon-shake-no",
  skip: "icon-shake-no", walk: "icon-shake-no", nothing: "icon-shake-no",
  nah: "icon-shake-no", film: "icon-wiggle", donate: "icon-bounce-pop",
  suggest: "icon-bounce-pop", report: "icon-wiggle", book: "icon-bounce-pop",
};

const iconColorMap: Record<string, string> = {
  help: "text-rose-400", ignore: "text-zinc-400", film: "text-violet-400",
  volunteer: "text-emerald-400", donate: "text-amber-400", skip: "text-zinc-400",
  clean: "text-cyan-400", report: "text-blue-400", walk: "text-zinc-400",
  tutor: "text-amber-400", book: "text-orange-400", nothing: "text-zinc-400",
  organize: "text-fuchsia-400", suggest: "text-purple-400", nah: "text-zinc-400",
};

const questScenarios = [
  {
    title: "Community Connection", chapter: "Chapter 1", subtitle: "The Neighbor's Burden",
    image: questGroceries, color: "from-rose-500/20 to-amber-500/20",
    iconColor: "text-rose-400", iconBg: "bg-rose-500/20",
    scenario: "You're walking home after a long day. At the corner store, Mrs. Chen — your 78-year-old neighbor — is struggling with three heavy grocery bags. Rain is starting to fall.",
    narration: "Every hero's journey starts with a single act of kindness. Not the grand gestures — the quiet ones.",
    options: [
      { id: "help", icon: <Heart size={18} />, label: "Help carry her groceries home", points: 50, correct: true, feedback: "Mrs. Chen smiled and told you about her garden. Sometimes the greatest adventures start with a grocery bag." },
      { id: "ignore", icon: <X size={18} />, label: "Keep walking, you're tired", points: 0, correct: false, feedback: "The rain got heavier. You looked back once." },
      { id: "film", icon: <Video size={18} />, label: "Film it for social media", points: 5, correct: false, feedback: "Real heroes don't need an audience." },
    ],
  },
  {
    title: "Green Guardian", chapter: "Chapter 2", subtitle: "Seeds of Tomorrow",
    image: questPlanting, color: "from-emerald-500/20 to-lime-500/20",
    iconColor: "text-emerald-400", iconBg: "bg-emerald-500/20",
    scenario: "The community park has a bare, muddy corner that floods every spring. The city won't fund it. A local group is planting trees this Saturday — they need one more volunteer.",
    narration: "A tree planted today is shade for someone you'll never meet. That's what heroes do.",
    options: [
      { id: "volunteer", icon: <TreePine size={18} />, label: "Show up Saturday and plant", points: 75, correct: true, feedback: "You planted 3 saplings. In 10 years, they'll be 20 feet tall. Your impact is literally growing." },
      { id: "donate", icon: <Sparkles size={18} />, label: "Send $5 instead of going", points: 20, correct: false, feedback: "Money helps, but roots need hands. The soil remembers who showed up." },
      { id: "skip", icon: <X size={18} />, label: "It's not your problem", points: 0, correct: false, feedback: "The corner flooded again that spring." },
    ],
  },
  {
    title: "River Rescue", chapter: "Chapter 3", subtitle: "The Cleanup Crew",
    image: questCleanup, color: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400", iconBg: "bg-cyan-500/20",
    scenario: "You're hiking along the river and spot a stretch of shoreline covered in plastic bottles, wrappers, and old fishing line. A family of ducks is navigating through the debris.",
    narration: "The river doesn't ask who polluted it. It only knows who cleaned it.",
    options: [
      { id: "clean", icon: <Droplets size={18} />, label: "Spend an hour cleaning up", points: 60, correct: true, feedback: "You filled 2 trash bags. The ducks swam freely. You made a real difference." },
      { id: "report", icon: <BookOpen size={18} />, label: "Report it to the city", points: 15, correct: false, feedback: "The report was filed. Three weeks later, nothing changed." },
      { id: "walk", icon: <X size={18} />, label: "Enjoy your hike, ignore it", points: 0, correct: false, feedback: "The fishing line caught a duckling's foot that evening." },
    ],
  },
  {
    title: "Knowledge Keeper", chapter: "Chapter 4", subtitle: "The Gift of Knowing",
    image: questTeaching, color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400", iconBg: "bg-amber-500/20",
    scenario: "A 12-year-old in your neighborhood is failing math. Their parents work double shifts. The kid is smart but has no one to explain fractions after school.",
    narration: "Not every quest requires you to be there. A hero can teach remotely, outsource help, or connect people.",
    options: [
      { id: "tutor", icon: <BookOpen size={18} />, label: "Tutor them twice a week (remote OK)", points: 80, correct: true, feedback: "You did 4 video calls. They got a B+ on the next test. You've now earned the 'Mentor' badge." },
      { id: "book", icon: <Sparkles size={18} />, label: "Buy them a textbook", points: 15, correct: false, feedback: "The book sat unopened. Knowledge needs a guide, not just pages." },
      { id: "nothing", icon: <X size={18} />, label: "Not your responsibility", points: 0, correct: false, feedback: "They failed the class. Someone could have changed that." },
    ],
  },
  {
    title: "Feast of Unity", chapter: "Chapter 5", subtitle: "Breaking Bread Together",
    image: questSharing, color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400", iconBg: "bg-purple-500/20",
    scenario: "Your block has 40 households but no one talks to each other. You have an idea: a community potluck in the shared courtyard. But organizing it means knocking on doors.",
    narration: "The strongest connections are between neighbors. One meal can build a community.",
    options: [
      { id: "organize", icon: <UtensilsCrossed size={18} />, label: "Organize the potluck yourself", points: 100, correct: true, feedback: "22 families showed up. Three new friendships formed. You earned your final patch — the FIRST HERO badge." },
      { id: "suggest", icon: <Sparkles size={18} />, label: "Suggest it in the group chat", points: 10, correct: false, feedback: "The message got 6 thumbs up and zero action. Ideas need legs." },
      { id: "nah", icon: <X size={18} />, label: "People prefer being alone", points: 0, correct: false, feedback: "Do they? Or has no one ever knocked?" },
    ],
  },
];

const Quests = () => {
  const { user } = useAuth();
  const [currentQuest, setCurrentQuest] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [completedQuestIds, setCompletedQuestIds] = useState<number[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showNFT, setShowNFT] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [combo, setCombo] = useState(0);
  const [perfectRun, setPerfectRun] = useState(true);
  const [timeBonus, setTimeBonus] = useState(0);
  const [flyingPoints, setFlyingPoints] = useState<{ id: number; value: number; x: number }[]>([]);
  const [lastEarned, setLastEarned] = useState(0);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [showMystery, setShowMystery] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);
  const flyIdRef = useRef(0);

  // Check if user already completed the story quests
  useEffect(() => {
    const checkCompleted = async () => {
      const recent = await getRecentQuests(50);
      const storyTitles = questScenarios.map(q => q.title);
      const completedStories = recent.filter(r => storyTitles.includes(r.quest_title));
      if (completedStories.length >= 5) {
        setAlreadyCompleted(true);
      }
      setLoadingCheck(false);
    };
    checkCompleted();
  }, []);

  const handleReset = () => {
    setAlreadyCompleted(false);
    setCurrentQuest(0);
    setSelected(null);
    setAnswered(false);
    setCompletedQuestIds([]);
    setTotalPoints(0);
    setShowNFT(false);
    setCombo(0);
    setPerfectRun(true);
    setTimeBonus(0);
    setLastEarned(0);
  };

  const quest = questScenarios[currentQuest];
  const selectedOption = quest.options.find((o) => o.id === selected);
  const allDone = completedQuestIds.length === 5;
  const timerRunning = !answered;

  const spawnFlyingPoints = (value: number) => {
    const id = flyIdRef.current++;
    const x = 100 + Math.random() * 150;
    setFlyingPoints((prev) => [...prev, { id, value, x }]);
    setTimeout(() => setFlyingPoints((prev) => prev.filter((p) => p.id !== id)), 1500);
  };

  const handleSelect = (id: string) => {
    if (answered) return;
    setSelected(id);
  };

  const handleTimeBonus = useCallback((bonus: number) => {
    setTimeBonus(bonus);
  }, []);

  const handleSubmit = async () => {
    if (!selected) return;
    setAnswered(true);
    const opt = quest.options.find((o) => o.id === selected);
    if (!opt) return;

    if (opt.correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const multiplier = Math.min(newCombo, 5);
      const basePoints = opt.points;
      const comboBonus = newCombo >= 2 ? Math.floor(basePoints * (multiplier - 1) * 0.25) : 0;
      const totalEarned = basePoints + comboBonus + timeBonus;

      setLastEarned(totalEarned);
      setTotalPoints((p) => p + totalEarned);
      spawnFlyingPoints(totalEarned);

      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 }, colors: ["#22c55e", "#facc15"] });

      // 40% chance of mystery reward on correct answer (variable ratio schedule)
      if (Math.random() < 0.4) {
        setTimeout(() => setShowMystery(true), 1200);
      }
    } else {
      setCombo(0);
      setPerfectRun(false);
      setLastEarned(opt.points);
      setTotalPoints((p) => p + opt.points);
      if (opt.points > 0) spawnFlyingPoints(opt.points);
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
    }

    const impactMap: Record<string, { type: "trees_planted" | "neighbors_helped" | "businesses_supported"; value: number }> = {
      "Community Connection": { type: "neighbors_helped", value: 1 },
      "Green Guardian": { type: "trees_planted", value: 3 },
      "River Rescue": { type: "neighbors_helped", value: 1 },
      "Knowledge Keeper": { type: "neighbors_helped", value: 1 },
      "Feast of Unity": { type: "neighbors_helped", value: 1 },
    };
    const impact = impactMap[quest.title];
    await completeQuest({
      title: quest.title,
      category: quest.chapter,
      emoji: quest.title === "Green Guardian" ? "🌳" : quest.title === "River Rescue" ? "🌊" : quest.title === "Knowledge Keeper" ? "📚" : quest.title === "Feast of Unity" ? "🍽️" : "🤝",
      points: opt.points,
      userId: user?.id,
      impactType: opt.correct ? impact?.type : undefined,
      impactValue: opt.correct ? impact?.value : undefined,
    });
  };

  const handleMysteryComplete = (bonusPoints: number) => {
    setTotalPoints((p) => p + bonusPoints);
    spawnFlyingPoints(bonusPoints);
    setShowMystery(false);
  };

  const fireConfetti = useCallback(() => {
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ["#22c55e", "#facc15", "#f97316"] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ["#22c55e", "#facc15", "#a855f7"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 }, colors: ["#22c55e", "#facc15", "#f97316", "#a855f7"] }), 500);
  }, []);

  const handleNext = () => {
    setCompletedQuestIds([...completedQuestIds, currentQuest]);
    if (currentQuest < 4) {
      setCurrentQuest(currentQuest + 1);
      setSelected(null);
      setAnswered(false);
      setTimeBonus(0);
      setLastEarned(0);
      setShowMystery(false);
    } else {
      if (perfectRun) {
        const bonus = 200;
        setTotalPoints((p) => p + bonus);
        spawnFlyingPoints(bonus);
      }
      setShowNFT(true);
      setTimeout(() => fireConfetti(), 300);
    }
  };

  // Loading state
  if (loadingCheck) {
    return (
      <div className="px-5 pt-12 flex items-center justify-center min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Sparkles size={24} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  // Already completed gate
  if (alreadyCompleted && !showNFT && completedQuestIds.length === 0) {
    return (
      <div className="px-5 pt-12 pb-8 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full scale-150" />
          <img src={nftPatch} alt="Completed" className="w-36 h-36 relative z-10 opacity-80" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <Check size={12} /> Story Complete
          </span>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Quest Journey Completed</h1>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            You've already completed the Hero Origin Story. Want to relive the journey?
          </p>
          <motion.button
            onClick={handleReset}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm glass-card-hover border border-primary/20 text-foreground transition-all"
          >
            <RotateCcw size={16} className="text-primary" />
            Replay Journey
          </motion.button>
          <p className="text-[10px] text-muted-foreground mt-3">
            Note: Points from replays are for fun only
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── NFT Completion Screen ───
  if (showNFT || allDone) {
    return (
      <div className="px-5 pt-12 pb-8 flex flex-col items-center justify-center min-h-[80vh]">
        <FlyingPoints points={flyingPoints} />
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.2, bounce: 0.4 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-hero-green-glow/30 blur-[60px] rounded-full scale-150" />
          <img src={nftPatch} alt="First Hero NFT Patch" className="w-48 h-48 relative z-10 drop-shadow-[0_0_30px_hsl(var(--hero-green-glow)/0.6)]" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-hero-yellow-light text-hero-yellow text-xs font-bold mb-3">
            <Shield size={12} /> Achievement Unlocked
          </span>
          <h1 className="font-display text-3xl font-bold text-gradient-hero mb-2">First Hero Patch</h1>
          <p className="text-muted-foreground text-sm mb-1">You completed all 5 quests and earned</p>
          <motion.p
            key={totalPoints}
            animate={{ scale: [1, 1.3, 1] }}
            className="text-2xl font-bold text-hero-yellow mb-1"
          >
            +{totalPoints} HERO
          </motion.p>
          {perfectRun && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-hero-orange/20 text-hero-orange text-xs font-bold mb-4"
            >
              <Flame size={12} /> PERFECT RUN BONUS +200
            </motion.div>
          )}
          <div className="glass-card rounded-2xl p-4 text-left space-y-2 mb-6">
            <p className="text-xs text-muted-foreground">This badge is permanently tied to your profile. It represents <span className="text-primary font-semibold">who you are</span> and the good you've done.</p>
            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
              <Trophy size={14} className="text-hero-yellow" />
              <span className="text-xs font-semibold text-foreground">Unlocks: Special perks and rewards across the platform</span>
            </div>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Share2 size={16} /> Share Achievement 🎉
          </button>
        </motion.div>
        <ShareMilestoneModal
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
          data={{
            type: "nft_minted",
            displayName: user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Hero",
            title: "First Hero Patch",
            subtitle: perfectRun ? "Perfect run — all 5 quests aced!" : "All 5 quests completed",
            points: totalPoints,
            questsCompleted: 5,
          } as MilestoneCardData}
        />
      </div>
    );
  }

  // ─── Main Quest View ───
  return (
    <div className="px-5 pt-8 pb-8 space-y-4">
      <FlyingPoints points={flyingPoints} />

      {/* Sticky HUD */}
      <PointsHUD
        totalPoints={totalPoints}
        combo={combo}
        questsCompleted={completedQuestIds.length}
        perfectRun={perfectRun}
      />

      {/* Timer */}
      <QuestTimer
        isRunning={timerRunning}
        onTimeBonus={handleTimeBonus}
        questIndex={currentQuest}
      />

      {/* Progress */}
      <div className="flex items-center gap-2">
        {questScenarios.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all ${
              completedQuestIds.includes(i)
                ? "bg-gradient-hero-glow glow-green"
                : i === currentQuest
                ? "bg-primary/50 animate-pulse-glow"
                : "bg-secondary"
            }`}
          />
        ))}
        <span className="text-xs font-semibold text-muted-foreground ml-1">{completedQuestIds.length}/5</span>
      </div>

      {/* Combo */}
      <ComboIndicator combo={combo} perfectRun={perfectRun && completedQuestIds.length > 0} />

      {/* Mystery Reward */}
      <MysteryReward show={showMystery} onComplete={handleMysteryComplete} />

      {/* Quest Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuest}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0, ...(shakeWrong ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}) }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
        >
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden mb-4">
            <img src={quest.image} alt={quest.title} className="w-full h-44 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${quest.iconColor}`}>{quest.chapter}</span>
              <h2 className="font-display text-lg font-bold text-foreground leading-tight">{quest.subtitle}</h2>
            </div>
          </div>

          {/* Story Card */}
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${quest.color} opacity-30`} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${quest.iconBg} flex items-center justify-center`}>
                  <Zap size={16} className={quest.iconColor} />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {quest.title}
                </span>
              </div>

              <p className="text-xs italic text-muted-foreground border-l-2 border-primary/30 pl-3 mb-4">
                "{quest.narration}"
              </p>

              <p className="text-sm font-medium text-foreground leading-relaxed mb-5">
                {quest.scenario}
              </p>

              <div className="space-y-2.5">
                {quest.options.map((opt, idx) => {
                  const isSelected = selected === opt.id;
                  const isCorrect = opt.correct;
                  let styles = "glass border-transparent";

                  if (answered && isSelected) {
                    styles = isCorrect
                      ? "bg-emerald-500/15 border-emerald-500/50 shadow-[0_0_20px_hsl(150_60%_40%/0.15)]"
                      : "bg-destructive/10 border-destructive/50";
                  } else if (isSelected) {
                    styles = "glass border-primary/50 shadow-[0_0_15px_hsl(var(--primary)/0.1)]";
                  }

                  return (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx + 0.2 }}
                      onClick={() => handleSelect(opt.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border ${styles} transition-all active:scale-[0.98]`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        answered && isSelected
                          ? isCorrect ? "bg-emerald-500 text-white" : "bg-destructive text-white"
                          : isSelected ? `${quest.iconBg} ${quest.iconColor}` : `bg-secondary ${iconColorMap[opt.id] || "text-muted-foreground"}`
                      }`}>
                        {answered && isSelected ? (
                          isCorrect ? <Check size={18} /> : <X size={18} />
                        ) : (
                          <span className={`inline-flex ${iconAnimationMap[opt.id] || "icon-bounce-pop"}`}>
                            {opt.icon}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-foreground text-left flex-1">{opt.label}</span>
                      {!answered && opt.correct && (
                        <span className="text-[10px] font-bold text-muted-foreground/40">
                          +{opt.points}
                        </span>
                      )}
                      {answered && isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`text-xs font-bold ${isCorrect ? "text-emerald-400" : "text-destructive"}`}
                        >
                          +{isCorrect ? lastEarned : opt.points}
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {answered && selectedOption && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4"
              >
                <div className={`glass-card rounded-xl p-4 border ${
                  selectedOption.correct ? "border-emerald-500/30" : "border-destructive/30"
                }`}>
                  <p className="text-sm text-muted-foreground italic">"{selectedOption.feedback}"</p>
                  {selectedOption.correct && (
                    <div className="space-y-2 mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-hero-yellow" />
                        <span className="text-xs font-bold text-hero-yellow">+{selectedOption.points} base</span>
                      </div>
                      {combo >= 2 && (
                        <div className="flex items-center gap-2">
                          <Flame size={14} className="text-hero-orange" />
                          <span className="text-xs font-bold text-hero-orange">
                            +{lastEarned - selectedOption.points - timeBonus} combo bonus ({Math.min(combo, 5)}x streak!)
                          </span>
                        </div>
                      )}
                      {timeBonus > 0 && (
                        <div className="flex items-center gap-2">
                          <Zap size={14} className="text-primary" />
                          <span className="text-xs font-bold text-primary">+{timeBonus} speed bonus ⚡</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Next Quest Teaser */}
                {currentQuest < 4 && (
                  <NextQuestTeaser
                    title={questScenarios[currentQuest + 1].subtitle}
                    chapter={questScenarios[currentQuest + 1].chapter}
                    iconColor={questScenarios[currentQuest + 1].iconColor}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Action Button */}
      {!answered ? (
        <motion.button
          onClick={handleSubmit}
          disabled={!selected}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
            selected
              ? "bg-gradient-hero-glow text-primary-foreground glow-green"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {selected ? "Lock In Answer 🔒" : "Choose Your Path"}
        </motion.button>
      ) : (
        !showMystery && (
          <motion.button
            onClick={handleNext}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green flex items-center justify-center gap-2"
          >
            {currentQuest < 4 ? (
              <>Next Quest <ArrowRight size={16} /></>
            ) : (
              <>Claim Your NFT Patch <Trophy size={16} /></>
            )}
          </motion.button>
        )
      )}
    </div>
  );
};

export default Quests;
