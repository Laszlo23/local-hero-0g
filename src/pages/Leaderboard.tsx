import { Crown, GraduationCap, MapPin, Medal, Shield, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserStats } from "@/hooks/use-user-stats";
import { getDeviceId } from "@/lib/profile";

const categoryTabs = ["Heroes", "Schools", "Cities"];
const timeTabs = ["Daily", "Weekly", "All Time"];

type SchoolEntry = { name: string; city: string; total_points: number; student_count: number };
type CityEntry = { name: string; emoji: string; total_points: number; hero_count: number };

type LeaderEntry = {
  display_name: string;
  avatar_url: string;
  location: string;
  total_points: number;
  device_id: string;
};

const Leaderboard = () => {
  const [category, setCategory] = useState(0);
  const [timeTab, setTimeTab] = useState(0);
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [schools, setSchools] = useState<SchoolEntry[]>([]);
  const [cities, setCities] = useState<CityEntry[]>([]);
  const { stats } = useUserStats();

  useEffect(() => {
    const fetchLeaders = async () => {
      const { data } = await supabase
        .from("user_profiles")
        .select("device_id, display_name, avatar_url, location, total_points")
        .order("total_points", { ascending: false })
        .limit(20);

      if (data) {
        setLeaders(data.map(d => ({
          display_name: d.display_name || "Hero",
          avatar_url: d.avatar_url || "",
          location: d.location || "",
          total_points: d.total_points || 0,
          device_id: (d as any).device_id || "",
        })));
      }
    };

    const fetchSchools = async () => {
      const { data } = await supabase
        .from("schools")
        .select("name, city, total_points, student_count")
        .order("total_points", { ascending: false })
        .limit(20);
      if (data) setSchools(data);
    };

    const fetchCities = async () => {
      const { data } = await supabase
        .from("cities")
        .select("name, emoji, total_points, hero_count")
        .order("total_points", { ascending: false })
        .limit(20);
      if (data) setCities(data);
    };

    fetchLeaders();
    fetchSchools();
    fetchCities();
  }, []);

  const getAvatar = (entry: LeaderEntry) =>
    entry.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(entry.display_name)}`;

  return (
    <div className="px-5 pt-12 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Top heroes making impact</p>
      </div>

      <div className="flex gap-1 glass rounded-xl p-1">
        {categoryTabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setCategory(i)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              category === i ? "bg-gradient-hero-glow text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {timeTabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setTimeTab(i)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all ${
              timeTab === i ? "bg-primary/10 text-primary" : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Heroes Tab */}
      {category === 0 && (
        <>
          {leaders.length >= 3 && (
            <div className="flex items-end justify-center gap-3 pt-4 pb-2">
              <PodiumCard rank={2} entry={leaders[1]} avatar={getAvatar(leaders[1])} />
              <PodiumCard rank={1} entry={leaders[0]} avatar={getAvatar(leaders[0])} />
              <PodiumCard rank={3} entry={leaders[2]} avatar={getAvatar(leaders[2])} />
            </div>
          )}
          <div className="space-y-2">
            {leaders.slice(3).map((entry, i) => (
              <div key={i} className="glass-card-hover rounded-xl p-3.5 flex items-center gap-3 cursor-pointer">
                <span className="w-7 text-center text-sm font-bold text-muted-foreground">{i + 4}</span>
                <img src={getAvatar(entry)} alt={entry.display_name} className="w-10 h-10 rounded-full object-cover ring-1 ring-border" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{entry.display_name}</p>
                  <p className="text-xs text-muted-foreground">{entry.location}</p>
                </div>
                <span className="font-bold text-sm text-primary">{entry.total_points.toLocaleString()}</span>
              </div>
            ))}
            {leaders.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No heroes yet — be the first!</p>
            )}
          </div>
        </>
      )}

      {/* Schools Tab */}
      {category === 1 && (
        <div className="space-y-2">
          {schools.map((s, i) => (
            <div key={i} className="glass-card-hover rounded-xl p-4 flex items-center gap-3 cursor-pointer">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                i === 0 ? "bg-hero-yellow-light" : "bg-hero-green-light"
              }`}>
                <GraduationCap size={18} className={i === 0 ? "text-hero-yellow" : "text-primary"} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground">{s.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><MapPin size={9} /> {s.city}</span>
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Users size={9} /> {s.student_count}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-primary">{s.total_points.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cities Tab */}
      {category === 2 && (
        <div className="space-y-2">
          {cities.map((c, i) => (
            <div key={i} className="glass-card-hover rounded-xl p-4 flex items-center gap-3 cursor-pointer">
              <span className="text-2xl w-10 text-center">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground">{c.name}</p>
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Shield size={9} /> {c.hero_count.toLocaleString()} heroes</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-primary">{(c.total_points / 1000).toFixed(0)}K</p>
                <p className="text-[10px] text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Your position */}
      {(() => {
        const deviceId = getDeviceId();
        const rank = leaders.findIndex(l => l.device_id === deviceId) + 1;
        return (
      <div className="glass-card rounded-xl p-3.5 flex items-center gap-3 border-primary/30 glow-green">
        <span className="w-7 text-center text-sm font-bold text-primary">#{rank || "—"}</span>
        <img
          src={stats.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(stats.display_name)}`}
          alt="You"
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/40"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground">You</p>
          <p className="text-xs text-muted-foreground">{stats.location}</p>
        </div>
        <span className="font-bold text-sm text-primary">{stats.total_points.toLocaleString()}</span>
      </div>
        );
      })()}
    </div>
  );
};

const PodiumCard = ({ rank, entry, avatar }: { rank: number; entry: LeaderEntry; avatar: string }) => {
  const isFirst = rank === 1;
  const heights: Record<number, string> = { 1: "h-24", 2: "h-16", 3: "h-12" };
  const RankIcon = rank === 1 ? Crown : Medal;
  const glowColors: Record<number, string> = { 1: "ring-hero-yellow", 2: "ring-muted-foreground/30", 3: "ring-hero-orange/50" };
  const iconColors: Record<number, string> = { 1: "text-hero-yellow", 2: "text-muted-foreground", 3: "text-hero-orange" };

  return (
    <div className={`flex flex-col items-center ${isFirst ? "-mt-4" : ""}`}>
      <div className="relative mb-2">
        <img src={avatar} alt={entry.display_name} className={`${isFirst ? "w-16 h-16" : "w-12 h-12"} rounded-full object-cover ring-2 ${glowColors[rank]}`} />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <RankIcon size={isFirst ? 18 : 14} className={iconColors[rank]} />
        </div>
      </div>
      <p className="text-xs font-bold text-foreground text-center truncate max-w-[80px]">{entry.display_name}</p>
      <p className="text-[10px] text-muted-foreground">{entry.total_points.toLocaleString()}</p>
      <div className={`${heights[rank]} w-20 bg-gradient-hero-glow rounded-t-lg mt-2 flex items-center justify-center`}>
        <span className="text-lg font-bold text-primary-foreground">{rank}</span>
      </div>
    </div>
  );
};

export default Leaderboard;
