import { z } from "zod";
import { config } from "./config.js";

export const questDraftRequestSchema = z.object({
  titleHint: z.string().trim().min(3).max(140),
  ageMin: z.number().int().min(5).max(25),
  ageMax: z.number().int().min(5).max(25),
  subjectTags: z.array(z.string().trim().min(2).max(30)).min(1).max(8),
  locationContext: z.string().trim().min(2).max(200),
  classSize: z.number().int().min(1).max(80).default(25),
  durationMinutes: z.number().int().min(10).max(240).default(45),
  focus: z.string().trim().min(5).max(400),
});

const stepSchema = z.object({
  title: z.string().min(2).max(140),
  instruction: z.string().min(10).max(600),
  evidenceType: z.enum(["none", "field_observation", "qr_scan", "quiz", "photo"]).default("none"),
  arVisual: z.enum(["tree", "book", "chest", "leaf", "water", "recycle"]).default("leaf"),
  arEmoji: z.string().min(1).max(4).default("🌿"),
  arX: z.number().min(5).max(95).default(50),
  arY: z.number().min(5).max(95).default(50),
  qrExpected: z.string().max(180).optional(),
  quizPrompt: z.string().max(300).optional(),
  quizOptionA: z.string().max(200).optional(),
  quizOptionB: z.string().max(200).optional(),
  quizCorrect: z.enum(["a", "b"]).optional(),
  pointsOverride: z.number().int().min(1).max(200).optional(),
});

export const questDraftResponseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]{3,80}$/),
  title: z.string().min(2).max(140),
  summary: z.string().min(20).max(500),
  ageMin: z.number().int().min(5).max(25),
  ageMax: z.number().int().min(5).max(25),
  learningObjectives: z.array(z.string().min(5).max(200)).min(2).max(6),
  subjectTags: z.array(z.string().min(2).max(30)).min(1).max(10),
  questType: z.enum(["ar_overlay", "field_observation", "qr_trail", "photo_evidence", "hybrid"]).default("hybrid"),
  pointsPerStep: z.number().int().min(1).max(100).default(18),
  bonusComplete: z.number().int().min(5).max(300).default(40),
  steps: z.array(stepSchema).min(3).max(8),
});

function ensureAiConfigured() {
  if (!config.ogAiApiUrl || !config.ogAiApiKey) {
    throw new Error(
      "Quest draft AI is not configured (set OG_AI_API_URL and OG_AI_API_KEY). Endpoint must be OpenAI-compatible /v1/chat/completions, e.g. 0G Compute or another gateway."
    );
  }
}

type DraftRequest = z.infer<typeof questDraftRequestSchema>;
type DraftResponse = z.infer<typeof questDraftResponseSchema>;

function buildPrompt(input: DraftRequest): string {
  const outputSchema = {
    slug: "string kebab-case",
    title: "string",
    summary: "string",
    ageMin: "number",
    ageMax: "number",
    learningObjectives: ["string"],
    subjectTags: ["string"],
    questType: "ar_overlay|field_observation|qr_trail|photo_evidence|hybrid",
    pointsPerStep: "number",
    bonusComplete: "number",
    steps: [
      {
        title: "string",
        instruction: "string",
        evidenceType: "none|field_observation|qr_scan|quiz|photo",
        arVisual: "tree|book|chest|leaf|water|recycle",
        arEmoji: "string emoji",
        arX: "number 5..95",
        arY: "number 5..95",
        qrExpected: "string optional",
        quizPrompt: "string optional",
        quizOptionA: "string optional",
        quizOptionB: "string optional",
        quizCorrect: "a|b optional",
        pointsOverride: "number optional",
      },
    ],
  };
  return [
    "Create one educational AR + real-world quest draft for Local Hero.",
    "Return ONLY valid minified JSON (no markdown, no prose).",
    "Use this schema exactly:",
    JSON.stringify(outputSchema),
    "Requirements:",
    "- Must work for a whole school class outdoors.",
    "- Include concrete, safe instructions.",
    "- At least one field_observation step and one quiz OR qr_scan step.",
    "- If evidenceType=quiz, include quizPrompt, quizOptionA, quizOptionB, quizCorrect.",
    "- If evidenceType=qr_scan, include qrExpected starting with HERO-EDU:",
    "- arX and arY must be between 5 and 95.",
    `Inputs: ${JSON.stringify(input)}`,
  ].join("\n");
}

export async function generateEducationalQuestDraft(input: DraftRequest): Promise<DraftResponse> {
  ensureAiConfigured();
  const body = {
    model: config.ogAiModel,
    temperature: 0.35,
    messages: [
      {
        role: "system",
        content:
          "You are a curriculum-aware quest designer. Output only strict JSON matching the requested schema. Keep content safe and practical for minors.",
      },
      { role: "user", content: buildPrompt(input) },
    ],
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const resp = await fetch(`${config.ogAiApiUrl!.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.ogAiApiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`AI request failed (${resp.status}): ${text.slice(0, 300)}`);
    }
    const raw = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = raw.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("AI returned empty content");
    const parsed = JSON.parse(content);
    const validated = questDraftResponseSchema.parse(parsed);
    return validated;
  } finally {
    clearTimeout(timeout);
  }
}

