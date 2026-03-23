import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Link2, Navigation, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parseDeepLinkToRoute } from "@/lib/deepLink";

const SAMPLE_LINKS = [
  "localhero://app/redeem",
  "localhero://app/ar?quest=park-nature-walk",
  "https://app.localhero.space/report-spot",
  "localhero://app/create-edu-quest",
] as const;

const isDebugEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOBILE_DEBUG === "true";

const DeepLinkDebug = () => {
  const navigate = useNavigate();
  const [urlInput, setUrlInput] = useState(SAMPLE_LINKS[0]);

  const parsedRoute = useMemo(() => parseDeepLinkToRoute(urlInput), [urlInput]);

  if (!isDebugEnabled) {
    return (
      <div className="px-5 pt-10 pb-28">
        <div className="glass-card rounded-2xl p-6 text-center space-y-2">
          <ShieldAlert className="mx-auto text-amber-300" />
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
          <h1 className="font-display text-xl font-bold text-foreground">Deep Link Debug</h1>
          <p className="text-xs text-muted-foreground">Simulate and validate mobile deep links</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Link2 size={16} />
          <p className="text-sm font-semibold">Test URL</p>
        </div>
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="localhero://app/redeem"
          className="font-mono text-xs"
        />
        <div className="rounded-xl border border-border/70 bg-background/60 p-3">
          <p className="text-[11px] text-muted-foreground">Parsed route</p>
          <p className={`font-mono text-xs mt-1 ${parsedRoute ? "text-foreground" : "text-red-300"}`}>
            {parsedRoute ?? "Invalid / not allowed"}
          </p>
        </div>
        <Button
          className="w-full"
          disabled={!parsedRoute}
          onClick={() => parsedRoute && navigate(parsedRoute)}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Navigate to parsed route
        </Button>
      </div>

      <div className="glass-card rounded-2xl p-4 space-y-2">
        <p className="text-sm font-semibold text-foreground">Samples</p>
        {SAMPLE_LINKS.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => setUrlInput(url)}
            className="w-full rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-left text-xs font-mono text-muted-foreground hover:text-foreground"
          >
            {url}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeepLinkDebug;

