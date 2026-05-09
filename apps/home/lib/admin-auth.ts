import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "trendkit_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 30;

type SessionPayload = {
  role: "admin";
  exp: number;
};

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "trendkit-local-dev-secret";
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "change-me-now";
}

export function createSessionToken() {
  const payload: SessionPayload = {
    role: "admin",
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token?: string) {
  if (!token) return false;
  const [body, signature] = token.split(".");
  if (!body || !signature || sign(body) !== signature) return false;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as SessionPayload;
    return payload.role === "admin" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminLoggedIn() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
}
