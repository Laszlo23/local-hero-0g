import { useState } from "react";
import { motion } from "framer-motion";
import { TreePine, Users, Coins, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

const ImpactCalculator = () => {
  const [minutes, setMinutes] = useState(15);
  const navigate = useNavigate();

  // Rough estimates per month based on minutes/day
  const trees = Math.round(minutes * 0.4);
  const neighbors = Math.round(minutes * 0.25);
  const points = Math.round(minutes * 160);

  return (
    <div className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-hero-green-glow/8 blur-[80px] rounded-full" />

      <div className="relative z-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-hero-yellow mb-3 block">
          Your Potential Impact
        </span>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          What could <span className="text-gradient-hero">you</span> do in 30 days?
        </h3>
        <p className="text-sm text-muted-foreground mb-8">
          Drag the slider to see your monthly impact
        </p>

        {/* Slider */}
        <div className="mb-10">
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-sm text-muted-foreground">Minutes per day</span>
            <motion.span
              key={minutes}
              initial={{ scale: 1.3, color: "hsl(var(--primary))" }}
              animate={{ scale: 1, color: "hsl(var(--foreground))" }}
              className="font-display text-2xl font-bold"
            >
              {minutes} min
            </motion.span>
          </div>
          <Slider
            value={[minutes]}
            onValueChange={(v) => setMinutes(v[0])}
            min={5}
            max={60}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground/50 mt-1.5">
            <span>5 min</span>
            <span>60 min</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: <TreePine size={20} />, value: trees, label: "Trees planted", color: "text-primary" },
            { icon: <Users size={20} />, value: neighbors, label: "Neighbors helped", color: "text-hero-yellow" },
            { icon: <Coins size={20} />, value: points.toLocaleString(), label: "HERO points", color: "text-primary" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-4 text-center"
              initial={false}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 0.3 }}
            >
              <div className={`${stat.color} flex justify-center mb-2`}>{stat.icon}</div>
              <motion.p
                key={String(stat.value)}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-display text-xl sm:text-2xl font-bold text-foreground"
              >
                {stat.value}
              </motion.p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => navigate("/auth")}
          className="group w-full bg-gradient-hero-glow text-primary-foreground py-4 rounded-2xl text-base font-bold hover:opacity-90 transition-all active:scale-[0.97] glow-green flex items-center justify-center gap-2"
        >
          Start My Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ImpactCalculator;
