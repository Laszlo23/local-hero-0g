import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { TrustScore } from "@/hooks/use-trust-score";
import HelpBubble from "./HelpBubble";

const TrustScoreCard = ({ score }: { score: TrustScore }) => {
  const pct = Math.min(100, Math.round((score.total / 1000) * 100));

  return (
    <div className="glass-card rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg"
          >
            {score.tierEmoji}
          </motion.div>
          <div>
            <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-1">
              Hero Trust Score
              <HelpBubble
                tip="Your trust score grows from quests, streaks, referrals, and profile completion. Higher trust = more rewards and community standing!"
                emoji="🛡️"
                size={12}
              />
            </h3>
            <p className={`text-xs font-semibold ${score.tierColor}`}>
              {score.tierLabel} · {score.total} pts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 glass rounded-lg px-2.5 py-1.5">
          <Shield size={12} className="text-primary" />
          <span className="text-xs font-bold text-foreground">{score.tier === "legend" ? "MAX" : `${pct}%`}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-hero-glow rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Signals */}
      <div className="grid grid-cols-3 gap-1.5">
        {score.signals.map(s => (
          <div key={s.label} className="glass rounded-lg px-2 py-1.5 text-center">
            <span className="text-xs">{s.emoji}</span>
            <p className="text-[10px] font-bold text-foreground">{s.value}/{s.max}</p>
            <p className="text-[8px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {score.nextTier && (
        <p className="text-[10px] text-muted-foreground text-center">
          {score.pointsToNext} pts to <span className="font-bold text-foreground">{score.nextTier}</span>
        </p>
      )}
    </div>
  );
};

export default TrustScoreCard;
