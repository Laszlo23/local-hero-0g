import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { Capacitor } from "@capacitor/core";
import { ChevronLeft, Loader2, ShieldCheck, ShieldX, RefreshCw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getMeAccessStatus, HttpError } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const isDebugEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOBILE_DEBUG === "true";

function readLastDeepLink() {
  try {
    const raw = localStorage.getItem("mobile_debug_last_deeplink");
    if (!raw) return null;
    return JSON.parse(raw) as { url: string; route: string | null; at: string };
  } catch {
    return null;
  }
}

const AuthFlowDebug = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const privy = usePrivy();
  const [checking, setChecking] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<string>("not checked");
  const [accessStatus, setAccessStatus] = useState<string>("not checked");
  const [errorInfo, setErrorInfo] = useState<string>("");

  const lastDeepLink = useMemo(() => readLastDeepLink(), []);

  const runChecks = async () => {
    setChecking(true);
    setErrorInfo("");
    try {
      const token = await auth.getAccessToken();
      setTokenInfo(token ? `ok (${token.slice(0, 18)}...)` : "missing");
      if (token) {
        const status = await getMeAccessStatus(token);
        setAccessStatus(
          `ok (onboardingCompleted=${String(status.onboardingCompleted)}, walletLinked=${String(status.walletLinked)})`
        );
      } else {
        setAccessStatus("skipped (no token)");
      }
    } catch (e) {
      const msg =
        e instanceof HttpError
          ? `HTTP ${e.status}: ${e.message}`
          : e instanceof Error
            ? e.message
            : String(e);
      setErrorInfo(msg.slice(0, 300));
    } finally {
      setChecking(false);
    }
  };

  const handleExportDiagnostics = async () => {
    setExporting(true);
    try {
      const token = await auth.getAccessToken();
      const payload = {
        exportedAt: new Date().toISOString(),
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        privy: {
          ready: privy.ready,
          authenticated: privy.authenticated,
          userId: privy.user?.id ?? null,
          walletAddress: privy.user?.wallet?.address ?? null,
          email: privy.user?.email?.address ?? null,
        },
        authContext: {
          loading: auth.loading,
          authenticated: auth.authenticated,
          userId: auth.user?.id ?? null,
          email: auth.user?.email ?? null,
        },
        checks: {
          tokenPresent: Boolean(token),
          tokenPreview: token ? `${token.slice(0, 18)}...` : null,
          accessStatus,
          tokenInfo,
          errorInfo,
        },
        deepLinkLastEvent: lastDeepLink,
        appMeta: {
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
          pathname: typeof window !== "undefined" ? window.location.pathname : null,
          search: typeof window !== "undefined" ? window.location.search : null,
        },
      };
      const text = JSON.stringify(payload, null, 2);

      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share({
          title: "Local Hero Mobile Diagnostics",
          text,
        });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast({ title: "Diagnostics copied", description: "Copied JSON to clipboard." });
        return;
      }

      // Last fallback: download text file
      const blob = new Blob([text], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `localhero-diagnostics-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast({ title: "Export failed", description: msg.slice(0, 200), variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  if (!isDebugEnabled) {
    return (
      <div className="px-5 pt-10 pb-28">
        <div className="glass-card rounded-2xl p-6 text-center space-y-2">
          <ShieldX className="mx-auto text-amber-300" />
          <p className="font-bold text-foreground">Debug page disabled</p>
          <p className="text-xs text-muted-foreground">
            Enable with <code>VITE_ENABLE_MOBILE_DEBUG=true</code> in non-dev builds.
          </p>
          <Button variant="outline" onClick={() => navigate("/app")}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-10 pb-28 space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center text-foreground"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Auth Flow Debug</h1>
          <p className="text-xs text-muted-foreground">Check Privy, token retrieval, and backend auth status</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 space-y-2 text-xs">
        <p className="font-semibold text-foreground">Privy state</p>
        <p className="text-muted-foreground">ready: <span className="text-foreground">{String(privy.ready)}</span></p>
        <p className="text-muted-foreground">authenticated: <span className="text-foreground">{String(privy.authenticated)}</span></p>
        <p className="text-muted-foreground">userId: <span className="text-foreground">{privy.user?.id || "none"}</span></p>
        <p className="text-muted-foreground">wallet: <span className="text-foreground">{privy.user?.wallet?.address || "none"}</span></p>
      </div>

      <div className="glass-card rounded-2xl p-4 space-y-2 text-xs">
        <p className="font-semibold text-foreground">Auth context</p>
        <p className="text-muted-foreground">loading: <span className="text-foreground">{String(auth.loading)}</span></p>
        <p className="text-muted-foreground">authenticated: <span className="text-foreground">{String(auth.authenticated)}</span></p>
        <p className="text-muted-foreground">userId: <span className="text-foreground">{auth.user?.id || "none"}</span></p>
      </div>

      <div className="glass-card rounded-2xl p-4 space-y-2 text-xs">
        <p className="font-semibold text-foreground">Deep link last event</p>
        {lastDeepLink ? (
          <>
            <p className="text-muted-foreground">at: <span className="text-foreground">{lastDeepLink.at}</span></p>
            <p className="text-muted-foreground break-all">url: <span className="text-foreground">{lastDeepLink.url}</span></p>
            <p className="text-muted-foreground">parsed route: <span className="text-foreground">{lastDeepLink.route ?? "null"}</span></p>
          </>
        ) : (
          <p className="text-muted-foreground">No deep-link event recorded yet.</p>
        )}
      </div>

      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck size={16} />
          <p className="text-sm font-semibold">Connectivity checks</p>
        </div>
        <p className="text-xs text-muted-foreground">token: <span className="text-foreground">{tokenInfo}</span></p>
        <p className="text-xs text-muted-foreground">/me/access-status: <span className="text-foreground">{accessStatus}</span></p>
        {errorInfo && <p className="text-xs text-red-300 break-words">{errorInfo}</p>}
        <Button className="w-full" onClick={() => void runChecks()} disabled={checking}>
          {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCw className="w-4 h-4 mr-2" />Run checks</>}
        </Button>
        <Button variant="outline" className="w-full" onClick={() => void handleExportDiagnostics()} disabled={exporting}>
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Share2 className="w-4 h-4 mr-2" />Export diagnostics</>}
        </Button>
      </div>
    </div>
  );
};

export default AuthFlowDebug;

