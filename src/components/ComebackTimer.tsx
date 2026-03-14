import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles, Flame } from "lucide-react";

interface ComebackTimerProps {
  streak: number;
}

const ComebackTimer = ({ streak }: ComebackTimerProps) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const nextMultiplier = Math.min(streak + 1, 7);
  const bonusPercent = (nextMultiplier - 1) * 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 text-center relative overflow-hidden"
    >
      <motion.div
        className="absolute -top-8 -right-8 w-24 h-24 bg-accent/10 blur-[30px] rounded-full"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mb-2"
        >
          <Sparkles size={24} className="text-accent" />
        </motion.div>

        <h3 className="font-display font-bold text-foreground text-base mb-1">
          All Done Today! 🎉
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          New quests drop in
        </p>

        <motion.div
          className="inline-flex items-center gap-2 glass rounded-xl px-4 py-2.5 mb-3"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Clock size={16} className="text-primary" />
          <span className="font-mono font-bold text-lg text-foreground">{timeLeft}</span>
        </motion.div>

        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-center gap-1.5">
              <Flame size={14} className="text-hero-orange" />
              <span className="text-xs font-bold text-hero-orange">
                {streak}-day streak!
              </span>
            </div>
            {bonusPercent > 0 && (
              <p className="text-[11px] text-muted-foreground">
                Come back tomorrow for{" "}
                <span className="font-bold text-primary">+{bonusPercent}% bonus</span>{" "}
                on all quests
              </p>
            )}
            <p className="text-[10px] text-destructive/70 font-medium">
              ⚠️ Don't break your streak — you'll lose your multiplier!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ComebackTimer;
