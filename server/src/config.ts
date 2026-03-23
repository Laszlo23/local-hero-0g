import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("8787"),
  DATABASE_URL: z.string().url(),
  PRIVY_JWKS_URL: z.string().url().default("https://auth.privy.io/api/v1/apps/jwks"),
  PRIVY_ISSUER: z.string().url().default("https://auth.privy.io"),
  PRIVY_AUDIENCE: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  /** Base URL used in stored avatar/file URLs (e.g. http://localhost:8787) */
  PUBLIC_API_BASE_URL: z.string().url().optional(),
  /** 0G EVM RPC (must match network used for storage txs) */
  OG_0G_EVM_RPC: z.string().url().default("https://evmrpc-testnet.0g.ai"),
  /** 0G storage indexer HTTP endpoint */
  OG_0G_INDEXER_RPC: z.string().url().default("https://indexer-storage-testnet-turbo.0g.ai"),
  /** Hex private key for the wallet that pays gas for storage uploads (fund on testnet faucet) */
  OG_0G_STORAGE_PRIVATE_KEY: z.string().optional(),

  /** HERO ERC-20 (points redeem) — deploy `HeroToken.sol`, grant MINTER_ROLE to this key */
  HERO_TOKEN_ADDRESS: z.string().optional(),
  HERO_TOKEN_MINTER_PRIVATE_KEY: z.string().optional(),
  /** RPC for token mint txs (default: same as 0G EVM) */
  HERO_TOKEN_CHAIN_RPC: z.string().url().optional(),
  /** How many in-app points = 1 full HERO (18 decimals), e.g. 100 */
  POINTS_PER_HERO_TOKEN: z.coerce.number().int().positive().default(100),
  /** Minimum points per single redeem */
  MIN_REDEEM_POINTS: z.coerce.number().int().positive().default(100),
  HERO_CHAIN_ID: z.coerce.number().int().default(16602),
  /** 0G AI / compatible chat endpoint for structured creator quest drafts */
  OG_AI_API_URL: z.string().url().optional(),
  OG_AI_API_KEY: z.string().optional(),
  OG_AI_MODEL: z.string().default("google/gemini-2.0-flash-001"),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid server environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  port: Number(parsed.data.PORT),
  databaseUrl: parsed.data.DATABASE_URL,
  privyJwksUrl: parsed.data.PRIVY_JWKS_URL,
  privyIssuer: parsed.data.PRIVY_ISSUER,
  privyAudience: parsed.data.PRIVY_AUDIENCE,
  corsOrigin: parsed.data.CORS_ORIGIN,
  publicApiBaseUrl: parsed.data.PUBLIC_API_BASE_URL,
  og0gEvmRpc: parsed.data.OG_0G_EVM_RPC,
  og0gIndexerRpc: parsed.data.OG_0G_INDEXER_RPC,
  og0gStoragePrivateKey: parsed.data.OG_0G_STORAGE_PRIVATE_KEY,
  heroTokenAddress: parsed.data.HERO_TOKEN_ADDRESS,
  heroTokenMinterPrivateKey: parsed.data.HERO_TOKEN_MINTER_PRIVATE_KEY,
  heroTokenChainRpc: parsed.data.HERO_TOKEN_CHAIN_RPC ?? parsed.data.OG_0G_EVM_RPC,
  pointsPerHeroToken: parsed.data.POINTS_PER_HERO_TOKEN,
  minRedeemPoints: parsed.data.MIN_REDEEM_POINTS,
  heroChainId: parsed.data.HERO_CHAIN_ID,
  ogAiApiUrl: parsed.data.OG_AI_API_URL,
  ogAiApiKey: parsed.data.OG_AI_API_KEY,
  ogAiModel: parsed.data.OG_AI_MODEL,
};
