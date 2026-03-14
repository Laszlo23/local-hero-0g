import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("8787"),
  DATABASE_URL: z.string().url(),
  PRIVY_JWKS_URL: z.string().url().default("https://auth.privy.io/api/v1/apps/jwks"),
  PRIVY_ISSUER: z.string().url().default("https://auth.privy.io"),
  PRIVY_AUDIENCE: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
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
};
