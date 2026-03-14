import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Coin {
  id: number;
  x: number;
  emoji: string;
  speed: number;
  size: number;
}

const COIN_EMOJIS = ["🪙", "⭐", "💎", "👑", "🏅", "🌟"];

export default function CoinCollectorGame() {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [pops, setPops] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try { return Number(localStorage.getItem("hero-coin-hs") || "0"); } catch { return 0; }
  });
  const nextId = useRef(0);
  const gameActive = useRef(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const startGame = useCallback(() => {
    setScore(0);
    setCombo(0);
    setTimeLeft(30);
    setGameOver(false);
    setCoins([]);
    setPops([]);
    gameActive.current = true;
  }, []);

  // Spawn coins
  useEffect(() => {
    if (!open || gameOver || !gameActive.current) return;
    const interval = setInterval(() => {
      setCoins((prev) => {
        if (prev.length > 10) return prev;
        const coin: Coin = {
          id: nextId.current++,
          x: 5 + Math.random() * 80,
          emoji: COIN_EMOJIS[Math.floor(Math.random() * COIN_EMOJIS.length)],
          speed: 2.5 + Math.random() * 3,
          size: 36 + Math.random() * 16,
        };
        return [...prev, coin];
      });
    }, 600);
    return () => clearInterval(interval);
  }, [open, gameOver]);

  // Timer
  useEffect(() => {
    if (!open || gameOver || !gameActive.current) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          gameActive.current = false;
          setGameOver(true);
          setCoins([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [open, gameOver]);

  // Save high score
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      try { localStorage.setItem("hero-coin-hs", String(score)); } catch {}
    }
  }, [gameOver, score, highScore]);

  const collectCoin = (coin: Coin, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (gameOver) return;

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const gameRect = gameAreaRef.current?.getBoundingClientRect();
    const newCombo = combo + 1;
    const multiplier = Math.min(newCombo, 5);
    const points = 10 * multiplier;

    setCombo(newCombo);
    setScore((s) => s + points);
    setCoins((prev) => prev.filter((c) => c.id !== coin.id));

    // Position pop relative to game area
    const popX = rect.left - (gameRect?.left || 0) + rect.width / 2;
    const popY = rect.top - (gameRect?.top || 0);
    setPops((prev) => [
      ...prev,
      { id: coin.id, x: popX, y: popY, text: `+${points}` },
    ]);
    setTimeout(() => setPops((prev) => prev.filter((p) => p.id !== coin.id)), 800);
  };

  const handleMiss = () => {
    if (combo > 0) setCombo(0);
  };

  const onCoinAnimEnd = (id: number) => {
    setCoins((prev) => prev.filter((c) => c.id !== id));
    if (combo > 0) setCombo(0);
  };

  return (
    <>
      {/* Floating trigger button - mobile optimized */}
      <motion.button
        onClick={() => { setOpen(true); startGame(); }}
        className="fixed bottom-24 right-3 z-40 rounded-2xl px-3 py-2.5 flex items-center gap-2 border border-primary/30 bg-card/90 backdrop-blur-md shadow-lg active:scale-95 transition-transform"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, type: "spring" }}
      >
        <motion.span
          className="text-xl"
          animate={{ y: [0, -4, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🪙
        </motion.span>
        <div className="text-left">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Mini Game</p>
          <p className="text-xs font-semibold text-foreground">Collect Coins</p>
        </div>
      </motion.button>

      {/* Game overlay - full screen on mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95" onClick={() => setOpen(false)} />

            {/* Game area - full height on mobile */}
            <motion.div
              ref={gameAreaRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full max-w-md max-h-[100dvh] sm:max-h-[700px] sm:rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(180deg, hsl(160 20% 8%) 0%, hsl(160 15% 4%) 50%, hsl(152 30% 6%) 100%)",
              }}
              onClick={handleMiss}
            >
              {/* Animated background grid */}
              <div className="absolute inset-0 opacity-[0.06]" style={{
                backgroundImage: "radial-gradient(circle, hsl(152 70% 45%) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }} />

              {/* Ambient glow at top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full opacity-20"
                style={{ background: "radial-gradient(ellipse, hsl(152 70% 45% / 0.4), transparent)" }}
              />

              {/* HUD - top safe area aware */}
              <div className="absolute top-0 left-0 right-0 z-30 pt-[env(safe-area-inset-top,12px)] px-4 pb-2 flex items-center justify-between"
                style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                    <p className="text-[9px] text-white/50 font-bold uppercase">Score</p>
                    <p className="text-xl font-bold text-primary">{score}</p>
                  </div>
                  {combo > 1 && (
                    <motion.div
                      key={combo}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-primary/30"
                    >
                      <p className="text-[9px] text-white/50 font-bold uppercase">Combo</p>
                      <p className="text-xl font-bold text-primary">x{Math.min(combo, 5)}</p>
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center border border-white/10">
                    <p className="text-[9px] text-white/50 font-bold uppercase">Time</p>
                    <p className={`text-xl font-bold ${timeLeft <= 5 ? "text-destructive animate-pulse" : "text-white"}`}>{timeLeft}s</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                    className="bg-black/50 backdrop-blur-sm rounded-xl w-10 h-10 flex items-center justify-center text-white/60 active:bg-white/20 border border-white/10"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Falling coins - large touch targets for mobile */}
              {coins.map((coin) => (
                <motion.div
                  key={coin.id}
                  className="absolute z-20 cursor-pointer select-none touch-manipulation flex items-center justify-center"
                  style={{
                    left: `${coin.x}%`,
                    width: coin.size + 16,
                    height: coin.size + 16,
                    fontSize: coin.size,
                    lineHeight: 1,
                  }}
                  initial={{ y: -80, opacity: 0, rotate: 0, scale: 0.5 }}
                  animate={{ y: "85dvh", opacity: [0, 1, 1, 0.6], rotate: 360, scale: [0.5, 1, 1, 0.8] }}
                  transition={{ duration: coin.speed, ease: "linear" }}
                  onAnimationComplete={() => onCoinAnimEnd(coin.id)}
                  onPointerDown={(e) => collectCoin(coin, e)}
                >
                  <span className="pointer-events-none drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
                    {coin.emoji}
                  </span>
                </motion.div>
              ))}

              {/* Pop score texts - positioned relative to game area */}
              {pops.map((pop) => (
                <motion.div
                  key={pop.id}
                  className="absolute z-50 pointer-events-none font-bold text-primary text-lg"
                  style={{ left: pop.x, top: pop.y }}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -40, scale: 1.5 }}
                  transition={{ duration: 0.6 }}
                >
                  {pop.text}
                </motion.div>
              ))}

              {/* Instruction hint */}
              {!gameOver && timeLeft > 27 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-1/3 left-0 right-0 text-center text-white/40 text-sm font-medium z-10 pointer-events-none"
                >
                  Tap the falling coins! ✨
                </motion.p>
              )}

              {/* Game over screen */}
              <AnimatePresence>
                {gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm px-8"
                  >
                    <motion.span
                      className="text-7xl mb-4"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      🏆
                    </motion.span>
                    <h3 className="text-3xl font-bold text-white mb-2">Time's up!</h3>
                    <p className="text-4xl font-bold text-primary mb-1">{score} pts</p>
                    {score >= highScore && score > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-bold text-primary mb-2"
                      >
                        🎉 New High Score!
                      </motion.p>
                    )}
                    <p className="text-sm text-white/50 mb-8">Best: {highScore} pts</p>

                    <div className="flex gap-3 w-full max-w-xs">
                      <button
                        onClick={(e) => { e.stopPropagation(); startGame(); }}
                        className="flex-1 bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform shadow-[0_0_20px_hsl(152_70%_45%/0.3)]"
                      >
                        Play Again
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                        className="flex-1 bg-white/10 text-white py-4 rounded-2xl font-semibold text-base active:scale-95 transition-transform border border-white/10"
                      >
                        Close
                      </button>
                    </div>

                    <p className="text-xs text-white/30 mt-8 max-w-xs text-center">
                      Imagine earning real HERO points like this — but by helping your community! 🌱
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
