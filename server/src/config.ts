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
};
