/**
 * Canvas-based milestone card generator for social sharing.
 * Creates beautiful OG-style images (1200×630) with user stats.
 */

export type MilestoneType = "quest_complete" | "level_up" | "streak" | "nft_minted" | "badge";

export interface MilestoneCardData {
  type: MilestoneType;
  displayName: string;
  title: string;        // e.g. quest name, badge name
  subtitle?: string;    // e.g. "Level 5", "7-day streak"
  points?: number;
  streak?: number;
  level?: number;
  questsCompleted?: number;
  treesPlanted?: number;
  neighborsHelped?: number;
}

const CARD_W = 1200;
const CARD_H = 630;

const COLORS = {
  bg1: "#0d1a14",
  bg2: "#0a1f15",
  primary: "#22c55e",
  primaryGlow: "#4ade80",
  yellow: "#facc15",
  orange: "#f97316",
  purple: "#a855f7",
  white: "#f2f2f2",
  muted: "#94a3b8",
  cardBg: "rgba(255,255,255,0.05)",
  cardBorder: "rgba(34,197,94,0.2)",
};

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function getTypeConfig(type: MilestoneType) {
  switch (type) {
    case "quest_complete":
      return { emoji: "⚡", label: "QUEST COMPLETED", gradient: [COLORS.primary, "#059669"] };
    case "level_up":
      return { emoji: "🚀", label: "LEVEL UP", gradient: [COLORS.purple, "#7c3aed"] };
    case "streak":
      return { emoji: "🔥", label: "STREAK MILESTONE", gradient: [COLORS.orange, "#ea580c"] };
    case "nft_minted":
      return { emoji: "🏆", label: "NFT MINTED", gradient: [COLORS.yellow, "#eab308"] };
    case "badge":
      return { emoji: "🛡️", label: "BADGE UNLOCKED", gradient: [COLORS.yellow, COLORS.orange] };
  }
}

export async function generateMilestoneCard(data: MilestoneCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d")!;
  const config = getTypeConfig(data.type);

  // === Background ===
  const bgGrad = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
  bgGrad.addColorStop(0, COLORS.bg1);
  bgGrad.addColorStop(1, COLORS.bg2);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Subtle grid pattern
  ctx.strokeStyle = "rgba(34,197,94,0.04)";
  ctx.lineWidth = 1;
  for (let i = 0; i < CARD_W; i += 40) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CARD_H); ctx.stroke();
  }
  for (let i = 0; i < CARD_H; i += 40) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CARD_W, i); ctx.stroke();
  }

  // Glow orbs
  const orb1 = ctx.createRadialGradient(200, 150, 0, 200, 150, 300);
  orb1.addColorStop(0, `${config.gradient[0]}22`);
  orb1.addColorStop(1, "transparent");
  ctx.fillStyle = orb1;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const orb2 = ctx.createRadialGradient(1000, 500, 0, 1000, 500, 350);
  orb2.addColorStop(0, `${config.gradient[1]}18`);
  orb2.addColorStop(1, "transparent");
  ctx.fillStyle = orb2;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // === Top badge ===
  const badgeText = config.label;
  ctx.font = "bold 13px 'Inter', sans-serif";
  const badgeW = ctx.measureText(badgeText).width + 40;
  const badgeX = (CARD_W - badgeW) / 2;
  const badgeY = 50;

  drawRoundedRect(ctx, badgeX, badgeY, badgeW, 32, 16);
  ctx.fillStyle = `${config.gradient[0]}30`;
  ctx.fill();
  ctx.strokeStyle = `${config.gradient[0]}60`;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = config.gradient[0];
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 13px 'Inter', sans-serif";
  ctx.fillText(badgeText, CARD_W / 2, badgeY + 16);

  // === Emoji ===
  ctx.font = "64px serif";
  ctx.textAlign = "center";
  ctx.fillText(config.emoji, CARD_W / 2, 140);

  // === Title ===
  ctx.font = "bold 42px 'Space Grotesk', sans-serif";
  ctx.fillStyle = COLORS.white;
  ctx.textAlign = "center";
  const titleText = data.title.length > 30 ? data.title.slice(0, 28) + "…" : data.title;
  ctx.fillText(titleText, CARD_W / 2, 210);

  // === Subtitle ===
  if (data.subtitle) {
    ctx.font = "500 20px 'Inter', sans-serif";
    ctx.fillStyle = COLORS.muted;
    ctx.fillText(data.subtitle, CARD_W / 2, 250);
  }

  // === User name ===
  ctx.font = "600 18px 'Inter', sans-serif";
  ctx.fillStyle = COLORS.primaryGlow;
  ctx.fillText(`@${data.displayName}`, CARD_W / 2, 290);

  // === Stats row ===
  const stats: { label: string; value: string; color: string }[] = [];
  if (data.points !== undefined) stats.push({ label: "HERO Points", value: data.points.toLocaleString(), color: COLORS.yellow });
  if (data.level !== undefined) stats.push({ label: "Level", value: `${data.level}`, color: COLORS.purple });
  if (data.streak !== undefined) stats.push({ label: "Day Streak", value: `${data.streak}`, color: COLORS.orange });
  if (data.questsCompleted !== undefined) stats.push({ label: "Quests", value: `${data.questsCompleted}`, color: COLORS.primary });
  if (data.treesPlanted !== undefined && data.treesPlanted > 0) stats.push({ label: "Trees", value: `${data.treesPlanted}`, color: COLORS.primary });
  if (data.neighborsHelped !== undefined && data.neighborsHelped > 0) stats.push({ label: "Neighbors", value: `${data.neighborsHelped}`, color: COLORS.primary });

  // Limit to 4 stats
  const displayStats = stats.slice(0, 4);
  if (displayStats.length > 0) {
    const statCardW = 140;
    const statCardH = 80;
    const gap = 20;
    const totalW = displayStats.length * statCardW + (displayStats.length - 1) * gap;
    const startX = (CARD_W - totalW) / 2;
    const statY = 330;

    displayStats.forEach((stat, i) => {
      const x = startX + i * (statCardW + gap);
      drawRoundedRect(ctx, x, statY, statCardW, statCardH, 12);
      ctx.fillStyle = COLORS.cardBg;
      ctx.fill();
      ctx.strokeStyle = COLORS.cardBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = "bold 28px 'Space Grotesk', sans-serif";
      ctx.fillStyle = stat.color;
      ctx.textAlign = "center";
      ctx.fillText(stat.value, x + statCardW / 2, statY + 35);

      ctx.font = "500 11px 'Inter', sans-serif";
      ctx.fillStyle = COLORS.muted;
      ctx.fillText(stat.label, x + statCardW / 2, statY + 60);
    });
  }

  // === Bottom bar ===
  const footerY = CARD_H - 70;
  ctx.beginPath();
  ctx.moveTo(100, footerY);
  ctx.lineTo(CARD_W - 100, footerY);
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // HERO branding
  ctx.font = "bold 20px 'Space Grotesk', sans-serif";
  const heroGrad = ctx.createLinearGradient(CARD_W / 2 - 60, 0, CARD_W / 2 + 60, 0);
  heroGrad.addColorStop(0, COLORS.primary);
  heroGrad.addColorStop(1, COLORS.primaryGlow);
  ctx.fillStyle = heroGrad;
  ctx.textAlign = "center";
  ctx.fillText("LOCAL HERO", CARD_W / 2, footerY + 30);

  ctx.font = "400 12px 'Inter', sans-serif";
  ctx.fillStyle = COLORS.muted;
  ctx.fillText("Real-world quests • On-chain rewards • Built on 0G Chain", CARD_W / 2, footerY + 52);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

/** Download the card as PNG */
export function downloadCard(blob: Blob, filename = "hero-milestone.png") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Share via Web Share API or copy URL */
export async function shareCard(blob: Blob, data: MilestoneCardData) {
  const file = new File([blob], "hero-milestone.png", { type: "image/png" });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: `HERO – ${data.title}`,
        text: `I just ${data.type === "quest_complete" ? "completed a quest" : data.type === "level_up" ? "leveled up" : data.type === "streak" ? "hit a streak milestone" : "earned an achievement"} on LOCAL HERO! 🦸‍♂️ #LocalHero #0GChain`,
        files: [file],
      });
      return true;
    } catch {
      // User cancelled
    }
  }

  // Fallback: download
  downloadCard(blob);
  return true;
}
