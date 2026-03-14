import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Users, Navigation, Share2, Gift, Sparkles, X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  DiscoveryDrop,
  getActiveDrops,
  getMyClaimedDropIds,
  claimDrop,
  getRarityConfig,
} from "@/lib/discovery-drops";

function useGeo() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);
  return pos;
}

function timeLeft(ends: string) {
  const ms = new Date(ends).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m left`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m left`;
}

function distanceTo(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function DiscoveryDrops() {
  const [drops, setDrops] = useState<DiscoveryDrop[]>([]);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [selected, setSelected] = useState<DiscoveryDrop | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [showShareCard, setShowShareCard] = useState<DiscoveryDrop | null>(null);
  const geo = useGeo();

  const load = useCallback(async () => {
    const [d, c] = await Promise.all([getActiveDrops(), getMyClaimedDropIds()]);
    setDrops(d);
    setClaimed(c);
  }, []);

  useEffect(() => { load(); const i = setInterval(load, 30000); return () => clearInterval(i); }, [load]);

  const handleClaim = async (drop: DiscoveryDrop) => {
    if (!geo) {
      toast({ title: "Location required", description: "Enable location to claim drops.", variant: "destructive" });
      return;
    }
    setClaiming(true);
    const result = await claimDrop(drop, geo.lat, geo.lng);
    setClaiming(false);
    if (result.success) {
      toast({ title: "Drop Claimed!", description: result.message });
      setClaimed((p) => [...p, drop.id]);
      setSelected(null);
      setShowShareCard(drop);
      load();
    } else {
      toast({ title: "Can't claim", description: result.message, variant: "destructive" });
    }
  };

  const shareDrop = (drop: DiscoveryDrop, platform: "twitter" | "farcaster") => {
    const rc = getRarityConfig(drop.rarity as any);
    const text = `🎉 I just found a ${rc.label} Discovery Drop in my city!\n\n${rc.emoji} ${drop.title} — +${drop.reward_value} HERO\n\nFollow @0gLocalHero\n#LocalHero #0GChain\nhttps://localhero.space`;
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
    } else {
      window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-display">Discovery Drops</h1>
          <p className="text-xs text-muted-foreground">
            {geo ? "📍 Location active" : "⏳ Getting location…"} · {drops.length} drops nearby
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {(["common", "rare", "legendary"] as const).map((r) => {
          const rc = getRarityConfig(r);
          return (
            <Badge key={r} variant="outline" className={`${rc.bg} ${rc.color} border shrink-0`}>
              {rc.emoji} {rc.label}
            </Badge>
          );
        })}
      </div>

      {/* Drops grid */}
      {drops.length === 0 ? (
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground">No drops nearby right now.</p>
          <p className="text-xs text-muted-foreground mt-1">Check back soon — new drops appear throughout the day!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {drops.map((drop) => {
            const rc = getRarityConfig(drop.rarity as any);
            const isClaimed = claimed.includes(drop.id);
            const dist = geo ? distanceTo(geo.lat, geo.lng, drop.latitude, drop.longitude) : null;
            const inRange = dist !== null && dist <= 50;
            const claimsLeft = drop.max_claims - drop.current_claims;

            return (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative border rounded-2xl p-4 backdrop-blur-sm cursor-pointer transition-all hover:scale-[1.01] ${rc.bg} ${isClaimed ? "opacity-50" : ""} ${drop.rarity === "legendary" ? "shadow-lg " + rc.glow : ""}`}
                onClick={() => !isClaimed && setSelected(drop)}
              >
                {drop.rarity === "legendary" && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <span className="text-2xl">👑</span>
                  </motion.div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{rc.emoji}</span>
                      <h3 className="font-semibold font-display">{drop.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{drop.description}</p>
                    {drop.sponsor_name && (
                      <p className="text-xs text-muted-foreground mt-1">Sponsored by <span className="text-foreground font-medium">{drop.sponsor_name}</span></p>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className={`font-bold ${rc.color}`}>+{drop.reward_value}</p>
                    <p className="text-[10px] text-muted-foreground">HERO</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeLeft(drop.ends_at)}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{claimsLeft}/{drop.max_claims}</span>
                  {dist !== null && (
                    <span className={`flex items-center gap-1 ${inRange ? "text-primary font-medium" : ""}`}>
                      <Navigation className="w-3 h-3" />
                      {dist < 1000 ? `${Math.round(dist)}m` : `${(dist / 1000).toFixed(1)}km`}
                      {inRange && " ✓"}
                    </span>
                  )}
                  {isClaimed && <Badge variant="outline" className="text-primary border-primary/30 ml-auto">Claimed ✓</Badge>}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Drop detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              className="w-full max-w-lg bg-card border border-border rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const rc = getRarityConfig(selected.rarity as any);
                const dist = geo ? distanceTo(geo.lat, geo.lng, selected.latitude, selected.longitude) : null;
                const inRange = dist !== null && dist <= 50;
                const claimsLeft = selected.max_claims - selected.current_claims;

                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`${rc.bg} ${rc.color} border`}>{rc.emoji} {rc.label}</Badge>
                      <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
                    </div>

                    <h2 className="text-2xl font-bold font-display mb-2">{selected.title}</h2>
                    <p className="text-muted-foreground text-sm mb-4">{selected.description}</p>

                    {selected.sponsor_name && (
                      <div className="bg-muted/50 rounded-xl p-3 mb-4 border border-border">
                        <p className="text-xs text-muted-foreground">Sponsored by</p>
                        <p className="font-semibold">{selected.sponsor_name}</p>
                        {selected.sponsor_reward_description && (
                          <p className="text-sm text-muted-foreground mt-1">{selected.sponsor_reward_description}</p>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="bg-muted/30 rounded-xl p-3 text-center">
                        <Gift className={`w-5 h-5 mx-auto mb-1 ${rc.color}`} />
                        <p className="font-bold">{selected.reward_value}</p>
                        <p className="text-[10px] text-muted-foreground">HERO</p>
                      </div>
                      <div className="bg-muted/30 rounded-xl p-3 text-center">
                        <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                        <p className="font-bold">{claimsLeft}</p>
                        <p className="text-[10px] text-muted-foreground">remaining</p>
                      </div>
                      <div className="bg-muted/30 rounded-xl p-3 text-center">
                        <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                        <p className="font-bold text-sm">{timeLeft(selected.ends_at)}</p>
                        <p className="text-[10px] text-muted-foreground">left</p>
                      </div>
                    </div>

                    {dist !== null && (
                      <p className={`text-sm mb-4 ${inRange ? "text-primary" : "text-muted-foreground"}`}>
                        📍 {dist < 1000 ? `${Math.round(dist)}m away` : `${(dist / 1000).toFixed(1)}km away`}
                        {!inRange && ` — get within ${50}m to claim`}
                        {inRange && " — you're in range!"}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          window.open(`https://maps.google.com/?q=${selected.latitude},${selected.longitude}`, "_blank");
                        }}
                      >
                        <Navigation className="w-4 h-4 mr-1" /> Navigate
                      </Button>
                      <Button
                        className="flex-1"
                        disabled={!inRange || claiming}
                        onClick={() => handleClaim(selected)}
                      >
                        <Trophy className="w-4 h-4 mr-1" /> {claiming ? "Claiming…" : "Claim Reward"}
                      </Button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share card modal */}
      <AnimatePresence>
        {showShareCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowShareCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1 }}
                className="text-5xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-xl font-bold font-display mb-1">Drop Claimed!</h2>
              <p className="text-muted-foreground text-sm mb-2">
                {getRarityConfig(showShareCard.rarity as any).emoji} {showShareCard.title}
              </p>
              <p className="text-2xl font-bold text-primary mb-4">+{showShareCard.reward_value} HERO</p>

              <p className="text-xs text-muted-foreground mb-3">Share your discovery</p>
              <div className="flex gap-2 justify-center">
                <Button size="sm" variant="outline" onClick={() => shareDrop(showShareCard, "twitter")}>
                  𝕏 Post
                </Button>
                <Button size="sm" variant="outline" onClick={() => shareDrop(showShareCard, "farcaster")}>
                  🟣 Farcaster
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="mt-3 text-muted-foreground" onClick={() => setShowShareCard(null)}>
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
