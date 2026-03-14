import { motion, AnimatePresence } from "framer-motion";
import { Zap, Flame, Star } from "lucide-react";

interface PointsHUDProps {
  totalPoints: number;
  combo: number;
  questsCompleted: number;
  perfectRun: boolean;
}

const PointsHUD = ({ totalPoints, combo, questsCompleted, perfectRun }: PointsHUDProps) => {
  const multiplier = Math.min(combo, 5);

  return (
    <div className="glass-strong rounded-2xl p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <motion.div
            key={totalPoints}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5"
          >
            <Zap size={16} className="text-hero-yellow" />
            <span className="text-lg font-extrabold text-foreground tabular-nums">{totalPoints}</span>
          </motion.div>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase">HERO</span>
      </div>

      <div className="flex items-center gap-2">
        <AnimatePresence>
          {combo >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-hero-orange/20"
            >
              <Flame size={12} className="text-hero-orange" />
              <span className="text-[10px] font-extrabold text-hero-orange">{multiplier}x</span>
            </motion.div>
          )}
        </AnimatePresence>

        {perfectRun && questsCompleted > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-hero-yellow/20">
            <Star size={12} className="text-hero-yellow" />
            <span className="text-[10px] font-extrabold text-hero-yellow">PERFECT</span>
          </div>
        )}

        <div className="flex gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < questsCompleted
                  ? "bg-primary glow-green scale-110"
                  : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PointsHUD;
