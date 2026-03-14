import { useState, useEffect, useRef } from "react";
import { Timer } from "lucide-react";
import { motion } from "framer-motion";

interface QuestTimerProps {
  isRunning: boolean;
  onTimeBonus: (bonus: number) => void;
  questIndex: number;
}

const QuestTimer = ({ isRunning, onTimeBonus, questIndex }: QuestTimerProps) => {
  const [seconds, setSeconds] = useState(30);
  const startRef = useRef(Date.now());

  useEffect(() => {
    setSeconds(30);
    startRef.current = Date.now();
  }, [questIndex]);

  useEffect(() => {
    if (!isRunning) {
      // Calculate time bonus when answered
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      if (elapsed < 10) onTimeBonus(25);
      else if (elapsed < 20) onTimeBonus(10);
      else if (elapsed < 30) onTimeBonus(5);
      return;
    }
    const interval = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, onTimeBonus]);

  const pct = (seconds / 30) * 100;
  const isUrgent = seconds <= 10;

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={isUrgent && isRunning ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        <Timer size={14} className={isUrgent ? "text-destructive" : "text-muted-foreground"} />
      </motion.div>
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            isUrgent ? "bg-destructive" : "bg-gradient-hero-glow"
          }`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
        {seconds}s
      </span>
    </div>
  );
};

export default QuestTimer;
