import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Flame, Gift, TreePine, Users, ChevronRight, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

const GUIDE_KEY = "hero_welcome_seen";

interface GuideStep {
  emoji: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const guideSteps: GuideStep[] = [
  {
    emoji: "🎯",
    icon: <Sparkles size={28} className="text-primary" />,
    title: "Complete Daily Quests",
    description: "Every day you get fresh quests — small real-world actions that help your neighborhood. Complete them to earn HERO points!",
    color: "from-primary/20 to-primary/5",
  },
  {
    emoji: "🔥",
    icon: <Flame size={28} className="text-hero-orange" />,
    title: "Build Your Streak",
    description: "Come back daily to keep your streak alive! Each consecutive day boosts your point multiplier up to 70% extra.",
    color: "from-hero-orange/20 to-hero-orange/5",
  },
  {
    emoji: "🌳",
    icon: <TreePine size={28} className="text-primary" />,
    title: "Grow Your Impact",
    description: "Plant trees, help neighbors, support local shops — every quest contributes to real change in your community.",
    color: "from-primary/20 to-accent/5",
  },
  {
    emoji: "🎁",
    icon: <Gift size={28} className="text-accent" />,
    title: "Earn Rewards & Badges",
    description: "Hit milestones to unlock badges, mystery rewards, and climb the leaderboard. Some rewards are rare — keep playing!",
    color: "from-accent/20 to-accent/5",
  },
  {
    emoji: "🤝",
    icon: <Users size={28} className="text-hero-purple" />,
    title: "Join the Community",
    description: "Invite friends with your referral code, join challenges, and compete as a city. Together you're unstoppable!",
    color: "from-hero-purple/20 to-hero-purple/5",
  },
];

const WelcomeGuide = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(GUIDE_KEY);
    if (!seen) {
      // Small delay so dashboard renders first
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(GUIDE_KEY, "true");
    setVisible(false);
  };

  const next = () => {
    if (step < guideSteps.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

  const current = guideSteps[step];
  const isLast = step === guideSteps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-6"
        onClick={(e) => e.target === e.currentTarget && dismiss()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-[360px] relative"
        >
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>

          <div className="glass-card rounded-2xl p-6 space-y-5">
            {/* Progress dots */}
            <div className="flex gap-1.5 justify-center">
              {guideSteps.map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? "w-6 bg-primary" : i < step ? "w-1.5 bg-primary/50" : "w-1.5 bg-border/40"
                  }`}
                />
              ))}
            </div>

            {/* Icon */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 text-center"
              >
                <motion.div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center mx-auto`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {current.icon}
                </motion.div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {current.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {current.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={dismiss}
                className="flex-1 h-11 rounded-xl text-muted-foreground text-sm"
              >
                Skip Tour
              </Button>
              <Button
                onClick={next}
                className="flex-1 h-11 rounded-xl bg-gradient-hero-glow text-primary-foreground font-bold text-sm"
              >
                {isLast ? (
                  <><PartyPopper size={16} className="mr-1.5" /> Let's Go!</>
                ) : (
                  <>Next <ChevronRight size={16} className="ml-1" /></>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeGuide;
