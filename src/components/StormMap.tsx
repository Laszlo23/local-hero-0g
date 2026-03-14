import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Circle, CircleMarker, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Storm, StormDrop, getRarityConfig, type StormDropRarity } from "@/lib/storms";

// Fix default marker icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface StormMapProps {
  storm: Storm;
  drops: StormDrop[];
  claimedIds: Set<string>;
  userPos: { lat: number; lng: number } | null;
  onDropSelect: (drop: StormDrop) => void;
}

// Component to recenter map
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const hasCentered = useRef(false);
  useEffect(() => {
    if (!hasCentered.current) {
      map.setView([lat, lng], 15);
      hasCentered.current = true;
    }
  }, [lat, lng, map]);
  return null;
}

const rarityColors: Record<string, string> = {
  legendary: "#facc15",
  rare: "#a855f7",
  common: "#22c55e",
};

const StormMap = ({ storm, drops, claimedIds, userPos, onDropSelect }: StormMapProps) => {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/30 relative" style={{ height: 340 }}>
      <MapContainer
        center={[storm.center_lat, storm.center_lng]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", background: "hsl(160 10% 6%)" }}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Storm zone circle */}
        <Circle
          center={[storm.center_lat, storm.center_lng]}
          radius={storm.radius}
          pathOptions={{
            color: "#facc15",
            fillColor: "#facc15",
            fillOpacity: 0.06,
            weight: 2,
            dashArray: "8 4",
            opacity: 0.5,
          }}
        />

        {/* Drop markers */}
        {drops.map((drop) => {
          const claimed = claimedIds.has(drop.id);
          const color = claimed ? "#666" : rarityColors[drop.rarity] || "#22c55e";
          const config = getRarityConfig(drop.rarity as StormDropRarity);

          return (
            <CircleMarker
              key={drop.id}
              center={[drop.lat, drop.lng]}
              radius={drop.rarity === "legendary" ? 10 : drop.rarity === "rare" ? 8 : 6}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: claimed ? 0.2 : 0.7,
                weight: claimed ? 1 : 2,
                opacity: claimed ? 0.3 : 0.9,
              }}
              eventHandlers={{
                click: () => {
                  if (!claimed) onDropSelect(drop);
                },
              }}
            >
              <Popup className="storm-popup">
                <div style={{ textAlign: "center", minWidth: 100 }}>
                  <div style={{ fontSize: 20 }}>{claimed ? "✅" : config.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 12, marginTop: 4 }}>
                    {claimed ? "Claimed" : `${config.label} Chest`}
                  </div>
                  {!claimed && (
                    <div style={{ fontSize: 11, color: "#22c55e", marginTop: 2 }}>
                      +{drop.reward_value} HERO
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* User position */}
        {userPos && (
          <CircleMarker
            center={[userPos.lat, userPos.lng]}
            radius={8}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.9,
              weight: 3,
              opacity: 1,
            }}
          >
            <Popup>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 12 }}>
                📍 You are here
              </div>
            </Popup>
          </CircleMarker>
        )}

        <RecenterMap lat={storm.center_lat} lng={storm.center_lng} />
      </MapContainer>

      {/* Map legend overlay */}
      <div className="absolute bottom-2 left-2 z-[1000] glass rounded-lg px-2.5 py-1.5 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
          <span className="text-[9px] text-foreground font-medium">Common</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
          <span className="text-[9px] text-foreground font-medium">Rare</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#facc15]" />
          <span className="text-[9px] text-foreground font-medium">Legendary</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6] border border-white/50" />
          <span className="text-[9px] text-foreground font-medium">You</span>
        </div>
      </div>
    </div>
  );
};

export default StormMap;
