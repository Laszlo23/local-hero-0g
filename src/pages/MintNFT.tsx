import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Shield, Sparkles, Zap, Check, ExternalLink, Share2, ChevronLeft, Fingerprint, Lock, Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";
import nftPatch from "@/assets/nft-first-patch.png";

const nftTiers = [
  { id: "soulbound", name: "Soulbound Hero ID", type: "Soulbound (ERC-5192)", desc: "Your permanent on-chain identity. Cannot be sold or transferred.", icon: <Fingerprint size={20} />, color: "from-emerald-500/20 to-cyan-500/20", iconColor: "text-emerald-400", perks: ["Permanent reputation", "Cross-chain identity", "Mini-game access"] },
  { id: "achievement", name: "First Hero Patch", type: "Achievement NFT", desc: "Earned by completing your first 5 quests. Tradeable.", icon: <Shield size={20} />, color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400", perks: ["Bonus quest rewards", "Exclusive events", "Governance voting"] },
  { id: "legendary", name: "Carbon Guardian", type: "Legendary NFT", desc: "Given to top carbon credit contributors. Ultra rare.", icon: <Gem size={20} />, color: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-400", perks: ["2x mining rewards", "DAO council seat", "Partner game skins"] },
];

const MintNFT = () => {
  const navigate = useNavigate();
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [txHash] = useState("0x8f3a...7b2e");

  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ["#22c55e", "#facc15", "#f97316"] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ["#22c55e", "#facc15", "#a855f7"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    setTimeout(() => {
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 }, colors: ["#22c55e", "#facc15", "#f97316", "#a855f7", "#06b6d4"] });
    }, 500);
  }, []);

  const handleMint = () => {
    setMinting(true);
    setTimeout(() => {
      setMinting(false);
      setMinted(true);
      fireConfetti();
    }, 3000);
  };

  const selected = nftTiers.find((n) => n.id === selectedNFT);

  return (
    <div className="px-5 pt-12 pb-8 space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/app/profile")} className="w-9 h-9 rounded-xl glass flex items-center justify-center text-foreground">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Mint NFT</h1>
          <p className="text-xs text-muted-foreground">Claim your on-chain achievement</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!minted ? (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* NFT Cards */}
            {nftTiers.map((nft) => (
              <button
                key={nft.id}
                onClick={() => setSelectedNFT(nft.id)}
                className={`w-full glass-card rounded-2xl p-5 text-left transition-all active:scale-[0.98] ${
                  selectedNFT === nft.id ? "border-primary/50 glow-green" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${nft.color} flex items-center justify-center ${nft.iconColor} shrink-0`}>
                    {nft.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-sm text-foreground">{nft.name}</h3>
                      {nft.id === "soulbound" && <Lock size={10} className="text-primary" />}
                    </div>
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{nft.type}</span>
                    <p className="text-xs text-muted-foreground mt-2">{nft.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {nft.perks.map((perk) => (
                        <span key={perk} className="text-[9px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{perk}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {/* Smart Contract Info */}
            <div className="glass-card rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Lock size={12} className="text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Smart Contract</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Contract</span>
                <span className="font-mono text-xs text-foreground">0x1a2B...3c4D</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Network</span>
                <span className="text-xs text-foreground font-semibold">0G Chain</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Standard</span>
                <span className="text-xs text-foreground font-semibold">{selected?.id === "soulbound" ? "ERC-5192" : "ERC-721"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Gas Fee</span>
                <span className="text-xs text-primary font-bold">Free (Sponsored)</span>
              </div>
            </div>

            <button
              onClick={handleMint}
              disabled={!selectedNFT || minting}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                selectedNFT && !minting ? "bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98]" : "bg-secondary text-muted-foreground"
              }`}
            >
              {minting ? (
                <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Minting on 0G Chain...</>
              ) : (
                <><Sparkles size={18} /> Mint NFT</>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div key="minted" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5 text-center">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 1, bounce: 0.4 }} className="relative inline-block">
              <div className="absolute inset-0 bg-hero-green-glow/30 blur-[50px] rounded-full scale-150" />
              <img src={nftPatch} alt="NFT" className="w-40 h-40 relative z-10 mx-auto drop-shadow-[0_0_30px_hsl(var(--hero-green-glow)/0.5)]" />
            </motion.div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-2">
                <Check size={10} /> Successfully Minted
              </div>
              <h2 className="font-display text-2xl font-bold text-gradient-hero mb-1">{selected?.name}</h2>
              <p className="text-sm text-muted-foreground">{selected?.type}</p>
            </div>

            <div className="glass-card rounded-xl p-4 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Transaction</span>
                <span className="font-mono text-xs text-primary flex items-center gap-1">{txHash} <ExternalLink size={10} /></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Token ID</span>
                <span className="text-xs font-bold text-foreground">#4,207</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Network</span>
                <span className="text-xs font-bold text-foreground">0G Chain</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-xl font-bold text-sm glass text-foreground flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                <Share2 size={14} /> Share
              </button>
              <button onClick={() => navigate("/app/profile")} className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all">
                View Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MintNFT;
