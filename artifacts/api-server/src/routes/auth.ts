import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router, type IRouter, type Request, type Response } from "express";
import { GetCurrentAuthUserResponse } from "@workspace/api-zod";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  signJwt,
  setJwtCookie,
  clearJwtCookie,
  getOrigin,
  getFrontendUrl,
  buildGoogleAuthUrl,
  exchangeGoogleCode,
} from "../lib/auth";

const router: IRouter = Router();

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET not set");
  return s;
}

/**
 * We encode the OAuth CSRF nonce AND the returnTo URL inside a signed JWT that
 * travels as the `state` parameter through Google's OAuth flow.
 * This removes any dependency on cookies being shared across domains, which
 * broke when the dev frontend (*.kirk.replit.dev) initiated OAuth but the
 * callback landed on the deployed backend (discipline-nexus--pearlysabel.replit.app).
 */
function buildOAuthState(nonce: string, returnTo: string): string {
  return jwt.sign({ nonce, returnTo }, getJwtSecret(), { expiresIn: "10m" });
}

function parseOAuthState(state: string): { nonce: string; returnTo: string } | null {
  try {
    const payload = jwt.verify(state, getJwtSecret()) as { nonce: string; returnTo: string };
    if (typeof payload.nonce !== "string") return null;
    return { nonce: payload.nonce, returnTo: payload.returnTo ?? "" };
  } catch {
    return null;
  }
}

async function upsertGoogleUser(googleUser: {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}) {
  const id = `google_${googleUser.sub}`;
  const userData = {
    id,
    email: googleUser.email ?? null,
    firstName: googleUser.given_name ?? null,
    lastName: googleUser.family_name ?? null,
    profileImageUrl: googleUser.picture ?? null,
  };
  const [user] = await db
    .insert(usersTable)
    .values(userData)
    .onConflictDoUpdate({
      target: usersTable.id,
      set: { ...userData, updatedAt: new Date() },
    })
    .returning();
  return user;
}

function getGoogleCallbackUrl(req: Request): string {
  return (
    process.env.GOOGLE_CALLBACK_URL ??
    `${getOrigin(req)}/api/auth/google/callback`
  );
}

// ─── Current user ──────────────────────────────────────────────────────────────

router.get("/auth/user", (req: Request, res: Response) => {
  res.json(
    GetCurrentAuthUserResponse.parse({
      user: req.isAuthenticated() ? req.user : null,
    }),
  );
});

// ─── Email / password signup ───────────────────────────────────────────────────

router.post("/auth/signup", async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body as {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase().trim()))
    .limit(1);

  if (existing.length > 0 && existing[0].passwordHash) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = `pw_${crypto.randomBytes(16).toString("hex")}`;

  const [user] = existing.length > 0
    ? await db
        .update(usersTable)
        .set({ passwordHash, updatedAt: new Date() })
        .where(eq(usersTable.email, email.toLowerCase().trim()))
        .returning()
    : await db
        .insert(usersTable)
        .values({
          id,
          email: email.toLowerCase().trim(),
          firstName: firstName?.trim() || null,
          lastName: lastName?.trim() || null,
          passwordHash,
        })
        .returning();

  const token = signJwt({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
  });

  setJwtCookie(res, token);
  res.json({ token });
});

// ─── Email / password login ────────────────────────────────────────────────────

router.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase().trim()))
    .limit(1);

  if (!user || !user.passwordHash) {
    res.status(401).json({ error: "Incorrect email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Incorrect email or password" });
    return;
  }

  const token = signJwt({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
  });

  setJwtCookie(res, token);
  res.json({ token });
});

// ─── Google OAuth ──────────────────────────────────────────────────────────────

router.get("/auth/google", (req: Request, res: Response) => {
  const returnTo = (req.query.returnTo as string | undefined) ?? getFrontendUrl(req);
  const nonce = crypto.randomBytes(16).toString("hex");

  // Encode nonce + returnTo in a signed JWT used as the OAuth `state`.
  // This removes cookie dependency — works even when the initiation domain
  // differs from the callback domain (e.g. dev frontend vs deployed backend).
  const state = buildOAuthState(nonce, returnTo);
  const callbackUrl = getGoogleCallbackUrl(req);

  res.redirect(buildGoogleAuthUrl(callbackUrl, state));
});

router.get("/auth/google/callback", async (req: Request, res: Response) => {
  const { code, state: rawState, error } = req.query as Record<string, string>;

  // Default fallback in case state can't be decoded
  const fallbackFrontend = getFrontendUrl(req);

  if (error || !code || !rawState) {
    res.redirect(`${fallbackFrontend}/?auth_error=cancelled`);
    return;
  }

  // Verify and decode the signed state JWT
  const statePayload = parseOAuthState(rawState);
  if (!statePayload) {
    res.redirect(`${fallbackFrontend}/?auth_error=state_mismatch`);
    return;
  }

  const frontendBase = statePayload.returnTo?.startsWith("http")
    ? statePayload.returnTo.replace(/\/$/, "")
    : fallbackFrontend;

  try {
    const callbackUrl = getGoogleCallbackUrl(req);
    const googleUser = await exchangeGoogleCode(code, callbackUrl);
    const dbUser = await upsertGoogleUser(googleUser);

    const token = signJwt({
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      profileImageUrl: dbUser.profileImageUrl,
    });

    setJwtCookie(res, token);
    res.redirect(`${frontendBase}/?token=${encodeURIComponent(token)}`);
  } catch (err) {
    req.log.error({ err }, "Google OAuth callback error");
    const detail = encodeURIComponent(err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200));
    res.redirect(`${frontendBase}/?auth_error=server&auth_detail=${detail}`);
  }
});

// ─── Logout ────────────────────────────────────────────────────────────────────

router.get("/logout", (_req: Request, res: Response) => {
  clearJwtCookie(res);
  res.redirect("/");
});

router.post("/logout", (_req: Request, res: Response) => {
  clearJwtCookie(res);
  res.json({ success: true });
});

export default router;
