import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles, Wand2, Save, ChevronLeft, Rocket, Archive } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  generateEducationalQuestDraft,
  type EducationalQuestDraft,
  type GenerateEducationalQuestDraftPayload,
  HttpError,
} from "@/lib/api";
import {
  listRecentEducationalQuests,
  saveEducationalQuestDraft,
  setEducationalQuestVisibility,
  type EducationalQuest,
} from "@/lib/educationalQuests";
import { getDeviceId } from "@/lib/profile";

const DEFAULT_TAGS = "biology, environment, civics";

const CreateEducationalQuest = () => {
  const navigate = useNavigate();
  const { getAccessToken } = useAuth();
  const [titleHint, setTitleHint] = useState("Park biodiversity walk");
  const [ageMin, setAgeMin] = useState(10);
  const [ageMax, setAgeMax] = useState(14);
  const [subjectTags, setSubjectTags] = useState(DEFAULT_TAGS);
  const [locationContext, setLocationContext] = useState("City park with trees, paths, and a small pond");
  const [classSize, setClassSize] = useState(25);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [focus, setFocus] = useState(
    "Students observe plant diversity, discuss litter reduction, and complete one collaborative checkpoint."
  );
  const [checkpointPrefix, setCheckpointPrefix] = useState("class-a");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EducationalQuestDraft | null>(null);
  const [recent, setRecent] = useState<EducationalQuest[]>([]);
  const [refreshingRecent, setRefreshingRecent] = useState(false);
  const [onlyMine, setOnlyMine] = useState(true);
  const creatorDeviceId = useMemo(() => getDeviceId(), []);

  const tags = useMemo(
    () =>
      subjectTags
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 8),
    [subjectTags]
  );

  const refreshRecent = async () => {
    setRefreshingRecent(true);
    const rows = await listRecentEducationalQuests(24, onlyMine ? creatorDeviceId : undefined);
    setRecent(rows.filter((r) => r.visibility === "draft" || r.visibility === "published").slice(0, 12));
    setRefreshingRecent(false);
  };

  useEffect(() => {
    void refreshRecent();
  }, [onlyMine]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sign in required");
      const payload: GenerateEducationalQuestDraftPayload = {
        titleHint: titleHint.trim(),
        ageMin,
        ageMax,
        subjectTags: tags.length ? tags : ["outdoors"],
        locationContext: locationContext.trim(),
        classSize,
        durationMinutes,
        focus: focus.trim(),
        classCheckpointPrefix: checkpointPrefix.trim() || undefined,
      };
      const res = await generateEducationalQuestDraft(accessToken, payload);
      setDraft(res.draft);
      toast({ title: "Draft generated", description: "Review below, then save to Supabase." });
    } catch (e) {
      const msg = e instanceof HttpError ? e.message : e instanceof Error ? e.message : String(e);
      toast({ title: "Generation failed", description: msg.slice(0, 220), variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const id = await saveEducationalQuestDraft(draft, creatorDeviceId);
      toast({ title: "Draft saved", description: `Quest saved as draft (${id.slice(0, 8)}…).` });
      await refreshRecent();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast({ title: "Save failed", description: msg.slice(0, 220), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSetVisibility = async (questId: string, visibility: "draft" | "published" | "archived") => {
    setPublishingId(questId);
    try {
      const ok = await setEducationalQuestVisibility(questId, visibility);
      if (!ok) throw new Error("Update failed");
      toast({
        title: visibility === "published" ? "Quest published" : visibility === "draft" ? "Moved back to draft" : "Quest archived",
      });
      await refreshRecent();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast({ title: "Could not update visibility", description: msg.slice(0, 220), variant: "destructive" });
    } finally {
      setPublishingId(null);
    }
  };

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
          <h1 className="font-display text-xl font-bold text-foreground">Create class quest (AI)</h1>
          <p className="text-xs text-muted-foreground">Generate structured AR/outdoor draft for schools</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 space-y-3">
        <Input value={titleHint} onChange={(e) => setTitleHint(e.target.value)} placeholder="Title hint" />
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" value={ageMin} onChange={(e) => setAgeMin(Number(e.target.value || 10))} placeholder="Age min" />
          <Input type="number" value={ageMax} onChange={(e) => setAgeMax(Number(e.target.value || 14))} placeholder="Age max" />
        </div>
        <Input value={subjectTags} onChange={(e) => setSubjectTags(e.target.value)} placeholder="subject tags comma-separated" />
        <Input value={locationContext} onChange={(e) => setLocationContext(e.target.value)} placeholder="location context" />
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" value={classSize} onChange={(e) => setClassSize(Number(e.target.value || 25))} placeholder="Class size" />
          <Input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value || 45))}
            placeholder="Duration minutes"
          />
        </div>
        <Textarea value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="Learning focus" className="min-h-[100px]" />
        <Input
          value={checkpointPrefix}
          onChange={(e) => setCheckpointPrefix(e.target.value)}
          placeholder="QR checkpoint prefix (optional)"
        />
        <Button className="w-full bg-gradient-hero-glow" disabled={generating} onClick={() => void handleGenerate()}>
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Wand2 className="w-4 h-4 mr-2" />Generate draft</>}
        </Button>
      </div>

      {draft && (
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-foreground">{draft.title}</p>
              <p className="text-xs text-muted-foreground">slug: {draft.slug} · {draft.questType}</p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-primary/15 text-primary font-bold">
              {draft.steps.length} steps
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{draft.summary}</p>
          <div className="space-y-2">
            {draft.steps.map((s, i) => (
              <div key={`${s.title}-${i}`} className="rounded-xl border border-border/70 bg-background/50 px-3 py-2">
                <p className="text-xs font-bold text-foreground">
                  {i + 1}. {s.title} <span className="text-muted-foreground font-medium">({s.evidenceType})</span>
                </p>
                <p className="text-xs text-muted-foreground">{s.instruction}</p>
              </div>
            ))}
          </div>
          <Button className="w-full" disabled={saving} onClick={() => void handleSave()}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />Save draft to Supabase</>}
          </Button>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Sparkles size={12} className="text-primary" />
            Saved as visibility = draft. You can publish below.
          </p>
        </div>
      )}

      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-display font-bold text-foreground">Recent AI quests</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`px-2.5 h-8 rounded-lg text-[11px] font-semibold border ${
                onlyMine
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "bg-background/60 border-border text-muted-foreground"
              }`}
              onClick={() => setOnlyMine((v) => !v)}
            >
              {onlyMine ? "Only mine" : "All"}
            </button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={refreshingRecent}
              onClick={() => void refreshRecent()}
            >
              {refreshingRecent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Refresh"}
            </Button>
          </div>
        </div>
        {recent.length === 0 ? (
          <p className="text-xs text-muted-foreground">No quests yet. Generate and save your first draft above.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((q) => (
              <div key={q.id} className="rounded-xl border border-border/70 bg-background/50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{q.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {q.slug} · ages {q.age_min}-{q.age_max}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                      q.visibility === "published"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-amber-500/15 text-amber-200"
                    }`}
                  >
                    {q.visibility}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {q.visibility !== "published" ? (
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      disabled={publishingId === q.id}
                      onClick={() => void handleSetVisibility(q.id, "published")}
                    >
                      {publishingId === q.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Rocket className="w-3.5 h-3.5 mr-1" />
                          Publish
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={publishingId === q.id}
                      onClick={() => void handleSetVisibility(q.id, "draft")}
                    >
                      {publishingId === q.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Unpublish"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    disabled={publishingId === q.id}
                    onClick={() => void handleSetVisibility(q.id, "archived")}
                  >
                    {publishingId === q.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Archive className="w-3.5 h-3.5 mr-1" />
                        Archive
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => navigate(`/app/ar?quest=${encodeURIComponent(q.slug)}`)}
                  >
                    Preview in AR
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEducationalQuest;

