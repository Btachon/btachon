import crypto from "crypto";
import { Router, type IRouter, type Request, type Response } from "express";
import { GetCurrentAuthUserResponse } from "@workspace/api-zod";
import { db, usersTable } from "@workspace/db";
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
const STATE_COOKIE_TTL = 10 * 60 * 1000; // 10 min

function setStateCookie(res: Response, state: string) {
  res.cookie(STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: STATE_COOKIE_TTL,
  });
}

async function upsertUser(googleUser: {
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

// ─── Google OAuth ──────────────────────────────────────────────────────────────

router.get("/auth/google", (req: Request, res: Response) => {
  const state = crypto.randomBytes(16).toString("hex");
  const callbackUrl = `${getOrigin(req)}/api/auth/google/callback`;
  setStateCookie(res, state);
  res.redirect(buildGoogleAuthUrl(callbackUrl, state));
});

router.get("/auth/google/callback", async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string>;

  if (error || !code) {
    res.redirect(`${getFrontendUrl(req)}/?auth_error=cancelled`);
    return;
  }

  const expectedState = req.cookies?.[STATE_COOKIE];
  res.clearCookie(STATE_COOKIE, { path: "/" });

  if (!expectedState || state !== expectedState) {
    res.redirect(`${getFrontendUrl(req)}/?auth_error=state_mismatch`);
    return;
  }

  try {
    const callbackUrl = `${getOrigin(req)}/api/auth/google/callback`;
    const googleUser = await exchangeGoogleCode(code, callbackUrl);
    const dbUser = await upsertUser(googleUser);

    const token = signJwt({
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      profileImageUrl: dbUser.profileImageUrl,
    });

    setJwtCookie(res, token);

    const frontendBase = getFrontendUrl(req);
    res.redirect(`${frontendBase}/?token=${encodeURIComponent(token)}`);
  } catch (err) {
    req.log.error({ err }, "Google OAuth callback error");
    res.redirect(`${getFrontendUrl(req)}/?auth_error=server`);
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
