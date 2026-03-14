import { motion, AnimatePresence } from "framer-motion";

interface FlyingPointsProps {
  points: { id: number; value: number; x: number }[];
}

const FlyingPoints = ({ points }: FlyingPointsProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {points.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, y: 400, x: p.x, scale: 1 }}
            animate={{ opacity: 0, y: 100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute text-hero-yellow font-extrabold text-2xl drop-shadow-[0_0_12px_hsl(var(--hero-yellow)/0.8)]"
          >
            +{p.value}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FlyingPoints;
