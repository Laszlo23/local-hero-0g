import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap } from "lucide-react";

interface ComboIndicatorProps {
  combo: number;
  perfectRun: boolean;
}

const ComboIndicator = ({ combo, perfectRun }: ComboIndicatorProps) => {
  if (combo < 2 && !perfectRun) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={combo}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        className="flex items-center gap-1.5"
      >
        {combo >= 2 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-hero-orange/20 border border-hero-orange/30">
            <Flame size={14} className="text-hero-orange" />
            <span className="text-xs font-extrabold text-hero-orange">{combo}x COMBO</span>
          </div>
        )}
        {perfectRun && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-hero-yellow/20 border border-hero-yellow/30">
            <Zap size={14} className="text-hero-yellow" />
            <span className="text-xs font-extrabold text-hero-yellow">PERFECT</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ComboIndicator;
