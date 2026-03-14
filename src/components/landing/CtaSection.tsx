import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Compass, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroParallaxCta from "@/assets/hero-parallax-cta.jpg";

const FadeIn = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
];

const CtaSection = ({ smoothScroll }: { smoothScroll: (href: string) => void }) => {
  const navigate = useNavigate();
  const ctaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: ctaProgress } = useScroll({ target: ctaRef, offset: ["start end", "end start"] });
  const bgY = useTransform(ctaProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(ctaProgress, [0, 1], ["0%", "-10%"]);
  const overlayOpacity = useTransform(ctaProgress, [0, 0.5, 1], [0.7, 0.55, 0.7]);

  return (
    <section ref={ctaRef} className="relative min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden" aria-label="Call to action">
      <motion.div className="absolute inset-0 -top-[15%] -bottom-[15%]" style={{ y: bgY }}>
        <img src={heroParallaxCta} alt="Community of heroes making a difference together" className="w-full h-full object-cover" loading="lazy" />
      </motion.div>
      <motion.div className="absolute inset-0 bg-background" style={{ opacity: overlayOpacity }} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      <motion.div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-center" style={{ y: textY }}>
        <FadeIn>
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-8">
            <Shield size={14} className="text-hero-yellow" />
            <span className="text-xs font-semibold text-foreground tracking-wide">Not all heroes wear capes</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-[4.5rem] font-bold leading-[1.05] mb-6 tracking-tight">
            <span className="text-gradient-white">Everyone</span>
            <span className="text-gradient-hero"> Is </span>
            <span className="text-gradient-white">a Hero</span>
          </h2>

          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-6 leading-relaxed">
            The parent who bikes to school. The student who picks up litter. The neighbor who plants a tree. 
            <span className="text-foreground font-medium"> You don't need superpowers — just show up.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {["🌱 Plant", "🧹 Clean", "🚶 Walk", "📚 Teach", "🤝 Help", "🚴 Ride"].map((action, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="glass-card rounded-full px-4 py-2 text-sm font-semibold text-foreground"
              >
                {action}
              </motion.span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <motion.button
              onClick={() => navigate("/auth")}
              className="group bg-gradient-hero-glow text-primary-foreground px-10 py-5 rounded-2xl text-lg font-bold glow-green flex items-center justify-center gap-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Your Hero Journey <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <button onClick={() => smoothScroll("#how-it-works")} className="glass-card px-8 py-4 rounded-2xl text-base font-semibold text-foreground hover:border-primary/30 transition-all flex items-center gap-2">
              <Compass size={16} className="text-primary" /> See How It Works
            </button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <motion.img
                  key={i}
                  src={src}
                  alt={`Community hero ${i + 1}`}
                  className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  loading="lazy"
                  width={40}
                  height={40}
                />
              ))}
            </div>
            <p className="text-sm text-foreground/80">
              <span className="font-bold text-foreground">12,000+</span> everyday heroes and counting
            </p>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">Free to play · Real rewards · Real impact</p>
        </FadeIn>
      </motion.div>
    </section>
  );
};

export default CtaSection;
