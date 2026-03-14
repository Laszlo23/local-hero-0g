import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIVITIES = [
  { emoji: "🌳", name: "Sarah", city: "Berlin", action: "just planted a tree" },
  { emoji: "🏆", name: "Marco", city: "Vienna", action: "hit a 14-day streak" },
  { emoji: "🎁", name: "Anonymous", city: "", action: "claimed a Mystery Reward" },
  { emoji: "🧹", name: "Leila", city: "Munich", action: "completed a cleanup quest" },
  { emoji: "🌱", name: "Tom", city: "Zurich", action: "earned 120 HERO points" },
  { emoji: "👥", name: "Nina", city: "Amsterdam", action: "helped a neighbor move" },
  { emoji: "📚", name: "Alex", city: "Hamburg", action: "completed a learning quest" },
  { emoji: "🎯", name: "Priya", city: "London", action: "unlocked the Explorer badge" },
  { emoji: "☕", name: "Jonas", city: "Copenhagen", action: "redeemed a free coffee" },
  { emoji: "🌍", name: "Fatima", city: "Barcelona", action: "joined a community challenge" },
  { emoji: "🏅", name: "Kai", city: "Stockholm", action: "reached Level 5" },
  { emoji: "🤝", name: "Emma", city: "Paris", action: "invited 3 friends" },
];

const LiveActivityFeed = () => {
  const [current, setCurrent] = useState<typeof ACTIVITIES[0] | null>(null);
  const [visible, setVisible] = useState(false);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

  const showNext = useCallback(() => {
    let available = ACTIVITIES.map((_, i) => i).filter(i => !usedIndices.has(i));
    if (available.length === 0) {
      setUsedIndices(new Set());
      available = ACTIVITIES.map((_, i) => i);
    }
    const idx = available[Math.floor(Math.random() * available.length)];
    setUsedIndices(prev => new Set(prev).add(idx));
    setCurrent(ACTIVITIES[idx]);
    setVisible(true);
    setTimeout(() => setVisible(false), 4000);
  }, [usedIndices]);

  useEffect(() => {
    // Initial delay before first toast
    const initialTimeout = setTimeout(() => {
      showNext();
    }, 5000);

    return () => clearTimeout(initialTimeout);
  }, []);

  useEffect(() => {
    if (!visible && current) {
      const nextTimeout = setTimeout(() => {
        showNext();
      }, Math.random() * 3000 + 5000); // 5-8s between toasts
      return () => clearTimeout(nextTimeout);
    }
  }, [visible, current]);

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-none">
      <AnimatePresence>
        {visible && current && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg max-w-[320px] pointer-events-auto"
          >
            <span className="text-xl shrink-0">{current.emoji}</span>
            <div className="min-w-0">
              <p className="text-[13px] text-foreground font-medium leading-snug truncate">
                <span className="font-bold">{current.name}</span>
                {current.city && <span className="text-muted-foreground"> from {current.city}</span>}
              </p>
              <p className="text-[12px] text-muted-foreground leading-snug">{current.action}</p>
            </div>
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveActivityFeed;
