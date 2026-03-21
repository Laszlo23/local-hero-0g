import { randomUUID } from "crypto";
import { unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { db } from "./db.js";
import type { AuthenticatedRequest } from "./auth.js";
import { requirePrivyAuth } from "./auth.js";
import { config } from "./config.js";
import {
  download0gFileToBuffer,
  is0gStorageConfigured,
  isLikelyRootHash,
  readDownloadedFile,
  sniffContentType,
  uploadBytesTo0gStorage,
} from "./storage0g.js";

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const syncPayloadSchema = z.object({
  privyUserId: z.string().min(1),
  email: z.string().email().nullable().optional(),
  walletAddress: z.string().min(3).nullable().optional(),
});

const completeOnboardingSchema = z.object({
  displayName: z.string().trim().min(1).max(50),
  bio: z.string().max(160).optional().default(""),
  location: z.string().max(100).optional().default(""),
  avatarUrl: z.string().url().optional().nullable(),
  socials: z.record(z.string(), z.string()).optional().default({}),
});

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.post("/auth/sync", requirePrivyAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = syncPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
    return;
  }

  const auth = req.auth;
  if (!auth) {
    res.status(401).json({ error: "Missing auth context" });
    return;
  }

  if (parsed.data.privyUserId !== auth.privyUserId) {
    res.status(403).json({ error: "Token subject does not match body privyUserId" });
    return;
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const userResult = await client.query(
      `
      insert into users (privy_user_id, email)
      values ($1, $2)
      on conflict (privy_user_id)
      do update set email = coalesce(excluded.email, users.email), updated_at = now()
      returning id, privy_user_id, email
      `,
      [parsed.data.privyUserId, parsed.data.email ?? auth.email ?? null]
    );
    const user = userResult.rows[0] as { id: string; privy_user_id: string; email: string | null };
    await client.query(
      `
      insert into profiles (user_id, onboarding_completed)
      values ($1, false)
      on conflict (user_id) do nothing
      `,
      [user.id]
    );

    if (parsed.data.walletAddress) {
      await client.query(
        `
        insert into wallets (user_id, address, chain_type, wallet_type, is_primary)
        values ($1, $2, 'evm', 'embedded', true)
        on conflict (address, chain_type)
        do update set user_id = excluded.user_id, wallet_type = excluded.wallet_type, is_primary = true, updated_at = now()
        `,
        [user.id, parsed.data.walletAddress.toLowerCase()]
      );
    }

    const accessResult = await client.query(
      `
      select
        p.onboarding_completed as "onboardingCompleted",
        exists(select 1 from wallets w where w.user_id = $1) as "walletLinked",
        p.display_name as "displayName",
        p.avatar_url as "avatarUrl"
      from profiles p
      where p.user_id = $1
      limit 1
      `,
      [user.id]
    );

    await client.query("COMMIT");
    const access = accessResult.rows[0] as {
      onboardingCompleted: boolean;
      walletLinked: boolean;
      displayName: string | null;
      avatarUrl: string | null;
    };

    res.json({
      id: user.id,
      privyUserId: user.privy_user_id,
      email: user.email,
      walletAddress: parsed.data.walletAddress ?? null,
      onboardingCompleted: access?.onboardingCompleted ?? false,
      metadata: {
        display_name: access?.displayName ?? undefined,
        avatar_url: access?.avatarUrl ?? undefined,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed /auth/sync:", error);
    res.status(500).json({ error: "Failed to sync auth user" });
  } finally {
    client.release();
  }
});

router.get("/me/access-status", requirePrivyAuth, async (req: AuthenticatedRequest, res) => {
  const auth = req.auth;
  if (!auth) {
    res.status(401).json({ error: "Missing auth context" });
    return;
  }

  try {
    const result = await db.query(
      `
      select
        coalesce(p.onboarding_completed, false) as "onboardingCompleted",
        exists(select 1 from wallets w where w.user_id = u.id) as "walletLinked"
      from users u
      left join profiles p on p.user_id = u.id
      where u.privy_user_id = $1
      limit 1
      `,
      [auth.privyUserId]
    );

    if (!result.rowCount) {
      res.json({ onboardingCompleted: false, walletLinked: false });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed /me/access-status:", error);
    res.status(500).json({ error: "Failed to fetch access status" });
  }
});

router.post("/me/onboarding/complete", requirePrivyAuth, async (req: AuthenticatedRequest, res) => {
  const auth = req.auth;
  if (!auth) {
    res.status(401).json({ error: "Missing auth context" });
    return;
  }

  const parsed = completeOnboardingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
    return;
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const userResult = await client.query(
      `
      insert into users (privy_user_id, email)
      values ($1, $2)
      on conflict (privy_user_id)
      do update set email = coalesce(excluded.email, users.email), updated_at = now()
      returning id, privy_user_id, email
      `,
      [auth.privyUserId, auth.email ?? null]
    );
    const user = userResult.rows[0] as { id: string; privy_user_id: string; email: string | null };

    await client.query(
      `
      insert into profiles (
        user_id,
        display_name,
        bio,
        location,
        avatar_url,
        socials,
        onboarding_completed,
        updated_at
      )
      values ($1, $2, $3, $4, $5, $6::jsonb, true, now())
      on conflict (user_id)
      do update
        set display_name = excluded.display_name,
            bio = excluded.bio,
            location = excluded.location,
            avatar_url = excluded.avatar_url,
            socials = excluded.socials,
            onboarding_completed = true,
            updated_at = now()
      `,
      [
        user.id,
        parsed.data.displayName,
        parsed.data.bio || "",
        parsed.data.location || "",
        parsed.data.avatarUrl ?? null,
        JSON.stringify(parsed.data.socials ?? {}),
      ]
    );

    await client.query(
      `
      insert into hero_points (user_id, amount, reason)
      values ($1, 100, 'signup_bonus')
      on conflict (user_id, reason) do nothing
      `,
      [user.id]
    );

    await client.query("COMMIT");
    res.json({ ok: true, awardedSignupBonus: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed /me/onboarding/complete:", error);
    res.status(500).json({ error: "Failed to complete onboarding" });
  } finally {
    client.release();
  }
});

router.post(
  "/me/storage/upload",
  requirePrivyAuth,
  uploadMiddleware.single("file"),
  async (req: AuthenticatedRequest, res) => {
    const auth = req.auth;
    if (!auth) {
      res.status(401).json({ error: "Missing auth context" });
      return;
    }

    const file = (req as AuthenticatedRequest & { file?: { buffer: Buffer; originalname: string } }).file;
    if (!file?.buffer) {
      res.status(400).json({ error: 'Missing file (multipart field "file")' });
      return;
    }

    if (!is0gStorageConfigured()) {
      res.status(503).json({ error: "0G storage is not configured on this server" });
      return;
    }

    try {
      const { rootHash, txHash } = await uploadBytesTo0gStorage(file.buffer, file.originalname);
      const base = (config.publicApiBaseUrl || `http://127.0.0.1:${config.port}`).replace(/\/$/, "");
      const url = `${base}/storage/files/${encodeURIComponent(rootHash)}`;
      res.json({ rootHash, txHash, url });
    } catch (error) {
      console.error("Failed /me/storage/upload:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Upload failed" });
    }
  }
);

/** Public file proxy — avatar URLs stored in DB must resolve without auth headers. */
router.get("/storage/files/:rootHash", async (req, res) => {
  if (!is0gStorageConfigured()) {
    res.status(503).json({ error: "0G storage is not configured on this server" });
    return;
  }

  let rootHash = req.params.rootHash;
  try {
    rootHash = decodeURIComponent(rootHash);
  } catch {
    res.status(400).json({ error: "Invalid root hash" });
    return;
  }

  if (!isLikelyRootHash(rootHash)) {
    res.status(400).json({ error: "Invalid root hash" });
    return;
  }

  const outPath = join(tmpdir(), `zg-dl-${randomUUID()}`);
  try {
    await download0gFileToBuffer(rootHash, outPath);
    const buf = await readDownloadedFile(outPath);
    await unlink(outPath);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.type(sniffContentType(buf));
    res.send(buf);
  } catch (error) {
    await unlink(outPath).catch(() => {});
    console.error("Failed /storage/files:", error);
    res.status(404).json({ error: "File not found" });
  }
});
