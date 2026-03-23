/**
 * Parses `src/content/build-in-public.md` for the Build in Public page.
 *
 * Supported shape:
 * - Optional YAML frontmatter (`updated`, `hero_title` optional override)
 * - Intro paragraph(s) before first `##` (shown under hero)
 * - `## Today shipped` — bullet list (`- item`)
 * - `## Next up` — bullet list or numbered lines
 * - `## Timeline` — blocks starting with `### Title`; optional first line `icon: wrench|rocket|sparkles`
 */

export type BuildInPublicTimelineIcon = "wrench" | "rocket" | "sparkles";

export type BuildInPublicTimelineEntry = {
  title: string;
  detail: string;
  icon: BuildInPublicTimelineIcon;
};

export type BuildInPublicParsed = {
  updated?: string;
  heroTitle?: string;
  intro: string;
  todayShipped: string[];
  nextUp: string[];
  timeline: BuildInPublicTimelineEntry[];
};

function parseFrontmatter(raw: string): { front: Record<string, string>; body: string } {
  const trimmed = raw.trimStart();
  if (!trimmed.startsWith("---\n") && !trimmed.startsWith("---\r\n")) {
    return { front: {}, body: raw };
  }
  const end = trimmed.indexOf("\n---", 4);
  if (end === -1) {
    return { front: {}, body: raw };
  }
  const block = trimmed.slice(4, end).replace(/\r\n/g, "\n");
  const body = trimmed.slice(end + 4).replace(/^\s*\n/, "");
  const front: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (m) front[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return { front, body };
}

function extractSection(body: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Avoid `$` with `/m` (matches before every newline); stop at next `## ` heading or EOF.
  const re = new RegExp(
    `(?:^|\\n)##\\s+${escaped}\\s*\\r?\\n([\\s\\S]*?)(?=\\n##\\s+|$)`,
  );
  const m = body.match(re);
  return m ? m[1].trim() : "";
}

function bulletLines(section: string): string[] {
  return section
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim())
    .filter(Boolean);
}

function nextUpLines(section: string): string[] {
  const bullets = bulletLines(section);
  if (bullets.length > 0) return bullets;
  return section
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => l.replace(/^\d+[\].)]\s*/, "").trim())
    .filter(Boolean);
}

const ICON_RE = /^icon:\s*(wrench|rocket|sparkles)\s*$/i;

function parseTimeline(section: string): BuildInPublicTimelineEntry[] {
  const text = section.trim();
  if (!text) return [];
  const entries: BuildInPublicTimelineEntry[] = [];
  const re = /(?:^|\n)###\s+(.+?)\s*\r?\n([\s\S]*?)(?=\n###\s+|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const title = m[1].trim();
    let rest = m[2].trim();
    let icon: BuildInPublicTimelineIcon = "sparkles";
    const lines = rest.split(/\r?\n/);
    if (lines.length && ICON_RE.test(lines[0].trim())) {
      const iconMatch = lines[0].trim().match(ICON_RE);
      if (iconMatch) icon = iconMatch[1].toLowerCase() as BuildInPublicTimelineIcon;
      rest = lines.slice(1).join("\n").trim();
    }
    if (title && rest) entries.push({ title, detail: rest, icon });
  }
  return entries;
}

function introBeforeFirstH2(body: string): string {
  const m = body.match(/^([\s\S]*?)(?=^##\s+)/m);
  if (!m) return "";
  return m[1].trim();
}

export function parseBuildInPublicMarkdown(raw: string): BuildInPublicParsed {
  const { front, body } = parseFrontmatter(raw);
  const intro = introBeforeFirstH2(body);
  const todayShipped = bulletLines(extractSection(body, "Today shipped"));
  const nextUp = nextUpLines(extractSection(body, "Next up"));
  const timeline = parseTimeline(extractSection(body, "Timeline"));

  return {
    updated: front.updated,
    heroTitle: front.hero_title,
    intro,
    todayShipped,
    nextUp,
    timeline,
  };
}
