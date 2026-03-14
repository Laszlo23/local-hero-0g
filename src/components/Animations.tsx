import { motion } from "framer-motion";
import { ReactNode } from "react";

// Staggered children container
export const StaggerContainer = ({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.07, delayChildren: delay } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Fade-up item for stagger
export const FadeUpItem = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20, scale: 0.97 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Floating ambient particle
export const FloatingParticle = ({ size = 4, color = "primary", x = 0, y = 0, delay = 0, duration = 4 }: {
  size?: number; color?: string; x?: number; y?: number; delay?: number; duration?: number;
}) => (
  <motion.div
    className={`absolute rounded-full bg-${color}/20 pointer-events-none`}
    style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -20, 0],
      x: [0, 8, -5, 0],
      opacity: [0.3, 0.7, 0.3],
      scale: [1, 1.3, 1],
    }}
    transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

// Breathing glow effect
export const BreathingGlow = ({ className = "", color = "primary" }: { className?: string; color?: string }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${className}`}
    animate={{
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.1, 1],
    }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    style={{ background: `radial-gradient(circle, hsl(var(--${color}) / 0.2), transparent)` }}
  />
);

// Shimmer effect for loading/attention
export const ShimmerBar = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`relative overflow-hidden ${className}`}
    style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.1), transparent)", backgroundSize: "200% 100%" }}
    animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
  />
);

// Scale-on-tap wrapper
export const TapScale = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }} className={className}>
    {children}
  </motion.div>
);

// Counter animation
export const AnimatedCounter = ({ value, className = "" }: { value: number; className?: string }) => (
  <motion.span
    key={value}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={className}
  >
    {value.toLocaleString()}
  </motion.span>
);

// Pulse ring for CTAs
export const PulseRing = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`absolute inset-0 rounded-2xl border-2 border-primary/30 pointer-events-none ${className}`}
    animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0, 0.5] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  />
);
