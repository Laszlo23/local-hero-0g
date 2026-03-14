import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const trigger = useCallback(() => {
    if (sessionStorage.getItem("lh-exit-shown")) return;
    sessionStorage.setItem("lh-exit-shown", "1");
    setShow(true);
  }, []);

  useEffect(() => {
    // Desktop: cursor leaves viewport toward top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && e.relatedTarget === null) {
        trigger();
      }
    };

    // Mobile: 45s idle timeout
    let idleTimer: ReturnType<typeof setTimeout>;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(trigger, 45000);
    };

    document.addEventListener("mouseout", handleMouseLeave);
    window.addEventListener("scroll", resetIdle, { passive: true });
    window.addEventListener("touchstart", resetIdle, { passive: true });
    resetIdle();

    return () => {
      document.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("scroll", resetIdle);
      window.removeEventListener("touchstart", resetIdle);
      clearTimeout(idleTimer);
    };
  }, [trigger]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShow(false)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative glass-card rounded-3xl p-8 sm:p-10 max-w-md w-full text-center overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-hero-yellow/10 blur-[80px] rounded-full" />

          <button
            onClick={() => setShow(false)}
            className="absolute top-4 right-4 text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>

          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-hero-yellow/15 flex items-center justify-center mx-auto">
              <Gift size={32} className="text-hero-yellow" />
            </div>
          </motion.div>

          <h3 className="font-display text-2xl font-bold text-foreground mb-2 relative z-10">
            Wait — you're leaving<br />
            <span className="text-gradient-hero">100 bonus points</span> behind 🎁
          </h3>

          <p className="text-sm text-muted-foreground mb-6 relative z-10 leading-relaxed">
            Sign up now and we'll drop 100 HERO points straight into your account. 
            That's enough for your first mystery reward.
          </p>

          <button
            onClick={() => { setShow(false); navigate("/auth"); }}
            className="group w-full bg-gradient-hero-glow text-primary-foreground py-4 rounded-2xl text-base font-bold hover:opacity-90 transition-all active:scale-[0.97] glow-green flex items-center justify-center gap-2"
          >
            Claim My 100 Points <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[11px] text-muted-foreground/50 mt-4">
            No spam. Unsubscribe anytime. Takes 30 seconds.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
