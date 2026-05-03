import crypto from "crypto";
import bcrypt from "bcryptjs";
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

const STATE_COOKIE = "oauth_state";
const RETURNTO_COOKIE = "oauth_returnto";
const STATE_COOKIE_TTL = 10 * 60 * 1000;

function setStateCookie(res: Response, state: string) {
  res.cookie(STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: STATE_COOKIE_TTL,
  });
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

function getGoogleCallbackUrl(req: Request): string {
  return (
    process.env.GOOGLE_CALLBACK_URL ??
    `${getOrigin(req)}/api/auth/google/callback`
  );
}

router.get("/auth/google", (req: Request, res: Response) => {
  const state = crypto.randomBytes(16).toString("hex");
  const callbackUrl = getGoogleCallbackUrl(req);
  setStateCookie(res, state);
  const returnTo = req.query.returnTo as string | undefined;
  if (returnTo) {
    res.cookie(RETURNTO_COOKIE, returnTo, {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: STATE_COOKIE_TTL,
    });
  }
  res.redirect(buildGoogleAuthUrl(callbackUrl, state));
});

router.get("/auth/google/callback", async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string>;

  const returnTo = req.cookies?.[RETURNTO_COOKIE] as string | undefined;
  res.clearCookie(RETURNTO_COOKIE, { path: "/" });

  const frontendBase = (returnTo?.startsWith("http") ? returnTo.replace(/\/$/, "") : null)
    ?? getFrontendUrl(req);

  if (error || !code) {
    res.redirect(`${frontendBase}/?auth_error=cancelled`);
    return;
  }

  const expectedState = req.cookies?.[STATE_COOKIE];
  res.clearCookie(STATE_COOKIE, { path: "/" });

  if (!expectedState || state !== expectedState) {
    res.redirect(`${frontendBase}/?auth_error=state_mismatch`);
    return;
  }

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
    res.redirect(`${frontendBase}/?auth_error=server`);
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
