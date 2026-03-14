import { MapPin, Search, Sparkles, Star, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDailyQuests } from "@/hooks/use-daily-quests";
import { useNavigate } from "react-router-dom";

const categories = ["All", "Outdoors", "Community", "Business", "Wellness"];

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState("");
  const { quests, loading, generating } = useDailyQuests();
  const navigate = useNavigate();

  const filtered = quests.filter((q) => {
    const matchCategory = activeCategory === 0 || q.category.toLowerCase() === categories[activeCategory].toLowerCase();
    const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="px-5 pt-12 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Explore</h1>
        <p className="text-sm text-muted-foreground">Discover quests near you</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quests, places..."
          className="w-full h-11 pl-10 pr-4 glass rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
        {categories.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(i)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === i
                ? "bg-gradient-hero-glow text-primary-foreground glow-green"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {(loading || generating) && (
        <div className="flex justify-center py-8">
          <Loader2 size={20} className="animate-spin text-primary" />
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((q) => (
          <div key={q.id} className="glass-card-hover rounded-2xl p-4 cursor-pointer" onClick={() => navigate("/app/quests")}>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-hero-green-light flex items-center justify-center text-2xl shrink-0">
                {q.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-foreground">{q.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{q.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <MapPin size={10} /> Nearby
                  </span>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-primary">
                    <Star size={10} /> +{q.points}
                  </span>
                </div>
                {q.completed && (
                  <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {!loading && !generating && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No quests found — check back tomorrow!</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
