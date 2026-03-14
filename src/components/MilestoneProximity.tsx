import { motion } from "framer-motion";
import { Trophy, Lock, Star } from "lucide-react";

interface MilestoneProximityProps {
  currentPoints: number;
  questsCompleted: number;
  level: number;
}

const MILESTONES = [
  { points: 100, label: "Newcomer Badge", emoji: "🌱", reward: "Exclusive profile flair" },
  { points: 300, label: "Rising Star", emoji: "⭐", reward: "2x point weekend unlock" },
  { points: 500, label: "Community Pillar", emoji: "🏛️", reward: "Custom quest creation" },
  { points: 1000, label: "Local Legend", emoji: "👑", reward: "Gold profile + bonus quests" },
  { points: 2500, label: "City Champion", emoji: "🏆", reward: "Exclusive rewards tier" },
];

const MilestoneProximity = ({ currentPoints, questsCompleted, level }: MilestoneProximityProps) => {
  const nextMilestone = MILESTONES.find(m => m.points > currentPoints);
  if (!nextMilestone) return null;

  const prevThreshold = MILESTONES[MILESTONES.indexOf(nextMilestone) - 1]?.points || 0;
  const progress = ((currentPoints - prevThreshold) / (nextMilestone.points - prevThreshold)) * 100;
  const remaining = nextMilestone.points - currentPoints;

  // Show urgency when close
  const isClose = progress > 75;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-4 relative overflow-hidden"
    >
      {isClose && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="text-lg">{nextMilestone.emoji}</div>
            <div>
              <p className="text-xs font-bold text-foreground">{nextMilestone.label}</p>
              <p className="text-[10px] text-muted-foreground">{nextMilestone.reward}</p>
            </div>
          </div>
          {isClose ? (
            <motion.span
              className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Almost there!
            </motion.span>
          ) : (
            <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock size={8} /> {remaining} pts away
            </span>
          )}
        </div>

        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-hero-glow rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-muted-foreground">{currentPoints} pts</span>
          <span className="text-[9px] font-bold text-primary">{nextMilestone.points} pts</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MilestoneProximity;
