import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Focus, MapPin, Navigation, Scan, Sparkles, X, Zap, QrCode, Check, Gift, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import arOverlay from "@/assets/ar-overlay.png";
import arChest from "@/assets/ar-chest.png";
import arTree from "@/assets/ar-tree.png";
import arBook from "@/assets/ar-book.png";
import ogLogo from "@/assets/0g-logo.png";
import { awardPoints } from "@/lib/points";
import { claimDrop } from "@/lib/nft-drops";

const arObjects = [
  { id: 1, name: "Treasure Chest", img: arChest, points: 100, type: "Treasure", x: 55, y: 35 },
  { id: 2, name: "Magic Tree", img: arTree, points: 75, type: "Plant Quest", x: 20, y: 55 },
  { id: 3, name: "Knowledge Book", img: arBook, points: 50, type: "Learn Quest", x: 75, y: 60 },
];

const ARQuest = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [selectedObject, setSelectedObject] = useState<typeof arObjects[0] | null>(null);
  const [collected, setCollected] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [qrMode, setQrMode] = useState(false);
  const [scannedQuest, setScannedQuest] = useState<{ title: string; points: number; description: string; isDrop?: boolean; dropContent?: string } | null>(null);
  const [qrCollected, setQrCollected] = useState<string[]>([]);

  useEffect(() => {
    if (!qrMode) startCamera();
    return () => stopCamera();
  }, [qrMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera access denied:", err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const handleCollect = async (obj: typeof arObjects[0]) => {
    setCollected([...collected, obj.id]);
    setSelectedObject(null);
    await awardPoints(obj.points, `AR Quest: ${obj.name}`);
  };

  const handleQrResult = async (text: string) => {
    if (qrCollected.includes(text)) return;
    
    // Check if it's an NFT drop
    if (text.startsWith("HERO-DROP:")) {
      const dropCode = text.replace("HERO-DROP:", "");
      const result = await claimDrop(dropCode);
      if (result.success && result.drop) {
        setScannedQuest({
          title: result.drop.title,
          points: result.drop.token_amount || 50,
          description: result.message,
          isDrop: true,
          dropContent: result.content,
        });
        setQrCollected((prev) => [...prev, text]);
      } else {
        setScannedQuest({
          title: "Drop Error",
          points: 0,
          description: result.message,
        });
      }
      return;
    }

    // Parse HERO quest QR codes
    let quest = parseQrCode(text);
    if (quest) {
      setScannedQuest(quest);
      setQrCollected((prev) => [...prev, text]);
    }
  };

  const parseQrCode = (text: string): { title: string; points: number; description: string } | null => {
    if (text.startsWith("HERO:")) {
      const parts = text.split(":");
      return {
        title: parts[1] || "Mystery Quest",
        points: parseInt(parts[2]) || 50,
        description: parts[3] || "Complete this quest to earn HERO points!",
      };
    }
    
    try {
      const url = new URL(text);
      const quest = url.searchParams.get("quest");
      const points = url.searchParams.get("points");
      if (quest) {
        return {
          title: quest,
          points: parseInt(points || "50"),
          description: `Scanned quest from ${url.hostname}`,
        };
      }
    } catch { /* not a URL */ }

    return {
      title: "Discovered QR Quest",
      points: 25,
      description: text.length > 100 ? text.slice(0, 100) + "..." : text,
    };
  };

  const handleClaimQrQuest = async () => {
    if (!scannedQuest) return;
    await awardPoints(scannedQuest.points, `QR Quest: ${scannedQuest.title}`);
    setScannedQuest(null);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 max-w-[430px] mx-auto">
      {/* Live camera feed (AR mode) */}
      {!qrMode && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* QR Scanner mode */}
      {qrMode && <QrScannerView onResult={handleQrResult} />}

      {/* Fallback when camera not available */}
      {!qrMode && !cameraActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(160_20%_8%)] via-[hsl(200_15%_12%)] to-[hsl(160_10%_6%)]">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass rounded-2xl px-6 py-4 text-center max-w-[280px]">
                <p className="text-sm font-semibold text-foreground mb-1">Camera access needed</p>
                <p className="text-xs text-muted-foreground">Allow camera access to scan AR quests & QR codes</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dark overlay on camera for better contrast (AR mode only) */}
      {!qrMode && cameraActive && <div className="absolute inset-0 bg-background/30" />}

      {/* AR Overlay (AR mode only) */}
      {!qrMode && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <img src={arOverlay} alt="" className="w-80 h-80 object-contain" style={{ animation: "glow-pulse 3s ease-in-out infinite" }} />
        </div>
      )}

      {/* Corner Brackets */}
      <div className="absolute inset-4 pointer-events-none">
        <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg ${qrMode ? "border-accent/60" : "border-primary/60"}`} />
        <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg ${qrMode ? "border-accent/60" : "border-primary/60"}`} />
        <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg ${qrMode ? "border-accent/60" : "border-primary/60"}`} />
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-lg ${qrMode ? "border-accent/60" : "border-primary/60"}`} />
      </div>

      {/* QR mode scan line animation */}
      {qrMode && (
        <div className="absolute inset-x-8 top-1/4 bottom-1/3 pointer-events-none">
          <motion.div
            animate={{ y: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"
          />
        </div>
      )}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/app")} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-foreground">
            <ChevronLeft size={20} />
          </button>
          <div className={`glass rounded-full px-4 py-2 flex items-center gap-2 ${qrMode ? "border border-accent/30" : ""}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${qrMode ? "bg-accent" : "bg-primary"}`} />
            <span className="text-xs font-semibold text-foreground">{qrMode ? "QR Scanner" : "AR Mode"}</span>
          </div>
          <button onClick={() => setQrMode(!qrMode)} className={`w-10 h-10 rounded-xl glass flex items-center justify-center transition-colors ${qrMode ? "text-accent" : "text-foreground"}`}>
            {qrMode ? <Focus size={20} /> : <QrCode size={20} />}
          </button>
        </div>
      </div>

      {/* AR Objects (AR mode only) */}
      {!qrMode && arObjects.map((obj) => {
        const isCollected = collected.includes(obj.id);
        if (isCollected) return null;
        return (
          <button
            key={obj.id}
            onClick={() => setSelectedObject(obj)}
            className="absolute z-10 group"
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              transform: 'translate(-50%, -50%)',
              animation: `float ${3 + obj.id * 0.5}s ease-in-out infinite`,
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-hero-green-glow/20 blur-[20px] rounded-full scale-150" />
              <img src={obj.img} alt={obj.name} className="w-16 h-16 relative z-10 drop-shadow-[0_0_12px_hsl(var(--hero-green-glow)/0.5)] group-hover:scale-110 transition-transform" />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass rounded-full px-2 py-0.5 whitespace-nowrap">
                <span className="text-[9px] font-bold text-primary">+{obj.points}</span>
              </div>
            </div>
          </button>
        );
      })}

      {/* Bottom HUD */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 space-y-3">
        {/* Mode toggle pills */}
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() => setQrMode(false)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${!qrMode ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}
          >
            AR Objects
          </button>
          <button
            onClick={() => setQrMode(true)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${qrMode ? "bg-accent text-accent-foreground" : "glass text-muted-foreground"}`}
          >
            <QrCode size={12} /> Scan QR
          </button>
        </div>

        {/* Info card */}
        <div className="glass-card rounded-2xl p-3 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${qrMode ? "bg-accent/10" : "bg-hero-green-light"}`}>
            {qrMode ? <QrCode size={18} className="text-accent" /> : <Navigation size={18} className="text-primary" />}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-foreground">
              {qrMode ? `${qrCollected.length} QR codes scanned` : `${arObjects.length - collected.length} quests remaining`}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {qrMode ? "Point at any HERO QR code to scan" : "Point your camera to discover AR objects"}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-hero-yellow-light px-2 py-1 rounded-full">
            <Sparkles size={10} className="text-hero-yellow" />
            <span className="text-[10px] font-bold text-hero-yellow">
              {qrMode ? qrCollected.length : `${collected.length}/3`}
            </span>
          </div>
        </div>

        {/* AR mode scan button */}
        {!qrMode && (
          <button
            onClick={() => { setScanning(true); setTimeout(() => setScanning(false), 2000); }}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              scanning ? "glass text-primary" : "bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98]"
            }`}
          >
            {scanning ? (
              <><Scan size={18} className="animate-spin" /> Scanning environment...</>
            ) : (
              <><Scan size={18} /> Scan for Quests</>
            )}
          </button>
        )}
      </div>

      {/* Selected AR Object Modal */}
      <AnimatePresence>
        {selectedObject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-end justify-center bg-background/60 backdrop-blur-sm"
            onClick={() => setSelectedObject(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute -top-8 right-4 w-32 h-32 bg-hero-green-glow/15 blur-[40px] rounded-full" />
                <button onClick={() => setSelectedObject(null)} className="absolute top-4 right-4 w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground">
                  <X size={16} />
                </button>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-hero-green-glow/20 blur-[16px] rounded-full" />
                    <img src={selectedObject.img} alt={selectedObject.name} className="w-20 h-20 relative z-10" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">{selectedObject.type}</span>
                    <h3 className="font-display text-xl font-bold text-foreground">{selectedObject.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Zap size={12} className="text-accent" />
                      <span className="text-sm font-bold text-accent">+{selectedObject.points} HERO</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-5 relative z-10">
                  Tap to collect this AR object and earn Hero Points!
                </p>
                <button
                  onClick={() => handleCollect(selectedObject)}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all relative z-10"
                >
                  Collect & Start Quest
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanned QR Quest Modal */}
      <AnimatePresence>
        {scannedQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-end justify-center bg-background/60 backdrop-blur-sm"
            onClick={() => setScannedQuest(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute -top-8 right-4 w-32 h-32 bg-accent/10 blur-[40px] rounded-full" />
                <button onClick={() => setScannedQuest(null)} className="absolute top-4 right-4 w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground">
                  <X size={16} />
                </button>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center relative">
                    {scannedQuest.isDrop ? <Gift size={28} className="text-accent" /> : <QrCode size={28} className="text-accent" />}
                    {scannedQuest.isDrop && <img src={ogLogo} alt="0G" className="absolute -bottom-1 -right-1 w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-accent uppercase tracking-wider flex items-center gap-1">
                      {scannedQuest.isDrop ? (
                        <><Gift size={8} /> NFT Drop</>
                      ) : "QR Quest"}
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground">{scannedQuest.title}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Zap size={12} className="text-accent" />
                      <span className="text-sm font-bold text-accent">+{scannedQuest.points} HERO</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 relative z-10">{scannedQuest.description}</p>

                {/* Show drop content (seed phrase / token info) */}
                {scannedQuest.isDrop && scannedQuest.dropContent && (
                  <div className="glass rounded-xl p-3 mb-4 relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <Key size={10} className="text-accent" />
                      <span className="text-[9px] font-bold text-accent uppercase">Decrypted Content</span>
                    </div>
                    <p className="font-mono text-xs text-foreground break-all">{scannedQuest.dropContent}</p>
                  </div>
                )}

                {/* 0G Chain badge */}
                {scannedQuest.isDrop && (
                  <div className="flex items-center gap-2 mb-4 relative z-10">
                    <img src={ogLogo} alt="0G" className="w-4 h-4" />
                    <span className="text-[9px] text-muted-foreground">Verified on 0G Chain</span>
                  </div>
                )}

                <button
                  onClick={handleClaimQrQuest}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-accent to-primary text-primary-foreground active:scale-[0.98] transition-all relative z-10"
                >
                  {scannedQuest.isDrop ? "Claim NFT Drop" : "Claim Quest Reward"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collection celebration */}
      {collected.length === 3 && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-md">
          <div className="text-center px-8" style={{ animation: "float-up 0.5s ease-out forwards" }}>
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="font-display text-2xl font-bold text-gradient-hero mb-2">All Quests Found!</h2>
            <p className="text-muted-foreground mb-2">You earned <span className="text-accent font-bold">+225 HERO</span></p>
            <p className="text-sm text-muted-foreground mb-6">Amazing explorer skills!</p>
            <div className="flex gap-3">
              <button onClick={() => navigate("/app")} className="flex-1 py-3 rounded-xl font-bold text-sm glass text-foreground">Done</button>
              <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green">Share 🎉</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** QR Scanner component using @yudiel/react-qr-scanner */
const QrScannerView = ({ onResult }: { onResult: (text: string) => void }) => {
  const [Scanner, setScanner] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import("@yudiel/react-qr-scanner").then((mod) => {
      setScanner(() => mod.Scanner);
    });
  }, []);

  if (!Scanner) {
    return (
      <div className="absolute inset-0 bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <QrCode size={32} className="text-accent mx-auto animate-pulse" />
          <p className="text-sm text-muted-foreground">Starting scanner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Scanner
        onScan={(result: any) => {
          if (result?.[0]?.rawValue) {
            onResult(result[0].rawValue);
          }
        }}
        styles={{
          container: { width: "100%", height: "100%" },
          video: { objectFit: "cover" as const },
        }}
        components={{ audio: false, torch: false }}
      />
    </div>
  );
};

export default ARQuest;
