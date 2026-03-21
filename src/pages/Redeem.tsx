import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Coins, Loader2, ExternalLink } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { getMePoints, redeemPoints, HttpError } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { ogGalileoTestnet, ogMainnet } from "@/lib/zeroGChains";

const Redeem = () => {
  const navigate = useNavigate();
  const { getAccessToken } = useAuth();
  const { user } = usePrivy();
  const embedded = user?.wallet?.address;

  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [pointsPerToken, setPointsPerToken] = useState(100);
  const [minRedeem, setMinRedeem] = useState(100);
  const [redeemEnabled, setRedeemEnabled] = useState(false);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState(16602);
  const [pointsInput, setPointsInput] = useState("");
  const [recipientOverride, setRecipientOverride] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await getMePoints(token);
      setBalance(data.balance);
      setPointsPerToken(data.pointsPerToken);
      setMinRedeem(data.minRedeemPoints);
      setRedeemEnabled(data.redeemEnabled);
      setTokenAddress(data.tokenAddress ?? null);
      setChainId(data.chainId);
    } catch (e) {
      console.warn(e);
      toast({ title: "Could not load points", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (embedded && !recipientOverride) {
      setRecipientOverride(embedded);
    }
  }, [embedded, recipientOverride]);

  const estimatedHero =
    pointsInput && !Number.isNaN(Number(pointsInput))
      ? Number(pointsInput) / pointsPerToken
      : 0;

  const explorerBase =
    chainId === ogMainnet.id
      ? ogMainnet.blockExplorers.default.url
      : ogGalileoTestnet.blockExplorers.default.url;

  const handleRedeem = async () => {
    const pts = Number(pointsInput);
    if (!Number.isFinite(pts) || pts < minRedeem) {
      toast({ title: "Invalid amount", description: `At least ${minRedeem} points.`, variant: "destructive" });
      return;
    }
    if (pts > balance) {
      toast({ title: "Not enough points", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sign in required");
      const recipient =
        recipientOverride.trim() && recipientOverride.startsWith("0x") ? recipientOverride.trim() : undefined;
      const result = await redeemPoints(accessToken, {
        pointsAmount: Math.floor(pts),
        ...(recipient ? { recipientAddress: recipient } : {}),
      });
      toast({
        title: "HERO minted",
        description: `Tx: ${result.txHash.slice(0, 10)}…`,
      });
      setPointsInput("");
      await load();
    } catch (err) {
      const msg =
        err instanceof HttpError
          ? err.message
          : err instanceof Error
            ? err.message
            : String(err);
      toast({ title: "Redeem failed", description: msg.slice(0, 200), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-5 pt-10 pb-28 space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center text-foreground"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Redeem HERO</h1>
          <p className="text-xs text-muted-foreground">Exchange server HERO points for on-chain tokens</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Coins size={20} />
              <span className="font-bold text-lg">{balance.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">points (API balance)</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Points from this backend only (signup bonus, etc.). Quest/drop points in Supabase are separate until
              synced.
            </p>
            <p className="text-xs text-muted-foreground">
              Rate: <strong>{pointsPerToken}</strong> points = 1 {redeemEnabled ? "HERO" : "HERO (pending config)"} ·
              Min: <strong>{minRedeem}</strong> · Chain ID <strong>{chainId}</strong>
            </p>
          </div>

          {!redeemEnabled ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
              Redeem is turned off until the API has <code className="text-[10px]">HERO_TOKEN_ADDRESS</code> and{" "}
              <code className="text-[10px]">HERO_TOKEN_MINTER_PRIVATE_KEY</code> set.
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Points to redeem</label>
                <Input
                  type="number"
                  min={minRedeem}
                  max={balance}
                  value={pointsInput}
                  onChange={(e) => setPointsInput(e.target.value)}
                  placeholder={`${minRedeem} or more`}
                  className="h-12 rounded-xl bg-secondary/50"
                />
                {estimatedHero > 0 && (
                  <p className="text-xs text-muted-foreground">
                    ≈ <strong className="text-foreground">{estimatedHero.toFixed(4)}</strong> HERO (18 decimals)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Recipient wallet (0G)</label>
                <Input
                  value={recipientOverride}
                  onChange={(e) => setRecipientOverride(e.target.value)}
                  placeholder="0x…"
                  className="h-12 rounded-xl bg-secondary/50 font-mono text-xs"
                />
                <p className="text-[10px] text-muted-foreground">
                  Defaults to your Privy embedded wallet. You can send to another address.
                </p>
              </div>

              <Button
                className="w-full h-12 rounded-xl bg-gradient-hero-glow font-bold"
                disabled={submitting || balance < minRedeem}
                onClick={() => void handleRedeem()}
              >
                {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Redeem for HERO"}
              </Button>

              {tokenAddress && (
                <a
                  href={`${explorerBase}/address/${tokenAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-primary"
                >
                  Token contract <ExternalLink size={12} />
                </a>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Redeem;
