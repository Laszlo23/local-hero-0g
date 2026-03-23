import { Compass, Gamepad2, Heart, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroLogo from "@/assets/hero-logo-glow.png";
import ogLogo from "@/assets/0g-logo.png";

/**
 * Marketing footer for static / long-form pages (matches Landing structure, router links only).
 */
export function SiteMarketingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="relative border-t border-border bg-background/80" aria-label="Site footer">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2.5">
              <img src={heroLogo} alt="" className="h-8 w-8" />
              <span className="font-display text-lg font-bold text-foreground">
                Local<span className="text-gradient-hero">Hero</span>
              </span>
            </Link>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              The game that turns your neighborhood into a playground for good. 🌍
            </p>
            <div className="flex items-center gap-2">
              <img src={ogLogo} alt="0G Chain" className="h-5 w-5 opacity-60" />
              <span className="text-[11px] text-muted-foreground">Powered by 0G Chain</span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-foreground">
              <Compass size={14} className="text-primary" /> Explore
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "How It Works", to: "/#how-it-works" },
                { label: "Discovery Drops", to: "/#discovery-drops" },
                { label: "Schools", to: "/#schools" },
                { label: "Impact", to: "/#impact" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-foreground">
              <TrendingUp size={14} className="text-hero-yellow" /> Company
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "For Business", to: "/business" },
                { label: "Investors", to: "/investors" },
                { label: "Pitch Deck", to: "/pitch" },
                { label: "HeroPaper", to: "/heropaper" },
                { label: "HERO Token", to: "/hero-token" },
                { label: "Build in Public", to: "/build-in-public" },
                { label: "Roadmap & FAQ", to: "/roadmap" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-foreground">
              <Heart size={14} className="text-hero-orange" /> Get involved
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/report-spot"
                  className="text-sm font-medium text-hero-green-glow transition-colors hover:text-primary"
                >
                  Report a spot 🌿
                </Link>
              </li>
              <li>
                <Link to="/fund" className="text-sm font-medium text-hero-orange transition-colors hover:text-hero-yellow">
                  Fund Us 💛
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Join as Hero
                </Link>
              </li>
              <li>
                <Link to="/install" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Install App
                </Link>
              </li>
              <li>
                <Link to="/treegens" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  TreeGens record
                </Link>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-hero py-2.5 px-4 font-display text-sm font-bold text-primary-foreground"
            >
              <Gamepad2 size={14} /> Start playing
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2026 Local Hero · Fair by design</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link to="/hero-token" className="text-[10px] text-muted-foreground/60 transition-colors hover:text-primary">
              HERO Token paper
            </Link>
            <Link to="/report-spot" className="text-[10px] text-muted-foreground/60 transition-colors hover:text-primary">
              Report a spot
            </Link>
            <Link to="/build-in-public" className="text-[10px] text-muted-foreground/60 transition-colors hover:text-primary">
              Build in Public
            </Link>
            <Link to="/privacy" className="text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground">
              Terms
            </Link>
            <a
              href="mailto:hello@localhero.space"
              className="text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
