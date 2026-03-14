import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Flame, Star, Zap } from "lucide-react";
import confetti from "canvas-confetti";

interface MysteryRewardProps {
  show: boolean;
  onComplete: (bonusPoints: number) => void;
}

const REWARDS = [
  { label: "Lucky Find!", emoji: "🍀", points: 15, rarity: "common" },
  { label: "Hidden Gem!", emoji: "💎", points: 30, rarity: "rare" },
  { label: "Jackpot!", emoji: "🎰", points: 75, rarity: "epic" },
  { label: "Bonus Round!", emoji: "⚡", points: 20, rarity: "common" },
  { label: "Secret Stash!", emoji: "🗝️", points: 40, rarity: "rare" },
  { label: "Hero's Fortune!", emoji: "👑", points: 100, rarity: "legendary" },
];

const SLOT_EMOJIS = ["🍀", "💎", "⚡", "🎰", "🗝️", "👑", "🌟", "🔥"];

const MysteryReward = ({ show, onComplete }: MysteryRewardProps) => {
  const [phase, setPhase] = useState<"spinning" | "reveal" | "hidden">("hidden");
  const [reward, setReward] = useState(REWARDS[0]);
  const [slotIndex, setSlotIndex] = useState(0);

  useEffect(() => {
    if (!show) return;
    
    // Pick reward with weighted probability (common 60%, rare 25%, epic 12%, legendary 3%)
    const roll = Math.random();
    let picked;
    if (roll < 0.03) picked = REWARDS.find(r => r.rarity === "legendary")!;
    else if (roll < 0.15) picked = REWARDS.find(r => r.rarity === "epic")!;
    else if (roll < 0.40) picked = REWARDS.filter(r => r.rarity === "rare")[Math.random() < 0.5 ? 0 : 1] || REWARDS[1];
    else picked = REWARDS.filter(r => r.rarity === "common")[Math.random() < 0.5 ? 0 : 1] || REWARDS[0];
    
    setReward(picked);
    setPhase("spinning");

    // Slot machine animation
    let count = 0;
    const interval = setInterval(() => {
      setSlotIndex(i => (i + 1) % SLOT_EMOJIS.length);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setPhase("reveal");
        if (picked.rarity === "legendary" || picked.rarity === "epic") {
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 }, colors: ["#facc15", "#22c55e", "#a855f7"] });
        }
      }
    }, 80);

    return () => clearInterval(interval);
  }, [show]);

  const handleClaim = () => {
    onComplete(reward.points);
    setPhase("hidden");
  };

  const rarityColors: Record<string, string> = {
    common: "from-primary/20 to-primary/5 border-primary/30",
    rare: "from-blue-500/20 to-purple-500/10 border-blue-500/30",
    epic: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
    legendary: "from-hero-yellow/20 to-hero-orange/10 border-hero-yellow/30",
  };

  const rarityText: Record<string, string> = {
    common: "text-primary",
    rare: "text-blue-400",
    epic: "text-purple-400",
    legendary: "text-hero-yellow",
  };

  return (
    <AnimatePresence>
      {phase !== "hidden" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className={`glass-card rounded-2xl p-5 border bg-gradient-to-br ${rarityColors[reward.rarity]} text-center relative overflow-hidden`}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Gift size={14} className="text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Mystery Bonus</span>
            </div>

            {phase === "spinning" ? (
              <motion.div
                className="w-16 h-16 mx-auto rounded-2xl bg-secondary/50 flex items-center justify-center text-3xl mb-3"
                animate={{ rotateX: [0, 360] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
                {SLOT_EMOJIS[slotIndex]}
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="text-4xl mb-2"
                >
                  {reward.emoji}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`font-display font-bold text-lg ${rarityText[reward.rarity]}`}
                >
                  {reward.label}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-foreground mt-1"
                >
                  +{reward.points} HERO
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={handleClaim}
                  className="mt-3 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-transform"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={14} /> Claim Bonus
                  </span>
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MysteryReward;
