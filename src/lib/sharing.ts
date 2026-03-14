/**
 * Universal social sharing utility using Web Share API with clipboard fallback
 */

export interface ShareOptions {
  title: string;
  text: string;
  url?: string;
}

export async function shareContent(options: ShareOptions): Promise<boolean> {
  const { title, text, url } = options;

  // Try native Web Share API first (works on mobile + some desktop)
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (e) {
      // User cancelled or share failed – fall through to clipboard
      if ((e as DOMException)?.name === "AbortError") return false;
    }
  }

  // Fallback: copy to clipboard
  const copyText = url ? `${text}\n${url}` : text;
  try {
    await navigator.clipboard.writeText(copyText);
    return true;
  } catch {
    // Last resort: textarea hack for older browsers
    const ta = document.createElement("textarea");
    ta.value = copyText;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  }
}

const SHARE_URL = "https://localhero.space";
const SOCIALS = "@0gLocalHero";

/** Pre-built share templates */
export const shareTemplates = {
  questComplete: (questName: string) =>
    shareContent({
      title: "I completed a HERO quest!",
      text: `Just completed "${questName}" on Local Hero 🦸‍♂️ Earning rewards for real-world good deeds!\n\nFollow us ${SOCIALS}\n#LocalHero #0GChain`,
      url: SHARE_URL,
    }),

  badge: (badgeName: string) =>
    shareContent({
      title: "New achievement unlocked!",
      text: `Just unlocked the "${badgeName}" badge on Local Hero 🏆 Join the movement!\n\nFollow us ${SOCIALS}\n#LocalHero #0GChain`,
      url: SHARE_URL,
    }),

  campaignTask: (taskTitle: string, platform: string) =>
    shareContent({
      title: `Local Hero x ${platform}`,
      text: `I'm supporting Local Hero's Genesis Campaign! ✅ ${taskTitle} — Join the first 777 heroes 🌱\n\nFollow us ${SOCIALS}\n#LocalHero #0GChain`,
      url: SHARE_URL,
    }),

  treegenEvolution: (treeName: string, stage: number) =>
    shareContent({
      title: "My tree badge evolved!",
      text: `My tree "${treeName}" just reached stage ${stage}! 🌳 Growing with every good deed on Local Hero\n\nFollow us ${SOCIALS}\n#LocalHero #0GChain`,
      url: SHARE_URL,
    }),

  referral: (code: string) =>
    shareContent({
      title: "Join Local Hero",
      text: `Join Local Hero and earn rewards for real-world good deeds! Use my code: ${code} 🦸‍♂️\n\nFollow us ${SOCIALS}\n#LocalHero #0GChain`,
      url: `https://localhero.space/onboarding?ref=${code}`,
    }),

  general: () =>
    shareContent({
      title: "Local Hero – Real-World Quests",
      text: `Earn rewards for doing good in your community 🌱\n\nFollow us ${SOCIALS}\n#LocalHero #0GChain`,
      url: SHARE_URL,
    }),
};
