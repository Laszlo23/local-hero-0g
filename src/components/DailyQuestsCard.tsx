import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, Sparkles, Zap, Flame, Gift } from "lucide-react";
import { useDailyQuests, type DailyQuest } from "@/hooks/use-daily-quests";
import { useUserStats } from "@/hooks/use-user-stats";
import ComebackTimer from "@/components/ComebackTimer";
import HelpBubble from "@/components/HelpBubble";
import { useState } from "react";
import confetti from "canvas-confetti";

const DailyQuestsCard = () => {
  const { quests, loading, generating, completedCount, completeDaily } = useDailyQuests();
  const { stats } = useUserStats();
  const [celebratingId, setCelebratingId] = useState<string | null>(null);

  const streakMultiplier = Math.min(stats.streak, 7);
  const bonusPercent = (streakMultiplier - 1) * 10;

  const handleComplete = async (quest: DailyQuest) => {
    setCelebratingId(quest.id);
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 }, colors: ["#22c55e", "#facc15"] });
    await completeDaily(quest);
    setTimeout(() => setCelebratingId(null), 1500);
  };

  if (loading || generating) {
    return (
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={18} className="text-primary" />
          </motion.div>
          <h3 className="font-display font-bold text-foreground text-sm">
            {generating ? "Generating your quests..." : "Loading daily quests..."}
          </h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-secondary/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (quests.length === 0) return null;

  const allComplete = completedCount === quests.length;

  // Show comeback timer when all quests are done
  if (allComplete) {
    return (
      <div className="space-y-3">
        <ComebackTimer streak={stats.streak} />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 space-y-3 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-[40px] rounded-full" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-accent" />
          <h3 className="font-display font-bold text-foreground text-sm">Today's Quests</h3>
          <HelpBubble tip="You get fresh quests daily! Tap to mark them done and earn points. Complete all for a bonus!" emoji="🎯" size={12} />
        </div>
        <div className="flex items-center gap-2">
          {bonusPercent > 0 && (
            <motion.span
              className="text-[9px] font-bold text-hero-orange bg-hero-orange/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame size={8} /> +{bonusPercent}%
            </motion.span>
          )}
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {completedCount}/{quests.length} done
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-hero-glow rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / quests.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Encouragement when close to finishing */}
      {completedCount > 0 && completedCount < quests.length && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-center font-medium text-muted-foreground"
        >
          {quests.length - completedCount === 1
            ? "🔥 Just 1 quest left — finish for the full bonus!"
            : `⚡ ${quests.length - completedCount} quests to go — keep the momentum!`}
        </motion.p>
      )}

      <AnimatePresence mode="popLayout">
        {quests.map((quest, i) => (
          <QuestRow
            key={quest.id}
            quest={quest}
            index={i}
            onComplete={handleComplete}
            isCelebrating={celebratingId === quest.id}
            streakBonus={bonusPercent}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const QuestRow = ({
  quest,
  index,
  onComplete,
  isCelebrating,
  streakBonus,
}: {
  quest: DailyQuest;
  index: number;
  onComplete: (q: DailyQuest) => void;
  isCelebrating: boolean;
  streakBonus: number;
}) => (
  <motion.button
    layout
    initial={{ opacity: 0, x: -20 }}
    animate={{
      opacity: 1,
      x: 0,
      scale: isCelebrating ? [1, 1.03, 1] : 1,
    }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ delay: index * 0.1 }}
    onClick={() => !quest.completed && onComplete(quest)}
    disabled={quest.completed}
    className={`w-full rounded-xl p-3.5 flex items-center gap-3 transition-all text-left ${
      quest.completed
        ? "glass-card opacity-60"
        : "glass-card-hover cursor-pointer active:scale-[0.98]"
    }`}
  >
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
        quest.completed ? "bg-primary/20" : "bg-hero-green-light"
      }`}
    >
      {quest.completed ? <Check size={18} className="text-primary" /> : quest.emoji}
    </div>
    <div className="flex-1 min-w-0">
      <p
        className={`font-semibold text-sm truncate ${
          quest.completed ? "line-through text-muted-foreground" : "text-foreground"
        }`}
      >
        {quest.title}
      </p>
      <p className="text-[11px] text-muted-foreground truncate">{quest.description}</p>
    </div>
    <div className="text-right shrink-0">
      <span className={`text-xs font-bold ${quest.completed ? "text-muted-foreground" : "text-primary"}`}>
        +{quest.points}
      </span>
      {streakBonus > 0 && !quest.completed && (
        <p className="text-[8px] font-bold text-hero-orange">+{streakBonus}%</p>
      )}
      <p className="text-[9px] text-muted-foreground">{quest.category}</p>
    </div>
  </motion.button>
);

export default DailyQuestsCard;
