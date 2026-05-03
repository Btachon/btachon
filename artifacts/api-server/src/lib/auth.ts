import jwt from "jsonwebtoken";
import { type Request, type Response } from "express";
import type { AuthUser } from "@workspace/api-zod";

export const JWT_COOKIE = "btachon_jwt";
export const JWT_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return secret;
}

export function signJwt(user: AuthUser): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    },
    getJwtSecret(),
    { expiresIn: JWT_TTL_SECONDS },
  );
}

export function verifyJwt(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;
    return {
      id: payload.sub as string,
      email: payload.email ?? null,
      firstName: payload.firstName ?? null,
      lastName: payload.lastName ?? null,
      profileImageUrl: payload.profileImageUrl ?? null,
    };
  } catch {
    return null;
  }
}

export function getBearerToken(req: Request): string | undefined {
  const header = req.headers["authorization"];
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return req.cookies?.[JWT_COOKIE];
}

export function setJwtCookie(res: Response, token: string) {
  res.cookie(JWT_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: JWT_TTL_SECONDS * 1000,
  });
}

export function clearJwtCookie(res: Response) {
  res.clearCookie(JWT_COOKIE, { path: "/" });
}

export function getOrigin(req: Request): string {
  const proto =
    (req.headers["x-forwarded-proto"] as string | undefined)?.split(",")[0]?.trim() ?? "https";
  const host =
    (req.headers["x-forwarded-host"] as string | undefined)?.split(",")[0]?.trim() ??
    req.headers["host"] ??
    "localhost";
  return `${proto}://${host}`;
}

export function getFrontendUrl(req: Request): string {
  return process.env.FRONTEND_URL?.replace(/\/$/, "") ?? getOrigin(req);
}

// ─── Google OAuth helpers ─────────────────────────────────────────────────────

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export function buildGoogleAuthUrl(callbackUrl: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state,
  });
  return `${GOOGLE_AUTH_URL}?${params}`;
}

export async function exchangeGoogleCode(
  code: string,
  callbackUrl: string,
): Promise<{ sub: string; email: string; name: string; given_name?: string; family_name?: string; picture?: string }> {
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: callbackUrl,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new Error(`Google token exchange failed: ${text}`);
  }

  const tokens = (await tokenRes.json()) as { access_token: string };

  const userRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userRes.ok) throw new Error("Failed to fetch Google user info");

  const userData = await userRes.json() as { id?: string; sub?: string; email: string; name: string; given_name?: string; family_name?: string; picture?: string };
  return {
    sub: userData.sub ?? userData.id ?? "",
    email: userData.email,
    name: userData.name,
    given_name: userData.given_name,
    family_name: userData.family_name,
    picture: userData.picture,
  };
}
