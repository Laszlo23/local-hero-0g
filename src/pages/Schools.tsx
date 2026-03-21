import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, ScanLine } from "lucide-react";
import { StaggerContainer, FadeUpItem, BreathingGlow, FloatingParticle } from "@/components/Animations";
import { supabase } from "@/integrations/supabase/client";
import { useDailyQuests } from "@/hooks/use-daily-quests";
import { listPublishedEducationalQuests, type EducationalQuest } from "@/lib/educationalQuests";

const Schools = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<any[]>([]);
  const [eduQuests, setEduQuests] = useState<EducationalQuest[]>([]);
  const { quests } = useDailyQuests();
  const learningQuests = quests.filter(q => q.category.toLowerCase() === "outdoors" || q.category.toLowerCase() === "community");

  useEffect(() => {
    supabase.from("schools").select("*").order("total_points", { ascending: false }).limit(10).then(({ data }) => {
      if (data) setSchools(data);
    });
  }, []);

  useEffect(() => {
    void listPublishedEducationalQuests().then(setEduQuests);
  }, []);

  return (
    <div className="px-5 pt-12 pb-28 space-y-5 relative">
      <FloatingParticle x={90} y={8} size={5} delay={0} duration={5} />
      <FloatingParticle x={5} y={30} size={4} delay={1} duration={4} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Schools</h1>
          <p className="text-sm text-muted-foreground">Learn through real-world quests</p>
        </div>
        <motion.div className="w-10 h-10 rounded-xl glass flex items-center justify-center" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          <GraduationCap size={18} className="text-primary" />
        </motion.div>
      </motion.div>

      {/* Info Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5 relative overflow-hidden">
        <BreathingGlow className="w-24 h-24 -top-6 -right-6" color="hero-purple" />
        <div className="relative z-10 flex items-center gap-4">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-hero-purple/30 to-hero-green-light flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <BookOpen size={24} className="text-hero-purple" />
          </motion.div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-foreground">Schools Program</h3>
            <p className="text-xs text-muted-foreground">Outdoor learning quests for students</p>
          </div>
        </div>
      </motion.div>

      {/* Class AR quests (Supabase educational_quests) */}
      <div>
        <h3 className="font-display font-bold text-foreground mb-1 flex items-center gap-2">
          <ScanLine size={18} className="text-primary" />
          Class AR trails
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Teacher- or creator-authored outings: AR markers, outdoor tasks, quizzes, and class QR checkpoints. Opens in the AR experience.
        </p>
        {eduQuests.length > 0 ? (
          <StaggerContainer className="space-y-3">
            {eduQuests.map((q) => (
              <FadeUpItem key={q.id}>
                <motion.button
                  type="button"
                  onClick={() => navigate(`/app/ar?quest=${encodeURIComponent(q.slug)}`)}
                  className="glass-card-hover w-full rounded-2xl p-4 text-left"
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-2xl">
                      🌿
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-foreground">{q.title}</h4>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{q.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-muted/50 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                          Ages {q.age_min}–{q.age_max}
                        </span>
                        {q.subject_tags?.slice(0, 3).map((t) => (
                          <span key={t} className="rounded-full bg-hero-green-glow/15 px-2 py-0.5 text-[9px] font-semibold text-hero-green-glow">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ScanLine size={18} className="mt-1 shrink-0 text-primary opacity-70" />
                  </div>
                </motion.button>
              </FadeUpItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="glass-card rounded-2xl p-5 text-center">
            <p className="text-xs text-muted-foreground">
              No class trails published yet. Run the Supabase migration{" "}
              <code className="rounded bg-muted px-1 text-[10px]">20260321120000_educational_quests.sql</code> and refresh.
            </p>
          </div>
        )}
      </div>

      {/* Available Learning Quests */}
      <div>
        <h3 className="font-display font-bold text-foreground mb-3">Learning Quests</h3>
        {learningQuests.length > 0 ? (
          <StaggerContainer className="space-y-3">
            {learningQuests.map((q, i) => (
              <FadeUpItem key={q.id}>
                <motion.div
                  className={`glass-card-hover rounded-2xl p-4 cursor-pointer ${q.completed ? "border-primary/20" : ""}`}
                  whileHover={{ x: 4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-hero-green-light flex items-center justify-center text-2xl shrink-0"
                      animate={!q.completed ? { scale: [1, 1.08, 1] } : {}}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                    >
                      {q.completed ? "✅" : q.emoji}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-foreground">{q.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{q.description}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-hero-purple/10 text-hero-purple">{q.category}</span>
                        <span className="text-[10px] font-bold text-primary">+{q.points} XP</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </FadeUpItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center">
            <motion.div className="text-4xl mb-3" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>📚</motion.div>
            <h4 className="font-display font-bold text-foreground mb-1">No learning quests yet</h4>
            <p className="text-xs text-muted-foreground">Check back tomorrow for new learning quests!</p>
          </div>
        )}
      </div>

      {/* School Leaderboard */}
      <div>
        <h3 className="font-display font-bold text-foreground mb-3">School Rankings</h3>
        {schools.length > 0 ? (
          <StaggerContainer className="space-y-2">
            {schools.map((school, i) => (
              <FadeUpItem key={school.id}>
                <div className="glass-card rounded-xl p-3.5 flex items-center gap-3">
                  <span className={`w-7 text-center text-sm font-bold ${i === 0 ? "text-hero-yellow" : "text-muted-foreground"}`}>
                    {i === 0 ? "👑" : `#${i + 1}`}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-foreground">{school.name}</p>
                    <p className="text-xs text-muted-foreground">{school.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary">{school.total_points.toLocaleString()}</p>
                    <p className="text-[9px] text-muted-foreground">{school.student_count} students</p>
                  </div>
                </div>
              </FadeUpItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center">
            <motion.div className="text-4xl mb-3" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>🏫</motion.div>
            <h4 className="font-display font-bold text-foreground mb-1">No schools registered yet</h4>
            <p className="text-xs text-muted-foreground">Schools can join the program to compete on the leaderboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schools;
