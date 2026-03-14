import type { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { config } from "./config.js";

const jwks = createRemoteJWKSet(new URL(config.privyJwksUrl));

export interface AuthenticatedRequest extends Request {
  auth?: {
    privyUserId: string;
    email?: string | null;
    rawClaims: Record<string, unknown>;
  };
}

export async function requirePrivyAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing bearer token" });
      return;
    }

    const token = header.slice("Bearer ".length);
    const { payload } = await jwtVerify(token, jwks, {
      issuer: config.privyIssuer,
      ...(config.privyAudience ? { audience: config.privyAudience } : {}),
    });

    const sub = payload.sub;
    if (!sub) {
      res.status(401).json({ error: "Token missing subject" });
      return;
    }

    req.auth = {
      privyUserId: sub,
      email: typeof payload.email === "string" ? payload.email : null,
      rawClaims: payload as Record<string, unknown>,
    };
    next();
  } catch (error) {
    console.error("Privy token verification failed:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}
