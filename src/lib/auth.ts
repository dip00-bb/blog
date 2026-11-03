import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Types } from "mongoose";

const COOKIE_NAME = "inkwell_session";
function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error("JWT_SECRET must be at least 32 characters");
  return new TextEncoder().encode(value);
}
export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId }).setProtectedHeader({ alg: "HS256" })
    .setIssuedAt().setExpirationTime("7d").sign(secret());
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7
  });
}
export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.sub === "string" && Types.ObjectId.isValid(payload.sub) ? payload.sub : null;
  } catch { return null; }
}
export async function requireUser() {
  const id = await getSessionUserId();
  if (!id) throw new Error("UNAUTHORIZED");
  return id;
}
