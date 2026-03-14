import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Plus, Trash2, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  DiscoveryDrop,
  getAllDrops,
  createDrop,
  deleteDrop,
  getRarityConfig,
  DropRarity,
  DropRewardType,
} from "@/lib/discovery-drops";

export default function AdminDrops() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [drops, setDrops] = useState<DiscoveryDrop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [rarity, setRarity] = useState<DropRarity>("common");
  const [rewardType, setRewardType] = useState<DropRewardType>("token");
  const [rewardValue, setRewardValue] = useState("25");
  const [maxClaims, setMaxClaims] = useState("100");
  const [durationHours, setDurationHours] = useState("4");
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorReward, setSponsorReward] = useState("");

  useEffect(() => {
    if (!adminLoading && !isAdmin) navigate("/app");
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    getAllDrops().then(setDrops);
  }, []);

  const handleCreate = async () => {
    if (!title || !lat || !lng) {
      toast({ title: "Missing fields", description: "Title and location are required.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const endsAt = new Date(Date.now() + Number(durationHours) * 3600000).toISOString();
    const success = await createDrop({
      title,
      description,
      latitude: Number(lat),
      longitude: Number(lng),
      rarity,
      reward_type: rewardType,
      reward_value: Number(rewardValue),
      max_claims: Number(maxClaims),
      ends_at: endsAt,
      sponsor_name: sponsorName || undefined,
      sponsor_reward_description: sponsorReward || undefined,
    });
    setSubmitting(false);
    if (success) {
      toast({ title: "Drop created!" });
      setShowForm(false);
      setTitle(""); setDescription(""); setLat(""); setLng("");
      getAllDrops().then(setDrops);
    } else {
      toast({ title: "Failed to create drop", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (await deleteDrop(id)) {
      setDrops((d) => d.filter((x) => x.id !== id));
      toast({ title: "Drop deleted" });
    }
  };

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (p) => { setLat(String(p.coords.latitude)); setLng(String(p.coords.longitude)); },
      () => toast({ title: "Location unavailable", variant: "destructive" })
    );
  };

  if (adminLoading) return <div className="p-8 text-center text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold font-display">Manage Discovery Drops</h1>
      </div>

      <Button onClick={() => setShowForm(!showForm)} className="w-full mb-4">
        <Plus className="w-4 h-4 mr-2" /> Create New Drop
      </Button>

      {showForm && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border border-border rounded-2xl p-4 mb-6 space-y-3 bg-card">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Free coffee at Main St Cafe" />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Visit the cafe and show the app" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Latitude</Label>
              <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="52.5200" />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="13.4050" />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={useMyLocation}>
            <MapPin className="w-3 h-3 mr-1" /> Use my location
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Rarity</Label>
              <select value={rarity} onChange={(e) => setRarity(e.target.value as DropRarity)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
            <div>
              <Label>Reward Type</Label>
              <select value={rewardType} onChange={(e) => setRewardType(e.target.value as DropRewardType)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="token">Token</option>
                <option value="nft">NFT</option>
                <option value="partner_reward">Partner Reward</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Reward (HERO)</Label>
              <Input type="number" value={rewardValue} onChange={(e) => setRewardValue(e.target.value)} />
            </div>
            <div>
              <Label>Max Claims</Label>
              <Input type="number" value={maxClaims} onChange={(e) => setMaxClaims(e.target.value)} />
            </div>
            <div>
              <Label>Duration (hrs)</Label>
              <Input type="number" value={durationHours} onChange={(e) => setDurationHours(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Sponsor Name (optional)</Label>
            <Input value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} placeholder="Main St Cafe" />
          </div>
          <div>
            <Label>Sponsor Reward (optional)</Label>
            <Input value={sponsorReward} onChange={(e) => setSponsorReward(e.target.value)} placeholder="Free coffee for first 20 visitors" />
          </div>

          <Button onClick={handleCreate} disabled={submitting} className="w-full">
            {submitting ? "Creating…" : "Create Drop"}
          </Button>
        </motion.div>
      )}

      {/* Existing drops */}
      <div className="space-y-3">
        {drops.map((drop) => {
          const rc = getRarityConfig(drop.rarity as any);
          return (
            <div key={drop.id} className={`border rounded-xl p-3 ${rc.bg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span>{rc.emoji}</span>
                    <span className="font-semibold text-sm">{drop.title}</span>
                    <Badge variant="outline" className="text-[10px]">{drop.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {drop.current_claims}/{drop.max_claims} claimed · +{drop.reward_value} HERO
                    {drop.sponsor_name && ` · by ${drop.sponsor_name}`}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(drop.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          );
        })}
        {drops.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No drops yet. Create your first one!</p>
        )}
      </div>
    </div>
  );
}
