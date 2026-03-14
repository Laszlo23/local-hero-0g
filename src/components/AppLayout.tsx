import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import PointsBadge from "./PointsBadge";
import ogLogo from "@/assets/0g-logo.png";

const AppLayout = () => (
  <div className="min-h-screen bg-background max-w-[430px] mx-auto relative">
    <div className="fixed top-3 left-3 z-50 flex items-center gap-2">
      <PointsBadge />
    </div>
    <div className="fixed top-3.5 right-14 z-50">
      <img src={ogLogo} alt="0G" className="w-6 h-6 opacity-50 hover:opacity-100 transition-opacity" title="Powered by 0G Chain" />
    </div>
    <div className="pb-20 pt-12">
      {/* Dev banner */}
      <div className="mx-3 mb-3 rounded-xl bg-accent/10 border border-accent/20 px-4 py-2.5 flex items-center gap-2 text-xs text-accent">
        <span className="text-base">🚀</span>
        <span><strong>Early Access Prototype</strong> — Every new user gets rewarded! 🎁</span>
      </div>
      <Outlet />
    </div>
    {/* 0G watermark */}
    <div className="fixed bottom-[76px] right-2 z-40 flex items-center gap-1 opacity-30">
      <img src={ogLogo} alt="" className="w-3.5 h-3.5" />
      <span className="text-[8px] font-bold text-muted-foreground">0G Chain</span>
    </div>
    <BottomNav />
  </div>
);

export default AppLayout;
