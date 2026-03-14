import { Home, Compass, ScanLine, Trophy, User, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/app", icon: Home, label: "Home" },
  { path: "/app/explore", icon: Compass, label: "Explore" },
  { path: "/app/ar", icon: ScanLine, label: "AR Quest", special: true },
  { path: "/app/community", icon: Users, label: "Community" },
  { path: "/app/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong">
      <div className="flex items-center justify-around max-w-[430px] mx-auto h-[72px] px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ path, icon: Icon, label, special }) => {
          const active = location.pathname === path;

          if (special) {
            return (
              <motion.button
                key={path}
                onClick={() => navigate(path)}
                className="relative -mt-5 flex flex-col items-center gap-0.5"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-gradient-hero-glow flex items-center justify-center glow-green shadow-lg"
                  animate={{ scale: [1, 1.06, 1], boxShadow: ["0 0 15px hsl(152 80% 50% / 0.3)", "0 0 25px hsl(152 80% 50% / 0.5)", "0 0 15px hsl(152 80% 50% / 0.3)"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon size={24} strokeWidth={2} className="text-primary-foreground" />
                </motion.div>
                <span className="text-[9px] font-bold text-primary mt-0.5">{label}</span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
            >
              <div className={`p-1.5 rounded-xl transition-all relative ${active ? "bg-hero-green-light" : ""}`}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                {active && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-primary"
                    layoutId="nav-dot"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-[10px] font-semibold ${active ? "text-primary" : ""}`}>
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
