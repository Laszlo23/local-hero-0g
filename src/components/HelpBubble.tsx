import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X } from "lucide-react";

interface HelpBubbleProps {
  tip: string;
  emoji?: string;
  /** Position of the tooltip relative to the icon */
  position?: "top" | "bottom" | "left";
  /** Size of the trigger icon */
  size?: number;
}

const HelpBubble = ({ tip, emoji = "💡", position = "bottom", size = 14 }: HelpBubbleProps) => {
  const [open, setOpen] = useState(false);

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 right-0",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
  };

  return (
    <span className="relative inline-flex items-center">
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(!open);
        }}
        className="text-muted-foreground/40 hover:text-muted-foreground transition-colors focus:outline-none"
        whileTap={{ scale: 0.9 }}
        aria-label="Help"
      >
        <HelpCircle size={size} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Invisible backdrop to close on tap outside */}
            <div
              className="fixed inset-0 z-[90]"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: position === "top" ? 4 : -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute z-[91] w-52 ${positionClasses[position]}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card rounded-xl p-3 shadow-lg border border-border/50">
                <div className="flex items-start gap-2">
                  <span className="text-base shrink-0 mt-0.5">{emoji}</span>
                  <p className="text-[11px] leading-relaxed text-muted-foreground flex-1">{tip}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  className="absolute top-1.5 right-1.5 text-muted-foreground/40 hover:text-muted-foreground"
                >
                  <X size={10} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </span>
  );
};

export default HelpBubble;
