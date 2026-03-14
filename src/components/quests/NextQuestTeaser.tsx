import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";

interface NextQuestTeaserProps {
  title: string;
  chapter: string;
  iconColor: string;
}

const NextQuestTeaser = ({ title, chapter, iconColor }: NextQuestTeaserProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-xl p-3 flex items-center gap-3 mt-2"
    >
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
        <Lock size={14} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Up Next</p>
        <p className="text-xs font-semibold text-foreground truncate">{title}</p>
      </div>
      <ArrowRight size={14} className={iconColor} />
    </motion.div>
  );
};

export default NextQuestTeaser;
