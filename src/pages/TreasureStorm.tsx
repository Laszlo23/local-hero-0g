import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, MapPin, Navigation, Sparkles, X, Zap, Clock, Target, Camera, Map, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaggerContainer, FadeUpItem } from "@/components/Animations";
import StormMap from "@/components/StormMap";
import arChest from "@/assets/ar-chest.png";
import {
  Storm, StormDrop, getActiveStorms, getStormDrops, claimStormDrop, getRarityConfig, isWithinStormZone, isStormActive, generateDropPositions,
} from "@/lib/storms";
import { awardPoints } from "@/lib/points";
import { toast } from "@/hooks/use-toast";

const TreasureStorm = () => {
  const navigate = useNavigate();
  const [storms, setStorms] = useState<Storm[]>([]);
  const [activeStorm, setActiveStorm] = useState<Storm | null>(null);
  const [drops, setDrops] = useState<StormDrop[]>([]);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [arMode, setArMode] = useState(false);
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [selectedDrop, setSelectedDrop] = useState<StormDrop | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [timeLeft, setTimeLeft] = useState("");

  const demoGeneratedRef = useRef(false);

  // Fetch real storms
  useEffect(() => {
    getActiveStorms().then(setStorms);
  }, []);

  // Watch user position
  useEffect(() => {
    const watcher = navigator.geolocation.watchPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => console.warn("Geolocation denied"),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  // Auto-generate demo storm at user's location if no real storms exist
  useEffect(() => {
    if (demoGeneratedRef.current || !userPos) return;
    // Wait for storms to load — if there are real ones, skip demo
    if (storms.length > 0) return;

    demoGeneratedRef.current = true;
    const demoStorm: Storm = {
      id: "demo-storm",
      name: "Preview Storm ⚡",
      center_lat: userPos.lat,
      center_lng: userPos.lng,
      radius: 150,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
      status: "active",
      created_at: new Date().toISOString(),
    };
    setStorms([demoStorm]);
    setActiveStorm(demoStorm);

    // Generate local demo drops
    const positions = generateDropPositions(demoStorm, 35);
    const demoDrops: StormDrop[] = positions.map((p, i) => ({
      id: `demo-drop-${i}`,
      storm_id: "demo-storm",
      lat: p.lat,
      lng: p.lng,
      rarity: p.rarity,
      reward_value: p.reward_value,
      claimed: false,
      claimed_by: null,
      claimed_at: null,
    }));
    setDrops(demoDrops);
  }, [userPos, storms]);

  // Load drops when a real (non-demo) storm is selected
  useEffect(() => {
    if (!activeStorm || activeStorm.id === "demo-storm") return;
    getStormDrops(activeStorm.id).then((d) => {
      setDrops(d);
      const alreadyClaimed = new Set(d.filter((x) => x.claimed).map((x) => x.id));
      setClaimedIds(alreadyClaimed);
    });
  }, [activeStorm]);

  // Countdown timer
  useEffect(() => {
    if (!activeStorm) return;
    const interval = setInterval(() => {
      const end = new Date(activeStorm.end_time).getTime();
      const now = Date.now();
      const diff = Math.max(0, end - now);
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
      if (diff <= 0) {
        setActiveStorm(null);
        setArMode(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeStorm]);

  // Camera for AR mode
  useEffect(() => {
    if (arMode) startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [arMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      console.warn("Camera denied");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const handleClaim = async (drop: StormDrop) => {
    if (!activeStorm || !userPos || claiming) return;
    setClaiming(true);

    // Demo mode: skip distance check & DB, just award locally
    if (activeStorm.id === "demo-storm") {
      await awardPoints(drop.reward_value, `Storm Preview: ${drop.rarity}`);
      setClaimedIds((prev) => new Set([...prev, drop.id]));
      setTotalClaimed((c) => c + 1);
      setTotalEarned((e) => e + drop.reward_value);
      setSelectedDrop(null);
      setClaiming(false);
      toast({ title: `🎉 +${drop.reward_value} HERO` });
      return;
    }

    const result = await claimStormDrop(drop, userPos.lat, userPos.lng, activeStorm);
    setClaiming(false);

    if (result.success) {
      setClaimedIds((prev) => new Set([...prev, drop.id]));
      setTotalClaimed((c) => c + 1);
      setTotalEarned((e) => e + drop.reward_value);
      setSelectedDrop(null);
      toast({ title: result.message });
    } else {
      toast({ title: "Can't claim", description: result.message, variant: "destructive" });
    }
  };

  const unclaimedDrops = drops.filter((d) => !claimedIds.has(d.id));
  const nearbyDrops = userPos
    ? unclaimedDrops.filter((d) => {
        const R = 6371000;
        const dLat = ((d.lat - userPos.lat) * Math.PI) / 180;
        const dLon = ((d.lng - userPos.lng) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos((userPos.lat * Math.PI) / 180) * Math.cos((d.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
        const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return dist <= 100;
      })
    : [];

  const inZone = userPos && activeStorm ? isWithinStormZone(userPos.lat, userPos.lng, activeStorm) : false;

  // ---- AR MODE ----
  if (arMode && activeStorm) {
    return (
      <div className="fixed inset-0 bg-background z-50 max-w-[430px] mx-auto">
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
        {!cameraActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(160_20%_8%)] via-[hsl(200_15%_12%)] to-[hsl(160_10%_6%)]" />
        )}
        {cameraActive && <div className="absolute inset-0 bg-background/20" />}

        {/* Corner brackets */}
        <div className="absolute inset-4 pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg border-hero-yellow/60" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg border-hero-yellow/60" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg border-hero-yellow/60" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-lg border-hero-yellow/60" />
        </div>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setArMode(false)} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-foreground">
              <ChevronLeft size={20} />
            </button>
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2 border border-hero-yellow/30">
              <div className="w-2 h-2 rounded-full animate-pulse bg-hero-yellow" />
              <span className="text-xs font-semibold text-foreground">⚡ Storm Hunt</span>
            </div>
            <div className="glass rounded-full px-3 py-2 flex items-center gap-1.5">
              <Clock size={12} className="text-hero-yellow" />
              <span className="text-xs font-bold text-hero-yellow">{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* AR treasure chests */}
        {nearbyDrops.slice(0, 8).map((drop, i) => {
          const config = getRarityConfig(drop.rarity as any);
          const x = 15 + ((i * 37 + i * i * 13) % 70);
          const y = 20 + ((i * 29 + i * 7) % 50);
          return (
            <button
              key={drop.id}
              onClick={() => setSelectedDrop(drop)}
              className="absolute z-10 group"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                animation: `float ${3 + (i % 3) * 0.5}s ease-in-out infinite`,
              }}
            >
              <div className="relative">
                <div className={`absolute inset-0 blur-[20px] rounded-full scale-150 ${config.bg}`} />
                <img
                  src={arChest}
                  alt="Treasure"
                  className={`w-14 h-14 relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform ${config.glow}`}
                />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">{config.emoji}</div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 glass rounded-full px-2 py-0.5 whitespace-nowrap">
                  <span className={`text-[9px] font-bold ${config.color}`}>+{drop.reward_value}</span>
                </div>
              </div>
            </button>
          );
        })}

        {/* Bottom HUD */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 space-y-3">
          <div className="glass-card rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-hero-yellow/10 flex items-center justify-center">
              <Target size={18} className="text-hero-yellow" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">{nearbyDrops.length} chests nearby</p>
              <p className="text-[10px] text-muted-foreground">Tap a chest to claim it</p>
            </div>
            <div className="flex items-center gap-1 bg-hero-yellow/10 px-2 py-1 rounded-full">
              <Sparkles size={10} className="text-hero-yellow" />
              <span className="text-[10px] font-bold text-hero-yellow">{totalClaimed} claimed</span>
            </div>
          </div>
        </div>

        {/* Claim Modal */}
        <AnimatePresence>
          {selectedDrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex items-end justify-center bg-background/60 backdrop-blur-sm"
              onClick={() => setSelectedDrop(null)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="w-full p-4"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const config = getRarityConfig(selectedDrop.rarity as any);
                  return (
                    <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
                      <div className={`absolute -top-8 right-4 w-32 h-32 blur-[40px] rounded-full ${config.bg}`} />
                      <button onClick={() => setSelectedDrop(null)} className="absolute top-4 right-4 w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground">
                        <X size={16} />
                      </button>
                      <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="relative">
                          <div className={`absolute inset-0 blur-[16px] rounded-full ${config.bg}`} />
                          <img src={arChest} alt="Chest" className={`w-20 h-20 relative z-10 ${config.glow}`} />
                        </div>
                        <div>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${config.color}`}>
                            {config.emoji} {config.label} Chest
                          </span>
                          <h3 className="font-display text-xl font-bold text-foreground">Treasure Chest</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Zap size={12} className="text-accent" />
                            <span className="text-sm font-bold text-accent">+{selectedDrop.reward_value} HERO</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-5 relative z-10">
                        Open this treasure chest to claim your reward!
                      </p>
                      <button
                        onClick={() => handleClaim(selectedDrop)}
                        disabled={claiming}
                        className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all relative z-10 disabled:opacity-50"
                      >
                        {claiming ? "Opening..." : "Open Chest"}
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ---- MAP / LIST MODE ----
  return (
    <div className="min-h-screen bg-background max-w-[430px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/app")} className="w-9 h-9 rounded-xl glass flex items-center justify-center text-foreground">
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-lg font-bold text-foreground">⚡ Treasure Storm</h1>
            <p className="text-[10px] text-muted-foreground">Find & claim AR treasure chests</p>
          </div>
          {totalEarned > 0 && (
            <div className="flex items-center gap-1 bg-hero-yellow/10 px-3 py-1.5 rounded-full">
              <Sparkles size={12} className="text-hero-yellow" />
              <span className="text-xs font-bold text-hero-yellow">+{totalEarned}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Location status */}
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userPos ? "bg-primary/10" : "bg-destructive/10"}`}>
            <Navigation size={18} className={userPos ? "text-primary" : "text-destructive"} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {userPos ? "Location active" : "Waiting for location..."}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {userPos ? `${userPos.lat.toFixed(4)}, ${userPos.lng.toFixed(4)}` : "Enable GPS to find storms"}
            </p>
          </div>
          {userPos && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
        </div>

        {/* Active storms */}
        {storms.length === 0 ? (
          <StaggerContainer className="space-y-4">
            <FadeUpItem>
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">⛈️</div>
                <h2 className="font-display text-lg font-bold text-foreground mb-2">No Active Storms</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Treasure storms appear randomly! Check back soon or explore Discovery Drops in the meantime.
                </p>
                <Button variant="outline" onClick={() => navigate("/app/discovery")} className="rounded-xl">
                  <MapPin size={14} /> Discovery Drops
                </Button>
              </div>
            </FadeUpItem>

            {/* How it works */}
            <FadeUpItem>
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-display text-sm font-bold text-foreground mb-3">How Treasure Storms Work</h3>
                <div className="space-y-3">
                  {[
                    { icon: "⚡", title: "Storm Appears", desc: "A zone fills with 20–50 treasure chests for 10–30 minutes" },
                    { icon: "🗺️", title: "Enter the Zone", desc: "Walk into the storm radius to see nearby chests" },
                    { icon: "📸", title: "Open AR Hunt", desc: "Use your camera to find floating treasure chests" },
                    { icon: "🎉", title: "Claim Rewards", desc: "Tap chests to open them — common, rare & legendary!" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="text-xl">{step.icon}</div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{step.title}</p>
                        <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUpItem>

            {/* Rarity guide */}
            <FadeUpItem>
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-display text-sm font-bold text-foreground mb-3">Chest Rarities</h3>
                <div className="space-y-2">
                  {[
                    { emoji: "📦", label: "Common", value: "10 HERO", color: "text-primary", pct: "~75%" },
                    { emoji: "💎", label: "Rare", value: "50 HERO", color: "text-purple-400", pct: "~20%" },
                    { emoji: "👑", label: "Legendary", value: "200 HERO", color: "text-hero-yellow", pct: "~5%" },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-3 glass rounded-xl p-2.5">
                      <span className="text-lg">{r.emoji}</span>
                      <div className="flex-1">
                        <span className={`text-xs font-bold ${r.color}`}>{r.label}</span>
                        <span className="text-[10px] text-muted-foreground ml-2">{r.pct}</span>
                      </div>
                      <span className="text-xs font-bold text-foreground">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUpItem>
          </StaggerContainer>
        ) : (
          <StaggerContainer className="space-y-4">
            {storms.map((storm) => {
              const stormActive = isStormActive(storm);
              const userInZone = userPos ? isWithinStormZone(userPos.lat, userPos.lng, storm) : false;
              const endTime = new Date(storm.end_time);
              const minsLeft = Math.max(0, Math.round((endTime.getTime() - Date.now()) / 60000));

              return (
                <FadeUpItem key={storm.id}>
                  <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-hero-yellow/10 blur-[30px] rounded-full" />
                    <div className="flex items-start gap-3 mb-4 relative z-10">
                      <div className="text-3xl">⛈️</div>
                      <div className="flex-1">
                        <h3 className="font-display text-base font-bold text-foreground">{storm.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={10} className="text-hero-yellow" />
                          <span className="text-[10px] text-hero-yellow font-semibold">{minsLeft} min left</span>
                          <span className="text-[10px] text-muted-foreground">• {storm.radius}m radius</span>
                        </div>
                      </div>
                      {userInZone && (
                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          <span className="text-[9px] font-bold text-primary">IN ZONE</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 relative z-10">
                      <Button
                        onClick={() => { setActiveStorm(storm); setViewMode("map"); }}
                        variant="outline"
                        className="flex-1 rounded-xl text-xs"
                      >
                        <Map size={12} /> View Map
                      </Button>
                      <Button
                        onClick={() => { setActiveStorm(storm); setArMode(true); }}
                        disabled={!userInZone}
                        className="flex-1 rounded-xl text-xs bg-gradient-hero-glow text-primary-foreground"
                      >
                        <Camera size={12} /> AR Hunt
                      </Button>
                    </div>
                    {!userInZone && (
                      <p className="text-[9px] text-muted-foreground mt-2 text-center relative z-10">
                        Move closer to the storm zone to start hunting
                      </p>
                    )}
                  </div>
                </FadeUpItem>
              );
            })}
          </StaggerContainer>
        )}

        {/* Active storm: map + drop list */}
        {activeStorm && !arMode && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-foreground">
                {activeStorm.name}
              </h3>
              <button onClick={() => setActiveStorm(null)} className="text-xs text-muted-foreground">
                Close
              </button>
            </div>

            <div className="glass-card rounded-2xl p-3 flex items-center gap-3">
              <Clock size={14} className="text-hero-yellow" />
              <span className="text-xs font-bold text-hero-yellow">{timeLeft} remaining</span>
              <div className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {unclaimedDrops.length}/{drops.length} available
              </span>
            </div>

            {/* View toggle */}
            <div className="flex gap-1 glass rounded-xl p-1">
              <button
                onClick={() => setViewMode("map")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "map" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                <Map size={12} /> Map
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                <List size={12} /> List
              </button>
            </div>

            {/* Map view */}
            {viewMode === "map" && (
              <StormMap
                storm={activeStorm}
                drops={drops}
                claimedIds={claimedIds}
                userPos={userPos}
                onDropSelect={setSelectedDrop}
              />
            )}

            {/* List view */}
            {viewMode === "list" && (
              <div className="grid grid-cols-2 gap-2">
                {drops.map((drop) => {
                  const config = getRarityConfig(drop.rarity as any);
                  const isClaimed = claimedIds.has(drop.id);
                  return (
                    <button
                      key={drop.id}
                      onClick={() => !isClaimed && setSelectedDrop(drop)}
                      className={`glass rounded-xl p-3 text-center transition-opacity ${isClaimed ? "opacity-40" : "hover:ring-1 hover:ring-primary/30"}`}
                      disabled={isClaimed}
                    >
                      <div className="text-2xl mb-1">{isClaimed ? "✅" : config.emoji}</div>
                      <p className={`text-[10px] font-bold ${isClaimed ? "text-muted-foreground" : config.color}`}>
                        {config.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {isClaimed ? "Claimed" : `+${drop.reward_value} HERO`}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* AR Hunt button */}
            <Button
              onClick={() => setArMode(true)}
              className="w-full rounded-xl bg-gradient-hero-glow text-primary-foreground"
            >
              <Camera size={14} /> Open AR Hunt
            </Button>
          </motion.div>
        )}

        {/* Claim modal (map/list mode) */}
        <AnimatePresence>
          {selectedDrop && !arMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm"
              onClick={() => setSelectedDrop(null)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="w-full max-w-[430px] p-4"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const config = getRarityConfig(selectedDrop.rarity as any);
                  return (
                    <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
                      <div className={`absolute -top-8 right-4 w-32 h-32 blur-[40px] rounded-full ${config.bg}`} />
                      <button onClick={() => setSelectedDrop(null)} className="absolute top-4 right-4 w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground">
                        <X size={16} />
                      </button>
                      <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="relative">
                          <div className={`absolute inset-0 blur-[16px] rounded-full ${config.bg}`} />
                          <img src={arChest} alt="Chest" className={`w-20 h-20 relative z-10 ${config.glow}`} />
                        </div>
                        <div>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${config.color}`}>
                            {config.emoji} {config.label} Chest
                          </span>
                          <h3 className="font-display text-xl font-bold text-foreground">Treasure Chest</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Zap size={12} className="text-accent" />
                            <span className="text-sm font-bold text-accent">+{selectedDrop.reward_value} HERO</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-5 relative z-10">
                        Open this treasure chest to claim your reward!
                      </p>
                      <button
                        onClick={() => handleClaim(selectedDrop)}
                        disabled={claiming}
                        className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all relative z-10 disabled:opacity-50"
                      >
                        {claiming ? "Opening..." : "Open Chest"}
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TreasureStorm;
