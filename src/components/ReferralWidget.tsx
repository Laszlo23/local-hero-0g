import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Check, Users, Trophy } from "lucide-react";
import { getOrCreateReferralCode, getReferralCount } from "@/lib/referrals";
import { shareTemplates } from "@/lib/sharing";

const ReferralWidget = () => {
  const [code, setCode] = useState("");
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getOrCreateReferralCode().then(setCode);
    getReferralCount().then(setCount);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (code) await shareTemplates.referral(code);
  };

  const progress = Math.min(count, 2);
  const badgeUnlocked = count >= 2;

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
          <Users size={16} className="text-primary" />
          Invite Heroes
        </h3>
        {badgeUnlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold"
          >
            <Trophy size={10} /> Recruiter Badge
          </motion.div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Invite 2 friends to unlock the Recruiter badge. Both of you earn +200 HERO points!
      </p>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">{count} of 2 invites</span>
          <span className="text-primary font-bold">{count * 200} pts earned</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(progress / 2) * 100}%` }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          />
        </div>
      </div>

      {/* Code */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-11 px-4 rounded-xl bg-secondary flex items-center">
          <span className="font-mono text-sm font-bold text-foreground tracking-wider">{code}</span>
        </div>
        <button
          onClick={handleCopy}
          className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
        </button>
      </div>

      <button
        onClick={handleShare}
        className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <Share2 size={16} /> Share Invite Link
      </button>
    </div>
  );
};

export default ReferralWidget;
