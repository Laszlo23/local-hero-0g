import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ExternalLink, Shield, Lock, Coins, Zap, TrendingUp, FileCode, Eye, ArrowUpRight, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";

const contracts = [
  {
    name: "$HERO Token",
    address: "0x1a2B...3c4D",
    type: "ERC-20",
    status: "active",
    icon: <Coins size={20} />,
    color: "from-emerald-500/20 to-cyan-500/20",
    iconColor: "text-emerald-400",
    stats: [
      { label: "Total Supply", value: "100,000,000" },
      { label: "Circulating", value: "12,450,000" },
      { label: "Holders", value: "8,234" },
      { label: "Price", value: "$0.042" },
    ],
  },
  {
    name: "Soulbound Registry",
    address: "0x5e6F...7g8H",
    type: "ERC-5192",
    status: "active",
    icon: <Shield size={20} />,
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
    stats: [
      { label: "Total Minted", value: "8,234" },
      { label: "Active IDs", value: "7,891" },
      { label: "Avg Level", value: "7.2" },
      { label: "Network", value: "0G Chain" },
    ],
  },
  {
    name: "Carbon Mining Pool",
    address: "0x9i0J...1k2L",
    type: "Custom",
    status: "active",
    icon: <Zap size={20} />,
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
    stats: [
      { label: "Credits Locked", value: "45,200" },
      { label: "BTC Mined", value: "0.847" },
      { label: "Hashrate", value: "12.4 TH/s" },
      { label: "APY", value: "~8.2%" },
    ],
  },
  {
    name: "Quest Escrow",
    address: "0x3m4N...5o6P",
    type: "Custom",
    status: "active",
    icon: <Lock size={20} />,
    color: "from-rose-500/20 to-red-500/20",
    iconColor: "text-rose-400",
    stats: [
      { label: "Active Quests", value: "1,204" },
      { label: "Total Funded", value: "$82,400" },
      { label: "Completed", value: "34,567" },
      { label: "Avg Reward", value: "65 HERO" },
    ],
  },
  {
    name: "Liquidity Lock",
    address: "0x7q8R...9s0T",
    type: "TimeLock",
    status: "locked",
    icon: <Droplets size={20} />,
    color: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
    stats: [
      { label: "Locked Until", value: "2030" },
      { label: "TVL", value: "$2.4M" },
      { label: "Lock Type", value: "Immutable" },
      { label: "Renounced", value: "Yes ✓" },
    ],
  },
];

const Contracts = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="px-5 pt-12 pb-8 space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/app/profile")} className="w-9 h-9 rounded-xl glass flex items-center justify-center text-foreground">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Smart Contracts</h1>
          <p className="text-xs text-muted-foreground">On-chain infrastructure on 0G Chain</p>
        </div>
      </div>

      {/* Network Status */}
      <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        <div className="flex-1">
          <p className="text-xs font-bold text-foreground">0G Chain — Mainnet</p>
          <p className="text-[10px] text-muted-foreground">All contracts verified & audited</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
          <Shield size={10} /> Unruggable
        </div>
      </div>

      {/* Protocol Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: "TVL", value: "$2.4M", icon: <TrendingUp size={14} /> },
          { label: "Users", value: "8,234", icon: <Shield size={14} /> },
          { label: "Txns", value: "142K", icon: <FileCode size={14} /> },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-3 text-center">
            <div className="text-primary mx-auto mb-1">{s.icon}</div>
            <p className="text-sm font-bold text-foreground">{s.value}</p>
            <p className="text-[9px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Contract Cards */}
      <div className="space-y-3">
        {contracts.map((c, i) => (
          <motion.div key={i} layout className="glass-card rounded-2xl overflow-hidden">
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full p-4 flex items-center gap-3 text-left">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center ${c.iconColor} shrink-0`}>
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-foreground">{c.name}</p>
                  {c.status === "locked" && <Lock size={10} className="text-hero-yellow" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[10px] text-muted-foreground">{c.address}</span>
                  <span className="text-[9px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{c.type}</span>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${c.status === "active" ? "bg-primary" : "bg-hero-yellow"}`} />
            </button>

            <AnimatePresence>
              {expanded === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {c.stats.map((s) => (
                        <div key={s.label} className="glass rounded-lg p-2.5">
                          <p className="text-[9px] text-muted-foreground">{s.label}</p>
                          <p className="text-xs font-bold text-foreground">{s.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2.5 rounded-lg text-xs font-bold glass text-foreground flex items-center justify-center gap-1.5">
                        <Eye size={12} /> View
                      </button>
                      <button className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-primary/10 text-primary flex items-center justify-center gap-1.5">
                        <ExternalLink size={12} /> Explorer
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Contracts;
